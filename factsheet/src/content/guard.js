// Faktenwächter für KI-Texte.
//
// Prüft jeden formulierten Text gegen die erfasste Faktenbasis:
//   1. Jede Zahl im Text muss in den Fakten vorkommen (Flächen, Preise, Jahre, Anzahlen …).
//   2. Aussagen zu Zustand, Lage, Ausstattung und Potenzial dürfen nur fallen, wenn der
//      entsprechende Begriff in den Fakten steht (z. B. «renoviert» nur bei erfasster Renovation).
//   3. Werbliche Superlative sind nur zulässig, wenn der Benutzer sie selbst erfasst hat.
//   4. Investorenargumente müssen auf vorhandene Faktenfelder verweisen.
// Treffer sind Hinweise zur Prüfung (keine automatische Änderung); der Benutzer entscheidet.
import { toNumber } from '../model/schema.js';
import { OVERVIEW_PARTS } from './texts.js';

const NUMBER_WORDS = { ein: 1, eine: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12 };

// Begriffe, die eine Tatsachenbehauptung darstellen. Schlüssel = Wortstamm im KI-Text,
// Wert = Stämme, von denen mindestens einer in den Fakten vorkommen muss.
const CLAIMS = {
  renov: ['renov', 'saniert', 'sanierung', 'erneuer', 'modernis'],
  saniert: ['saniert', 'sanierung', 'renov', 'erneuer'],
  sanierung: ['saniert', 'sanierung', 'renov', 'erneuer', 'potenzial'],
  modernis: ['modernis', 'renov', 'saniert', 'erneuer'],
  neuwertig: ['neuwertig', 'neubau'],
  gepflegt: ['gepflegt', 'unterhalten'],
  ruhig: ['ruhig'],
  zentral: ['zentral', 'zentrum'],
  aussicht: ['aussicht', 'blick', 'weitsicht'],
  weitsicht: ['aussicht', 'blick', 'weitsicht'],
  sonnig: ['sonnig', 'besonnt', 'sonne'],
  hell: ['hell', 'licht'],
  grün: ['grün', 'natur', 'park', 'wald'],
  naturnah: ['natur', 'grün', 'wald'],
  minergie: ['minergie'],
  lift: ['lift', 'aufzug'],
  balkon: ['balkon'],
  terrasse: ['terrass'],
  garten: ['garten'],
  gartensitzplatz: ['gartensitzplatz', 'sitzplatz'],
  potenzial: ['potenzial', 'reserve', 'ausbau', 'optimier', 'steiger', 'entwickl'],
  ausbau: ['ausbau', 'reserve', 'potenzial', 'aufstock', 'dachausbau'],
  aufstock: ['aufstock'],
  nutzungsreserve: ['reserve', 'ausnützung'],
  entwicklung: ['entwickl', 'potenzial', 'reserve'],
  mietzinssteiger: ['steiger', 'soll', 'potenzial', 'optimier'],
  mietsteiger: ['steiger', 'soll', 'potenzial', 'optimier'],
  mietzinsoptimier: ['optimier', 'steiger', 'soll', 'potenzial'],
  nachfrage: ['nachfrage', 'gesucht', 'beliebt'],
  begehrt: ['begehrt', 'gesucht', 'nachfrage'],
  beliebt: ['beliebt', 'gesucht', 'nachfrage'],
  vollvermietet: ['vollvermietet', 'vermietet', '100'],
  vermietet: ['vermiet', 'mietertrag'],
  leerstand: ['leerstand', 'leer', 'vermietungsstand'],
  rendite: ['rendite', 'mietertrag'],
  autobahn: ['autobahn', 'a1', 'a2', 'a3', 'a18', 'a22'],
  bahnhof: ['bahnhof', 'bahn'],
  's-bahn': ['s-bahn'],
  tram: ['tram'],
  bus: ['bus', 'postauto'],
  schule: ['schule', 'kindergarten'],
  einkauf: ['einkauf', 'laden', 'migros', 'coop', 'detailhandel', 'bäckerei'],
  erschlossen: ['erschlossen', 'erschliessung', 'öv', 'bus', 'tram', 'bahn', 'autobahn'],
  erschliessung: ['erschlossen', 'erschliessung', 'öv', 'bus', 'tram', 'bahn', 'autobahn'],
  anbindung: ['anbindung', 'öv', 'bus', 'tram', 'bahn', 'autobahn', 'erschliess'],
  bauland: ['bauland'],
  denkmal: ['denkmal', 'schutz', 'inventar'],
  altlast: ['altlast'],
};

