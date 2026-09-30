// Textbausteine des Factsheets: Struktur, regelbasierte Erstfassung ohne KI und Verdichtung.
//
// Die regelbasierte Fassung (Provider «offline») setzt ausschliesslich erfasste Fakten in
// sachliche Sätze. Sie ist Rückfallebene ohne KI-Zugang und Referenz für Tests.
import { isEmpty } from '../model/schema.js';
import { designation, unitLines, parkingSummary, sortedInvestments, factBase } from '../model/facts.js';
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
    edited: {},
  };
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
  if (t.edited && typeof t.edited === 'object') for (const k of Object.keys(t.edited)) out.edited[k] = true;
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
  return t;
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
