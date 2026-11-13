// Verkaufsdokumentation, anonymer Teaser und Inserat
import test from 'node:test';
import assert from 'node:assert/strict';
import { inflateRawSync } from 'node:zlib';
import { normalizeProperty, createEmptyProperty } from '../src/model/schema.js';
import { normalizeTexts, offlineTexts, completeTexts } from '../src/content/texts.js';
import { buildExpose, fitText } from '../src/expose/build.js';
import { renderExposeDocument } from '../src/expose/html.js';
import { EXPOSE } from '../src/layout/design.js';
import * as docs from '../server/documents.js';
import { renderPdf, rendererAvailable } from '../server/render-check.js';
import { pdfAvailable, closePdf } from '../server/pdf.js';
import { example, exampleTexts, maximalObject, longTexts } from './helpers.js';

function zipEntry(buf, name) {
  let i = 0;
  while ((i = buf.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), i)) !== -1) {
    const method = buf.readUInt16LE(i + 8), csize = buf.readUInt32LE(i + 18), nlen = buf.readUInt16LE(i + 26), xlen = buf.readUInt16LE(i + 28);
    const fname = buf.slice(i + 30, i + 30 + nlen).toString();
    const start = i + 30 + nlen + xlen;
    if (fname === name) { const d = buf.slice(start, start + csize); return (method === 8 ? inflateRawSync(d) : d).toString('utf8'); }
    i = start;
  }
  return null;
}
const hasLO = await rendererAvailable();
const hasPdf = await pdfAvailable();
test.after(() => closePdf());

test('Verkaufsdokumentation: Seitenfolge aus Daten und Bildern', () => {
  const p = normalizeProperty(example());
  const m = buildExpose(p, normalizeTexts(exampleTexts()), p.images);
  assert.deepEqual(m.pages.map((x) => x.type), ['cover', 'facts', 'text', 'text', 'text', 'unit', 'unit', 'floorplan', 'numbers', 'contact', 'back']);
  assert.equal(m.pages.find((x) => x.type === 'floorplan').caption, 'Erdgeschoss');
  assert.equal(m.pages.find((x) => x.key === 'expose.lage').tagline, 'Wurzeln. Wachsen. Wohlfühlen.');
  // kein Bild doppelt (ausser Deckblatt als Rückfall auf der Kontaktseite)
  const srcs = m.pages.filter((x) => x.type !== 'contact').map((x) => x.image && x.image.src).filter(Boolean);
  assert.equal(new Set(srcs).size, srcs.length);
});

test('Verkaufsdokumentation: ohne Angaben entfallen Seiten statt leer zu bleiben', () => {
  const p = createEmptyProperty();
  Object.assign(p.object, { street: 'Musterweg 2', zip: '4144', city: 'Arlesheim', type: 'Grundstück', plotArea: 650 });
  p.units = [];
  p.contacts = [{ name: 'Test', role: '', phone: '', email: '' }];
  const m = buildExpose(p, offlineTexts(p), {});
  assert.deepEqual(m.pages.map((x) => x.type), ['cover', 'facts', 'text', 'contact', 'back']);
  const html = renderExposeDocument(m, { assetUrl: (f) => f, fontUrl: 'x.ttf' });
  for (const bad of ['undefined', 'null', 'NaN', '[object']) assert.ok(!html.includes(bad), bad);
});

test('Verkaufsdokumentation: zu lange Texte werden an Satzgrenzen gekürzt', () => {
  const long = 'Ein Satz mit gewöhnlicher Länge und sachlichem Inhalt. '.repeat(80).trim();
  const r = fitText(long, EXPOSE.type.body, 330, 200);
  assert.ok(r.trimmed);
  assert.ok(r.text.endsWith('.'));
  assert.ok(r.text.length < long.length);
  const p = normalizeProperty(maximalObject());
  const m = buildExpose(p, completeTexts({ ...longTexts(), expose: { objekt: long, region: long, lage: long, units: [] } }, p), p.images);
  assert.ok(m.notes.some((n) => /gekürzt/.test(n)));
});

test('Teaser: keine Strasse, keine PLZ, keine Parzelle im Dokument', async () => {
  const raw = example();
  raw.land.parcels = [{ number: '1904', area: 490 }];
  const r = await docs.exportTeaser(raw, exampleTexts(), { verify: false });
  const xml = zipEntry(r.buffer, 'word/document.xml');
  for (const s of ['Neumattstrasse', '4227', '1904']) assert.ok(!xml.includes(s), s);
  assert.match(xml, /Region Schwarzbubenland/);
  assert.equal(r.fileName, 'Teaser_Region-Schwarzbubenland-SO.docx');
});

