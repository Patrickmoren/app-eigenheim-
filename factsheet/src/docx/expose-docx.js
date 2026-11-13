// Verkaufsdokumentation als Word-Datei (A4 quer). Jede Seite ist eine randlose Tabelle mit fester
// Zeilenhöhe – Bild- und Textflächen wie im PDF, aber vollständig in Word bearbeitbar.
// Gegenüber dem PDF vereinfacht: Elemente, die im PDF unten verankert sind, folgen hier dem Text.
import {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, TableLayoutType, HeightRule, PageBreak, PageOrientation, LineRuleType, AlignmentType,
} from 'docx';
import { COLORS, FONTS, EXPOSE, COMPANY } from '../layout/design.js';
import { DISCLAIMER } from '../layout/factsheet.js';
import { coverCrop } from '../media/images.js';
import { asset, pngSize } from '../assets.js';
import { embeddedFonts, documentStyles } from './common.js';
import { fitFontSize } from '../layout/measure.js';

const tw = (pt) => Math.round(pt * 20);
const px = (pt) => Math.round(pt * 96 / 72);
const { page: PG, pad: PAD } = EXPOSE;
const T = EXPOSE.type;
const HALF = PG.width / 2;
const ROW = PG.height - 3; // Zeilenhöhe; Bilder etwas kleiner, damit nichts überläuft
const IMG_H = ROW - 6;
// // etwas Luft, damit der Trennabsatz noch auf die Seite passt
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const CELL_NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE };

function run(text, st, color, extra = {}) {
  return new TextRun({
    text: String(text ?? ''),
    font: st.font === 'heading' ? FONTS.heading : FONTS.body,
    size: Math.round(st.size * 2),
    bold: !!st.bold,
    allCaps: !!st.caps,
    characterSpacing: st.caps ? tw(st.spacing || 1) : undefined,
    color,
    ...extra,
  });
}

function p(text, st, color, { before = 0, after = 0, align } = {}) {
  const lines = String(text ?? '').split('\n');
  return new Paragraph({
    children: lines.map((l, i) => run(l, st, color, i ? { break: 1 } : {})),
    spacing: { before: tw(before), after: tw(after), line: tw(st.line), lineRule: LineRuleType.EXACT },
    alignment: align,
  });
}

const paragraphs = (text, st, color) => String(text || '').split(/\n{2,}/).filter(Boolean)
  .map((x, i) => p(x, st, color, { before: i ? st.line * 0.6 : 0 }));

// Decodiertes Bild (aus decodeImages) für einen Rahmen, zugeschnitten oder eingepasst
function picture(im, w, h, { contain = false } = {}) {
  if (!im) return null;
  let W = w, H = h, crop;
  if (contain) {
    const r = Math.min(w / im.width, h / im.height);
    W = im.width * r; H = im.height * r;
  } else crop = coverCrop(im.width, im.height, w, h);
  return new Paragraph({
    children: [new ImageRun({ type: im.type, data: im.buffer, transformation: { width: px(W), height: px(H) }, crop, altText: { name: im.caption || 'Bild', title: im.caption || 'Bild', description: im.caption || 'Bild' } })],
    spacing: { before: 0, after: 0 },
    alignment: contain ? AlignmentType.CENTER : undefined,
  });
}

function cell(children, width, { fill, margins = {}, vAlign } = {}) {
  return new TableCell({
    children: children.filter(Boolean).length ? children.filter(Boolean) : [new Paragraph({ children: [] })],
    width: { size: tw(width), type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: 'auto' } : undefined,
    margins: { top: tw(margins.top || 0), bottom: tw(margins.bottom || 0), left: tw(margins.left || 0), right: tw(margins.right || 0) },
    borders: CELL_NO_BORDERS,
    verticalAlign: vAlign,
  });
}

