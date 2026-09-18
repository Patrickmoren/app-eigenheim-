/* Erzeugt die fünf Arbeitsmappen 02, 06, 07, 08 und 09. */
const T = require('../lib/tabellen.js');
const {mappe, blatt, zeilen, leerzeilen, spalteVon, zeileVon,
       STATUS, PFLICHT, JANEIN, ZUSTAND, ROLLE} = T;

const {PHASEN}    = require('./phasen.js');
const {DOKUMENTE} = require('./dokumente.js');
const {AUFNAHME}  = require('./objektaufnahme.js');
const {ABSCHLUSS} = require('./abschluss.js');
const B           = require('./bausteine.js');
const BW          = require('./bewertung.js');
const {posten: rechtsposten} = require('./recht.js');
const {GATES}    = require('./gates.js');
const {KONTROLLEN} = require('./kontrollen.js');
const {ZUSATZ}   = require('./phasen-v2.js');
const SF         = require('./sonderfaelle.js');
const ST         = require('./stoerungen.js');
const KF         = require('./kaeufer.js');
const PR         = require('./preis.js');
const CRMV       = require('./crm.js');

const HW = 'Gelb hinterlegte Spalten sind Eingabefelder. Auswahlfelder haben eine Liste. Die Spalte «Register» verweist auf Teil W des Makler-Handbuchs.';

/* Blatt «Objekt» – Kopfdaten, das erste Blatt jeder Mappe */
function objektblatt(wb, titel) {
  const ws = blatt(wb, 'Objekt', titel, [
    {kopf: 'Feld', breite: 34},
    {kopf: 'Eintrag', breite: 46, eingabe: true},
    {kopf: 'Hinweis', breite: 52},
  ], {hinweis: HW, orientation: 'portrait'});
  zeilen(ws, [
    {gruppe: 'Objekt'},
    ['Objektnummer intern', '', 'Aus dem CRM'],
    ['Strasse und Hausnummer', '', ''],
    ['PLZ und Ort', '', ''],
    ['Gemeinde', '', ''],
    ['Kanton', '', 'Bestimmt Notariatssystem, Steuern, Gebühren und GEAK-Pflicht'],
    ['Parzellennummer', '', 'Aus Grundbuchauszug'],
    ['Grundbuchblatt', '', 'Aus Grundbuchauszug'],
    ['Objekttyp', '', ''],
    {gruppe: 'Eigentümerschaft'},
    ['Eigentümer 1', '', ''],
    ['Eigentümer 2', '', ''],
    ['Eigentumsform', '', 'Allein-, Mit-, Gesamteigentum, Stockwerkeigentum, Baurecht'],
    ['Alle Verfügungsberechtigten bekannt', '', 'Register R13, R14'],
    {gruppe: 'Mandat'},
    ['Zuständiger Makler', '', ''],
    ['Mandat unterzeichnet am', '', ''],
    ['Mandat läuft bis', '', ''],
    ['Angebotspreis CHF', '', ''],
    ['Mindestpreis CHF (intern)', '', 'Wird keinem Interessenten genannt'],
    ['Identifikation GwG abgeschlossen', '', 'Register R37; vor Vermarktungsstart'],
    {gruppe: 'Termine'},
    ['Vermarktungsstart', '', 'Startpunkt der Zählung «Tage am Markt»'],
    ['Beurkundungstermin', '', ''],
    ['Eintragung im Grundbuch', '', ''],
    ['Übergabetermin', '', ''],
    {gruppe: 'Kantonale Abklärungen'},
    ['Notariatssystem und zuständiges Notariat', '', 'Register R1'],
    ['Handänderungssteuer: Höhe und Kostenträger', '', 'Register R26'],
    ['Grundstückgewinnsteuer: Stelle und Frist', '', 'Register R22'],
    ['GEAK-Pflicht im Kanton', '', 'Obligatorisch in FR, VD, NE, JU; Register R33'],
    ['Formerfordernis Vollmachten', '', 'Register R16'],
  ]);
  /* Feste Bezuege auf Kopfdaten, aus den Beschriftungen abgeleitet */
  ws.__bezug = bez => `Objekt!$B$${zeileVon(ws, bez)}`;
  return ws;
}

