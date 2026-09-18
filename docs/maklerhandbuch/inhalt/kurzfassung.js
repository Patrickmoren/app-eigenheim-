/* Erzeugt 11_Kurzfassung_Praxis – die Arbeitsebene für erfahrene Makler.
   Kein neuer Inhalt: alles aus denselben Quellen wie das Handbuch, nur
   verdichtet auf das, was im Tagesgeschäft entschieden und geprüft wird.
   Das Handbuch bleibt das Nachschlagewerk; Teil 9 verweist hinein. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkte, nrpunkte, tabelle, info,
       recht, praxis, titelblatt, flow, checks} = require('../lib/blocks.js');

const {PHASEN}   = require('./phasen.js');
const {ZUSATZ}   = require('./phasen-v2.js');
const {GATES}    = require('./gates.js');
const P          = require('./preis.js');
const CP         = require('./compliance.js');
const SF         = require('./sonderfaelle.js');
const ST         = require('./stoerungen.js');
const KN         = require('./kontrollen.js');
const {STAND, VERSION} = require('./handbuch2.js');

/* Verdichten: erster Satz, sonst harte Kürzung an der Wortgrenze. */
function kurz(t, max = 120) {
  const s = String(t).trim();
  if (s.length <= max) return s;
  const satz = s.match(/^[^.;]{20,}?[.;]/);
  if (satz && satz[0].length <= max + 40) return satz[0].replace(/[.;]$/, '');
  const schnitt = s.slice(0, max);
  return schnitt.slice(0, schnitt.lastIndexOf(' ')) + ' …';
}

/* ------------------------------------------------- Die roten Linien */
/* Handverfasst und bewusst nicht generiert: das ist die Seite, die ein
   erfahrener Makler tatsächlich liest. Jede Zeile hat eine Fundstelle. */
