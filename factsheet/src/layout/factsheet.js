// Aufbau des Factsheets als Block-Modell (Template «Factsheet», max. 2 Seiten).
//
// Das Block-Modell ist die gemeinsame Grundlage von HTML-Vorschau und DOCX-Export.
// Beide Renderer setzen dieselben Blöcke mit denselben Designwerten um; die Vorschau
// entspricht dadurch dem späteren Word-Dokument.
//
// Verdichtung: Passt eine Seite nicht, werden stufenweise – und je Seite unabhängig –
// Abstände verringert, Bilder verkleinert, optionale Inhalte reduziert und zuletzt Texte
// auf ganze Sätze gekürzt. Schriftgrössen werden nie verändert, Inhalte nie ergänzt.
import { isEmpty } from '../model/schema.js';
import {
  addressLine, designation, keyFigures, factRows, financeRows, landRows, parcelTable, unitTable,
  sortedInvestments, processSteps,
} from '../model/facts.js';
import { OVERVIEW_PARTS, trimToSentences, splitSentences } from '../content/texts.js';
import { BUDGET, IMAGE_HEIGHT, PAGE, BOX } from './design.js';
import { measurePage } from './measure.js';

export const DISCLAIMER = {
  full: 'Allgemeine Angaben: Sämtliche Angaben in diesem Factsheet beruhen auf Informationen der Eigentümerschaft '
    + 'und Dritter und erfolgen ohne Gewähr. Sie stellen weder ein Angebot noch eine Zusicherung dar; massgebend '
    + 'sind ausschliesslich die Bestimmungen eines allfälligen Kaufvertrags. Zwischenverkauf, Preisänderungen und '
    + 'Irrtum bleiben vorbehalten. Das Dokument ist vertraulich und darf ohne Zustimmung der Schaeppi Grundstücke AG '
    + 'weder vervielfältigt noch an Dritte weitergegeben werden.',
  short: 'Alle Angaben ohne Gewähr; kein Angebot und keine Zusicherung. Zwischenverkauf vorbehalten. '
    + 'Vertraulich – Weitergabe an Dritte nur mit Zustimmung der Schaeppi Grundstücke AG.',
};

// Verdichtungsstufen Seite 1 (kumulativ)
const P1_LEVELS = [
  {},
  { scale: 0.75 },
  { scale: 0.75, cover: IMAGE_HEIGHT.coverCompact },
  { scale: 0.75, cover: IMAGE_HEIGHT.coverCompact, trim: 0.8, maxArgs: 4 },
  { scale: 0.6, cover: IMAGE_HEIGHT.coverCompact, trim: 0.65, maxArgs: 3, argFirstSentence: true },
  { scale: 0.6, cover: 0, trim: 0.65, maxArgs: 3, argFirstSentence: true },
  { scale: 0.6, cover: 0, trim: 0.45, maxArgs: 3, argFirstSentence: true },
];

// Verdichtungsstufen Seite 2 (kumulativ)
const P2_LEVELS = [
  {},
  { scale: 0.75 },
  { scale: 0.75, row: IMAGE_HEIGHT.rowCompact },
  { scale: 0.75, row: 0 },
  { scale: 0.6, row: 0, noUnitTable: true, shortDisclaimer: true, compactFacts: true },
  { scale: 0.6, row: 0, noUnitTable: true, shortDisclaimer: true, compactFacts: true, split: true, maxInvest: 6, compactSteps: true },
  { scale: 0.6, row: 0, noUnitTable: true, shortDisclaimer: true, compactFacts: true, split: true, maxInvest: 4, compactSteps: true },
  { scale: 0.6, row: 0, noUnitTable: true, shortDisclaimer: true, compactFacts: true, split: true, maxInvest: 3, compactSteps: true, unitSummary: true },
];

const SLOT_CAPTION = { object: 'Objekt', location: 'Lage', floorplan: 'Grundriss' };

function trimmedTexts(texts, lv) {
  const overview = {};
  for (const { key } of OVERVIEW_PARTS) {
    const t = texts.overview[key] || '';
    overview[key] = lv.trim ? trimToSentences(t, Math.round(BUDGET[key] * lv.trim)) : t;
  }
  let args = texts.arguments.slice(0, lv.maxArgs || BUDGET.argumentsMax);
  if (lv.argFirstSentence) args = args.map((a) => ({ ...a, text: splitSentences(a.text)[0] || '' }));
  return { overview, arguments: args };
}

