// Erzeugt Factsheet und NDA für ein Beispielobjekt ohne Oberfläche.
//
//   node scripts/beispiel.js [ordner] [--texte=datei|offline|ki] [--pdf]
//
// ordner   enthält objekt.json und optional titelbild.jpg, objektfoto.jpg, lagefoto.jpg, grundriss.jpg
// --texte  Quelle der Texte: eine JSON-Datei (Standard: texte.json im Ordner, falls vorhanden),
//          «offline» (regelbasiert) oder «ki» (konfigurierter KI-Provider, benötigt ANTHROPIC_API_KEY)
// --pdf    zusätzlich PDF über LibreOffice erzeugen (zur Sichtkontrolle)
import fs from 'node:fs';
import path from 'node:path';
import { normalizeProperty } from '../src/model/schema.js';
import { exportFactsheet, exportNda, inspect } from '../server/documents.js';
import { createProvider } from '../server/ai/providers.js';
import { renderPdf } from '../server/render-check.js';

const args = process.argv.slice(2);
const dir = path.resolve(args.find((a) => !a.startsWith('--')) || 'examples/neumattstrasse-15');
const textArg = (args.find((a) => a.startsWith('--texte=')) || '').slice(8);
const wantPdf = args.includes('--pdf');

const IMAGE_FILES = { cover: 'titelbild', object: 'objektfoto', location: 'lagefoto', floorplan: 'grundriss' };

const raw = JSON.parse(fs.readFileSync(path.join(dir, 'objekt.json'), 'utf8'));
raw.images = {};
for (const [slot, name] of Object.entries(IMAGE_FILES)) {
  for (const ext of ['jpg', 'jpeg', 'png']) {
    const f = path.join(dir, `${name}.${ext}`);
    if (fs.existsSync(f)) {
      raw.images[slot] = `data:image/${ext === 'png' ? 'png' : 'jpeg'};base64,${fs.readFileSync(f).toString('base64')}`;
      break;
    }
  }
}

let texts = null;
if (textArg === 'ki') texts = await createProvider().generate(normalizeProperty(raw));
else if (textArg && textArg !== 'offline') texts = JSON.parse(fs.readFileSync(path.resolve(textArg), 'utf8'));
else if (!textArg && fs.existsSync(path.join(dir, 'texte.json'))) texts = JSON.parse(fs.readFileSync(path.join(dir, 'texte.json'), 'utf8'));

const report = inspect(raw, texts);
const out = path.join(dir, 'ausgabe');
fs.mkdirSync(out, { recursive: true });

const fsheet = await exportFactsheet(raw, report.texts);
fs.writeFileSync(path.join(out, fsheet.fileName), fsheet.buffer);
const nda = await exportNda(raw, report.texts);
fs.writeFileSync(path.join(out, nda.fileName), nda.buffer);

console.log(`Texte:      ${report.texts.provider}`);
console.log(`Factsheet:  ${path.join(out, fsheet.fileName)}  (${fsheet.pages} Seiten, geprüft mit ${fsheet.verifiedBy})`);
fsheet.model.pages.forEach((pg, i) => console.log(`  Seite ${i + 1}: Stufe ${pg.level}, ${pg.height.toFixed(0)} / ${fsheet.model.capacity.toFixed(0)} pt`));
console.log(`NDA:        ${path.join(out, nda.fileName)}`);
for (const i of fsheet.issues) console.log(`  [${i.level}] ${i.section} – ${i.field}: ${i.message}`);

if (wantPdf) {
  for (const [name, buf] of [[fsheet.fileName, fsheet.buffer], [nda.fileName, nda.buffer]]) {
    const r = await renderPdf(buf);
    if (!r) { console.log('LibreOffice nicht gefunden – kein PDF.'); break; }
    fs.writeFileSync(path.join(out, name.replace(/\.docx$/, '.pdf')), r.pdf);
    console.log(`PDF:        ${name.replace(/\.docx$/, '.pdf')} (${r.pages} Seiten)`);
  }
}