const ROTE_LINIEN = [
{g: 'Vor dem Mandat'},
{l: 'Keine Vermarktungskosten, bevor Gate 1 freigegeben ist.', wo: 'Gate 1', warum: 'Aufwand verloren, wenn das Objekt in der vorgesehenen Form nicht verkäuflich ist.'},
{l: 'Kein Mandat ohne Unterschrift jedes Verfügungsberechtigten.', wo: 'Gate 2 · R13 R14', warum: 'Der Verkauf scheitert sonst kurz vor der Beurkundung.'},
{l: 'Keine Preisnennung und keine Bandbreite vor Objektaufnahme und Bewertung.', wo: 'Phase 2 · Teil D1', warum: 'Eine früh genannte Zahl lässt sich nicht zurücknehmen.'},
{l: 'Vertragsvorlage nie verändert verwenden.', wo: 'Gate 2', warum: 'Veränderte Klauseln sind nicht geprüft und im Streitfall nicht durchsetzbar.'},

{g: 'Angaben und Vermarktung'},
{l: 'Keine Angabe ohne belegte Quelle – in Bewertung, Dossier und jedem Kanal.', wo: 'Gate 4 · R9', warum: 'Jede Angabe kann als zugesicherte Eigenschaft gelten.'},
{l: 'Flächen nie schätzen. Grundstück aus dem Grundbuchauszug, Wohnfläche aus dem Plan mit Norm.', wo: 'R12', warum: 'Flächenangaben sind zusicherungsrelevant.'},
{l: 'Nicht bewilligte Fläche nie als Wohnfläche ausweisen oder als Potenzial bewerben.', wo: 'R44 · S15', warum: 'Unzutreffende Zusicherung und Wiederherstellungsrisiko beim Käufer.'},
{l: 'Ausbaupotenzial nur mit schriftlicher behördlicher Bestätigung.', wo: 'R27', warum: 'Vermutetes Potenzial ist nicht bewertbar und nicht bewerbbar.'},
{l: 'Keine Energieangabe ohne vorliegenden GEAK.', wo: 'R33', warum: 'Ohne Nachweis ist die Effizienzangabe eine Behauptung.'},
{l: 'Keine Veröffentlichung ohne schriftliche Eigentümerfreigabe und abgezeichnete Release-Checkliste.', wo: 'Gate 4 · K2', warum: 'Fehler in veröffentlichten Angaben sind nur mit Korrekturaufwand und Vertrauensverlust behebbar.'},
{l: 'Bekannte Mängel nie verschweigen – auch behobene gehören in die Liste.', wo: 'R10 · T15', warum: 'Die Wegbedingung der Gewährleistung trägt nur bei vollständiger Offenlegung.'},

{g: 'Käufer und Verhandlung'},
{l: 'Keine Reservation und keine Rückstellung der Vermarktung auf eine Selbstauskunft hin.', wo: 'Gate 6 · P6 · S21 · R40', warum: 'Der teuerste vermeidbare Fehler: Wochen verloren, Zweitinteressenten abgewandert.'},
{l: 'Erwerbsrechtliche Zulässigkeit vor der Terminvergabe klären, nicht beim Angebot.', wo: 'R34–R36 · S18', warum: 'Sonst werden Erwartungen geweckt, die nicht erfüllbar sind.'},
{l: 'Nie ohne schriftlichen Verhandlungsauftrag verhandeln.', wo: 'Gate 7', warum: 'Vollmachtüberschreitung und Haftung.'},
{l: 'Mindestpreis und Rückzugslinie nie nennen, nie andeuten, nie durch Verhalten erkennbar machen.', wo: 'Teil E6', warum: 'Verhandlungsposition unwiederbringlich verloren.'},
{l: 'Angebotsbeträge Dritter nie offenlegen.', wo: 'S23 · R39', warum: 'Vertrauensbruch und Datenschutzverstoss.'},
{l: 'Keine Zusage zu Gewährleistung, Bauzulässigkeit, Steuerfolgen oder Finanzierung.', wo: 'Teil A2 · R9', warum: 'Solche Aussagen sind Zusicherungen, für die der Makler haftet.'},
{l: 'Zweitplatzierte bis zur Beurkundung halten, nicht absagen.', wo: 'Funnelstufe 7 · T7', warum: 'Reservationen platzen; eine gehaltene Alternative spart Wochen.'},
{l: 'Jedes Angebot dem Eigentümer vorlegen – auch das, das aussichtslos erscheint.', wo: 'Teil E4', warum: 'Die Auswahl ist nicht die Aufgabe des Maklers.'},

{g: 'Preis'},
{l: 'Keine Preisreduktion ohne dokumentierte Ursachenanalyse.', wo: 'P1–P8 · K3', warum: 'Der Zeitablauf ist kein Indikator für die Ursache.'},
{l: 'Keine Reduktionskette in kurzen Abständen.', wo: 'P7', warum: 'Signalisiert Not und zerstört die Verhandlungsposition endgültig.'},
{l: 'Keine Preisänderung ohne schriftlichen Eigentümerentscheid.', wo: 'Teil C9', warum: 'Der Makler empfiehlt, der Eigentümer entscheidet.'},

{g: 'Geld, Recht, Abschluss'},
{l: 'Keine Barzahlung im Zusammenhang mit dem Objekt – auch nicht für Inventar.', wo: 'R38', warum: 'Unabhängig von jeder Schwelle: Unternehmensgrundsatz. Angebotene Barzahlung anhalten und an Compliance.'},
{l: 'Keine Zahlung auf ein Konto des Maklers.', wo: 'R38 · Teil H1', warum: 'Ausschliesslich über Notariat oder Bankkonto.'},
{l: 'Reservationsbestätigung nie um Kaufverpflichtung, Konventionalstrafe oder Verfallsklausel ergänzen.', wo: 'R2 · Gate 8', warum: 'Wäre ein formungültiger Vorvertrag und nicht durchsetzbar.'},
{l: 'Keine Übergabe vor bestätigter Eintragung im Grundbuch.', wo: 'Gate 10 · R3', warum: 'Der Käufer ist bis dahin nicht Eigentümer.'},
{l: 'Bei vermietetem Objekt keine Besichtigung ohne rechtzeitige Ankündigung an den Mieter.', wo: 'R47 · S10', warum: 'Duldungspflicht besteht, freies Zutrittsrecht nicht.'},
{l: 'Keine eigene Rechtsauskunft und keine Vertragsredaktion.', wo: 'Teil A2', warum: 'Gehört zum Notariat oder zur Rechtsberatung der Partei.'},
{l: 'Bei eigener Kaufabsicht oder Kauf durch Nahestehende: Mandat abgeben.', wo: 'S30 · R19 R43', warum: 'Interessenkonflikt; Lohnanspruch kann verwirken.'},
{l: 'Fehler am gleichen Tag melden – auch ohne Lösung. Nichts rückdatieren oder überschreiben.', wo: 'Teil J2', warum: 'Ein verwalteter Fehler wird zum Haftungsfall.'},
];

