// Excel-Erfassung: Vorlage erzeugen und ausgefüllte Arbeitsmappen einlesen.
//
// Die Vorlage wird aus dem Datenmodell (schema.js) erzeugt – neue Felder erscheinen automatisch.
// Jede Tabelle trägt in einer ausgeblendeten Spalte bzw. Zeile die technischen Feldschlüssel;
// Beschriftungen dürfen sich also ändern, ohne dass das Einlesen bricht.
import ExcelJS from 'exceljs';
import { SECTIONS, NDA_FIELDS, isEmpty } from '../src/model/schema.js';
import { COLORS } from '../src/layout/design.js';

const NAVY = `FF${COLORS.navy}`;
const CREAM = `FF${COLORS.cream}`;
const YES = 'Ja', NO = 'Nein';

// Arbeitsblätter für Listen: Blattname -> [Pfad im Datenmodell, Felder, Anzahl Leerzeilen]
function listSheets() {
  const s = (id) => SECTIONS.find((x) => x.id === id);
  return [
    { name: 'Einheiten', path: 'units', fields: s('units').fields, rows: 12 },
    { name: 'Investitionen', path: 'investments', fields: s('investments').fields, rows: 15 },
    { name: 'Parzellen', path: 'land.parcels', fields: s('land').listExtra.fields, rows: 6 },
    { name: 'Kennzahlen', path: 'finance.kpis', fields: s('finance').listExtra.fields, rows: 6 },
    { name: 'Ansprechpartner', path: 'contacts', fields: s('contacts').fields, rows: 2 },
  ];
}

// Einzelfelder des Blatts «Objekt» in Reihenfolge der Eingabemaske
function objectRows() {
  const rows = [];
  for (const s of SECTIONS) {
    if (s.list) {
      if (s.extra) for (const f of s.extra) rows.push({ section: s.title, key: `${s.id}Extra.${f.key}`, f });
      continue;
    }
    for (const f of s.fields) rows.push({ section: s.title, key: `${s.id}.${f.key}`, f });
  }
  rows.push({ section: 'Dokument', key: 'meta.docLabel', f: { label: 'Kennzeichnung im Titel', type: 'text', default: 'Akquisitionsgelegenheit' } });
  rows.push({ section: 'Dokument', key: 'meta.confidential', f: { label: 'Als VERTRAULICH kennzeichnen', type: 'bool', default: true } });
  rows.push({ section: 'Dokument', key: 'optionen.nda', f: { label: 'Geheimhaltungsverpflichtung erstellen', type: 'bool', default: false } });
  for (const f of NDA_FIELDS) rows.push({ section: 'Geheimhaltungsverpflichtung', key: `nda.${f.key}`, f });
  return rows;
}

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
function set(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  let o = obj;
  for (const k of keys) { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; }
  o[last] = value;
}

function hint(f) {
  const parts = [];
  if (f.required) parts.push('Pflicht');
  if (f.unit) parts.push(f.unit);
  if (f.help) parts.push(f.help);
  return parts.join(' · ');
}

function validation(f) {
  if (f.type === 'bool') return { type: 'list', allowBlank: true, formulae: [`"${YES},${NO}"`] };
  if (f.type === 'select') {
    const opts = f.options.filter(Boolean);
    const list = opts.join(',');
    if (list.length < 250) return { type: 'list', allowBlank: true, formulae: [`"${list}"`] };
  }
  return null;
}

function excelValue(f, v) {
  if (f.type === 'bool') return v === true ? YES : v === false ? NO : '';
  return v ?? '';
}

