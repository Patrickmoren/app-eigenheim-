// Oberfläche des Factsheet-Generators.
// Arbeitsschritte: Basisdaten → Details → Bilder → Texte (KI) → Export.
// Vorschau, Fakten- und Dokumentprüfung laufen im Browser mit denselben Modulen wie der Server.
import { SECTIONS, IMAGE_SLOTS, NDA_FIELDS, createEmptyProperty, createEmptyItem, normalizeProperty, isEmpty, toNumber } from '../src/model/schema.js';
import { validateProperty } from '../src/model/validate.js';
import { factBase } from '../src/model/facts.js';
import { fmtChf, fmtArea } from '../src/model/format.js';
import { offlineTexts, normalizeTexts, OVERVIEW_PARTS } from '../src/content/texts.js';
import { guardTexts } from '../src/content/guard.js';
import { buildFactsheet, describeLevel } from '../src/layout/factsheet.js';
import { checkDocument } from '../src/layout/check.js';
import { renderPreview } from '../src/render/html.js';
import { BUDGET, PAGE } from '../src/layout/design.js';

const STORE_KEY = 'schaeppi-factsheet-v1';
const STEPS = [
  { id: 'basis', title: 'Basisdaten' },
  { id: 'details', title: 'Details' },
  { id: 'images', title: 'Bilder' },
  { id: 'texts', title: 'Texte' },
  { id: 'export', title: 'Export' },
];

const state = {
  step: 'basis',
  property: createEmptyProperty(),
  texts: null,        // aktuelle (ggf. bearbeitete) Texte; null = noch nicht erstellt
  aiOriginal: null,   // unveränderte KI-Fassung zum Zurücksetzen
  textsStale: false,  // Angaben nach der Texterstellung geändert
  status: null,
  busy: {},
  results: {},
  model: null,
};

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Hilfsfunktionen für Pfade ----------
function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => o[k], obj);
  target[last] = value;
}

// ---------- Speicherung ----------
let saveTimer;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const data = { property: state.property, texts: state.texts, aiOriginal: state.aiOriginal, textsStale: state.textsStale };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {
      // Bilder sprengen evtl. das Speicherlimit – dann ohne Bilder sichern.
      try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...data, property: { ...state.property, images: {} } })); } catch { /* ohne Zwischenspeicher */ }
    }
  }, 400);
}
function restore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    state.property = normalizeProperty(d.property);
    state.texts = d.texts ? normalizeTexts(d.texts) : null;
    state.aiOriginal = d.aiOriginal ? normalizeTexts(d.aiOriginal) : null;
    state.textsStale = !!d.textsStale;
  } catch { /* beschädigter Zwischenspeicher wird ignoriert */ }
}

// ---------- Server ----------
async function api(path, body) {
  const res = await fetch(path, body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) {
    let msg = `Fehler ${res.status}`;
    let issues = [];
    try { const j = await res.json(); msg = j.message || msg; issues = j.issues || []; } catch { /* keine Details */ }
    throw Object.assign(new Error(msg), { issues });
  }
  return res;
}

function toast(msg, error = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `toast${error ? ' error' : ''}`;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, error ? 7000 : 3500);
}

// ---------- Aktuelle Texte / Prüfung ----------
function currentTexts() {
  return state.texts || offlineTexts(state.property);
}

function collectIssues(model) {
  const p = state.property;
  const texts = currentTexts();
  const issues = [...validateProperty(p), ...checkDocument(model)];
  if (texts.provider && texts.provider !== 'offline') {
    const guard = guardTexts(texts, factBase(p));
    for (const [key, findings] of Object.entries(guard)) {
      const section = texts.edited[key] ? 'Text (bearbeitet)' : 'KI-Text';
      for (const f of findings) issues.push({ level: 'warning', section, field: labelForTextKey(key), message: f.message });
    }
  }
  const order = { error: 0, warning: 1, info: 2 };
  return issues.sort((a, b) => order[a.level] - order[b.level]);
}

function labelForTextKey(key) {
  if (key === 'title') return 'Titel';
  if (key.startsWith('overview.')) return (OVERVIEW_PARTS.find((x) => `overview.${x.key}` === key) || {}).label || key;
  if (key.startsWith('arguments.')) return `Argument ${Number(key.split('.')[1]) + 1}`;
  return key;
}

// ---------- Vorschau ----------
let previewTimer;
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(renderPreviewPane, 120);
}