// Werbesprache ohne Faktenbasis – immer melden, ausser der Benutzer hat den Begriff selbst erfasst.
const SUPERLATIVES = ['einzigartig', 'einmalig', 'traumhaft', 'absolut', 'toplage', 'top-lage', 'bestlage', 'exklusiv',
  'luxuriös', 'perfekt', 'ideal', 'unschlagbar', 'hervorragend', 'erstklassig', 'aussergewöhnlich', 'spektakulär',
  'selten', 'garantiert', 'sicher', 'risikolos', 'maximal', 'optimal', 'bestens', 'höchst', 'premium', 'prestige'];

function normNum(s) {
  return String(s).replace(/[’'`´\s]/g, '').replace(/,/g, '.').replace(/\.$/, '').replace(/\.0+$/, '');
}

function numbersIn(text) {
  const out = [];
  const re = /\d[\d’'`´.,]*\d|\d/g;
  let m;
  while ((m = re.exec(text))) out.push(normNum(m[0]));
  return out;
}

export function buildFactIndex(factBaseResult) {
  const all = Object.values(factBaseResult.facts).join(' \n ');
  // Feldnamen gehören zum Index: «rendite» ist z. B. belegt, sobald ein Mietertrag erfasst ist.
  const lower = `${all} \n ${Object.keys(factBaseResult.facts).join(' ')}`.toLowerCase();
  const nums = new Set(numbersIn(all));
  // abgeleitete Zahlen, die sprachlich normal sind (z. B. «rund 100 m²» aus «100 m²» bleibt gedeckt)
  for (const n of [...nums]) {
    const v = toNumber(n);
    if (v !== null) nums.add(String(v));
  }
  return { lower, nums, keys: new Set(Object.keys(factBaseResult.facts)) };
}

export function checkText(text, index) {
  const findings = [];
  if (!text) return findings;
  const lower = text.toLowerCase();
  for (const n of numbersIn(text)) {
    const v = toNumber(n);
    if (!index.nums.has(n) && !(v !== null && index.nums.has(String(v)))) findings.push({ kind: 'zahl', term: n, message: `Zahl «${n}» ist in den erfassten Fakten nicht enthalten.` });
  }
  for (const [w, n] of Object.entries(NUMBER_WORDS)) {
    if (n < 2) continue;
    if (new RegExp(`\\b${w}\\b`, 'i').test(text) && !index.nums.has(String(n)) && !index.lower.includes(w)) {
      findings.push({ kind: 'zahl', term: w, message: `Anzahl «${w}» ist in den erfassten Fakten nicht enthalten.` });
    }
  }
  for (const [stem, needs] of Object.entries(CLAIMS)) {
    if (lower.includes(stem) && !needs.some((n) => index.lower.includes(n))) {
      findings.push({ kind: 'aussage', term: stem, message: `Aussage «${stem}…» ist durch die erfassten Fakten nicht belegt.` });
    }
  }
  for (const s of SUPERLATIVES) {
    if (new RegExp(`(^|[^a-zäöü])${s}`, 'i').test(text) && !index.lower.includes(s)) {
      findings.push({ kind: 'werbung', term: s, message: `Werbliche Formulierung «${s}…» ohne Faktenbasis.` });
    }
  }
  return findings;
}

// Prüft alle KI-Texte. Rückgabe: { [pfad]: findings[] } nur für Texte mit Treffern.
export function guardTexts(texts, factBaseResult) {
  const index = buildFactIndex(factBaseResult);
  const out = {};
  const put = (path, f) => { if (f.length) out[path] = f; };
  put('title', checkText(texts.title, index));
  for (const { key } of OVERVIEW_PARTS) put(`overview.${key}`, checkText(texts.overview[key], index));
  texts.arguments.forEach((a, i) => {
    const f = checkText(`${a.title}. ${a.text}`, index);
    const unknown = (a.basis || []).filter((k) => !index.keys.has(k));
    if (unknown.length) f.push({ kind: 'basis', term: unknown.join(', '), message: `Argument verweist auf nicht erfasste Angaben: ${unknown.join(', ')}.` });
    if (texts.provider !== 'offline' && !(a.basis || []).length) f.push({ kind: 'basis', term: '', message: 'Argument ohne Faktenbezug.' });
    put(`arguments.${i}`, f);
  });
  return out;
}
