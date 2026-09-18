/* Hausstil für die Arbeitsmappen (.xlsx). Gleiche Farbwelt wie die Word-Dokumente. */
const ExcelJS = require('exceljs');

const KOPF = 'FF0F5C6E', TINT = 'FFEDF1F2', ZEBRA = 'FFF7F9F9',
      GELB = 'FFFBF3E2', LINIE = 'FFC6D0D5', WEISS = 'FFFFFFFF', DUNKEL = 'FF0B4655';

const STATUS   = ['offen', 'in Arbeit', 'erledigt', 'entfällt', 'blockiert'];
const PFLICHT  = ['Pflicht', 'empfehlenswert', 'situationsabhängig'];
const JANEIN   = ['ja', 'nein', 'offen'];
const ZUSTAND  = ['neu', 'gut', 'gebraucht', 'sanierungsbedürftig', 'nicht vorhanden'];
const ROLLE    = ['Makler', 'Eigentümer', 'Käufer', 'Notariat', 'Finanzierung',
                  'Grundbuchamt', 'Steueramt', 'Dritte'];

function mappe() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Makler-Handbuch Hausverkauf Schweiz';
  wb.created = new Date();
  return wb;
}

/* Legt ein Blatt an und schreibt Titel- und Kopfzeile.
   spalten: [{kopf, breite, validierung?, format?, umbruch?}] */
function blatt(wb, name, titel, spalten, opt = {}) {
  const ws = wb.addWorksheet(name, {
    views: [{state: 'frozen', xSplit: opt.xSplit || 0, ySplit: 3}],
    pageSetup: {orientation: opt.orientation || 'landscape', fitToPage: true,
                fitToWidth: 1, fitToHeight: 0, paperSize: 9,
                margins: {left: 0.4, right: 0.4, top: 0.5, bottom: 0.5,
                          header: 0.2, footer: 0.2}},
  });
  ws.columns = spalten.map(s => ({width: s.breite || 18}));

  ws.mergeCells(1, 1, 1, spalten.length);
  const t = ws.getCell(1, 1);
  t.value = titel;
  t.font = {name: 'Calibri', size: 14, bold: true, color: {argb: KOPF}};
  t.alignment = {vertical: 'middle'};
  ws.getRow(1).height = 26;

  if (opt.hinweis) {
    ws.mergeCells(2, 1, 2, spalten.length);
    const h = ws.getCell(2, 1);
    h.value = opt.hinweis;
    h.font = {name: 'Calibri', size: 9, italic: true, color: {argb: 'FF5A6B76'}};
    h.alignment = {vertical: 'middle', wrapText: true};
    ws.getRow(2).height = opt.hinweis.length > 150 ? 30 : 16;
  }

  const kz = ws.getRow(3);
  spalten.forEach((s, i) => {
    const c = kz.getCell(i + 1);
    c.value = s.kopf;
    c.font = {name: 'Calibri', size: 10, bold: true, color: {argb: WEISS}};
    c.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: KOPF}};
    c.alignment = {vertical: 'middle', horizontal: 'left', wrapText: true};
    c.border = rahmen();
  });
  kz.height = 30;
  ws.autoFilter = {from: {row: 3, column: 1}, to: {row: 3, column: spalten.length}};
  ws.__spalten = spalten;
  return ws;
}

const rahmen = () => ({
  top:    {style: 'thin', color: {argb: LINIE}},
  left:   {style: 'thin', color: {argb: LINIE}},
  bottom: {style: 'thin', color: {argb: LINIE}},
  right:  {style: 'thin', color: {argb: LINIE}},
});

/* Schreibt Datenzeilen. Eine Zeile als {gruppe:'…'} wird als Abschnittstitel gesetzt. */
function zeilen(ws, daten) {
  const spalten = ws.__spalten;
  let zebra = false;
  daten.forEach(z => {
    const r = ws.addRow([]);
    if (z && z.gruppe !== undefined) {
      ws.mergeCells(r.number, 1, r.number, spalten.length);
      const c = r.getCell(1);
      c.value = z.gruppe;
      c.font = {name: 'Calibri', size: 10, bold: true, color: {argb: DUNKEL}};
      c.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: TINT}};
      c.alignment = {vertical: 'middle'};
      c.border = rahmen();
      r.height = 20;
      zebra = false;
      return;
    }
    const werte = Array.isArray(z) ? z : [z];
    spalten.forEach((s, i) => {
      const c = r.getCell(i + 1);
      const v = werte[i];
      if (v !== undefined && v !== null && String(v).startsWith('=')) {
        c.value = {formula: String(v).slice(1)};
      } else if (v !== undefined && v !== null && v !== '') {
        c.value = v;
      }
      c.font = {name: 'Calibri', size: 10};
      c.alignment = {vertical: 'top', wrapText: s.umbruch !== false};
      c.border = rahmen();
      if (zebra) c.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: ZEBRA}};
      if (s.eingabe) c.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: GELB}};
      if (s.format) c.numFmt = s.format;
      if (s.validierung) {
        c.dataValidation = {
          type: 'list', allowBlank: true,
          formulae: ['"' + s.validierung.join(',') + '"'],
          showErrorMessage: false,
        };
      }
    });
    zebra = !zebra;
  });
  return ws;
}

/* Fügt leere, aber vorformatierte Erfassungszeilen an (für CRM-Listen). */
function leerzeilen(ws, anzahl) {
  zeilen(ws, Array.from({length: anzahl}, () => []));
  return ws;
}

/* Spaltenbuchstabe zu einer 1-basierten Spaltennummer: 1 -> A, 27 -> AA */
function sp(n) {
  let s = '';
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; }
  return s;
}

/* Spaltenbuchstabe der Spalte mit diesem Kopftext. */
function spalteVon(ws, kopf) {
  const i = ws.__spalten.findIndex(c => c.kopf === kopf);
  if (i < 0) throw new Error('Spalte nicht gefunden: ' + kopf);
  return sp(i + 1);
}

/* Zeilennummer der Datenzeile, deren erste Zelle diesen Text tragt.
   Setzt voraus, dass die Zeilen ueber zeilen() geschrieben wurden. */
function zeileVon(ws, text) {
  for (let r = 4; r <= ws.rowCount; r++) {
    const v = ws.getCell(r, 1).value;
    if (typeof v === 'string' && v.replace(/^\*\*/, '') === text) return r;
  }
  throw new Error('Zeile nicht gefunden: ' + text);
}

/* Auswahllisten als Bereichsvalidierung auf jede Spalte legen, die eine Liste
   fuehrt. Pro Zelle gesetzte Validierungen gehen auf leeren Zellen verloren;
   ein Bereich gilt auch fuer noch unbenutzte Zeilen. */
function auswahlfelder(wb, reserve = 200) {
  wb.eachSheet(ws => {
    if (!ws.__spalten) return;
    const bis = Math.max(ws.rowCount, 3) + reserve;
    ws.__spalten.forEach((s, i) => {
      if (!s.validierung) return;
      const c = sp(i + 1);
      ws.dataValidations.add(`${c}4:${c}${bis}`, {
        type: 'list', allowBlank: true,
        formulae: ['"' + s.validierung.join(',') + '"'],
        showErrorMessage: false,
      });
    });
  });
  return wb;
}

module.exports = {ExcelJS, mappe, blatt, zeilen, leerzeilen, rahmen, sp, spalteVon, zeileVon,
                  auswahlfelder,
                  STATUS, PFLICHT, JANEIN, ZUSTAND, ROLLE,
                  KOPF, TINT, ZEBRA, GELB, LINIE, DUNKEL};
