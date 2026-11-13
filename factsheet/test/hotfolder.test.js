// Excel-Erfassung und automatischer Ordnerablauf (Eingang -> Ausgang/Archiv).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import ExcelJS from 'exceljs';
import { normalizeProperty } from '../src/model/schema.js';
import { buildWorkbook, readWorkbook } from '../server/excel.js';
import { prepareFolders, processEntry, startHotfolder, DIRS } from '../server/hotfolder.js';
import { OfflineProvider } from '../server/ai/providers.js';
import { example, EXAMPLE_DIR, maximalObject } from './helpers.js';

const provider = new OfflineProvider();
const tmp = () => fs.mkdtemp(path.join(os.tmpdir(), 'hotfolder-test-'));

test('Excel: Vorlage enthält Objekt- und Listenblätter mit Auswahllisten', async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await buildWorkbook());
  for (const n of ['Objekt', 'Einheiten', 'Investitionen', 'Parzellen', 'Kennzahlen', 'Ansprechpartner', 'Anleitung']) assert.ok(wb.getWorksheet(n), n);
  const ws = wb.getWorksheet('Objekt');
  const row = [...Array(ws.rowCount).keys()].map((i) => ws.getRow(i + 1)).find((r) => r.getCell(1).value === 'object.type');
  assert.equal(row.getCell(4).dataValidation.type, 'list');
  assert.ok(ws.getColumn(1).hidden);
});

test('Excel: Hin- und Rückweg erhält alle Angaben', async () => {
  const p = normalizeProperty(maximalObject());
  const { property, options } = await readWorkbook(await buildWorkbook(p));
  const q = normalizeProperty(property);
  assert.equal(options.nda, false);
  assert.equal(q.object.street, p.object.street);
  assert.equal(q.object.plotArea, 2100);
  assert.equal(q.units.length, 5);
  assert.equal(q.units[2].rooms, 4.5);
  assert.equal(q.investments.length, 9);
  assert.equal(q.land.parcels.length, 3);
  assert.equal(q.land.parcels[1].share, '16/22');
  assert.equal(q.finance.showGrossYield, true);
  assert.equal(q.process.stages, 'zweistufig');
  assert.equal(q.contacts.length, 2);
  assert.equal(q.finance.kpis[0].label, 'Leerstand');
});

test('Excel: Beschriftungen, Ja/Nein und Formeln werden robust gelesen', async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await buildWorkbook());
  const ws = wb.getWorksheet('Objekt');
  const setVal = (key, v) => ws.eachRow((r) => { if (r.getCell(1).value === key) r.getCell(4).value = v; });
  setVal('object.street', 'Baselstrasse 69');
  setVal('object.zip', '4144');
  setVal('object.city', { richText: [{ text: 'Arles' }, { text: 'heim' }] });
  setVal('object.plotArea', { formula: '400+500', result: 900 });
  setVal('optionen.nda', 'ja');
  ws.getRow(3).getCell(3).value = 'Andere Beschriftung'; // Beschriftung geändert, Schlüssel bleibt
  const { property, options } = await readWorkbook(Buffer.from(await wb.xlsx.writeBuffer()));
  assert.equal(property.object.city, 'Arlesheim');
  assert.equal(property.object.plotArea, 900);
  assert.equal(options.nda, true);
});

test('Excel: fremde Dateien werden mit klarer Meldung abgewiesen', async () => {
  await assert.rejects(readWorkbook(Buffer.from('kein excel')), /nicht gelesen/);
  const wb = new ExcelJS.Workbook();
  wb.addWorksheet('Tabelle1');
  await assert.rejects(readWorkbook(Buffer.from(await wb.xlsx.writeBuffer())), /Objekt.*fehlt/);
});

test('Ordner: Excel mit Bildern -> Factsheet, NDA und Prüfbericht im Ausgang, Eingabe im Archiv', async () => {
  const base = await tmp();
  await prepareFolders(base);
  for (const f of ['Vorlage_Objekterfassung.xlsx', 'LIESMICH.txt']) await fs.access(path.join(base, f));
  const inDir = path.join(base, DIRS.inbox, 'Neumattstrasse 15');
  await fs.mkdir(inDir);
  const p = example({ images: false });
  p.nda.company = 'Muster Immobilien AG';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await buildWorkbook(normalizeProperty(p)));
  wb.getWorksheet('Objekt').eachRow((r) => { if (r.getCell(1).value === 'optionen.nda') r.getCell(4).value = 'Ja'; });
  await fs.writeFile(path.join(inDir, 'Objekterfassung.xlsx'), Buffer.from(await wb.xlsx.writeBuffer()));
  await fs.copyFile(path.join(EXAMPLE_DIR, 'titelbild.jpg'), path.join(inDir, 'titelbild.jpg'));

  const r = await processEntry(base, 'Neumattstrasse 15', { provider });
  assert.ok(r.ok);
  const out = (await fs.readdir(r.outDir)).sort();
  assert.deepEqual(out, ['Factsheet_Neumattstrasse-15-Busserach.docx', 'Geheimhaltungsverpflichtung_Neumattstrasse-15-Busserach.docx', 'Pruefbericht.txt']);
  const bericht = await fs.readFile(path.join(r.outDir, 'Pruefbericht.txt'), 'utf8');
  assert.match(bericht, /ERGEBNIS: Factsheet_Neumattstrasse-15-Busserach\.docx – 2 Seiten/);
  assert.match(bericht, /regelbasiert/);
  assert.deepEqual(await fs.readdir(path.join(base, DIRS.inbox)), []);
  assert.match((await fs.readdir(path.join(base, DIRS.archive)))[0], /_Neumattstrasse 15$/);
});

test('Ordner: fehlerhafte Eingabe ergibt Fehlerbericht statt Dokument', async () => {
  const base = await tmp();
  await prepareFolders(base);
  const p = example({ images: false });
  p.object.city = '';
  await fs.writeFile(path.join(base, DIRS.inbox, 'kaputt.json'), JSON.stringify(p));
  const r = await processEntry(base, 'kaputt.json', { provider });
  assert.equal(r.ok, false);
  const txt = await fs.readFile(r.report, 'utf8');
  assert.match(txt, /Kein Dokument erstellt/);
  assert.match(txt, /Ort: Pflichtangabe fehlt/);
  assert.match((await fs.readdir(path.join(base, DIRS.archive)))[0], /_FEHLER_kaputt\.json$/);
});

test('Ordner: Überwachung wartet, bis Datei fertig geschrieben und in Excel geschlossen ist', async () => {
  const base = await tmp();
  await prepareFolders(base);
  const file = path.join(base, DIRS.inbox, 'objekt.json');
  await fs.writeFile(file, JSON.stringify(example({ images: false })));
  await fs.writeFile(path.join(base, DIRS.inbox, '~$objekt.json'), ''); // wie eine offene Excel-Datei
  const lines = [];
  const hf = startHotfolder(base, { provider, intervalMs: 60000, settleMs: 0, log: (l) => lines.push(l) });
  await new Promise((r) => setTimeout(r, 300)); // erster Durchlauf beim Start
  await fs.access(file); // noch gesperrt -> unverarbeitet
  await fs.unlink(path.join(base, DIRS.inbox, '~$objekt.json'));
  await hf.tick();
  hf.stop();
  await assert.rejects(fs.access(file));
  assert.ok(lines.some((l) => /OK\s+objekt\.json/.test(l)), lines.join('\n'));
  assert.match(await fs.readFile(path.join(base, 'protokoll.txt'), 'utf8'), /OK\s+objekt\.json/);
});
