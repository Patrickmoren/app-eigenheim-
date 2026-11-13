// Dokumenttypen (DocumentTemplate-Registry) und Ablauf von Prüfung bis Datei.
// Läuft im Browser und in Node. Die Umgebung kann eine Seitenprüfung mit einem echten
// Layout-Renderer einreichen (Option verify: async bytes -> { pages } | null).
//
//   factsheet  Verkaufs-Factsheet, max. 2 Seiten                    DOCX
//   expose     Verkaufsdokumentation, A4 quer                       PDF (HTML-Druckvorlage) + DOCX
//   teaser     anonymer Kurzbeschrieb, 1 Seite                      DOCX
//   nda        Geheimhaltungsverpflichtung, feste Vorlage           DOCX
//   inserat    Inserattexte für Immobilienportale                   DOCX + Text
//   dossier    Finanzierungsdossier für Banken (nur Fakten)         DOCX
import { normalizeProperty } from './model/schema.js';
import { validateProperty, hasErrors } from './model/validate.js';
import { factBase } from './model/facts.js';
import { normalizeTexts, offlineTexts, completeTexts } from './content/texts.js';
import { guardTexts } from './content/guard.js';
import { buildFactsheet } from './layout/factsheet.js';
import { buildTeaser } from './layout/teaser.js';
import { checkDocument } from './layout/check.js';
import { buildExpose } from './expose/build.js';
import { renderExposeDocument } from './expose/html.js';
import { decodeImages } from './media/images.js';
import { renderFactsheetDocx } from './docx/factsheet-docx.js';
import { renderNdaDocx } from './docx/nda-docx.js';
import { renderExposeDocx } from './docx/expose-docx.js';
import { renderInseratDocx, inseratText } from './docx/inserat-docx.js';
import { renderDossierDocx } from './docx/dossier-docx.js';
import { bankGaps } from './model/facts.js';

export const DOCUMENT_TYPES = {
  factsheet: { label: 'Verkaufs-Factsheet', short: 'Factsheet', formats: ['docx'], description: 'Zwei Seiten im Schaeppi-Design: Transaktionsübersicht, Investorenargumente, Facts & Figures.' },
  expose: { label: 'Verkaufsdokumentation', short: 'Dokumentation', formats: ['pdf', 'docx'], description: 'Ausführliche Dokumentation im Stil der InDesign-Vorlage: Bilder, Lage, Region, Einheiten, Grundrisse, Kontakt.' },
  teaser: { label: 'Anonymer Teaser', short: 'Teaser', formats: ['docx'], description: 'Eine Seite ohne Adresse für die Erstansprache von Investoren.' },
  nda: { label: 'Geheimhaltungsverpflichtung', short: 'NDA', formats: ['docx'], description: 'Standardvorlage mit Objekt und Interessent, kein KI-Text.' },
  inserat: { label: 'Inserattexte', short: 'Inserat', formats: ['docx', 'txt'], description: 'Titel, Kurzbeschrieb und Beschrieb für Homegate, ImmoScout24 und die Website.' },
  dossier: { label: 'Finanzierungsdossier', short: 'Bankdossier', formats: ['docx'], description: 'Alle finanzierungsrelevanten Fakten für Banken: Grundbuch, Gebäude, Mieterspiegel, Kennzahlen, Unterlagen-Checkliste.' },
};

export class ExportError extends Error {
  constructor(message, issues = []) { super(message); this.issues = issues; }
}

function slug(s) {
  return String(s || 'objekt').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

const FILE_PREFIX = { factsheet: 'Factsheet', expose: 'Verkaufsdokumentation', teaser: 'Teaser', nda: 'Geheimhaltungsverpflichtung', inserat: 'Inserat', dossier: 'Finanzierungsdossier' };

export function fileName(kind, p, ext = 'docx') {
  const o = p.object || {};
  // Der Teaser trägt keine Adresse im Dateinamen
  const base = kind === 'teaser' ? slug(p.process && p.process.teaserLocation ? p.process.teaserLocation : o.city) : slug(`${o.street || ''} ${o.city || ''}`);
  return `${FILE_PREFIX[kind]}_${base || 'Objekt'}.${ext}`;
}

// Faktenprüfung + KI-Wächter in einem Bericht; Texte werden um fehlende Bausteine ergänzt.
export function inspect(rawProperty, rawTexts) {
  const p = normalizeProperty(rawProperty);
  const texts = rawTexts ? completeTexts(rawTexts, p) : offlineTexts(p);
  if (rawTexts) { const n = normalizeTexts(rawTexts); texts.provider = n.provider; texts.generatedAt = n.generatedAt; }
  const issues = validateProperty(p);
  const guard = texts.provider && texts.provider !== 'offline' ? guardTexts(texts, factBase(p), p) : {};
  for (const [pathKey, findings] of Object.entries(guard)) {
    const section = texts.edited[pathKey] ? 'Text (bearbeitet)' : 'KI-Text';
    for (const f of findings) issues.push({ level: f.kind === 'anonym' ? 'error' : 'warning', section, field: pathKey, message: f.message });
  }
  return { p, texts, issues, guard };
}

function prepare(rawProperty, rawTexts, { ignore = [] } = {}) {
  const r = inspect(rawProperty, rawTexts);
  const blocking = r.issues.filter((i) => i.level === 'error' && !ignore.some((fn) => fn(i)));
  if (blocking.length) throw new ExportError('Die Angaben enthalten Fehler.', r.issues);
  const { images, errors } = decodeImages(r.p.images);
  if (errors.length) throw new ExportError('Bilder konnten nicht verarbeitet werden.', errors.map((m) => ({ level: 'error', section: 'Bilder', field: '', message: m })));
  return { ...r, images };
}

// Anonymitätsfehler betreffen nur den Teaser
const onlyTeaser = (i) => i.field && i.field.startsWith('teaser.');

// Seitenbegrenzte Dokumente (Factsheet 2 Seiten, Teaser 1 Seite): bauen, prüfen, verdichten
async function boundedDocument({ build, maxPages, verify, docTitle, images, issues, label }) {
  let minLevels = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const model = build(minLevels);
    const docIssues = checkDocument(model);
    if (hasErrors(docIssues)) throw new ExportError('Das Dokument erfüllt die Vorgaben nicht.', [...issues, ...docIssues]);
    const buffer = await renderFactsheetDocx(model, images, { docTitle });
    const rendered = verify ? await verify(buffer) : null;
    if (!rendered || rendered.pages <= maxPages) {
      return { buffer, model, pages: rendered ? rendered.pages : model.pages.length, verifiedBy: rendered ? 'LibreOffice' : 'Seitenberechnung', issues: [...issues, ...docIssues] };
    }
    // Renderer meldet zu viele Seiten: die vollste Seite eine Stufe weiter verdichten.
    const levels = model.pages.map((pg) => pg.level);
    const order = model.pages.map((pg, i) => i).sort((a, b) => model.pages[b].height - model.pages[a].height);
    const i = order.find((k) => levels[k] < model.maxLevels[k]);
    if (i === undefined) break;
    levels[i] += 1;
    minLevels = levels;
  }
  throw new ExportError(`${label} lässt sich nicht auf ${maxPages} Seite${maxPages > 1 ? 'n' : ''} bringen. Bitte Texte kürzen.`, issues);
}

