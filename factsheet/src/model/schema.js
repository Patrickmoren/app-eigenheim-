// Datenmodell eines Verkaufsobjekts.
//
// Das Schema ist die einzige Quelle für:
//   - die Eingabemaske (Abschnitte, Felder, Pflicht/optional, Hilfetexte)
//   - die Validierung (Typ, Pflicht, Wertebereich)
//   - die Faktenaufbereitung für Factsheet, NDA und später das Verkaufsexposé
//
// Die Daten werden genau einmal erfasst. Jeder Dokumenttyp liest daraus nur, was er braucht.
// Der Code läuft unverändert im Browser und in Node (reine ES-Module ohne Abhängigkeiten).

export const SCHEMA_VERSION = 1;

export const OBJECT_TYPES = [
  'Mehrfamilienhaus',
  'Zweifamilienhaus',
  'Wohn- und Geschäftshaus',
  'Einfamilienhaus',
  'Eigentumswohnung',
  'Gewerbeobjekt',
  'Grundstück',
  'Andere',
];

export const UNIT_TYPES = ['Wohnung', 'Gewerbe', 'Büro', 'Atelier', 'Lager', 'Andere'];

export const PRICE_LABELS = ['Verkaufsrichtpreis', 'Kaufpreisvorstellung', 'Preis auf Anfrage'];

