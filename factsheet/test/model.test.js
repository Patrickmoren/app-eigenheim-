import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProperty, toNumber, createEmptyProperty } from '../src/model/schema.js';
import { validateProperty, hasErrors } from '../src/model/validate.js';
import { factRows, financeRows, unitLines, keyFigures, factBase, grossYield } from '../src/model/facts.js';
import { fmtChf, fmtArea } from '../src/model/format.js';
import { example, maximalObject } from './helpers.js';

test('Schweizer Zahlenschreibweisen werden gelesen', () => {
  assert.equal(toNumber("42'600"), 42600);
  assert.equal(toNumber('CHF 995’000.–'), 995000);
  assert.equal(toNumber('4,5'), 4.5);
  assert.equal(toNumber('490 m²'), 490);
  assert.equal(toNumber('abc'), null);
  assert.equal(toNumber(''), null);
  assert.equal(fmtChf(995000), 'CHF 995’000');
  assert.equal(fmtArea(1180), '1’180 m²');
});

test('Normalisierung verwirft Fremdfelder und fremde Bildformate', () => {
  const p = normalizeProperty({ object: { street: 'X', hacker: '<script>' }, images: { cover: 'javascript:alert(1)', object: 'data:image/png;base64,AAAA' } });
  assert.equal(p.object.street, 'X');
  assert.equal(p.object.hacker, undefined);
  assert.equal(p.images.cover, undefined);
  assert.equal(p.images.object, 'data:image/png;base64,AAAA');
  assert.equal(p.units.length, 1);
});

test('Beispiel Neumattstrasse 15 ist fehlerfrei', () => {
  const issues = validateProperty(normalizeProperty(example({ images: false })));
  assert.deepEqual(issues.filter((i) => i.level === 'error'), []);
});

test('Leeres Objekt meldet die Pflichtangaben', () => {
  const issues = validateProperty(createEmptyProperty());
  assert.ok(hasErrors(issues));
  const fields = issues.map((i) => i.field).join('|');
  for (const f of ['Strasse / Nr.', 'PLZ', 'Ort', 'Objektart', 'Grundstücksfläche', 'Name']) assert.match(fields, new RegExp(f.replace(/[./]/g, '\\$&')));
});

test('Widersprüche werden erkannt', () => {
  const p = normalizeProperty(maximalObject());
  p.object.livingArea = 500;          // Summe der Wohnungen: 4×58 + 6×78 + 4×96 = 1084
  p.finance.rentActual = 400000;      // über SOLL
  p.object.yearBuilt = 2015;          // Investitionen ab 2012 liegen davor
  p.land.parcels[0].share = '1200/1000';
  const msgs = validateProperty(p).map((i) => i.message).join('\n');
  assert.match(msgs, /Summe der Wohnungsflächen/);
  assert.match(msgs, /IST-Mietertrag .* liegt über dem SOLL/);
  assert.match(msgs, /liegt vor dem Baujahr/);
  assert.match(msgs, /Anteil 1200\/1000 ist grösser als 1/);
  assert.match(msgs, /Summe der Einzelmieten/);
});

test('Objektart und Einheiten werden abgeglichen', () => {
  const p = normalizeProperty(example({ images: false }));
  p.object.type = 'Einfamilienhaus';
  assert.match(validateProperty(p).map((i) => i.message).join(), /Einfamilienhaus mit mehreren Wohnungen/);
});

test('Ungültige Zahlen sind Fehler, keine stillen Nullen', () => {
  const p = normalizeProperty(example({ images: false }));
  p.object.plotArea = 'ca. vierhundert';
  const e = validateProperty(p).find((i) => i.field === 'Grundstücksfläche');
  assert.equal(e.level, 'error');
});

test('Facts & Figures enthalten nur erfasste Angaben', () => {
  const p = normalizeProperty(example({ images: false }));
  const labels = factRows(p).map((r) => r.label);
  assert.ok(labels.includes('Grundstücksfläche'));
  assert.ok(!labels.includes('Baujahr'), 'Baujahr ist nicht erfasst und darf nicht erscheinen');
  assert.ok(!labels.includes('Wohnfläche'));
  for (const r of factRows(p)) assert.ok(r.value.trim().length > 0);
});

test('Einheiten werden korrekt zusammengefasst', () => {
  const p = normalizeProperty(maximalObject());
  const lines = unitLines(p);
  assert.equal(lines.length, 5);
  assert.match(lines[0], /^4 × 2.5-Zimmer-Wohnung \(EG–3\. OG, je ca\. 58 m²/);
  assert.match(lines[3], /^1 × Gewerbe/);
});

test('Bruttorendite nur auf Wunsch und als berechnet gekennzeichnet', () => {
  const p = normalizeProperty(maximalObject());
  const row = financeRows(p).find((r) => r.label.startsWith('Bruttorendite'));
  assert.equal(row.source, 'derived');
  assert.equal(row.value, '3.45 %');
  p.finance.showGrossYield = false;
  assert.equal(grossYield(p), null);
  assert.ok(!financeRows(p).some((r) => r.label.startsWith('Bruttorendite')));
});

test('Kennzahlen-Leiste zeigt den Preis zuletzt und höchstens vier Werte', () => {
  const k = keyFigures(normalizeProperty(example({ images: false })));
  assert.ok(k.length <= 4);
  assert.equal(k[k.length - 1].label, 'Verkaufsrichtpreis');
});

test('Faktenbasis für die KI trennt Vorhandenes und Fehlendes', () => {
  const fb = factBase(normalizeProperty(example({ images: false })));
  assert.ok(fb.facts.grundstuecksflaeche);
  assert.ok(fb.missing.includes('baujahr'));
  assert.ok(!('baujahr' in fb.facts));
});