export async function exportFactsheet(rawProperty, rawTexts, { verify = null } = {}) {
  const { p, texts, images, issues } = prepare(rawProperty, rawTexts, { ignore: [onlyTeaser] });
  const r = await boundedDocument({
    build: (min) => buildFactsheet(p, texts, images, min ? { minLevels: min } : {}),
    maxPages: 2, verify, docTitle: `Factsheet – ${texts.title}`, images, issues, label: 'Das Factsheet',
  });
  return { ...r, fileName: fileName('factsheet', p) };
}

export async function exportTeaser(rawProperty, rawTexts, { verify = null } = {}) {
  const { p, texts, images, issues } = prepare(rawProperty, rawTexts);
  const r = await boundedDocument({
    build: (min) => buildTeaser(p, texts, images, min ? { minLevel: min[0] } : {}),
    maxPages: 1, verify, docTitle: `Teaser – ${texts.teaser.title}`, images, issues, label: 'Der Teaser',
  });
  return { ...r, fileName: fileName('teaser', p), notes: r.model.notes };
}

export async function exportExposeDocx(rawProperty, rawTexts) {
  const { p, texts, images, issues } = prepare(rawProperty, rawTexts, { ignore: [onlyTeaser] });
  const model = buildExpose(p, texts, p.images);
  const buffer = await renderExposeDocx(model, { raw: p.images, decoded: images });
  return { buffer, model, fileName: fileName('expose', p), pages: model.pages.length, issues, notes: model.notes };
}

// Druckvorlage (HTML) der Verkaufsdokumentation; die Umgebung erzeugt daraus das PDF.
export function exposeDocument(rawProperty, rawTexts, { assetUrl, fontUrl } = {}) {
  const { p, texts, issues } = prepare(rawProperty, rawTexts, { ignore: [onlyTeaser] });
  const model = buildExpose(p, texts, p.images);
  return { html: renderExposeDocument(model, { assetUrl, fontUrl }), model, fileName: fileName('expose', p, 'pdf'), pages: model.pages.length, issues, notes: model.notes };
}

export async function exportNda(rawProperty, rawTexts) {
  const p = normalizeProperty(rawProperty);
  const texts = rawTexts ? completeTexts(rawTexts, p) : null;
  const issues = validateProperty(p).filter((i) => i.section === 'Objekt' && i.level === 'error');
  if (issues.length) throw new ExportError('Für die Geheimhaltungsverpflichtung fehlen Objektangaben.', issues);
  const buffer = await renderNdaDocx(p, texts);
  return { buffer, fileName: fileName('nda', p) };
}

export async function exportInserat(rawProperty, rawTexts) {
  const { p, texts, issues } = prepare(rawProperty, rawTexts, { ignore: [onlyTeaser] });
  const buffer = await renderInseratDocx(p, texts);
  return { buffer, text: inseratText(p, texts), fileName: fileName('inserat', p), issues };
}

// Finanzierungsdossier: nur Fakten. sources = { Bezeichnung: Quelle } für das Quellenverzeichnis.
export async function exportDossier(rawProperty, rawTexts, { sources = null } = {}) {
  const { p, issues } = prepare(rawProperty, rawTexts, { ignore: [(i) => i.section === 'KI-Text' || i.section === 'Text (bearbeitet)'] });
  const buffer = await renderDossierDocx(p, { sources });
  const gaps = bankGaps(p);
  return { buffer, fileName: fileName('dossier', p), issues, gaps, notes: gaps.length ? [`Für die Bank fehlen noch: ${gaps.join(', ')}.`] : [] };
}
