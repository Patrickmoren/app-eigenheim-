// Aufbereitung der erfassten Fakten.
//
// Hier wird nichts formuliert und nichts ergänzt: Aus den Eingaben entstehen strukturierte
// Faktenzeilen (Quelle FACT) und – klar gekennzeichnet – rein rechnerische Ableitungen
// (Quelle DERIVED, z. B. Summe der Einheiten, Bruttorendite). Was fehlt, wird als MISSING
// gelistet und erscheint im Dokument nicht.
import { isEmpty, toNumber, SECTIONS } from './schema.js';
import { fmtArea, fmtChf, fmtNumber, fmtPercent, fmtRooms, joinNonEmpty } from './format.js';

export const SOURCE = { FACT: 'fact', DERIVED: 'derived', AI: 'ai', FIXED: 'fixed', MISSING: 'missing' };

export function addressLine(p) {
  return joinNonEmpty([p.object.street, joinNonEmpty([p.object.zip, p.object.city], ' ')], ', ');
}

export function unitLabel(u) {
  const kind = u.kind || 'Wohnung';
  const rooms = toNumber(u.rooms);
  if (kind === 'Wohnung' && rooms !== null) return `${fmtRooms(rooms)}-Zimmer-Wohnung`;
  if (rooms !== null) return `${kind} (${fmtRooms(rooms)} Zi.)`;
  return kind;
}

function plural(kind, n) {
  if (n === 1) return kind;
  const map = { Wohnung: 'Wohnungen', Gewerbe: 'Gewerbeeinheiten', Büro: 'Büros', Atelier: 'Ateliers', Lager: 'Lager', Andere: 'weitere Einheiten' };
  return map[kind] || kind;
}

// Eine Einheitenzeile zählt erst, wenn mehr als die Vorgabewerte (1 × Wohnung) erfasst ist.
export function filledUnits(p) {
  return (p.units || []).filter((u) => toNumber(u.count) > 0 && (
    ['rooms', 'area', 'floor', 'rent', 'features'].some((k) => !isEmpty(u[k]))
    || (u.kind && u.kind !== 'Wohnung') || toNumber(u.count) !== 1));
}

export function unitTotals(p) {
  const units = filledUnits(p);
  const byKind = {};
  let total = 0, area = 0, areaComplete = true, rentMonthly = 0, rentComplete = true;
  for (const u of units) {
    const c = toNumber(u.count) || 0;
    total += c;
    const k = u.kind || 'Wohnung';
    byKind[k] = (byKind[k] || 0) + c;
    const a = toNumber(u.area);
    if (a === null) areaComplete = false; else if (k === 'Wohnung') area += a * c;
    const r = toNumber(u.rent);
    if (r === null) rentComplete = false; else rentMonthly += r * c;
  }
  return { units, total, byKind, livingAreaSum: area, areaComplete, rentMonthly, rentComplete };
}

// "2 × 4.5-Zimmer-Wohnung (je ca. 100 m²)" – eine Zeile je Eingabezeile
export function unitLines(p, { features = true } = {}) {
  return filledUnits(p).map((u) => {
    const c = toNumber(u.count);
    const a = toNumber(u.area);
    const area = a === null ? '' : `${c > 1 ? 'je ' : ''}ca. ${fmtArea(a)}`;
    const detail = joinNonEmpty([u.floor, area, features ? u.features : ''], ', ');
    return `${c} × ${unitLabel(u)}${detail ? ` (${detail})` : ''}`;
  });
}

export function unitSummary(p) {
  const { byKind, total } = unitTotals(p);
  if (!total) return '';
  return Object.entries(byKind).map(([k, n]) => `${n} ${plural(k, n)}`).join(', ');
}

export function parkingSummary(p) {
  const k = p.parking || {};
  const parts = [];
  const n = (v) => toNumber(v);
  if (n(k.garage) > 0) parts.push(`${n(k.garage)} ${n(k.garage) === 1 ? 'Einstellplatz / gedeckter Parkplatz' : 'Einstellplätze / gedeckte Parkplätze'}`);
  if (n(k.outdoor) > 0) parts.push(`${n(k.outdoor)} ${n(k.outdoor) === 1 ? 'Aussenparkplatz' : 'Aussenparkplätze'}`);
  if (n(k.visitor) > 0) parts.push(`${n(k.visitor)} ${n(k.visitor) === 1 ? 'Besucherparkplatz' : 'Besucherparkplätze'}`);
  if (!isEmpty(k.other)) parts.push(String(k.other).trim());
  return parts.join(', ');
}

