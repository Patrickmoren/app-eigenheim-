/* Erzeugt 05_Kommunikationsvorlagen – die Vorlagen K1 bis K20. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkte, tabelle, info, recht,
       titelblatt, felder} = require('../lib/blocks.js');
const {VORLAGEN} = require('./kommunikation.js');
const {PHASEN} = require('./phasen.js');
const {STAND} = require('./handbuch2.js');

function bloecke() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  push(titelblatt({
    marke: 'Kommunikationsvorlagen',
    titel: 'Hausverkauf Schweiz',
    untertitel: 'Zwanzig Vorlagen K1 bis K20 für den gesamten Verkaufsprozess',
    stand: `Fassung vom ${STAND} · Version 1 · Beilage zum Makler-Handbuch`}));

  push(info('Zur Verwendung', [
    'Platzhalter in eckigen Klammern werden je Vorgang ersetzt. Vorlagen werden gelesen und angepasst, nicht bloss ausgefüllt – eine erkennbar unangepasste Vorlage wirkt schlechter als eine kurze eigene Nachricht.',
    'Die Reihenfolge folgt dem Verkaufsprozess. Die Phasennummer verweist auf Teil B des Makler-Handbuchs.',
    'Der Abschnitt «Worauf zu achten ist» unter jeder Vorlage ist keine Empfehlung, sondern Teil der Arbeitsanweisung.',
    'In jede Signatur gehört der Link auf die Datenschutzerklärung.']));
  push(recht([
    'Vorlage K14 «Reservationsbestätigung» ist rechtlich sensibel: Sie darf keine Kaufverpflichtung, keine Konventionalstrafe und keine Verfallsklausel enthalten und ist vor jeder Verwendung durch das Notariat oder die Rechtsberatung zu prüfen (Art. 216 Abs. 2 OR).',
    'Der Makler erteilt in keiner Nachricht Rechts-, Steuer- oder Finanzierungsauskünfte. Solche Fragen werden an Notariat, Steueramt, Bank oder Rechtsberatung verwiesen.']));
  push(leer());
  push(h2('Übersicht'));
  push(tabelle(['Nr.', 'Vorlage', 'Phase', 'Kanal und Zeitpunkt'],
    VORLAGEN.map(v => [v.k, v.name, String(v.phase), v.kanal]),
    [700, 3000, 700, 5200]));

  VORLAGEN.forEach(v => {
    const ph = PHASEN.find(p => p.nr === v.phase);
    push(h1neu(`${v.k} · ${v.name}`));
    push(tabelle(['Phase', 'Kanal und Zeitpunkt'],
      [[`${v.phase} · ${ph ? ph.name : ''}`, v.kanal]], [3000, 6600]));
    push(leer());
    push(h3('Betreff'));
    push(abs(v.betreff, {bold: true}));
    push(h3('Text'));
    v.text.forEach(t => push(abs(t)));
    if (v.anhaenge.length) {
      push(h3('Anhänge'));
      push(punkte(v.anhaenge));
    }
    push(h3('Worauf zu achten ist'));
    push(abs(v.hinweis, {italics: true}));
  });

  return k;
}

module.exports = {bloecke};
