// HTTP-Server: liefert die Oberfläche aus und stellt die API bereit.
//
//   GET  /api/status                  KI-Anbieter, Seitenprüfung, PDF, Eingangsordner
//   GET  /api/example                 Beispielobjekt Neumattstrasse 15 (Daten, Texte, Bilder)
//   GET  /api/vorlage                 leere Excel-Erfassung
//   POST /api/texts                   Texte für alle Dokumente erstellen/verdichten { property, factor?, previous? }
//   POST /api/check                   Prüfbericht                                   { property, texts }
//   POST /api/export/<dokument>       factsheet | teaser | expose-docx | expose-pdf | nda | inserat | inserat-txt
//   POST /api/excel/import|export     Excel-Erfassung lesen / erzeugen
//
// Es werden keine Objektdaten gespeichert: Jede Anfrage enthält alle Daten, die Antwort ist das Ergebnis.
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { normalizeProperty } from '../src/model/schema.js';
import { factBase } from '../src/model/facts.js';
import { guardTexts } from '../src/content/guard.js';
import { normalizeTexts } from '../src/content/texts.js';
import { createProvider, ProviderError } from './ai/providers.js';
import * as docs from './documents.js';
import { rendererAvailable } from './render-check.js';
import { pdfAvailable } from './pdf.js';
import { buildWorkbook, readWorkbook } from '../src/excel.js';
import { readImageFolder } from './hotfolder.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';
let hotfolderBase = null; // gesetzt, wenn der Desktop-Start die Ordnerüberwachung betreibt
const MAX_BODY = 60 * 1024 * 1024;
const provider = createProvider();

const STATIC = {
  '/': 'web/index.html',
  '/vendor/docx.mjs': 'node_modules/docx/dist/index.mjs',
  '/vendor/exceljs.min.js': 'node_modules/exceljs/dist/exceljs.min.js',
};
const STATIC_DIRS = ['web', 'src', 'assets'];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.json': 'application/json',
};

// Die Import-Map in index.html ist ein Inline-Skript: per Hash erlaubt, sonst nur eigene Skripte.
function importMapHash() {
  const html = fs.readFileSync(path.join(ROOT, 'web/index.html'), 'utf8');
  const m = /<script type="importmap">([\s\S]*?)<\/script>/.exec(html);
  return m ? `'sha256-${crypto.createHash('sha256').update(m[1]).digest('base64')}'` : '';
}
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': `default-src 'self'; script-src 'self' ${importMapHash()}; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; object-src 'none'; frame-src 'self' about:; frame-ancestors 'self'`,
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
    if (size > MAX_BODY) throw Object.assign(new Error('Anfrage zu gross (max. 60 MB).'), { status: 413 });
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

const TYPES = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
  txt: 'text/plain; charset=utf-8',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

