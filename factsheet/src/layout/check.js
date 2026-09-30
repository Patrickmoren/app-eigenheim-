// Dokumentprüfung auf dem Block-Modell (vor jedem Export und in der Vorschau).
import { describeLevel } from './factsheet.js';

// Technische Reste und Satzlücken (z. B. «an der in .» durch fehlende Angaben)
const BAD = [/\s[.,;:](?!\d)/, /\b(an der|in|von|auf|mit)\s*[.,;]/, /\bundefined\b/, /\bnull\b/, /\bNaN\b/, /\[object /, /\{\{/, /\}\}/, /\bTODO\b/, /\bXXX\b/, /Lorem ipsum/i, /\[[A-ZÄÖÜ][^\]]{1,40}\]/];

function texts(block) {
  const out = [];
  const visit = (b) => {
    for (const k of ['label', 'title', 'subtitle', 'text', 'heading', 'value', 'caption']) if (typeof b[k] === 'string') out.push(b[k]);
    if (b.items) b.items.forEach((x) => (typeof x === 'object' ? visit(x) : out.push(String(x))));
    if (b.rows) b.rows.forEach((r) => (Array.isArray(r) ? r.forEach((c) => out.push(String(c))) : visit(r)));
    if (b.header) b.header.forEach((c) => out.push(String(c)));
    if (b.left) b.left.forEach(visit); // columns und split
    if (b.right) b.right.forEach(visit);
    if (b.slots) b.slots.forEach(visit);
  };
  visit(block);
  return out;
}

export function checkDocument(model) {
  const issues = [];
  model.pages.forEach((pg, i) => {
    if (!pg.fits) issues.push({ level: 'error', section: 'Dokument', field: `Seite ${i + 1}`, message: `Inhalt passt auch nach maximaler Verdichtung nicht auf Seite ${i + 1}. Bitte längste Texte bzw. Angaben kürzen.` });
    else if (pg.level > 0) issues.push({ level: 'info', section: 'Dokument', field: `Seite ${i + 1}`, message: `Verdichtet: ${describeLevel(i, pg.level)}.` });
    const walk = (b) => {
      if ((b.type === 'kv' || b.type === 'table') && (!b.rows || b.rows.length === 0)) issues.push({ level: 'error', section: 'Dokument', field: `Seite ${i + 1}`, message: 'Leere Tabelle.' });
      if (b.left) b.left.forEach(walk);
      if (b.right) b.right.forEach(walk);
    };
    pg.blocks.forEach(walk);
    for (const t of pg.blocks.flatMap(texts)) {
      for (const re of BAD) if (re.test(t)) issues.push({ level: 'error', section: 'Dokument', field: `Seite ${i + 1}`, message: `Unzulässiger Inhalt («${t.slice(0, 60)}»).` });
    }
  });
  if (model.pages.length > 2) issues.push({ level: 'error', section: 'Dokument', field: 'Seiten', message: 'Mehr als 2 Seiten.' });
  return issues;
}
