// Kündigungstermin-Rechner Schweiz. Gleiche Regeln wie der Excel-Planer:
// Für ein Monatsende E muss die Kündigung spätestens am Ende des Monats E minus Frist eingehen.
// Alle Daten in UTC, damit Sommerzeit keine Tage verschiebt.

function monatsende(d, plus) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + plus + 1, 0));
}

function mietende(eingang, frist, termine) {
  for (let k = 0; k < 24; k++) {
    const e = monatsende(eingang, frist + k);
    if (termine.length === 0 || termine.includes(e.getUTCMonth() + 1)) return e;
  }
  return null;
}

function werktag(d, n) {
  const r = new Date(d);
  const schritt = n > 0 ? 1 : -1;
  while (n !== 0) {
    r.setUTCDate(r.getUTCDate() + schritt);
    const t = r.getUTCDay();
    if (t !== 0 && t !== 6) n -= schritt;
  }
  return r;
}

function fristen(eingang, frist, termine) {
  const ende = mietende(eingang, frist, termine);
  const abnahme = werktag(new Date(ende.getTime() - 86400000), 1);
  const kaution = monatsende(ende, 12); // Mietende ist immer ein Monatsende
  return {
    ende,
    letzterEingang: monatsende(ende, -frist),
    abnahme,
    maengelruege: werktag(abnahme, 2),
    kaution,
  };
}

if (typeof module !== "undefined") module.exports = { mietende, werktag, fristen };
