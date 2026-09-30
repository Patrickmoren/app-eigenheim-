// HTTP-Server: liefert die Oberfläche aus und stellt die API bereit.
//
//   GET  /api/status             KI-Provider, Renderer, Dokumenttypen
//   GET  /api/example            Beispielobjekt Neumattstrasse 15 (Daten, Texte, Bilder)
//   POST /api/texts              KI-Inhalte erstellen / verdichten  { property, factor?, previous? }
//   POST /api/check              Prüfbericht                        { property, texts }
//   POST /api/export/factsheet   Factsheet.docx                     { property, texts }
//   POST /api/export/nda         Geheimhaltungsverpflichtung.docx   { property, texts }
//
// Es werden keine Objektdaten gespeichert: Jede Anfrage enthält alle Daten, die Antwort ist das Ergebnis.
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { normalizeProperty } from '../src/model/schema.js';
import { factBase } from '../src/model/facts.js';
import { guardTexts } from '../src/content/guard.js';
import { normalizeTexts } from '../src/content/texts.js';
import { createProvider, ProviderError } from './ai/providers.js';
import { DOCUMENT_TYPES, ExportError, exportFactsheet, exportNda, inspect } from './documents.js';
import { rendererAvailable } from './render-check.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const MAX_BODY = 40 * 1024 * 1024;
const provider = createProvider();

const STATIC = {
  '/': 'web/index.html',
};
const STATIC_DIRS = ['web', 'src', 'assets'];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.json': 'application/json',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}
const json = (res, status, obj) => send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });

async function readJson(req) {
  if (!/application\/json/.test(req.headers['content-type'] || '')) throw Object.assign(new Error('Content-Type application/json erwartet.'), { status: 415 });
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BODY) throw Object.assign(new Error('Anfrage zu gross (max. 40 MB).'), { status: 413 });
    chunks.push(c);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw Object.assign(new Error('Ungültiges JSON.'), { status: 400 }); }
}

async function serveStatic(req, res, pathname) {
  let rel = STATIC[pathname];
  if (!rel) {
    const clean = path.posix.normalize(decodeURIComponent(pathname)).replace(/^\/+/, '');
    if (!STATIC_DIRS.includes(clean.split('/')[0]) || clean.includes('..')) return false;
    rel = clean;
  }
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep)) return false;
  try {
    const data = await fsp.readFile(file);
    send(res, 200, data, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    return true;
  } catch { return false; }
}

function docx(res, result, extra = {}) {
  send(res, 200, result.buffer, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Content-Disposition': `attachment; filename="${result.fileName}"; filename*=UTF-8''${encodeURIComponent(result.fileName)}`,
    'Cache-Control': 'no-store',
    ...extra,
  });
}

function aiErrorMessage(e) {
  if (e instanceof ProviderError) return e.message;
  if (e instanceof Anthropic.AuthenticationError) return 'KI-Zugang ungültig (API-Schlüssel prüfen).';
  if (e instanceof Anthropic.RateLimitError) return 'KI vorübergehend ausgelastet. Bitte in einer Minute erneut versuchen.';
  if (e instanceof Anthropic.APIConnectionError) return 'KI nicht erreichbar (Netzwerk).';
  if (e instanceof Anthropic.APIError) return `KI-Fehler (${e.status ?? 'unbekannt'}).`;
  return null;
}

function exampleData() {
  const dir = path.join(ROOT, 'examples', 'neumattstrasse-15');
  const property = JSON.parse(fs.readFileSync(path.join(dir, 'objekt.json'), 'utf8'));
  property.images = {};
  for (const [slot, name] of Object.entries({ cover: 'titelbild', object: 'objektfoto', location: 'lagefoto', floorplan: 'grundriss' })) {
    const f = path.join(dir, `${name}.jpg`);
    if (fs.existsSync(f)) property.images[slot] = `data:image/jpeg;base64,${fs.readFileSync(f).toString('base64')}`;
  }
  const tf = path.join(dir, 'texte.json');
  const texts = fs.existsSync(tf) ? JSON.parse(fs.readFileSync(tf, 'utf8')) : null;
  return { property, texts };
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/status') {
    return json(res, 200, {
      provider: provider.name, providerLabel: provider.label, model: provider.model || null,
      renderer: await rendererAvailable(),
      documentTypes: Object.fromEntries(Object.entries(DOCUMENT_TYPES).map(([k, v]) => [k, { label: v.label, available: v.available }])),
    });
  }
  if (req.method === 'GET' && pathname === '/api/example') return json(res, 200, exampleData());
  if (req.method !== 'POST') return json(res, 405, { message: 'Methode nicht erlaubt.' });

  const body = await readJson(req);
  switch (pathname) {
    case '/api/texts': {
      const p = normalizeProperty(body.property);
      const factor = Math.min(1, Math.max(0.4, Number(body.factor) || 1));
      const previous = body.previous ? normalizeTexts(body.previous) : null;
      try {
        const texts = await provider.generate(p, { factor, previous: previous && { title: previous.title, overview: previous.overview, arguments: previous.arguments } });
        const guard = texts.provider === 'offline' ? {} : guardTexts(texts, factBase(p));
        return json(res, 200, { texts, guard });
      } catch (e) {
        const msg = aiErrorMessage(e);
        if (msg) return json(res, 502, { message: msg });
        throw e;
      }
    }
    case '/api/check': {
      const { issues, guard } = inspect(body.property, body.texts);
      return json(res, 200, { issues, guard });
    }
    case '/api/export/factsheet': {
      const r = await exportFactsheet(body.property, body.texts);
      return docx(res, r, { 'X-Pages': String(r.pages), 'X-Verified-By': encodeURIComponent(r.verifiedBy), 'Access-Control-Expose-Headers': 'X-Pages, X-Verified-By' });
    }
    case '/api/export/nda':
      return docx(res, await exportNda(body.property, body.texts));
    default:
      return json(res, 404, { message: 'Unbekannte Funktion.' });
  }
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  try {
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname);
    if (req.method === 'GET' && await serveStatic(req, res, pathname)) return;
    send(res, 404, 'Nicht gefunden', { 'Content-Type': 'text/plain; charset=utf-8' });
  } catch (e) {
    if (e instanceof ExportError) return json(res, 422, { message: e.message, issues: e.issues });
    if (e.status) return json(res, e.status, { message: e.message });
    console.error(e);
    json(res, 500, { message: 'Interner Fehler. Details im Serverprotokoll.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Schaeppi Factsheet-Generator: http://${HOST}:${PORT}  (Texte: ${provider.label}${provider.model ? ', ' + provider.model : ''})`);
});
