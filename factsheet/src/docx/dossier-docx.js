// Finanzierungsdossier für Banken (Word, A4 hoch). Nur Fakten aus der Erfassung, keine Werbetexte.
// Gliederung nach den üblichen Anforderungen von Schweizer Banken: Objekt, Grundstück & Rechtliches,
// Gebäude & Zustand, Mieterspiegel, Erträge/Kosten/Werte, berechnete Kennzahlen, Unterlagen.
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, TableLayoutType, LineRuleType,
} from 'docx';
import { COLORS, PAGE, COMPANY, BOX } from '../layout/design.js';
import { isEmpty } from '../model/schema.js';
import {
  addressLine, designation, bankObjectRows, bankLegalRows, bankBuildingRows, bankFinanceRows, bankFigures, rentRoll, sortedInvestments, parcelTable,
} from '../model/facts.js';
import { fmtChf } from '../model/format.js';
import { documentChecklist } from '../model/checklist.js';
import { DISCLAIMER } from '../layout/factsheet.js';
import { tw, runs, para, spacer, headingRule, schaeppiHeader, schaeppiFooter, pageProperties, embeddedFonts, documentStyles } from './common.js';

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const LINE = { style: BorderStyle.SINGLE, size: 4, color: COLORS.line };
const W = PAGE.contentWidth;

function cell(children, width, { fill, pad = 3, borders } = {}) {
  return new TableCell({
    children,
    width: { size: tw(width), type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: 'auto' } : undefined,
    margins: { top: tw(pad), bottom: tw(pad), left: tw(BOX.kv.padX), right: tw(BOX.kv.padX) },
    borders: borders || { top: NONE, left: NONE, right: NONE, bottom: LINE },
  });
}

function kv(rows, { labelShare = 0.34 } = {}) {
  const lw = W * labelShare, vw = W - lw;
  return new Table({
    rows: rows.map((r) => new TableRow({ cantSplit: true, children: [
      cell([para(r.label, 'cellLabel', { first: true })], lw),
      cell([para(r.value, 'cell', { first: true })], vw),
    ] })),
    width: { size: tw(W), type: WidthType.DXA },
    columnWidths: [tw(lw), tw(vw)],
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
  });
}

function grid(t, { totals = null } = {}) {
  const sum = t.weights.reduce((a, b) => a + b, 0);
  const widths = t.weights.map((w) => (W * w) / sum);
  const head = new TableRow({ tableHeader: true, cantSplit: true, children: t.header.map((h, i) => cell([para(h, 'cellHead', { first: true })], widths[i], { fill: COLORS.navy })) });
  const body = t.rows.map((r, ri) => new TableRow({ cantSplit: true, children: r.map((c, i) => cell([para(c, 'cell', { first: true })], widths[i], { fill: ri % 2 ? COLORS.cream : undefined })) }));
  const rows = [head, ...body];
  if (totals) {
    rows.push(new TableRow({ cantSplit: true, children: totals.map((c, i) => cell([para(c, 'cell', { first: true, children: runs(c, 'cell', { bold: true, color: 'navy' }) })], widths[i], { borders: { top: { style: BorderStyle.SINGLE, size: 8, color: COLORS.navy }, bottom: LINE, left: NONE, right: NONE } })) }));
  }
  return new Table({ rows, width: { size: tw(W), type: WidthType.DXA }, columnWidths: widths.map(tw), layout: TableLayoutType.FIXED, borders: NO_BORDERS });
}

const STATUS_COLOR = { vorhanden: COLORS.navy, angefordert: '9A6700', fehlt: 'B3261E', optional: COLORS.muted, 'nicht relevant': COLORS.muted };

function checklistTable(list) {
  const t = { header: ['Unterlage', 'Status', 'Stand', 'Bemerkung'], weights: [3, 1.1, 0.9, 2], rows: [] };
  const sum = t.weights.reduce((a, b) => a + b, 0);
  const widths = t.weights.map((w) => (W * w) / sum);
  const head = new TableRow({ tableHeader: true, children: t.header.map((h, i) => cell([para(h, 'cellHead', { first: true })], widths[i], { fill: COLORS.navy })) });
  const body = list.map((r) => new TableRow({ cantSplit: true, children: [
    cell([para('', 'cell', { first: true, children: [...runs(r.name, 'cell'), ...(r.hint ? runs(` – ${r.hint}`, 'cell', { color: 'muted' }) : [])] })], widths[0]),
    cell([para('', 'cell', { first: true, children: runs(r.status, 'cell', { bold: true, color: STATUS_COLOR[r.status] || COLORS.text }) })], widths[1]),
    cell([para(r.date || '–', 'cell', { first: true })], widths[2]),
    cell([para(r.note || '', 'cell', { first: true })], widths[3]),
  ] }));
  return new Table({ rows: [head, ...body], width: { size: tw(W), type: WidthType.DXA }, columnWidths: widths.map(tw), layout: TableLayoutType.FIXED, borders: NO_BORDERS });
}

