// Anonymer Teaser: eine Seite für die Erstansprache, vor der Geheimhaltungsverpflichtung.
// Keine Strasse, keine Hausnummer, keine PLZ, keine Parzellennummer. Gleiche Bausteine und
// gleiche Seitenberechnung wie das Factsheet; höchstens eine Seite.
import { isEmpty } from '../model/schema.js';
import { keyFigures, factRows, financeRows } from '../model/facts.js';
import { anonymityFindings } from '../content/guard.js';
import { trimToSentences, inPlace } from '../content/texts.js';
import { BUDGET, IMAGE_HEIGHT, PAGE } from './design.js';
import { measurePage } from './measure.js';
import { DISCLAIMER } from './factsheet.js';

const LEVELS = [
  {},
  { scale: 0.75 },
  { scale: 0.75, cover: IMAGE_HEIGHT.coverCompact },
  { scale: 0.6, cover: 0, maxArgs: 3, trim: 0.8 },
  { scale: 0.6, cover: 0, maxArgs: 3, trim: 0.6, maxFacts: 6 },
];

// Eckdaten ohne Adress- und Parzellenangaben
const ALLOWED = ['Objektart', 'Grundstücksfläche', 'Wohnfläche', 'Nutzfläche Gewerbe', 'Einheit', 'Einheiten', 'Parkierung', 'Baujahr', 'Wärmeerzeugung', 'Verfügbar ab'];

function teaserFacts(p) {
  const rows = factRows(p, { unitFeatures: false, price: false, parcels: false }).filter((r) => ALLOWED.includes(r.label));
  const fin = financeRows(p).filter((r) => /Mietertrag IST|Vermietungsstand|Kaufpreisvorstellung|Verkaufsrichtpreis|Preis/.test(r.label));
  return [...rows, ...fin];
}

export function buildTeaser(p, texts, images = {}, { minLevel = 0 } = {}) {
  const capacity = PAGE.contentHeight - 10;
  const region = !isEmpty(p.process.teaserLocation) ? p.process.teaserLocation : p.object.city;
  const notes = [];
  // Argumente mit Adresshinweisen entfallen im Teaser
  const args = texts.arguments.filter((a) => {
    const hit = anonymityFindings(`${a.title} ${a.text}`, p);
    if (hit.length) notes.push(`Argument «${a.title || a.text.slice(0, 30)}» enthält Adressangaben und entfällt im Teaser.`);
    return !hit.length;
  });
  const showImage = p.process.teaserImage && images.cover;

  const build = (lv) => {
    const blocks = [{ type: 'band', label: 'Investitionsgelegenheit', title: texts.teaser.title || 'Liegenschaft', subtitle: region ? `Anonymer Kurzbeschrieb · ${inPlace(region).replace(/^in (der )?/, '')}` : 'Anonymer Kurzbeschrieb' }];
    const kpis = keyFigures(p);
    if (kpis.length) blocks.push({ type: 'kpis', items: kpis });
    const coverH = lv.cover === undefined ? IMAGE_HEIGHT.cover : lv.cover;
    if (showImage && coverH > 0) blocks.push({ type: 'image', slot: 'cover', height: coverH });
    const text = lv.trim ? trimToSentences(texts.teaser.text, Math.round(BUDGET.teaserText * lv.trim)) : texts.teaser.text;
    let facts = teaserFacts(p);
    if (lv.maxFacts) facts = facts.slice(0, lv.maxFacts);
    const left = [{ type: 'h1', text: 'Das Objekt', first: true }];
    if (text) left.push({ type: 'para', text, key: 'teaser.text', source: 'ai', trimmed: text !== texts.teaser.text });
    if (facts.length) left.push({ type: 'h2', text: 'Eckdaten' }, { type: 'kv', rows: facts, labelShare: 0.42 }, { type: 'spacer', height: 1 });
    const right = [];
    const a = args.slice(0, lv.maxArgs || BUDGET.argumentsMax);
    if (a.length) {
      right.push({ type: 'h1', text: 'Investorenargument', first: true });
      a.forEach((x, i) => right.push({ type: 'argument', index: i, title: x.title, text: x.text, first: false, key: `arguments.${i}` }));
    }
    const contacts = (p.contacts || []).filter((c) => !isEmpty(c.name));
    if (contacts.length) right.push({ type: 'contacts', heading: 'Ansprechpartner', first: right.length === 0, items: contacts });
    right.push({ type: 'h3', text: 'Nächster Schritt', first: right.length === 0 });
    right.push({ type: 'para', style: 'contact', text: 'Weitere Unterlagen mit Adresse und Verkaufsdokumentation erhalten Sie nach Unterzeichnung der Geheimhaltungsverpflichtung.', first: true, source: 'fixed' });
    blocks.push({ type: 'columns', left, right });
    blocks.push({ type: 'small', text: DISCLAIMER.short, source: 'fixed' });
    return blocks;
  };

  let page;
  for (let i = Math.min(minLevel, LEVELS.length - 1); i < LEVELS.length; i++) {
    const blocks = build(LEVELS[i]);
    const height = measurePage(blocks, LEVELS[i].scale || 1);
    page = { blocks, level: i, height, scale: LEVELS[i].scale || 1, fits: height <= capacity };
    if (page.fits) break;
  }
  return { template: 'teaser', confidential: p.meta.confidential !== false, title: texts.teaser.title, address: region || '', pages: [page], capacity, maxLevels: [LEVELS.length - 1], notes };
}