function file(res, buffer, fileName, extra = {}) {
  send(res, 200, buffer, {
    'Content-Type': TYPES[fileName.split('.').pop()] || 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${fileName.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    'Cache-Control': 'no-store',
    'Access-Control-Expose-Headers': 'X-Pages, X-Verified-By',
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

async function exampleData() {
  const dir = path.join(ROOT, 'examples', 'neumattstrasse-15');
  const property = JSON.parse(await fsp.readFile(path.join(dir, 'objekt.json'), 'utf8'));
  property.images = await readImageFolder(dir);
  const tf = path.join(dir, 'texte.json');
  const texts = fs.existsSync(tf) ? JSON.parse(await fsp.readFile(tf, 'utf8')) : null;
  return { property, texts };
}

async function exportDocument(kind, body) {
  const { property, texts } = body;
  switch (kind) {
    case 'factsheet': case 'teaser': {
      const r = kind === 'factsheet' ? await docs.exportFactsheet(property, texts) : await docs.exportTeaser(property, texts);
      return [r.buffer, r.fileName, { 'X-Pages': String(r.pages), 'X-Verified-By': encodeURIComponent(r.verifiedBy) }];
    }
    case 'expose-docx': { const r = await docs.exportExposeDocx(property, texts); return [r.buffer, r.fileName, { 'X-Pages': String(r.pages) }]; }
    case 'expose-pdf': {
      const r = await docs.exportExposePdf(property, texts);
      if (!r) throw Object.assign(new Error('Auf diesem Rechner ist kein Chrome, Edge oder Chromium für die PDF-Erzeugung vorhanden.'), { status: 501 });
      return [r.buffer, r.fileName, { 'X-Pages': String(r.pages) }];
    }
    case 'nda': { const r = await docs.exportNda(property, texts); return [r.buffer, r.fileName, {}]; }
    case 'inserat': { const r = await docs.exportInserat(property, texts); return [r.buffer, r.fileName, {}]; }
    case 'inserat-txt': { const r = await docs.exportInserat(property, texts); return [Buffer.from(r.text, 'utf8'), r.fileName.replace(/\.docx$/, '.txt'), {}]; }
    default: return null;
  }
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/status') {
    return json(res, 200, {
      provider: provider.name, providerLabel: provider.label, model: provider.model || null,
      renderer: await rendererAvailable(),
      pdf: await pdfAvailable(),
      hotfolder: hotfolderBase,
      documentTypes: Object.fromEntries(Object.entries(docs.DOCUMENT_TYPES).map(([k, v]) => [k, { label: v.label, formats: v.formats }])),
    });
  }
  if (req.method === 'GET' && pathname === '/api/example') return json(res, 200, await exampleData());
  if (req.method === 'GET' && pathname === '/api/vorlage') return file(res, Buffer.from(await buildWorkbook()), 'Vorlage_Objekterfassung.xlsx');
  if (req.method !== 'POST') return json(res, 405, { message: 'Methode nicht erlaubt.' });

  const body = await readJson(req);
  if (pathname.startsWith('/api/export/')) {
    const r = await exportDocument(pathname.slice('/api/export/'.length), body);
    if (!r) return json(res, 404, { message: 'Unbekanntes Dokument.' });
    return file(res, ...r);
  }
  switch (pathname) {
    case '/api/texts': {
      const p = normalizeProperty(body.property);
      const factor = Math.min(1, Math.max(0.4, Number(body.factor) || 1));
      const previous = body.previous ? normalizeTexts(body.previous) : null;
      try {
        const texts = await provider.generate(p, { factor, previous });
        const guard = texts.provider === 'offline' ? {} : guardTexts(texts, factBase(p), p);
        return json(res, 200, { texts, guard });
      } catch (e) {
        const msg = aiErrorMessage(e);
        if (msg) return json(res, 502, { message: msg });
        throw e;
      }
    }
    case '/api/check': {
      const { issues, guard } = docs.inspect(body.property, body.texts);
      return json(res, 200, { issues, guard });
    }
    case '/api/excel/import': {
      if (typeof body.data !== 'string') return json(res, 400, { message: 'Keine Datei übermittelt.' });
      try {
        const { property, options } = await readWorkbook(Buffer.from(body.data, 'base64'));
        return json(res, 200, { property: normalizeProperty(property), options });
      } catch (e) { return json(res, 422, { message: e.message }); }
    }
    case '/api/excel/export':
      return file(res, Buffer.from(await buildWorkbook(normalizeProperty(body.property))), 'Objekterfassung.xlsx');
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
    if (e instanceof docs.ExportError) return json(res, 422, { message: e.message, issues: e.issues });
    if (e.status) return json(res, e.status, { message: e.message });
    console.error(e);
    json(res, 500, { message: 'Interner Fehler. Details im Serverprotokoll.' });
  }
});

export { provider };

export function startServer({ port = PORT, host = HOST, hotfolder = null } = {}) {
  hotfolderBase = hotfolder;
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      const url = `http://${host}:${server.address().port}`;
      console.log(`Schaeppi Verkaufsunterlagen: ${url}  (Texte: ${provider.label}${provider.model ? ', ' + provider.model : ''})`);
      resolve({ url, server });
    });
  });
}

// Direkt gestartet (npm start): nur Server, ohne Ordnerüberwachung
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) startServer();
