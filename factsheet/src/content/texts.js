// Textbausteine aller Dokumente: Struktur, regelbasierte Erstfassung ohne KI und Verdichtung.
//   title, overview, arguments   Factsheet (und Teaser-Argumente)
//   expose                        Verkaufsdokumentation: Objekt, Region, Lage, je Einheit ein Beschrieb
//   teaser                        anonymer Teaser: Titel und Text ohne Adresse
//   inserat                       Immobilienportale: Titel, Kurzbeschrieb, Beschrieb
//
// Die regelbasierte Fassung (Provider «offline») setzt ausschliesslich erfasste Fakten in
// sachliche Sätze. Sie ist Rückfallebene ohne KI-Zugang und Referenz für Tests.
import { isEmpty } from '../model/schema.js';
import { designation, unitLines, parkingSummary, sortedInvestments, factBase, filledUnits, unitLabel, unitSummary, priceText } from '../model/facts.js';
import { fmtArea } from '../model/format.js';
import { BUDGET } from '../layout/design.js';

export const OVERVIEW_PARTS = [
  { key: 'ausgangslage', label: 'Ausgangslage' },
  { key: 'objektLage', label: 'Objekt & Lage' },
  { key: 'baujahrInvestitionen', label: 'Baujahr & Investitionen' },
  { key: 'einheiten', label: 'Einheiten & Nebenräume' },
];

export function emptyTexts() {
  return {
    provider: '',
    generatedAt: '',
    title: '',
    overview: { ausgangslage: '', objektLage: '', baujahrInvestitionen: '', einheiten: '' },
    arguments: [],
    expose: { objekt: '', region: '', lage: '', units: [] },
    teaser: { title: '', text: '' },
    inserat: { title: '', short: '', text: '' },
    edited: {},
  };
}

// Alle bearbeitbaren Textfelder mit Pfad, Bezeichnung, Dokument und Zeichenbudget.
// Grundlage für Bearbeitungsmaske, Faktenwächter und Verdichtung.
export function textFields(t) {
  const f = [
    { path: 'title', label: 'Titel / Objektbezeichnung', doc: 'Alle', max: BUDGET.title },
    ...OVERVIEW_PARTS.map((x) => ({ path: `overview.${x.key}`, label: x.label, doc: 'Factsheet', max: BUDGET[x.key], multiline: true })),
    { path: 'expose.objekt', label: 'Das Objekt', doc: 'Verkaufsdokumentation', max: BUDGET.exposeObjekt, multiline: true },
    { path: 'expose.region', label: 'Region', doc: 'Verkaufsdokumentation', max: BUDGET.exposeRegion, multiline: true },
    { path: 'expose.lage', label: 'Lage', doc: 'Verkaufsdokumentation', max: BUDGET.exposeLage, multiline: true },
  ];
  (t.expose.units || []).forEach((u, i) => {
    f.push({ path: `expose.units.${i}.title`, label: `Einheit ${i + 1}: Titel`, doc: 'Verkaufsdokumentation', max: BUDGET.unitTitle, group: `expose.units.${i}` });
    f.push({ path: `expose.units.${i}.text`, label: `Einheit ${i + 1}: Beschrieb`, doc: 'Verkaufsdokumentation', max: BUDGET.unitText, multiline: true, group: `expose.units.${i}` });
  });
  f.push(
    { path: 'teaser.title', label: 'Titel (ohne Adresse)', doc: 'Teaser', max: BUDGET.teaserTitle },
    { path: 'teaser.text', label: 'Text (ohne Adresse)', doc: 'Teaser', max: BUDGET.teaserText, multiline: true },
    { path: 'inserat.title', label: 'Inserat-Titel', doc: 'Inserat', max: BUDGET.inseratTitle },
    { path: 'inserat.short', label: 'Kurzbeschrieb', doc: 'Inserat', max: BUDGET.inseratShort, multiline: true },
    { path: 'inserat.text', label: 'Beschrieb', doc: 'Inserat', max: BUDGET.inseratText, multiline: true },
  );
  return f;
}