export function designation(p) {
  if (!isEmpty(p.object.designation)) return String(p.object.designation).trim();
  const t = isEmpty(p.object.type) ? 'Liegenschaft' : p.object.type;
  return isEmpty(p.object.city) ? t : `${t} in ${p.object.city}`;
}

export function sortedInvestments(p) {
  return (p.investments || [])
    .filter((i) => !isEmpty(i.year) && !isEmpty(i.measure))
    .slice()
    .sort((a, b) => (toNumber(b.year) || 0) - (toNumber(a.year) || 0));
}

export function grossYield(p) {
  const f = p.finance || {};
  if (!f.showGrossYield) return null;
  const rent = toNumber(f.rentActual), price = toNumber(f.price);
  if (!rent || !price || f.priceLabel === 'Preis auf Anfrage') return null;
  return (rent / price) * 100;
}

export function priceText(p) {
  const f = p.finance || {};
  if (f.priceLabel === 'Preis auf Anfrage') return { label: 'Preis', value: 'auf Anfrage' };
  if (isEmpty(f.price)) return null;
  return { label: f.priceLabel || 'Verkaufsrichtpreis', value: fmtChf(f.price) };
}

// Facts & Figures: [Bezeichnung, Wert, Quelle] – nur vorhandene Angaben.
export function factRows(p, { unitFeatures = true, unitSummary: summaryOnly = false, price: withPrice = true, parcels: withParcels = true } = {}) {
  const o = p.object, l = p.land || {};
  const rows = [];
  const add = (label, value, source = SOURCE.FACT) => { if (!isEmpty(value)) rows.push({ label, value: String(value), source }); };
  add('Adresse', addressLine(p));
  add('Objektart', o.type);
  const parcels = (l.parcels || []).filter((x) => !isEmpty(x.number));
  if (parcels.length && withParcels) add(parcels.length === 1 ? 'Grundstücksnummer' : 'Parzellen', parcels.map((x) => x.number).join(', '));
  add('Grundstücksfläche', fmtArea(o.plotArea));
  add('Wohnfläche', isEmpty(o.livingArea) ? '' : `ca. ${fmtArea(o.livingArea)}`);
  add('Nutzfläche Gewerbe', isEmpty(o.usableArea) ? '' : `ca. ${fmtArea(o.usableArea)}`);
  const lines = summaryOnly ? [unitSummary(p)].filter(Boolean) : unitLines(p, { features: unitFeatures });
  if (lines.length) add(unitTotals(p).total === 1 ? 'Einheit' : 'Einheiten', lines.join('\n'));
  add('Nebenräume', p.unitsExtra && p.unitsExtra.annex);
  add('Parkierung', parkingSummary(p));
  add('Baujahr', o.yearBuilt);
  add('Zustand', o.condition);
  add('Wärmeerzeugung', o.heating);
  add('Grundlasten / Dienstbarkeiten', l.encumbrances);
  add('Verfügbar ab', o.availableFrom);
  const price = priceText(p);
  if (price && withPrice) add(price.label, price.value);
  return rows;
}

export function financeRows(p) {
  const f = p.finance || {};
  const rows = [];
  const add = (label, value, source = SOURCE.FACT) => { if (!isEmpty(value)) rows.push({ label, value: String(value), source }); };
  add('Mietertrag IST netto p.a.', isEmpty(f.rentActual) ? '' : fmtChf(f.rentActual));
  add('Mietertrag SOLL netto p.a.', isEmpty(f.rentTarget) ? '' : fmtChf(f.rentTarget));
  add('Vermietungsstand', isEmpty(f.occupancy) ? '' : fmtPercent(f.occupancy));
  add('Nebenkosten', f.ancillary);
  add('Gebäudeversicherung', isEmpty(f.insuranceValue) ? '' : fmtChf(f.insuranceValue));
  for (const k of f.kpis || []) add(k.label, k.value);
  const y = grossYield(p);
  if (y !== null) add('Bruttorendite (berechnet)', `${y.toFixed(2)} %`, SOURCE.DERIVED);
  const price = priceText(p);
  if (price && rows.length) add(price.label, price.value);
  return rows;
}

