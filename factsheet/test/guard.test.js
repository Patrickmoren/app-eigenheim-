import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProperty } from '../src/model/schema.js';
import { factBase } from '../src/model/facts.js';
import { guardTexts, checkText, buildFactIndex } from '../src/content/guard.js';
import { offlineTexts, normalizeTexts, trimToSentences } from '../src/content/texts.js';
import { example, exampleTexts } from './helpers.js';

const p = normalizeProperty(example({ images: false }));
const index = buildFactIndex(factBase(p));

test('Beispieltexte Neumattstrasse 15 bestehen den Faktenwächter', () => {
  assert.deepEqual(guardTexts(normalizeTexts(exampleTexts()), factBase(p)), {});
});

test('Erfundene Zahlen werden erkannt', () => {
  const f = checkText('Das Haus wurde 1955 erbaut und bietet 240 m² Wohnfläche.', index);
  assert.deepEqual(f.filter((x) => x.kind === 'zahl').map((x) => x.term), ['1955', '240']);
});

test('Unbelegte Zustands- und Lageaussagen werden erkannt', () => {
  const kinds = (t) => checkText(t, index).map((x) => x.term);
  assert.ok(kinds('Die Liegenschaft verfügt über einen Lift und Seesicht.').includes('lift'));
  assert.ok(kinds('Zentrale Lage mit Weitsicht.').includes('zentral'));
  assert.ok(kinds('Zentrale Lage mit Weitsicht.').includes('weitsicht'));
});

test('Werbliche Superlative ohne Faktenbasis werden erkannt', () => {
  const f = checkText('Absolute Toplage – ein einmaliges, exklusives Objekt.', index).map((x) => x.term);
  for (const w of ['absolut', 'toplage', 'einmalig', 'exklusiv']) assert.ok(f.includes(w), w);
});

test('Belegte Aussagen sind zulässig', () => {
  assert.deepEqual(checkText('Die Erdgeschosswohnung wurde 2020 komplett renoviert und verfügt über einen Gartensitzplatz.', index), []);
  assert.deepEqual(checkText('Die PostAuto-Linie 115 verkehrt im Halbstundentakt.', index), []);
});

test('Zahlwörter werden gegen die Fakten geprüft', () => {
  assert.deepEqual(checkText('Zwei Wohnungen', index), []);
  assert.ok(checkText('Sieben Wohnungen', index).some((x) => x.term === 'sieben'));
});

test('Argumente brauchen einen Faktenbezug', () => {
  const t = normalizeTexts({ provider: 'anthropic', title: 'X', overview: {}, arguments: [{ title: 'Ruhige Lage', text: 'Ruhige Wohnlage.', basis: [] }, { title: 'A', text: 'B', basis: ['baujahr'] }] });
  const g = guardTexts(t, factBase(p));
  assert.match(g['arguments.0'][0].message, /ohne Faktenbezug/);
  assert.match(g['arguments.1'].map((x) => x.message).join(), /nicht erfasste Angaben: baujahr/);
});

test('Regelbasierte Texte enthalten nur Fakten', () => {
  const t = offlineTexts(p);
  const g = guardTexts({ ...t, provider: 'pruefung' }, factBase(p));
  const numbers = Object.values(g).flat().filter((f) => f.kind === 'zahl');
  assert.deepEqual(numbers, []);
  assert.ok(!t.overview.baujahrInvestitionen.includes('Baujahr'), 'Baujahr fehlt und wird nicht erwähnt');
});

test('Kürzen erfolgt nur an Satzgrenzen und fügt nichts hinzu', () => {
  const s = 'Erster Satz mit ca. 100 m² Fläche. Zweiter Satz. Dritter Satz ist deutlich länger als erlaubt.';
  assert.equal(trimToSentences(s, 50), 'Erster Satz mit ca. 100 m² Fläche. Zweiter Satz.');
  assert.equal(trimToSentences(s, 5), 'Erster Satz mit ca. 100 m² Fläche.');
});
