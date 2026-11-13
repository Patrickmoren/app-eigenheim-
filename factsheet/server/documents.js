// Server-Anbindung der Dokumenterzeugung: Gestaltungsdateien vom Dateisystem, Seitenprüfung mit
// LibreOffice, PDF über Chromium, Rückgabe als Node-Buffer. Die Logik liegt im Kern (src/documents.js).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAssets } from '../src/assets.js';
import * as core from '../src/documents.js';
import { renderPdf } from './render-check.js';
import { htmlToPdf } from './pdf.js';

const ASSETS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets');
export const ready = loadAssets((rel) => fs.readFile(path.join(ASSETS, rel)));

export const { DOCUMENT_TYPES, ExportError, inspect, fileName } = core;

const toBuffer = (r) => ({ ...r, buffer: Buffer.from(r.buffer) });
const verifier = (on) => (on ? (bytes) => renderPdf(Buffer.from(bytes)) : null);

export async function exportFactsheet(raw, texts, { verify = true } = {}) {
  await ready;
  return toBuffer(await core.exportFactsheet(raw, texts, { verify: verifier(verify) }));
}

export async function exportTeaser(raw, texts, { verify = true } = {}) {
  await ready;
  return toBuffer(await core.exportTeaser(raw, texts, { verify: verifier(verify) }));
}

export async function exportNda(raw, texts) {
  await ready;
  return toBuffer(await core.exportNda(raw, texts));
}

export async function exportExposeDocx(raw, texts) {
  await ready;
  return toBuffer(await core.exportExposeDocx(raw, texts));
}

export async function exportInserat(raw, texts) {
  await ready;
  return toBuffer(await core.exportInserat(raw, texts));
}

// Verkaufsdokumentation als PDF; null, wenn auf diesem Rechner kein Chromium/Edge/Chrome vorhanden ist.
const dataUrl = async (rel, mime) => `data:${mime};base64,${(await fs.readFile(path.join(ASSETS, rel))).toString('base64')}`;
export async function exportExposePdf(raw, texts) {
  await ready;
  const assets = {};
  for (const f of ['logo/schaeppi-1zeilig-weiss.png', 'logo/schaeppi-2zeilig-weiss.png', 'logo/schaeppi-2zeilig-blau.png']) assets[f] = await dataUrl(f, 'image/png');
  const doc = core.exposeDocument(raw, texts, { assetUrl: (f) => assets[f], fontUrl: await dataUrl('fonts/IBMPlexSans-Regular.ttf', 'font/ttf') });
  const pdf = await htmlToPdf(doc.html);
  return pdf ? { ...doc, buffer: Buffer.from(pdf) } : null;
}

export async function exportDossier(raw, texts, opts) {
  await ready;
  return toBuffer(await core.exportDossier(raw, texts, opts));
}
