// Automatischer Ablauf über Ordner («Hotfolder»).
//
//   <Basis>/1_Eingang   Excel-Erfassung (.xlsx) oder Objektdaten (.json) ablegen – einzeln oder als
//                       Ordner zusammen mit Bildern (titelbild/objektfoto/lagefoto/grundriss .jpg/.png)
//                       und optional texte.json (fertige oder bearbeitete Texte).
//   <Basis>/2_Ausgang   je Objekt ein Ordner mit Factsheet.docx, ggf. Geheimhaltungsverpflichtung.docx
//                       und Pruefbericht.txt
//   <Basis>/3_Archiv    verarbeitete Eingaben (mit Zeitstempel)
//
// Der Ordner wird abgefragt statt über Dateisystem-Ereignisse beobachtet; das funktioniert auch
// auf Netzlaufwerken und OneDrive. Eine Eingabe wird erst verarbeitet, wenn sie einige Sekunden
// unverändert ist und Excel sie nicht mehr geöffnet hat.
import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizeProperty } from '../src/model/schema.js';
import { normalizeTexts, offlineTexts } from '../src/content/texts.js';
import { readWorkbook, buildWorkbook } from './excel.js';
import { exportFactsheet, exportNda, ExportError } from './documents.js';

export const DIRS = { inbox: '1_Eingang', outbox: '2_Ausgang', archive: '3_Archiv' };
const IMAGE_NAMES = { cover: 'titelbild', object: 'objektfoto', location: 'lagefoto', floorplan: 'grundriss' };
const MAX_IMAGE = 8 * 1024 * 1024;

const stamp = (d = new Date()) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};
const ignored = (name) => name.startsWith('.') || name.startsWith('~$') || /^desktop\.ini$|^thumbs\.db$/i.test(name);
const safeName = (s) => String(s || 'Objekt').normalize('NFC').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80);

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

// Legt die Ordnerstruktur, die Excel-Vorlage und eine Kurzanleitung an (bestehende Dateien bleiben).
export async function prepareFolders(base) {
  for (const d of Object.values(DIRS)) await fs.mkdir(path.join(base, d), { recursive: true });
  const tpl = path.join(base, 'Vorlage_Objekterfassung.xlsx');
  if (!(await exists(tpl))) await fs.writeFile(tpl, await buildWorkbook());
  const readme = path.join(base, 'LIESMICH.txt');
  if (!(await exists(readme))) {
    await fs.writeFile(readme, [
      'Schaeppi Factsheet-Generator – automatischer Ablauf',
      '',
      '1. «Vorlage_Objekterfassung.xlsx» kopieren und ausfüllen.',
      '2. Die Excel-Datei in «1_Eingang» legen. Mit Bildern: einen Ordner anlegen, darin die Excel-Datei und',
      '   titelbild.jpg, objektfoto.jpg, lagefoto.jpg, grundriss.jpg (alle optional).',
      '3. Nach wenigen Sekunden liegt in «2_Ausgang» ein Ordner mit Factsheet (Word), auf Wunsch der',
      '   Geheimhaltungsverpflichtung und dem Prüfbericht. Die Eingabe wandert nach «3_Archiv».',
      '',
      'Bei Fehlern (z. B. fehlende Pflichtangaben) steht im Ausgang nur ein Prüfbericht mit den Gründen.',
      'Korrigierte Datei einfach erneut in «1_Eingang» legen.',
      '',
      'Der Generator muss dafür laufen (Desktop-Verknüpfung «Factsheet-Generator»).',
      '',
    ].join('\r\n'), 'utf8');
  }
}

