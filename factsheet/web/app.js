// Verkaufsunterlagen – Oberfläche.
// Links die Objekte, rechts das gewählte Objekt mit vier Bereichen:
//   Erfassung → Bilder → Texte → Dokumente (Vorschau und Download aller Unterlagen)
import { SECTIONS, IMAGE_SLOTS, GALLERY_KINDS, GALLERY_MAX, createEmptyProperty, createEmptyItem, normalizeProperty, isEmpty } from '../src/model/schema.js';
import { addressLine, designation, filledUnits } from '../src/model/facts.js';
import { offlineTexts, completeTexts, normalizeTexts, textFields } from '../src/content/texts.js';
import { BUDGET, PAGE, EXPOSE } from '../src/layout/design.js';
import * as store from './store.js';
import * as svc from './services.js';
import { esc, sectionHtml, sectionErrorsHtml, ndaSectionHtml, documentSectionHtml, findFieldDef, hintFor, sectionFill } from './forms.js';
import { PREVIEWS } from './previews.js';
import { prepareImage, guessKind, captionFromName } from './images.js';

const VIEWS = [
  { id: 'erfassung', label: 'Erfassung' },
  { id: 'bilder', label: 'Bilder' },
  { id: 'texte', label: 'Texte' },
  { id: 'dokumente', label: 'Dokumente' },
];
const DOCS = Object.entries(svc.core.DOCUMENT_TYPES).map(([id, d]) => ({ id, ...d }));
const ORDER = ['factsheet', 'expose', 'dossier', 'teaser', 'nda', 'inserat'];
DOCS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

const state = {
  objects: [],
  cur: null,          // { id, property, texts, aiOriginal, textsStale, updatedAt }
  view: 'erfassung',
  doc: 'factsheet',
  search: '',
  busy: {},
  results: {},
  report: { issues: [], guard: {} },
};

const $ = (s, r = document) => r.querySelector(s);
const getPath = (o, p) => p.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
function setPath(o, p, v) { const k = p.split('.'); const last = k.pop(); k.reduce((x, y) => x[y], o)[last] = v; }

function toast(msg, error = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `toast${error ? ' error' : ''}`;
  t.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { t.hidden = true; }, error ? 8000 : 3500);
}

// ---------- Daten ----------
const P = () => state.cur.property;
const texts = () => (state.cur.texts ? completeTexts(state.cur.texts, P()) : offlineTexts(P()));

function refreshReport() {
  state.report = svc.core.inspect(P(), state.cur.texts);
}

let saveTimer;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const rec = await store.saveObject(state.cur);
    state.cur.updatedAt = rec.updatedAt;
    state.objects = await store.listObjects();
    renderSide();
  }, 500);
}

function propertyChanged() {
  if (state.cur.texts) state.cur.textsStale = true;
  state.results = {};
  refreshReport();
  persist();
  updateLive();
}

function textsChanged() {
  state.results = {};
  refreshReport();
  persist();
  updateLive();
}

// ---------- Seitenleiste ----------
function objLabel(o) {
  const p = o.property || {};
  return { title: addressLine(normalizeProperty(p)) || 'Neues Objekt', sub: [p.object && p.object.type, o.updatedAt ? new Date(o.updatedAt).toLocaleDateString('de-CH') : ''].filter(Boolean).join(' · ') };
}

function renderSide() {
  const q = state.search.toLowerCase();
  const list = state.objects.filter((o) => !q || JSON.stringify([o.property.object]).toLowerCase().includes(q));
  $('#objlist').innerHTML = list.length
    ? list.map((o) => { const l = objLabel(o); return `<button type="button" class="obj${state.cur && state.cur.id === o.id ? ' active' : ''}" data-open="${esc(o.id)}"><b>${esc(l.title)}</b><span>${esc(l.sub)}</span></button>`; }).join('')
    : `<div class="obj-empty">${q ? 'Keine Treffer.' : 'Noch keine Objekte. «Neues Objekt» oder «Beispiel laden».'}</div>`;
  $('#mode').innerHTML = `${svc.env.mode === 'server' ? 'Arbeitsplatz-/Serverbetrieb' : 'Browserbetrieb'} · Texte: ${esc(svc.textsLabel())}`
    + (svc.env.mode === 'server' && svc.env.status.hotfolder ? '<br>Eingangsordner aktiv' : '')
    + '<br>Objekte werden in diesem Browser gespeichert.';
}

// ---------- Hauptbereich ----------
function errorCount(levelSections) {
  return state.report.issues.filter((i) => i.level === 'error' && levelSections(i)).length;
}

