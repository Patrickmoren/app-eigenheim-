// Gemeinsame DOCX-Bausteine (Schaeppi-Design): Absätze, Kopf-/Fusszeile, Schrifteinbettung.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Paragraph, TextRun, ImageRun, Header, Footer, PageNumber, TabStopType, BorderStyle,
  LineRuleType, AlignmentType, CharacterSet,
} from 'docx';
import { COLORS, FONTS, TYPE, PAGE, COMPANY, LOGO } from '../../src/layout/design.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const ASSETS = path.join(ROOT, 'assets');

export const tw = (pt) => Math.round(pt * 20);     // Punkt -> Twips
export const px = (pt) => Math.round(pt * 96 / 72); // Punkt -> Pixel (docx-Bildmasse)

const cache = {};
export function asset(rel) {
  if (!cache[rel]) cache[rel] = fs.readFileSync(path.join(ASSETS, rel));
  return cache[rel];
}

export function runs(text, styleName, over = {}) {
  const st = { ...TYPE[styleName], ...over };
  const base = {
    font: FONTS[st.font] || st.font,
    size: Math.round(st.size * 2),
    color: COLORS[st.color] || st.color,
    bold: !!st.bold,
    allCaps: !!st.caps,
    characterSpacing: st.spacing ? tw(st.spacing) : undefined,
  };
  const parts = String(text ?? '').split('\n');
  return parts.map((t, i) => new TextRun({ ...base, text: t, break: i > 0 ? 1 : undefined }));
}

export function para(text, styleName, { first = false, scale = 1, children, align, keepNext, indent, border, tabStops, pageBreakBefore } = {}) {
  const st = TYPE[styleName];
  return new Paragraph({
    children: children || runs(text, styleName),
    spacing: {
      before: first ? 0 : tw(st.before * scale),
      after: tw(st.after * scale),
      line: tw(st.line),
      lineRule: LineRuleType.EXACT,
    },
    alignment: align,
    keepNext,
    keepLines: true,
    indent,
    border,
    tabStops,
    pageBreakBefore,
  });
}

// Leerabsatz mit exakter Höhe (Abstand nach Tabellen; trennt aufeinanderfolgende Tabellen)
export function spacer(heightPt) {
  const h = Math.max(1, heightPt);
  return new Paragraph({
    children: [new TextRun({ text: '', size: 2 })],
    spacing: { before: 0, after: 0, line: tw(h), lineRule: LineRuleType.EXACT },
  });
}

export function headingRule() {
  return { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.navy, space: 1 } };
}

export function logoRun(file, widthPt) {
  const data = asset(`logo/${file}`);
  const w = data.readUInt32BE(16), h = data.readUInt32BE(20);
  return new ImageRun({
    type: 'png',
    data,
    transformation: { width: px(widthPt), height: px(widthPt * h / w) },
    altText: { name: 'Logo', title: COMPANY.name, description: COMPANY.name },
  });
}

export function schaeppiHeader({ confidential = true, label = 'Vertraulich' } = {}) {
  return new Header({
    children: [new Paragraph({
      children: [
        logoRun(LOGO.header.file, LOGO.header.widthPt),
        ...(confidential ? [new TextRun({ text: '\t' }), ...runs(label, 'header')] : []),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: tw(PAGE.contentWidth) }],
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.line, space: 6 } },
      spacing: { before: 0, after: 0 },
    })],
  });
}

export function schaeppiFooter() {
  const st = TYPE.footer;
  const base = { font: FONTS.body, size: st.size * 2, color: COLORS[st.color] };
  return new Footer({
    children: [new Paragraph({
      style: 'SchaeppiFusszeile',
      children: [
        new TextRun({ ...base, text: `${COMPANY.name}  ·  ${COMPANY.street}  ·  ${COMPANY.zipCity}  ·  ${COMPANY.web}` }),
        new TextRun({ ...base, text: '\tSeite ' }),
        new TextRun({ ...base, children: [PageNumber.CURRENT] }),
        new TextRun({ ...base, text: ' / ' }),
        new TextRun({ ...base, children: [PageNumber.TOTAL_PAGES] }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: tw(PAGE.contentWidth) }],
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLORS.line, space: 6 } },
      spacing: { before: 0, after: 0, line: tw(st.line), lineRule: LineRuleType.EXACT },
    })],
  });
}

export function pageProperties() {
  return {
    page: {
      size: { width: tw(PAGE.width), height: tw(PAGE.height) },
      margin: {
        top: tw(PAGE.marginTop), bottom: tw(PAGE.marginBottom),
        left: tw(PAGE.marginLeft), right: tw(PAGE.marginRight),
        header: tw(PAGE.headerDistance), footer: tw(PAGE.footerDistance),
      },
    },
  };
}

// IBM Plex Sans wird eingebettet, damit Titel auch ohne installierte Schrift korrekt erscheinen
// (SIL Open Font License). Arial ist auf allen Office-Systemen vorhanden.
export function embeddedFonts() {
  return [{ name: FONTS.heading, data: asset('fonts/IBMPlexSans-Regular.ttf'), characterSet: CharacterSet.ANSI }];
}

export function documentStyles() {
  const f = TYPE.footer;
  return {
    default: {
      document: { run: { font: FONTS.body, size: 18, color: COLORS.text } },
    },
    // Eigene Formatvorlage für die Fusszeile, damit auch die Seitenzahl-Felder 7 pt erhalten.
    paragraphStyles: [{
      id: 'SchaeppiFusszeile', name: 'Schaeppi Fusszeile', basedOn: 'Normal', quickFormat: false,
      run: { font: FONTS.body, size: f.size * 2, color: COLORS[f.color] },
      paragraph: { spacing: { before: 0, after: 0 } },
    }],
  };
}

export { AlignmentType };
