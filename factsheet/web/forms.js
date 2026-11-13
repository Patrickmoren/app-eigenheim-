// Eingabefelder aus dem Datenmodell (schema.js). Jedes Feld trägt data-path; die App bindet die Eingaben.
import { SECTIONS, NDA_FIELDS, isEmpty, toNumber } from '../src/model/schema.js';
import { fmtChf, fmtArea } from '../src/model/format.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const NUMERIC = ['number', 'integer', 'year', 'money', 'percent', 'area'];
const W2 = new Set(['zip', 'count', 'rooms', 'kind', 'year', 'number', 'share', 'area', 'durationYears']);
const FULL_KEYS = new Set(['street', 'features', 'measure', 'note', 'designation', 'location', 'macroLocation', 'condition', 'highlights', 'potential', 'tagline', 'situation', 'oereb', 'teaserLocation']);

function widthClass(f) {
  if (f.type === 'textarea' || f.type === 'bool' || FULL_KEYS.has(f.key)) return 'w6';
  if (f.key === 'city') return 'w4';
  if (W2.has(f.key)) return 'w2';
  return 'w3';
}

export function hintFor(f, v) {
  if (isEmpty(v)) return '';
  if (f.type === 'money' && toNumber(v) !== null) return `= ${fmtChf(v)}`;
  if (f.type === 'area' && toNumber(v) !== null && /['’]/.test(String(v))) return `= ${fmtArea(v)}`;
  return '';
}

export function fieldHtml(f, path, value) {
  const id = `f-${path.replace(/\./g, '-')}`;
  if (f.type === 'bool') {
    return `<div class="fld w6"><label class="check"><input type="checkbox" id="${id}" data-path="${path}" ${value ? 'checked' : ''}><span>${esc(f.label)}</span></label>${f.help ? `<small>${esc(f.help)}</small>` : ''}</div>`;
  }
  let control;
  if (f.type === 'select') {
    const blank = f.options.includes('') ? '' : `<option value=""${isEmpty(value) ? ' selected' : ''}>– bitte wählen –</option>`;
    control = `<select id="${id}" data-path="${path}">${blank}${f.options.map((o) => `<option value="${esc(o)}"${o === value ? ' selected' : ''}>${esc(o || '–')}</option>`).join('')}</select>`;
  } else if (f.type === 'textarea') {
    control = `<textarea id="${id}" data-path="${path}" rows="${f.rows || 3}" placeholder="${esc(f.placeholder || '')}">${esc(value)}</textarea>`;
  } else {
    const mode = NUMERIC.includes(f.type) ? 'inputmode="decimal"' : f.type === 'email' ? 'inputmode="email"' : '';
    control = `<input id="${id}" data-path="${path}" type="text" ${mode} value="${esc(value)}" placeholder="${esc(f.placeholder || '')}">`;
  }
  const hint = hintFor(f, value) || f.help || '';
  return `<div class="fld ${widthClass(f)}"><label for="${id}">${esc(f.label)}${f.unit ? ` <em>${esc(f.unit)}</em>` : ''}${f.required ? ' <b class="req">*</b>' : ''}</label>${control}${hint ? `<small data-hint>${esc(hint)}</small>` : ''}</div>`;
}

export function findFieldDef(path) {
  const parts = path.split('.');
  if (parts[0] === 'nda') return NDA_FIELDS.find((f) => f.key === parts[1]) || null;
  const s = SECTIONS.find((x) => x.id === parts[0] || `${x.id}Extra` === parts[0]);
  if (!s) return null;
  const key = parts[parts.length - 1];
  return [...s.fields, ...(s.extra || []), ...((s.listExtra && s.listExtra.fields) || [])].find((f) => f.key === key) || null;
}

export function sectionFill(p, s) {
  if (s.list) return { filled: (p[s.id] || []).filter((it) => s.fields.some((f) => f.required && !isEmpty(it[f.key]))).length, total: null };
  const fields = s.fields.filter((f) => f.type !== 'bool' && f.key !== 'priceLabel');
  return { filled: fields.filter((f) => !isEmpty(p[s.id][f.key])).length, total: fields.length };
}

function listHtml(listPath, def, items) {
  const canAdd = !def.maxItems || items.length < def.maxItems;
  return `<div class="items">${items.map((it, i) => `<div class="item"><div class="item-head"><span>${esc(def.itemLabel)} ${i + 1}</span>
      ${items.length > (def.minItems || 0) ? `<button type="button" class="link" data-action="remove-item" data-list="${listPath}" data-index="${i}">Entfernen</button>` : ''}</div>
      <div class="grid">${def.fields.map((f) => fieldHtml(f, `${listPath}.${i}.${f.key}`, it[f.key])).join('')}</div></div>`).join('')}</div>
    ${canAdd ? `<button type="button" class="btn ghost-dark small" data-action="add-item" data-list="${listPath}">+ ${esc(def.itemLabel)}</button>` : ''}`;
}

export function sectionHtml(p, s, { open = true, errors = [] } = {}) {
  let body = '';
  if (s.list) {
    body += listHtml(s.id, s, p[s.id]);
    if (s.extra) body += `<div class="grid" style="margin-top:14px">${s.extra.map((f) => fieldHtml(f, `${s.id}Extra.${f.key}`, p[`${s.id}Extra`][f.key])).join('')}</div>`;
  } else {
    body += `<div class="grid">${s.fields.map((f) => fieldHtml(f, `${s.id}.${f.key}`, p[s.id][f.key])).join('')}</div>`;
    if (s.listExtra) body += `<h4>${esc(s.listExtra.title)}</h4>${listHtml(`${s.id}.${s.listExtra.key}`, s.listExtra, p[s.id][s.listExtra.key])}`;
  }
  const fill = sectionFill(p, s);
  return `<details class="sec" data-section="${s.id}" ${open ? 'open' : ''}>
    <summary><span class="sec-title">${esc(s.title)}</span><span class="sec-fill">${fill.total ? `${fill.filled}/${fill.total}` : `${fill.filled}`}</span>${s.level === 'basis' ? '<span class="tag">Basis</span>' : '<span class="tag soft">optional</span>'}</summary>
    <div class="sec-body"><div class="sec-errors">${sectionErrorsHtml(errors)}</div>${body}</div></details>`;
}

export const sectionErrorsHtml = (errs) => (errs.length ? `<ul class="errlist">${errs.map((e) => `<li>${esc(e.field)}: ${esc(e.message)}</li>`).join('')}</ul>` : '');

export function ndaSectionHtml(p, { open = false } = {}) {
  return `<details class="sec" data-section="nda" ${open ? 'open' : ''}>
    <summary><span class="sec-title">Geheimhaltungsverpflichtung</span><span class="tag soft">optional</span></summary>
    <div class="sec-body"><p class="muted">Interessent für die Geheimhaltungsverpflichtung. Leere Felder bleiben im Dokument als Ausfülllinie stehen.</p>
    <div class="grid">${NDA_FIELDS.map((f) => fieldHtml(f, `nda.${f.key}`, p.nda[f.key])).join('')}</div></div></details>`;
}

export function documentSectionHtml(p) {
  return `<details class="sec" data-section="meta">
    <summary><span class="sec-title">Dokumente</span><span class="tag soft">optional</span></summary>
    <div class="sec-body"><div class="grid">
      ${fieldHtml({ key: 'docLabel', label: 'Kennzeichnung im Titel', type: 'text', help: 'z. B. Akquisitionsgelegenheit, Verkaufsobjekt' }, 'meta.docLabel', p.meta.docLabel)}
      ${fieldHtml({ key: 'confidential', label: 'Als VERTRAULICH kennzeichnen', type: 'bool' }, 'meta.confidential', p.meta.confidential)}
    </div></div></details>`;
}
