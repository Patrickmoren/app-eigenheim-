// Verkaufsdokumentation (Exposé): Seitenmodell.
//
// Jede Seite ist eine Vorlage mit festen Flächen (A4 quer). Welche Seiten entstehen, bestimmen die
// vorhandenen Daten und Bilder: ohne Text keine Lageseite, ohne Grundriss keine Grundrissseite.
// Texte werden gegen ihre Fläche vermessen und – falls nötig – an Satzgrenzen gekürzt; die
// Schriftgrösse bleibt immer gleich. HTML/PDF und Word lesen dasselbe Modell.
import { isEmpty } from '../model/schema.js';
import {
  addressLine, designation, keyFigures, factRows, financeRows, landRows, parcelTable, unitTable,
  sortedInvestments, processSteps, filledUnits, priceText,
} from '../model/facts.js';
import { fmtChf, fmtArea } from '../model/format.js';
import { trimToSentences, unitTitle } from '../content/texts.js';
import { EXPOSE } from '../layout/design.js';
import { countLines } from '../layout/measure.js';

const { page: PG, pad: PAD } = EXPOSE;
const HALF = PG.width / 2;
export const TEXT_WIDTH = HALF - 2 * PAD;

const T = EXPOSE.type;
export const textHeight = (text, style, width = TEXT_WIDTH) => countLines(text, style, width) * style.line;

// Kürzt einen Text an Satzgrenzen, bis er in die Fläche passt. Absätze (\n\n) bleiben erhalten.
export function fitText(text, style, width, height) {
  if (!text) return { text: '', trimmed: false };
  if (textHeight(text, style, width) <= height) return { text, trimmed: false };
  let max = text.length;
  let out = text;
  while (max > 40) {
    max = Math.floor(max * 0.9);
    out = trimToSentences(text, max);
    if (textHeight(out, style, width) <= height) break;
  }
  return { text: out, trimmed: true };
}

// Bildauswahl ohne Wiederholung
function imagePool(images = {}) {
  const used = new Set();
  const g = Array.isArray(images.gallery) ? images.gallery : [];
  const pools = {
    Aussen: [images.object && { src: images.object, caption: '' }, ...g.filter((x) => x.kind === 'Aussen')].filter(Boolean),
    Innen: g.filter((x) => x.kind === 'Innen'),
    Umgebung: [images.location && { src: images.location, caption: '' }, ...g.filter((x) => x.kind === 'Umgebung')].filter(Boolean),
    Grundriss: [images.floorplan && { src: images.floorplan, caption: 'Grundriss' }, ...g.filter((x) => x.kind === 'Grundriss')].filter(Boolean),
  };
  return {
    take(...kinds) {
      for (const k of kinds) {
        const hit = (pools[k] || []).find((x) => !used.has(x.src));
        if (hit) { used.add(hit.src); return hit; }
      }
      return null;
    },
    takeWhere(kind, fn) {
      const hit = (pools[kind] || []).find((x) => !used.has(x.src) && fn(x));
      if (hit) used.add(hit.src);
      return hit || null;
    },
    rest(...kinds) {
      const out = [];
      for (const k of kinds) for (const x of pools[k] || []) if (!used.has(x.src)) { used.add(x.src); out.push(x); }
      return out;
    },
    markUsed(src) { if (src) used.add(src); },
  };
}

// Reihenfolge wie in der Referenz-Dokumentation (Facts & Figures, Neumattstrasse 15)
function factsList(p) {
  const rows = factRows(p, { unitFeatures: false, price: false });
  const fin = financeRows(p).filter((r) => /Mietertrag IST|Nebenkosten|Vermietungsstand/.test(r.label));
  const at = rows.findIndex((r) => r.label === 'Wärmeerzeugung');
  rows.splice(at < 0 ? rows.length : at, 0, ...fin);
  return rows;
}

// Kürzt die Faktenliste, bis sie in die Fläche passt (weniger wichtige Zeilen zuerst).
const DROP_ORDER = ['Zustand', 'Nebenräume', 'Objektart', 'Verfügbar ab', 'Wärmeerzeugung', 'Nebenkosten', 'Grundlasten / Dienstbarkeiten', 'Vermietungsstand'];
function fitFacts(rows, width, height) {
  const lw = width * 0.4, vw = width * 0.6 - 8;
  const h = (list) => list.reduce((a, r) => a + Math.max(countLines(r.label, T.label, lw), countLines(r.value, T.value, vw)) * T.value.line + 7, 0);
  let list = rows.slice();
  const dropped = [];
  for (const label of DROP_ORDER) {
    if (h(list) <= height) break;
    if (list.some((r) => r.label === label)) { list = list.filter((r) => r.label !== label); dropped.push(label); }
  }
  while (h(list) > height && list.length > 3) dropped.push(list.pop().label);
  return { rows: list, dropped };
}

