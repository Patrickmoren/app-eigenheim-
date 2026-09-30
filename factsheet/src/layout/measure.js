// Höhenberechnung der Layout-Blöcke.
//
// Der Zeilenumbruch wird mit den echten Zeichenbreiten der Schriften simuliert
// (glyph-widths.js). Zusammen mit den exakten Zeilenabständen aus design.js ergibt das
// eine verlässliche Seitenberechnung – unabhängig davon, ob ein Renderer verfügbar ist.
// Der Server prüft das Ergebnis zusätzlich mit LibreOffice, sofern installiert.
import { GLYPH_WIDTHS } from './glyph-widths.js';
import { TYPE, BOX, PAGE, FONTS } from './design.js';

function fontTable(style) {
  if (style.font === 'heading') return GLYPH_WIDTHS.plex;
  return style.bold ? GLYPH_WIDTHS.arialBold : GLYPH_WIDTHS.arial;
}

export function textWidth(text, style) {
  const t = fontTable(style);
  let w = 0;
  const s = style.caps ? text.toUpperCase() : text;
  for (const ch of s) w += (t.widths[ch] ?? t.fallback);
  w *= style.size;
  if (style.spacing) w += style.spacing * s.length;
  return w;
}

// Anzahl Zeilen für einen Text in gegebener Breite. '\n' erzwingt einen Zeilenumbruch.
export function countLines(text, style, width) {
  if (text === null || text === undefined || String(text) === '') return 0;
  let lines = 0;
  const space = textWidth(' ', style);
  for (const para of String(text).split('\n')) {
    // Umbruch nach Leerzeichen und nach Bindestrichen (wie Word)
    const tokens = para.split(/(?<=[\s-])/).filter((x) => x.length);
    let cur = 0;
    lines += 1;
    for (const tok of tokens) {
      const trimmed = tok.replace(/\s+$/, '');
      const w = textWidth(trimmed, style);
      const trailing = tok.length - trimmed.length ? space : 0;
      if (cur > 0 && cur + w > width) { lines += 1; cur = 0; }
      if (w > width) { // überlanges Wort wird zeichenweise umbrochen
        const extra = Math.floor(w / width);
        lines += extra;
        cur = w - extra * width;
      } else cur += w;
      cur += trailing;
    }
  }
  return lines;
}

export function paraHeight(styleName, text, width, scale = 1, { first = false } = {}) {
  const st = TYPE[styleName];
  const n = countLines(text, st, width);
  if (!n) return 0;
  return n * st.line + (first ? 0 : st.before * scale) + st.after * scale + (st.rule ? BOX.ruleGap : 0);
}

const IMAGE_LINE_EXTRA = 3; // Unterlänge der Zeile, in der ein Inline-Bild steht

export function measureBlock(b, width, scale = 1) {
  switch (b.type) {
    case 'band': {
      const inner = width - 2 * BOX.band.padX;
      return BOX.band.padTop + BOX.band.padBottom
        + paraHeight('bandLabel', b.label, inner, 1, { first: true })
        + paraHeight('title', b.title, inner, 1, { first: true })
        + paraHeight('subtitle', b.subtitle, inner, 1, { first: true });
    }
    case 'kpis': {
      const n = b.items.length || 1;
      const cw = width / n - 2 * BOX.kpi.padX;
      const inner = Math.max(...b.items.map((k) => paraHeight('kpiValue', k.value, cw, 1, { first: true }) + paraHeight('kpiLabel', k.label, cw, 1, { first: true })));
      return BOX.kpi.padTop + BOX.kpi.padBottom + inner + BOX.kpi.gapAfter * scale;
    }
    case 'image':
      return b.height + IMAGE_LINE_EXTRA + BOX.image.gapAfter * scale;
    case 'imageRow':
      return b.height + IMAGE_LINE_EXTRA + TYPE.caption.line + TYPE.caption.before + BOX.image.gapAfter * scale;
    case 'h1':
    case 'h2':
    case 'small':
      return paraHeight(b.type, b.text, width, scale, b);
    case 'h3':
      return paraHeight('contactH', b.text, width, scale, b);
    case 'para':
      return paraHeight(b.style || 'body', b.text, width, scale, b);
    case 'argument': {
      // Ohne Titel übernimmt der Text den Abstand des Titels.
      const top = b.title ? paraHeight('argTitle', b.title, width, scale, b) : (b.first ? 0 : TYPE.argTitle.before * scale);
      return top + paraHeight('argText', b.text, width, scale, { first: true });
    }
    case 'spacer':
      return b.height * scale;
    case 'contacts': {
      let h = paraHeight('contactH', b.heading, width, scale, b);
      b.items.forEach((c, i) => {
        const lines = [c.name, c.role, c.phone, c.email].filter(Boolean);
        h += lines.reduce((a, l) => a + paraHeight('contact', l, width, scale, { first: true }), 0) + (i ? 6 * scale : 0);
      });
      return h;
    }
    case 'kv': {
      const share = b.labelShare || BOX.kv.labelShare;
      const lw = width * share - 2 * BOX.kv.padX;
      const vw = width * (1 - share) - 2 * BOX.kv.padX;
      return b.rows.reduce((a, r) => a + 2 * BOX.kv.padY * scale + BOX.kv.border
        + Math.max(countLines(r.label, TYPE.cellLabel, lw) * TYPE.cellLabel.line, countLines(r.value, TYPE.cell, vw) * TYPE.cell.line), 0);
    }
    case 'table': {
      const widths = b.shares.map((s) => width * s - 2 * BOX.table.padX);
      const row = (cells, st) => 2 * BOX.table.padY * scale + BOX.table.border
        + Math.max(...cells.map((c, i) => countLines(c, st, widths[i]) * st.line));
      return row(b.header, TYPE.cellHead) + b.rows.reduce((a, r) => a + row(r, TYPE.cell), 0);
    }
    case 'steps':
      return b.items.reduce((a, it) => a + paraHeight('step', `${it.title}${it.detail ? ' – ' + it.detail : ''}`, width - 16, scale, { first: true }), 0);
    case 'columns': {
      const lw = width * BOX.columns.leftShare - BOX.columns.gutter;
      const rw = width * (1 - BOX.columns.leftShare) - 2 * BOX.columns.rightPad;
      // Beide Zellen haben denselben Innenabstand oben/unten (Word und LibreOffice rechnen gleich).
      const left = b.left.reduce((a, x) => a + measureBlock(x, lw, scale), 0);
      const right = b.right.reduce((a, x) => a + measureBlock(x, rw, scale), 0);
      return Math.max(left, right) + 2 * BOX.columns.rightPad;
    }
    case 'split': {
      // Zwei gleich breite Spalten; jede Zelle endet mit einem 1-pt-Absatz (Word-Vorgabe nach Tabellen).
      const cw = (width - BOX.split.gutter) / 2;
      const h = (list) => list.reduce((a, x) => a + measureBlock(x, cw, scale), 0);
      return Math.max(h(b.left), h(b.right)) + 1;
    }
    case 'pageBreak':
      return 0;
    default:
      throw new Error(`Unbekannter Blocktyp: ${b.type}`);
  }
}

export function measurePage(blocks, scale = 1) {
  return blocks.reduce((a, b) => a + measureBlock(b, PAGE.contentWidth, scale), 0);
}

export { FONTS };