function renderPreviewPane() {
  const p = state.property;
  const texts = currentTexts();
  const model = buildFactsheet(p, texts, p.images);
  state.model = model;
  const html = renderPreview(model, p.images);
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const pages = $('#pages');
  pages.innerHTML = '';
  [...tmp.children].forEach((pg, i) => {
    const label = document.createElement('div');
    label.className = 'page-label';
    label.textContent = `Seite ${i + 1} / ${model.pages.length}`;
    const wrap = document.createElement('div');
    wrap.className = 'page-wrap';
    wrap.appendChild(pg);
    pages.append(label, wrap);
  });
  fitZoom();
  pages.classList.toggle('mark-ai', $('#mark-ai').checked);

  const info = model.pages.map((pg, i) => `S. ${i + 1}: ${pg.fits ? describeLevel(i, pg.level) : 'zu lang'}`).join(' · ');
  $('#page-info').textContent = `${model.pages.length} Seiten · ${info}${state.texts ? '' : ' · regelbasierte Texte'}`;

  const issues = collectIssues(model);
  $('#issues').innerHTML = issues.length
    ? issues.map((i) => `<div class="issue ${i.level}"><span class="lvl">${{ error: 'Fehler', warning: 'Prüfen', info: 'Hinweis' }[i.level]}</span><span><b>${esc(i.section)}${i.field ? ' · ' + esc(i.field) : ''}:</b> ${esc(i.message)}</span></div>`).join('')
    : '<div class="issue info"><span class="lvl">OK</span><span>Keine Beanstandungen.</span></div>';
  state.issues = issues;
  renderSteps();
  refreshSectionMeta();
}

function fitZoom() {
  const pagesEl = $('#pages');
  const avail = pagesEl.clientWidth - 8;
  const pagePx = PAGE.width * 96 / 72;
  const zoom = Math.min(1, avail / pagePx);
  pagesEl.querySelectorAll('.page-wrap').forEach((w) => { w.style.zoom = zoom; });
}

// ---------- Schritte ----------
function renderSteps() {
  const count = (level) => SECTIONS.filter((s) => s.level === level).reduce((a, s) => a + sectionErrors(s).filter((i) => i.level === 'error').length, 0);
  const basisErr = count('basis');
  const detailErr = count('detail');
  const realBasisErr = (state.issues || []).some((i) => i.level === 'error' && SECTIONS.some((s) => s.level === 'basis' && s.title === i.section));
  const done = {
    basis: !realBasisErr,
    details: detailErr === 0 && SECTIONS.some((s) => s.level === 'detail' && sectionFill(s).filled > 0),
    images: Object.keys(state.property.images).length > 0,
    texts: !!state.texts,
    export: !!state.results.factsheet,
  };
  const badge = { basis: basisErr, details: detailErr };
  $('#steps').innerHTML = STEPS.map((s, i) => `<button type="button" class="step${state.step === s.id ? ' active' : ''}${done[s.id] ? ' done' : ''}" data-step="${s.id}">`
    + `<b>${done[s.id] ? '✓' : i + 1}</b>${s.title}${badge[s.id] ? `<span class="badge">${badge[s.id]} Fehler</span>` : ''}</button>`).join('');
}

// ---------- Formularfelder ----------
const FULL = new Set(['textarea', 'bool']);
const WIDE_KEYS = new Set(['street', 'features', 'measure', 'note', 'designation', 'label', 'value', 'email']);
const W2 = new Set(['zip', 'count', 'rooms', 'kind', 'year', 'number', 'share']);

function widthClass(f, inList) {
  if (FULL.has(f.type)) return '';
  if (f.key === 'city') return 'w4';
  if (W2.has(f.key)) return 'w2';
  if (WIDE_KEYS.has(f.key)) return inList && f.key !== 'features' && f.key !== 'measure' ? 'w3' : '';
  return 'w3';
}