function page1(p, texts, images, lv, opts = {}) {
  const blocks = [];
  const title = texts.title || designation(p);
  blocks.push({
    type: 'band',
    label: p.meta.docLabel || 'Akquisitionsgelegenheit',
    title,
    subtitle: addressLine(p),
  });
  const kpis = keyFigures(p);
  if (kpis.length) blocks.push({ type: 'kpis', items: kpis });
  const coverHeight = lv.cover === undefined ? IMAGE_HEIGHT.cover : lv.cover;
  if (images.cover && coverHeight > 0) blocks.push({ type: 'image', slot: 'cover', height: coverHeight });

  const t = trimmedTexts(texts, lv);
  const left = [{ type: 'h1', text: 'Transaktionsübersicht', first: true }];
  for (const { key, label } of OVERVIEW_PARTS) {
    if (isEmpty(t.overview[key])) continue;
    left.push({ type: 'h2', text: label, first: left.length === 1 });
    left.push({ type: 'para', text: t.overview[key], key: `overview.${key}`, source: texts.edited[`overview.${key}`] ? 'edited' : 'ai', trimmed: t.overview[key] !== texts.overview[key] });
  }
  const right = [];
  if (t.arguments.length) {
    right.push({ type: 'h1', text: 'Investorenargument', first: true });
    t.arguments.forEach((a, i) => right.push({ type: 'argument', index: i, title: a.title, text: a.text, first: false, key: `arguments.${i}` }));
  }
  const contacts = (p.contacts || []).filter((c) => !isEmpty(c.name));
  if (contacts.length) {
    right.push({ type: 'contacts', heading: 'Ansprechpartner', first: right.length === 0, items: contacts.map((c) => ({ name: c.name, role: c.role, phone: c.phone, email: c.email })) });
  }
  if (opts.stepsOnPage1) right.push(...stepBlocks(p, { compact: false, heading: 'h3', first: right.length === 0 }));
  blocks.push({ type: 'columns', left, right });
  return blocks;
}

function page2(p, images, lv, opts = {}) {
  const blocks = [];
  const h = (text) => blocks.push({ type: 'h1', text, first: blocks.length === 0 });

  const ut = lv.noUnitTable ? null : unitTable(p);
  const fr = financeRows(p);
  const pt = parcelTable(p);
  h('Facts & Figures');
  // Merkmale der Einheiten stehen in der Einheitentabelle; ohne Tabelle in den Facts & Figures,
  // bei starker Verdichtung nur noch Anzahl, Zimmer, Geschoss und Fläche bzw. eine Summenzeile.
  // Preis und Parzellen erscheinen nur einmal (in «Erträge» bzw. in der Parzellentabelle).
  blocks.push({ type: 'kv', rows: factRows(p, { unitFeatures: !ut && !lv.compactFacts, unitSummary: lv.unitSummary, price: !fr.length, parcels: !pt }) });

  if (ut) {
    h('Einheiten');
    blocks.push({ type: 'table', header: ut.header, rows: ut.rows, shares: tableShares(ut) });
  }

  const lr = landRows(p);
  const parcels = pt ? { type: 'table', header: pt.header, rows: pt.rows, shares: tableShares(pt) } : null;
  const legal = lr.length ? { type: 'kv', rows: lr } : null;
  const finance = fr.length ? { type: 'kv', rows: fr } : null;
  if (lv.split && legal && finance) {
    // Verdichtung: Rechtliches und Erträge nebeneinander; die Parzellentabelle bleibt in voller Breite.
    if (parcels) { h('Grundstücke & Miteigentum'); blocks.push(parcels); }
    const narrow = (b) => ({ ...b, labelShare: BOX.kv.labelShareNarrow });
    blocks.push({
      type: 'split',
      left: [{ type: 'h1', text: parcels ? 'Zonenordnung & Rechtliches' : 'Grundstück & Zonenordnung' }, narrow(legal)],
      right: [{ type: 'h1', text: 'Erträge & Kennzahlen' }, narrow(finance)],
    });
  } else {
    if (parcels || legal) {
      h(parcels ? 'Grundstücke & Miteigentum' : 'Grundstück & Zonenordnung');
      if (parcels) blocks.push(parcels);
      if (legal) blocks.push(legal);
    }
    if (finance) { h('Erträge & Kennzahlen'); blocks.push(finance); }
  }

  let inv = sortedInvestments(p);
  if (inv.length) {
    const partial = lv.maxInvest && inv.length > lv.maxInvest;
    if (partial) inv = inv.slice(0, lv.maxInvest);
    h(partial ? 'Investitionen (jüngste Massnahmen)' : 'Investitionen');
    blocks.push({ type: 'table', header: ['Jahr', 'Massnahme'], rows: inv.map((i) => [String(i.year), String(i.measure)]), shares: [0.14, 0.86] });
  }

  const rowHeight = lv.row === undefined ? IMAGE_HEIGHT.row : lv.row;
  const slots = ['object', 'location', 'floorplan'].filter((s) => images[s]).slice(0, 2);
  if (slots.length && rowHeight > 0) {
    blocks.push({ type: 'imageRow', height: rowHeight, slots: slots.map((s) => ({ slot: s, caption: SLOT_CAPTION[s] })) });
  }

  if (!opts.stepsOnPage1) blocks.push(...stepBlocks(p, { compact: lv.compactSteps, heading: 'h1', first: blocks.length === 0 }));

  blocks.push({ type: 'small', text: lv.shortDisclaimer ? DISCLAIMER.short : DISCLAIMER.full, source: 'fixed' });
  return separateTables(blocks);
}