/* ------------------------------------------------- 02 Makler-Checklisten */
function checklisten() {
  const wb = mappe();
  objektblatt(wb, '02 · Makler-Checklisten – Objektkopf');

  /* Phasen */
  const p1 = blatt(wb, 'Phasen', '02 · Phasenübersicht und Abschlusskriterien', [
    {kopf: 'Phase', breite: 7}, {kopf: 'Bezeichnung', breite: 34},
    {kopf: 'Verantwortung', breite: 20}, {kopf: 'Tage', breite: 8},
    {kopf: 'Meilenstein', breite: 52},
    {kopf: 'Status', breite: 13, validierung: STATUS, eingabe: true},
    {kopf: 'Begonnen am', breite: 13, eingabe: true},
    {kopf: 'Abgeschlossen am', breite: 15, eingabe: true},
    {kopf: 'Bemerkung', breite: 32, eingabe: true},
    {kopf: 'Gate', breite: 14},
    {kopf: 'CRM-Status', breite: 20},
    {kopf: 'Register', breite: 22},
  ], {hinweis: HW, xSplit: 2});
  zeilen(p1, PHASEN.map(p => {
    const z = ZUSATZ[p.nr];
    return [p.nr, p.name, p.verantwortung, p.dauer, p.ergebnis, 'offen', '', '', '',
      z.gates.length ? z.gates.map(g => 'GATE ' + g).join(', ') : '—',
      z.crm.status, p.recht.join(', ') || '—'];
  }));

  /* Abschlusskriterien je Phase */
  const p2 = blatt(wb, 'Abschlusskriterien', '02 · Abschlusskriterien je Phase – erst erfüllen, dann weitergehen', [
    {kopf: 'Phase', breite: 7}, {kopf: 'Bezeichnung', breite: 30},
    {kopf: 'Kriterium', breite: 74},
    {kopf: 'Erfüllt', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Datum', breite: 12, eingabe: true},
    {kopf: 'Bemerkung', breite: 34, eingabe: true},
  ], {hinweis: HW, xSplit: 2});
  const kz = [];
  PHASEN.forEach(p => p.weiter.forEach(w => kz.push([p.nr, p.name, w, 'offen', '', ''])));
  zeilen(p2, kz);

  /* Aufgaben und Prüfungen je Phase */
  const p3 = blatt(wb, 'Aufgaben', '02 · Aufgaben und Prüfungen je Phase', [
    {kopf: 'Phase', breite: 7}, {kopf: 'Art', breite: 22},
    {kopf: 'Aufgabe bzw. Prüfung', breite: 94},
    {kopf: 'Status', breite: 12, validierung: STATUS, eingabe: true},
    {kopf: 'Zuständig', breite: 16, eingabe: true},
    {kopf: 'Frist', breite: 12, eingabe: true},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
  ], {hinweis: HW, xSplit: 1});
  const az = [];
  PHASEN.forEach(p => {
    az.push({gruppe: `Phase ${p.nr} · ${p.name}`});
    p.makler.forEach(t => az.push([p.nr, 'Aufgabe Makler', t, 'offen', '', '', '']));
    p.eigentuemer.forEach(t => az.push([p.nr, 'Aufgabe Eigentümer', t, 'offen', '', '', '']));
    p.pruefungen.forEach(t => az.push([p.nr, 'Prüfung', t, 'offen', '', '', '']));
    p.kommunikation.forEach(t => az.push([p.nr, 'Kommunikation', t, 'offen', '', '', '']));
    ZUSATZ[p.nr].entscheidungen.forEach(t => az.push([p.nr, 'Entscheidung', t, 'offen', '', '', '']));
    ZUSATZ[p.nr].risiken.forEach(t => az.push([p.nr, 'Risiko', t, 'offen', '', '', '']));
    ZUSATZ[p.nr].stop.forEach(t => az.push([p.nr, 'Stop-Kriterium', t, 'offen', '', '', '']));
    ZUSATZ[p.nr].dokumentation.forEach(t => az.push([p.nr, 'Dokumentation', t, 'offen', '', '', '']));
  });
  zeilen(p3, az);

  /* Dokumente A–E */
  const p4 = blatt(wb, 'Dokumente', '02 · Dokumenten-Checkliste, Gruppen A bis E', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Unterlage', breite: 40},
    {kopf: 'Stufe', breite: 18, validierung: PFLICHT},
    {kopf: 'Beschafft durch', breite: 15, validierung: ROLLE},
    {kopf: 'Bezugsquelle', breite: 26},
    {kopf: 'Hinweis', breite: 62},
    {kopf: 'Status', breite: 12, validierung: STATUS, eingabe: true},
    {kopf: 'Bestellt am', breite: 12, eingabe: true},
    {kopf: 'Erhalten am', breite: 12, eingabe: true},
    {kopf: 'Dokumentdatum', breite: 14, eingabe: true},
    {kopf: 'Ablage', breite: 22, eingabe: true},
    {kopf: 'Register', breite: 12},
  ], {hinweis: HW + ' In «Ablage» der Dateiname nach Teil S des Handbuchs.', xSplit: 2});
  const dz = [];
  DOKUMENTE.forEach(d => {
    if (d.g) { dz.push({gruppe: d.g}); return; }
    dz.push([d.nr, d.dok, d.stufe, d.wer, d.quelle, d.bemerkung,
      'offen', '', '', '', '', d.recht || '—']);
  });
  zeilen(p4, dz);

  /* Vermarktung: Fotografie und Kanäle */
  const p5 = blatt(wb, 'Vermarktung', '02 · Vermarktungscheckliste: Vorbereitung, Bilder, Kanäle', [
    {kopf: 'Bereich', breite: 24}, {kopf: 'Position', breite: 74},
    {kopf: 'Erledigt', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Datum', breite: 12, eingabe: true},
    {kopf: 'Bemerkung', breite: 34, eingabe: true},
  ], {hinweis: HW});
  const vz = [];
  vz.push({gruppe: 'Vorbereitung durch den Eigentümer, zwei Wochen vor dem Fototermin'});
  B.FOTO_VORBEREITUNG.forEach(t => vz.push(['Vorbereitung', t, 'offen', '', '']));
  vz.push({gruppe: 'Zwingende Aufnahmen'});
  B.FOTO_PFLICHT.forEach(t => vz.push(['Aufnahme', t, 'offen', '', '']));
  vz.push({gruppe: 'Bildreihenfolge im Inserat'});
  B.FOTO_REIHENFOLGE.forEach(t => vz.push(['Reihenfolge', t, 'offen', '', '']));
  vz.push({gruppe: 'Zusatzleistungen – beauftragt oder bewusst nicht'});
  B.FOTO_ZUSATZ.forEach(z => vz.push(['Zusatzleistung', z.leistung + ' – ' + z.wann, 'offen', '', '']));
  vz.push({gruppe: 'Inseratsabschnitte'});
  B.INSERAT_ABSCHNITTE.forEach(a => vz.push(['Inserat', a.t + ': ' + a.v, 'offen', '', '']));
  vz.push({gruppe: 'Kanäle'});
  B.INSERAT_KANAELE.forEach(kk => vz.push(['Kanal', kk.kanal + ' – ' + kk.hinweis, 'offen', '', '']));
  zeilen(p5, vz);

  /* Gates */
  const pg = blatt(wb, 'Gates', '02 · Quality Gates – Freigabeprotokoll', [
    {kopf: 'Gate', breite: 7}, {kopf: 'Bezeichnung', breite: 24},
    {kopf: 'Nach Phase', breite: 10}, {kopf: 'Kriterium', breite: 80},
    {kopf: 'Erfüllt', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Prüfer', breite: 24}, {kopf: 'Geprüft am', breite: 12, eingabe: true},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
  ], {hinweis: 'Ein Gate wird freigegeben, mit Bedingung freigegeben oder verweigert. Über ein Stop-Kriterium kann nicht bedingt freigegeben werden. Stop-Kriterien stehen im Blatt Stop-Kriterien.', xSplit: 2});
  const gz = [];
  GATES.forEach(g => {
    gz.push({gruppe: `GATE ${g.nr} · ${g.name} – nach Phase ${g.nachPhase} · Prüfer: ${g.pruefer} · Nachweis: ${g.nachweis}`});
    g.kriterien.forEach(k2 => gz.push([g.nr, g.name, g.nachPhase, k2, 'offen', g.pruefer, '', '']));
  });
  zeilen(pg, gz);

  const ps2 = blatt(wb, 'Stop-Kriterien', '02 · Stop-Kriterien je Gate – keine bedingte Freigabe möglich', [
    {kopf: 'Gate', breite: 7}, {kopf: 'Bezeichnung', breite: 24},
    {kopf: 'Stop-Kriterium', breite: 80},
    {kopf: 'Liegt vor', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Eskalation', breite: 60},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
  ], {hinweis: 'Liegt ein Stop-Kriterium vor, wird das Gate verweigert, der Prozess angehalten, der Eigentümer informiert und die Eskalation ausgelöst.', xSplit: 2});
  const sz2 = [];
  GATES.forEach(g => g.stop.forEach(x => sz2.push([g.nr, g.name, x, 'nein', g.eskalation, ''])));
  zeilen(ps2, sz2);

  /* Vier-Augen-Kontrollen */
  const pk = blatt(wb, 'Kontrollen', '02 · Vier-Augen-Kontrollpunkte', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Kontrollpunkt', breite: 26},
    {kopf: 'Phase', breite: 8}, {kopf: 'Gate', breite: 9},
    {kopf: 'Erstellt durch', breite: 24}, {kopf: 'Kontrolliert durch', breite: 30},
    {kopf: 'Prüfgegenstand', breite: 80}, {kopf: 'Nachweis', breite: 40},
    {kopf: 'Ergebnis', breite: 22,
     validierung: ['freigegeben', 'freigegeben mit Auflage', 'zurückgewiesen'], eingabe: true},
    {kopf: 'Kontrolliert am', breite: 13, eingabe: true},
    {kopf: 'Durch', breite: 20, eingabe: true},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
  ], {hinweis: 'Der Kontrollierende ist nie der Erstellende. Kontrolliert wird gegen die Quelle, nicht gegen die Plausibilität. Ohne Vermerk gilt die Kontrolle als nicht erfolgt.', xSplit: 2});
  zeilen(pk, KONTROLLEN.map(c => [c.nr, c.punkt, c.phase, c.gate ? 'GATE ' + c.gate : '—',
    c.erstellt, c.kontrolliert, c.gegenstand, c.nachweis, 'offen', '', '', '']));

  /* Rechtsgrundlagen als Nachschlageblatt */
  const p6 = blatt(wb, 'Register', '02 · Rechtsgrundlagen-Register (Teil W des Handbuchs)', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Thema', breite: 34},
    {kopf: 'Rechtsgrundlage', breite: 40}, {kopf: 'Kerninhalt', breite: 62},
    {kopf: 'Umsetzung in der Praxis', breite: 68},
    {kopf: 'Kennzeichen', breite: 14},
  ], {hinweis: 'Rechtsstand 18. September 2026. Vor jeder Mandatsausfertigung auf Aktualität prüfen. [RP] rechtliche Prüfung erforderlich · [KA] kantonal unterschiedlich · [GW] geldwäschereirechtlich relevant.'});
  zeilen(p6, rechtsposten().map(r => [r.k, r.thema, r.grundlage, r.kern, r.praxis,
    (r.flag || '').split(' ').filter(Boolean).map(f => '[' + f + ']').join(' ') || '—']));

  return wb;
}

/* ------------------------------------- 06 Interessentenmanagement und CRM */
function interessenten() {
  const wb = mappe();
  const wo = objektblatt(wb, '06 · Interessentenmanagement – Objektkopf');
  const PREIS = wo.__bezug('Angebotspreis CHF');
  const START = wo.__bezug('Vermarktungsstart');

  const ws = blatt(wb, 'Interessenten', '06 · CRM-Liste der Kaufinteressenten',
    B.CRM_FELDER.map(c => ({
      kopf: c.feld,
      breite: c.art === 'Text' ? 24 : c.art === 'Datum' ? 13 : c.art === 'CHF' ? 15 : 17,
      eingabe: true,
      format: c.art === 'CHF' ? '#,##0' : undefined,
      validierung:
        c.feld === 'Finanzierung vorhanden' ? ['nein', 'in Abklärung', 'Selbstauskunft', 'schriftliche Bestätigung'] :
        c.feld === 'Interesse' ? ['hoch', 'mittel', 'gering', 'keines'] :
        c.feld === 'Stufe' ? KF.FUNNEL.map(f => f.st + ' ' + f.name) :
        c.feld === 'Angebot' ? ['nein', 'angekündigt', 'eingegangen', 'zurückgezogen'] :
        c.feld === 'Finanzierungsnachweis' ? ['fehlt', 'Selbstauskunft', 'Bankbestätigung objektbezogen'] :
        c.feld === 'Identifikation GwG' ? ['offen', 'erfasst', 'vollständig dokumentiert'] :
        c.feld === 'Status' ? ['neu', 'qualifiziert', 'Besichtigung terminiert', 'besichtigt',
          'Angebot', 'Verhandlung', 'Reservation', 'abgeschlossen', 'abgesagt'] :
        c.feld === 'Absagegrund' ? ['Preis', 'Lage', 'Zustand', 'Grösse', 'Finanzierung',
          'Zeitpunkt', 'anderes Objekt', 'Lärm', 'Sanierungsbedarf', 'kein Grund genannt'] :
        c.feld === 'Quelle' ? ['Portal', 'Website', 'Newsletter', 'Empfehlung', 'Schild', 'Direktkontakt'] :
        c.feld === 'Aktuelle Wohnsituation' ? ['Miete', 'Eigentum mit Verkaufsbedarf', 'Eigentum ohne Verkaufsbedarf'] :
        undefined,
    })), {hinweis: 'Eine Zeile je Interessent. Feld «Datenschutz: Löschfrist» ist ein Pflichtfeld (Register R39). Erwerbsrechtliche Zulässigkeit vor der Terminvergabe klären (R34).', xSplit: 3});
  leerzeilen(ws, 60);

  /* Feldbeschreibung */
  const wf = blatt(wb, 'Feldbeschreibung', '06 · Bedeutung der CRM-Felder', [
    {kopf: 'Feld', breite: 34}, {kopf: 'Art', breite: 14}, {kopf: 'Zweck', breite: 86},
  ], {hinweis: 'Fundstelle: Teil K3 des Makler-Handbuchs.', orientation: 'portrait'});
  zeilen(wf, B.CRM_FELDER.map(c => [c.feld, c.art, c.zweck]));

  /* Besichtigungsjournal */
  const wb2 = blatt(wb, 'Besichtigungen', '06 · Besichtigungsjournal', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Datum', breite: 13, eingabe: true},
    {kopf: 'Zeit', breite: 9, eingabe: true},
    {kopf: 'Interessent', breite: 26, eingabe: true},
    {kopf: 'Stufe', breite: 8, validierung: ['A', 'B', 'C'], eingabe: true},
    {kopf: 'Teilnehmer', breite: 11, eingabe: true},
    {kopf: 'Erstbesichtigung / Zweitbesichtigung', breite: 20,
     validierung: ['Erstbesichtigung', 'Zweitbesichtigung', 'weitere'], eingabe: true},
    {kopf: 'Interessentenformular vollständig', breite: 16, validierung: JANEIN, eingabe: true},
    {kopf: 'Mängel offengelegt und protokolliert', breite: 17, validierung: JANEIN, eingabe: true},
    {kopf: 'Preisempfinden', breite: 22, eingabe: true},
    {kopf: 'Rückmeldung erhalten am', breite: 16, eingabe: true},
    {kopf: 'Ergebnis', breite: 20,
     validierung: ['Kaufinteresse', 'noch offen', 'Absage'], eingabe: true},
    {kopf: 'Absagegrund', breite: 20, eingabe: true},
    {kopf: 'Nächste Aktion', breite: 26, eingabe: true},
  ], {hinweis: 'Der Vermerk «Mängel offengelegt und protokolliert» ist der Nachweis der Offenlegung (Register R10, R11).', xSplit: 4});
  leerzeilen(wb2, 50);

  /* Angebote */
  const wa = blatt(wb, 'Angebote', '06 · Eingegangene Kaufangebote', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Eingang Datum', breite: 14, eingabe: true},
    {kopf: 'Eingang Zeit', breite: 11, eingabe: true},
    {kopf: 'Kaufinteressent', breite: 26, eingabe: true},
    {kopf: 'Angebot Liegenschaft CHF', breite: 17, format: '#,##0', eingabe: true},
    {kopf: 'Angebot Inventar CHF', breite: 15, format: '#,##0', eingabe: true},
    {kopf: 'Total CHF', breite: 15, format: '#,##0'},
    {kopf: 'Abweichung zum Angebotspreis', breite: 16, format: '0.0%'},
    {kopf: 'Finanzierungsnachweis', breite: 22,
     validierung: ['fehlt', 'Selbstauskunft', 'Bankbestätigung objektbezogen'], eingabe: true},
    {kopf: 'Harte Eigenmittel CHF', breite: 16, format: '#,##0', eingabe: true},
    {kopf: 'Bedingungen und Vorbehalte', breite: 30, eingabe: true},
    {kopf: 'Gewünschter Übergabetermin', breite: 16, eingabe: true},
    {kopf: 'Bewilligung erforderlich', breite: 14, validierung: JANEIN, eingabe: true},
    {kopf: 'Identifikation GwG', breite: 15,
     validierung: ['offen', 'erfasst', 'vollständig dokumentiert'], eingabe: true},
    {kopf: 'Gültig bis', breite: 13, eingabe: true},
    {kopf: 'Abschlusswahrscheinlichkeit', breite: 16,
     validierung: ['hoch', 'mittel', 'gering'], eingabe: true},
    {kopf: 'Entscheid der Verkäuferschaft', breite: 22,
     validierung: ['offen', 'angenommen', 'Gegenangebot', 'abgelehnt'], eingabe: true},
    {kopf: 'Entscheid am', breite: 13, eingabe: true},
  ], {hinweis: 'Die Spalten «Total» und «Abweichung» rechnen selbst. Angebotspreis der Vermarktung wird dem Blatt Objekt entnommen.', xSplit: 4});
  const aLiegenschaft = spalteVon(wa, 'Angebot Liegenschaft CHF');
  const aInventar     = spalteVon(wa, 'Angebot Inventar CHF');
  const aTotal        = spalteVon(wa, 'Total CHF');
  const azn = [];
  for (let i = 0; i < 12; i++) {
    const r = i + 4;   // Datenzeilen beginnen in Zeile 4
    azn.push([i + 1, '', '', '', '', '',
      `=IF(${aLiegenschaft}${r}="","",${aLiegenschaft}${r}+N(${aInventar}${r}))`,
      `=IF(OR(${aTotal}${r}="",${PREIS}=""),"",${aTotal}${r}/${PREIS}-1)`,
      '', '', '', '', '', '', '', '', 'offen', '']);
  }
  zeilen(wa, azn);

  /* Funnel als Nachschlageblatt */
  const wfu = blatt(wb, 'Funnel', '06 · Neunstufiger Käuferfunnel', [
    {kopf: 'Stufe', breite: 7}, {kopf: 'Bezeichnung', breite: 26},
    {kopf: 'Definition', breite: 50}, {kopf: 'Übergangskriterium', breite: 60},
    {kopf: 'Aktion', breite: 44}, {kopf: 'Pflichtdaten', breite: 44},
    {kopf: 'Abbruchgrund', breite: 40},
  ], {hinweis: 'Eine Stufe wird nur mit belegtem Kriterium gesetzt. Rückstufungen sind normal und werden dokumentiert. Ab Stufe 3 vollständiges Dossier, ab Stufe 7 Namensnennung gegenüber dem Eigentümer.'});
  zeilen(wfu, KF.FUNNEL.map(f => [f.st, f.name, f.def, f.kriterium, f.aktion, f.daten, f.abbruch]));

  /* Preisindikatoren */
  const wpi = blatt(wb, 'Preisindikatoren', '06 · Marktindikatoren für die Preissteuerung', [
    {kopf: 'Indikator', breite: 34}, {kopf: 'Erhebung', breite: 40},
    {kopf: 'Aussage', breite: 56},
    {kopf: 'Woche 1', breite: 11, eingabe: true}, {kopf: 'Woche 2', breite: 11, eingabe: true},
    {kopf: 'Woche 3', breite: 11, eingabe: true}, {kopf: 'Woche 4', breite: 11, eingabe: true},
    {kopf: 'Kumuliert', breite: 12, eingabe: true},
    {kopf: 'Auslösekriterium erreicht', breite: 16, validierung: JANEIN, eingabe: true},
  ], {hinweis: 'Kein Indikator wird allein interpretiert. Eine Preisreduktion ist nie die erste Massnahme und niemals eine Folge des Zeitablaufs. Entscheidungslogiken P1 bis P8 im Blatt Preislogik.'});
  zeilen(wpi, PR.INDIKATOREN.map(i => [i.i, i.erhebung, i.aussage, '', '', '', '', '', 'nein']));

  const wpl = blatt(wb, 'Preislogik', '06 · Entscheidungslogik Preissteuerung P1 bis P8', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Situation', breite: 34},
    {kopf: 'WENN', breite: 50}, {kopf: 'Interpretation', breite: 56},
    {kopf: 'DANN', breite: 60}, {kopf: 'SONST', breite: 50},
    {kopf: 'NIE', breite: 50},
    {kopf: 'Trifft zu', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Massnahme und Datum', breite: 30, eingabe: true},
  ], {hinweis: 'Vor jeder Preisempfehlung die zutreffende Logik bestimmen und die Ursachenanalyse dokumentieren (Kontrollpunkt K3).', xSplit: 2});
  zeilen(wpl, PR.STEUERUNG.map(x => [x.nr, x.situation, x.wenn, x.interpretation, x.dann, x.sonst, x.nie, 'nein', '']));

  /* Objektpipeline */
  const wop = blatt(wb, 'Objektpipeline', '06 · Objektstatus im CRM', [
    {kopf: 'Status', breite: 24}, {kopf: 'Phase', breite: 10},
    {kopf: 'Bedeutung', breite: 56}, {kopf: 'Pflichtfelder', breite: 50},
    {kopf: 'Aktuell', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Seit', breite: 12, eingabe: true},
  ], {hinweis: 'Genau ein Status ist aktuell. Bei «Verloren» ist der Verlustgrund zu erfassen.', orientation: 'portrait'});
  zeilen(wop, CRMV.OBJEKTSTATUS.map(o => [o.st, o.phase, o.bedeutung, o.pflichtfeld, 'nein', '']));

  /* Controlling-Dashboard */
  const wd = blatt(wb, 'Controlling', '06 · Controlling-Dashboard', [
    {kopf: 'Kennzahl', breite: 34}, {kopf: 'Wert', breite: 16, eingabe: true},
    {kopf: 'Definition', breite: 56},
    {kopf: 'Orientierung und Handlungsauslöser', breite: 56},
  ], {hinweis: 'Wöchentlich aktualisieren. Berechnete Felder ziehen aus den Blättern Interessenten, Besichtigungen und Angebote.', orientation: 'portrait'});
  /* Bereiche aus den Spaltenbeschriftungen ableiten, damit die Formeln
     beim Umsortieren der Spalten gueltig bleiben. */
  const I = k2 => `Interessenten!${spalteVon(ws, k2)}4:${spalteVon(ws, k2)}400`;
  const BE = k2 => `Besichtigungen!${spalteVon(wb2, k2)}4:${spalteVon(wb2, k2)}200`;
  const AN = k2 => `Angebote!${spalteVon(wa, k2)}4:${spalteVon(wa, k2)}200`;
  const rName = I('Name'), rStufe = I('Stufe'), rStatus = I('Status');
  const rBes = BE('Interessent'), rArt = BE('Erstbesichtigung / Zweitbesichtigung');
  const rAngLie = AN('Angebot Liegenschaft CHF'), rAngTot = AN('Total CHF');
  const formel = {
    'Anzahl Interessenten': `=COUNTA(${rName})`,
    /* Qualifiziert ist ab Funnelstufe 3; die Stufen stehen als «3 Bezeichnung» im Feld */
    'Anzahl qualifizierte Interessenten':
      '=' + KF.FUNNEL.filter(f => f.st >= 3)
        .map(f => `COUNTIF(${rStufe},"${f.st} ${f.name}")`).join('+'),
    'Anzahl verhandlungsfähige Interessenten':
      '=' + KF.FUNNEL.filter(f => f.st >= 7)
        .map(f => `COUNTIF(${rStufe},"${f.st} ${f.name}")`).join('+'),
    'Anzahl Besichtigungen': `=COUNTA(${rBes})`,
    'Anzahl Zweitbesichtigungen': `=COUNTIF(${rArt},"Zweitbesichtigung")`,
    'Anzahl Absagen': `=COUNTIF(${rStatus},"abgesagt")`,
    'Anzahl Angebote': `=COUNT(${rAngLie})`,
    'Durchschnittlicher Angebotspreis': `=IF(COUNT(${rAngTot})=0,"",AVERAGE(${rAngTot}))`,
    'Höchstes Angebot': `=IF(COUNT(${rAngTot})=0,"",MAX(${rAngTot}))`,
    'Tage am Markt': `=IF(${START}="","",TODAY()-${START})`,
    'Quote Anfrage zu Besichtigung': `=IF(COUNTA(${rName})=0,"",COUNTA(${rBes})/COUNTA(${rName}))`,
    'Quote Besichtigung zu Angebot': `=IF(COUNTA(${rBes})=0,"",COUNT(${rAngLie})/COUNTA(${rBes}))`,
    'Abweichung zum Angebotspreis': `=IF(OR(COUNT(${rAngTot})=0,${PREIS}=""),"",MAX(${rAngTot})/${PREIS}-1)`,
  };
  zeilen(wd, B.KENNZAHLEN.map(z => [z.k, formel[z.k] || '', z.def, z.ziel]));

  /* Absagegründe */
  const wg = blatt(wb, 'Absagegruende', '06 · Verteilung der Absagegründe', [
    {kopf: 'Grund', breite: 30}, {kopf: 'Anzahl', breite: 12},
    {kopf: 'Bemerkung', breite: 70, eingabe: true},
  ], {hinweis: 'Häufung bei «Preis» ab fünf Nennungen: Preisgespräch mit dem Eigentümer ansetzen (Teil U des Handbuchs).', orientation: 'portrait'});
  const gruende = ['Preis', 'Lage', 'Zustand', 'Grösse', 'Finanzierung', 'Zeitpunkt',
    'anderes Objekt', 'Lärm', 'Sanierungsbedarf', 'kein Grund genannt'];
  const rGrund = I('Absagegrund');
  zeilen(wg, gruende.map((g, i) => [g, `=COUNTIF(${rGrund},A${i + 4})`, '']));

  return wb;
}

