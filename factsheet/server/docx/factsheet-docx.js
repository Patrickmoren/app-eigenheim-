// DOCX-Renderer für das Factsheet: setzt das Block-Modell aus src/layout/factsheet.js um.
// Alles bleibt in Word bearbeitbar: Texte sind normale Absätze, Tabellen echte Word-Tabellen,
// Bilder Inline-Grafiken (mit Zuschnitt statt Verzerrung).
import {
  Document, Packer, Paragraph, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, TableLayoutType, LineRuleType,
} from 'docx';
import { COLORS, BOX, PAGE, TYPE, COMPANY } from '../../src/layout/design.js';
import {
  tw, px, runs, para, spacer, headingRule, schaeppiHeader, schaeppiFooter, pageProperties, embeddedFonts, documentStyles,
} from './common.js';
import { coverCrop } from '../images.js';

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const line = (color = COLORS.line, size = 4) => ({ style: BorderStyle.SINGLE, size, color });

function table(rows, widthsPt, extra = {}) {
  return new Table({
    rows,
    width: { size: tw(widthsPt.reduce((a, b) => a + b, 0)), type: WidthType.DXA },
    columnWidths: widthsPt.map(tw),
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    ...extra,
  });
}

function cell(children, widthPt, { fill, margins = {}, borders, vAlign } = {}) {
  return new TableCell({
    children: children.length ? children : [new Paragraph({ children: [] })],
    width: { size: tw(widthPt), type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: 'auto' } : undefined,
    margins: {
      top: tw(margins.top || 0), bottom: tw(margins.bottom || 0),
      left: tw(margins.left || 0), right: tw(margins.right || 0),
    },
    borders: borders || { top: NONE, bottom: NONE, left: NONE, right: NONE },
    verticalAlign: vAlign,
  });
}

function imageRun(img, widthPt, heightPt, name) {
  return new ImageRun({
    type: img.type,
    data: img.buffer,
    transformation: { width: px(widthPt), height: px(heightPt) },
    crop: coverCrop(img.width, img.height, widthPt, heightPt),
    altText: { name, title: name, description: name },
  });
}

const SLOT_NAMES = { cover: 'Titelbild', object: 'Objektfoto', location: 'Lagefoto', floorplan: 'Grundriss' };