function completeness() {
  const secs = SECTIONS.filter((s) => !s.list);
  let filled = 0, total = 0;
  for (const s of secs) { const f = sectionFill(P(), s); filled += f.filled; total += f.total; }
  const imgs = Object.keys(P().images).filter((k) => k !== 'gallery').length + (P().images.gallery || []).length;
  return { pct: Math.round((filled / total) * 100), imgs };
}

function renderMain() {
  const main = $('#main');
  if (!state.cur) { main.innerHTML = welcomeHtml(); return; }
  const p = P();
  const c = completeness();
  const formErrors = errorCount((i) => SECTIONS.some((s) => s.title === i.section));
  main.innerHTML = `
    <header class="ohead">
      <div class="ohead-row">
        <div><h1>${esc(addressLine(p) || 'Neues Objekt')}</h1><div class="sub">${esc([designation(p), p.object.type ? '' : 'Objektart noch nicht gewählt'].filter(Boolean).join(' · '))}</div></div>
        <div class="ohead-actions">
          <button type="button" class="btn small" data-action="save-json" title="Objekt mit Bildern und Texten als Datei speichern">Als Datei</button>
          <button type="button" class="btn small" data-action="save-excel" title="Angaben als Excel-Erfassung speichern">Als Excel</button>
          <button type="button" class="btn small" data-action="delete">Löschen</button>
        </div>
      </div>
      <div class="progress"><span class="bar"><i style="width:${c.pct}%"></i></span>${c.pct}% der Angaben · ${c.imgs} Bild${c.imgs === 1 ? '' : 'er'} · ${state.cur.texts ? `Texte: ${esc(providerName(state.cur.texts.provider))}` : 'Texte noch nicht erstellt'}</div>
      <nav class="tabs">${VIEWS.map((v) => `<button type="button" class="tab${state.view === v.id ? ' active' : ''}" data-view="${v.id}">${v.label}${v.id === 'erfassung' && formErrors ? `<span class="n">${formErrors}</span>` : ''}</button>`).join('')}</nav>
    </header>
    <div class="content" id="content">${{ erfassung: viewForm, bilder: viewImages, texte: viewTexts, dokumente: viewDocs }[state.view]()}</div>`;
  if (state.view === 'dokumente') renderViewer();
}

function providerName(p) {
  return { offline: 'regelbasiert', anthropic: 'KI (Claude)', 'browser-ki': 'KI', beispiel: 'Beispielfassung' }[p] || p || '';
}

function welcomeHtml() {
  return `<div class="welcome">
    <h1>Verkaufsunterlagen aus einer Erfassung</h1>
    <p>Objekt einmal erfassen – daraus entstehen Factsheet, Verkaufsdokumentation, anonymer Teaser, Geheimhaltungsverpflichtung und Inserattexte im Schaeppi-Design. Es werden nur erfasste Angaben verwendet; fehlende Angaben erscheinen nicht.</p>
    <div class="steps3">
      <div><b>1 Erfassen</b><span>Eckdaten, Einheiten, Lage, optional Finanzen und Grundstück – oder Excel-Erfassung importieren.</span></div>
      <div><b>2 Bilder &amp; Texte</b><span>Bilder hochladen, Texte mit KI erstellen und bei Bedarf anpassen. Jeder Text wird gegen die Fakten geprüft.</span></div>
      <div><b>3 Dokumente</b><span>Vorschau aller Unterlagen, Download als Word und PDF – das Design ist immer gleich.</span></div>
    </div>
    <button type="button" class="btn navy" data-action="new">+ Neues Objekt</button>
    <button type="button" class="btn" data-action="example">Beispiel Neumattstrasse 15 laden</button>
  </div>`;
}

// ---------- Erfassung ----------
function sectionErrors(s) {
  const p = P();
  if (!state.showAll && sectionFill(p, s).filled === 0) return [];
  return state.report.issues.filter((i) => i.section === s.title && i.level !== 'info');
}

function issuesPanel() {
  const iss = state.report.issues.filter((i) => i.level !== 'info');
  const errs = iss.filter((i) => i.level === 'error'), warns = iss.filter((i) => i.level === 'warning');
  return `<aside class="panel" id="issues-panel"><h3>Prüfung</h3>
    ${iss.length ? iss.slice(0, 30).map((i) => `<div class="issue ${i.level}"><i></i><span><b>${esc(i.section)}${i.field ? ' · ' + esc(i.field) : ''}:</b> ${esc(i.message)}</span></div>`).join('')
      : '<p class="ok-msg">Keine Beanstandungen.</p>'}
    <p class="muted" style="font-size:12px;margin:12px 0 0">${errs.length} Fehler · ${warns.length} Hinweise. Fehler verhindern den Download der betroffenen Dokumente.</p></aside>`;
}