function pageTable(cells, widths) {
  return new Table({
    rows: [new TableRow({ children: cells, height: { value: tw(ROW), rule: HeightRule.EXACT }, cantSplit: true })],
    width: { size: tw(widths.reduce((a, b) => a + b, 0)), type: WidthType.DXA },
    columnWidths: widths.map(tw),
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
  });
}

function kvTable(rows, width, { labelColor, valueColor, line = COLORS.line }) {
  const lw = width * 0.4, vw = width - lw;
  return new Table({
    rows: rows.map((r) => new TableRow({ cantSplit: true, children: [
      cell([p(r.label, T.label, labelColor)], lw, { margins: { top: 3, bottom: 3, right: 8 } }),
      cell([p(r.value, T.value, valueColor)], vw, { margins: { top: 3, bottom: 3 } }),
    ] })),
    width: { size: tw(width), type: WidthType.DXA },
    columnWidths: [tw(lw), tw(vw)],
    layout: TableLayoutType.FIXED,
    borders: { ...NO_BORDERS, insideHorizontal: line ? { style: BorderStyle.SINGLE, size: 2, color: line } : NONE },
  });
}

function dataTable(t, width) {
  if (!t) return null;
  const share = width / t.header.length;
  return new Table({
    rows: [
      new TableRow({ tableHeader: true, children: t.header.map((h) => cell([p(h, T.tableHead, COLORS.white)], share, { fill: COLORS.navy, margins: { top: 3, bottom: 3, left: 5, right: 5 } })) }),
      ...t.rows.map((r, i) => new TableRow({ cantSplit: true, children: r.map((c) => cell([p(c, T.table, COLORS.text)], share, { fill: i % 2 ? COLORS.cream : undefined, margins: { top: 3, bottom: 3, left: 5, right: 5 } })) })),
    ],
    width: { size: tw(width), type: WidthType.DXA },
    columnWidths: t.header.map(() => tw(share)),
    layout: TableLayoutType.FIXED,
    borders: { ...NO_BORDERS, insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: COLORS.line } },
  });
}

// In einer Zelle darf eine Tabelle nicht das letzte Element sein (Word-Vorgabe).
const endPara = () => new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT } });

function logo(file, widthPt, { before = 0 } = {}) {
  const data = asset(file);
  const { width, height } = pngSize(data);
  return new Paragraph({ children: [new ImageRun({ type: 'png', data, transformation: { width: px(widthPt), height: px(widthPt * height / width) }, altText: { name: 'Logo', title: COMPANY.name, description: COMPANY.name } })], spacing: { before: tw(before), after: 0 } });
}

const titleBlock = (pg, color, subColor) => [
  pg.kicker ? p(pg.kicker, { font: 'body', size: 8, line: 11, bold: true, caps: true, spacing: 1.6 }, subColor, { after: 6 }) : null,
  p(pg.title, T.title, color),
  pg.subtitle ? p(pg.subtitle, T.sub, subColor, { before: 4 }) : null,
];

const textMargins = { top: EXPOSE.titleTop, left: PAD, right: PAD, bottom: EXPOSE.bottom };

