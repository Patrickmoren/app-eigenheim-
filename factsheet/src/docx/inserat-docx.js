// Inserattexte als Word-Datei: Titel, Kurzbeschrieb, Beschrieb und Eckdaten zum Kopieren in
// Homegate, ImmoScout24 oder die eigene Website. Zusätzlich als reiner Text (inseratText).
import { Document, Packer, Paragraph, TextRun, LineRuleType, BorderStyle } from 'docx';
import { COLORS, FONTS, COMPANY } from '../layout/design.js';
import { addressLine, priceText, unitSummary } from '../model/facts.js';
import { fmtArea } from '../model/format.js';
import { isEmpty } from '../model/schema.js';
import { embeddedFonts, documentStyles, schaeppiHeader, schaeppiFooter, pageProperties } from './common.js';

const tw = (pt) => Math.round(pt * 20);

export function inseratFacts(p) {
  const o = p.object;
  const price = priceText(p);
  return [
    ['Adresse', addressLine(p)],
    ['Objektart', o.type],
    ['Einheiten', unitSummary(p)],
    ['Wohnfläche', isEmpty(o.livingArea) ? '' : `ca. ${fmtArea(o.livingArea)}`],
    ['Grundstücksfläche', isEmpty(o.plotArea) ? '' : fmtArea(o.plotArea)],
    ['Baujahr', o.yearBuilt],
    ['Verfügbar ab', o.availableFrom],
    price ? [price.label, price.value] : null,
  ].filter((r) => r && !isEmpty(r[1]));
}

export function inseratText(p, texts) {
  const i = texts.inserat;
  const contact = (p.contacts || []).find((c) => !isEmpty(c.name));
  return [
    i.title, '', i.short, '', i.text, '',
    ...inseratFacts(p).map(([k, v]) => `${k}: ${v}`),
    '',
    contact ? `Kontakt: ${[contact.name, contact.role, contact.phone, contact.email].filter(Boolean).join(', ')}` : '',
    `${COMPANY.name}, ${COMPANY.street}, ${COMPANY.zipCity}, ${COMPANY.web}`,
  ].join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function para(text, { size = 10, line = 15, bold = false, color = COLORS.text, font = FONTS.body, before = 0, after = 6, border } = {}) {
  return new Paragraph({
    children: String(text).split('\n').map((t, k) => new TextRun({ text: t, size: size * 2, bold, color, font, break: k ? 1 : undefined })),
    spacing: { before: tw(before), after: tw(after), line: tw(line), lineRule: LineRuleType.EXACT },
    border,
  });
}

export async function renderInseratDocx(p, texts) {
  const i = texts.inserat;
  const label = (t) => para(t, { size: 8, line: 11, bold: true, color: COLORS.blue, before: 14, after: 3 });
  const children = [
    para('Inserat für Immobilienportale', { size: 18, line: 22, color: COLORS.navy, font: FONTS.heading, after: 2 }),
    para(addressLine(p), { size: 11, line: 14, color: COLORS.muted, font: FONTS.heading, after: 10, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.navy, space: 4 } } }),
    label('TITEL'), para(i.title, { size: 12, line: 16, bold: true, color: COLORS.navy }),
    label('KURZBESCHRIEB'), para(i.short),
    label('BESCHRIEB'), ...i.text.split(/\n{2,}/).map((x) => para(x, { after: 8 })),
    label('ECKDATEN'), ...inseratFacts(p).map(([k, v]) => para(`${k}: ${v}`, { after: 2 })),
  ];
  const doc = new Document({
    creator: COMPANY.name,
    title: `Inserat – ${addressLine(p)}`,
    styles: documentStyles(),
    fonts: embeddedFonts(),
    sections: [{ properties: pageProperties(), headers: { default: schaeppiHeader({ confidential: false }) }, footers: { default: schaeppiFooter() }, children }],
  });
  return new Uint8Array(await Packer.toArrayBuffer(doc));
}