export function landRows(p) {
  const l = p.land || {};
  const rows = [];
  const add = (label, value) => { if (!isEmpty(value)) rows.push({ label, value: String(value), source: SOURCE.FACT }); };
  add('Eigentum', l.ownership);
  add('Zone', l.zone);
  add('ÖREB', l.oereb);
  add('Baulinien', l.buildingLines);
  add('Lärmempfindlichkeit', l.noiseLevel);
  return rows;
}

export function parcelTable(p) {
  const parcels = ((p.land && p.land.parcels) || []).filter((x) => !isEmpty(x.number));
  if (!parcels.length) return null;
  const cols = [
    { key: 'number', label: 'Parzelle', w: 1 },
    { key: 'area', label: 'Fläche', fmt: fmtArea, w: 1 },
    { key: 'ownership', label: 'Eigentum', w: 1.7 },
    { key: 'share', label: 'Anteil', w: 1 },
    { key: 'note', label: 'Bemerkung', w: 2.2 },
  ].filter((c) => parcels.some((x) => !isEmpty(x[c.key])));
  // Eine Parzelle mit nur Nummer/Fläche steht bereits in den Facts & Figures – keine Tabelle nötig.
  if (parcels.length === 1 && cols.every((c) => c.key === 'number' || c.key === 'area')) return null;
  return {
    header: cols.map((c) => c.label),
    weights: cols.map((c) => c.w),
    rows: parcels.map((x) => cols.map((c) => (isEmpty(x[c.key]) ? '–' : (c.fmt ? c.fmt(x[c.key]) : String(x[c.key]))))),
  };
}

export function unitTable(p) {
  const units = filledUnits(p);
  const hasDetail = units.some((u) => !isEmpty(u.rent) || !isEmpty(u.floor));
  if (!hasDetail) return null;
  const cols = [
    { label: 'Einheit', w: 2, get: (u) => `${toNumber(u.count) > 1 ? toNumber(u.count) + ' × ' : ''}${unitLabel(u)}` },
    { label: 'Geschoss', w: 1.3, get: (u) => u.floor, opt: true },
    { label: 'Fläche', w: 1, get: (u) => (isEmpty(u.area) ? '' : `ca. ${fmtArea(u.area)}`), opt: true },
    { label: 'Netto/Mt.', w: 1.1, get: (u) => (isEmpty(u.rent) ? '' : fmtChf(u.rent)), opt: true },
    { label: 'Merkmale', w: 2.8, get: (u) => u.features, opt: true },
  ].filter((c) => !c.opt || units.some((u) => !isEmpty(c.get(u))));
  return { header: cols.map((c) => c.label), weights: cols.map((c) => c.w), rows: units.map((u) => cols.map((c) => (isEmpty(c.get(u)) ? '–' : String(c.get(u))))) };
}

export function processSteps(p) {
  const r = p.process || {};
  const steps = [];
  const add = (title, detail) => steps.push({ title, detail: isEmpty(detail) ? '' : String(detail) });
  if (r.ndaRequired) add('Geheimhaltungsverpflichtung', 'Unterzeichnet retournieren; danach Zustellung der Verkaufsunterlagen');
  if (!isEmpty(r.viewing)) add('Besichtigung', r.viewing);
  if (!isEmpty(r.indicativeOffer)) add('Indikatives Angebot', `bis ${r.indicativeOffer}`);
  if (!isEmpty(r.dueDiligence)) add('Due Diligence', r.dueDiligence);
  if (!isEmpty(r.bindingOffer)) add('Bindende Offerte', `bis ${r.bindingOffer}`);
  if (!isEmpty(r.timeline)) add('Vollzug', r.timeline);
  // Nur die NDA allein ist noch kein Prozess, der eine eigene Rubrik rechtfertigt – ausser es ist das Einzige.
  return steps;
}