function viewForm() {
  const p = P();
  const basis = SECTIONS.filter((s) => s.level === 'basis');
  const detail = SECTIONS.filter((s) => s.level === 'detail');
  return `<div class="cols"><div>
      <p class="note">Pflichtangaben sind mit <b class="req">*</b> markiert, alles andere ist optional. Zahlen dürfen mit Apostroph erfasst werden (42'600). Änderungen werden automatisch gespeichert.</p>
      ${basis.map((s) => sectionHtml(p, s, { open: true, errors: sectionErrors(s) })).join('')}
      ${detail.map((s) => sectionHtml(p, s, { open: sectionFill(p, s).filled > 0, errors: sectionErrors(s) })).join('')}
      ${ndaSectionHtml(p)}${documentSectionHtml(p)}
    </div>${issuesPanel()}</div>`;
}

// ---------- Bilder ----------
function viewImages() {
  const im = P().images;
  const units = filledUnits(P());
  const slotHint = { cover: 'Deckblatt und Factsheet', object: 'Facts & Figures, Factsheet', location: 'Lageseite, Factsheet', floorplan: 'Grundriss-Seite', portrait: 'Kontaktseite' };
  const slots = IMAGE_SLOTS.map((s) => `<div class="slot"><div class="thumb${s.key === 'floorplan' || s.key === 'portrait' ? ' contain' : ''}">${im[s.key] ? `<img src="${im[s.key]}" alt="${esc(s.label)}">` : 'Kein Bild'}</div>
      <div class="slot-bar"><b>${esc(s.label)}</b><small>${esc(slotHint[s.key] || '')}</small>
      <div class="row"><label class="btn small">${im[s.key] ? 'Ersetzen' : 'Hochladen'}<input type="file" accept="image/jpeg,image/png" data-slot="${s.key}" hidden></label>
      ${im[s.key] ? `<button type="button" class="link" data-action="remove-slot" data-slot="${s.key}">Entfernen</button>` : ''}</div></div></div>`).join('');
  const gallery = (im.gallery || []).map((g, i) => `<div class="gimg"><div class="thumb${g.kind === 'Grundriss' ? ' contain' : ''}"><img src="${g.src}" alt="${esc(g.caption)}"></div>
      <div class="slot-bar">
        <div class="row"><select data-gal="${i}" data-field="kind" aria-label="Bildart">${GALLERY_KINDS.map((k) => `<option${k === g.kind ? ' selected' : ''}>${k}</option>`).join('')}</select>
        ${g.kind === 'Innen' && units.length ? `<select data-gal="${i}" data-field="unit" aria-label="Einheit"><option value="">beliebige Einheit</option>${units.map((u, k) => `<option value="${k}"${g.unit === k ? ' selected' : ''}>Einheit ${k + 1}</option>`).join('')}</select>` : ''}</div>
        <input type="text" data-gal="${i}" data-field="caption" value="${esc(g.caption)}" placeholder="Legende, z. B. Obergeschoss" aria-label="Bildlegende">
        <div class="row"><button type="button" class="link" data-action="gal-move" data-index="${i}" data-dir="-1">← früher</button><button type="button" class="link" data-action="gal-move" data-index="${i}" data-dir="1">später →</button><button type="button" class="link" data-action="gal-remove" data-index="${i}" style="margin-left:auto">Entfernen</button></div>
      </div></div>`).join('');
  return `<p class="note">Bilder werden beim Hochladen verkleinert und automatisch zugeschnitten – nie verzerrt. Grundrisse werden vollständig gezeigt. Ohne Bild entfällt der Bildrahmen.</p>
    <h2 style="font-size:18px;margin-bottom:12px">Feste Bildpositionen</h2><div class="slots">${slots}</div>
    <h2 style="font-size:18px;margin:26px 0 4px">Weitere Bilder für die Verkaufsdokumentation</h2>
    <p class="muted" style="margin:0">Innenaufnahmen erscheinen auf den Seiten der Einheiten, Grundrisse je auf einer eigenen Seite, übrige Bilder in der Galerie. Bis ${GALLERY_MAX} Bilder.</p>
    <label class="drop" id="drop">Bilder hierher ziehen oder <u>auswählen</u> (mehrere möglich)<input type="file" accept="image/jpeg,image/png" multiple id="gallery-input" hidden></label>
    <div class="slots">${gallery}</div>`;
}