// Feldtypen: text | textarea | number | integer | year | money | percent | area | select | bool | date | email | phone
// level: 'basis' = Pflicht- oder Kernfeld (Schritt 2), 'detail' = optional (Schritt 3)
export const SECTIONS = [
  {
    id: 'object',
    title: 'Objekt',
    level: 'basis',
    fields: [
      { key: 'street', label: 'Strasse / Nr.', type: 'text', required: true, placeholder: 'Neumattstrasse 15' },
      { key: 'zip', label: 'PLZ', type: 'text', required: true, pattern: '^[0-9]{4}$', placeholder: '4227' },
      { key: 'city', label: 'Ort', type: 'text', required: true, placeholder: 'Büsserach' },
      { key: 'type', label: 'Objektart', type: 'select', options: OBJECT_TYPES, required: true },
      { key: 'designation', label: 'Objektbezeichnung (optional)', type: 'text',
        help: 'Wird sonst aus Objektart und Ort gebildet, z. B. «Mehrfamilienhaus mit Einstellhalle».' },
      { key: 'plotArea', label: 'Grundstücksfläche', type: 'area', unit: 'm²', required: true },
      { key: 'livingArea', label: 'Wohnfläche total', type: 'area', unit: 'm²',
        help: 'Summe der Wohnflächen. Wird mit den Einheiten abgeglichen.' },
      { key: 'usableArea', label: 'Nutzfläche Gewerbe', type: 'area', unit: 'm²' },
      { key: 'yearBuilt', label: 'Baujahr', type: 'year' },
      { key: 'condition', label: 'Zustand', type: 'textarea', rows: 2,
        help: 'Nur Tatsachen, z. B. «EG-Wohnung 2020 renoviert, OG-Wohnung im Originalzustand».' },
      { key: 'heating', label: 'Wärmeerzeugung', type: 'text', placeholder: 'Ölheizung (2001)' },
      { key: 'availableFrom', label: 'Verfügbar ab', type: 'text', placeholder: 'Nach Vereinbarung' },
      { key: 'location', label: 'Lage (Fakten)', type: 'textarea', rows: 3,
        help: 'Distanzen, ÖV, Schulen, Einkauf – nur belegbare Angaben. Die KI übernimmt nur, was hier steht.' },
    ],
  },
  {
    id: 'units',
    title: 'Einheiten',
    level: 'basis',
    list: true,
    minItems: 1,
    itemLabel: 'Einheit',
    fields: [
      { key: 'count', label: 'Anzahl', type: 'integer', required: true, min: 1, default: 1 },
      { key: 'kind', label: 'Art', type: 'select', options: UNIT_TYPES, default: 'Wohnung' },
      { key: 'rooms', label: 'Zimmer', type: 'number', step: 0.5 },
      { key: 'area', label: 'Fläche je Einheit', type: 'area', unit: 'm²' },
      { key: 'floor', label: 'Geschoss', type: 'text', placeholder: 'EG' },
      { key: 'rent', label: 'Nettomiete je Einheit / Mt.', type: 'money', unit: 'CHF' },
      { key: 'features', label: 'Merkmale', type: 'text', placeholder: 'Gartensitzplatz, 2020 renoviert' },
    ],
    extra: [
      { key: 'annex', label: 'Nebenräume', type: 'textarea', rows: 2,
        placeholder: 'Keller, Waschküche, Estrich' },
    ],
  },
  {
    id: 'parking',
    title: 'Parkierung',
    level: 'basis',
    fields: [
      { key: 'garage', label: 'Einstellplätze / gedeckt', type: 'integer', min: 0 },
      { key: 'outdoor', label: 'Aussenparkplätze', type: 'integer', min: 0 },
      { key: 'visitor', label: 'Besucherparkplätze', type: 'integer', min: 0 },
      { key: 'other', label: 'Weitere Parkierung', type: 'text' },
    ],
  },
  {
    id: 'finance',
    title: 'Finanzen',
    level: 'detail',
    fields: [
      { key: 'rentActual', label: 'IST-Mietertrag netto p.a.', type: 'money', unit: 'CHF' },
      { key: 'rentTarget', label: 'SOLL-Mietertrag netto p.a.', type: 'money', unit: 'CHF' },
      { key: 'occupancy', label: 'Vermietungsstand', type: 'percent', unit: '%', min: 0, max: 100 },
      { key: 'ancillary', label: 'Nebenkosten p.a.', type: 'text', placeholder: 'CHF 3\'000 pauschal' },
      { key: 'priceLabel', label: 'Preisbezeichnung', type: 'select', options: PRICE_LABELS, default: 'Verkaufsrichtpreis' },
      { key: 'price', label: 'Preis', type: 'money', unit: 'CHF' },
      { key: 'insuranceValue', label: 'Gebäudeversicherungswert', type: 'money', unit: 'CHF' },
      { key: 'showGrossYield', label: 'Bruttorendite aus Preis und IST-Mietertrag berechnen und ausweisen', type: 'bool',
        help: 'Reine Rechnung aus zwei erfassten Zahlen; wird im Dokument als «berechnet» gekennzeichnet.' },
    ],
    listExtra: {
      key: 'kpis', title: 'Weitere Kennzahlen', itemLabel: 'Kennzahl',
      fields: [
        { key: 'label', label: 'Bezeichnung', type: 'text', required: true },
        { key: 'value', label: 'Wert', type: 'text', required: true },
      ],
    },
  },
  {
    id: 'land',
    title: 'Grundstück / Rechtliches',
    level: 'detail',
    fields: [
      { key: 'ownership', label: 'Eigentumsverhältnisse', type: 'text', placeholder: 'Alleineigentum' },
      { key: 'zone', label: 'Zone', type: 'text', placeholder: 'Wohnzone W2' },
      { key: 'oereb', label: 'ÖREB', type: 'textarea', rows: 2 },
      { key: 'buildingLines', label: 'Baulinien', type: 'text' },
      { key: 'noiseLevel', label: 'Lärmempfindlichkeitsstufe', type: 'text', placeholder: 'ES II' },
      { key: 'encumbrances', label: 'Grundlasten / Dienstbarkeiten', type: 'text' },
    ],
    listExtra: {
      key: 'parcels', title: 'Parzellen', itemLabel: 'Parzelle',
      fields: [
        { key: 'number', label: 'Parzelle / GB-Nr.', type: 'text', required: true },
        { key: 'area', label: 'Fläche', type: 'area', unit: 'm²' },
        { key: 'ownership', label: 'Eigentum', type: 'text', placeholder: 'Miteigentum' },
        { key: 'share', label: 'Anteil', type: 'text', placeholder: '500/1000' },
        { key: 'note', label: 'Bemerkung', type: 'text' },
      ],
    },
  },
  {
    id: 'investments',
    title: 'Investitionen',
    level: 'detail',
    list: true,
    itemLabel: 'Massnahme',
    fields: [
      { key: 'year', label: 'Jahr', type: 'year', required: true },
      { key: 'measure', label: 'Massnahme', type: 'text', required: true },
    ],
  },
  {
    id: 'marketing',
    title: 'Vermarktungsargumente',
    level: 'detail',
    fields: [
      { key: 'highlights', label: 'Was ist an diesem Objekt besonders?', type: 'textarea', rows: 4,
        help: 'Stichworte genügen. Die KI formuliert daraus die Investorenargumente – sie ergänzt nichts.' },
      { key: 'potential', label: 'Potenzial (Ausbau, Miete, Entwicklung)', type: 'textarea', rows: 3,
        help: 'Nur erfasstes Potenzial wird erwähnt.' },
    ],
  },
  {
    id: 'process',
    title: 'Verkaufsprozess',
    level: 'detail',
    fields: [
      { key: 'situation', label: 'Ausgangslage / Verkaufsgrund', type: 'textarea', rows: 2,
        help: 'Z. B. «Die Eigentümerschaft hat Schaeppi mit dem Verkauf beauftragt.»' },
      { key: 'ndaRequired', label: 'Unterzeichnete Geheimhaltungsverpflichtung erforderlich', type: 'bool', default: false },
      { key: 'stages', label: 'Verfahren', type: 'select', options: ['', 'einstufig', 'zweistufig'] },
      { key: 'viewing', label: 'Besichtigung', type: 'text', placeholder: 'Nach Vereinbarung' },
      { key: 'indicativeOffer', label: 'Indikatives Angebot bis', type: 'text', placeholder: '31.10.2026' },
      { key: 'dueDiligence', label: 'Due Diligence', type: 'text', placeholder: 'Datenraum ab November 2026' },
      { key: 'bindingOffer', label: 'Bindende Offerte bis', type: 'text' },
      { key: 'timeline', label: 'Gewünschter Zeitplan / Vollzug', type: 'text', placeholder: 'Eigentumsübertragung Q1 2027' },
    ],
  },
  {
    id: 'contacts',
    title: 'Ansprechpartner',
    level: 'basis',
    list: true,
    minItems: 1,
    maxItems: 2,
    itemLabel: 'Ansprechpartner',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'role', label: 'Funktion', type: 'text' },
      { key: 'phone', label: 'Telefon', type: 'phone' },
      { key: 'email', label: 'E-Mail', type: 'email' },
    ],
  },
];