export function keyFigures(p) {
  // Kennzahlen-Leiste unter dem Titel: höchstens vier, in fester Priorität, nur vorhandene Werte.
  const o = p.object, f = p.finance || {};
  const t = unitTotals(p);
  const cand = [];
  if (t.total) cand.push({ value: String(t.total), label: t.total === 1 ? 'Einheit' : (Object.keys(t.byKind).length === 1 && t.byKind.Wohnung ? 'Wohnungen' : 'Einheiten') });
  if (!isEmpty(o.plotArea)) cand.push({ value: fmtArea(o.plotArea), label: 'Grundstück' });
  if (!isEmpty(o.livingArea)) cand.push({ value: fmtArea(o.livingArea), label: 'Wohnfläche' });
  if (!isEmpty(f.rentActual)) cand.push({ value: fmtChf(f.rentActual), label: 'Mietertrag IST p.a.' });
  if (!isEmpty(o.yearBuilt)) cand.push({ value: String(o.yearBuilt), label: 'Baujahr' });
  // Ein vorhandener Preis steht immer als letzte Kachel.
  const price = priceText(p);
  if (price && price.value !== 'auf Anfrage') return [...cand.slice(0, 3), { value: price.value, label: price.label }];
  return cand.slice(0, 4);
}

// Liste fehlender optionaler Angaben (für die Eingabemaske, nie im Dokument).
export function missingFields(p) {
  const out = [];
  for (const s of SECTIONS) {
    if (s.list) {
      if (!(p[s.id] || []).length) out.push({ section: s.title, field: s.itemLabel });
      continue;
    }
    for (const f of s.fields) {
      if (f.type === 'bool' || f.key === 'designation' || f.key === 'priceLabel') continue;
      if (isEmpty(p[s.id][f.key])) out.push({ section: s.title, field: f.label, required: !!f.required });
    }
  }
  return out;
}

// Kompakte Faktenbasis für die KI: nur vorhandene Werte, bereits formatiert, mit stabilen Schlüsseln.
export function factBase(p) {
  const o = p.object, f = p.finance || {}, l = p.land || {}, r = p.process || {}, m = p.marketing || {};
  const base = {
    adresse: addressLine(p),
    ort: o.city,
    objektart: o.type,
    objektbezeichnung: o.designation,
    grundstuecksflaeche: isEmpty(o.plotArea) ? '' : fmtArea(o.plotArea),
    wohnflaeche: isEmpty(o.livingArea) ? '' : fmtArea(o.livingArea),
    nutzflaeche_gewerbe: isEmpty(o.usableArea) ? '' : fmtArea(o.usableArea),
    baujahr: o.yearBuilt,
    zustand: o.condition,
    waermeerzeugung: o.heating,
    verfuegbar_ab: o.availableFrom,
    lage: o.location,
    einheiten: unitLines(p).join('; '),
    einheiten_total: unitSummary(p),
    nebenraeume: p.unitsExtra && p.unitsExtra.annex,
    parkierung: parkingSummary(p),
    mietertrag_ist: isEmpty(f.rentActual) ? '' : `${fmtChf(f.rentActual)} p.a.`,
    mietertrag_soll: isEmpty(f.rentTarget) ? '' : `${fmtChf(f.rentTarget)} p.a.`,
    vermietungsstand: isEmpty(f.occupancy) ? '' : fmtPercent(f.occupancy),
    preis: priceText(p) ? `${priceText(p).label}: ${priceText(p).value}` : '',
    eigentum: l.ownership,
    zone: l.zone,
    oereb: l.oereb,
    grundlasten: l.encumbrances,
    investitionen: sortedInvestments(p).map((i) => `${i.year}: ${i.measure}`).join('; '),
    besonderheiten: m.highlights,
    potenzial: m.potential,
    ausgangslage: r.situation,
  };
  const facts = {}, missing = [];
  for (const [k, v] of Object.entries(base)) {
    if (isEmpty(v)) missing.push(k); else facts[k] = String(v).trim();
  }
  return { facts, missing };
}

export { fmtNumber };