const h1 = (text) => para(text, 'h1', { keepNext: true, border: headingRule() });
const note = (text) => new Paragraph({ children: runs(text, 'caption'), spacing: { before: tw(4), after: tw(2) } });

export function dossierSections(p) {
  const inv = sortedInvestments(p);
  const rr = rentRoll(p);
  return {
    object: bankObjectRows(p), legal: bankLegalRows(p), parcels: parcelTable(p), building: bankBuildingRows(p),
    investments: inv, rentRoll: rr, finance: bankFinanceRows(p), figures: bankFigures(p), checklist: documentChecklist(p),
  };
}

// sources: optional { 'Bezeichnung': 'Quelle' } – erscheint als Quellenverzeichnis
export async function renderDossierDocx(p, { sources = null, date = new Date() } = {}) {
  const s = dossierSections(p);
  const stand = date.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const children = [
    para('Finanzierungsdossier', 'title', { first: true, children: runs('Finanzierungsdossier', 'title', { color: 'navy' }) }),
    para(addressLine(p), 'subtitle', { first: true, children: runs(addressLine(p), 'subtitle', { color: 'muted' }) }),
    new Paragraph({ children: runs(`${designation(p)} · Stand ${stand}`, 'caption'), spacing: { before: tw(2), after: tw(10) } }),
    new Paragraph({ children: runs('Zusammenstellung der finanzierungsrelevanten Angaben gemäss den vorliegenden Unterlagen. Berechnete Werte sind als solche bezeichnet.', 'body', { color: 'muted' }), spacing: { after: tw(6) } }),
  ];
  const section = (title, blocks) => { if (blocks.some(Boolean)) children.push(h1(title), ...blocks.filter(Boolean)); };

  section('Objekt', [s.object.length ? kv(s.object) : null]);
  section('Grundstück & Rechtliches', [s.legal.length ? kv(s.legal) : null, s.parcels ? spacer(6) : null, s.parcels ? grid(s.parcels) : null]);
  section('Gebäude & Zustand', [s.building.length ? kv(s.building) : null]);
  if (s.investments.length) section('Investitionen', [grid({ header: ['Jahr', 'Massnahme'], weights: [1, 6], rows: s.investments.map((i) => [String(i.year), String(i.measure)]) })]);
  if (s.rentRoll) {
    const t = s.rentRoll.totals;
    section('Mieterspiegel', [
      grid(s.rentRoll, { totals: t ? ['Total vermietet', '', '', fmtChf(t.netMonthly), t.ancillaryMonthly ? fmtChf(t.ancillaryMonthly) : '–', '', ''] : null }),
      t ? note(`Netto-Mietertrag vermieteter Einheiten: ${fmtChf(t.netYearly)} p.a. (berechnet: Monatsmieten × 12).`) : null,
    ]);
  }
  section('Erträge, Kosten & Werte', [s.finance.length ? kv(s.finance) : null]);
  if (s.figures.length) section('Kennzahlen (berechnet)', [kv(s.figures), note('Rein rechnerisch aus den oben aufgeführten Werten abgeleitet; keine Bewertung.')]);
  section('Unterlagen', [checklistTable(s.checklist)]);
  if (sources && Object.keys(sources).length) {
    section('Quellen der Angaben', [kv(Object.entries(sources).map(([label, value]) => ({ label, value: String(value) })), { labelShare: 0.38 })]);
  }
  const contact = (p.contacts || []).find((c) => !isEmpty(c.name));
  if (contact) {
    children.push(h1('Kontakt'), new Paragraph({ children: [
      ...runs(contact.name, 'contact', { bold: true, color: 'navy' }),
      ...runs(`\n${[contact.role, contact.phone, contact.email].filter(Boolean).join(' · ')}\n${COMPANY.name}, ${COMPANY.street}, ${COMPANY.zipCity}`, 'contact'),
    ], spacing: { after: tw(6) } }));
  }
  children.push(para(DISCLAIMER.full, 'small'));

  const doc = new Document({
    creator: COMPANY.name,
    title: `Finanzierungsdossier – ${addressLine(p)}`,
    styles: documentStyles(),
    fonts: embeddedFonts(),
    sections: [{ properties: pageProperties(), headers: { default: schaeppiHeader({ confidential: p.meta.confidential !== false }) }, footers: { default: schaeppiFooter() }, children }],
  });
  return new Uint8Array(await Packer.toArrayBuffer(doc));
}