// Bildpositionen sind im Template festgelegt. Seitenverhältnis = Breite/Höhe des Rahmens.
export const IMAGE_SLOTS = [
  { key: 'cover', label: 'Titelbild', aspect: 174 / 72 },
  { key: 'object', label: 'Objektfoto', aspect: 85 / 56 },
  { key: 'location', label: 'Lagefoto / Situationsplan', aspect: 85 / 56 },
  { key: 'floorplan', label: 'Grundriss', aspect: 85 / 56 },
];

export const NDA_FIELDS = [
  { key: 'company', label: 'Unternehmen (Interessent)', type: 'text' },
  { key: 'address', label: 'Adresse Interessent', type: 'text' },
  { key: 'representative', label: 'Vertreten durch', type: 'text' },
  { key: 'place', label: 'Ort der Unterzeichnung', type: 'text', default: 'Basel' },
  { key: 'date', label: 'Datum', type: 'text' },
  { key: 'durationYears', label: 'Laufzeit (Jahre)', type: 'integer', default: 2 },
];

function defaultsFor(fields) {
  const o = {};
  for (const f of fields) o[f.key] = f.default !== undefined ? f.default : (f.type === 'bool' ? false : '');
  return o;
}

export function createEmptyItem(sectionId, listKey) {
  const s = SECTIONS.find((x) => x.id === sectionId);
  const fields = listKey ? s.listExtra.fields : s.fields;
  return defaultsFor(fields);
}

