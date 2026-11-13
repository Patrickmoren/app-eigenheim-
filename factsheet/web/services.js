// Dienste der Oberfläche: Server- oder Browserbetrieb, Texte, Dokumente, Dateien.
//
// Mit Server (Desktop-Start oder zentraler Betrieb): Seitenprüfung mit LibreOffice, PDF über Chromium,
// KI über den Server-Schlüssel. Ohne Server (z. B. auf claude.ai): alles im Browser – Word-Dateien
// direkt, PDF über «Drucken → Als PDF speichern», KI über die Browser-Anbindung, falls vorhanden.
import * as core from '../src/documents.js';
import { loadAssets } from '../src/assets.js';
import { buildRequest, parseResponse } from '../src/content/prompt.js';
import { offlineTexts, completeTexts } from '../src/content/texts.js';
import { normalizeProperty } from '../src/model/schema.js';
import { buildWorkbook, readWorkbook } from '../src/excel.js';

export const env = {
  mode: 'browser',      // 'server' | 'browser'
  status: null,         // Serverstatus
  ai: null,             // Browser-KI: async ({ system, message, schema }) => JSON-Text
  aiLabel: '',
};

export const assetUrl = (rel) => `assets/${rel}`;

export async function init() {
  try {
    const r = await fetch('api/status', { headers: { Accept: 'application/json' } });
    if (r.ok && (r.headers.get('content-type') || '').includes('json')) {
      env.mode = 'server';
      env.status = await r.json();
    }
  } catch { /* kein Server: Browserbetrieb */ }
  await loadAssets(async (rel) => new Uint8Array(await (await fetch(assetUrl(rel))).arrayBuffer()));
}

export function textsLabel() {
  if (env.mode === 'server') return env.status.provider === 'offline' ? 'regelbasiert (ohne KI)' : `KI · ${env.status.model || env.status.providerLabel}`;
  return env.ai ? `KI · ${env.aiLabel}` : 'regelbasiert (ohne KI)';
}

export const aiAvailable = () => (env.mode === 'server' ? env.status.provider !== 'offline' : !!env.ai);

async function post(path, body, { binary = false } = {}) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) {
    let msg = `Fehler ${res.status}`, issues = [];
    try { const j = await res.json(); msg = j.message || msg; issues = j.issues || []; } catch { /* ohne Details */ }
    throw Object.assign(new Error(msg), { issues });
  }
  return binary ? res : res.json();
}

// Texte für alle Dokumente erzeugen (factor < 1 = verdichten)
export async function generateTexts(property, { factor = 1, previous = null } = {}) {
  if (env.mode === 'server') return (await post('api/texts', { property, factor, previous })).texts;
  const p = normalizeProperty(property);
  if (!env.ai) return offlineTexts(p);
  const req = buildRequest(p, { factor, previous });
  const t = parseResponse(await env.ai(req), 'browser-ki');
  const done = completeTexts(t, p);
  done.provider = 'browser-ki';
  done.generatedAt = t.generatedAt;
  return done;
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

async function serverFile(kind, property, texts) {
  const res = await post(`api/export/${kind}`, { property, texts }, { binary: true });
  const cd = res.headers.get('Content-Disposition') || '';
  const name = decodeURIComponent((/filename\*=UTF-8''([^;]+)/.exec(cd) || [])[1] || `${kind}`);
  saveBlob(await res.blob(), name);
  return { fileName: name, pages: Number(res.headers.get('X-Pages')) || null, verifiedBy: decodeURIComponent(res.headers.get('X-Verified-By') || '') };
}

// Druck der Verkaufsdokumentation im Browser (Ziel «Als PDF speichern»)
function printHtml(html) {
  return new Promise((resolve) => {
    const frame = Object.assign(document.createElement('iframe'), { title: 'Druckansicht' });
    Object.assign(frame.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' });
    frame.srcdoc = html.replace('<head>', `<head><base href="${document.baseURI}">`);
    frame.onload = async () => {
      try { await frame.contentDocument.fonts.ready; } catch { /* Schrift lädt nach */ }
      setTimeout(() => { frame.contentWindow.focus(); frame.contentWindow.print(); resolve(); setTimeout(() => frame.remove(), 60000); }, 300);
    };
    document.body.appendChild(frame);
  });
}

// Erzeugt und speichert ein Dokument. kind: factsheet | teaser | expose-docx | expose-pdf | nda | inserat | inserat-txt
export async function exportDocument(kind, property, texts) {
  if (env.mode === 'server') {
    if (kind === 'expose-pdf' && !env.status.pdf) return printExpose(property, texts);
    return serverFile(kind, property, texts);
  }
  let r;
  switch (kind) {
    case 'factsheet': r = await core.exportFactsheet(property, texts); break;
    case 'teaser': r = await core.exportTeaser(property, texts); break;
    case 'expose-docx': r = await core.exportExposeDocx(property, texts); break;
    case 'nda': r = await core.exportNda(property, texts); break;
    case 'inserat': r = await core.exportInserat(property, texts); break;
    case 'inserat-txt': {
      const x = await core.exportInserat(property, texts);
      saveBlob(new Blob([x.text], { type: 'text/plain;charset=utf-8' }), x.fileName.replace(/\.docx$/, '.txt'));
      return { fileName: x.fileName.replace(/\.docx$/, '.txt') };
    }
    case 'expose-pdf': return printExpose(property, texts);
    default: throw new Error(`Unbekanntes Dokument: ${kind}`);
  }
  saveBlob(new Blob([r.buffer], { type: DOCX }), r.fileName);
  return { fileName: r.fileName, pages: r.pages, verifiedBy: r.verifiedBy };
}

async function printExpose(property, texts) {
  const d = core.exposeDocument(property, texts, { assetUrl, fontUrl: assetUrl('fonts/IBMPlexSans-Regular.ttf') });
  await printHtml(d.html);
  return { fileName: d.fileName, pages: d.pages, printed: true };
}

export function downloadJson(data, name) {
  saveBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), name);
}

export async function downloadExcel(property, name) {
  saveBlob(new Blob([await buildWorkbook(property)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), name);
}

export async function importExcel(file) {
  return readWorkbook(new Uint8Array(await file.arrayBuffer()));
}

export { core };
