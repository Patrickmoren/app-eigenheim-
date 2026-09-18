/* Renderer-unabhängige Inhaltsbausteine.
   Die Inhaltsmodule beschreiben damit das Dokument; lib/render-docx.js und
   lib/render-pdf.js setzen dieselbe Beschreibung in .docx bzw. .pdf um. */

const titelblatt = o          => ({t: 'titel', ...o});
const h1neu      = text       => ({t: 'h1', text, neueSeite: true});
const h1         = text       => ({t: 'h1', text});
const h2         = text       => ({t: 'h2', text});
const h3         = text       => ({t: 'h3', text});
const h4         = text       => ({t: 'h4', text});
const abs        = (text, o = {}) => ({t: 'p', text, ...o});
const mix        = parts      => ({t: 'mix', parts});
const punkt      = text       => ({t: 'ul', items: [text]});
const punkte     = items      => ({t: 'ul', items});
const nrpunkt    = (nr, text) => ({t: 'ol', items: [[nr, text]]});
const nrpunkte   = items      => ({t: 'ol', items});
const kasten_leer= text       => ({t: 'check', items: [text]});
const checks     = items      => ({t: 'check', items});
const tabelle    = (kopf, zeilen, breiten) => ({t: 'tab', kopf, zeilen, breiten});
const info       = (titel, zeilen) => ({t: 'box', art: 'info', titel, zeilen});
const recht      = zeilen     => ({t: 'box', art: 'recht',
  titel: 'Rechtliche Prüfung durch Notariat / Rechtsberatung erforderlich', zeilen});
const praxis     = (titel, zeilen) => ({t: 'box', art: 'praxis', titel, zeilen});
const leer       = (n = 1)    => ({t: 'leer', n});
const seite      = ()         => ({t: 'seite'});
const mono       = zeilen     => ({t: 'mono', zeilen});
const flow       = schritte   => ({t: 'flow', schritte});
/* Feldzeile für Formulare: Bezeichnung + Punktlinie */
const feld       = text       => ({t: 'feld', items: [text]});
const felder     = items      => ({t: 'feld', items});
/* Freie Linien zum Handschriftlichen Ausfüllen */
const linien     = (n = 1)    => ({t: 'linien', n});

module.exports = {titelblatt, h1, h1neu, h2, h3, h4, abs, mix, punkt, punkte,
  nrpunkt, nrpunkte, kasten_leer, checks, tabelle, info, recht, praxis, leer,
  seite, mono, flow, feld, felder, linien};
