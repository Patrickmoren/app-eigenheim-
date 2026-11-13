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
import { readWorkbook, buildWorkbook, DEFAULT_OPTIONS } from '../src/excel.js';
import * as docs from './documents.js';

const { ExportError } = docs;

export const DIRS = { inbox: '1_Eingang', outbox: '2_Ausgang', archive: '3_Archiv' };
const IMAGE_NAMES = { cover: 'titelbild', object: 'objektfoto', location: 'lagefoto', floorplan: 'grundriss', portrait: 'portrait' };
const MAX_IMAGE = 8 * 1024 * 1024;
const IMG_RE = /\.(jpe?g|png)$/i;

function galleryKind(name) {
  const n = name.toLowerCase();
  if (n.includes('grundriss')) return 'Grundriss';
  if (/innen|wohnen|küche|kueche|bad|zimmer|interior/.test(n)) return 'Innen';
  if (/umgebung|lage|luftbild|situation|region/.test(n)) return 'Umgebung';
  return 'Aussen';
}

const toDataUrl = (buf, file) => `data:image/${/png$/i.test(file) ? 'png' : 'jpeg'};base64,${buf.toString('base64')}`;

// Bilder eines Objektordners: feste Namen (titelbild, objektfoto, lagefoto, grundriss, portrait) und
// alle weiteren Bilder – im Ordner selbst oder im Unterordner «galerie» – als Galerie.
// Die Bildlegende ist der Dateiname («Grundriss Obergeschoss.jpg» -> Grundriss, «Obergeschoss»).
export async function readImageFolder(dir, warnings = []) {
  const images = {};
  const gallery = [];
  const add = async (file, full) => {
    const st = await fs.stat(full);
    if (st.size > MAX_IMAGE) { warnings.push(`${file} ist grösser als 8 MB und wurde weggelassen.`); return null; }
    return toDataUrl(await fs.readFile(full), file);
  };
  const files = (await fs.readdir(dir).catch(() => [])).filter((n) => !ignored(n) && IMG_RE.test(n)).sort();
  for (const file of files) {
    const base = file.replace(IMG_RE, '').toLowerCase();
    const slot = Object.entries(IMAGE_NAMES).find(([, n]) => n === base);
    const src = await add(file, path.join(dir, file));
    if (!src) continue;
    if (slot) images[slot[0]] = src;
    else gallery.push({ src, caption: file.replace(IMG_RE, ''), kind: galleryKind(file) });
  }
  const sub = path.join(dir, 'galerie');
  for (const file of (await fs.readdir(sub).catch(() => [])).filter((n) => !ignored(n) && IMG_RE.test(n)).sort()) {
    const src = await add(file, path.join(sub, file));
    if (src) gallery.push({ src, caption: file.replace(IMG_RE, ''), kind: galleryKind(file) });
  }
  for (const g of gallery) {
    // «Grundriss Erdgeschoss» -> Legende «Erdgeschoss»
    if (g.kind === 'Grundriss') g.caption = g.caption.replace(/^grundriss[\s_-]*/i, '') || 'Grundriss';
    else g.caption = g.caption.replace(/^(innen|aussen|umgebung)[\s_-]*/i, '');
  }
  if (gallery.length) images.gallery = gallery.slice(0, 16);
  return images;
}

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
      'Schaeppi Verkaufsunterlagen – automatischer Ablauf',
      '',
      '1. «Vorlage_Objekterfassung.xlsx» kopieren und ausfüllen. Unter «Dokumente erstellen» wählen, was entstehen soll:',
      '   Factsheet immer; Verkaufsdokumentation (Standard: Ja), anonymer Teaser, Inserattexte, Geheimhaltungsverpflichtung.',
      '2. Die Excel-Datei in «1_Eingang» legen. Mit Bildern: einen Ordner anlegen, darin die Excel-Datei und',
      '   titelbild.jpg, objektfoto.jpg, lagefoto.jpg, grundriss.jpg, portrait.jpg (alle optional).',
      '   Weitere Bilder für die Verkaufsdokumentation in den Unterordner «galerie»; der Dateiname ist die Legende:',
      '   «Grundriss Obergeschoss.jpg», «Innen Wohnzimmer.jpg», «Umgebung Luftbild.jpg».',
      '3. Nach wenigen Sekunden liegt in «2_Ausgang» ein Ordner mit allen Dokumenten und dem Prüfbericht.',
      '   Die Eingabe wandert nach «3_Archiv».',
      '',
      'Bei Fehlern (z. B. fehlende Pflichtangaben) steht im Ausgang nur ein Prüfbericht mit den Gründen.',
      'Korrigierte Datei einfach erneut in «1_Eingang» legen.',
      '',
      'Das Programm muss dafür laufen (Desktop-Verknüpfung «Verkaufsunterlagen»).',
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

  let raw, options = { ...DEFAULT_OPTIONS };
  if (/\.xlsx$/i.test(dataFile)) ({ property: raw, options } = await readWorkbook(buf));
  else {
    try { raw = JSON.parse(buf.toString('utf8')); } catch { throw new ExportError(`${dataFile} ist kein gültiges JSON.`); }
    const opt = raw.optionen;
    if (raw.property) raw = { ...raw.property, texts: raw.texts };
    if (opt && typeof opt === 'object') for (const k of Object.keys(DEFAULT_OPTIONS)) if (k in opt) options[k] = !!opt[k];
  }

  raw.images = { ...(raw.images || {}), ...(stat.isDirectory() ? await readImageFolder(dir, warnings) : {}) };

  let texts = raw.texts || null;
  delete raw.texts;
  const textFile = files.find((n) => /^texte\.json$/i.test(n));
  if (stat.isDirectory() && textFile) {
    try { texts = JSON.parse(await fs.readFile(path.join(dir, textFile), 'utf8')); } catch { warnings.push('texte.json ist ungültig und wurde ignoriert.'); }
  }
  return { raw, texts, options, dataFile, warnings };
}