async function addGallery(files) {
  const g = P().images.gallery || (P().images.gallery = []);
  for (const f of files) {
    if (g.length >= GALLERY_MAX) { toast(`Höchstens ${GALLERY_MAX} Bilder.`, true); break; }
    try {
      const kind = guessKind(f.name);
      g.push({ src: await prepareImage(f, { keepPng: kind === 'Grundriss' }), caption: captionFromName(f.name), kind, unit: null });
    } catch (e) { toast(e.message, true); }
  }
  propertyChanged();
  renderMain();
}

// ---------- Texte ----------
function countHtml(v, max) { const n = (v || '').length; return `<span class="count${n > max ? ' over' : ''}">${n} / ${max}</span>`; }

function findingsHtml(key) {
  const f = state.report.guard[key];
  if (!f || !f.length) return '';
  return `<ul class="find${f.some((x) => x.kind === 'anonym') ? ' err' : ''}">${f.map((x) => `<li>${esc(x.message)}</li>`).join('')}</ul>`;
}

function srcBadge(key) {
  if (!state.cur.texts) return '<span class="src">regelbasiert</span>';
  return `<span class="src">${state.cur.texts.edited[key] ? 'bearbeitet' : esc(providerName(state.cur.texts.provider))}</span>`;
}

function resetBtn(key) {
  return state.cur.aiOriginal && state.cur.texts && state.cur.texts.edited[key] ? `<button type="button" class="link" data-action="reset-text" data-key="${esc(key)}">Ursprüngliche Fassung</button>` : '';
}

function viewTexts() {
  const t = texts();
  const busy = state.busy.texts;
  const ai = svc.aiAvailable();
  let h = `<div class="hero"><div><h3>${state.cur.texts ? 'Texte für alle Dokumente' : 'Texte erstellen'}</h3>
      <p>${ai ? 'Die KI formuliert aus den erfassten Fakten – sie ergänzt keine Angaben. Jeder Text wird anschliessend gegen die Fakten geprüft.' : 'Ohne KI-Zugang entstehen sachliche, regelbasierte Texte direkt aus den Fakten.'}</p></div>
      <button type="button" class="btn primary" data-action="generate" ${busy ? 'disabled' : ''}>${busy ? '<span class="spinner"></span> Wird erstellt …' : state.cur.texts ? 'Neu erstellen' : (ai ? 'KI-Texte erstellen' : 'Texte erstellen')}</button></div>`;
  if (state.cur.textsStale && state.cur.texts) h += '<p class="note warn">Die Angaben wurden nach der Texterstellung geändert. Texte prüfen oder neu erstellen.</p>';
  if (!state.cur.texts) h += '<p class="note">Bis Texte erstellt sind, verwenden Vorschau und Dokumente regelbasierte Texte aus den Fakten. Bearbeitungen sind ab hier bereits möglich.</p>';

  const fields = textFields(t);
  const group = (doc, title, extra = '') => {
    const fs = fields.filter((f) => f.doc === doc);
    return `<section class="tgroup"><h3>${title}</h3>${fs.map((f) => {
      const key = f.group || f.path;
      const v = getPath(t, f.path) || '';
      const control = f.multiline
        ? `<textarea rows="${Math.min(10, Math.max(3, Math.ceil(v.length / 90)))}" data-tpath="${f.path}" data-tkey="${esc(key)}">${esc(v)}</textarea>`
        : `<input type="text" data-tpath="${f.path}" data-tkey="${esc(key)}" value="${esc(v)}">`;
      return `<div class="tfield"><div class="row"><label>${esc(f.label)}${f.group && !f.path.endsWith('title') ? '' : srcBadge(key)}</label>${countHtml(v, f.max)}</div>${control}${f.path.endsWith('.title') && f.group ? '' : findingsHtml(key) + resetBtn(key)}</div>`;
    }).join('')}${extra}</section>`;
  };
  const args = t.arguments.map((a, i) => `<div class="item"><div class="item-head"><span>Argument ${i + 1} ${srcBadge(`arguments.${i}`)}</span><button type="button" class="link" data-action="remove-arg" data-index="${i}">Entfernen</button></div>
      <div class="tfield"><input type="text" data-tpath="arguments.${i}.title" data-tkey="arguments.${i}" value="${esc(a.title)}" placeholder="Titel">${countHtml(a.title, BUDGET.argumentTitle)}</div>
      <div class="tfield"><textarea rows="2" data-tpath="arguments.${i}.text" data-tkey="arguments.${i}">${esc(a.text)}</textarea>${countHtml(a.text, BUDGET.argumentText)}</div>
      ${a.basis && a.basis.length ? `<small class="muted">Grundlage: ${esc(a.basis.join(', '))}</small>` : ''}${findingsHtml(`arguments.${i}`)}${resetBtn(`arguments.${i}`)}</div>`).join('');
  h += group('Alle', 'Objektbezeichnung');
  h += group('Factsheet', 'Factsheet · Transaktionsübersicht', `<h3 style="margin:18px 0 10px">Investorenargumente <small class="muted">(Factsheet und Teaser)</small></h3><div class="items">${args}</div>${t.arguments.length < BUDGET.argumentsMax ? '<button type="button" class="btn ghost-dark small" data-action="add-arg">+ Argument</button>' : ''}`);
  h += group('Verkaufsdokumentation', 'Verkaufsdokumentation');
  h += group('Teaser', 'Anonymer Teaser');
  h += group('Inserat', 'Inserat');
  return h;
}