function renderBlock(b, width, scale, images, out, ctx) {
  switch (b.type) {
    case 'band': {
      const inner = [
        para(b.label, 'bandLabel', { first: true }),
        para(b.title, 'title', { first: true }),
        para(b.subtitle, 'subtitle', { first: true }),
      ];
      out.push(table([new TableRow({ children: [cell(inner, width, {
        fill: COLORS.navy, margins: { top: BOX.band.padTop, bottom: BOX.band.padBottom, left: BOX.band.padX, right: BOX.band.padX },
      })] })], [width]));
      break;
    }
    case 'kpis': {
      const n = b.items.length;
      const w = width / n;
      const sep = { style: BorderStyle.SINGLE, size: 24, color: COLORS.white };
      out.push(table([new TableRow({ children: b.items.map((k, i) => cell([
        para(k.value, 'kpiValue', { first: true }),
        para(k.label, 'kpiLabel', { first: true }),
      ], w, {
        fill: COLORS.cream,
        margins: { top: BOX.kpi.padTop, bottom: BOX.kpi.padBottom, left: BOX.kpi.padX, right: BOX.kpi.padX },
        borders: { top: NONE, bottom: NONE, left: i ? sep : NONE, right: i < n - 1 ? sep : NONE },
      })) })], Array(n).fill(w)));
      out.push(spacer(BOX.kpi.gapAfter * scale));
      break;
    }
    case 'image': {
      const img = images[b.slot];
      out.push(new Paragraph({
        children: [imageRun(img, width, b.height, SLOT_NAMES[b.slot])],
        spacing: { before: 0, after: tw(BOX.image.gapAfter * scale) },
      }));
      break;
    }
    case 'imageRow': {
      const n = b.slots.length;
      const gap = BOX.imageRow.gap;
      const w = (width - gap) / 2;
      const cells = b.slots.map((s, i) => cell([
        new Paragraph({ children: [imageRun(images[s.slot], w, b.height, SLOT_NAMES[s.slot])], spacing: { before: 0, after: 0 } }),
        para(s.caption, 'caption'),
      ], i === 0 && n === 2 ? w + gap : w, { margins: { right: i === 0 && n === 2 ? gap : 0 } }));
      const widths = n === 2 ? [w + gap, w] : [w];
      out.push(table([new TableRow({ children: cells })], widths));
      out.push(spacer(BOX.image.gapAfter * scale));
      break;
    }
    case 'h1':
      out.push(para(b.text, 'h1', { first: b.first, scale, keepNext: true, border: headingRule(), pageBreakBefore: b.pageBreakBefore }));
      break;
    case 'h2':
      out.push(para(b.text, 'h2', { first: b.first, scale, keepNext: true }));
      break;
    case 'h3':
      out.push(para(b.text, 'contactH', { first: b.first, scale, keepNext: true }));
      break;
    case 'para':
      out.push(para(b.text, b.style || 'body', { first: b.first, scale }));
      break;
    case 'small':
      out.push(para(b.text, 'small', { first: b.first, scale }));
      break;
    case 'spacer':
      out.push(spacer(b.height * scale));
      break;
    case 'argument': {
      if (b.title) out.push(para(b.title, 'argTitle', { first: b.first, scale, keepNext: !!b.text }));
      if (b.text) {
        // Ohne Titel übernimmt der Text den Abstand des Titels (wie in measure.js).
        out.push(!b.title && !b.first
          ? new Paragraph({ children: runs(b.text, 'argText'), spacing: { before: tw(TYPE.argTitle.before * scale), after: 0, line: tw(TYPE.argText.line), lineRule: LineRuleType.EXACT }, keepLines: true })
          : para(b.text, 'argText', { first: true, scale }));
      }
      break;
    }
    case 'contacts': {
      out.push(para(b.heading, 'contactH', { first: b.first, scale, keepNext: true }));
      b.items.forEach((c, i) => {
        const lines = [c.name, c.role, c.phone, c.email].filter(Boolean);
        lines.forEach((l, j) => {
          const isName = j === 0;
          out.push(new Paragraph({
            children: runs(l, 'contact', isName ? { bold: true, color: 'navy' } : {}),
            spacing: { before: isName && i ? tw(6 * scale) : 0, after: 0, line: tw(TYPE.contact.line), lineRule: LineRuleType.EXACT },
            keepNext: j < lines.length - 1,
          }));
        });
      });
      break;
    }
    case 'kv': {
      const lw = width * (b.labelShare || BOX.kv.labelShare), vw = width - lw;
      const m = { top: BOX.kv.padY * scale, bottom: BOX.kv.padY * scale, left: BOX.kv.padX, right: BOX.kv.padX };
      const rows = b.rows.map((r) => {
        const borders = { top: NONE, bottom: line(), left: NONE, right: NONE };
        return new TableRow({
          cantSplit: true,
          children: [
            cell([para(r.label, 'cellLabel', { first: true })], lw, { margins: m, borders }),
            cell([para(r.value, 'cell', { first: true })], vw, { margins: m, borders }),
          ],
        });
      });
      out.push(table(rows, [lw, vw]));
      break;
    }
    case 'table': {
      const widths = b.shares.map((s) => width * s);
      const m = { top: BOX.table.padY * scale, bottom: BOX.table.padY * scale, left: BOX.table.padX, right: BOX.table.padX };
      const head = new TableRow({
        tableHeader: true, cantSplit: true,
        children: b.header.map((h, i) => cell([para(h, 'cellHead', { first: true })], widths[i], { fill: COLORS.navy, margins: m })),
      });
      const body = b.rows.map((r, ri) => new TableRow({
        cantSplit: true,
        children: r.map((c, i) => cell([para(c, 'cell', { first: true })], widths[i], {
          fill: ri % 2 ? COLORS.cream : undefined, margins: m,
          borders: { top: NONE, bottom: line(), left: NONE, right: NONE },
        })),
      }));
      out.push(table([head, ...body], widths));
      break;
    }
    case 'steps':
      b.items.forEach((s, i) => {
        out.push(para('', 'step', {
          first: true, scale,
          indent: { left: tw(16), hanging: tw(16) },
          children: [
            ...runs(`${i + 1}\t`, 'step', { bold: true, color: 'navy' }),
            ...runs(s.title, 'step', { bold: true }),
            ...(s.detail ? runs(` – ${s.detail}`, 'step') : []),
          ],
          tabStops: [{ type: 'left', position: tw(16) }],
        }));
      });
      break;
    case 'split': {
      const g = BOX.split.gutter;
      const cw = (width - g) / 2;
      const left = [], right = [];
      for (const x of b.left) renderBlock(x, cw, scale, images, left, ctx);
      for (const x of b.right) renderBlock(x, cw, scale, images, right, ctx);
      left.push(spacer(1));
      right.push(spacer(1));
      out.push(table([new TableRow({ children: [
        cell(left, cw + g, { margins: { right: g } }),
        cell(right, cw),
      ] })], [cw + g, cw]));
      break;
    }
    case 'columns': {
      const lw = width * BOX.columns.leftShare;
      const rw = width - lw;
      const left = [], right = [];
      for (const x of b.left) renderBlock(x, lw - BOX.columns.gutter, scale, images, left, ctx);
      for (const x of b.right) renderBlock(x, rw - 2 * BOX.columns.rightPad, scale, images, right, ctx);
      out.push(table([new TableRow({ children: [
        cell(left, lw, { margins: { top: BOX.columns.rightPad, bottom: BOX.columns.rightPad, right: BOX.columns.gutter } }),
        cell(right, rw, { fill: right.length ? COLORS.cream : undefined, margins: { top: BOX.columns.rightPad, bottom: BOX.columns.rightPad, left: BOX.columns.rightPad, right: BOX.columns.rightPad } }),
      ] })], [lw, rw]));
      break;
    }
    default:
      throw new Error(`Blocktyp ${b.type} wird im DOCX nicht unterstützt.`);
  }
}

export async function renderFactsheetDocx(model, images) {
  const children = [];
  model.pages.forEach((page, pi) => {
    page.blocks.forEach((b, bi) => {
      // Seite 2 beginnt über «Seitenumbruch oberhalb» am ersten Absatz – kein leerer Umbruchabsatz,
      // der bei voller Seite 1 eine Leerseite erzeugen könnte.
      const block = pi > 0 && bi === 0 ? { ...b, pageBreakBefore: true } : b;
      renderBlock(block, PAGE.contentWidth, page.scale, images, children, { page: pi });
    });
  });
  const doc = new Document({
    creator: COMPANY.name,
    title: `Factsheet – ${model.title}`,
    description: model.address,
    styles: documentStyles(),
    fonts: embeddedFonts(),
    sections: [{
      properties: pageProperties(),
      headers: { default: schaeppiHeader({ confidential: model.confidential }) },
      footers: { default: schaeppiFooter() },
      children,
    }],
  });
  return Packer.toBuffer(doc);
}