function fieldHtml(f, path, value, { inList = false } = {}) {
  const id = `f-${path.replace(/\./g, '-')}`;
  const req = f.required ? ' <span class="req">*</span>' : '';
  const unit = f.unit ? ` (${f.unit})` : '';
  let control;
  if (f.type === 'bool') {
    return `<div class="f"><label class="check"><input type="checkbox" id="${id}" data-path="${path}" ${value ? 'checked' : ''}> ${esc(f.label)}</label>${f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
  }
  if (f.type === 'select') {
    const blank = f.options.includes('') ? '' : `<option value=""${isEmpty(value) ? ' selected' : ''}>– bitte wählen –</option>`;
    control = `<select id="${id}" data-path="${path}">${blank}${f.options.map((o) => `<option value="${esc(o)}"${o === value ? ' selected' : ''}>${esc(o || '–')}</option>`).join('')}${f.options.includes(value) || isEmpty(value) ? '' : `<option selected>${esc(value)}</option>`}</select>`;
  } else if (f.type === 'textarea') {
    control = `<textarea id="${id}" data-path="${path}" rows="${f.rows || 3}" placeholder="${esc(f.placeholder || '')}">${esc(value)}</textarea>`;
  } else {
    const numeric = ['number', 'integer', 'year', 'money', 'percent', 'area'].includes(f.type);
    control = `<input id="${id}" data-path="${path}" type="text" ${numeric ? 'inputmode="decimal"' : ''} ${f.type === 'email' ? 'inputmode="email" autocomplete="email"' : ''} value="${esc(value)}" placeholder="${esc(f.placeholder || '')}">`;
  }
  const hint = hintFor(f, value);
  return `<div class="f ${widthClass(f, inList)}"><label for="${id}">${esc(f.label)}${unit}${req}</label>${control}${hint ? `<span class="help">${esc(hint)}</span>` : f.help ? `<span class="help">${esc(f.help)}</span>` : ''}</div>`;
}

function hintFor(f, v) {
  if (isEmpty(v)) return '';
  if (f.type === 'money' && toNumber(v) !== null) return `= ${fmtChf(v)}`;
  if (f.type === 'area' && toNumber(v) !== null && String(v).includes("'")) return `= ${fmtArea(v)}`;
  return '';
}

function sectionFill(s) {
  const p = state.property;
  if (s.list) return { filled: (p[s.id] || []).filter((it) => s.fields.some((f) => f.required && !isEmpty(it[f.key]))).length, total: null };
  const fields = s.fields.filter((f) => f.type !== 'bool' && f.key !== 'priceLabel');
  const filled = fields.filter((f) => !isEmpty(p[s.id][f.key])).length;
  return { filled, total: fields.length };
}

// Bei einem neuen Objekt erscheinen Fehler eines Abschnitts erst, wenn darin etwas erfasst wurde
// oder der Export aufgerufen wurde – nicht schon beim ersten Öffnen.
function sectionErrors(s) {
  if (!state.showAllErrors && sectionFill(s).filled === 0) return [];
  return (state.issues || []).filter((i) => i.section === s.title && i.level !== 'info');
}

function listHtml(listPath, def, items) {
  const canAdd = !def.maxItems || items.length < def.maxItems;
  return items.map((it, i) => `<div class="list-item"><div class="list-title">${esc(def.itemLabel)} ${i + 1}</div>`
    + `${items.length > (def.minItems || 0) ? `<button type="button" class="btn link remove" data-action="remove-item" data-list="${listPath}" data-index="${i}" aria-label="${esc(def.itemLabel)} ${i + 1} entfernen">Entfernen</button>` : ''}`
    + `<div class="grid">${def.fields.map((f) => fieldHtml(f, `${listPath}.${i}.${f.key}`, it[f.key], { inList: true })).join('')}</div></div>`).join('')
    + (canAdd ? `<button type="button" class="btn secondary small" data-action="add-item" data-list="${listPath}">+ ${esc(def.itemLabel)} hinzufügen</button>` : '');
}

function sectionHtml(s, { open = true } = {}) {
  const p = state.property;
  const fill = sectionFill(s);
  const errs = sectionErrors(s);
  let body = '';
  if (s.list) {
    body += listHtml(s.id, s, p[s.id]);
    if (s.extra) body += `<div class="grid" style="margin-top:12px">${s.extra.map((f) => fieldHtml(f, `${s.id}Extra.${f.key}`, p[`${s.id}Extra`][f.key])).join('')}</div>`;
  } else {
    body += `<div class="grid">${s.fields.map((f) => fieldHtml(f, `${s.id}.${f.key}`, p[s.id][f.key])).join('')}</div>`;
    if (s.listExtra) {
      body += `<h3 style="font-size:14px;margin:16px 0 8px">${esc(s.listExtra.title)}</h3>`;
      body += listHtml(`${s.id}.${s.listExtra.key}`, s.listExtra, p[s.id][s.listExtra.key]);
    }
  }
  return `<details class="card" data-section="${s.id}" ${open ? 'open' : ''}><summary><h3>${esc(s.title)}</h3><span class="fill">${fillText(fill)}</span></summary>`
    + `<div class="card-body"><div class="sec-errors">${sectionErrorsHtml(errs)}</div>${body}</div></details>`;
}

const fillText = (fill) => (fill.total ? `${fill.filled} von ${fill.total} Angaben` : `${fill.filled} erfasst`);
const sectionErrorsHtml = (errs) => (errs.length ? `<ul class="findings" style="background:#fdecea;color:#5c1a15">${errs.map((e) => `<li>${esc(e.field)}: ${esc(e.message)}</li>`).join('')}</ul>` : '');

// Aktualisiert Fehlerlisten und Füllstand der Abschnitte, ohne das Formular neu aufzubauen (Fokus bleibt).
function refreshSectionMeta() {
  document.querySelectorAll('#panel details.card').forEach((card) => {
    const s = SECTIONS.find((x) => x.id === card.dataset.section);
    if (!s) return;
    card.querySelector('.sec-errors').innerHTML = sectionErrorsHtml(sectionErrors(s));
    card.querySelector('.fill').textContent = fillText(sectionFill(s));
  });
}

// ---------- Panels ----------
function panelBasis() {
  return `<h2>Basisdaten</h2><p class="intro">Die wichtigsten Eckdaten genügen für ein vollständiges Factsheet. Pflichtangaben sind mit <span style="color:var(--error)">*</span> markiert. Zahlen dürfen mit Apostroph erfasst werden (z. B. 42'600).</p>`
    + SECTIONS.filter((s) => s.level === 'basis').map((s) => sectionHtml(s)).join('')
    + nextButton('details', 'Weiter zu den Details');
}

function panelDetails() {
  return `<h2>Optionale Details</h2><p class="intro">Alles hier ist freiwillig. Fehlende Angaben erscheinen im Dokument nicht – es entsteht keine leere Tabelle und kein Platzhalter. Die KI verwendet nur, was hier steht.</p>`
    + SECTIONS.filter((s) => s.level === 'detail').map((s) => sectionHtml(s, { open: sectionFill(s).filled > 0 || sectionErrors(s).length > 0 })).join('')
    + nextButton('images', 'Weiter zu den Bildern');
}

function panelImages() {
  const imgs = state.property.images;
  return `<h2>Bilder</h2><p class="intro">Optional. Bildpositionen sind im Template festgelegt; Bilder werden automatisch zugeschnitten, nie verzerrt. Ohne Bild entfällt der Rahmen vollständig. Seite 2 zeigt höchstens zwei der drei Zusatzbilder (Objekt, Lage, Grundriss – in dieser Reihenfolge), sofern Platz ist.</p>`
    + `<div class="slots">${IMAGE_SLOTS.map((s) => `<div class="slot ${s.key === 'cover' ? 'cover' : ''}"><div class="thumb">${imgs[s.key] ? `<img src="${imgs[s.key]}" alt="${esc(s.label)}">` : 'Kein Bild'}</div>`
      + `<div class="slot-bar"><span>${esc(s.label)}</span><span><label class="btn secondary small">${imgs[s.key] ? 'Ersetzen' : 'Hochladen'}<input type="file" accept="image/jpeg,image/png" data-slot="${s.key}" hidden></label>`
      + `${imgs[s.key] ? ` <button type="button" class="btn link" data-action="remove-image" data-slot="${s.key}">Entfernen</button>` : ''}</span></div></div>`).join('')}</div>`
    + nextButton('texts', 'Weiter zu den Texten');
}

function counter(text, max) {
  const n = (text || '').length;
  return `<span class="counter${n > max ? ' over' : ''}">${n} / ${max} Zeichen</span>`;
}

function srcBadge(key) {
  const t = state.texts;
  if (!t) return '';
  if (t.edited[key]) return '<span class="src">bearbeitet</span>';
  return `<span class="src">${t.provider === 'offline' ? 'regelbasiert' : 'KI'}</span>`;
}

function findingsHtml(key, guard) {
  const f = guard[key];
  if (!f || !f.length) return '';
  return `<ul class="findings">${f.map((x) => `<li>${esc(x.message)}</li>`).join('')}</ul>`;
}

function resetBtn(key) {
  if (!state.aiOriginal || !state.texts.edited[key]) return '';
  return `<button type="button" class="btn link" data-action="reset-text" data-key="${key}">KI-Fassung wiederherstellen</button>`;
}

function panelTexts() {
  const st = state.status;
  const ai = st && st.provider !== 'offline';
  const busy = state.busy.texts;
  let h = `<h2>Texte</h2><p class="intro">Die ${ai ? 'KI' : 'Textautomatik'} formuliert aus den erfassten Fakten Titel, Transaktionsübersicht und Investorenargumente. Sie ergänzt keine Angaben. Alle Texte sind hier frei bearbeitbar; die Vorschau aktualisiert sich sofort. Klicken Sie in der Vorschau auf einen Text, um ihn hier zu bearbeiten.</p>`;
  if (st && !ai) h += `<p class="note warn">Kein KI-Zugang konfiguriert: Es werden sachliche, regelbasierte Texte aus den Fakten erzeugt. Für KI-Texte ANTHROPIC_API_KEY auf dem Server setzen.</p>`;
  if (state.textsStale && state.texts) h += `<p class="note warn">Die Angaben wurden nach der Texterstellung geändert. Texte prüfen oder neu erstellen.</p>`;
  h += `<p><button type="button" class="btn big" data-action="generate" ${busy ? 'disabled' : ''}>${busy ? '<span class="spinner"></span> Texte werden erstellt …' : state.texts ? 'KI-Inhalte neu erstellen' : 'KI-Inhalte erstellen'}</button></p>`;
  if (!state.texts) {
    return h + `<p class="note">Solange keine Texte erstellt sind, zeigt die Vorschau regelbasierte Texte aus den Fakten.</p>`;
  }
  const t = state.texts;
  const guard = t.provider === 'offline' ? {} : guardTexts(t, factBase(state.property));
  const trimmed = state.model ? state.model.pages[0].blocks.flatMap((b) => (b.left || [])).filter((b) => b.trimmed) : [];
  if (trimmed.length) {
    h += `<p class="note warn">Für die 2-Seiten-Grenze wurden Texte auf ganze Sätze gekürzt (in der Vorschau gepunktet unterstrichen). ${ai ? `<button type="button" class="btn secondary small" data-action="condense" ${busy ? 'disabled' : ''}>Mit KI verdichten</button>` : 'Texte hier von Hand kürzen.'}</p>`;
  }
  h += `<div class="text-field f"><div class="row"><label for="t-title">Titel / Objektbezeichnung ${srcBadge('title')}</label>${counter(t.title, BUDGET.title)}</div>`
    + `<input id="t-title" type="text" data-tpath="title" data-tkey="title" value="${esc(t.title)}">${findingsHtml('title', guard)}${resetBtn('title')}</div>`;
  h += '<h3 style="margin:18px 0 10px">Transaktionsübersicht</h3>';
  for (const part of OVERVIEW_PARTS) {
    const key = `overview.${part.key}`;
    h += `<div class="text-field f"><div class="row"><label for="t-${part.key}">${esc(part.label)} ${srcBadge(key)}</label>${counter(t.overview[part.key], BUDGET[part.key])}</div>`
      + `<textarea id="t-${part.key}" rows="4" data-tpath="${key}" data-tkey="${key}">${esc(t.overview[part.key])}</textarea>${findingsHtml(key, guard)}${resetBtn(key)}</div>`;
  }
  h += '<h3 style="margin:18px 0 10px">Investorenargumente</h3>';
  t.arguments.forEach((a, i) => {
    const key = `arguments.${i}`;
    h += `<div class="list-item"><div class="list-title">Argument ${i + 1} ${srcBadge(key)}</div><button type="button" class="btn link remove" data-action="remove-arg" data-index="${i}">Entfernen</button>`
      + `<div class="f"><input type="text" data-tpath="arguments.${i}.title" data-tkey="${key}" value="${esc(a.title)}" aria-label="Titel Argument ${i + 1}" placeholder="Titel">${counter(a.title, BUDGET.argumentTitle)}</div>`
      + `<div class="f" style="margin-top:6px"><textarea rows="2" data-tpath="arguments.${i}.text" data-tkey="${key}" aria-label="Text Argument ${i + 1}">${esc(a.text)}</textarea>${counter(a.text, BUDGET.argumentText)}</div>`
      + `${a.basis && a.basis.length ? `<div class="help" style="font-size:12px;color:var(--muted);margin-top:4px">Grundlage: ${esc(a.basis.join(', '))}</div>` : ''}${findingsHtml(key, guard)}${resetBtn(key)}</div>`;
  });
  if (t.arguments.length < BUDGET.argumentsMax) h += '<button type="button" class="btn secondary small" data-action="add-arg">+ Argument hinzufügen</button>';
  return h + nextButton('export', 'Weiter zum Export');
}

function panelExport() {
  const p = state.property;
  const errors = (state.issues || []).filter((i) => i.level === 'error');
  const warnings = (state.issues || []).filter((i) => i.level === 'warning');
  const r = state.results;
  let h = `<h2>Export</h2><p class="intro">Das Factsheet wird als bearbeitbare Word-Datei (.docx) im Schaeppi-Design erstellt – höchstens zwei Seiten. Vor dem Export werden Fakten, Dokument und KI-Texte geprüft (Liste unter der Vorschau).</p>`;
  if (errors.length) h += `<p class="note warn"><b>${errors.length} Fehler</b> verhindern den Export. Details stehen unter der Vorschau.</p>`;
  else if (warnings.length) h += `<p class="note"><b>${warnings.length} Hinweise</b> zur Prüfung – Export ist möglich.</p>`;
  if (!state.texts) h += `<p class="note">Es sind noch keine KI-Inhalte erstellt; exportiert werden die regelbasierten Texte.</p>`;

  h += `<div class="export-card"><h3>Verkaufs-Factsheet</h3><div class="grid" style="margin:10px 0 12px">`
    + fieldHtml({ key: 'docLabel', label: 'Kennzeichnung im Titel', type: 'text' }, 'meta.docLabel', p.meta.docLabel)
    + fieldHtml({ key: 'confidential', label: 'Als VERTRAULICH kennzeichnen', type: 'bool' }, 'meta.confidential', p.meta.confidential)
    + `</div><button type="button" class="btn big" data-action="export-factsheet" ${errors.length || state.busy.factsheet ? 'disabled' : ''}>${state.busy.factsheet ? '<span class="spinner"></span> Wird erstellt …' : 'Factsheet erstellen (.docx)'}</button>`
    + (r.factsheet ? `<div class="result">✓ ${esc(r.factsheet)}</div>` : '') + '</div>';

  const ndaOn = !!state.ndaOpen;
  h += `<div class="export-card"><h3>Geheimhaltungsverpflichtung</h3><p>Standardisierte Vorlage (kein KI-Text). Objekt und Adresse werden übernommen; leere Felder bleiben als Ausfülllinie stehen.</p>`
    + `<label class="check"><input type="checkbox" data-action="toggle-nda" ${ndaOn ? 'checked' : ''}> NDA erstellen</label>`;
  if (ndaOn) {
    h += `<div class="grid" style="margin:12px 0">${NDA_FIELDS.map((f) => fieldHtml(f, `nda.${f.key}`, p.nda[f.key])).join('')}</div>`
      + `<button type="button" class="btn big secondary" data-action="export-nda" ${state.busy.nda ? 'disabled' : ''}>${state.busy.nda ? '<span class="spinner"></span> Wird erstellt …' : 'Geheimhaltungsverpflichtung erstellen (.docx)'}</button>`
      + (r.nda ? `<div class="result">✓ ${esc(r.nda)}</div>` : '');
  }
  h += '</div>';
  h += `<div class="export-card disabled"><h3>Verkaufsexposé</h3><p>In Vorbereitung: umfangreiches Verkaufsdokument (ca. 8–20 Seiten) aus denselben Objektdaten – ohne erneute Erfassung.</p><button type="button" class="btn secondary" disabled>Verkaufsexposé erstellen</button></div>`;
  return h;
}

function nextButton(step, label) {
  return `<p style="margin-top:18px"><button type="button" class="btn secondary" data-step="${step}">${esc(label)} →</button></p>`;
}

function renderPanel() {
  const panel = $('#panel');
  const scroll = panel.scrollTop;
  const openCards = new Set([...panel.querySelectorAll('details.card')].filter((d) => d.open).map((d) => d.dataset.section));
  const hadCards = panel.querySelector('details.card');
  panel.innerHTML = { basis: panelBasis, details: panelDetails, images: panelImages, texts: panelTexts, export: panelExport }[state.step]();
  if (hadCards && panel.dataset.current === state.step) {
    panel.querySelectorAll('details.card').forEach((d) => { d.open = openCards.has(d.dataset.section); });
    panel.scrollTop = scroll;
  }
  panel.dataset.current = state.step;
}

function go(step) {
  state.step = step;
  if (step === 'export') state.showAllErrors = true;
  renderPanel();
  renderSteps();
  $('#panel').scrollTop = 0;
}

// ---------- Aktionen ----------
function propertyChanged() {
  if (state.texts) state.textsStale = true;
  state.results = {};
  persist();
  schedulePreview();
}

function textsChanged() {
  state.results.factsheet = null;
  persist();
  schedulePreview();
}

async function generate({ factor = 1, previous = null } = {}) {
  state.busy.texts = true;
  renderPanel();
  try {
    const res = await api('/api/texts', { property: state.property, factor, previous });
    const { texts } = await res.json();
    state.texts = normalizeTexts(texts);
    state.aiOriginal = normalizeTexts(texts);
    state.textsStale = false;
    toast(factor < 1 ? 'Texte verdichtet.' : 'Texte erstellt.');
  } catch (e) {
    toast(e.message, true);
  } finally {
    state.busy.texts = false;
    persist();
    renderPreviewPane();
    renderPanel();
  }
}

async function download(kind) {
  state.busy[kind] = true;
  renderPanel();
  try {
    const res = await api(`/api/export/${kind}`, { property: state.property, texts: currentTexts() });
    const blob = await res.blob();
    const cd = res.headers.get('Content-Disposition') || '';
    const name = decodeURIComponent((/filename\*=UTF-8''([^;]+)/.exec(cd) || [])[1] || `${kind}.docx`);
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    if (kind === 'factsheet') {
      const pages = res.headers.get('X-Pages');
      const by = decodeURIComponent(res.headers.get('X-Verified-By') || '');
      state.results.factsheet = `${name} – ${pages} Seiten (geprüft: ${by})`;
    } else state.results.nda = name;
  } catch (e) {
    toast(e.message + (e.issues && e.issues.length ? ` (${e.issues.filter((i) => i.level === 'error').map((i) => i.message).slice(0, 2).join(' ')})` : ''), true);
  } finally {
    state.busy[kind] = false;
    renderPanel();
    renderSteps();
  }
}

async function processImage(file) {
  if (!/^image\/(jpeg|png)$/.test(file.type)) throw new Error('Nur JPEG- oder PNG-Bilder.');
  if (file.size > 30 * 1024 * 1024) throw new Error('Bild ist grösser als 30 MB.');
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const max = 2000;
  const f = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * f);
  c.height = Math.round(bmp.height * f);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85);
}

