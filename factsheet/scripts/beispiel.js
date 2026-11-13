// Erzeugt alle Dokumente für ein Beispielobjekt ohne Oberfläche.
//
//   node scripts/beispiel.js [ordner] [--texte=datei|offline|ki] [--pdf]
//
// ordner   enthält objekt.json und optional titelbild.jpg, objektfoto.jpg, lagefoto.jpg, grundriss.jpg,
//          portrait.jpg sowie weitere Bilder im Unterordner galerie/ (Dateiname = Bildlegende;
//          «grundriss …» = Grundriss, «innen …» = Innenaufnahme, «umgebung …» = Umgebung, sonst Aussen)
// --texte  Quelle der Texte: eine JSON-Datei (Standard: texte.json im Ordner, falls vorhanden),
//          «offline» (regelbasiert) oder «ki» (konfigurierter KI-Provider, benötigt ANTHROPIC_API_KEY)
// --pdf    zusätzlich PDF-Kontrollansichten der Word-Dateien über LibreOffice
import fs from 'node:fs';
import path from 'node:path';
import { normalizeProperty } from '../src/model/schema.js';
import { readImageFolder } from '../server/hotfolder.js';
import * as docs from '../server/documents.js';
import { createProvider } from '../server/ai/providers.js';
import { renderPdf } from '../server/render-check.js';
import { closePdf } from '../server/pdf.js';

const args = process.argv.slice(2);
const dir = path.resolve(args.find((a) => !a.startsWith('--')) || 'examples/neumattstrasse-15');
const textArg = (args.find((a) => a.startsWith('--texte=')) || '').slice(8);
const wantPdf = args.includes('--pdf');

const raw = JSON.parse(fs.readFileSync(path.join(dir, 'objekt.json'), 'utf8'));
raw.images = await readImageFolder(dir);

let texts = null;
if (textArg === 'ki') texts = await createProvider().generate(normalizeProperty(raw));
else if (textArg && textArg !== 'offline') texts = JSON.parse(fs.readFileSync(path.resolve(textArg), 'utf8'));
else if (!textArg && fs.existsSync(path.join(dir, 'texte.json'))) texts = JSON.parse(fs.readFileSync(path.join(dir, 'texte.json'), 'utf8'));

const out = path.join(dir, 'ausgabe');
fs.mkdirSync(out, { recursive: true });
const report = docs.inspect(raw, texts);
console.log(`Texte: ${report.texts.provider}`);

const results = [
  ['Factsheet', await docs.exportFactsheet(raw, texts)],
  ['Teaser', await docs.exportTeaser(raw, texts)],
  ['Verkaufsdokumentation (Word)', await docs.exportExposeDocx(raw, texts)],
  ['Geheimhaltungsverpflichtung', await docs.exportNda(raw, texts)],
  ['Inserat', await docs.exportInserat(raw, texts)],
];
const exposePdf = await docs.exportExposePdf(raw, texts);
await closePdf();

for (const [label, r] of results) {
  fs.writeFileSync(path.join(out, r.fileName), r.buffer);
  console.log(`${label.padEnd(30)} ${r.fileName}${r.pages ? `  (${r.pages} Seite${r.pages === 1 ? "" : "n"}${r.verifiedBy ? `, geprüft: ${r.verifiedBy}` : ''})` : ''}`);
  if (r.text) fs.writeFileSync(path.join(out, r.fileName.replace(/\.docx$/, '.txt')), r.text);
  for (const n of r.notes || []) console.log(`  Hinweis: ${n}`);
}
if (exposePdf) {
  fs.writeFileSync(path.join(out, exposePdf.fileName), exposePdf.buffer);
  console.log(`${'Verkaufsdokumentation (PDF)'.padEnd(30)} ${exposePdf.fileName}  (${exposePdf.pages} Seiten)`);
} else console.log('Verkaufsdokumentation (PDF): kein Chromium/Edge/Chrome gefunden – nur Word-Fassung.');
for (const i of results[0][1].issues) console.log(`  [${i.level}] ${i.section} – ${i.field}: ${i.message}`);

if (wantPdf) {
  for (const [, r] of results) {
    const pdf = await renderPdf(r.buffer);
    if (!pdf) { console.log('LibreOffice nicht gefunden – keine Kontroll-PDFs.'); break; }
    const name = r.fileName.replace(/\.docx$/, r.fileName.startsWith('Verkaufsdokumentation') ? '_Word.pdf' : '.pdf');
    fs.writeFileSync(path.join(out, name), pdf.pdf);
  }
}
