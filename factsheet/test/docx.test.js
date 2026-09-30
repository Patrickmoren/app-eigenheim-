// Ende-zu-Ende: DOCX erzeugen und – falls LibreOffice installiert ist – die echte Seitenzahl prüfen.
import test from 'node:test';
import assert from 'node:assert/strict';
import { inflateRawSync } from 'node:zlib';
import { exportFactsheet, exportNda, ExportError } from '../server/documents.js';
import { renderPdf, rendererAvailable } from '../server/render-check.js';
import { imageInfo, coverCrop } from '../server/images.js';
import { example, exampleTexts, maximalObject, longTexts } from './helpers.js';

// Minimaler ZIP-Leser für einen Eintrag (DOCX = ZIP)
function readZipEntry(buf, name) {
  let i = 0;
  while ((i = buf.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), i)) !== -1) {
    const method = buf.readUInt16LE(i + 8);
    const csize = buf.readUInt32LE(i + 18);
    const nlen = buf.readUInt16LE(i + 26);
    const xlen = buf.readUInt16LE(i + 28);
    const fname = buf.slice(i + 30, i + 30 + nlen).toString();
    const start = i + 30 + nlen + xlen;
    if (fname === name) {
      const data = buf.slice(start, start + csize);
      return (method === 8 ? inflateRawSync(data) : data).toString('utf8');
    }
    i = start;
  }
  return null;
}

const hasRenderer = await rendererAvailable();

test('Factsheet-DOCX ist gültig, bearbeitbar und ohne technische Reste', async () => {
  const r = await exportFactsheet(example(), exampleTexts(), { verify: false });
  const xml = readZipEntry(r.buffer, 'word/document.xml');
  assert.ok(xml, 'word/document.xml vorhanden');
  for (const bad of ['undefined', 'NaN', '[object', '{{']) assert.ok(!xml.includes(bad), bad);
  assert.match(xml, /Zweifamilienhaus in Büsserach/);
  assert.match(xml, /Facts &amp; Figures/);
  assert.match(xml, /w:tbl>/, 'echte Word-Tabellen');
  assert.match(xml, /w:pageBreakBefore/);
  assert.match(xml, /a:srcRect/, 'Bilder werden zugeschnitten statt verzerrt');
  assert.ok(readZipEntry(r.buffer, 'word/fontTable.xml').includes('IBM Plex Sans'));
  assert.equal(r.fileName, 'Factsheet_Neumattstrasse-15-Busserach.docx');
});

test('Export wird bei Fehlern verweigert', async () => {
  const p = example({ images: false });
  p.object.street = '';
  await assert.rejects(exportFactsheet(p, exampleTexts(), { verify: false }), (e) => e instanceof ExportError && e.issues.some((i) => i.field === 'Strasse / Nr.'));
});

test('Beschädigte Bilder werden abgewiesen', async () => {
  const p = example({ images: false });
  p.images.cover = 'data:image/jpeg;base64,AAAAAAAA';
  await assert.rejects(exportFactsheet(p, exampleTexts(), { verify: false }), /Bilder/);
});

test('Bildmasse und Zuschnitt', () => {
  const png = Buffer.alloc(33);
  png.writeUInt32BE(0x89504e47, 0);
  png.writeUInt32BE(400, 16);
  png.writeUInt32BE(100, 20);
  assert.deepEqual(imageInfo(png), { type: 'png', width: 400, height: 100 });
  const c = coverCrop(400, 100, 200, 100); // 4:1 in 2:1-Rahmen -> links/rechts je 25 %
  assert.equal(Math.round(c.left), 25);
  assert.equal(c.top, 0);
  assert.equal(coverCrop(200, 100, 200, 100), undefined);
});

test('NDA übernimmt Objekt und Interessent aus den Eingaben', async () => {
  const p = example({ images: false });
  p.nda = { company: 'Muster Immobilien AG', address: 'Musterweg 1, 8000 Zürich', representative: 'Max Muster', place: 'Basel', date: '30.09.2026', durationYears: 3 };
  const r = await exportNda(p, exampleTexts());
  const xml = readZipEntry(r.buffer, 'word/document.xml');
  for (const s of ['Geheimhaltungsverpflichtung', 'Muster Immobilien AG', 'Max Muster', 'Neumattstrasse 15, 4227 Büsserach', 'Zweifamilienhaus in Büsserach', '3 Jahren', 'Gerichtsstand ist Basel', 'schweizerischem Recht', 'Basel, 30.09.2026']) {
    assert.ok(xml.includes(s), s);
  }
  assert.ok(!xml.includes('{{'));
});

test('NDA mit leeren Feldern enthält Ausfülllinien statt Platzhalter', async () => {
  const r = await exportNda(example({ images: false }), null);
  const xml = readZipEntry(r.buffer, 'word/document.xml');
  assert.ok(xml.includes('____________________'));
  assert.ok(!xml.includes('{{'));
});

test('LibreOffice bestätigt 2 Seiten für das Beispiel', { skip: !hasRenderer && 'LibreOffice nicht installiert' }, async () => {
  const r = await exportFactsheet(example(), exampleTexts());
  assert.equal(r.verifiedBy, 'LibreOffice');
  assert.equal(r.pages, 2);
});

test('LibreOffice bestätigt 2 Seiten im Belastungstest', { skip: !hasRenderer && 'LibreOffice nicht installiert' }, async () => {
  const r = await exportFactsheet(maximalObject(), longTexts());
  const pdf = await renderPdf(r.buffer);
  assert.ok(pdf.pages <= 2, `${pdf.pages} Seiten`);
});