test('Teaser: Adresse im Teasertext verhindert den Export', async () => {
  const t = exampleTexts();
  t.teaser.text = 'Liegenschaft an der Neumattstrasse in 4227 Büsserach.';
  await assert.rejects(docs.exportTeaser(example({ images: false }), t, { verify: false }), (e) => e.issues.some((i) => /Strasse/.test(i.message)));
  // Factsheet ist davon nicht betroffen
  await docs.exportFactsheet(example({ images: false }), t, { verify: false });
});

test('Inserat: Text enthält Titel, Beschrieb, Eckdaten und Kontakt', async () => {
  const r = await docs.exportInserat(example({ images: false }), exampleTexts());
  assert.match(r.text, /^Zweifamilienhaus mit zwei 4\.5-Zimmer-Wohnungen in Büsserach/);
  assert.match(r.text, /Verkaufsrichtpreis: CHF 995’000/);
  assert.match(r.text, /Kontakt: Patrick Moren/);
  assert.ok(zipEntry(r.buffer, 'word/document.xml').includes('Inserat für Immobilienportale'));
});

test('Verkaufsdokumentation als Word: Seitenzahl wie im Modell', { skip: !hasLO && 'LibreOffice nicht installiert' }, async () => {
  const r = await docs.exportExposeDocx(example(), exampleTexts());
  const pdf = await renderPdf(r.buffer);
  assert.equal(pdf.pages, r.model.pages.length);
});

test('Verkaufsdokumentation als PDF: A4 quer, alle Seiten', { skip: !hasPdf && 'kein Chromium' }, async () => {
  const r = await docs.exportExposePdf(example(), exampleTexts());
  const s = r.buffer.toString('latin1');
  assert.equal((s.match(/\/Type\s*\/Page(?![s\w])/g) || []).length, r.pages);
  assert.match(s, /\/MediaBox \[0 0 841\.9\d* 59[45]\.\d+\]/);
});

test('Teaser bleibt auch im Belastungstest bei einer Seite', { skip: !hasLO && 'LibreOffice nicht installiert' }, async () => {
  const r = await docs.exportTeaser(maximalObject(), completeTexts(longTexts(), normalizeProperty(maximalObject())));
  assert.equal(r.pages, 1);
});

test('Finanzierungsdossier: Mieterspiegel, berechnete Kennzahlen, Checkliste, Quellen', async () => {
  const raw = example({ images: false });
  Object.assign(raw.units[0], { status: 'vermietet', rent: 1850, ancillary: 180, leaseStart: '01.04.2021' });
  Object.assign(raw.units[1], { status: 'vermietet', rent: 1700, ancillary: 170 });
  raw.finance.insuranceValue = 1150000;
  raw.land.buildingRight = 'Baurecht bis 2085';
  raw.documents = [{ name: 'Grundbuchauszug vom 12.02.2026', status: 'vorhanden', date: '02.2026', note: '' }];
  const r = await docs.exportDossier(raw, null, { sources: { Grundstücksfläche: 'Grundbuchauszug vom 12.02.2026' } });
  const xml = zipEntry(r.buffer, 'word/document.xml');
  for (const s of ['Finanzierungsdossier', 'Mieterspiegel', 'CHF 3’550', 'CHF 42’600', 'Bruttorendite IST', '4.28 %', 'Kennzahlen (berechnet)', 'Grundbuchauszug', 'vorhanden', 'Baurechtsvertrag', 'Quellen der Angaben']) assert.ok(xml.includes(s), s);
  assert.ok(!xml.includes('Stockwerkeigentum: Begründungsakt'), 'STWE-Unterlagen nur bei Stockwerkeigentum');
  assert.ok(r.gaps.includes('Baujahr'));
  for (const bad of ['undefined', 'NaN', '[object']) assert.ok(!xml.includes(bad), bad);
});

test('Finanzierungsdossier: leere Einheit zählt nicht zum IST-Ertrag', async () => {
  const { rentRoll, unitTotals } = await import('../src/model/facts.js');
  const p = normalizeProperty(example({ images: false }));
  Object.assign(p.units[0], { status: 'vermietet', rent: 1850 });
  Object.assign(p.units[1], { status: 'leer', rent: 1700 });
  assert.equal(unitTotals(p).rentMonthly, 1850);
  assert.equal(rentRoll(p).totals.netYearly, 22200);
});