/* ------------------------------------------------- 07 Objektaufnahme */
function objektaufnahme() {
  const wb = mappe();
  objektblatt(wb, '07 · Objektaufnahme – Objektkopf');

  const ws = blatt(wb, 'Aufnahme', '07 · Objektaufnahme, 16 Blöcke', [
    {kopf: 'Block', breite: 30}, {kopf: 'Feld', breite: 44},
    {kopf: 'Erfassung', breite: 16},
    {kopf: 'Eintrag', breite: 40, eingabe: true},
    {kopf: 'Hinweis', breite: 60},
    {kopf: 'Status', breite: 14, validierung: ['erfasst', 'zu klären', 'entfällt'], eingabe: true},
  ], {hinweis: 'Jedes Feld ausfüllen. Ein offenes Feld wird mit «zu klären» markiert und in die Liste der offenen Punkte übernommen – ein leeres Feld ist kein Ergebnis.', xSplit: 2});
  const az = [];
  AUFNAHME.forEach(b => {
    az.push({gruppe: b.block});
    b.felder.forEach(f => az.push([b.block, f.feld,
      Array.isArray(f.art) ? 'Auswahl' : f.art === 'm2' ? 'm²' : f.art === 'm3' ? 'm³' : f.art,
      '', f.hinweis, '']));
  });
  zeilen(ws, az);

  /* Raumliste */
  const wr = blatt(wb, 'Raumliste', '07 · Räume, eine Zeile je Raum', [
    {kopf: 'Nr.', breite: 7, eingabe: true},
    {kopf: 'Geschoss', breite: 18,
     validierung: ['Untergeschoss', 'Erdgeschoss', '1. Obergeschoss', '2. Obergeschoss',
       'Dachgeschoss', 'Aussenbereich', 'Nebengebäude'], eingabe: true},
    {kopf: 'Raumbezeichnung', breite: 24, eingabe: true},
    {kopf: 'Nummer im Plan', breite: 13, eingabe: true},
    {kopf: 'Fläche m²', breite: 11, format: '#,##0.0', eingabe: true},
    {kopf: 'Bodenbelag', breite: 20, eingabe: true},
    {kopf: 'Jahr Bodenbelag', breite: 13, eingabe: true},
    {kopf: 'Fenster: Anzahl und Ausrichtung', breite: 22, eingabe: true},
    {kopf: 'Heizkörper / Bodenheizung', breite: 18, eingabe: true},
    {kopf: 'Zustand', breite: 18, validierung: ZUSTAND, eingabe: true},
    {kopf: 'Mangel / Bemerkung', breite: 34, eingabe: true},
  ], {hinweis: 'Alle Räume erfassen, auch Keller, Estrich, Technikraum, Garage und Nebengebäude.', xSplit: 3});
  leerzeilen(wr, 34);

  /* Mängel */
  const wm = blatt(wb, 'Maengel', '07 · Mängelliste – Grundlage der Offenlegung', [
    {kopf: 'Nr.', breite: 7, eingabe: true},
    {kopf: 'Raum / Bauteil', breite: 24, eingabe: true},
    {kopf: 'Mangel', breite: 50, eingabe: true},
    {kopf: 'Seit wann bekannt', breite: 15, eingabe: true},
    {kopf: 'Bereits behoben', breite: 13, validierung: JANEIN, eingabe: true},
    {kopf: 'Geschätzte Behebungskosten CHF', breite: 18, format: '#,##0', eingabe: true},
    {kopf: 'Quelle der Angabe', breite: 22,
     validierung: ['Eigentümer', 'Feststellung Makler', 'Fachperson', 'Unterlagen'], eingabe: true},
    {kopf: 'Im Dossier offengelegt', breite: 15, validierung: JANEIN, eingabe: true},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
  ], {hinweis: 'Vom Eigentümer zu bestätigen und zu unterzeichnen. Die Wegbedingung der Gewährleistung im Kaufvertrag ist ungültig, soweit Mängel arglistig verschwiegen wurden (Art. 199 OR, Register R10). Behobene Mängel ebenfalls aufführen.'});
  leerzeilen(wm, 26);

  /* Offene Punkte */
  const wo = blatt(wb, 'Offene Punkte', '07 · Offene Punkte aus der Aufnahme', [
    {kopf: 'Nr.', breite: 7, eingabe: true},
    {kopf: 'Offener Punkt', breite: 56, eingabe: true},
    {kopf: 'Block', breite: 26, eingabe: true},
    {kopf: 'Zuständig', breite: 16, validierung: ROLLE, eingabe: true},
    {kopf: 'Frist', breite: 12, eingabe: true},
    {kopf: 'Status', breite: 13, validierung: STATUS, eingabe: true},
    {kopf: 'Erledigt am', breite: 13, eingabe: true},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
  ], {hinweis: 'Jedes mit «zu klären» markierte Feld aus dem Blatt Aufnahme hierher übertragen.'});
  leerzeilen(wo, 22);

  return wb;
}