// Texte bearbeiten: beim ersten Eingriff die regelbasierte Fassung übernehmen
function ensureTexts() {
  if (!state.cur.texts) state.cur.texts = offlineTexts(P());
  else state.cur.texts = completeTexts(state.cur.texts, P());
}

// ---------- Dokumente ----------
function docState(id) {
  const errs = state.report.issues.filter((i) => i.level === 'error' && !(id !== 'teaser' && i.field && String(i.field).startsWith('teaser.')));
  if (id === 'nda') return errs.filter((i) => i.section === 'Objekt').length ? 'Objektangaben fehlen' : '';
  return errs.length ? `${errs.length} Fehler` : '';
}

function viewDocs() {
  const btn = (kind, label, cls = '') => `<button type="button" class="btn small ${cls}" data-export="${kind}" ${state.busy[kind] ? 'disabled' : ''}>${state.busy[kind] ? '<span class="spinner"></span>' : ''}${label}</button>`;
  const actions = {
    factsheet: btn('factsheet', 'Word', 'navy'),
    expose: btn('expose-pdf', svc.env.mode === 'server' && svc.env.status.pdf ? 'PDF' : 'PDF (Drucken)', 'navy') + btn('expose-docx', 'Word'),
    teaser: btn('teaser', 'Word', 'navy'),
    nda: btn('nda', 'Word', 'navy'),
    inserat: btn('inserat', 'Word', 'navy') + btn('inserat-txt', 'Text'),
    dossier: btn('dossier', 'Word', 'navy'),
  };
  const cards = DOCS.map((d) => {
    const st = docState(d.id);
    const res = state.results[d.id];
    return `<div class="dcard${state.doc === d.id ? ' active' : ''}" data-doc="${d.id}"><h3>${esc(d.label)}</h3><p>${esc(d.description)}</p>
      <div class="row">${actions[d.id]}<span class="state${st ? ' err' : ''}">${esc(st || 'bereit')}</span></div>${res ? `<div class="done">✓ ${esc(res)}</div>` : ''}</div>`;
  }).join('');
  return `<div class="docs"><div>${cards}
      <p class="muted" style="font-size:12px;line-height:1.5">${svc.env.mode === 'server' ? 'Seitenprüfung: ' + (svc.env.status.renderer ? 'LibreOffice und Berechnung' : 'Berechnung') + '.' : 'Browserbetrieb: Seitenprüfung rechnerisch; PDF über «Drucken → Als PDF speichern» (A4 quer, Hintergrundgrafiken an).'}</p></div>
    <div class="viewer"><div class="viewer-bar" id="viewer-bar"></div><div class="pages" id="pages"></div></div></div>`;
}

let viewerTimer;
function renderViewer() {
  const box = $('#pages');
  if (!box) return;
  const p = P();
  let pv;
  try { pv = PREVIEWS[state.doc](p, texts()); } catch (e) { box.innerHTML = `<p class="errlist">${esc(e.message)}</p>`; return; }
  const d = DOCS.find((x) => x.id === state.doc);
  $('#viewer-bar').innerHTML = `<b>${esc(d.label)}</b><span>${pv.pages ? `${pv.pages} Seite${pv.pages === 1 ? '' : 'n'} · ` : ''}${esc(pv.info || '')}</span>${(pv.notes || []).map((n) => `<span class="find" style="margin:0">${esc(n)}</span>`).join('')}`;
  if (pv.format === 'doc') { box.innerHTML = pv.html; return; }
  const tmp = document.createElement('div');
  tmp.innerHTML = pv.html;
  const pages = pv.format === 'a4q' ? [...tmp.querySelectorAll('.xp-page')] : [...tmp.children];
  box.innerHTML = '';
  const holder = pv.format === 'a4q' ? Object.assign(document.createElement('div'), { className: 'xp' }) : box;
  for (const pg of pages) {
    const w = Object.assign(document.createElement('div'), { className: 'pagewrap' });
    w.appendChild(pg);
    holder.appendChild(w);
  }
  if (holder !== box) box.appendChild(holder);
  fitZoom(pv.format === 'a4q' ? EXPOSE.page.width : PAGE.width);
}

