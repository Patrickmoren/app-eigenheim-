/* Erzeugt 03_Makler_Formulare – die Formulare F1 bis F9 zum Ausfüllen. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkte, tabelle, info, recht, praxis,
       titelblatt, checks, felder, linien, nrpunkte} = require('../lib/blocks.js');
const F = require('./formulare.js');
const B = require('./bausteine.js');
const {STAND} = require('./handbuch.js');

/* Kopfzeile, die jedes Formular trägt */
const objektkopf = () => felder([
  'Objekt (Strasse, Nr., PLZ, Ort)', 'Objektnummer', 'Parzelle / Grundbuchblatt',
  'Bearbeitung durch', 'Datum']);

/* Leere Tabellenzeilen für Erfassungstabellen */
const leerzeilen = (spalten, anzahl) =>
  Array.from({length: anzahl}, () => Array.from({length: spalten}, () => ''));

function bloecke() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  push(titelblatt({
    marke: 'Makler-Formulare',
    titel: 'Hausverkauf Schweiz',
    untertitel: 'Formulare F1 bis F9 zum Ausfüllen',
    stand: `Fassung vom ${STAND} · Version 1 · Beilage zum Makler-Handbuch`}));

  push(info('Zur Verwendung', [
    'Jedes Formular ist einzeln verwendbar. Ausgefüllte Formulare gehören in den Objektordner gemäss Teil S des Handbuchs.',
    'Die Fundstelle im Handbuch steht unter jedem Formulartitel. Dort stehen die Begründung und die Prüfpunkte.',
    'Platzhalter in eckigen Klammern werden ersetzt. Punktlinien sind Ausfüllfelder.']));
  push(recht([
    'Die Formulare F4 «Kaufangebot», F5 «Entscheidungsvorlage» und F7 «Reservationsbestätigung» sind rechtlich sensibel. Sie sind vor der ersten Verwendung durch das Notariat oder die Rechtsberatung freizugeben und danach unverändert einzusetzen.',
    'Ein Kaufvertrag über ein Grundstück kommt in der Schweiz ausschliesslich durch öffentliche Beurkundung zustande (Art. 216 Abs. 1 OR). Kein Formular in diesem Dokument begründet eine Kaufverpflichtung.']));
  push(leer());
  push(h2('Übersicht'));
  push(tabelle(['Nr.', 'Formular', 'Phase', 'Fundstelle im Handbuch'], [
    ['F1', 'Erstgesprächsprotokoll', '3', 'Teil D'],
    ['F2', 'Interessentenformular', '13–14', 'Teil L2'],
    ['F3', 'Besichtigungscheckliste für den Makler', '14', 'Teil L1'],
    ['F4', 'Kaufangebot Immobilie', '15', 'Teil M'],
    ['F5', 'Angebotsvergleich und Entscheidungsvorlage', '16', 'Teil N'],
    ['F6', 'Notariatscheckliste', '17–19', 'Teil P'],
    ['F7', 'Reservationsbestätigung', '17', 'Teil O'],
    ['F8', 'Inventarliste', '4 und 18', 'Teil Q6'],
    ['F9', 'Übergabeprotokoll', '20', 'Teil Q'],
  ], [700, 4100, 900, 3900]));

  /* ------------------------------------------------------------------- F1 */
  push(h1neu('F1 · Erstgesprächsprotokoll'));
  push(abs('Phase 3 · Fundstelle: Teil D des Handbuchs · Auszufüllen während des Gesprächs, zu vervollständigen am gleichen Tag.'));
  push(objektkopf());
  push(h3('Anwesende'));
  push(felder(['Eigentümer 1 (Name, Geburtsdatum)', 'Eigentümer 2 (Name, Geburtsdatum)',
    'Weitere Anwesende und ihre Rolle', 'Nicht anwesende Verfügungsberechtigte']));
  push(recht([
    'Über einen Verkauf können nur alle Verfügungsberechtigten gemeinsam entscheiden. Fehlt eine Person, ist zu klären, wie ihre Zustimmung beigebracht wird (Art. 602 ZGB, Art. 169 ZGB).']));

  F.ERSTGESPRAECH.forEach(b => {
    push(h3(b.block));
    b.fragen.forEach(f => {
      push(mix([{text: f.frage, bold: true}]));
      push(abs('Hintergrund: ' + f.warum, {italics: true, after: 60}));
      push(linien(2));
    });
  });

  push(h3('Gesamteindruck und Einschätzung des Maklers'));
  push(felder(['Verkaufsabsicht: konkret / Wertneugier',
    'Verfügungsbefugnis geklärt: ja / offen – wenn offen, was fehlt',
    'Preisvorstellung im Verhältnis zur internen Bandbreite',
    'Mandatsempfehlung: annehmen / mit Bedingung / ablehnen',
    'Begründung']));
  push(linien(3));
  push(h3('Vereinbarte nächste Schritte'));
  push(tabelle(['Nr.', 'Schritt', 'Zuständig', 'Frist'],
    [['1', '', '', ''], ['2', '', '', ''], ['3', '', '', ''], ['4', '', '', '']],
    [600, 5000, 2000, 2000]));
  push(leer());
  push(felder(['Ort und Datum', 'Unterschrift Makler']));

  /* ------------------------------------------------------------------- F2 */
  push(h1neu('F2 · Interessentenformular'));
  push(abs('Phase 13 bis 14 · Fundstelle: Teil L2 des Handbuchs · Wird vor Ort vollständig ausgefüllt und unterzeichnet.'));
  push(objektkopf());
  F.INTERESSENTENFORMULAR.forEach(b => {
    push(h3(b.block));
    push(felder(b.felder));
  });
  push(recht([
    'Die Angaben zur Staatsangehörigkeit und zum Ausländerstatus dienen der Prüfung der Bewilligungspflicht nach dem Bundesgesetz über den Erwerb von Grundstücken durch Personen im Ausland (BewG).',
    'Die Angaben werden ausschliesslich zur Abwicklung dieses Kaufinteresses bearbeitet. Es gilt die Datenschutzerklärung, die diesem Formular beiliegt (DSG, SR 235.1).']));

  /* ------------------------------------------------------------------- F3 */
  push(h1neu('F3 · Besichtigungscheckliste für den Makler'));
  push(abs('Phase 14 · Fundstelle: Teil L1 des Handbuchs · Je Besichtigungstermin einmal auszufüllen.'));
  push(objektkopf());
  push(felder(['Interessent', 'Datum und Zeit', 'Anzahl Teilnehmer', 'Stufe (A / B / C)']));
  F.BESICHTIGUNG_CHECKLISTE.forEach(b => {
    push(h3(b.block));
    push(checks(b.punkte));
  });
  push(h3('Besichtigungsprotokoll'));
  push(felder(['Gezeigte Räume – Abweichungen von der vollständigen Führung und Grund',
    'Ausdrücklich angesprochene Mängel (Nachweis der Offenlegung)',
    'Fragen des Interessenten, die nicht abschliessend beantwortet wurden',
    'Schriftlich nachgeliefert am',
    'Reaktion und Preisempfinden des Interessenten',
    'Vereinbarter nächster Schritt mit Datum']));
  push(linien(3));
  push(recht([
    'Der Vermerk der ausdrücklich angesprochenen Mängel ist der Nachweis der Offenlegung. Er trägt die Wegbedingung der Gewährleistung im Kaufvertrag; diese ist ungültig, soweit Mängel arglistig verschwiegen wurden (Art. 199 OR).']));
  push(felder(['Ort und Datum', 'Unterschrift Makler']));

  /* ------------------------------------------------------------------- F4 */
  push(h1neu('F4 · Kaufangebot Immobilie'));
  push(abs('Phase 15 · Fundstelle: Teil M des Handbuchs · Vom Kaufinteressenten auszufüllen und zu unterzeichnen.'));
  push(recht([
    'RECHTLICHE PRÜFUNG ERFORDERLICH – Vor der ersten Verwendung durch das Notariat oder die Rechtsberatung freizugeben und danach unverändert einzusetzen.',
    'Dieses Kaufangebot ist eine unverbindliche Absichtserklärung. Ein Kaufvertrag über ein Grundstück bedarf zu seiner Gültigkeit der öffentlichen Beurkundung (Art. 216 Abs. 1 OR); dasselbe gilt für einen Vorvertrag (Art. 216 Abs. 2 OR).',
    'Dieses Formular enthält bewusst keine Kaufverpflichtung, keine Konventionalstrafe und keine Verfallsklausel. Werden solche Bestimmungen ergänzt, liegt ein formungültiger Vorvertrag vor; er ist nicht durchsetzbar.']));
  push(leer());
  F.KAUFANGEBOT.forEach(b => {
    push(h3(b.block + '  ·  ' + (b.bindung === 'unverbindlich'
      ? 'unverbindliche Absichtserklärung'
      : b.bindung === 'Erklärung' ? 'Erklärung des Kaufinteressenten' : 'Angabe')));
    if (b.bindung === 'Erklärung') push(checks(b.felder));
    else push(felder(b.felder));
  });
  push(h3('Nur durch den Makler auszufüllen'));
  push(felder(['Eingang am (Datum, Uhrzeit)', 'Angebot vollständig: ja / nein – wenn nein, was fehlt',
    'Finanzierungsbestätigung beigelegt: ja / nein',
    'Erwerbsrechtliche Zulässigkeit geklärt: ja / nein / Bewilligung erforderlich',
    'Identifikation nach GwG: offen / erfasst / vollständig',
    'An die Verkäuferschaft weitergeleitet am']));

  /* ------------------------------------------------------------------- F5 */
  push(h1neu('F5 · Angebotsvergleich und Entscheidungsvorlage'));
  push(abs('Phase 16 · Fundstelle: Teil N des Handbuchs · Der Makler stellt dar, die Verkäuferschaft entscheidet.'));
  push(objektkopf());
  push(felder(['Angebotspreis der Vermarktung', 'Tage am Markt',
    'Anfragen / Besichtigungen / Angebote']));
  push(h3('Angebotsvergleich'));
  push(abs('Je Angebot eine Spalte. Alle Angebote nach denselben Kriterien und mit denselben Annahmen.'));
  push(tabelle(['Kriterium', 'Angebot 1', 'Angebot 2', 'Angebot 3'],
    F.ANGEBOTSVERGLEICH.map(c => [c, '', '', '']),
    [3600, 2000, 2000, 2000]));
  push(h3('Nettoerlösrechnung je Angebot'));
  push(abs('Gleiche Annahmen für alle Angebote. Die Annahmen sind unter der Tabelle offenzulegen.'));
  push(tabelle(['Position', 'Angebot 1', 'Angebot 2', 'Angebot 3'], [
    ['Kaufpreis Liegenschaft', '', '', ''],
    ['Kaufpreis Inventar', '', '', ''],
    ['Total', '', '', ''],
    ['./. Hypothekenablösung', '', '', ''],
    ['./. Vorfälligkeitsentschädigung', '', '', ''],
    ['./. Grundstückgewinnsteuer (Schätzung Steueramt)', '', '', ''],
    ['./. Notariats- und Grundbuchgebühren', '', '', ''],
    ['./. Handänderungsabgabe (Anteil Verkäufer)', '', '', ''],
    ['./. Maklerhonorar zzgl. MWST 8,1 %', '', '', ''],
    ['**Geschätzter Nettoerlös', '', '', ''],
  ], [3600, 2000, 2000, 2000]));
  push(felder(['Offengelegte Annahmen der Rechnung', 'Quelle der Steuerschätzung und Datum']));
  push(h3('Abwicklungssicherheit und Risiken'));
  push(tabelle(['Angebot', 'Einschätzung', 'Begründung', 'Wesentliche Risiken'],
    leerzeilen(4, 3), [1200, 1800, 3300, 3300]));
  push(h3('Handlungsmöglichkeiten und ihre Konsequenzen'));
  push(tabelle(['Möglichkeit', 'Konsequenz für Preis', 'Konsequenz für Termin', 'Konsequenz für Risiko'], [
    ['Annahme eines Angebots', '', '', ''],
    ['Gegenangebot', '', '', ''],
    ['Ablehnung', '', '', ''],
    ['Fristverfahren bei mehreren Angeboten', '', '', ''],
  ], [2700, 2300, 2300, 2300]));
  push(info('Grundsatz', [
    'Der Makler legt die Entscheidungsgrundlagen vollständig, vergleichbar und wertungsfrei vor. Er entscheidet nicht über den Verkauf.',
    'Der nachstehende Entscheid ist gleichzeitig der Verhandlungsauftrag an den Makler. Ohne ihn wird nicht verhandelt.']));
  push(h3('Entscheid der Verkäuferschaft'));
  push(checks([
    'Annahme von Angebot Nr. ……',
    'Gegenangebot zu den nachstehenden Konditionen',
    'Ablehnung aller Angebote',
    'Fristverfahren bei mehreren Angeboten, Frist bis ……']));
  push(felder(['Konditionen des Gegenangebots: Kaufpreis',
    'Übergabetermin', 'Inventar', 'Weitere Bedingungen',
    'Rückzugslinie (intern, nicht offenzulegen)',
    'Gültigkeit des Gegenangebots bis']));
  push(felder(['Ort und Datum', 'Unterschrift Verkäuferschaft 1',
    'Unterschrift Verkäuferschaft 2', 'Unterschrift Makler']));

  /* ------------------------------------------------------------------- F6 */
  push(h1neu('F6 · Notariatscheckliste'));
  push(abs('Phase 17 bis 19 · Fundstelle: Teil P des Handbuchs · Vollständigkeit entscheidet über die Dauer bis zur Beurkundung.'));
  push(objektkopf());
  push(felder(['Beauftragtes Notariat', 'Ansprechperson und Kontakt',
    'Auftrag erteilt am', 'Bestätigung des Notariats erhalten am',
    'Beurkundungstermin']));
  push(h3('Vor dem Notariat – zu übermittelnde Angaben und Unterlagen'));
  push(tabelle(['☐', 'Position', 'Was zu übermitteln ist', 'Übermittelt am'],
    F.NOTARIAT_VOR.map(n => ['☐', n.p, n.i, '']),
    [400, 1900, 5300, 2000]));
  push(h3('Prüfung des Vertragsentwurfs durch den Makler'));
  push(checks([
    'Parteien, Eigentumsform und Quoten stimmen mit der Einigung überein',
    'Parzellennummer, Grundbuchblatt und Fläche stimmen mit dem Grundbuchauszug überein',
    'Kaufpreis und Inventarpreis stimmen mit der Einigung überein',
    'Zahlungsmodalitäten sind eindeutig: Beträge, Termine, Konten, Bedingungen der Grundbuchanmeldung',
    'Übergabetermin und Nutzen- und Gefahrenübergang sind eindeutig und voneinander unterschieden',
    'Mängelliste und Inventarliste sind als Vertragsbeilagen aufgenommen',
    'Dienstbarkeiten, Grundlasten und Anmerkungen sind vollständig übernommen',
    'Regelung der Grundstückgewinnsteuer und ihrer Sicherstellung ist enthalten',
    'Mietverhältnisse und ihr Übergang sind geregelt',
    'Erforderliche Bewilligungen und Zustimmungen liegen vor oder sind als Bedingung aufgenommen',
    'Abweichungen wurden dem Notariat schriftlich gemeldet am ……']));
  push(recht([
    'Der Makler prüft den Entwurf gegen die Einigung und gegen die Unterlagen. Er redigiert den Vertrag nicht und erteilt den Parteien keine Rechtsauskunft; rechtliche Fragen gehen an das Notariat oder an eine eigene Rechtsberatung der Partei.']));
  push(h3('Nach dem Notariat'));
  push(tabelle(['☐', 'Position', 'Was zu erledigen und zu kontrollieren ist', 'Erledigt am'],
    F.NOTARIAT_NACH.map(n => ['☐', n.p, n.i, '']),
    [400, 1900, 5300, 2000]));

  /* ------------------------------------------------------------------- F7 */
  push(h1neu('F7 · Reservationsbestätigung'));
  push(abs('Phase 17 · Fundstelle: Teil O des Handbuchs'));
  push(recht([
    'RECHTLICHE PRÜFUNG ERFORDERLICH – Diese Vorlage ist vor jeder Verwendung durch das Notariat oder die Rechtsberatung zu prüfen.',
    'Eine Reservationsvereinbarung über ein Grundstück mit im Voraus bestimmtem Kaufpreis ist ein Vorvertrag im Sinne von Art. 216 Abs. 2 OR und bedarf der öffentlichen Beurkundung. Ohne Beurkundung ist sie formungültig; Konventionalstrafen und Verfallsklauseln sind nicht durchsetzbar, geleistete Zahlungen grundsätzlich zurückzuerstatten.',
    'Diese Bestätigung ist deshalb ausdrücklich als unverbindliche Absichtserklärung ohne Kaufverpflichtung, ohne Konventionalstrafe und ohne Reservationszahlung ausgestaltet. Sie darf nicht um solche Bestimmungen ergänzt werden.']));
  push(leer());
  F.RESERVATION.forEach(r => {
    push(h3(`Ziffer ${r.zi} · ${r.titel}`));
    push(abs(r.inhalt, {after: 80}));
    if (['1', '2', '3', '6', '7'].includes(r.zi)) push(linien(3));
  });
  push(h3('Unterschriften'));
  push(felder(['Ort und Datum',
    'Verkäuferschaft 1', 'Verkäuferschaft 2',
    'Kaufinteressent 1', 'Kaufinteressent 2',
    'Makler']));
  push(abs('Je eine Ausfertigung für die Verkäuferschaft, den Kaufinteressenten und das Objektdossier.', {italics: true}));

  /* ------------------------------------------------------------------- F8 */
  push(h1neu('F8 · Inventarliste'));
  push(abs('Phase 4 und 18 · Fundstelle: Teil Q6 des Handbuchs · Wird Beilage des Kaufvertrags.'));
  push(objektkopf());
  push(info('Zur Verwendung', [
    'Jede Position einzeln aufführen. Sammelbegriffe wie «Gartenmöbel» führen bei der Übergabe zu Streit.',
    'Die Spalte «Bleibt / geht / verhandelbar» wird mit dem Eigentümer bei der Objektaufnahme ausgefüllt und vor der Beurkundung bereinigt.',
    'Der Wertansatz der mitverkauften Positionen wird im Kaufvertrag als Inventarpreis ausgewiesen.']));
  push(tabelle(F.INVENTAR_SPALTEN.map(s => s),
    leerzeilen(F.INVENTAR_SPALTEN.length, 24),
    [500, 1100, 2100, 700, 700, 900, 1500, 1100, 1000]));
  push(felder(['Total Wertansatz mitverkauftes Inventar',
    'Ort und Datum', 'Unterschrift Eigentümer', 'Unterschrift Makler']));

  /* ------------------------------------------------------------------- F9 */
  push(h1neu('F9 · Übergabeprotokoll'));
  push(abs('Phase 20 · Fundstelle: Teil Q des Handbuchs · Erst nach bestätigter Eintragung im Grundbuch und vollständigem Zahlungseingang.'));
  F.UEBERGABE.forEach(b => {
    push(h3(b.block));
    if (b.block.startsWith('4 ·')) {
      push(tabelle(['Zugangsmittel', 'Anzahl übergeben', 'Zylinder- / Kennnummer', 'Bemerkung'],
        b.felder.map(f => [f.replace(/: Anzahl$/, ''), '', '', '']),
        [3400, 1800, 2400, 2000]));
    } else if (b.block.startsWith('5 ·')) {
      push(tabelle(['Zähler', 'Zählernummer', 'Stand', 'Datum', 'Foto'],
        b.felder.map(f => [f.replace(/:.*$/, ''), '', '', '', '']),
        [3000, 2200, 1800, 1600, 1000]));
    } else if (b.block.startsWith('6 ·')) {
      push(tabelle(['Nr.', 'Position', 'Anzahl', 'Zustand', 'Bemerkung'],
        leerzeilen(5, 12), [600, 3800, 1200, 1600, 2400]));
      push(checks(['Übereinstimmung mit der Inventarliste des Kaufvertrags']));
      push(felder(['Abweichungen und Vereinbarung dazu']));
    } else if (b.block.startsWith('7 ·')) {
      push(tabelle(['☐', 'Dokument', 'Übergeben', 'Bemerkung'],
        b.felder.filter(f => !f.startsWith('Empfang')).map(f => ['☐', f, '', '']),
        [400, 4200, 1400, 3600]));
      push(checks(['Empfang aller vorstehenden Dokumente bestätigt']));
    } else if (b.block.startsWith('9 ·')) {
      push(tabelle(['Nr.', 'Offener Punkt', 'Zuständig', 'Frist', 'Erledigt am'],
        leerzeilen(5, 8), [600, 4200, 1600, 1600, 1600]));
    } else if (b.block.startsWith('11 ·')) {
      push(abs('Die Parteien bestätigen mit ihrer Unterschrift die Richtigkeit und Vollständigkeit dieses Protokolls.'));
      push(felder(['Ort und Datum', 'Verkäuferschaft 1', 'Verkäuferschaft 2',
        'Käuferschaft 1', 'Käuferschaft 2', 'Makler']));
      push(checks(['Je eine Ausfertigung an jede Partei übergeben; eine Ausfertigung bleibt im Objektdossier']));
    } else {
      push(felder(b.felder));
    }
  });

  return k;
}

module.exports = {bloecke};