export function normalizeTexts(t) {
  const out = emptyTexts();
  if (!t || typeof t !== 'object') return out;
  const s = (v, max = 2000) => (typeof v === 'string' ? v.replace(/\r/g, '').trim().slice(0, max) : '');
  out.provider = s(t.provider, 40);
  out.generatedAt = s(t.generatedAt, 40);
  out.title = s(t.title, 120);
  for (const { key } of OVERVIEW_PARTS) out.overview[key] = s(t.overview && t.overview[key]);
  out.arguments = (Array.isArray(t.arguments) ? t.arguments : []).slice(0, BUDGET.argumentsMax).map((a) => ({
    title: s(a && a.title, 120),
    text: s(a && a.text, 600),
    basis: Array.isArray(a && a.basis) ? a.basis.filter((x) => typeof x === 'string').slice(0, 10) : [],
  })).filter((a) => a.title || a.text);
  const e = t.expose || {};
  out.expose.objekt = s(e.objekt);
  out.expose.region = s(e.region);
  out.expose.lage = s(e.lage);
  out.expose.units = (Array.isArray(e.units) ? e.units : []).slice(0, 20).map((u) => ({ title: s(u && u.title, 160), text: s(u && u.text, 1500) }));
  out.teaser.title = s(t.teaser && t.teaser.title, 160);
  out.teaser.text = s(t.teaser && t.teaser.text, 1500);
  out.inserat.title = s(t.inserat && t.inserat.title, 160);
  out.inserat.short = s(t.inserat && t.inserat.short, 400);
  out.inserat.text = s(t.inserat && t.inserat.text, 5000);
  if (t.edited && typeof t.edited === 'object') for (const k of Object.keys(t.edited)) out.edited[k] = true;
  return out;
}

// Ergänzt fehlende Bausteine (z. B. ältere Projekte nur mit Factsheet-Texten) aus der regelbasierten
// Fassung, ohne vorhandene oder bearbeitete Texte zu überschreiben.
export function completeTexts(t, p) {
  const base = offlineTexts(p);
  const out = normalizeTexts(t);
  if (!out.title) out.title = base.title;
  for (const k of Object.keys(out.overview)) if (!out.overview[k]) out.overview[k] = base.overview[k];
  for (const k of ['objekt', 'region', 'lage']) if (!out.expose[k]) out.expose[k] = base.expose[k];
  base.expose.units.forEach((u, i) => { if (!out.expose.units[i]) out.expose.units[i] = u; });
  out.expose.units = out.expose.units.slice(0, base.expose.units.length);
  for (const k of ['title', 'text']) if (!out.teaser[k]) out.teaser[k] = base.teaser[k];
  for (const k of ['title', 'short', 'text']) if (!out.inserat[k]) out.inserat[k] = base.inserat[k];
  return out;
}

const ARTICLE = {
  Mehrfamilienhaus: ['ein', 'das'], Zweifamilienhaus: ['ein', 'das'], 'Wohn- und Geschäftshaus': ['ein', 'das'],
  Einfamilienhaus: ['ein', 'das'], Eigentumswohnung: ['eine', 'die'], Gewerbeobjekt: ['ein', 'das'], Grundstück: ['ein', 'das'],
};