/* ------------------------------------------- Wo steht was */
const VERWEISE = [
['Prozess, Phasen im Detail', 'Handbuch Teil B2', 'Alle 18 Felder je Phase, einschliesslich Risiken und Dokumentationspflicht'],
['Gate-Kriterien im Volltext', 'Handbuch Teil B1', 'Kriterien, Nachweis, Eskalation ausformuliert'],
['Bewertungsmethoden und Plausibilitätsprüfungen', 'Handbuch Teil C2–C4', 'Einsatz, Vorgehen, Grenzen je Methode'],
['Baurechtsobjekt bewerten', 'Handbuch Teil C5', 'Kein Landwert, Zins als Belastung, Restlaufzeit'],
['Bewertungsbericht, Aufbau', 'Handbuch Teil C6 · Mappe 08', '20 Abschnitte mit Annahmen und Vorbehalten'],
['Erstgesprächsleitfaden', 'Handbuch Teil D1 · Formular F1', '45 Fragen mit Begründung und Folge'],
['Maklermandat, Struktur', 'Handbuch Teil D3', '24 Ziffern mit Prüfkennzeichnung'],
['Eigentümerreports V1–V14', 'Handbuch Teil D5 · Dokument 05', 'Anlass, Zweck, Inhalt, einzuholender Entscheid'],
['Käuferprofil, Pflichtfelder je Stufe', 'Handbuch Teil E2 · Formular F2', '30 Felder mit Angabe, ab welcher Stufe sie vorliegen müssen'],
['Angebotsvergleich, 19 Kriterien', 'Handbuch Teil E5 · Formular F5', 'Matrix mit Nettoerlös und Abschlusssicherheit'],
['Verhandlungsvorbereitung und Protokoll', 'Handbuch Teil E6 · Formular F6', '11 Vorbereitungspunkte, 10 Protokollfelder'],
['Vermarktungsstufen und Kanäle', 'Handbuch Teil F1–F2', 'Acht Stufen, neun Kanäle mit Erfolgsmessung'],
['Verkaufsdossier, 23 Abschnitte', 'Handbuch Teil F3 · Dokument 04', 'Inhalt je Abschnitt'],
['Release-Checkliste', 'Handbuch Teil F4', '25 Positionen vor der Veröffentlichung'],
['Fotografie: Pflichtaufnahmen, Ausschlussliste, Reihenfolge', 'Handbuch Teil F6', 'Mit Vorbereitungsliste für den Eigentümer'],
['Normebenen und Rechtsstand', 'Handbuch Teil G1–G2', 'Was Bundesrecht ist und was je Kanton zu klären ist'],
['GwG: Anknüpfung, Ausnahmen, Pfade', 'Handbuch Teil G3–G5', 'Mit Quellenvorbehalt'],
['TJPG, PEP, Datenschutz, Aufbewahrung', 'Handbuch Teil G6–G9', 'Aufbewahrungsfristen je Kategorie'],
['Kostenfolgen bei Abbruch', 'Handbuch Teil G10', 'Honorar, Aufwandersatz, Notariatskosten'],
['Notariat: vor und nach der Beurkundung', 'Handbuch Teil H2–H3 · Formular F9', '17 bzw. 12 Positionen'],
['Übergabeprotokoll', 'Handbuch Teil H4 · Formular F11', '11 Blöcke, 64 Felder'],
['CRM: Objektpipeline und Tagesliste', 'Handbuch Teil I1–I3 · Mappe 06', '17 Status, 12 Tageslistenkategorien'],
['Dokumentenarchitektur und Vertraulichkeit', 'Handbuch Teil I4–I8', '15 Kategorien, 10 Metadatenfelder'],
['Vier-Augen-Kontrollpunkte im Detail', 'Handbuch Teil I9', 'Prüfgegenstand, Nachweis, Folge je Punkt'],
['Sonderfälle mit Abklärungsliste', 'Handbuch Teil J1 · Mappe 10', '30 Fälle mit sieben Feldern'],
['Störfälle mit vollem Ablauf', 'Handbuch Teil J2 · Mappe 10', '17 Fälle von Sofortmassnahme bis Wiederaufnahme'],
['Dokumenten-Checkliste A–E', 'Handbuch Teil K3 · Mappe 02', '92 Positionen mit Stufe und Bezugsquelle'],
['Objektaufnahme', 'Mappe 07', '16 Blöcke, 182 Felder – dort wird gearbeitet'],
['Rechtsregister R1–R47', 'Handbuch Teil K6 · Mappe 02', 'Grundlage, Normebene, Kerninhalt, Praxis'],
['Kantonale Klärungsliste', 'Handbuch Teil A7', '19 Themen mit zuständiger Stelle'],
['Was gegenüber Version 1 geändert wurde', 'Dokument 00', 'Audit, Falltests, Schlussaudit, Restrisiken'],
];

