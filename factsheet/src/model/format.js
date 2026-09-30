// Schweizer Schreibweisen für Zahlen, Beträge und Flächen.
import { toNumber, isEmpty } from './schema.js';

const APOS = '’'; // typografischer Apostroph als Tausendertrennzeichen (CHF 995’000)

export function fmtNumber(v, decimals = 0) {
  const n = toNumber(v);
  if (n === null) return isEmpty(v) ? '' : String(v).trim();
  const fixed = n.toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, APOS);
  return dec ? `${grouped}.${dec}` : grouped;
}

export function fmtChf(v) {
  const n = toNumber(v);
  if (n === null) return isEmpty(v) ? '' : String(v).trim();
  return `CHF ${fmtNumber(n, Number.isInteger(n) ? 0 : 2)}`;
}

export function fmtArea(v) {
  const n = toNumber(v);
  if (n === null) return isEmpty(v) ? '' : String(v).trim();
  return `${fmtNumber(n, Number.isInteger(n) ? 0 : 1)} m²`;
}

export function fmtPercent(v, decimals = 0) {
  const n = toNumber(v);
  if (n === null) return isEmpty(v) ? '' : String(v).trim();
  return `${n.toFixed(decimals)} %`;
}

// 4.5 -> "4.5", 3 -> "3"
export function fmtRooms(v) {
  const n = toNumber(v);
  if (n === null) return isEmpty(v) ? '' : String(v).trim();
  return Number.isInteger(n) ? String(n) : String(n);
}

export function joinNonEmpty(parts, sep = ', ') {
  return parts.filter((p) => !isEmpty(p)).join(sep);
}