function sentence(s) {
  const t = String(s).trim();
  if (!t) return '';
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

export function offlineTexts(p) {
  const o = p.object;
  const type = isEmpty(o.type) || o.type === 'Andere' ? 'Liegenschaft' : o.type;
  const [ein, der] = ARTICLE[type] || ['eine', 'die'];
  const t = emptyTexts();
  t.provider = 'offline';
  t.generatedAt = new Date().toISOString();
  t.title = designation(p);

  // Jeder Satz entsteht nur, wenn alle seine Angaben vorhanden sind – keine Satzfragmente.
  const place = [o.zip, o.city].filter((x) => !isEmpty(x)).join(' ');
  const where = [!isEmpty(o.street) ? `an der ${o.street}` : '', place ? `in ${place}` : ''].filter(Boolean).join(' ');
  t.overview.ausgangslage = !isEmpty(p.process.situation)
    ? sentence(p.process.situation)
    : (where ? `Zum Verkauf steht ${ein} ${type} ${where}.` : '');

  const lage = [];
  const plot = isEmpty(o.plotArea) ? '' : `auf einem Grundstück von ${fmtArea(o.plotArea)}`;
  if (where || plot) lage.push(`${cap(der)} ${type} liegt ${[where, plot].filter(Boolean).join(' ')}.`);
  if (!isEmpty(o.location)) lage.push(sentence(o.location));
  t.overview.objektLage = lage.join(' ');

  const bau = [];
  if (!isEmpty(o.yearBuilt)) bau.push(`Baujahr ${o.yearBuilt}.`);
  if (!isEmpty(o.condition)) bau.push(`Zustand: ${sentence(o.condition)}`);
  const inv = sortedInvestments(p);
  if (inv.length) bau.push(`Investitionen: ${inv.map((i) => `${i.year} ${i.measure}`).join('; ')}.`);
  if (!isEmpty(o.heating)) bau.push(`Wärmeerzeugung: ${sentence(o.heating)}`);
  t.overview.baujahrInvestitionen = bau.join(' ');

  const ein2 = [];
  const lines = unitLines(p);
  if (lines.length) ein2.push(`Die Liegenschaft umfasst ${lines.join(', ')}.`);
  if (!isEmpty(p.unitsExtra.annex)) ein2.push(`Nebenräume: ${sentence(p.unitsExtra.annex)}`);
  const park = parkingSummary(p);
  if (park) ein2.push(`Parkierung: ${sentence(park)}`);
  t.overview.einheiten = ein2.join(' ');

  // Argumente: jede erfasste Besonderheit / jedes Potenzial als eigener Punkt, wörtlich übernommen.
  const points = [p.marketing.highlights, p.marketing.potential]
    .filter((x) => !isEmpty(x))
    .flatMap((x) => String(x).split(/\n|;|•/))
    .map((x) => x.replace(/^[-–*\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, BUDGET.argumentsMax);
  t.arguments = points.map((x) => (x.length <= BUDGET.argumentTitle
    ? { title: sentence(x).replace(/\.$/, ''), text: '', basis: ['besonderheiten'] }
    : { title: '', text: sentence(x), basis: ['besonderheiten'] }));

  // Verkaufsdokumentation
  t.expose.objekt = [t.overview.ausgangslage, t.overview.einheiten, t.overview.baujahrInvestitionen].filter(Boolean).join(' ');
  t.expose.region = isEmpty(o.macroLocation) ? '' : sentence(o.macroLocation);
  t.expose.lage = isEmpty(o.location) ? '' : sentence(o.location);
  t.expose.units = filledUnits(p).map((u) => ({
    title: unitTitle(u),
    text: isEmpty(u.features) ? '' : `Merkmale: ${sentence(u.features)}`,
  }));

  // Anonymer Teaser: keine Strasse, keine Parzellennummer
  const region = !isEmpty(p.process.teaserLocation) ? p.process.teaserLocation : o.city;
  t.teaser.title = region ? `${type} ${inPlace(region)}` : type;
  const teaser = [];
  const units = unitSummary(p);
  if (region) teaser.push(`Zum Verkauf steht ${ein} ${type} ${inPlace(region)}${units ? ` mit ${units}` : ''}.`);
  if (!isEmpty(o.plotArea)) teaser.push(`Grundstücksfläche ${fmtArea(o.plotArea)}.`);
  if (!isEmpty(o.condition)) teaser.push(`Zustand: ${sentence(o.condition)}`);
  t.teaser.text = teaser.join(' ');

  // Inserat
  t.inserat.title = [type, units ? `mit ${units}` : '', o.city ? `in ${o.city}` : ''].filter(Boolean).join(' ');
  const price = priceText(p);
  t.inserat.short = [t.overview.ausgangslage, price ? `${price.label}: ${price.value}.` : ''].filter(Boolean).join(' ');
  t.inserat.text = [t.overview.ausgangslage, t.expose.lage, t.overview.einheiten, t.overview.baujahrInvestitionen,
    isEmpty(o.availableFrom) ? '' : `Verfügbar: ${sentence(o.availableFrom)}`].filter(Boolean).join('\n\n');
  return t;
}

// «in Basel», aber «in der Region Laufental»
export function inPlace(x) {
  return /^(Region|Agglomeration|Gegend|Nordwestschweiz|Stadt|Gemeinde)\b/i.test(String(x).trim()) ? `in der ${x}` : `in ${x}`;
}

export function unitTitle(u) {
  const c = Number(u.count) || 1;
  const parts = [`${c > 1 ? `${c} × ` : ''}${unitLabel(u)}`];
  if (!isEmpty(u.floor)) parts.push(/geschoss|^EG|^OG|^UG|^DG|attika/i.test(u.floor) ? `im ${u.floor}` : u.floor);
  if (!isEmpty(u.area)) parts.push(`ca. ${fmtArea(u.area)}`);
  return parts.join(' ').replace(' ca.', ', ca.');
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Satzgrenzen: Punkt/Ausrufe-/Fragezeichen gefolgt von Leerzeichen und Grossbuchstaben.
// «ca. 100 m²» oder «Nr. 5» werden dadurch nicht getrennt.
export function splitSentences(text) {
  return String(text || '').split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ«„"])/).map((s) => s.trim()).filter(Boolean);
}

// Kürzt auf ganze Sätze innerhalb von maxChars. Der erste Satz bleibt immer erhalten.
// Es wird nur weggelassen, nie umformuliert – dadurch kann beim Verdichten nichts Neues entstehen.
export function trimToSentences(text, maxChars) {
  const s = splitSentences(text);
  if (!s.length) return '';
  let out = s[0];
  for (let i = 1; i < s.length; i++) {
    if ((out + ' ' + s[i]).length > maxChars) break;
    out += ' ' + s[i];
  }
  return out;
}

export { factBase };
