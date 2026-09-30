// Faktenprüfung vor Textgenerierung und Export.
// error   = Export nicht möglich (Pflichtangabe fehlt, Wert ungültig)
// warning = Export möglich, aber Angaben widersprechen sich oder sind unplausibel
import { SECTIONS, isEmpty, toNumber } from './schema.js';
import { unitTotals } from './facts.js';
import { fmtArea, fmtChf } from './format.js';

const NUMERIC = new Set(['number', 'integer', 'year', 'money', 'percent', 'area']);

export function validateProperty(p, { now = new Date() } = {}) {
  const out = [];
  const err = (section, field, message) => out.push({ level: 'error', section, field, message });
  const warn = (section, field, message) => out.push({ level: 'warning', section, field, message });
  const year = now.getFullYear();

  // 1. Typ- und Pflichtprüfung aus dem Schema
  const checkFields = (sectionTitle, fields, obj, prefix = '') => {
    for (const f of fields) {
      const v = obj ? obj[f.key] : undefined;
      const label = prefix + f.label;
      if (f.required && isEmpty(v)) { err(sectionTitle, label, 'Pflichtangabe fehlt.'); continue; }
      if (isEmpty(v) || f.type === 'bool') continue;
      if (NUMERIC.has(f.type)) {
        const n = toNumber(v);
        if (n === null) { err(sectionTitle, label, `«${v}» ist keine gültige Zahl.`); continue; }
        if (n < 0) err(sectionTitle, label, 'Negative Werte sind nicht zulässig.');
        if (f.type === 'integer' && !Number.isInteger(n)) err(sectionTitle, label, 'Nur ganze Zahlen.');
        if (f.type === 'year' && (n < 1200 || n > year + 5)) err(sectionTitle, label, `Jahr ${n} ist nicht plausibel.`);
        if (f.min !== undefined && n < f.min) err(sectionTitle, label, `Mindestens ${f.min}.`);
        if (f.max !== undefined && n > f.max) err(sectionTitle, label, `Höchstens ${f.max}.`);
      }
      if (f.pattern && !new RegExp(f.pattern).test(String(v).trim())) err(sectionTitle, label, 'Format ungültig.');
      if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())) warn(sectionTitle, label, 'E-Mail-Adresse prüfen.');
      if (f.type === 'phone' && !/^[+0-9 ()/-]{7,}$/.test(String(v).trim())) warn(sectionTitle, label, 'Telefonnummer prüfen.');
      if (f.type === 'select' && f.options && !f.options.includes(v)) err(sectionTitle, label, 'Ungültige Auswahl.');
    }
  };

  for (const s of SECTIONS) {
    if (s.list) {
      const items = p[s.id] || [];
      if (s.minItems && !items.some((it) => s.fields.some((f) => f.required && !isEmpty(it[f.key])))) {
        err(s.title, s.itemLabel, `Mindestens ${s.minItems === 1 ? 'eine' : s.minItems} ${s.itemLabel} erfassen.`);
      }
      items.forEach((it, i) => {
        const allEmpty = s.fields.every((f) => isEmpty(it[f.key]) || it[f.key] === f.default);
        if (allEmpty && items.length > 1) return; // leere Zusatzzeile ignorieren
        checkFields(s.title, s.fields, it, `${s.itemLabel} ${i + 1}: `);
      });
      if (s.extra) checkFields(s.title, s.extra, p[s.id + 'Extra']);
    } else {
      checkFields(s.title, s.fields, p[s.id]);
      if (s.listExtra) (p[s.id][s.listExtra.key] || []).forEach((it, i) => checkFields(s.title, s.listExtra.fields, it, `${s.listExtra.itemLabel} ${i + 1}: `));
    }
  }

  // 2. Konsistenz der Fakten
  const o = p.object, f = p.finance || {};
  const t = unitTotals(p);
  const built = toNumber(o.yearBuilt);

  const living = toNumber(o.livingArea);
  if (living && t.areaComplete && t.livingAreaSum > 0) {
    const diff = Math.abs(t.livingAreaSum - living) / living;
    if (diff > 0.05) warn('Einheiten', 'Fläche', `Summe der Wohnungsflächen (${fmtArea(t.livingAreaSum)}) weicht von der Wohnfläche total (${fmtArea(living)}) ab.`);
  }
  if (o.type === 'Einfamilienhaus' && (t.byKind.Wohnung || 0) > 1) warn('Objekt', 'Objektart', 'Einfamilienhaus mit mehreren Wohnungen – Objektart prüfen.');
  if (o.type === 'Eigentumswohnung' && t.total > 1) warn('Objekt', 'Objektart', 'Eigentumswohnung mit mehreren Einheiten – Objektart prüfen.');
  if (o.type === 'Zweifamilienhaus' && (t.byKind.Wohnung || 0) !== 2 && t.total) warn('Objekt', 'Objektart', `Zweifamilienhaus mit ${t.byKind.Wohnung || 0} Wohnungen – Objektart oder Einheiten prüfen.`);
  if (o.type === 'Grundstück' && t.total) warn('Einheiten', 'Einheiten', 'Grundstück mit erfassten Einheiten – Objektart prüfen.');

  const ist = toNumber(f.rentActual), soll = toNumber(f.rentTarget);
  if (ist && soll && ist > soll) warn('Finanzen', 'IST-Mietertrag', `IST-Mietertrag (${fmtChf(ist)}) liegt über dem SOLL-Mietertrag (${fmtChf(soll)}).`);
  if (ist && t.rentComplete && t.rentMonthly > 0) {
    const yearly = t.rentMonthly * 12;
    if (Math.abs(yearly - ist) / ist > 0.02) warn('Finanzen', 'IST-Mietertrag', `Summe der Einzelmieten × 12 (${fmtChf(yearly)}) stimmt nicht mit dem IST-Mietertrag (${fmtChf(ist)}) überein.`);
  }
  const occ = toNumber(f.occupancy);
  if (occ !== null && ist && soll && occ === 100 && ist < soll * 0.9) warn('Finanzen', 'Vermietungsstand', 'Vermietungsstand 100 %, aber IST deutlich unter SOLL – Angaben prüfen.');
  if (f.priceLabel === 'Preis auf Anfrage' && !isEmpty(f.price)) warn('Finanzen', 'Preis', 'Preis ist erfasst, wird wegen «Preis auf Anfrage» aber nicht ausgewiesen.');
  if (f.showGrossYield && (!ist || !toNumber(f.price) || f.priceLabel === 'Preis auf Anfrage')) warn('Finanzen', 'Bruttorendite', 'Bruttorendite kann ohne IST-Mietertrag und Preis nicht berechnet werden.');

  for (const inv of p.investments || []) {
    const y = toNumber(inv.year);
    if (y && built && y < built) warn('Investitionen', `Massnahme ${inv.year}`, `Jahr ${y} liegt vor dem Baujahr ${built}.`);
  }

  const parcels = ((p.land && p.land.parcels) || []).filter((x) => !isEmpty(x.number));
  const plot = toNumber(o.plotArea);
  if (plot && parcels.length && parcels.every((x) => toNumber(x.area))) {
    const sum = parcels.reduce((a, x) => a + toNumber(x.area), 0);
    if (Math.abs(sum - plot) > 1) warn('Grundstück / Rechtliches', 'Parzellen', `Summe der Parzellenflächen (${fmtArea(sum)}) entspricht nicht der Grundstücksfläche (${fmtArea(plot)}).`);
  }
  for (const x of parcels) {
    const m = /^\s*(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)\s*$/.exec(String(x.share || ''));
    if (m && toNumber(m[1]) > toNumber(m[2])) err('Grundstück / Rechtliches', `Parzelle ${x.number}`, `Anteil ${x.share} ist grösser als 1.`);
  }
  const numbers = parcels.map((x) => String(x.number).trim());
  if (new Set(numbers).size !== numbers.length) warn('Grundstück / Rechtliches', 'Parzellen', 'Eine Parzellennummer ist doppelt erfasst.');

  return out;
}

export function hasErrors(issues) {
  return issues.some((i) => i.level === 'error');
}