// Erzeugt die Erfassungsvorlage, optional vorausgefüllt mit einem Objekt.
export async function buildWorkbook(property = null) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Schaeppi Grundstücke AG';
  const head = (row) => row.eachCell((c) => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    c.alignment = { vertical: 'middle' };
  });

  // Blatt «Objekt»: Schlüssel (ausgeblendet) | Abschnitt | Feld | Wert | Hinweis
  const ws = wb.addWorksheet('Objekt', { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = [
    { header: 'Schlüssel', key: 'key', width: 22, hidden: true },
    { header: 'Abschnitt', key: 'section', width: 24 },
    { header: 'Feld', key: 'label', width: 40 },
    { header: 'Wert', key: 'value', width: 60 },
    { header: 'Hinweis', key: 'hint', width: 60 },
  ];
  head(ws.getRow(1));
  let lastSection = '';
  for (const r of objectRows()) {
    const current = property ? get(property, r.key) : undefined;
    const value = current !== undefined ? current : (r.f.default ?? '');
    const row = ws.addRow({
      key: r.key,
      section: r.section === lastSection ? '' : r.section,
      label: r.f.label + (r.f.required ? ' *' : ''),
      value: excelValue(r.f, value),
      hint: hint(r.f),
    });
    lastSection = r.section;
    row.getCell('value').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CREAM } };
    row.getCell('value').alignment = { wrapText: true, vertical: 'top' };
    row.getCell('hint').font = { color: { argb: 'FF585857' }, size: 9 };
    row.getCell('hint').alignment = { wrapText: true, vertical: 'top' };
    row.getCell('section').font = { bold: true, color: { argb: NAVY } };
    const dv = validation(r.f);
    if (dv) row.getCell('value').dataValidation = dv;
  }

  // Listenblätter: Zeile 1 Schlüssel (ausgeblendet), Zeile 2 Beschriftung, ab Zeile 3 Daten
  for (const sh of listSheets()) {
    const s = wb.addWorksheet(sh.name, { views: [{ state: 'frozen', ySplit: 2 }] });
    s.columns = sh.fields.map((f) => ({ key: f.key, width: f.type === 'text' && /features|measure|note/.test(f.key) ? 45 : 18 }));
    s.getRow(1).values = sh.fields.map((f) => f.key);
    s.getRow(1).hidden = true;
    s.getRow(2).values = sh.fields.map((f) => f.label + (f.required ? ' *' : '') + (f.unit ? ` (${f.unit})` : ''));
    head(s.getRow(2));
    const items = (property && get(property, sh.path)) || [];
    const n = Math.max(sh.rows, items.length + 2);
    for (let i = 0; i < n; i++) {
      const it = items[i] || {};
      const row = s.getRow(3 + i);
      sh.fields.forEach((f, j) => {
        const c = row.getCell(j + 1);
        c.value = excelValue(f, it[f.key] ?? '');
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CREAM } };
        const dv = validation(f);
        if (dv) c.dataValidation = dv;
      });
    }
  }

  const info = wb.addWorksheet('Anleitung');
  info.getColumn(1).width = 110;
  [
    'Schaeppi Factsheet-Generator – Excel-Erfassung',
    '',
    '1. Diese Datei kopieren und im Blatt «Objekt» die Spalte «Wert» ausfüllen (Pflichtfelder mit *).',
    '2. Einheiten, Investitionen, Parzellen, Kennzahlen und Ansprechpartner in den gleichnamigen Blättern erfassen – eine Zeile je Eintrag.',
    '3. Datei (allein oder zusammen mit Bildern in einem Ordner) in den Ordner «1_Eingang» legen.',
    '   Bilder im selben Ordner: titelbild.jpg, objektfoto.jpg, lagefoto.jpg, grundriss.jpg (JPEG oder PNG).',
    '4. Nach wenigen Sekunden liegen Factsheet (und auf Wunsch die Geheimhaltungsverpflichtung) als Word-Datei',
    '   im Ordner «2_Ausgang», zusammen mit einem Prüfbericht. Die Eingabe wird nach «3_Archiv» verschoben.',
    '',
    'Es werden nur erfasste Angaben verwendet. Leere Felder erscheinen im Dokument nicht.',
    'Zahlen dürfen mit Apostroph erfasst werden (42\'600). Ja/Nein-Felder über die Auswahlliste.',
  ].forEach((t, i) => { const c = info.getCell(`A${i + 1}`); c.value = t; if (i === 0) c.font = { bold: true, size: 14, color: { argb: NAVY } }; });

  return Buffer.from(await wb.xlsx.writeBuffer());
}

function cellText(v) {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return `${String(v.getDate()).padStart(2, '0')}.${String(v.getMonth() + 1).padStart(2, '0')}.${v.getFullYear()}`;
  if (typeof v === 'object') {
    if (Array.isArray(v.richText)) return v.richText.map((r) => r.text).join('');
    if ('result' in v) return cellText(v.result);
    if ('text' in v) return cellText(v.text);
    return '';
  }
  return v;
}

function fromExcel(f, v) {
  const t = cellText(v);
  if (f.type === 'bool') return typeof t === 'boolean' ? t : /^(ja|yes|x|true|1)$/i.test(String(t).trim());
  if (typeof t === 'number') return t;
  return String(t).trim();
}

// Liest eine ausgefüllte Arbeitsmappe. Rückgabe: { property, options }.
export async function readWorkbook(buffer) {
  const wb = new ExcelJS.Workbook();
  try { await wb.xlsx.load(buffer); } catch { throw new Error('Die Excel-Datei kann nicht gelesen werden (nur .xlsx).'); }
  const ws = wb.getWorksheet('Objekt');
  if (!ws) throw new Error('Arbeitsblatt «Objekt» fehlt – bitte die Excel-Vorlage des Factsheet-Generators verwenden.');

  const defs = new Map(objectRows().map((r) => [r.key, r.f]));
  const property = {};
  const options = { nda: false };
  ws.eachRow((row, i) => {
    if (i === 1) return;
    const key = String(cellText(row.getCell(1).value)).trim();
    const f = defs.get(key);
    if (!f) return;
    const value = fromExcel(f, row.getCell(4).value);
    if (key === 'optionen.nda') options.nda = value === true;
    else set(property, key, value);
  });

  for (const sh of listSheets()) {
    const s = wb.getWorksheet(sh.name);
    if (!s) continue;
    const keys = (s.getRow(1).values || []).slice(1).map((k) => String(cellText(k)).trim());
    const items = [];
    s.eachRow((row, i) => {
      if (i < 3) return;
      const it = {};
      keys.forEach((k, j) => {
        const f = sh.fields.find((x) => x.key === k);
        if (f) it[k] = fromExcel(f, row.getCell(j + 1).value);
      });
      if (sh.fields.some((f) => f.type !== 'bool' && !isEmpty(it[f.key]))) items.push(it);
    });
    set(property, sh.path, items);
  }
  return { property, options };
}
