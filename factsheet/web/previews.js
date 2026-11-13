// Vorschau aller Dokumente im Browser – aus denselben Modellen, die auch die Dateien erzeugen.
import { normalizeProperty } from '../src/model/schema.js';
import { buildFactsheet, describeLevel } from '../src/layout/factsheet.js';
import { buildTeaser } from '../src/layout/teaser.js';
import { buildExpose } from '../src/expose/build.js';
import { renderPreview } from '../src/render/html.js';
import { renderExposePages, exposeCss } from '../src/expose/html.js';
import { NDA_TEMPLATE, fillPlaceholders } from '../src/content/nda-template.js';
import { ndaValues } from '../src/docx/nda-docx.js';
import { inseratFacts } from '../src/docx/inserat-docx.js';
import { checkDocument } from '../src/layout/check.js';
import { dossierSections } from '../src/docx/dossier-docx.js';
import { addressLine, designation, bankGaps } from '../src/model/facts.js';
import { fmtChf } from '../src/model/format.js';
import { assetUrl } from './services.js';
import { esc } from './forms.js';

const LOGO = assetUrl('logo/schaeppi-1zeilig-navy.png');

function a4(model, p) {
  return renderPreview(model, p.images, { logoUrl: LOGO });
}

export function previewFactsheet(p, texts) {
  const model = buildFactsheet(p, texts, p.images);
  const info = model.pages.map((pg, i) => `S. ${i + 1}: ${pg.fits ? describeLevel(i, pg.level) : 'zu lang'}`).join(' · ');
  return { html: a4(model, p), model, pages: model.pages.length, info, issues: checkDocument(model), format: 'a4' };
}

export function previewTeaser(p, texts) {
  const model = buildTeaser(p, texts, p.images);
  const pg = model.pages[0];
  return { html: a4(model, p), model, pages: 1, info: pg.fits ? (pg.level ? `verdichtet (Stufe ${pg.level})` : 'Standard') : 'zu lang', issues: checkDocument(model), notes: model.notes, format: 'a4' };
}

let cssInjected = false;
export function previewExpose(p, texts) {
  if (!cssInjected) {
    const st = document.createElement('style');
    st.textContent = exposeCss({ fontUrl: assetUrl('fonts/IBMPlexSans-Regular.ttf') });
    document.head.appendChild(st);
    cssInjected = true;
  }
  const model = buildExpose(p, texts, p.images);
  return { html: renderExposePages(model, { assetUrl }), model, pages: model.pages.length, info: 'A4 quer', notes: model.notes, format: 'a4q' };
}

export function previewNda(p, texts) {
  const v = ndaValues(normalizeProperty(p), texts);
  const f = (t) => esc(fillPlaceholders(t, v));
  const T = NDA_TEMPLATE;
  const html = `<div class="doc-page nda">
    <img src="${LOGO}" alt="Schaeppi Grundstücke" class="nda-logo">
    <h1>${esc(T.title)}</h1>
    <p class="muted">${esc(T.parties.intro)}</p>${T.parties.recipient.map((l, i) => `<p class="${i ? '' : 'b'}">${f(l)}</p>`).join('')}
    <p class="muted">${esc(T.parties.and)}</p>${T.parties.discloser.map((l, i) => `<p class="${i ? '' : 'b'}">${f(l)}</p>`).join('')}
    <p class="muted">${esc(T.parties.subject)}</p>${T.parties.object.map((l, i) => `<p class="${i ? '' : 'b'}">${f(l)}</p>`).join('')}
    ${T.clauses.map((c, i) => `<h3>${i + 1}. ${esc(c.title)}</h3>${c.text.map((x) => `<p>${f(x)}</p>`).join('')}`).join('')}
    <p style="margin-top:22px">${f(T.signature.placeDate)}</p><p class="b">${esc(T.signature.label)}</p>
    <div class="sig"><span>${esc(T.signature.lines.join(' / '))}</span><span>${esc(T.signature.lines.join(' / '))}</span></div>
  </div>`;
  return { html, pages: null, info: 'feste Vorlage – nur Felder werden eingesetzt', format: 'doc' };
}