function fitZoom(widthPt) {
  const box = $('#pages');
  if (!box) return;
  const avail = box.clientWidth - 4;
  const zoom = Math.min(1, avail / (widthPt * 96 / 72));
  box.querySelectorAll('.pagewrap').forEach((w) => { w.style.zoom = zoom; });
}

// Teilaktualisierung ohne Neuaufbau der Formulare (Fokus bleibt erhalten)
function updateLive() {
  if (state.view === 'erfassung') {
    document.querySelectorAll('details.sec[data-section]').forEach((el) => {
      const s = SECTIONS.find((x) => x.id === el.dataset.section);
      if (!s) return;
      el.querySelector('.sec-errors').innerHTML = sectionErrorsHtml(sectionErrors(s));
      const f = sectionFill(P(), s);
      el.querySelector('.sec-fill').textContent = f.total ? `${f.filled}/${f.total}` : `${f.filled}`;
    });
    const panel = $('#issues-panel');
    if (panel) panel.outerHTML = issuesPanel();
  }
  if (state.view === 'dokumente') { clearTimeout(viewerTimer); viewerTimer = setTimeout(renderViewer, 150); }
  const h1 = $('.ohead h1');
  if (h1) h1.textContent = addressLine(P()) || 'Neues Objekt';
}

// ---------- Objekte ----------
async function openObject(id) {
  const o = await store.getObject(id);
  if (!o) return;
  o.property = normalizeProperty(o.property);
  o.texts = o.texts ? normalizeTexts(o.texts) : null;
  o.aiOriginal = o.aiOriginal ? normalizeTexts(o.aiOriginal) : null;
  state.cur = o;
  state.results = {};
  state.showAll = !isEmpty(o.property.object.street);
  try { localStorage.setItem('schaeppi-last', id); } catch { /* ohne Speicher */ }
  refreshReport();
  renderSide();
  renderMain();
}

async function createObject(data = {}) {
  const rec = await store.saveObject({
    id: store.newId(),
    property: normalizeProperty(data.property || createEmptyProperty()),
    texts: data.texts ? normalizeTexts(data.texts) : null,
    aiOriginal: data.aiOriginal ? normalizeTexts(data.aiOriginal) : (data.texts ? normalizeTexts(data.texts) : null),
    textsStale: false,
  });
  state.objects = await store.listObjects();
  state.view = 'erfassung';
  await openObject(rec.id);
}

async function loadExample() {
  let data = null;
  if (svc.env.mode === 'server') data = await (await fetch('api/example')).json();
  else {
    const r = await fetch('beispiel.json').catch(() => null);
    if (r && r.ok) data = await r.json();
  }
  if (!data) { toast('Beispiel nicht verfügbar.', true); return; }
  await createObject(data);
  toast('Beispiel Neumattstrasse 15 geladen.');
}

async function importFile(file) {
  if (/\.xlsx$/i.test(file.name)) {
    const { property, options } = await svc.importExcel(file);
    await createObject({ property });
    if (options.nda) toast('Excel eingelesen – Geheimhaltungsverpflichtung gewünscht.');
    else toast('Excel-Erfassung eingelesen.');
    return;
  }
  const data = JSON.parse(await file.text());
  await createObject(data.property ? data : { property: data });
  toast('Objekt importiert.');
}

// ---------- Aktionen ----------
async function generate(opts = {}) {
  state.busy.texts = true;
  renderMain();
  try {
    const t = await svc.generateTexts(P(), opts);
    state.cur.texts = normalizeTexts(t);
    state.cur.aiOriginal = normalizeTexts(t);
    state.cur.textsStale = false;
    toast('Texte erstellt und geprüft.');
  } catch (e) {
    toast(e.message, true);
  } finally {
    state.busy.texts = false;
    textsChanged();
    renderMain();
  }
}