const PAGES = {
  cover(pg, imgs) {
    const panel = PG.width * 0.4;
    const left = cell([
      logo('logo/schaeppi-1zeilig-weiss.png', 160),
      pg.label ? p(pg.label, { font: 'body', size: 8, line: 11, bold: true, caps: true, spacing: 1.6 }, COLORS.bandLabel, { before: 330 }) : p('', T.small, COLORS.white, { before: 330 }),
      p(pg.title, fitFontSize(pg.title, T.coverTitle, panel - 2 * PAD - 6), COLORS.white),
      p(pg.designation, T.coverSub, COLORS.white, { before: 12 }),
      p(pg.subtitle, T.sub, COLORS.bandLabel, { before: 4 }),
    ], panel, { fill: COLORS.navy, margins: { top: PAD, left: PAD, right: PAD } });
    if (!pg.image) return [pageTable([left, cell([], PG.width - panel, { fill: COLORS.navy })], [panel, PG.width - panel])];
    return [pageTable([left, cell([picture(imgs(pg.image), PG.width - panel, IMG_H)], PG.width - panel)], [panel, PG.width - panel])];
  },
  facts(pg, imgs) {
    const w = HALF - 2 * PAD;
    const left = cell([
      p('Facts & Figures', T.title, COLORS.white, { after: 40 }),
      kvTable(pg.rows, w, { labelColor: COLORS.bandLabel, valueColor: COLORS.white, line: null }),
      pg.price ? p(pg.price.label, { font: 'body', size: 8, line: 11, bold: true, caps: true, spacing: 1.6 }, COLORS.bandLabel, { before: 24 }) : endPara(),
      pg.price ? p(pg.price.value, T.price, COLORS.white) : null,
    ], HALF, { fill: COLORS.navy, margins: textMargins });
    const right = pg.image ? cell([picture(imgs(pg.image), HALF, IMG_H)], HALF) : cell([kpiPara(pg.kpis)], HALF, { fill: COLORS.cream, margins: textMargins });
    return [pageTable([left, right], [HALF, HALF])];
  },
  text(pg, imgs) {
    const fill = pg.tone === 'cream' ? COLORS.cream : undefined;
    const textCell = cell([
      ...titleBlock(pg, COLORS.navy, COLORS.muted),
      spacerBeforeText(pg),
      ...paragraphs(pg.text, T.body, COLORS.text),
      pg.tagline ? p(pg.tagline, T.tagline, COLORS.navy, { before: 40 }) : null,
    ], HALF, { fill, margins: textMargins });
    const imgCell = pg.image ? cell([picture(imgs(pg.image), HALF, IMG_H)], HALF)
      : cell([pg.kpis ? kpiPara(pg.kpis, COLORS.white) : logo('logo/schaeppi-2zeilig-weiss.png', 120, { before: 420 })], HALF, { fill: COLORS.navy, margins: textMargins });
    return [pageTable(pg.imageSide === 'left' ? [imgCell, textCell] : [textCell, imgCell], [HALF, HALF])];
  },
  unit(pg, imgs) {
    const w = HALF - 2 * PAD;
    const left = cell([
      ...titleBlock({ kicker: `Einheit ${pg.index + 1}`, title: pg.title, subtitle: pg.heading }, COLORS.white, COLORS.bandLabel),
      spacerBeforeText({ ...pg, subtitle: pg.heading }),
      ...paragraphs(pg.text, T.body, COLORS.white),
      pg.facts.length ? p('', T.small, COLORS.white, { before: 20 }) : null,
      pg.facts.length ? kvTable(pg.facts.map(([label, value]) => ({ label, value })), w, { labelColor: COLORS.bandLabel, valueColor: COLORS.white, line: null }) : null,
      pg.facts.length ? endPara() : null,
    ], HALF, { fill: COLORS.navy, margins: textMargins });
    const right = pg.image ? cell([picture(imgs(pg.image), HALF, IMG_H)], HALF) : cell([], HALF, { fill: COLORS.cream });
    return [pageTable([left, right], [HALF, HALF])];
  },
  unitTable(pg, imgs) {
    const lw = pg.image ? PG.width * 0.58 : PG.width;
    const cells = [cell([p(pg.title, T.title, COLORS.navy, { after: 24 }), dataTable(pg.table, lw - 2 * PAD), endPara()], lw, { margins: textMargins })];
    if (pg.image) cells.push(cell([picture(imgs(pg.image), PG.width - lw, IMG_H)], PG.width - lw));
    return [pageTable(cells, pg.image ? [lw, PG.width - lw] : [lw])];
  },
  gallery(pg, imgs) {
    const ims = pg.images.map(imgs);
    if (ims.length === 1) return [pageTable([cell([picture(ims[0], PG.width, IMG_H)], PG.width)], [PG.width])];
    if (ims.length === 2) return [pageTable([cell([picture(ims[0], HALF - 2, IMG_H)], HALF), cell([picture(ims[1], HALF - 2, IMG_H)], HALF, { margins: { left: 2 } })], [HALF, HALF])];
    const lw = PG.width * 0.6, rw = PG.width - lw;
    return [pageTable([
      cell([picture(ims[0], lw - 2, IMG_H)], lw),
      cell([picture(ims[1], rw - 2, ROW / 2 - 2), new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 40, lineRule: LineRuleType.EXACT } }), picture(ims[2], rw - 2, ROW / 2 - 2)], rw, { margins: { left: 2 } }),
    ], [lw, rw])];
  },
  floorplan(pg, imgs) {
    return [pageTable([cell([
      p(pg.title, T.title, COLORS.navy),
      pg.caption ? p(pg.caption, T.sub, COLORS.muted, { before: 4 }) : null,
      p('', T.small, COLORS.text, { before: 16 }),
      picture(imgs(pg.image), PG.width - 2 * PAD, ROW - 160, { contain: true }),
    ], PG.width, { margins: textMargins })], [PG.width])];
  },
  numbers(pg) {
    const colW = (PG.width - 3 * PAD) / 2;
    const h3 = (t) => p(t, { font: 'heading', size: 13, line: 17 }, COLORS.navy, { before: 12, after: 6 });
    const left = [
      pg.finance.length ? h3('Erträge & Kennzahlen') : null,
      pg.finance.length ? kvTable(pg.finance, colW, { labelColor: COLORS.muted, valueColor: COLORS.text }) : null,
      pg.investments.length ? h3('Investitionen') : null,
      pg.investments.length ? dataTable({ header: ['Jahr', 'Massnahme'], rows: pg.investments.map((i) => [String(i.year), String(i.measure)]) }, colW) : null,
      endPara(),
    ];
    const right = [
      pg.land.length || pg.parcels ? h3('Grundstück & Rechtliches') : null,
      pg.parcels ? dataTable(pg.parcels, colW) : null,
      pg.land.length ? kvTable(pg.land, colW, { labelColor: COLORS.muted, valueColor: COLORS.text }) : null,
      pg.units ? h3('Einheiten') : null,
      pg.units ? dataTable(pg.units, colW) : null,
      endPara(),
    ];
    return [pageTable([
      cell([p(pg.title, T.title, COLORS.navy, { after: 20 }), ...left], colW + PAD, { margins: { top: EXPOSE.titleTop, left: PAD } }),
      cell([p('', T.title, COLORS.navy, { after: 20 }), ...right], PG.width - colW - PAD, { margins: { top: EXPOSE.titleTop, left: PAD, right: PAD } }),
    ], [colW + PAD, PG.width - colW - PAD])];
  },
  steps(pg) {
    const w = (PG.width - 2 * PAD) / pg.steps.length;
    const stepCells = pg.steps.map((s, i) => cell([
      p(String(i + 1), T.stepNo, COLORS.navy),
      p(s.title, T.stepTitle, COLORS.navy, { before: 8 }),
      p(s.detail, T.stepText, COLORS.text, { before: 4 }),
    ], w, { margins: { right: 12 } }));
    const steps = new Table({
      rows: [new TableRow({ children: stepCells })],
      width: { size: tw(PG.width - 2 * PAD), type: WidthType.DXA },
      columnWidths: pg.steps.map(() => tw(w)),
      layout: TableLayoutType.FIXED,
      borders: { ...NO_BORDERS, top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.navy } },
    });
    return [pageTable([cell([
      p(pg.title, T.title, COLORS.navy),
      pg.intro ? p(pg.intro, T.sub, COLORS.muted, { before: 4 }) : null,
      p('', T.small, COLORS.text, { before: 90 }),
      steps, endPara(),
    ], PG.width, { fill: COLORS.cream, margins: textMargins })], [PG.width])];
  },
  contact(pg, imgs) {
    const people = pg.contacts.flatMap((c) => [
      p(c.name, T.contactName, COLORS.navy, { before: 10 }),
      ...[c.role, c.phone, c.email].filter(Boolean).map((x) => p(x, T.contact, COLORS.muted)),
    ]);
    const right = cell([
      p(pg.title, { font: 'heading', size: 22, line: 28 }, COLORS.navy, { after: 20, align: AlignmentType.CENTER }),
      pg.portrait ? picture(imgs(pg.portrait), 130, 173) : null,
      ...people,
      p(COMPANY.name, T.contactName, COLORS.navy, { before: 30 }),
      ...[COMPANY.street, COMPANY.zipCity, COMPANY.web].map((x) => p(x, T.contact, COLORS.muted)),
      p(DISCLAIMER.short, T.small, COLORS.muted, { before: 30 }),
    ], HALF, { fill: COLORS.cream, margins: textMargins });
    return [pageTable([cell([picture(imgs(pg.image), HALF, IMG_H)], HALF), right], [HALF, HALF])];
  },
  back() {
    return [pageTable([cell([logo('logo/schaeppi-2zeilig-blau.png', 150, { before: ROW - 2 * PAD - 30 })], PG.width, { fill: COLORS.cream, margins: { left: PAD } })], [PG.width])];
  },
};