function report({ name, p, results = [], warnings, error, textsSource }) {
  const lines = ['Prüfbericht Verkaufsunterlagen', `Eingabe:   ${name}`, `Zeitpunkt: ${new Date().toLocaleString('de-CH')}`];
  if (p) lines.push(`Objekt:    ${[p.object.street, [p.object.zip, p.object.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}`);
  lines.push('');
  if (error) {
    lines.push('ERGEBNIS: Kein Dokument erstellt.', '', error.message);
    for (const i of error.issues || []) if (i.level === 'error') lines.push(`  - ${i.section}${i.field ? ' · ' + i.field : ''}: ${i.message}`);
    lines.push('', 'Bitte korrigieren und die Datei erneut in «1_Eingang» legen.');
  } else {
    lines.push('ERGEBNIS:');
    for (const r of results) lines.push(`  ${r.fileName}${r.pages ? ` – ${r.pages} Seite${r.pages === 1 ? '' : 'n'}` : ''}${r.verifiedBy ? ` (geprüft: ${r.verifiedBy})` : ''}`);
    lines.push(`Texte:    ${textsSource}`);
    const seen = new Set();
    const notes = results.flatMap((r) => [...(r.issues || []), ...(r.notes || []).map((n) => ({ level: 'info', section: r.fileName.split('_')[0], field: '', message: n }))])
      .filter((i) => i.level !== 'error' && !seen.has(i.message) && seen.add(i.message));
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
    const o = input.options;
    const results = [await docs.exportFactsheet(input.raw, texts)];
    if (o.dokumentation) {
      const pdf = await docs.exportExposePdf(input.raw, texts);
      if (pdf) results.push(pdf); else input.warnings.push('Kein Chrome/Edge gefunden – Verkaufsdokumentation nur als Word-Datei.');
      results.push(await docs.exportExposeDocx(input.raw, texts));
    }
    if (o.teaser) results.push(await docs.exportTeaser(input.raw, texts));
    if (o.inserat) {
      const ins = await docs.exportInserat(input.raw, texts);
      results.push(ins, { fileName: ins.fileName.replace(/\.docx$/, '.txt'), buffer: Buffer.from(ins.text, 'utf8') });
    }
    if (o.nda) results.push(await docs.exportNda(input.raw, texts));
    const objName = safeName([p.object.street, p.object.city].filter(Boolean).join(' ')) || label;
    outDir = path.join(base, DIRS.outbox, `${objName}_${stamp()}`);
    await fs.mkdir(outDir, { recursive: true });
    for (const r of results) await fs.writeFile(path.join(outDir, r.fileName), r.buffer);
    await fs.writeFile(path.join(outDir, 'Pruefbericht.txt'), report({ name, p, results, warnings: input.warnings, textsSource: TEXT_SOURCE[texts.provider] || texts.provider }), 'utf8');
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