export function previewInserat(p, texts) {
  const i = texts.inserat;
  const facts = inseratFacts(normalizeProperty(p));
  const html = `<div class="doc-page inserat">
    <div class="ins-block"><div class="ins-label">Titel <button type="button" class="link" data-copy="title">kopieren</button></div><div class="ins-title" data-key="inserat.title">${esc(i.title)}</div></div>
    <div class="ins-block"><div class="ins-label">Kurzbeschrieb <button type="button" class="link" data-copy="short">kopieren</button></div><p data-key="inserat.short">${esc(i.short)}</p></div>
    <div class="ins-block"><div class="ins-label">Beschrieb <button type="button" class="link" data-copy="text">kopieren</button></div><div data-key="inserat.text">${i.text.split(/\n{2,}/).map((x) => `<p>${esc(x)}</p>`).join('')}</div></div>
    <div class="ins-block"><div class="ins-label">Eckdaten</div><table class="ins-facts">${facts.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table></div>
  </div>`;
  return { html, pages: null, info: `${i.text.length} Zeichen Beschrieb`, format: 'doc' };
}

export function previewDossier(property) {
  const p = normalizeProperty(property);
  const s = dossierSections(p);
  const kv = (rows) => `<table class="ins-facts dossier">${rows.map((r) => `<tr><td>${esc(r.label)}</td><td>${esc(r.value).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;
  const tbl = (t) => `<table class="dos-grid"><tr>${t.header.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`;
  const sec = (title, html) => (html ? `<h3 class="dos-h">${esc(title)}</h3>${html}` : '');
  const t = s.rentRoll && s.rentRoll.totals;
  const html = `<div class="doc-page dossier">
    <img src="${LOGO}" alt="Schaeppi Grundstücke" class="nda-logo"><h1>Finanzierungsdossier</h1>
    <p class="muted">${esc(addressLine(p))} · ${esc(designation(p))}</p>
    ${sec('Objekt', s.object.length ? kv(s.object) : '')}
    ${sec('Grundstück & Rechtliches', (s.legal.length ? kv(s.legal) : '') + (s.parcels ? tbl(s.parcels) : ''))}
    ${sec('Gebäude & Zustand', s.building.length ? kv(s.building) : '')}
    ${sec('Investitionen', s.investments.length ? tbl({ header: ['Jahr', 'Massnahme'], rows: s.investments.map((i) => [String(i.year), i.measure]) }) : '')}
    ${sec('Mieterspiegel', s.rentRoll ? tbl(s.rentRoll) + (t ? `<p class="muted">Total vermietet: ${esc(fmtChf(t.netMonthly))} / Mt. · ${esc(fmtChf(t.netYearly))} p.a.</p>` : '') : '')}
    ${sec('Erträge, Kosten & Werte', s.finance.length ? kv(s.finance) : '')}
    ${sec('Kennzahlen (berechnet)', s.figures.length ? kv(s.figures) : '')}
    ${sec('Unterlagen', `<table class="dos-grid"><tr><th>Unterlage</th><th>Status</th><th>Stand</th></tr>${s.checklist.map((r) => `<tr><td>${esc(r.name)}</td><td class="st-${esc(r.status.replace(/\s/g, '-'))}">${esc(r.status)}</td><td>${esc(r.date || '–')}</td></tr>`).join('')}</table>`)}
  </div>`;
  const gaps = bankGaps(p);
  return { html, pages: null, info: 'nur Fakten, keine Werbetexte', notes: gaps.length ? [`Für die Bank fehlen noch: ${gaps.join(', ')}`] : [], format: 'doc' };
}

export const PREVIEWS = { factsheet: previewFactsheet, expose: previewExpose, teaser: previewTeaser, nda: previewNda, inserat: previewInserat, dossier: previewDossier };
