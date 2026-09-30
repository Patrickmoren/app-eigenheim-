import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProperty, createEmptyProperty } from '../src/model/schema.js';
import { normalizeTexts, offlineTexts } from '../src/content/texts.js';
import { buildFactsheet } from '../src/layout/factsheet.js';
import { checkDocument } from '../src/layout/check.js';
import { countLines, measurePage } from '../src/layout/measure.js';
import { TYPE } from '../src/layout/design.js';
import { renderPreview } from '../src/render/html.js';
import { example, exampleTexts, maximalObject, longTexts } from './helpers.js';

const flat = (blocks) => blocks.flatMap((b) => [b, ...(b.left || []), ...(b.right || [])]);

test('Zeilenumbruch-Schätzer', () => {
  assert.equal(countLines('', TYPE.body, 300), 0);
  assert.equal(countLines('kurz', TYPE.body, 300), 1);
  assert.equal(countLines('a\nb\nc', TYPE.body, 300), 3);
  const long = 'Wort '.repeat(200);
  assert.ok(countLines(long, TYPE.body, 300) > 10);
});

test('Beispiel passt auf 2 Seiten', () => {
  const p = normalizeProperty(example());
  const m = buildFactsheet(p, normalizeTexts(exampleTexts()), p.images);
  assert.equal(m.pages.length, 2);
  assert.ok(m.pages.every((pg) => pg.fits));
  assert.deepEqual(checkDocument(m).filter((i) => i.level === 'error'), []);
});

test('Maximale Angaben mit langen Texten werden verdichtet, nie überlaufen', () => {
  const p = normalizeProperty(maximalObject());
  const m = buildFactsheet(p, normalizeTexts(longTexts()), p.images);
  for (const pg of m.pages) {
    assert.ok(pg.fits, `Seite passt nicht (Stufe ${pg.level}, ${pg.height} pt)`);
    assert.ok(pg.height <= m.capacity);
  }
  assert.ok(m.pages[0].level > 0 && m.pages[1].level > 0, 'Verdichtung muss greifen');
});

test('Verdichtung ändert keine Schriftgrössen', () => {
  const p = normalizeProperty(maximalObject());
  const a = buildFactsheet(p, normalizeTexts(exampleTexts()), p.images);
  const b = buildFactsheet(p, normalizeTexts(longTexts()), p.images);
  assert.ok(b.pages[0].level >= a.pages[0].level);
  assert.ok(TYPE.body.size >= 9 && TYPE.cell.size >= 8.5, 'Untergrenzen der Schrift');
  const html = renderPreview(b, p.images);
  const sizes = [...html.matchAll(/font-size:([\d.]+)pt/g)].map((x) => Number(x[1]));
  assert.ok(Math.min(...sizes) >= 7, 'keine Schrift unter 7 pt (Fussnoten)');
});

test('Ohne Bilder gibt es keine Bildrahmen', () => {
  const p = normalizeProperty(example({ images: false }));
  const m = buildFactsheet(p, offlineTexts(p), {});
  const types = m.pages.flatMap((pg) => flat(pg.blocks)).map((b) => b.type);
  assert.ok(!types.includes('image'));
  assert.ok(!types.includes('imageRow'));
});

test('Fehlende optionale Angaben erzeugen keine leeren Abschnitte', () => {
  const p = createEmptyProperty();
  Object.assign(p.object, { street: 'Teststrasse 1', zip: '4000', city: 'Basel', type: 'Grundstück', plotArea: 800 });
  p.units = [];
  p.contacts = [{ name: 'Test Person', role: '', phone: '', email: '' }];
  const m = buildFactsheet(p, offlineTexts(p), {});
  const blocks = m.pages.flatMap((pg) => flat(pg.blocks));
  const headings = blocks.filter((b) => b.type === 'h1').map((b) => b.text);
  assert.deepEqual(headings, ['Transaktionsübersicht', 'Facts & Figures']);
  assert.deepEqual(checkDocument(m).filter((i) => i.level === 'error'), []);
  for (const b of blocks) if (b.type === 'kv' || b.type === 'table') assert.ok(b.rows.length > 0);
});

test('Dokumentprüfung findet technische Reste', () => {
  const p = normalizeProperty(example({ images: false }));
  const t = normalizeTexts(exampleTexts());
  t.overview.einheiten = 'Die Liegenschaft umfasst undefined Wohnungen.';
  const issues = checkDocument(buildFactsheet(p, t, {}));
  assert.ok(issues.some((i) => i.level === 'error' && /Unzulässiger Inhalt/.test(i.message)));
  t.overview.einheiten = 'Fläche: [Fläche einsetzen]';
  assert.ok(checkDocument(buildFactsheet(p, t, {})).some((i) => i.level === 'error'));
});

test('Objektarten: gleiches Template für EFH, ETW, Gewerbe und Grundstück', () => {
  const cases = {
    Einfamilienhaus: [{ count: 1, kind: 'Wohnung', rooms: 5.5, area: 160 }],
    Eigentumswohnung: [{ count: 1, kind: 'Wohnung', rooms: 3.5, area: 92, floor: '2. OG' }],
    Gewerbeobjekt: [{ count: 3, kind: 'Büro', area: 240 }, { count: 1, kind: 'Lager', area: 400 }],
    Grundstück: [],
  };
  for (const [type, units] of Object.entries(cases)) {
    const p = createEmptyProperty();
    Object.assign(p.object, { street: 'Musterweg 2', zip: '4144', city: 'Arlesheim', type, plotArea: 650 });
    p.units = units;
    p.contacts = [{ name: 'Test', role: '', phone: '', email: '' }];
    const m = buildFactsheet(p, offlineTexts(p), {});
    assert.equal(m.pages.length, 2, type);
    assert.ok(m.pages.every((pg) => pg.fits), type);
    assert.deepEqual(checkDocument(m).filter((i) => i.level === 'error'), [], type);
    assert.equal(m.pages[0].blocks[0].type, 'band');
  }
});

test('Seitenhöhe wird für die Vorschau und das DOCX gleich berechnet', () => {
  const p = normalizeProperty(example());
  const m = buildFactsheet(p, normalizeTexts(exampleTexts()), p.images);
  for (const pg of m.pages) assert.equal(Math.round(measurePage(pg.blocks, pg.scale)), Math.round(pg.height));
});
