// DOCX-Renderer für die Geheimhaltungsverpflichtung (feste Vorlage, nur Felder werden eingesetzt).
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, TableLayoutType, LineRuleType,
} from 'docx';
import { COLORS, PAGE, COMPANY } from '../../src/layout/design.js';
import { toNumber } from '../../src/model/schema.js';
import { addressLine, designation } from '../../src/model/facts.js';
import { NDA_TEMPLATE, fillPlaceholders } from '../../templates/nda.js';
import {
  tw, runs, spacer, schaeppiHeader, schaeppiFooter, pageProperties, embeddedFonts, documentStyles,
} from './common.js';

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

export function ndaValues(p, texts) {
  const n = p.nda || {};
  const years = toNumber(n.durationYears) || 2;
  return {
    objekt: (texts && texts.title) || designation(p),
    adresse: addressLine(p),
    unternehmen: n.company,
    unternehmenAdresse: n.address,
    vertreter: n.representative,
    ort: n.place,
    datum: n.date,
    laufzeit: `${years} ${years === 1 ? 'Jahr' : 'Jahren'}`,
    firma: COMPANY.name,
    firmaAdresse: `${COMPANY.street}, ${COMPANY.zipCity}`,
    gerichtsstand: COMPANY.jurisdiction,
  };
}

// Absatz mit freiem Stil (die NDA ist Fliesstext und braucht keine Seitenbegrenzung)
function p(text, { size = 9.5, line = 13.5, before = 0, after = 6, bold = false, color = 'text', font = 'body', align, keepNext } = {}) {
  return new Paragraph({
    children: runs(text, 'body', { size, bold, color, font }),
    spacing: { before: tw(before), after: tw(after), line: tw(line), lineRule: LineRuleType.EXACT },
    alignment: align,
    keepNext,
    keepLines: true,
  });
}

export function ndaParagraphs(p0, texts) {
  const v = ndaValues(p0, texts);
  const f = (t) => fillPlaceholders(t, v);
  const t = NDA_TEMPLATE;
  const out = [];
  out.push(p(t.title, { font: 'heading', size: 18, line: 22, color: 'navy', after: 14 }));
  out.push(p(t.parties.intro, { color: 'muted', after: 4 }));
  t.parties.recipient.forEach((l, i) => out.push(p(f(l), { bold: i === 0, after: 0 })));
  out.push(p(t.parties.and, { color: 'muted', before: 8, after: 4 }));
  t.parties.discloser.forEach((l, i) => out.push(p(f(l), { bold: i === 0, after: 0 })));
  out.push(p(t.parties.subject, { color: 'muted', before: 8, after: 4 }));
  t.parties.object.forEach((l, i) => out.push(p(f(l), { bold: i === 0, after: 0 })));
  t.clauses.forEach((c, i) => {
    out.push(p(`${i + 1}.  ${c.title}`, { bold: true, color: 'navy', before: 12, after: 3, keepNext: true }));
    c.text.forEach((x) => out.push(p(f(x), { after: 4 })));
  });
  return { paragraphs: out, values: v };
}

function signatureTable() {
  const t = NDA_TEMPLATE.signature;
  const w = PAGE.contentWidth / 2;
  const line = { style: BorderStyle.SINGLE, size: 4, color: COLORS.text };
  const cellFor = (label) => new TableCell({
    width: { size: tw(w), type: WidthType.DXA },
    margins: { top: tw(30), bottom: 0, left: 0, right: tw(24) },
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
    children: [new Paragraph({
      children: runs(label, 'caption'),
      border: { top: line },
      spacing: { before: 0, after: 0 },
    })],
  });
  const rows = [];
  for (let i = 0; i < t.count; i += 2) {
    rows.push(new TableRow({ cantSplit: true, children: [0, 1].map(() => cellFor(t.lines.join(' / '))) }));
  }
  return new Table({
    rows,
    width: { size: tw(PAGE.contentWidth), type: WidthType.DXA },
    columnWidths: [tw(w), tw(w)],
    layout: TableLayoutType.FIXED,
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
  });
}

export async function renderNdaDocx(property, texts) {
  const { paragraphs, values } = ndaParagraphs(property, texts);
  const sig = NDA_TEMPLATE.signature;
  const children = [
    ...paragraphs,
    p(fillPlaceholders(sig.placeDate, values), { before: 24, after: 4, keepNext: true }),
    p(sig.label, { bold: true, color: 'navy', after: 0, keepNext: true }),
    signatureTable(),
    spacer(1), // Word verlangt nach einer Tabelle am Dokumentende einen Absatz
  ];
  const doc = new Document({
    creator: COMPANY.name,
    title: `${NDA_TEMPLATE.title} – ${values.objekt}`,
    styles: documentStyles(),
    fonts: embeddedFonts(),
    sections: [{
      properties: pageProperties(),
      headers: { default: schaeppiHeader({ confidential: true }) },
      footers: { default: schaeppiFooter() },
      children,
    }],
  });
  return Packer.toBuffer(doc);
}