/* ------------------------------------------------- 08 Bewertung */
function bewertung() {
  const wb = mappe();
  objektblatt(wb, '08 · Bewertung – Objektkopf');

  /* Vergleichswert */
  const wv = blatt(wb, 'Vergleichswert', '08 · Vergleichswertmethode', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Lage / Adresse', breite: 26, eingabe: true},
    {kopf: 'Wohnfläche m²', breite: 12, format: '#,##0', eingabe: true},
    {kopf: 'Grundstück m²', breite: 12, format: '#,##0', eingabe: true},
    {kopf: 'Baujahr', breite: 9, eingabe: true},
    {kopf: 'Zustand', breite: 18, validierung: ZUSTAND, eingabe: true},
    {kopf: 'Preis CHF', breite: 15, format: '#,##0', eingabe: true},
    {kopf: 'Preis pro m² Wohnfläche', breite: 15, format: '#,##0'},
    {kopf: 'Angebots- oder Abschlusspreis', breite: 17,
     validierung: ['Angebotspreis', 'Abschlusspreis'], eingabe: true},
    {kopf: 'Angebotsdauer Tage', breite: 12, eingabe: true},
    {kopf: 'Zu-/Abschlag %', breite: 13, format: '0.0%', eingabe: true},
    {kopf: 'Begründung des Zu-/Abschlags', breite: 40, eingabe: true},
    {kopf: 'Umgerechnet auf Bewertungsobjekt CHF', breite: 20, format: '#,##0'},
    {kopf: 'Quelle und Abrufdatum', breite: 26, eingabe: true},
  ], {hinweis: 'Mindestens drei, besser fünf Vergleichsobjekte. Angebotspreise sind keine Abschlusspreise und entsprechend zu korrigieren. Unter drei belastbaren Vergleichen ist die Methode allein nicht tragfähig.', xSplit: 2});
  const vz = [];
  for (let i = 0; i < 6; i++) {
    const r = i + 4;
    vz.push([i + 1, '', '', '', '', '', '',
      `=IF(OR(G${r}="",C${r}=""),"",G${r}/C${r})`,
      '', '', '', '',
      `=IF(G${r}="","",G${r}*(1+N(K${r})))`, '']);
  }
  vz.push([]);
  vz.push(['', '**Mittelwert umgerechnet', '', '', '', '', '', '', '', '', '', '',
    '=IF(COUNT(M4:M9)=0,"",AVERAGE(M4:M9))', '']);
  vz.push(['', '**Tiefster Wert', '', '', '', '', '', '', '', '', '', '',
    '=IF(COUNT(M4:M9)=0,"",MIN(M4:M9))', '']);
  vz.push(['', '**Höchster Wert', '', '', '', '', '', '', '', '', '', '',
    '=IF(COUNT(M4:M9)=0,"",MAX(M4:M9))', '']);
  zeilen(wv, vz);

  /* Realwert */
  const wr = blatt(wb, 'Realwert', '08 · Realwertmethode als Kontrollrechnung', [
    {kopf: 'Position', breite: 44}, {kopf: 'Einheit', breite: 12},
    {kopf: 'Wert', breite: 18, format: '#,##0.00', eingabe: true},
    {kopf: 'Hinweis', breite: 62},
  ], {hinweis: 'Gelbe Felder ausfüllen. Die berechneten Zeilen rechnen selbst. Der Gebäudeversicherungswert ist Kontrollgrösse für den Neuwert, kein Marktwert.', orientation: 'portrait'});
  /* Zeilennummern: Daten beginnen in Zeile 4 */
  const F = {
    PRODUKT_LAND: '=IF(OR(C4="",C5=""),"",C4*C5)',        // Landfläche × Landpreis
    PRODUKT_GEB:  '=IF(OR(C7="",C8=""),"",C7*C8)',        // Volumen × Neuwert/m³
    ZEITBAUWERT:  '=IF(OR(C9="",C10=""),"",C9*(1-C10))',  // Neuwert × (1 − Entwertung)
    ZWISCHEN:     '=IF(C6="","",N(C6)+N(C11)+N(C12)+N(C13))',
    REALWERT:     '=IF(C14="","",C14-N(C15))',
  };
  zeilen(wr, BW.REALWERT.map(p => [p.pos, p.einheit,
    p.formel ? F[p.formel] : '', p.hinweis || (p.formel ? 'Berechnet' : 'Eingabe')]));

  /* Sanierungsbedarf */
  const ws = blatt(wb, 'Sanierungsbedarf', '08 · Sanierungsbedarf, bauteilweise', [
    {kopf: 'Bauteil', breite: 34},
    {kopf: 'Zustand', breite: 20, validierung: ZUSTAND, eingabe: true},
    {kopf: 'Jahr der letzten Erneuerung', breite: 15, eingabe: true},
    {kopf: 'Feststellung', breite: 44, eingabe: true},
    {kopf: 'Zeithorizont', breite: 20,
     validierung: ['sofort', '1–3 Jahre', '4–10 Jahre', 'über 10 Jahre', 'kein Bedarf'], eingabe: true},
    {kopf: 'Geschätzte Kosten CHF', breite: 17, format: '#,##0', eingabe: true},
    {kopf: 'Quelle der Schätzung', breite: 26, eingabe: true},
  ], {hinweis: 'Nie als Pauschale. Nur ein bauteilweise bezifferter Bedarf lässt sich gegenüber Eigentümer und Käufer begründen. Die Summe fliesst als Abzug in den Realwert.'});
  const sz = BW.SANIERUNG_BAUTEILE.map(b => [b, '', '', '', '', '', '']);
  sz.push([]);
  sz.push(['**Total geschätzter Sanierungsbedarf', '', '', '', '',
    `=SUM(F4:F${3 + BW.SANIERUNG_BAUTEILE.length})`, '']);
  zeilen(ws, sz);

  /* Ertragswert */
  const we = blatt(wb, 'Ertragswert', '08 · Ertragswertmethode, nur bei relevantem Mietertrag', [
    {kopf: 'Position', breite: 44}, {kopf: 'Einheit', breite: 12},
    {kopf: 'Wert', breite: 18, format: '#,##0.00', eingabe: true},
    {kopf: 'Hinweis', breite: 62},
  ], {hinweis: 'Nur ausfüllen bei Einliegerwohnung, vermieteter Garage, Mehrfamilienhaus oder Renditeanteil. Sonst mit Begründung als nicht anwendbar bezeichnen.', orientation: 'portrait'});
  zeilen(we, [
    ['Nachhaltig erzielbarer Bruttomietertrag pro Jahr', 'CHF', '', 'Aus Mietverträgen; nicht der Wunschmietzins'],
    ['Leerstands- und Mietausfallrisiko', '%', '', 'Marktabhängig'],
    ['Effektiver Bruttoertrag', 'CHF', '=IF(C4="","",C4*(1-N(C5)))', 'Berechnet'],
    ['Nicht überwälzbare Betriebskosten', 'CHF', '', 'Verwaltung, Versicherung, Abgaben'],
    ['Unterhalt und Instandsetzung', 'CHF', '', 'Langjähriger Durchschnitt'],
    ['Nettoertrag', 'CHF', '=IF(C6="","",C6-N(C7)-N(C8))', 'Berechnet'],
    ['Kapitalisierungssatz', '%', '', 'Marktgerecht, mit Begründung in der Bemerkung'],
    ['Ertragswert', 'CHF', '=IF(OR(C9="",C10=""),"",C9/C10)', 'Berechnet'],
    ['Begründung des Kapitalisierungssatzes', 'Text', '', ''],
    ['Anwendbar', 'ja/nein', '', 'Bei «nein» Begründung in der nächsten Zeile'],
    ['Begründung bei Nichtanwendbarkeit', 'Text', '', ''],
  ]);

  /* Ergebnis */
  const wg = blatt(wb, 'Ergebnis', '08 · Gewichtung, Wertspanne und Angebotspreis', [
    {kopf: 'Position', breite: 44}, {kopf: 'Wert', breite: 20, format: '#,##0', eingabe: true},
    {kopf: 'Gewichtung', breite: 13, format: '0%', eingabe: true},
    {kopf: 'Hinweis', breite: 66},
  ], {hinweis: 'Die Wertspanne ist das Ergebnis, nicht der Punktwert. Abweichungen über 15 Prozent zwischen Vergleichs- und Realwert sind zu begründen, nicht zu mitteln.', orientation: 'portrait'});
  zeilen(wg, [
    ['Vergleichswert, Mittelwert', '', '', 'Aus dem Blatt Vergleichswert'],
    ['Vergleichswert, tiefster Wert', '', '', ''],
    ['Vergleichswert, höchster Wert', '', '', ''],
    ['Realwert', '', '', 'Aus dem Blatt Realwert'],
    ['Ertragswert', '', '', 'Nur bei Anwendbarkeit'],
    ['Abweichung Vergleichs- zu Realwert', '', '', 'Über 15 Prozent: Ursache benennen'],
    [],
    ['**Gewichteter Wert', '', '', 'Die Summe der Gewichtungen muss 100 Prozent ergeben'],
    ['Gewichtung Vergleichswert', '', '', 'Begründung unten'],
    ['Gewichtung Realwert', '', '', ''],
    ['Gewichtung Ertragswert', '', '', ''],
    ['Begründung der Gewichtung', '', '', ''],
    [],
    ['Wohnfläche m²', '', '', 'Aus der Objektaufnahme, Arbeitsmappe 07'],
    ['**Wertspanne untere Grenze', '', '', 'Eingabe, hergeleitet aus den Methoden'],
    ['**Wertspanne obere Grenze', '', '', ''],
    ['Mittelwert der Spanne', '', '', 'Berechnet'],
    ['Preis pro m² Wohnfläche, Mittelwert', '', '', 'Plausibilitätsgrösse gegen die Vergleichsobjekte'],
    [],
    ['**Empfohlener Angebotspreis', '', '', 'Ein Betrag, mit Begründung der Lage innerhalb der Spanne'],
    ['Begründung', '', '', ''],
    [],
    ['Bewertungsdatum', '', '', ''],
    ['Bearbeitet durch', '', '', ''],
    ['Geprüft durch (Vier-Augen-Prinzip)', '', '', 'Vor der Unterschrift zwingend'],
  ]);
  /* Formeln anhand der Beschriftungen setzen, damit kein Zeilenbezug von Hand
     gepflegt werden muss. */
  {
    const z   = b => zeileVon(wg, b);
    const set = (bez, f) => { wg.getCell(z(bez), 2).value = {formula: f}; };
    const vM = z('Vergleichswert, Mittelwert'), rW = z('Realwert'),
          eW = z('Ertragswert'),
          gV = z('Gewichtung Vergleichswert'), gR = z('Gewichtung Realwert'),
          gE = z('Gewichtung Ertragswert'),
          uG = z('Wertspanne untere Grenze'), oG = z('Wertspanne obere Grenze'),
          mS = z('Mittelwert der Spanne'), wf = z('Wohnfläche m²');
    set('Vergleichswert, Mittelwert',   'IF(Vergleichswert!M11="","",Vergleichswert!M11)');
    set('Vergleichswert, tiefster Wert','IF(Vergleichswert!M12="","",Vergleichswert!M12)');
    set('Vergleichswert, höchster Wert','IF(Vergleichswert!M13="","",Vergleichswert!M13)');
    set('Realwert',    'IF(Realwert!C16="","",Realwert!C16)');
    set('Ertragswert', 'IF(Ertragswert!C11="","",Ertragswert!C11)');
    set('Abweichung Vergleichs- zu Realwert',
        `IF(OR(B${vM}="",B${rW}=""),"",B${vM}/B${rW}-1)`);
    wg.getCell(z('Abweichung Vergleichs- zu Realwert'), 2).numFmt = '0.0%';
    set('Gewichteter Wert',
        `IF(SUM(C${gV}:C${gE})=0,"",(N(B${vM})*N(C${gV})+N(B${rW})*N(C${gR})`
        + `+N(B${eW})*N(C${gE}))/SUM(C${gV}:C${gE}))`);
    set('Mittelwert der Spanne', `IF(OR(B${uG}="",B${oG}=""),"",(B${uG}+B${oG})/2)`);
    set('Preis pro m² Wohnfläche, Mittelwert',
        `IF(OR(B${mS}="",B${wf}="",B${wf}=0),"",B${mS}/B${wf})`);
  }

  /* Chancen und Risiken */
  const wc = blatt(wb, 'Chancen und Risiken', '08 · Chancen, Risiken und Vermarktungsstrategie', [
    {kopf: 'Art', breite: 14, validierung: ['Chance', 'Risiko'], eingabe: true},
    {kopf: 'Sachverhalt', breite: 46, eingabe: true},
    {kopf: 'Wirkung auf Preis oder Angebotsdauer', breite: 40, eingabe: true},
    {kopf: 'Voraussetzung bzw. Gegenmassnahme', breite: 40, eingabe: true},
  ], {hinweis: 'Je Position eine Zeile. Vermutetes Potenzial gehört nicht in die Zahl, sondern hierher (Register R27).'});
  leerzeilen(wc, 16);

  /* Nettoerlös */
  const wn = blatt(wb, 'Nettoerloes', '08 · Nettoerlösrechnung für die Verkäuferschaft', [
    {kopf: 'Position', breite: 48}, {kopf: 'Betrag CHF', breite: 18, format: '#,##0', eingabe: true},
    {kopf: 'Quelle und Datum', breite: 30, eingabe: true},
    {kopf: 'Hinweis', breite: 56},
  ], {hinweis: 'Unverbindliche Orientierung. Der Makler rechnet die Grundstückgewinnsteuer nicht selbst; er verlangt eine Schätzung des Steueramts (Register R22, R25).', orientation: 'portrait'});
  zeilen(wn, [
    ['Angebotspreis bzw. erwarteter Kaufpreis', '', '', ''],
    ['Kaufpreis Inventar', '', '', 'Gemäss Inventarliste'],
    ['**Total Erlös', '=IF(B4="","",B4+N(B5))', '', 'Berechnet'],
    ['./. Ablösung Hypothek, Saldo', '', 'Bestätigung der Bank', 'Register R41'],
    ['./. Vorfälligkeitsentschädigung', '', 'Berechnung der Bank', 'Register R41'],
    ['./. Grundstückgewinnsteuer', '', 'Schätzung Steueramt', 'Kantonal; Register R22'],
    ['./. Handänderungsabgabe, Anteil Verkäufer', '', 'Notariat', 'Kantonal; Register R26'],
    ['./. Beurkundungs- und Grundbuchgebühren, Anteil Verkäufer', '', 'Notariat', 'Kantonal; Register R26'],
    ['./. Maklerhonorar', '', 'Mandat', 'Register R18'],
    ['./. Mehrwertsteuer auf dem Honorar, 8,1 %', '=IF(B12="","",B12*0.081)', 'Mandat', 'Berechnet; Register R21'],
    ['./. Kosten GEAK, Fotografie, Grundrisse und übrige Vermarktung', '', 'Budget', ''],
    ['./. Weitere Kosten', '', '', ''],
    ['**Geschätzter Nettoerlös', '=IF(B6="","",B6-N(B7)-N(B8)-N(B9)-N(B10)-N(B11)-N(B12)-N(B13)-N(B14)-N(B15))', '', 'Berechnet'],
  ]);

  /* Grundlagen */
  const wgl = blatt(wb, 'Grundlagen', '08 · Verwendete Grundlagen und Vorbehalte', [
    {kopf: 'Unterlage bzw. Auskunft', breite: 46},
    {kopf: 'Ausstellungsdatum', breite: 16, eingabe: true},
    {kopf: 'Bezugsquelle', breite: 30, eingabe: true},
    {kopf: 'Vorhanden', breite: 12, validierung: JANEIN, eingabe: true},
    {kopf: 'Bemerkung bzw. Vorbehalt', breite: 44, eingabe: true},
  ], {hinweis: 'Jede Eingangsgrösse der Bewertung braucht eine belegte Quelle. Fehlt eine Unterlage, ist der Vorbehalt im Bewertungsbericht zu nennen.'});
  zeilen(wgl, [
    ['Grundbuchauszug', '', '', '', ''],
    ['Belege zu Dienstbarkeiten und Anmerkungen', '', '', '', ''],
    ['Katasterplan', '', '', '', ''],
    ['Zonenauskunft und Nutzungskennzahlen', '', '', '', ''],
    ['Baupläne, Grundrisse, Schnitte', '', '', '', ''],
    ['Baubewilligungen', '', '', '', ''],
    ['Gebäudeversicherungsausweis', '', '', '', ''],
    ['Renovationsnachweise und Belege', '', '', '', ''],
    ['Heizungs- und Haustechnikunterlagen', '', '', '', ''],
    ['GEAK', '', '', '', ''],
    ['Katasterauszug belastete Standorte', '', '', '', ''],
    ['Naturgefahrenkarte', '', '', '', ''],
    ['Objektaufnahme (Arbeitsmappe 07)', '', '', '', ''],
    ['Marktanalyse und Vergleichsobjekte', '', '', '', ''],
    ['Mietverträge, soweit vermietet', '', '', '', ''],
  ]);

  return wb;
}