// «Nächste Schritte» – nur wenn Prozessangaben erfasst sind. heading 'h3' = kleine Überschrift in der Spalte auf Seite 1.
function stepBlocks(p, { compact = false, heading = 'h1', first = false } = {}) {
  const steps = processSteps(p);
  if (!steps.length) return [];
  const r = p.process || {};
  const out = [{ type: heading, text: 'Nächste Schritte', first }];
  if (r.stages) out.push({ type: 'para', text: `Der Verkauf erfolgt in einem ${r.stages === 'zweistufig' ? 'zweistufigen' : 'einstufigen'} Verfahren.`, first: true, source: 'fact', style: 'step' });
  if (compact) out.push({ type: 'para', text: steps.map((s, i) => `${i + 1}. ${s.title}${s.detail ? ` (${s.detail})` : ''}`).join('  ·  '), first: true, style: 'step', source: 'fact' });
  else out.push({ type: 'steps', items: steps });
  return out;
}

// Zwei direkt aufeinanderfolgende Tabellen würden in Word zu einer verschmelzen.
const TABLE_TYPES = new Set(['kv', 'table', 'imageRow', 'split']);
function separateTables(blocks) {
  const out = [];
  for (const b of blocks) {
    const prev = out[out.length - 1];
    if (prev && TABLE_TYPES.has(prev.type) && TABLE_TYPES.has(b.type) && prev.type !== 'imageRow') out.push({ type: 'spacer', height: 6 });
    out.push(b);
  }
  return out;
}

// Spaltenanteile aus den Gewichten der Tabelle (nur vorhandene Spalten werden gewichtet)
function tableShares(t) {
  const sum = t.weights.reduce((a, b) => a + b, 0);
  return t.weights.map((w) => w / sum);
}

const SAFETY = 10; // pt Reserve gegenüber der rechnerischen Seitenhöhe (Rundungen der Textprogramme)

// Baut das Factsheet und wählt je Seite die geringste Verdichtungsstufe, die passt.
// minLevels erlaubt dem Server, nach einer Renderer-Prüfung eine höhere Stufe zu erzwingen.
export function buildFactsheet(p, texts, images = {}, { minLevels = [0, 0] } = {}) {
  const capacity = PAGE.contentHeight - SAFETY;
  const fit = (levels, build, min) => {
    for (let i = min; i < levels.length; i++) {
      const blocks = build(levels[i]);
      const height = measurePage(blocks, levels[i].scale || 1);
      if (height <= capacity) return { blocks, level: i, height, scale: levels[i].scale || 1, fits: true };
      if (i === levels.length - 1) return { blocks, level: i, height, scale: levels[i].scale || 1, fits: false };
    }
  };
  const min1 = Math.min(minLevels[0], P1_LEVELS.length - 1);
  const min2 = Math.min(minLevels[1], P2_LEVELS.length - 1);
  let p1 = fit(P1_LEVELS, (lv) => page1(p, texts, images, lv), min1);
  let p2 = fit(P2_LEVELS, (lv) => page2(p, images, lv), min2);
  let stepsOnPage1 = false;
  // Seite 2 zu voll: «Nächste Schritte» auf Seite 1 verschieben, sofern Seite 1 dadurch weiterhin passt.
  if (!p2.fits && processSteps(p).length) {
    const q1 = fit(P1_LEVELS, (lv) => page1(p, texts, images, lv, { stepsOnPage1: true }), min1);
    const q2 = fit(P2_LEVELS, (lv) => page2(p, images, lv, { stepsOnPage1: true }), min2);
    if (q1.fits) { p1 = q1; p2 = q2; stepsOnPage1 = true; }
  }
  return {
    stepsOnPage1,
    template: 'factsheet',
    confidential: p.meta.confidential !== false,
    title: texts.title || designation(p),
    address: addressLine(p),
    pages: [p1, p2],
    capacity,
    maxLevels: [P1_LEVELS.length - 1, P2_LEVELS.length - 1],
  };
}

export function describeLevel(page, level) {
  const d1 = ['Standard', 'Abstände verringert', 'Titelbild verkleinert', 'Texte auf ganze Sätze gekürzt, max. 4 Argumente',
    'Texte stärker gekürzt, 3 Argumente', 'ohne Titelbild', 'Texte stark gekürzt'];
  const d2 = ['Standard', 'Abstände verringert', 'Bilder verkleinert', 'ohne Bilder', 'ohne Einheitentabelle und Merkmale, kurzer Hinweistext',
    'Grundstück und Erträge nebeneinander, Investitionen: 6 jüngste, Schritte einzeilig', 'Investitionen: 4 jüngste',
    'Einheiten als Summenzeile, Investitionen: 3 jüngste'];
  return (page === 0 ? d1 : d2)[level] || '';
}