function bloecke() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  push(titelblatt({
    marke: 'Kurzfassung Praxis',
    titel: 'Hausverkauf Schweiz',
    untertitel: 'Die Arbeitsebene: Prüfpunkte, Entscheidungen, rote Linien',
    stand: `${VERSION} · Fassung vom ${STAND} · Kurzfassung zum Makler-Handbuch`}));

  push(info('Für wen und wofür', [
    'Diese Kurzfassung ist für erfahrene Makler. Sie erklärt nichts, sondern führt, was im Tagesgeschäft geprüft und entschieden wird.',
    'Sie enthält keinen eigenen Inhalt: alles ist aus denselben Quellen erzeugt wie das Handbuch und bleibt damit automatisch synchron.',
    'Das Handbuch (132 Seiten) bleibt das Nachschlagewerk und die Grundlage für die Einarbeitung neuer Mitarbeitender. Teil 9 sagt, wo darin was steht.',
    'Wer den Prozess kennt, arbeitet mit dieser Kurzfassung, den Arbeitsmappen und den Formularen – und schlägt nur nach, wenn ein Sonderfall oder eine Rechtsfrage auftritt.']));
  push(leer());
  push(tabelle(['Teil', 'Inhalt', 'Zweck im Tagesgeschäft'], [
    ['1', 'Prozess auf einer Seite', 'Wo stehe ich, welches Gate kommt, wer entscheidet'],
    ['2', 'Gate-Karten G1 bis G10', 'Freigeben, bedingt freigeben oder verweigern'],
    ['3', 'Wer entscheidet was', 'Trennung Makler / Verkaufsleitung / Eigentümer'],
    ['4', 'Preissteuerung P1 bis P8', 'Ursache bestimmen, bevor über den Preis gesprochen wird'],
    ['5', 'GwG-Triage', 'Pflichtenpfad je Mandat bestimmen'],
    ['6', 'Sonderfall-Radar', 'Signal erkennen, Fall zuordnen, Stop-Kriterium kennen'],
    ['7', 'Störfall-Radar', 'Sofortmassnahme bei einem Fehler'],
    ['8', 'Die roten Linien', 'Was nie passieren darf'],
    ['9', 'Wo steht was', 'Verweis ins Handbuch und in die Mappen'],
  ], [600, 3000, 6000]));

  /* ====================================================== 1 */
  push(h1neu('1 · Prozess auf einer Seite'));
  push(abs('Zwanzig Phasen, zehn Gates. Die Spalte «Entscheid» nennt die Entscheidung, die in dieser Phase fällt, und wer sie trifft.'));
  push(tabelle(['Nr.', 'Phase', 'Gate', 'Entscheid in dieser Phase', 'Wer entscheidet', 'CRM-Status'],
    PHASEN.map(p => {
      const z = ZUSATZ[p.nr];
      return [String(p.nr), p.name,
        z.gates.length ? z.gates.map(g => 'G' + g).join('+') : '',
        kurz(z.entscheidungen[0], 80),
        kurz(z.entscheider, 60),
        z.crm.status];
    }), [400, 2200, 600, 2900, 2000, 1500]));
  push(leer());
  push(info('Die vier Haltepunkte', [
    'G1 nach Phase 6 – verkäuflich? Vorher entstehen keine Vermarktungskosten.',
    'G2 nach Phase 10 – Auftrag tragfähig und Triage dokumentiert? Vorher keine Vermarktung.',
    'G4 und G5 nach Phase 11 – Unterlagen richtig und freigegeben, und darf das Objekt an den Markt?',
    'G6 nach Phase 15 – Finanzierung objektbezogen belegt? Vorher keine Verhandlung und keine Reservation.']));

  /* ====================================================== 2 */
  push(h1neu('2 · Gate-Karten'));
  push(abs('Drei zulässige Ergebnisse: freigegeben · freigegeben mit Bedingung (nur Verkaufsleitung, nie über ein Stop-Kriterium) · verweigert. Kriterien hier in Kurzform; Volltext im Handbuch Teil B1.'));
  GATES.forEach(g => {
    push(h4(`GATE ${g.nr} · ${g.name}  —  nach Phase ${g.nachPhase}  ·  Prüfer: ${g.pruefer}`));
    push(tabelle([`Freigabe, wenn  (Leitfrage: ${kurz(g.frage, 95)})`, 'STOP  ·  Nachweis  ·  Eskalation'],
      [[g.kriterien.map(c => '· ' + kurz(c, 115)).join('\n'),
        'STOP:\n' + g.stop.map(x => '· ' + kurz(x, 78)).join('\n')
        + '\n\nNachweis: ' + kurz(g.nachweis, 85)
        + '\n\nEskalation: ' + kurz(g.eskalation, 130)]],
      [5400, 4200]));
  });

  /* ====================================================== 3 */
  push(h1neu('3 · Wer entscheidet was'));
  push(abs('Der Makler entscheidet nicht über den Verkauf. Er liefert vollständige, vergleichbare und wertungsfreie Entscheidungsgrundlagen und setzt den schriftlichen Entscheid um. Das gilt für Angebotspreis, Preisänderung, Angebotsannahme und jeden Verhandlungsschritt.'));
  push(leer());
  push(h2('3.1 Entscheidungen im Prozess'));
  push(tabelle(['Nr.', 'Phase', 'Entscheidung(en) in dieser Phase', 'Entscheidungsträger'],
    PHASEN.map(p => {
      const z = ZUSATZ[p.nr];
      return [String(p.nr), p.name,
        z.entscheidungen.map(e => '· ' + kurz(e, 88)).join('\n'),
        kurz(z.entscheider, 85)];
    }), [400, 1700, 4600, 2900]));
  push(abs('Vollständige Formulierung je Entscheidung im Handbuch Teil B2.', {italics: true}));

  push(h2('3.2 Vier-Augen-Kontrollpunkte'));
  push(abs('Der Kontrollierende ist nie der Erstellende; bei Einzelbesetzung übernimmt die Verkaufsleitung oder eine benannte Stellvertretung. Kontrolliert wird gegen die Quelle, nicht gegen die Plausibilität. Ohne Vermerk gilt die Kontrolle als nicht erfolgt.'));
  push(tabelle(['Nr.', 'Kontrollpunkt', 'Ph.', 'Gate', 'Kontrolliert durch', 'Folge ohne Kontrolle'],
    KN.KONTROLLEN.map(c => [c.nr, c.punkt, String(c.phase),
      c.gate ? 'G' + c.gate : '', kurz(c.kontrolliert, 60), kurz(c.folge, 110)]),
    [500, 1900, 500, 600, 2400, 3700]));

  /* ====================================================== 4 */
  push(h1neu('4 · Preissteuerung'));
  push(abs('Kein Indikator wird allein interpretiert. Eine Preisreduktion ist nie die erste Massnahme und niemals eine Folge des Zeitablaufs – sie ist, was bleibt, wenn Darstellung, Zielgruppe und Kanal ausgeschlossen sind.'));
  push(leer());
  push(h2('4.1 Die acht Situationen'));
  push(tabelle(['Nr.', 'Situation', 'Interpretation', 'DANN', 'NIE'],
    P.STEUERUNG.map(x => [x.nr, kurz(x.situation, 60), kurz(x.interpretation, 120),
      kurz(x.dann, 135), kurz(x.nie, 95)]),
    [450, 1700, 2500, 2850, 2100]));
  push(leer());
  push(h2('4.2 Ablauf einer Preisänderung'));
  push(tabelle(['Nr.', 'Schritt', 'Inhalt'],
    P.PREISAENDERUNG.map(x => [String(x.s), x.t, kurz(x.i, 135)]), [450, 2150, 7000]));
  push(h2('4.3 Die sechs Preisbegriffe'));
  push(abs('Nach aussen geht ausschliesslich der strategische Angebotspreis.'));
  push(tabelle(['Begriff', 'Kurz', 'Wer bestimmt'],
    P.BEGRIFFE.map(b => [b.b, kurz(b.def, 125), kurz(b.wer, 55)]), [2200, 5500, 1900]));

  /* ====================================================== 5 */
  push(h1neu('5 · GwG-Triage'));
  push(recht([
    'Quellenvorbehalt: beruht auf Fachpublikationen, nicht auf dem Verordnungstext. Die grundsätzliche Unterstellungsfrage klären Rechtsabteilung und SRO einmal und hinterlegen sie als Weisung. Bis dahin gilt vorsorglich Pfad B mit Dokumentationspflicht.',
    'Abschluss der Triage bei der Käuferqualifikation (Phase 15), nicht bei der Mandatsannahme – die maassgebliche Ausnahme knüpft an die Nutzungsabsicht der Käuferschaft an.']));
  push(leer());
  push(tabelle(['Schritt', 'Frage', 'JA', 'NEIN'],
    CP.GWG_TRIAGE.map(t => [String(t.nr), kurz(t.frage, 135), kurz(t.ja, 120), kurz(t.nein, 150)]),
    [550, 2750, 2800, 3500]));
  push(leer());
  push(h2('5.1 Die drei Pfade'));
  push(tabelle(['Pfad', 'Umfang in Kurzform', 'Verantwortung'],
    CP.GWG_PFADE.map(p2 => [p2.pfad, kurz(p2.inhalt, 250), kurz(p2.verantwortung, 105)]),
    [1700, 5600, 2300]));
  push(h2('5.2 Ausnahmen'));
  push(tabelle(['Nr.', 'Ausnahme', 'Folge'],
    CP.GWG_AUSNAHMEN.map(x => [x.nr, x.ausnahme, kurz(x.folge, 175)]), [450, 2550, 6600]));

  /* ====================================================== 6 */
  push(h1neu('6 · Sonderfall-Radar'));
  push(abs('Signal erkennen, Fall zuordnen, Stop-Kriterium kennen. Neun Fälle werden im Erstgespräch erkannt. Abklärungsliste und Dokumente im Handbuch Teil J1 oder in Mappe 10.'));
  const sgr = [];
  SF.SONDERFAELLE.forEach(x => { if (x.g) { sgr.push({t: x.g, z: []}); return; } sgr[sgr.length - 1].z.push(x); });
  sgr.forEach(g => {
    push(h3(g.t));
    push(tabelle(['Nr.', 'Fall', 'Ph.', 'Signal', 'STOP', 'Reg.'],
      g.z.map(x => [x.nr, kurz(x.fall, 42), String(x.phase), kurz(x.erkennung, 105),
        kurz(x.stop, 85), x.recht || '']),
      [450, 1650, 400, 3350, 2900, 850]));
  });

  /* ====================================================== 7 */
  push(h1neu('7 · Störfall-Radar'));
  push(abs('Ein Fehler wird gemeldet, nicht verwaltet. Meldung an die Verkaufsleitung am gleichen Tag, unabhängig davon, ob eine Lösung schon gefunden ist. Nichts rückdatieren, überschreiben oder aus dem CRM entfernen. Vollständiger Ablauf im Handbuch Teil J2.'));
  const tgr = [];
  ST.STOERUNGEN.forEach(x => { if (x.g) { tgr.push({t: x.g, z: []}); return; } tgr[tgr.length - 1].z.push(x); });
  tgr.forEach(g => {
    push(h3(g.t));
    push(tabelle(['Nr.', 'Störfall', 'Sofortmassnahme', 'Wer führt', 'Rechtsprüfung nötig, wenn'],
      g.z.map(x => [x.nr, kurz(x.fall, 42), kurz(x.sofort, 145), kurz(x.wer, 45), kurz(x.recht, 105)]),
      [450, 1750, 3300, 1400, 2700]));
  });

  /* ====================================================== 8 */
  push(h1neu('8 · Die roten Linien'));
  push(abs('Dreissig Sätze. Jeder hat eine Fundstelle und einen Grund. Wer diese Seite kennt, vermeidet die Fehler, die im Nachhinein nicht mehr korrigierbar sind.'));
  push(leer());
  const rgr = [];
  ROTE_LINIEN.forEach(x => { if (x.g) { rgr.push({t: x.g, z: []}); return; } rgr[rgr.length - 1].z.push(x); });
  rgr.forEach(g => {
    push(h3(g.t));
    push(tabelle(['Nie', 'Fundstelle', 'Weshalb'],
      g.z.map(x => [x.l, x.wo, kurz(x.warum, 95)]), [4200, 1500, 3900]));
  });

  /* ====================================================== 9 */
  push(h1neu('9 · Wo steht was'));
  push(abs('Die Kurzfassung führt den Prozess. Für Abklärungslisten, Volltexte, Begründungen und Rechtsgrundlagen gilt diese Verweistabelle.'));
  push(tabelle(['Thema', 'Fundstelle', 'Was dort steht'],
    VERWEISE.map(v => [v[0], v[1], kurz(v[2], 85)]), [3100, 2500, 4000]));
  push(leer());
  push(info('Arbeitsmappen im Tagesgeschäft', [
    'Mappe 02 – Phasen, Gates, Stop-Kriterien, Dokumentencheckliste, Kontrollen, Register',
    'Mappe 06 – Interessenten und Funnel, Besichtigungen, Angebote, Preisindikatoren und Preislogik, Objektpipeline, Controlling',
    'Mappe 07 – Objektaufnahme, Raumliste, Mängelliste, offene Punkte',
    'Mappe 08 – Bewertung mit Vergleichs-, Real- und Ertragswert, Sanierungsbedarf, Nettoerlös',
    'Mappe 09 – Abschlusscheckliste, Kennzahlen, Schlüssel und Zählerstände',
    'Mappe 10 – Sonderfälle und Störfälle zum Abarbeiten',
    'Dokument 03 – Formulare F1 bis F13 · Dokument 04 – Verkaufsdossier · Dokument 05 – Kommunikationsvorlagen']));

  return k;
}

module.exports = {bloecke, ROTE_LINIEN, VERWEISE};