// Sammelt Daten, Bilder und Texte einer Eingabe (Datei oder Ordner).
export async function readInput(entryPath) {
  const stat = await fs.stat(entryPath);
  const dir = stat.isDirectory() ? entryPath : path.dirname(entryPath);
  const files = stat.isDirectory() ? (await fs.readdir(dir)).filter((n) => !ignored(n)) : [path.basename(entryPath)];
  const warnings = [];

  const dataFile = files.find((n) => /\.xlsx$/i.test(n)) || files.find((n) => /\.json$/i.test(n) && !/^texte\.json$/i.test(n));
  if (!dataFile) throw new ExportError('Keine Objektdaten gefunden (.xlsx-Erfassung oder .json).');
  const buf = await fs.readFile(path.join(dir, dataFile));

  let raw, options = { nda: false };
  if (/\.xlsx$/i.test(dataFile)) ({ property: raw, options } = await readWorkbook(buf));
  else {
    try { raw = JSON.parse(buf.toString('utf8')); } catch { throw new ExportError(`${dataFile} ist kein gültiges JSON.`); }
    if (raw.property) { options.nda = !!(raw.optionen && raw.optionen.nda); raw = { ...raw.property, texts: raw.texts }; }
    if (raw.optionen) options.nda = !!raw.optionen.nda;
  }

  raw.images = { ...(raw.images || {}) };
  if (stat.isDirectory()) {
    for (const [slot, name] of Object.entries(IMAGE_NAMES)) {
      const file = files.find((n) => new RegExp(`^${name}\\.(jpe?g|png)$`, 'i').test(n));
      if (!file) continue;
      const img = await fs.readFile(path.join(dir, file));
      if (img.length > MAX_IMAGE) { warnings.push(`${file} ist grösser als 8 MB und wurde weggelassen.`); continue; }
      raw.images[slot] = `data:image/${/png$/i.test(file) ? 'png' : 'jpeg'};base64,${img.toString('base64')}`;
    }
  }

  let texts = raw.texts || null;
  delete raw.texts;
  const textFile = files.find((n) => /^texte\.json$/i.test(n));
  if (stat.isDirectory() && textFile) {
    try { texts = JSON.parse(await fs.readFile(path.join(dir, textFile), 'utf8')); } catch { warnings.push('texte.json ist ungültig und wurde ignoriert.'); }
  }
  return { raw, texts, options, dataFile, warnings };
}

function report({ name, p, result, nda, warnings, error, textsSource }) {
  const lines = ['Prüfbericht Factsheet-Generator', `Eingabe:   ${name}`, `Zeitpunkt: ${new Date().toLocaleString('de-CH')}`];
  if (p) lines.push(`Objekt:    ${[p.object.street, [p.object.zip, p.object.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}`);
  lines.push('');
  if (error) {
    lines.push('ERGEBNIS: Kein Dokument erstellt.', '', error.message);
    for (const i of error.issues || []) if (i.level === 'error') lines.push(`  - ${i.section}${i.field ? ' · ' + i.field : ''}: ${i.message}`);
    lines.push('', 'Bitte korrigieren und die Datei erneut in «1_Eingang» legen.');
  } else {
    lines.push(`ERGEBNIS: ${result.fileName} – ${result.pages} Seiten (geprüft: ${result.verifiedBy})`);
    if (nda) lines.push(`          ${nda.fileName}`);
    lines.push(`Texte:    ${textsSource}`);
    const notes = result.issues.filter((i) => i.level !== 'error');
    if (notes.length || warnings.length) {
      lines.push('', 'Hinweise zur Prüfung:');
      for (const w of warnings) lines.push(`  - ${w}`);
      for (const i of notes) lines.push(`  - [${i.level === 'warning' ? 'Prüfen' : 'Info'}] ${i.section}${i.field ? ' · ' + i.field : ''}: ${i.message}`);
    } else lines.push('', 'Keine Beanstandungen.');
  }
  return lines.join('\r\n') + '\r\n';
}

const TEXT_SOURCE = { anthropic: 'KI (Claude)', offline: 'regelbasiert aus den Fakten', beispiel: 'mitgelieferte Texte (texte.json)' };