function loadProject(data) {
  state.property = normalizeProperty(data.property || data);
  state.texts = data.texts ? normalizeTexts(data.texts) : null;
  state.aiOriginal = data.aiOriginal ? normalizeTexts(data.aiOriginal) : (state.texts ? normalizeTexts(data.texts) : null);
  state.textsStale = false;
  state.results = {};
  state.showAllErrors = !!(data.property && data.property.object && data.property.object.street);
  persist();
  renderPreviewPane();
  go('basis');
}

function bind() {
  const panel = $('#panel');

  panel.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.path) {
      setPath(state.property, el.dataset.path, el.type === 'checkbox' ? el.checked : el.value);
      propertyChanged();
      const hint = el.parentElement.querySelector('.help');
      if (hint && el.type === 'text') {
        const def = findFieldDef(el.dataset.path);
        if (def) { const h = hintFor(def, el.value); if (h) hint.textContent = h; }
      }
    } else if (el.dataset.tpath) {
      setPath(state.texts, el.dataset.tpath, el.value);
      state.texts.edited[el.dataset.tkey] = true;
      const c = el.parentElement.querySelector('.counter');
      if (c) {
        const max = el.dataset.tpath === 'title' ? BUDGET.title : el.dataset.tpath.endsWith('.title') ? BUDGET.argumentTitle : el.dataset.tpath.endsWith('.text') ? BUDGET.argumentText : BUDGET[el.dataset.tpath.split('.')[1]];
        c.textContent = `${el.value.length} / ${max} Zeichen`;
        c.classList.toggle('over', el.value.length > max);
      }
      textsChanged();
    }
  });

  panel.addEventListener('change', async (e) => {
    const el = e.target;
    if (el.dataset.path && (el.tagName === 'SELECT' || el.type === 'checkbox')) {
      setPath(state.property, el.dataset.path, el.type === 'checkbox' ? el.checked : el.value);
      propertyChanged();
    }
    if (el.dataset.action === 'toggle-nda') { state.ndaOpen = el.checked; renderPanel(); }
    if (el.dataset.slot && el.files && el.files[0]) {
      try {
        state.property.images[el.dataset.slot] = await processImage(el.files[0]);
        propertyChanged();
        renderPanel();
      } catch (err) { toast(err.message, true); }
    }
  });

  document.addEventListener('click', (e) => {
    const stepBtn = e.target.closest('button[data-step]');
    if (stepBtn) { go(stepBtn.dataset.step); return; }
    const a = e.target.closest('[data-action]');
    if (a) return action(a.dataset.action, a);
    const editable = e.target.closest('.fs-edit');
    if (editable) {
      if (!state.texts) { go('texts'); toast('Zuerst KI-Inhalte erstellen – danach sind alle Texte bearbeitbar.'); return; }
      go('texts');
      const target = document.querySelector(`[data-tkey="${CSS.escape(editable.dataset.key)}"]`);
      if (target) { target.focus(); target.scrollIntoView({ block: 'center' }); }
    }
  });

  $('#open-file').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { loadProject(JSON.parse(await f.text())); toast('Projekt geladen.'); } catch { toast('Datei ist kein gültiges Projekt.', true); }
    e.target.value = '';
  });
  $('#mark-ai').addEventListener('change', (e) => $('#pages').classList.toggle('mark-ai', e.target.checked));
  window.addEventListener('resize', fitZoom);
}