export function createEmptyProperty() {
  const p = { schemaVersion: SCHEMA_VERSION, meta: { confidential: true, docLabel: 'Akquisitionsgelegenheit' } };
  for (const s of SECTIONS) {
    if (s.list) {
      p[s.id] = s.minItems ? [defaultsFor(s.fields)] : [];
      if (s.extra) p[s.id + 'Extra'] = defaultsFor(s.extra);
    } else {
      p[s.id] = defaultsFor(s.fields);
      if (s.listExtra) p[s.id][s.listExtra.key] = [];
    }
  }
  p.nda = defaultsFor(NDA_FIELDS);
  p.images = {};
  return p;
}

// Bringt beliebige (z. B. hochgeladene) Daten in die Form des Schemas.
// Unbekannte Felder werden verworfen, fehlende ergänzt. Werte werden als Text/Zahl/Bool normiert.
export function normalizeProperty(input) {
  const base = createEmptyProperty();
  if (!input || typeof input !== 'object') return base;
  const clean = (v, f) => {
    if (f.type === 'bool') return v === true || v === 'true' || v === 'on';
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') return Number.isFinite(v) ? v : '';
    return String(v).slice(0, 4000);
  };
  const pick = (src, fields) => {
    const o = defaultsFor(fields);
    if (!src || typeof src !== 'object') return o;
    for (const f of fields) if (f.key in src) o[f.key] = clean(src[f.key], f);
    return o;
  };
  for (const s of SECTIONS) {
    const src = input[s.id];
    if (s.list) {
      const arr = Array.isArray(src) ? src.slice(0, s.maxItems || 50) : [];
      base[s.id] = arr.map((it) => pick(it, s.fields));
      if (s.minItems && base[s.id].length === 0) base[s.id] = [defaultsFor(s.fields)];
      if (s.extra) base[s.id + 'Extra'] = pick(input[s.id + 'Extra'], s.extra);
    } else {
      base[s.id] = pick(src, s.fields);
      if (s.listExtra) {
        const arr = src && Array.isArray(src[s.listExtra.key]) ? src[s.listExtra.key].slice(0, 30) : [];
        base[s.id][s.listExtra.key] = arr.map((it) => pick(it, s.listExtra.fields));
      }
    }
  }
  base.nda = pick(input.nda, NDA_FIELDS);
  if (input.meta && typeof input.meta === 'object') {
    base.meta.confidential = input.meta.confidential !== false;
    if (typeof input.meta.docLabel === 'string') base.meta.docLabel = input.meta.docLabel.slice(0, 60);
  }
  base.images = {};
  if (input.images && typeof input.images === 'object') {
    for (const slot of IMAGE_SLOTS) {
      const v = input.images[slot.key];
      if (typeof v === 'string' && /^data:image\/(jpeg|png);base64,/.test(v)) base.images[slot.key] = v;
    }
  }
  return base;
}

// Leere Werte: '', null, undefined, NaN, reine Leerzeichen. 0 ist ein gültiger Wert.
export function isEmpty(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'number') return !Number.isFinite(v);
  if (typeof v === 'boolean') return false;
  return String(v).trim() === '';
}

// Zahl aus Schweizer Schreibweise: "42'600", "42 600.-", "CHF 995'000.–", "4,5"
export function toNumber(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (isEmpty(v)) return null;
  let s = String(v).replace(/CHF|Fr\.|m²|m2|%/gi, '').replace(/[’'`´\s]/g, '').replace(/\.[-–—]$/, '').replace(/[-–—]$/, '');
  if (/^\d+,\d+$/.test(s)) s = s.replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function fieldDef(sectionId, key) {
  const s = SECTIONS.find((x) => x.id === sectionId);
  if (!s) return null;
  return s.fields.find((f) => f.key === key) || (s.extra || []).find((f) => f.key === key) || null;
}
