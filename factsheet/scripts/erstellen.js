// Erzeugt alle Verkaufsunterlagen eines Objektordners – der Standardweg, wenn Unterlagen in der
// Claude-Sitzung aufbereitet werden (siehe CLAUDE.md im Repository).
//
//   node scripts/erstellen.js <ordner> [--texte=datei|offline|ki] [--pdf] [--nur=factsheet,expose,...]
//
// <ordner>     objekt.json (Pflicht), texte.json und quellen.json (optional), Bilder:
//              titelbild/objektfoto/lagefoto/grundriss/portrait.jpg und weitere in galerie/
// --texte      Textquelle: Datei, «offline» (regelbasiert) oder «ki» (API-Schlüssel nötig);
//              Standard: texte.json im Ordner, sonst regelbasiert
// --pdf        zusätzlich PDF-Kontrollansichten aller Word-Dateien (LibreOffice) in ausgabe/kontrolle/
// --nur        nur bestimmte Dokumente: factsheet, expose, dossier, teaser, nda, inserat
//
// Ergebnis: <ordner>/ausgabe/ mit allen Dokumenten und Pruefbericht.txt
import fs from 'node:fs';
import path from 'node:path';
import { normalizeProperty } from '../src/model/schema.js';
import { bankGaps } from '../src/model/facts.js';
import { documentChecklist } from '../src/model/checklist.js';
import { readImageFolder } from '../server/hotfolder.js';
import * as docs from '../server/documents.js';
import { createProvider } from '../server/ai/providers.js';
import { renderPdf } from '../server/render-check.js';
import { closePdf } from '../server/pdf.js';

const args = process.argv.slice(2);
const dir = path.resolve(args.find((a) => !a.startsWith('--')) || 'examples/neumattstrasse-15');
const opt = (name) => (args.find((a) => a.startsWith(`--${name}=`)) || '').split('=').slice(1).join('=');
const wantPdf = args.includes('--pdf');
const only = opt('nur') ? new Set(opt('nur').split(',')) : null;
const want = (k) => !only || only.has(k);

const readJson = (f) => (fs.existsSync(path.join(dir, f)) ? JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) : null);
const raw = readJson('objekt.json');
if (!raw) { console.error(`objekt.json fehlt in ${dir}`); process.exit(1); }
raw.images = await readImageFolder(dir);
const sources = readJson('quellen.json');

let texts = null;
const textArg = opt('texte');
if (textArg === 'ki') texts = await createProvider().generate(normalizeProperty(raw));
else if (textArg && textArg !== 'offline') texts = JSON.parse(fs.readFileSync(path.resolve(textArg), 'utf8'));
else if (!textArg) texts = readJson('texte.json');

const out = path.join(dir, 'ausgabe');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const report = docs.inspect(raw, texts);
const p = report.p;

const results = [];
const failed = [];
const run = async (key, label, fn) => {
  if (!want(key)) return;
  try { const r = await fn(); if (r) results.push({ label, ...r }); } catch (e) { failed.push({ label, error: e }); }
};
await run('factsheet', 'Factsheet', () => docs.exportFactsheet(raw, texts));
await run('expose', 'Verkaufsdokumentation (PDF)', () => docs.exportExposePdf(raw, texts));
await run('expose', 'Verkaufsdokumentation (Word)', () => docs.exportExposeDocx(raw, texts));
await run('dossier', 'Finanzierungsdossier', () => docs.exportDossier(raw, texts, { sources }));
await run('teaser', 'Anonymer Teaser', () => docs.exportTeaser(raw, texts));
await run('nda', 'Geheimhaltungsverpflichtung', () => docs.exportNda(raw, texts));
await run('inserat', 'Inserat', async () => {
  const r = await docs.exportInserat(raw, texts);
  fs.writeFileSync(path.join(out, r.fileName.replace(/\.docx$/, '.txt')), r.text);
  return r;
});
await closePdf();

for (const r of results) fs.writeFileSync(path.join(out, r.fileName), r.buffer);

// Prüfbericht
const L = [];
const addr = [p.object.street, [p.object.zip, p.object.city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
L.push('PRÜFBERICHT VERKAUFSUNTERLAGEN', `Objekt:    ${addr}`, `Erstellt:  ${new Date().toLocaleString('de-CH')}`, `Texte:     ${report.texts.provider || 'regelbasiert'}`, '');
L.push('DOKUMENTE');
for (const r of results) L.push(`  ✓ ${r.fileName}${r.pages ? `  (${r.pages} Seite${r.pages === 1 ? '' : 'n'}${r.verifiedBy ? `, geprüft: ${r.verifiedBy}` : ''})` : ''}`);
for (const f of failed) {
  L.push(`  ✗ ${f.label}: ${f.error.message}`);
  for (const i of (f.error.issues || []).filter((x) => x.level === 'error')) L.push(`      - ${i.section}${i.field ? ' · ' + i.field : ''}: ${i.message}`);
}
const gaps = bankGaps(p);
const missingDocs = documentChecklist(p).filter((c) => c.status === 'fehlt' || c.status === 'angefordert');
if (gaps.length || missingDocs.length) {
  L.push('', 'FÜR DIE BANK NOCH OFFEN');
  if (gaps.length) L.push(`  Angaben: ${gaps.join(', ')}`);
  for (const c of missingDocs) L.push(`  Unterlage ${c.status}: ${c.name}${c.note ? ` (${c.note})` : ''}`);
}
const warn = report.issues.filter((i) => i.level !== 'info');
if (warn.length) {
  L.push('', 'PRÜFHINWEISE');
  for (const i of warn) L.push(`  [${i.level === 'error' ? 'Fehler' : 'Prüfen'}] ${i.section}${i.field ? ' · ' + i.field : ''}: ${i.message}`);
}
const notes = [...new Set(results.flatMap((r) => [...(r.notes || []).filter((n) => !n.startsWith('Für die Bank')), ...((r.issues || []).filter((i) => i.level === 'info').map((i) => `${r.label}: ${i.message}`))]))];
if (notes.length) { L.push('', 'HINWEISE ZUR GESTALTUNG'); for (const n of notes) L.push(`  - ${n}`); }
fs.writeFileSync(path.join(out, 'Pruefbericht.txt'), L.join('\n') + '\n');
console.log(L.join('\n'));

if (wantPdf) {
  const ctl = path.join(out, 'kontrolle');
  fs.mkdirSync(ctl, { recursive: true });
  for (const r of results.filter((x) => x.fileName.endsWith('.docx'))) {
    const pdf = await renderPdf(r.buffer);
    if (!pdf) { console.log('LibreOffice nicht gefunden – keine Kontroll-PDFs.'); break; }
    fs.writeFileSync(path.join(ctl, r.fileName.replace(/\.docx$/, '.pdf')), pdf.pdf);
  }
}
process.exit(failed.length ? 2 : 0);