function findFieldDef(path) {
  const parts = path.split('.');
  const s = SECTIONS.find((x) => x.id === parts[0] || `${x.id}Extra` === parts[0]);
  if (!s) return null;
  const key = parts[parts.length - 1];
  return [...s.fields, ...(s.extra || []), ...((s.listExtra && s.listExtra.fields) || [])].find((f) => f.key === key) || null;
}

async function action(name, el) {
  switch (name) {
    case 'new':
      if (!confirm('Neues Objekt beginnen? Nicht gespeicherte Angaben gehen verloren.')) return;
      loadProject({ property: createEmptyProperty() });
      return;
    case 'example':
      try { const res = await api('/api/example'); loadProject(await res.json()); toast('Beispiel Neumattstrasse 15 geladen.'); } catch (e) { toast(e.message, true); }
      return;
    case 'save': {
      const data = { property: state.property, texts: state.texts, aiOriginal: state.aiOriginal };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const name = `Projekt_${(state.property.object.street || 'Objekt').replace(/[^A-Za-z0-9äöüÄÖÜ]+/g, '-')}.json`;
      Object.assign(document.createElement('a'), { href: url, download: name }).click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      return;
    }
    case 'add-item': {
      const path = el.dataset.list;
      const [sid, lk] = path.split('.');
      getPath(state.property, path).push(createEmptyItem(sid, lk));
      propertyChanged(); renderPanel(); return;
    }
    case 'remove-item':
      getPath(state.property, el.dataset.list).splice(Number(el.dataset.index), 1);
      propertyChanged(); renderPanel(); return;
    case 'remove-image':
      delete state.property.images[el.dataset.slot];
      propertyChanged(); renderPanel(); return;
    case 'generate':
      return generate();
    case 'condense':
      return generate({ factor: 0.8, previous: state.texts });
    case 'reset-text': {
      const key = el.dataset.key;
      if (key.startsWith('arguments.')) {
        const i = Number(key.split('.')[1]);
        if (state.aiOriginal.arguments[i]) state.texts.arguments[i] = { ...state.aiOriginal.arguments[i] };
      } else setPath(state.texts, key, getPath(state.aiOriginal, key));
      delete state.texts.edited[key];
      textsChanged(); renderPanel(); return;
    }
    case 'add-arg':
      state.texts.arguments.push({ title: '', text: '', basis: [] });
      state.texts.edited[`arguments.${state.texts.arguments.length - 1}`] = true;
      textsChanged(); renderPanel(); return;
    case 'remove-arg':
      state.texts.arguments.splice(Number(el.dataset.index), 1);
      // Kennzeichnung «bearbeitet» der Argumente neu nummerieren
      state.texts.edited = Object.fromEntries(Object.keys(state.texts.edited).filter((k) => !k.startsWith('arguments.')).map((k) => [k, true]));
      state.texts.arguments.forEach((_, i) => { state.texts.edited[`arguments.${i}`] = true; });
      textsChanged(); renderPanel(); return;
    case 'export-factsheet':
      return download('factsheet');
    case 'export-nda':
      return download('nda');
    default:
  }
}

async function loadStatus() {
  try {
    const res = await api('/api/status');
    state.status = await res.json();
    const s = state.status;
    $('#status').innerHTML = `<span class="chip">Texte: ${esc(s.providerLabel)}${s.model ? ' · ' + esc(s.model) : ''}</span>`
      + `<span class="chip">Seitenprüfung: ${s.renderer ? 'LibreOffice + Berechnung' : 'Berechnung'}</span>`;
  } catch {
    $('#status').innerHTML = '<span class="chip">Server nicht erreichbar</span>';
  }
  if (state.step === 'texts') renderPanel();
}

restore();
state.showAllErrors = !isEmpty(state.property.object.street);
bind();
renderPreviewPane();
renderPanel();
loadStatus();