// Abstand zwischen Titelblock und Fliesstext wie im PDF
function spacerBeforeText(pg) {
  const titleH = (pg.kicker || pg.index !== undefined ? 17 : 0) + T.title.line * 2 + (pg.subtitle || pg.heading ? T.sub.line + 4 : 0);
  const before = Math.max(16, EXPOSE.textTop - EXPOSE.titleTop - titleH);
  return new Paragraph({ children: [], spacing: { before: tw(before), after: 0, line: 20, lineRule: LineRuleType.EXACT } });
}

function kpiPara(kpis, color = COLORS.navy) {
  if (!kpis || !kpis.length) return null;
  return new Table({
    rows: [new TableRow({ children: kpis.slice(0, 4).map((k) => cell([p(k.value, { font: 'heading', size: 17, line: 22 }, color), p(k.label, T.caption, color === COLORS.white ? COLORS.bandLabel : COLORS.muted)], (HALF - 2 * PAD) / Math.min(4, kpis.length), { margins: { right: 8 } })) })],
    width: { size: tw(HALF - 2 * PAD), type: WidthType.DXA },
    columnWidths: kpis.slice(0, 4).map(() => tw((HALF - 2 * PAD) / Math.min(4, kpis.length))),
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
  });
}

export async function renderExposeDocx(model, images) {
  // Bilder des Modells (Data-URLs) den dekodierten Bildern zuordnen
  const bySrc = new Map();
  const reg = (src, dec) => { if (src && dec) bySrc.set(src, dec); };
  for (const [slot, val] of Object.entries(images.decoded || {})) {
    if (Array.isArray(val)) val.forEach((d, i) => reg(images.raw.gallery[i] && images.raw.gallery[i].src, d));
    else reg(images.raw[slot], val);
  }
  const imgs = (im) => (im ? bySrc.get(im.src) || null : null);

  const children = [];
  model.pages.forEach((pg, i) => {
    children.push(...PAGES[pg.type](pg, imgs));
    const last = i === model.pages.length - 1;
    children.push(new Paragraph({
      children: last ? [] : [new TextRun({ text: '', size: 2 }), new PageBreak()],
      spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT },
    }));
  });

  const doc = new Document({
    creator: COMPANY.name,
    title: `Verkaufsdokumentation – ${model.address}`,
    styles: documentStyles(),
    fonts: embeddedFonts(),
    sections: [{
      properties: {
        page: {
          size: { width: tw(PG.height), height: tw(PG.width), orientation: PageOrientation.LANDSCAPE },
          margin: { top: 0, bottom: 0, left: 0, right: 0, header: 0, footer: 0 },
        },
      },
      children,
    }],
  });
  return new Uint8Array(await Packer.toArrayBuffer(doc));
}