export function buildExpose(p, texts, images = {}) {
  const pool = imagePool(images);
  const pages = [];
  const notes = [];
  const t = texts;
  const title = t.title || designation(p);
  const address = addressLine(p);
  const city = p.object.city || '';
  const bodyHeight = PG.height - EXPOSE.textTop - EXPOSE.bottom;
  const fit = (text, h = bodyHeight, w = TEXT_WIDTH, label = '') => {
    const r = fitText(text, T.body, w, h);
    if (r.trimmed) notes.push(`${label}: Text für die Seite gekürzt.`);
    return r.text;
  };

  // 1 Titel
  const cover = images.cover ? { src: images.cover } : pool.take('Aussen');
  if (images.cover) pool.markUsed(images.cover);
  pages.push({ type: 'cover', title: 'Verkaufsdokumentation', subtitle: address, designation: title, image: cover, label: p.meta.docLabel || '' });

  // 2 Facts & Figures
  const price = priceText(p);
  const factsHeight = PG.height - 150 - EXPOSE.bottom - (price ? 70 : 0);
  const facts = fitFacts(factsList(p), TEXT_WIDTH, factsHeight);
  if (facts.dropped.length) notes.push(`Facts & Figures: aus Platzgründen weggelassen – ${facts.dropped.join(', ')}.`);
  pages.push({ type: 'facts', rows: facts.rows, price, image: pool.take('Aussen'), kpis: keyFigures(p) });

  // 3 Das Objekt
  if (t.expose.objekt) {
    pages.push({ type: 'text', key: 'expose.objekt', title: 'Das Objekt', subtitle: title, text: fit(t.expose.objekt, bodyHeight, TEXT_WIDTH, 'Das Objekt'), image: pool.take('Aussen', 'Innen'), imageSide: 'right', tone: 'cream', kpis: keyFigures(p) });
  }

  // 4 Lage (Mikrolage, mit Leitsatz) – das Lagebild gehört hierher
  if (t.expose.lage) {
    const tagline = p.marketing.tagline || '';
    const h = bodyHeight - (tagline ? 50 : 0);
    pages.push({ type: 'text', key: 'expose.lage', title: [p.object.street, city].filter(Boolean).join(', ') || 'Lage', kicker: 'Lage', text: fit(t.expose.lage, h, TEXT_WIDTH, 'Lage'), tagline, image: pool.take('Umgebung'), imageSide: 'right', tone: 'cream' });
  }

  // 5 Region (Makrolage)
  if (t.expose.region) {
    pages.push({ type: 'text', key: 'expose.region', title: city || 'Region', kicker: 'Region', text: fit(t.expose.region, bodyHeight, TEXT_WIDTH, 'Region'), image: pool.take('Umgebung', 'Aussen'), imageSide: 'left', tone: 'white' });
  }

  // 6 Einheiten: bis 4 Typen je eine Seite, sonst eine Übersicht als Tabelle
  const units = filledUnits(p);
  if (units.length && units.length <= 4) {
    units.forEach((u, i) => {
      const ut = t.expose.units[i] || { title: unitTitle(u), text: '' };
      const img = pool.takeWhere('Innen', (x) => x.unit === i) || pool.take('Innen');
      const facts2 = [
        !isEmpty(u.rooms) && ['Zimmer', String(u.rooms)],
        !isEmpty(u.area) && ['Fläche', `ca. ${fmtArea(u.area)}`],
        !isEmpty(u.floor) && ['Geschoss', u.floor],
        !isEmpty(u.rent) && ['Nettomiete', `${fmtChf(u.rent)} / Mt.`],
        Number(u.count) > 1 && ['Anzahl', String(u.count)],
      ].filter(Boolean);
      const textH = bodyHeight - 40 - facts2.length * 18;
      pages.push({ type: 'unit', key: `expose.units.${i}`, index: i, title: u.kind && u.kind !== 'Wohnung' ? u.kind : 'Wohnen', heading: ut.title || unitTitle(u), text: fit(ut.text, textH, TEXT_WIDTH, `Einheit ${i + 1}`), facts: facts2, image: img });
    });
  } else if (units.length > 4) {
    const tbl = unitTable(p);
    pages.push({ type: 'unitTable', title: 'Einheiten', table: tbl, image: pool.take('Innen', 'Aussen') });
  }

  // 7 Galerie: übrige Bilder, 3 je Seite
  const rest = pool.rest('Aussen', 'Innen', 'Umgebung');
  for (let i = 0; i < rest.length && i < 9; i += 3) pages.push({ type: 'gallery', images: rest.slice(i, i + 3) });

  // 8 Grundrisse: je Grundriss eine Seite, nicht beschnitten
  for (const fp of pool.rest('Grundriss')) pages.push({ type: 'floorplan', title: 'Grundriss', caption: fp.caption && fp.caption !== 'Grundriss' ? fp.caption : '', image: fp });

  // 9 Zahlen & Grundstück
  const fin = financeRows(p);
  const land = landRows(p);
  const parcels = parcelTable(p);
  const inv = sortedInvestments(p);
  const rentTable = unitTable(p);
  if (fin.length || land.length || parcels || inv.length) {
    pages.push({ type: 'numbers', title: 'Zahlen & Grundstück', finance: fin, land, parcels, investments: inv.slice(0, 10), units: units.length <= 4 ? rentTable : null });
  }

  // 10 Nächste Schritte
  const steps = processSteps(p);
  if (steps.length) {
    const r = p.process;
    pages.push({ type: 'steps', title: 'Nächste Schritte', intro: r.stages ? `Der Verkauf erfolgt in einem ${r.stages === 'zweistufig' ? 'zweistufigen' : 'einstufigen'} Verfahren.` : '', steps });
  }

  // 11 Kontakt
  const contacts = (p.contacts || []).filter((c) => !isEmpty(c.name));
  pages.push({ type: 'contact', title: 'Wir sind für Sie da', contacts, portrait: images.portrait ? { src: images.portrait } : null, image: pool.take('Aussen', 'Innen', 'Umgebung') || cover });

  // 12 Rückseite
  pages.push({ type: 'back' });

  pages.forEach((pg, i) => { pg.number = i + 1; });
  return { template: 'expose', title, address, confidential: p.meta.confidential !== false, pages, notes };
}