async function exportDoc(kind) {
  state.busy[kind] = true;
  renderMain();
  const docId = kind.replace(/-(pdf|docx|txt)$/, '');
  try {
    const r = await svc.exportDocument(kind, P(), texts());
    state.results[docId] = r.printed ? 'Druckdialog geöffnet – «Als PDF speichern» wählen'
      : `${r.fileName}${r.pages ? ` · ${r.pages} Seite${r.pages === 1 ? '' : 'n'}` : ''}${r.verifiedBy ? ` · geprüft: ${r.verifiedBy}` : ''}`;
  } catch (e) {
    const detail = (e.issues || []).filter((i) => i.level === 'error').slice(0, 2).map((i) => i.message).join(' ');
    toast(`${e.message}${detail ? ` ${detail}` : ''}`, true);
  } finally {
    state.busy[kind] = false;
    renderMain();
  }
}

async function action(name, el) {
  switch (name) {
    case 'new': return createObject();
    case 'example': return loadExample();
    case 'delete':
      if (!confirm('Dieses Objekt löschen? Das kann nicht rückgängig gemacht werden.')) return;
      await store.deleteObject(state.cur.id);
      state.cur = null;
      state.objects = await store.listObjects();
      renderSide(); renderMain();
      return;
    case 'save-json': {
      const name = `Objekt_${(P().object.street || 'neu').replace(/[^A-Za-z0-9äöüÄÖÜ]+/g, '-')}.json`;
      svc.downloadJson({ property: P(), texts: state.cur.texts, aiOriginal: state.cur.aiOriginal }, name);
      return;
    }
    case 'save-excel':
      return svc.downloadExcel({ ...P(), images: {} }, `Objekterfassung_${(P().object.street || 'Vorlage').replace(/[^A-Za-z0-9äöüÄÖÜ]+/g, '-')}.xlsx`);
    case 'add-item': {
      const [sid, lk] = el.dataset.list.split('.');
      getPath(P(), el.dataset.list).push(createEmptyItem(sid, lk));
      propertyChanged(); renderMain(); return;
    }
    case 'remove-item':
      getPath(P(), el.dataset.list).splice(Number(el.dataset.index), 1);
      propertyChanged(); renderMain(); return;
    case 'remove-slot':
      delete P().images[el.dataset.slot];
      propertyChanged(); renderMain(); return;
    case 'gal-remove':
      P().images.gallery.splice(Number(el.dataset.index), 1);
      propertyChanged(); renderMain(); return;
    case 'gal-move': {
      const g = P().images.gallery, i = Number(el.dataset.index), j = i + Number(el.dataset.dir);
      if (j < 0 || j >= g.length) return;
      [g[i], g[j]] = [g[j], g[i]];
      propertyChanged(); renderMain(); return;
    }
    case 'generate': return generate();
    case 'reset-text': {
      const key = el.dataset.key;
      const orig = state.cur.aiOriginal;
      if (key.startsWith('arguments.')) { const i = Number(key.split('.')[1]); if (orig.arguments[i]) state.cur.texts.arguments[i] = { ...orig.arguments[i] }; }
      else if (key.startsWith('expose.units.')) { const i = Number(key.split('.')[2]); if (orig.expose.units[i]) state.cur.texts.expose.units[i] = { ...orig.expose.units[i] }; }
      else setPath(state.cur.texts, key, getPath(orig, key));
      delete state.cur.texts.edited[key];
      textsChanged(); renderMain(); return;
    }
    case 'add-arg':
      ensureTexts();
      state.cur.texts.arguments.push({ title: '', text: '', basis: [] });
      state.cur.texts.edited[`arguments.${state.cur.texts.arguments.length - 1}`] = true;
      textsChanged(); renderMain(); return;
    case 'remove-arg':
      ensureTexts();
      state.cur.texts.arguments.splice(Number(el.dataset.index), 1);
      state.cur.texts.edited = Object.fromEntries(Object.keys(state.cur.texts.edited).filter((k) => !k.startsWith('arguments.')).map((k) => [k, true]));
      state.cur.texts.arguments.forEach((_, i) => { state.cur.texts.edited[`arguments.${i}`] = true; });
      textsChanged(); renderMain(); return;
    default:
  }
}

