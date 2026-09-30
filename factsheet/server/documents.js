// Dokumenttypen (DocumentTemplate-Registry) und Ablauf von Prüfung bis DOCX.
//
//   factsheet  2 Seiten, Schaeppi-Design, KI-Texte + Fakten           (Version 1)
//   nda        Geheimhaltungsverpflichtung, feste Vorlage               (Version 1)
//   expose     Verkaufsexposé 8–20 Seiten aus denselben Daten           (vorbereitet)
import { normalizeProperty } from '../src/model/schema.js';
import { validateProperty, hasErrors } from '../src/model/validate.js';
import { factBase } from '../src/model/facts.js';
import { normalizeTexts, offlineTexts } from '../src/content/texts.js';
import { guardTexts } from '../src/content/guard.js';
import { buildFactsheet } from '../src/layout/factsheet.js';
import { checkDocument } from '../src/layout/check.js';
import { EXPOSE_OUTLINE } from '../src/layout/expose.js';
import { decodeImages } from './images.js';
import { renderFactsheetDocx } from './docx/factsheet-docx.js';
import { renderNdaDocx } from './docx/nda-docx.js';
import { renderPdf } from './render-check.js';

export const DOCUMENT_TYPES = {
  factsheet: { label: 'Verkaufs-Factsheet', available: true, maxPages: 2 },
  nda: { label: 'Geheimhaltungsverpflichtung', available: true },
  expose: { label: 'Verkaufsexposé', available: false, outline: EXPOSE_OUTLINE },
};

export class ExportError extends Error {
  constructor(message, issues = []) { super(message); this.issues = issues; }
}

function slug(s) {
  return String(s || 'objekt').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

export function fileName(kind, p) {
  const o = p.object || {};
  const base = slug(`${o.street || ''} ${o.city || ''}`);
  return `${kind === 'nda' ? 'Geheimhaltungsverpflichtung' : 'Factsheet'}_${base || 'Objekt'}.docx`;
}

// Faktenprüfung + KI-Wächter + Dokumentprüfung in einem Bericht
export function inspect(rawProperty, rawTexts) {
  const p = normalizeProperty(rawProperty);
  const texts = rawTexts ? normalizeTexts(rawTexts) : offlineTexts(p);
  const issues = validateProperty(p);
  const guard = texts.provider && texts.provider !== 'offline' ? guardTexts(texts, factBase(p)) : {};
  for (const [pathKey, findings] of Object.entries(guard)) {
    const section = texts.edited[pathKey] ? 'Text (bearbeitet)' : 'KI-Text';
    for (const f of findings) issues.push({ level: 'warning', section, field: pathKey, message: f.message });
  }
  return { p, texts, issues, guard };
}

export async function exportFactsheet(rawProperty, rawTexts, { verify = true } = {}) {
  const { p, texts, issues } = inspect(rawProperty, rawTexts);
  if (hasErrors(issues)) throw new ExportError('Die Angaben enthalten Fehler.', issues);
  const { images, errors } = decodeImages(rawProperty && rawProperty.images);
  if (errors.length) throw new ExportError('Bilder konnten nicht verarbeitet werden.', errors.map((m) => ({ level: 'error', section: 'Bilder', field: '', message: m })));

  let minLevels = [0, 0];
  for (let attempt = 0; attempt < 8; attempt++) {
    const model = buildFactsheet(p, texts, images, { minLevels });
    const docIssues = checkDocument(model);
    if (hasErrors(docIssues)) throw new ExportError('Das Dokument erfüllt die Vorgaben nicht.', [...issues, ...docIssues]);
    const buffer = await renderFactsheetDocx(model, images);
    const rendered = verify ? await renderPdf(buffer) : null;
    if (!rendered || rendered.pages <= 2) {
      return {
        buffer, model, fileName: fileName('factsheet', p),
        pages: rendered ? rendered.pages : 2,
        verifiedBy: rendered ? 'LibreOffice' : 'Seitenberechnung',
        issues: [...issues, ...docIssues],
      };
    }
    // Renderer meldet mehr als 2 Seiten: die knappere Seite eine Stufe weiter verdichten.
    const [a, b] = model.pages;
    const bump = a.height / model.capacity >= b.height / model.capacity ? 0 : 1;
    if (model.pages[bump].level >= model.maxLevels[bump]) {
      const other = 1 - bump;
      if (model.pages[other].level >= model.maxLevels[other]) break;
      minLevels = minLevels.map((l, i) => (i === other ? model.pages[other].level + 1 : model.pages[i].level));
    } else {
      minLevels = minLevels.map((l, i) => (i === bump ? model.pages[bump].level + 1 : model.pages[i].level));
    }
  }
  throw new ExportError('Das Factsheet lässt sich nicht auf 2 Seiten bringen. Bitte Texte kürzen.', issues);
}

export async function exportNda(rawProperty, rawTexts) {
  const p = normalizeProperty(rawProperty);
  const texts = rawTexts ? normalizeTexts(rawTexts) : null;
  const issues = validateProperty(p).filter((i) => i.section === 'Objekt' && i.level === 'error');
  if (issues.length) throw new ExportError('Für die Geheimhaltungsverpflichtung fehlen Objektangaben.', issues);
  const buffer = await renderNdaDocx(p, texts);
  return { buffer, fileName: fileName('nda', p) };
}