// Verarbeitet eine Eingabe vollständig. Wirft nie: Fehler landen im Prüfbericht.
export async function processEntry(base, name, { provider, log = () => {} } = {}) {
  const entryPath = path.join(base, DIRS.inbox, name);
  const label = safeName(name.replace(/\.(xlsx|json)$/i, ''));
  let p = null;
  let outDir = null;
  try {
    const input = await readInput(entryPath);
    p = normalizeProperty(input.raw);
    let texts = input.texts ? normalizeTexts(input.texts) : null;
    if (!texts) {
      try { texts = await provider.generate(p); } catch (e) {
        input.warnings.push(`KI nicht verfügbar (${e.message}) – regelbasierte Texte verwendet.`);
        texts = offlineTexts(p);
      }
    }
    const result = await exportFactsheet({ ...input.raw, images: input.raw.images }, texts);
    const nda = input.options.nda ? await exportNda(input.raw, texts) : null;
    const objName = safeName([p.object.street, p.object.city].filter(Boolean).join(' ')) || label;
    outDir = path.join(base, DIRS.outbox, `${objName}_${stamp()}`);
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, result.fileName), result.buffer);
    if (nda) await fs.writeFile(path.join(outDir, nda.fileName), nda.buffer);
    await fs.writeFile(path.join(outDir, 'Pruefbericht.txt'), report({ name, p, result, nda, warnings: input.warnings, textsSource: TEXT_SOURCE[texts.provider] || texts.provider }), 'utf8');
    await fs.rename(entryPath, path.join(base, DIRS.archive, `${stamp()}_${name}`));
    log(`OK     ${name} -> ${path.relative(base, outDir)}`);
    return { ok: true, outDir };
  } catch (error) {
    const file = path.join(base, DIRS.outbox, `FEHLER_${label}_${stamp()}.txt`);
    await fs.writeFile(file, report({ name, p, error }), 'utf8').catch(() => {});
    await fs.rename(entryPath, path.join(base, DIRS.archive, `${stamp()}_FEHLER_${name}`)).catch(() => {});
    log(`FEHLER ${name}: ${error.message}`);
    return { ok: false, report: file };
  }
}

// Jüngste Änderung einer Eingabe (Datei oder Ordner, eine Ebene tief) und ob Excel sie noch geöffnet hat.
async function entryState(p) {
  const st = await fs.stat(p);
  if (!st.isDirectory()) {
    const lock = path.join(path.dirname(p), `~$${path.basename(p)}`);
    return { mtime: st.mtimeMs, locked: await exists(lock) };
  }
  let mtime = st.mtimeMs, locked = false;
  for (const n of await fs.readdir(p)) {
    if (n.startsWith('~$')) locked = true;
    const s = await fs.stat(path.join(p, n)).catch(() => null);
    if (s) mtime = Math.max(mtime, s.mtimeMs);
  }
  return { mtime, locked };
}

export function startHotfolder(base, { provider, intervalMs = 3000, settleMs = 4000, log = console.log } = {}) {
  let busy = false;
  let stopped = false;
  const logLine = (msg) => {
    const line = `${new Date().toLocaleString('de-CH')}  ${msg}`;
    log(line);
    fs.appendFile(path.join(base, 'protokoll.txt'), line + '\r\n').catch(() => {});
  };
  const tick = async () => {
    if (busy || stopped) return;
    busy = true;
    try {
      const inbox = path.join(base, DIRS.inbox);
      for (const name of (await fs.readdir(inbox)).filter((n) => !ignored(n))) {
        const full = path.join(inbox, name);
        const st = await fs.stat(full).catch(() => null);
        if (!st) continue;
        if (!st.isDirectory() && !/\.(xlsx|json)$/i.test(name)) continue;
        const { mtime, locked } = await entryState(full);
        if (locked || Date.now() - mtime < settleMs) continue;
        await processEntry(base, name, { provider, log: logLine });
      }
    } catch (e) {
      logLine(`Ordner nicht lesbar: ${e.message}`);
    } finally {
      busy = false;
    }
  };
  const timer = setInterval(tick, intervalMs);
  tick();
  logLine(`Überwache ${path.join(base, DIRS.inbox)}`);
  return { stop: () => { stopped = true; clearInterval(timer); }, tick };
}