function bind() {
  document.addEventListener('click', (e) => {
    const t = e.target;
    const open = t.closest('[data-open]');
    if (open) { state.view = state.view || 'erfassung'; openObject(open.dataset.open); return; }
    const v = t.closest('[data-view]');
    if (v) { state.view = v.dataset.view; if (state.view === 'dokumente') state.showAll = true; renderMain(); window.scrollTo(0, 0); return; }
    const ex = t.closest('[data-export]');
    if (ex) { e.stopPropagation(); exportDoc(ex.dataset.export); return; }
    const d = t.closest('[data-doc]');
    if (d && !t.closest('button')) { state.doc = d.dataset.doc; renderMain(); return; }
    const copy = t.closest('[data-copy]');
    if (copy) { navigator.clipboard.writeText(texts().inserat[copy.dataset.copy]).then(() => toast('In die Zwischenablage kopiert.')); return; }
    const a = t.closest('[data-action]');
    if (a) { action(a.dataset.action, a); return; }
    // Klick auf einen Text in der Vorschau: zum Textfeld springen
    const k = t.closest('#pages [data-key]');
    if (k) {
      state.view = 'texte';
      renderMain();
      const target = document.querySelector(`[data-tkey="${CSS.escape(k.dataset.key)}"]`) || document.querySelector(`[data-tpath="${CSS.escape(k.dataset.key)}"]`);
      if (target) { target.focus(); target.scrollIntoView({ block: 'center' }); }
    }
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'search') { state.search = el.value; renderSide(); return; }
    if (!state.cur) return;
    if (el.dataset.path) {
      setPath(P(), el.dataset.path, el.type === 'checkbox' ? el.checked : el.value);
      const def = findFieldDef(el.dataset.path);
      const hint = el.parentElement.querySelector('[data-hint]');
      if (def && hint && el.type === 'text') { const h = hintFor(def, el.value); if (h) hint.textContent = h; }
      propertyChanged();
    } else if (el.dataset.tpath) {
      ensureTexts();
      setPath(state.cur.texts, el.dataset.tpath, el.value);
      state.cur.texts.edited[el.dataset.tkey] = true;
      const c = el.parentElement.querySelector('.count');
      if (c) {
        const f = textFields(state.cur.texts).find((x) => x.path === el.dataset.tpath);
        const max = f ? f.max : el.dataset.tpath.endsWith('.title') ? BUDGET.argumentTitle : BUDGET.argumentText;
        c.textContent = `${el.value.length} / ${max}`;
        c.classList.toggle('over', el.value.length > max);
      }
      textsChanged();
    } else if (el.dataset.gal && el.dataset.field === 'caption') {
      P().images.gallery[Number(el.dataset.gal)].caption = el.value;
      propertyChanged();
    }
  });

  document.addEventListener('change', async (e) => {
    const el = e.target;
    if (el.id === 'import' && el.files[0]) {
      try { await importFile(el.files[0]); } catch (err) { toast(err.message, true); }
      el.value = '';
      return;
    }
    if (!state.cur) return;
    if (el.dataset.path && (el.tagName === 'SELECT' || el.type === 'checkbox')) {
      setPath(P(), el.dataset.path, el.type === 'checkbox' ? el.checked : el.value);
      propertyChanged();
      if (el.dataset.path === 'object.type') renderSide();
    }
    if (el.dataset.gal && el.dataset.field !== 'caption') {
      const g = P().images.gallery[Number(el.dataset.gal)];
      if (el.dataset.field === 'kind') g.kind = el.value;
      if (el.dataset.field === 'unit') g.unit = el.value === '' ? null : Number(el.value);
      propertyChanged(); renderMain();
    }
    if (el.dataset.slot && el.files && el.files[0]) {
      try {
        P().images[el.dataset.slot] = await prepareImage(el.files[0], { keepPng: el.dataset.slot === 'floorplan' });
        propertyChanged(); renderMain();
      } catch (err) { toast(err.message, true); }
    }
    if (el.id === 'gallery-input' && el.files.length) addGallery([...el.files]);
  });

  document.addEventListener('dragover', (e) => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.add('over'); } });
  document.addEventListener('dragleave', (e) => { const d = e.target.closest && e.target.closest('#drop'); if (d) d.classList.remove('over'); });
  document.addEventListener('drop', (e) => {
    const d = e.target.closest && e.target.closest('#drop');
    if (!d) return;
    e.preventDefault();
    d.classList.remove('over');
    addGallery([...e.dataTransfer.files].filter((f) => /^image\/(jpeg|png)$/.test(f.type)));
  });
  window.addEventListener('resize', () => { if (state.view === 'dokumente') renderViewer(); });
}

async function boot() {
  bind();
  try { await svc.init(); } catch (e) { toast(`Start unvollständig: ${e.message}`, true); }
  state.objects = await store.listObjects();
  renderSide();
  let last = null;
  try { last = localStorage.getItem('schaeppi-last'); } catch { /* ohne Speicher */ }
  if (last && state.objects.some((o) => o.id === last)) await openObject(last);
  else renderMain();
}

boot();