/* --------------------------------- 09 Verkäufer-Abschlusscheckliste */
function abschlusscheckliste() {
  const wb = mappe();
  objektblatt(wb, '09 · Abschlusscheckliste – Objektkopf');

  const ws = blatt(wb, 'Abschluss', '09 · Abschlusscheckliste des Maklers, 65 Positionen', [
    {kopf: 'Erledigt', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Position', breite: 58},
    {kopf: 'Phase', breite: 8},
    {kopf: 'Zuständig', breite: 22},
    {kopf: 'Nachweis', breite: 34},
    {kopf: 'Datum', breite: 12, eingabe: true},
    {kopf: 'Ablage', breite: 22, eingabe: true},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
    {kopf: 'Register', breite: 12},
    {kopf: 'Herkunft', breite: 12},
  ], {hinweis: 'Vor dem Abschluss des Mandats vollständig abzuarbeiten. «Herkunft: ergänzt» kennzeichnet die über die Auftragsvorgabe hinaus ergänzten Positionen. Spalte «Ablage» nach Teil S des Handbuchs.', xSplit: 2});
  const az = [];
  ABSCHLUSS.forEach(p => {
    if (p.g) { az.push({gruppe: p.g}); return; }
    az.push(['offen', p.pos, p.phase, p.rolle, p.nachweis, '', '', '',
      p.recht || '—', p.neu ? 'ergänzt' : 'Auftrag']);
  });
  zeilen(ws, az);

  /* Kennzahlenblatt für den Abschlussbericht */
  const wk = blatt(wb, 'Kennzahlen', '09 · Kennzahlen für den Abschlussbericht an den Eigentümer', [
    {kopf: 'Kennzahl', breite: 40}, {kopf: 'Wert', breite: 20, eingabe: true},
    {kopf: 'Bemerkung', breite: 60, eingabe: true},
  ], {hinweis: 'Grundlage der Vorlage K19 «Abschlussbericht an den Eigentümer».', orientation: 'portrait'});
  zeilen(wk, [
    {gruppe: 'Ergebnis'},
    ['Bewertete Spanne, untere Grenze CHF', '', ''],
    ['Bewertete Spanne, obere Grenze CHF', '', ''],
    ['Angebotspreis CHF', '', ''],
    ['Erzielter Kaufpreis CHF', '', ''],
    ['Abweichung erzielter Preis zu Angebotspreis', '=IF(OR(B7="",B6=""),"",B7/B6-1)', 'Berechnet'],
    ['Erzielter Preis innerhalb der Spanne', '', 'ja / nein, mit Begründung'],
    {gruppe: 'Vermarktung'},
    ['Tage am Markt', '', ''],
    ['Anfragen', '', ''],
    ['Besichtigungen', '', ''],
    ['Qualifizierte Interessenten (Stufe A)', '', ''],
    ['Angebote', '', ''],
    ['Preisreduktionen: Anzahl und Höhe', '', ''],
    ['Häufigster Absagegrund', '', ''],
    {gruppe: 'Abwicklung'},
    ['Tage von der Einigung bis zur Beurkundung', '', ''],
    ['Tage von der Beurkundung bis zur Eintragung', '', ''],
    ['Tage von der Eintragung bis zur Übergabe', '', ''],
    ['Vermarktungskosten gegen Budget', '', ''],
    {gruppe: 'Abschluss'},
    ['Honorar abgerechnet am', '', ''],
    ['Abschlussgespräch geführt am', '', ''],
    ['Rückmeldung des Eigentümers', '', ''],
    ['Referenz erteilt und Einwilligung dokumentiert', '', 'Register R39'],
    ['Wiedervorlage im CRM gesetzt auf', '', 'Zwölf Monate'],
    ['Aufbewahrungsfrist des Dossiers bis', '', ''],
  ]);

  /* Übergabe */
  const wu = blatt(wb, 'Uebergabe', '09 · Schlüssel und Zählerstände bei der Übergabe', [
    {kopf: 'Art', breite: 18, validierung: ['Schlüssel', 'Zähler'], eingabe: true},
    {kopf: 'Bezeichnung', breite: 34, eingabe: true},
    {kopf: 'Anzahl bzw. Stand', breite: 16, eingabe: true},
    {kopf: 'Zähler- / Zylindernummer', breite: 22, eingabe: true},
    {kopf: 'Datum', breite: 12, eingabe: true},
    {kopf: 'Foto erstellt', breite: 12, validierung: JANEIN, eingabe: true},
    {kopf: 'Quittiert durch Käufer', breite: 16, validierung: JANEIN, eingabe: true},
    {kopf: 'Bemerkung', breite: 30, eingabe: true},
  ], {hinweis: 'Zählerstände nur mit Zählernummer verwertbar. Fehlende Schlüssel ausdrücklich vermerken.'});
  zeilen(wu, [
    ['Schlüssel', 'Haustür', '', '', '', '', '', ''],
    ['Schlüssel', 'Nebeneingang', '', '', '', '', '', ''],
    ['Schlüssel', 'Keller', '', '', '', '', '', ''],
    ['Schlüssel', 'Estrich', '', '', '', '', '', ''],
    ['Schlüssel', 'Garage', '', '', '', '', '', ''],
    ['Schlüssel', 'Garagentor-Fernbedienung', '', '', '', '', '', ''],
    ['Schlüssel', 'Briefkasten', '', '', '', '', '', ''],
    ['Schlüssel', 'Nebengebäude / Gartenhaus', '', '', '', '', '', ''],
    ['Schlüssel', 'Badge / Code', '', '', '', '', '', ''],
    ['Schlüssel', 'Storenfernbedienung', '', '', '', '', '', ''],
    ['Zähler', 'Strom Hochtarif', '', '', '', '', '', ''],
    ['Zähler', 'Strom Niedertarif', '', '', '', '', '', ''],
    ['Zähler', 'Wasser', '', '', '', '', '', ''],
    ['Zähler', 'Gas', '', '', '', '', '', ''],
    ['Zähler', 'Wärmezähler', '', '', '', '', '', ''],
    ['Zähler', 'Öltank, Füllstand', '', '', '', '', '', ''],
    ['Zähler', 'Photovoltaik, Erzeugung', '', '', '', '', '', ''],
    ['Zähler', 'Photovoltaik, Einspeisung', '', '', '', '', '', ''],
  ]);

  return wb;
}

/* ------------------------------- 10 Sonderfälle und Störfälle */
function sonderfaelle() {
  const wb = mappe();
  objektblatt(wb, '10 · Sonderfälle und Störfälle – Objektkopf');

  const ws = blatt(wb, 'Sonderfaelle', '10 · Sonderfallkatalog, 30 Fälle', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Sonderfall', breite: 30},
    {kopf: 'Erkennung in Phase', breite: 11},
    {kopf: 'Liegt vor', breite: 11, validierung: JANEIN, eingabe: true},
    {kopf: 'Erkennung', breite: 56}, {kopf: 'Risiko', breite: 60},
    {kopf: 'Notwendige Abklärungen', breite: 60}, {kopf: 'Zuständige Stelle', breite: 34},
    {kopf: 'Dokumente', breite: 44}, {kopf: 'Stop-Kriterium', breite: 44},
    {kopf: 'Eskalation', breite: 44}, {kopf: 'Register', breite: 12},
    {kopf: 'Abgeklärt am', breite: 13, eingabe: true},
    {kopf: 'Ergebnis', breite: 34, eingabe: true},
  ], {hinweis: 'Je Mandat durchgehen, spätestens in Phase 3. «Liegt vor: nein» ist ebenfalls ein Ergebnis und wird festgehalten.', xSplit: 2});
  const sz = [];
  SF.SONDERFAELLE.forEach(x => {
    if (x.g) { sz.push({gruppe: x.g}); return; }
    sz.push([x.nr, x.fall, x.phase, 'nein', x.erkennung, x.risiko, x.abklaerung,
      x.stelle, x.dokumente, x.stop, x.eskalation, x.recht || '—', '', '']);
  });
  zeilen(ws, sz);

  const wt = blatt(wb, 'Stoerfaelle', '10 · Störfallkatalog, 17 Fälle', [
    {kopf: 'Nr.', breite: 7}, {kopf: 'Störfall', breite: 32},
    {kopf: 'Eingetreten', breite: 12, validierung: JANEIN, eingabe: true},
    {kopf: 'Datum', breite: 12, eingabe: true},
    {kopf: '1 Sofortmassnahme', breite: 60}, {kopf: '2 Verantwortlich', breite: 26},
    {kopf: '3 Information', breite: 50}, {kopf: '4 Dokumentation', breite: 50},
    {kopf: '5 Rechtliche Prüfung', breite: 50}, {kopf: '6 Eigentümerentscheid', breite: 44},
    {kopf: '7 Wiederaufnahme', breite: 44}, {kopf: 'Prävention', breite: 50},
    {kopf: 'Erledigt am', breite: 13, eingabe: true},
    {kopf: 'Bemerkung', breite: 34, eingabe: true},
  ], {hinweis: 'Ein Fehler wird gemeldet, nicht verwaltet. Meldung an die Verkaufsleitung am gleichen Tag, unabhängig davon, ob eine Lösung schon gefunden ist. Nichts wird rückdatiert oder überschrieben.', xSplit: 2});
  const tz = [];
  ST.STOERUNGEN.forEach(x => {
    if (x.g) { tz.push({gruppe: x.g}); return; }
    tz.push([x.nr, x.fall, 'nein', '', x.sofort, x.wer, x.info, x.doku, x.recht,
      x.entscheid, x.wieder, x.praevention, '', '']);
  });
  zeilen(wt, tz);

  return wb;
}

module.exports = {checklisten, interessenten, objektaufnahme, bewertung,
                  abschlusscheckliste, sonderfaelle};
