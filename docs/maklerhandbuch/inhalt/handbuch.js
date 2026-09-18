/* Erzeugt 01_Maklerhandbuch_Hausverkauf.docx aus den Inhaltsmodulen. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkt, punkte, nrpunkt, nrpunkte,
       kasten_leer, checks, tabelle, info, recht, praxis, titelblatt, mono,
       flow: flowBlock} = require('../lib/blocks.js');

const {PHASEN}   = require('./phasen.js');
const {DOKUMENTE}= require('./dokumente.js');
const {RECHT}    = require('./recht.js');
const {AUFNAHME} = require('./objektaufnahme.js');
const {VORLAGEN} = require('./kommunikation.js');
const {ABSCHLUSS}= require('./abschluss.js');
const B          = require('./bausteine.js');
const BW         = require('./bewertung.js');
const F          = require('./formulare.js');

const STAND = '18. September 2026';

/* ------------------------------------------------------------- Zusatzinhalte */
const ROLLEN = [
['Makler', 'Prozessführung von der Akquise bis zum Abschluss',
 'Unterlagen beschaffen und prüfen, bewerten, vermarkten, Interessenten qualifizieren, Angebote aufbereiten, Verhandlung im Auftrag führen, Notariat und Übergabe koordinieren, dokumentieren',
 'Rechts-, Steuer- und Finanzierungsberatung; Bauexpertisen; Entscheid über den Verkauf'],
['Eigentümer', 'Alle Entscheide über Preis, Konditionen und Zuschlag',
 'Unterlagen und Belege liefern, bekannte Mängel offenlegen, Preis und Strategie festlegen, über Angebote entscheiden, Steuerschätzung und Ablösekonditionen einholen, Objekt übergeben',
 'Verhandlungsführung im Detail; direkte Kommunikation mit Interessenten während der Vermarktung'],
['Käufer', 'Kaufentscheid und Finanzierung',
 'Schriftliches Angebot einreichen, Finanzierung nachweisen, Identifikation beibringen, Kaufpreis zahlen, Versorger und Versicherungen anmelden',
 '—'],
['Notariat', 'Öffentliche Beurkundung und Abwicklung',
 'Kaufvertrag redigieren, beurkunden, Zahlung abwickeln, beim Grundbuchamt anmelden, Steuersicherstellung abwickeln, beide Parteien neutral belehren',
 'Parteiinteressen vertreten; Preisverhandlung'],
['Finanzierung (Banken)', 'Kreditentscheid und Pfandrechte',
 'Käuferfinanzierung bestätigen, bestehende Hypothek ablösen, Schuldbriefe übertragen oder neu errichten, Vorfälligkeitsentschädigung berechnen',
 'Bewertung für Verkaufszwecke; Terminzusagen ohne Kreditentscheid'],
['Grundbuchamt', 'Führung des Grundbuchs',
 'Auszüge und Belege abgeben, Eigentumsübergang eintragen, Pfandrechte behandeln',
 'Rechtsberatung; Auskunft über Werte'],
['Steueramt', 'Grundstückgewinnsteuer und Sicherstellung',
 'Steuer provisorisch berechnen, Sicherstellung bestätigen, Steuer veranlagen',
 'Bewertung; Verkaufsberatung'],
['Rechtsberatung / SRO', 'Vertragsvorlagen und Compliance',
 'Vertragsvorlagen freigeben, Sonderfälle beurteilen, geldwäschereirechtliche Weisungen und Pflichtenumfang festlegen',
 'Operative Prozessführung'],
];

const KANTONAL = [
['Notariatssystem', 'Amtsnotariat, freies Notariat oder Mischform; Zuständigkeit und Terminvorlauf', 'Kantonales Notariat', 'R1'],
['Grundbuchamt', 'Zuständige Stelle, Bestellweg für Auszüge und Belege, Bearbeitungsdauer, Gebühren', 'Grundbuchamt', 'R4'],
['Handänderungssteuer', 'Bestehen, Höhe, Bemessungsgrundlage und Kostenträger', 'Notariat, kantonale Steuerverwaltung', 'R26'],
['Beurkundungs- und Grundbuchgebühren', 'Tarif und übliche Aufteilung zwischen den Parteien', 'Notariat', 'R26'],
['Grundstückgewinnsteuer', 'System (monistisch oder dualistisch), Satz, Besitzesdauerzuschläge und -ermässigungen, Fristen, Erklärungsformular', 'Gemeinde- oder kantonales Steueramt', 'R22'],
['Sicherstellung der Steuer', 'Gesetzliches Grundpfandrecht, Rückbehalt oder Sperrkonto, Vorgehen des Notariats', 'Notariat, Steueramt', 'R25'],
['Ersatzbeschaffung', 'Fristen und Verfahren beim Steueraufschub', 'Steueramt', 'R24'],
['GEAK', 'Pflicht bei Handänderung – obligatorisch in FR, VD, NE und JU; übrige Kantone freiwillig. Aktuellen Stand bestätigen lassen', 'Kantonale Energiefachstelle', 'R33'],
['Nutzungskennzahlen', 'Bezeichnung und Definition der Ziffern, Berechnungsweise, Grenz- und Gebäudeabstände', 'Gemeinde, Bauverwaltung', 'R27'],
['Belastete Standorte', 'Zuständige Fachstelle, Bestellweg und Form des Katasterauszugs', 'Kantonale Umweltfachstelle', 'R29'],
['Naturgefahren', 'Gefahrenkarte und Auszug; obligatorische kantonale Gebäudeversicherung oder privatrechtliche Lösung', 'Kantonale Fachstelle, Gebäudeversicherung', 'R30'],
['Vollmachten', 'Formerfordernis für die Beurkundung: einfache Schriftlichkeit, Beglaubigung oder öffentliche Beurkundung', 'Notariat', 'R16'],
['Zweitwohnungen', 'Zweitwohnungsanteil der Gemeinde, Nutzungsbeschränkungen und Anmerkungen', 'Gemeinde', 'R35'],
['Bäuerliches Bodenrecht', 'Zuständige Behörde, Bewilligungsverfahren, Preisschranke', 'Kantonale Landwirtschaftsbehörde', 'R36'],
['Lex Koller', 'Zuständige Bewilligungsbehörde und Verfahren', 'Kantonale Bewilligungsbehörde', 'R34'],
['Mehrwertabgabe', 'Bestehen und Höhe bei Ein- und Umzonungen', 'Kanton, Gemeinde', 'R28'],
];

const FLOW = ['Lead', 'Erstkontakt', 'Erstgespräch', 'Objektaufnahme', 'Unterlagenprüfung',
  'Bewertung', 'Verkaufspreis', 'Maklervertrag', 'Vermarktung', 'Interessenten',
  'Besichtigungen', 'Angebote', 'Verhandlung', 'Reservation', 'Notariat', 'Kaufvertrag',
  'Eigentumsübertragung', 'Übergabe', 'Abschluss'];

const FLOW_PHASE = {Lead: '1', Erstkontakt: '2', 'Erstgespräch': '3', Objektaufnahme: '4',
  'Unterlagenprüfung': '5–6', Bewertung: '7–8', Verkaufspreis: '9', Maklervertrag: '10',
  Vermarktung: '11–12', Interessenten: '13', Besichtigungen: '14', Angebote: '15',
  Verhandlung: '16', Reservation: '17', Notariat: '17', Kaufvertrag: '18',
  'Eigentumsübertragung': '19', 'Übergabe': '20', Abschluss: '20'};

const TEILE = [
 ['A', 'Überblick, Rollen und Kennzeichnung'],
 ['B', 'Die zwanzig Phasen des Verkaufsprozesses'],
 ['C', 'Dokumenten-Checkliste, Gruppen A bis E'],
 ['D', 'Erstgesprächsleitfaden und Ableitung der Verkaufsstrategie'],
 ['E', 'Objektaufnahme- und Besichtigungsformular'],
 ['F', 'Bewertung und Verkaufspreisempfehlung'],
 ['G', 'Maklermandat, Struktur'],
 ['H', 'Verkaufsdossier, Struktur'],
 ['I', 'Inserat und Kanaltexte'],
 ['J', 'Fotografie- und Marketing-Checkliste'],
 ['K', 'Interessentenmanagement und CRM'],
 ['L', 'Besichtigung'],
 ['M', 'Kaufangebot'],
 ['N', 'Verhandlung und Entscheidungsvorlage'],
 ['O', 'Reservation'],
 ['P', 'Notariat und Kaufvertrag'],
 ['Q', 'Übergabeprotokoll'],
 ['R', 'Abschlusscheckliste des Maklers'],
 ['S', 'Dokumentenordner und Dateibenennung'],
 ['T', 'Kommunikationsvorlagen, Übersicht'],
 ['U', 'Makler-Controlling'],
 ['V', 'Verkaufsprozess als Flow'],
 ['W', 'Rechtsgrundlagen-Register und Quellen'],
];

/* ------------------------------------------------------------------ Aufbau */
function kinder() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  /* ---------------------------------------------------------- Titelblatt */
  push(titelblatt({
    marke: 'Makler-Handbuch',
    titel: 'Hausverkauf Schweiz',
    untertitel: 'Verkaufsprozess, Checklisten, Formulare und Vorlagen',
    stand: `Fassung vom ${STAND} · Version 1 · Internes Arbeitsdokument`}));

  push(info('Wozu dieses Handbuch dient', [
    'Es beschreibt den vollständigen Verkauf eines Hauses in der Schweiz – von der Eigentümerakquise bis zur Nachbetreuung – in zwanzig Phasen mit klaren Abschlusskriterien.',
    'Es ist als Arbeitsmittel gebaut, nicht als Lehrtext: Eine neue Mitarbeiterin oder ein neuer Mitarbeiter soll einen Hausverkauf damit Schritt für Schritt durchführen können, ohne einen Prozessschritt oder eine Unterlage zu vergessen.',
    'Die Phasen in Teil B sind der Leitfaden. Die Teile C bis W sind die Werkzeuge, auf die die Phasen verweisen.',
    'Zu jedem Teil gehört eine ausfüllbare Datei. Die Zuordnung steht in der Dateiübersicht am Ende von Teil A.']));
  push(leer());

  push(recht([
    'Dieses Handbuch ist ein internes Arbeitsmittel und keine Rechtsberatung. Es nennt zu jedem rechtlich relevanten Punkt die Rechtsgrundlage im Register in Teil W.',
    'Alle mit [RP] gekennzeichneten Punkte sind vor der Verwendung durch das Notariat oder die Rechtsberatung des Unternehmens zu prüfen. Das gilt namentlich für sämtliche Vertrags-, Reservations- und Angebotsvorlagen.',
    'Alle mit [KA] gekennzeichneten Punkte sind kantonal unterschiedlich geregelt. Sie sind vor jedem Mandat für den betroffenen Kanton abzuklären; die Klärungsliste steht in Abschnitt A6.',
    'Rechtsstand des Registers in Teil W: 18. September 2026. Rechtslage und kantonale Praxis ändern sich; das Register ist vor jeder Mandatsausfertigung auf Aktualität zu prüfen.']));

  push(leer());
  push(h2('Inhaltsübersicht'));
  push(tabelle(['Teil', 'Gegenstand'], TEILE, [900, 8700]));

  /* =========================================================== TEIL A */
  push(h1neu('Teil A · Überblick, Rollen und Kennzeichnung'));

  push(h2('A1 · Zweck, Geltungsbereich und Abgrenzung'));
  push(abs('Gegenstand ist der Verkauf eines einzelnen Wohnobjekts in der Schweiz, im Regelfall eines Einfamilienhauses im Alleineigentum oder Miteigentum. Der Prozess beginnt mit der Erfassung eines Leads und endet mit dem Abschluss des Objektdossiers und der Nachbetreuung des Eigentümers.'));
  push(abs('Mehrfamilienhäuser und Renditeobjekte folgen demselben Prozess, verlangen aber in den Phasen 7 und 8 eine zusätzliche Ertragswertrechnung sowie in Phase 5 Mietverträge, Mietzinsaufstellungen und Nebenkostenabrechnungen. Die entsprechenden Positionen sind als situationsabhängig gekennzeichnet.'));
  push(abs('Nicht Gegenstand dieses Handbuchs sind:'));
  push(punkte([
    'Rechts-, Steuer- und Finanzierungsberatung. Der Makler erteilt sie nicht und verweist an die zuständige Stelle.',
    'Bautechnische Beurteilungen und Gutachten.',
    'Der Verkauf von Bauland ohne Gebäude, von landwirtschaftlichen Gewerben und von Objekten im Zwangsverwertungsverfahren. Diese Fälle folgen Sonderregeln und werden nur mit Freigabe der Rechtsabteilung bearbeitet.',
    'Die Bedienung der eingesetzten Systeme. Wie ein Schritt im CRM erfasst wird, regelt die Systemanleitung.']));

  push(h2('A2 · Rollen und Verantwortlichkeiten'));
  push(abs('Der Prozess trennt durchgehend zwischen sieben Rollen. Wer welche Aufgabe hat und – ebenso wichtig – wer welche Aufgabe nicht hat:'));
  push(tabelle(['Rolle', 'Verantwortung', 'Aufgaben', 'Ausdrücklich nicht zuständig für'],
    ROLLEN, [1300, 1700, 3600, 3000]));
  push(leer());
  push(praxis('Der wichtigste Satz dieses Handbuchs', [
    'Der Makler entscheidet nicht über den Verkauf. Er liefert dem Eigentümer vollständige, vergleichbare und wertungsfreie Entscheidungsgrundlagen und setzt dessen schriftlichen Entscheid um.',
    'Das gilt für den Angebotspreis, für jede Preisanpassung, für die Annahme eines Angebots und für jeden Verhandlungsschritt. Ohne schriftlichen Auftrag des Eigentümers wird nicht verhandelt.']));

  push(h2('A3 · Kennzeichnungssystem'));
  push(tabelle(['Kennzeichen', 'Bedeutung', 'Folge für die Arbeit'], [
    ['[RP]', 'Rechtliche Prüfung durch Notariat / Rechtsberatung erforderlich',
     'Vorlage oder Formulierung nicht ohne Freigabe verwenden. Bei Abweichung vom freigegebenen Text erneut vorlegen.'],
    ['[KA]', 'Kantonal unterschiedlich geregelt',
     'Vor Mandatsbeginn für den betroffenen Kanton abklären und die Auskunft mit Quelle und Datum ablegen.'],
    ['[GW]', 'Geldwäschereirechtlich relevant',
     'Weisung des Unternehmens und der Selbstregulierungsorganisation befolgen; Dokumentation gesondert archivieren.'],
    ['R1 … R41', 'Verweis auf das Rechtsgrundlagen-Register in Teil W',
     'Dort stehen Rechtsgrundlage, Kerninhalt und die Umsetzung in der Praxis.'],
    ['K1 … K20', 'Verweis auf eine Kommunikationsvorlage',
     'Volltext in Dokument 05; Übersicht in Teil T.'],
    ['F1 … F9', 'Verweis auf ein Formular',
     'Volltext in Dokument 03; Fundstellen in Teil T.'],
  ], [1200, 3400, 5000]));

  push(h2('A4 · Gesamtübersicht des Verkaufsprozesses'));
  push(abs('Zwanzig Phasen. Die Dauer ist ein Richtwert in Arbeitstagen ab Phasenbeginn; die Phasen 5 bis 8 laufen teilweise parallel. Eine Phase ist erst abgeschlossen, wenn ihr Meilenstein erreicht ist – die Abschlusskriterien stehen je Phase in Teil B unter «Weiter zur nächsten Phase, wenn».'));
  push(tabelle(['Nr.', 'Phase', 'Verantwortung', 'Tage', 'Meilenstein'],
    PHASEN.map(p => [String(p.nr), p.name, p.verantwortung, p.dauer,
      p.ergebnis.length > 130 ? p.ergebnis.slice(0, 127) + '…' : p.ergebnis]),
    [500, 2400, 1600, 700, 4400]));

  push(h2('A5 · Wo der Prozess in der Praxis scheitert'));
  push(abs('Die folgenden fünf Punkte verursachen nach Erfahrung die meisten gescheiterten oder verzögerten Verkäufe. Sie sind der Grund, weshalb dieses Handbuch an den entsprechenden Stellen streng ist.'));
  push(tabelle(['Ursache', 'Wirkung', 'Gegenmassnahme im Prozess'], [
    ['Unvollständige Verfügungsbefugnis', 'Der Verkauf scheitert kurz vor der Beurkundung, weil eine Unterschrift fehlt',
     'Phase 3 und 6: Verfügungsbefugnis nachweisen, bevor Vermarktungskosten entstehen (R13–R16)'],
    ['Überhöhter Angebotspreis', 'Die wichtigsten zwei Wochen verstreichen ohne Nachfrage; die Standzeit erzwingt später Preisabschläge',
     'Phase 9: Konsequenzen schriftlich aufzeigen, Anpassungsmechanismus mit Auslösekriterien vereinbaren'],
    ['Verschwiegene Mängel', 'Abbruch nach der Besichtigung oder Gewährleistungsansprüche nach dem Verkauf',
     'Phase 4: unterzeichnete Mängelliste; Phase 11: Offenlegung im Dossier; Phase 14: Offenlegung protokollieren (R10, R11)'],
    ['Nicht belegte Finanzierung', 'Die Reservation platzt, die Vermarktung muss neu aufgenommen werden',
     'Phase 15: objektbezogene Bankbestätigung vor der Vorlage beim Eigentümer, nicht danach (R40)'],
    ['Unvollständige Unterlagen beim Notariat', 'Wochenlange Verzögerung zwischen Einigung und Beurkundung',
     'Phase 17: Notariatscheckliste F6 vollständig; Bestätigung der Vollständigkeit durch das Notariat einholen'],
  ], [2000, 3400, 4200]));

  push(h2('A6 · Kantonale Klärungsliste, vor Mandatsbeginn'));
  push(abs('Die Schweiz hat kein einheitliches Immobilientransaktionsrecht. Notariatssystem, Steuern, Gebühren, Energienachweise und Nutzungskennzahlen sind kantonal – teilweise kommunal – geregelt. Diese Liste wird je Kanton einmal erstellt, mit Quelle und Datum abgelegt und mindestens jährlich überprüft.'));
  push(tabelle(['Thema', 'Was abzuklären ist', 'Bei welcher Stelle', 'Register'],
    KANTONAL, [1700, 4300, 2500, 1100]));
  push(leer());
  push(recht([
    'Keine Zahl und keine Frist aus einem anderen Kanton übernehmen. Kaufnebenkosten, Steuersätze und Fristen werden je Objekt für den zuständigen Kanton erfragt und mit Quelle und Datum im Dossier zitiert.']));

  push(h2('A7 · Dateien zu diesem Handbuch'));
  push(tabelle(['Datei', 'Inhalt', 'Grundlage im Handbuch'], [
    ['01_Maklerhandbuch_Hausverkauf.pdf', 'Dieses Handbuch', 'Alle Teile'],
    ['02_Makler_Checklisten.xlsx', 'Phasen-, Dokumenten-, Vermarktungs- und Prüfcheckliste zum Abarbeiten je Objekt', 'Teile B, C, J'],
    ['03_Makler_Formulare.docx', 'Formulare F1 bis F9 zum Ausfüllen', 'Teile D, L, M, N, O, P, Q'],
    ['04_Verkaufsdossier_Vorlage.docx', 'Verkaufsdossier mit 23 Abschnitten als Platzhaltervorlage', 'Teil H'],
    ['05_Kommunikationsvorlagen.docx', 'Zwanzig E-Mail- und Gesprächsvorlagen K1 bis K20', 'Teil T'],
    ['06_Interessentenmanagement.xlsx', 'CRM-Liste, Besichtigungsjournal und Controlling-Dashboard', 'Teile K, U'],
    ['07_Objektaufnahme.xlsx', 'Objektaufnahme in 16 Blöcken mit 182 Feldern', 'Teil E'],
    ['08_Bewertung_Vorlage.xlsx', 'Vergleichswert, Realwert, Ertragswert, Sanierungsbedarf, Wertspanne, Nettoerlös', 'Teil F'],
    ['09_Verkaeufer_Abschlusscheckliste.xlsx', 'Abschlusscheckliste mit 65 Positionen', 'Teil R'],
  ], [3000, 4500, 2100]));

  /* =========================================================== TEIL B */
  push(h1neu('Teil B · Die zwanzig Phasen des Verkaufsprozesses'));
  push(abs('Jede Phase ist nach demselben Raster aufgebaut. Die Rubrik «Weiter zur nächsten Phase, wenn» ist verbindlich: Solange ein Kriterium offen ist, wird die nächste Phase nicht begonnen. Ausnahmen werden im Objektdossier begründet.'));

  PHASEN.forEach(p => {
    push(h2(`Phase ${p.nr} · ${p.name}`));
    push(tabelle(['Verantwortung', 'Richtwert Dauer', 'Rechtsgrundlagen (Teil W)'],
      [[p.verantwortung, p.dauer + (p.dauer === 'laufend' ? '' : ' Arbeitstage'),
        p.recht.length ? p.recht.join(', ') : '—']],
      [2600, 2600, 4400]));
    push(leer());

    push(h4('Ziel'));
    push(abs(p.ziel));

    push(h4('Aufgaben des Maklers'));
    push(punkte(p.makler));

    push(h4('Aufgaben des Eigentümers'));
    push(punkte(p.eigentuemer));

    push(h4('Benötigte Unterlagen'));
    push(punkte(p.unterlagen));

    push(h4('Prüfungen'));
    push(punkte(p.pruefungen));

    push(h4('Kommunikation'));
    push(punkte(p.kommunikation));

    push(h4('Ergebnis / Meilenstein'));
    push(abs(p.ergebnis));

    push(h4('Weiter zur nächsten Phase, wenn'));
    push(checks(p.weiter));
    push(leer());
  });


  /* =========================================================== TEIL C */
  push(h1neu('Teil C · Dokumenten-Checkliste, Gruppen A bis E'));
  push(abs('Diese Liste ist die Grundlage der Phase 5. Sie wird je Objekt eröffnet, mit Verantwortlichkeit und Frist versehen und bis zum Abschluss geführt. Zu jeder beschafften Unterlage werden Quelle, Ausstellungsdatum und Bezugsdatum festgehalten.'));
  push(leer());
  push(tabelle(['Stufe', 'Bedeutung'], [
    ['Pflicht', 'Ohne diese Unterlage wird nicht vermarktet. Fehlt sie bei Vermarktungsstart, ist der Grund im Dossier zu begründen und vom Vorgesetzten freizugeben.'],
    ['empfehlenswert', 'Verbessert Bewertung, Vertrauen oder Abwicklung deutlich. Fehlen ist zu begründen.'],
    ['situationsabhängig', 'Nur bei Vorliegen des beschriebenen Sachverhalts. Ob der Sachverhalt vorliegt, ist aktiv zu prüfen und zu dokumentieren – auch ein «nicht zutreffend» ist ein Ergebnis.'],
  ], [1600, 8000]));
  push(leer());

  const gruppen = [];
  DOKUMENTE.forEach(d => {
    if (d.g) { gruppen.push({titel: d.g, zeilen: []}); return; }
    gruppen[gruppen.length - 1].zeilen.push(d);
  });
  gruppen.forEach(gr => {
    push(h2(gr.titel));
    push(tabelle(['Nr.', 'Unterlage', 'Stufe', 'Beschafft durch', 'Bezugsquelle', 'Hinweis', 'Reg.'],
      gr.zeilen.map(d => [d.nr, d.dok, d.stufe, d.wer, d.quelle, d.bemerkung, d.recht || '—']),
      [480, 1720, 1050, 900, 1300, 3350, 800]));
  });
  push(leer());
  push(praxis('Reihenfolge der Beschaffung', [
    'Zuerst den Grundbuchauszug samt Belegen bestellen. Er bestimmt, ob und in welcher Form überhaupt verkauft werden kann, und er nennt die Belege, die zusätzlich zu beschaffen sind.',
    'Danach die behördlichen Auskünfte mit langer Bearbeitungsdauer: Zonenauskunft, Katasterauszug belastete Standorte, Baudossier im Gemeindearchiv, GEAK in Pflichtkantonen.',
    'Parallel setzt der Eigentümer seine eigenen Unterlagen zusammen. Die Belegsammlung für die Grundstückgewinnsteuer wird am ersten Tag angestossen, nicht am letzten – fehlende Rechnungen sind nach Jahren nicht mehr auffindbar.']));

  /* =========================================================== TEIL D */
  push(h1neu('Teil D · Erstgesprächsleitfaden und Ableitung der Verkaufsstrategie'));
  push(abs('Der Leitfaden gehört zu Phase 3 und ist als Formular F1 ausfüllbar. Reihenfolge einhalten: Sie führt von der sachlichen Ausgangslage über das Motiv zum Preis. Wer mit dem Preis beginnt, erfährt den Rest nicht mehr.'));
  push(info('Drei Regeln für das Erstgespräch', [
    'Erst zuhören, dann erklären. Der Eigentümer soll in der ersten Hälfte des Gesprächs sprechen.',
    'Keine Preisnennung und keine Bandbreite vor der Objektaufnahme und der Bewertung. Wer im Erstgespräch eine Zahl nennt, verliert sie später nicht mehr.',
    'Die Antworten wörtlich notieren, besonders bei der Frage, was der Eigentümer an der Liegenschaft schätzt. Das sind die glaubwürdigsten Verkaufsargumente – und sie stehen in keinem Dossier, das aus Unterlagen entsteht.']));

  F.ERSTGESPRAECH.forEach(b => {
    push(h2(b.block));
    push(tabelle(['Frage', 'Weshalb sie gestellt wird', 'Was die Antwort bedeutet'],
      b.fragen.map(f => [f.frage, f.warum, f.folge]), [3200, 3200, 3200]));
  });

  push(h2('D7 · Ableitung der Verkaufsstrategie'));
  push(abs('Aus dem Erstgespräch und der Bewertung folgt die Strategie. Sie wird in Phase 9 mit dem Eigentümer festgelegt und protokolliert. Die folgenden acht Ausgangslagen decken die Regelfälle ab; Mischformen werden begründet zusammengesetzt.'));
  F.STRATEGIE.forEach((s, i) => {
    push(h4(`Ausgangslage ${i + 1} · ${s.lage}`));
    push(mix([{text: 'Empfehlung: ', bold: true}, s.empfehlung]));
    push(mix([{text: 'Begründung: ', bold: true}, s.begruendung]));
  });
  push(leer());
  push(info('Was in jedem Strategieprotokoll steht', [
    'Angebotspreis und Mindestpreis, letzterer als intern klassifiziert.',
    'Vermarktungsform: offen oder diskret, mit den vom Eigentümer zur Kenntnis genommenen Konsequenzen.',
    'Kanäle, Zielgruppe, Besichtigungsform und Zeitplan mit Starttag.',
    'Auslösekriterien für eine Strategieanpassung: nach welcher Zahl von Tagen, Anfragen oder Besichtigungen ohne Angebot wird das Vorgehen überprüft, und was geschieht dann.',
    'Vorgehen bei mehreren gleichzeitigen Angeboten.',
    'Datum und Unterschrift aller Verfügungsberechtigten.']));

  /* =========================================================== TEIL E */
  push(h1neu('Teil E · Objektaufnahme- und Besichtigungsformular'));
  push(abs('Die Objektaufnahme gehört zu Phase 4 und ist als Arbeitsmappe 07 ausfüllbar. Sie ist die gemeinsame Datengrundlage für Bewertung, Dossier und Inserat: Was hier nicht erfasst ist, fehlt später dreifach.'));
  push(info('Grundsätze der Aufnahme', [
    'Raum für Raum vorgehen, nichts auslassen – auch Keller, Estrich, Technikraum und Nebengebäude.',
    'Flächen nicht schätzen. Wohnflächen aus den Bauplänen mit Berechnungsnorm, Grundstücksflächen aus dem Grundbuchauszug.',
    'Jedes Feld ausfüllen. Ein offenes Feld wird ausdrücklich mit «zu klären» markiert und in die Liste der offenen Punkte übernommen – ein leeres Feld ist kein Ergebnis.',
    'Zustandsbewertungen konsequent in derselben Skala: neu, gut, gebraucht, sanierungsbedürftig, nicht vorhanden.',
    'Arbeitsfotos zu jedem Raum. Sie dienen der Dokumentation, nicht der Vermarktung.']));

  AUFNAHME.forEach(b => {
    push(h3(b.block));
    push(tabelle(['Feld', 'Erfassung', 'Hinweis'],
      b.felder.map(f => [f.feld, artText(f.art), f.hinweis || '']),
      [3300, 2500, 3800]));
  });

  /* =========================================================== TEIL F */
  push(h1neu('Teil F · Bewertung und Verkaufspreisempfehlung'));
  push(abs('Die Bewertung gehört zu den Phasen 7 und 8 und wird in der Arbeitsmappe 08 gerechnet. Ergebnis ist eine Wertspanne mit begründeter Gewichtung, nicht ein Punktwert.'));

  push(h2('F1 · Methoden'));
  BW.METHODEN.forEach(m => {
    push(h4(m.m));
    push(mix([{text: 'Einsatz: ', bold: true}, m.einsatz]));
    push(mix([{text: 'Vorgehen: ', bold: true}, m.vorgehen]));
    push(mix([{text: 'Grenzen: ', bold: true}, m.grenzen]));
  });
  push(leer());
  push(recht([
    'Diese Bewertung ist eine Verkaufspreisempfehlung im Rahmen eines Verkaufsmandats. Sie ist keine Schatzung im Rechtssinne und kein Gutachten für Steuer-, Erb- oder Gerichtszwecke. Wird eine solche Bewertung verlangt, ist eine qualifizierte Schätzungsexpertise zu beauftragen; dieser Hinweis gehört in jeden Bewertungsbericht.']));

  push(h2('F2 · Einflussfaktoren und ihre Quellen'));
  push(tabelle(['Faktor', 'Wirkung auf den Wert', 'Quelle'],
    BW.EINFLUSS.map(e => [e.f, e.wirkung, e.quelle]), [2000, 4600, 3000]));

  push(h2('F3 · Ablauf der Bewertung'));
  BW.ABLAUF.forEach(s => {
    const m = s.match(/^(\d+)\.\s+(.*)$/);
    push(nrpunkt(m ? m[1] + '.' : '–', m ? m[2] : s));
  });
  push(leer());
  push(praxis('Plausibilitätsprüfungen vor der Unterschrift', [
    'Preis pro Quadratmeter Wohnfläche gegen die Vergleichsobjekte: liegt er in der Spanne des Segments?',
    'Landwert gegen Gesamtwert: der Landanteil liegt bei Einfamilienhäusern je nach Lage typischerweise zwischen 30 und 60 Prozent. Starke Abweichungen sind zu erklären.',
    'Neuwert Gebäude gegen Gebäudeversicherungswert: erhebliche Abweichungen deuten auf einen falschen Kubikmeterpreis oder eine veraltete Schatzung.',
    'Summe des Sanierungsbedarfs gegen den Zeitbauwert: ein Sanierungsbedarf über 40 Prozent des Zeitbauwerts verlangt eine Zustandsanalyse durch eine Fachperson.',
    'Vergleichswert gegen Realwert: Abweichungen über 15 Prozent sind zu begründen, nicht zu mitteln.']));

  push(h2('F4 · Vorlage «Immobilienbewertung / Verkaufspreisempfehlung»'));
  push(abs('Der Bericht enthält die folgenden Abschnitte in dieser Reihenfolge. Jeder Abschnitt ist zu füllen; nicht anwendbare Abschnitte werden mit Begründung als solche bezeichnet.'));
  push(tabelle(['Abschnitt', 'Inhalt'],
    BW.VORLAGE.map(v => [v.a, v.i]), [2400, 7200]));

  push(h2('F5 · Rechenschema Realwert'));
  push(tabelle(['Position', 'Einheit', 'Herkunft'],
    BW.REALWERT.map(r => [r.pos, r.einheit,
      r.formel ? 'Berechnet' : (r.hinweis || 'Eingabe')]), [4000, 1600, 4000]));
  push(leer());
  push(h2('F6 · Bauteile für die Erfassung des Sanierungsbedarfs'));
  push(abs('Der Sanierungsbedarf wird bauteilweise mit Kostenschätzung und Zeithorizont erfasst, nie als Pauschale. Nur so lässt er sich gegenüber Eigentümer und Käufer begründen.'));
  push(punkte(BW.SANIERUNG_BAUTEILE));

  /* =========================================================== TEIL G */
  push(h1neu('Teil G · Maklermandat, Struktur'));
  push(recht([
    'Dieser Teil ist eine Strukturvorgabe, keine Vertragsvorlage und kein Vertragstext. Er benennt, welche Punkte ein Maklermandat regeln muss und worauf dabei zu achten ist.',
    'Verwendet wird ausschliesslich die vom Unternehmen freigegebene Vertragsvorlage. Jede Abweichung von der freigegebenen Fassung ist vor der Ausfertigung erneut der Rechtsberatung vorzulegen.',
    'Die mit [RP] gekennzeichneten Ziffern sind rechtlich besonders sensibel und in jedem Fall durch das Notariat oder die Rechtsberatung zu prüfen.']));
  push(leer());
  push(tabelle(['Zi.', 'Gegenstand', 'Was zu regeln ist', 'Prüfung', 'Reg.'],
    B.MANDAT.map(m => [m.zi, m.titel, m.inhalt, m.pruefen ? '[RP]' : '—',
      m.recht || '—']),
    [450, 1750, 5500, 800, 1100]));
  push(leer());
  push(info('Drei Klauseln, die in der Praxis am häufigsten Streit auslösen', [
    'Die Nachwirkung (Ziffer 18): Kommt der Verkauf nach Mandatsende mit einem während der Laufzeit nachgewiesenen Interessenten zustande, entsteht die Frage nach dem Honorar. Die Klausel ist zeitlich und sachlich eng zu fassen, und nachgewiesene Interessenten sind laufend dokumentiert festzuhalten.',
    'Die Exklusivität (Ziffer 15): Ob und mit welcher Folge der Eigentümer selbst verkaufen darf, muss ausdrücklich geregelt sein. Schweigen führt zum Streit.',
    'Der Aufwandersatz (Ziffer 12): Ohne ausdrückliche Vereinbarung besteht kein Anspruch auf Ersatz von Aufwendungen. Wer Vermarktungskosten ersetzt haben will, muss das vereinbaren – und begrenzen.']));

  /* =========================================================== TEIL H */
  push(h1neu('Teil H · Verkaufsdossier, Struktur'));
  push(abs('Das Dossier entsteht in Phase 11 und ist als Vorlage in Dokument 04 angelegt. Reihenfolge der 23 Abschnitte ist verbindlich; sie folgt der Lesereihenfolge eines Kaufinteressenten.'));
  push(tabelle(['Nr.', 'Abschnitt', 'Inhalt'],
    B.DOSSIER.map(d => [String(d.nr), d.titel, d.inhalt]), [520, 2080, 7000]));
  push(leer());
  push(praxis('Die beiden Abschnitte, die über die Qualität entscheiden', [
    'Abschnitt 18, Renovationen und offener Sanierungsbedarf: Die Versuchung ist gross, den Sanierungsbedarf weglassen zu wollen. Das Gegenteil ist richtig. Ein offen benannter, bezifferter Sanierungsbedarf begrenzt den Abschlag auf das Sachliche; ein verschwiegener erzeugt Misstrauen gegenüber allen übrigen Angaben und führt zum Abbruch nach der Besichtigung.',
    'Abschnitt 23, rechtliche Hinweise: Jede Angabe im Dossier kann als Zusicherung gelten. Der Hinweisabschnitt ersetzt keine Sorgfalt bei den Angaben, aber er grenzt ab, worauf die Angaben beruhen, und nennt Norm und Quelle der Flächen.']));
  push(leer());
  push(recht([
    'Abschnitt 21, Kaufnebenkosten: Handänderungsabgaben sowie Beurkundungs- und Grundbuchgebühren sind kantonal und teilweise kommunal geregelt. Sie werden für den konkreten Kanton beim Notariat erfragt und als Spanne mit Quelle, Datum und Unverbindlichkeitsvermerk ausgewiesen (R26).',
    'Abschnitt 23, rechtliche Hinweise: Formulierung durch die Rechtsberatung freigeben lassen und unverändert übernehmen.']));

  /* =========================================================== TEIL I */
  push(h1neu('Teil I · Inserat und Kanaltexte'));
  push(abs('Die Texte entstehen in Phase 11 und gehen in Phase 12 online. Grundhaltung: hochwertig und präzise, nicht werblich überzogen. Konkrete Angaben überzeugen Käufer; Superlative erzeugen Misstrauen.'));

  push(h2('I1 · Aufbau des Inseratstexts'));
  push(tabelle(['Abschnitt', 'Inhalt und Anforderung'],
    F_INSERAT(), [2200, 7400]));

  push(h2('I2 · Kanäle und ihre Besonderheiten'));
  push(tabelle(['Kanal', 'Textlänge', 'Besonderheiten'],
    B.INSERAT_KANAELE.map(k2 => [k2.kanal, k2.laenge, k2.hinweis]), [2200, 2600, 4800]));

  push(h2('I3 · Sprachregeln'));
  push(punkte([
    'Keine Superlative und keine Ausrufezeichen: nicht «einmalige Traumlage», sondern «Südlage am Hang, unverbaubare Sicht auf [Objekt] gemäss Zonenplan».',
    'Keine Behauptungen ohne Beleg. «Ruhige Lage» ist eine Behauptung; «Sackgasse, kein Durchgangsverkehr, Tempo 30» ist eine Angabe.',
    'Keine Angabe, die nicht im Dossier belegt ist – jede Aussage im Inserat kann als Zusicherung gelten (R9).',
    'Zahlen statt Adjektive: Baujahr, Sanierungsjahr, Fläche, Gehminuten, Leistung in kWp.',
    'Ausbaupotenzial nur mit behördlicher Bestätigung erwähnen und die Quelle nennen (R27).',
    'Energieangaben nur bei vorliegendem GEAK; ohne GEAK das Heizsystem beschreiben, nicht die Effizienz behaupten (R33).',
    'Keine Zielgruppenansprache mit diskriminierendem Bezug. Das Objekt beschreiben, nicht die erwünschten Käufer.',
    'Bilder mit virtueller Möblierung ausdrücklich als solche bezeichnen.',
    'Einheitliche Schreibweise von Flächen, Zimmerzahlen und Baujahren über alle Kanäle – Abweichungen sind die häufigste Reklamationsquelle.']));

  /* =========================================================== TEIL J */
  push(h1neu('Teil J · Fotografie- und Marketing-Checkliste'));
  push(abs('Die Bildqualität entscheidet über die Klickrate und damit über die Anzahl der Anfragen. Der Aufnahmetermin gehört zu Phase 11 und wird nach Jahreszeit, Tageszeit und Wetter geplant – nicht nach dem Kalender des Fotografen.'));

  push(h2('J1 · Vorbereitung durch den Eigentümer'));
  push(abs('Diese Liste geht zwei Wochen vor dem Aufnahmetermin an den Eigentümer.'));
  push(checks(B.FOTO_VORBEREITUNG));

  push(h2('J2 · Zwingende Aufnahmen'));
  push(abs('Fehlt eine dieser Aufnahmen, entstehen Rückfragen und unnötige Besichtigungen. Interessenten misstrauen Objekten, deren Keller, Technik oder Nebenräume nicht gezeigt werden.'));
  push(checks(B.FOTO_PFLICHT));

  push(h2('J3 · Aufnahmen, die zu vermeiden sind'));
  push(punkte(B.FOTO_MEIDEN));

  push(h2('J4 · Reihenfolge der Bilder im Inserat'));
  push(abs('Die ersten drei Bilder bestimmen, ob das Inserat geöffnet wird. Reihenfolge über alle Kanäle identisch halten.'));
  B.FOTO_REIHENFOLGE.forEach(r => {
    const m = r.match(/^(\d+)\.\s+(.*)$/);
    push(nrpunkt(m ? m[1] + '.' : '–', m ? m[2] : r));
  });

  push(h2('J5 · Zusatzleistungen'));
  push(tabelle(['Leistung', 'Wann sinnvoll', 'Worauf zu achten ist'],
    B.FOTO_ZUSATZ.map(z => [z.leistung, z.wann, z.hinweis]), [1900, 3700, 4000]));
  push(leer());
  push(recht([
    'Bildrechte und Nutzungsdauer sind mit dem Fotografen schriftlich zu regeln, einschliesslich der Nutzung nach Mandatsende.',
    'Persönlichkeitsrechte: keine identifizierbaren Personen, keine Nachbarfenster, keine Kennzeichen. Bei Drohnenaufnahmen zusätzlich die Vorschriften des Flugbetriebs und die Rechte der Nachbarn beachten.',
    'Virtuelle Möblierung darf Ausbau und Bausubstanz nicht verändern – das wäre eine unzutreffende Zusicherung (R9).']));

  /* =========================================================== TEIL K */
  push(h1neu('Teil K · Interessentenmanagement und CRM'));
  push(abs('Interessentenmanagement gehört zu Phase 13 und wird in der Arbeitsmappe 06 geführt. Grundsatz: Jede Anfrage wird innerhalb von vier Arbeitsstunden beantwortet und erfasst, und jeder Interessent hat jederzeit eine nächste Aktion mit Datum.'));

  push(h2('K1 · Ablauf'));
  push(abs('Anfrage → Qualifizierung → Unterlagen → Besichtigung → Rückmeldung → Kaufinteresse → Finanzierungsprüfung → Angebot → Verhandlung'));
  push(tabelle(['Schritt', 'Was geschieht', 'Ergebnis', 'Weiter, wenn'], [
    ['Anfrage', 'Erfassung im CRM mit Quelle und Datum; Kurzdossier versandt',
     'Interessent ist erfasst', 'Kontaktdaten und Objektbezug liegen vor'],
    ['Qualifizierung', 'Gespräch nach Formular F2: Haushalt, Wohnsituation, Kaufabsicht, Finanzierungsstand, erwerbsrechtliche Zulässigkeit',
     'Einstufung A, B oder C', 'Stufe ist gesetzt und begründet'],
    ['Unterlagen', 'Vollständiges Dossier gegen Empfangsbestätigung; Datenschutzerklärung',
     'Dossier ist zugestellt', 'Empfang ist dokumentiert'],
    ['Besichtigung', 'Termin nach Checkliste F3; Interessentenformular vor Ort vervollständigt',
     'Besichtigung ist protokolliert', 'Protokoll und Offenlegungsvermerk liegen vor'],
    ['Rückmeldung', 'Strukturierte Erhebung innerhalb von 48 Stunden nach Vorlage K11',
     'Rückmeldung ist erfasst', 'Preisempfinden und Ablehnungsgrund sind erfasst'],
    ['Kaufinteresse', 'Formular «Kaufangebot» F4 abgegeben und erläutert',
     'Angebot ist angekündigt', 'Interessent bestätigt die Absicht mit Termin'],
    ['Finanzierungsprüfung', 'Objektbezogene Bankbestätigung und Eigenmittelnachweis verlangt',
     'Finanzierung ist belegt', 'Schriftliche Bestätigung liegt vor (R40)'],
    ['Angebot', 'Schriftliches Angebot mit Eingangsvermerk; Angebotsvergleich erstellt',
     'Angebot ist vorlagefähig', 'Angebot ist vollständig und vergleichbar'],
    ['Verhandlung', 'Entscheidungsvorlage F5; schriftlicher Auftrag des Eigentümers',
     'Verhandlungsauftrag liegt vor', 'Entscheid des Eigentümers ist schriftlich'],
  ], [1500, 3700, 2200, 2200]));

  push(h2('K2 · Einstufung der Interessenten'));
  push(tabelle(['Stufe', 'Kriterium', 'Behandlung'], [
    ['A', 'Finanzierung schriftlich bestätigt oder plausible Selbstauskunft mit belegten Eigenmitteln; entscheidungsbefugt; erwerbsrechtlich zulässig',
     'Besichtigung, vollständiges Dossier, aktive Begleitung'],
    ['B', 'Interesse vorhanden, Finanzierung offen oder in Abklärung; Mitentscheider fehlt',
     'Besichtigung nur in begründeten Ausnahmen; zuerst Finanzierung klären lassen'],
    ['C', 'Finanzierung offensichtlich nicht gegeben, erwerbsrechtlich unzulässig, oder keine Kaufabsicht erkennbar',
     'Keine Besichtigung; freundliche, begründete Absage; Daten mit Löschfrist erfassen'],
  ], [700, 4900, 4000]));

  push(h2('K3 · CRM-Struktur'));
  push(abs('Die folgenden Felder werden je Interessent geführt. Sie sind in der Arbeitsmappe 06 mit Auswahllisten hinterlegt.'));
  push(tabelle(['Feld', 'Art', 'Zweck'],
    B.CRM_FELDER.map(c => [c.feld, c.art, c.zweck]), [3000, 1200, 5400]));
  push(leer());
  push(recht([
    'Interessentendaten sind Personendaten. Zweckbindung, Löschfristen und Informationspflichten sind einzuhalten; das Feld «Löschfrist» ist ein Pflichtfeld (R39).',
    'Finanzierungsnachweise werden nur zweckgebunden und nur mit Einwilligung des Interessenten weitergegeben. Eine Rückfrage bei der Bank setzt die Einwilligung voraus.',
    'Einträge im Feld «Bemerkungen» sind sachlich zu halten: Der Interessent hat ein Auskunftsrecht über die zu seiner Person gespeicherten Daten.']));

  /* =========================================================== TEIL L */
  push(h1neu('Teil L · Besichtigung'));
  push(abs('Besichtigungen gehören zu Phase 14. Die Checkliste ist Formular F3, das Interessentenformular Formular F2.'));

  push(h2('L1 · Besichtigungscheckliste für den Makler'));
  F.BESICHTIGUNG_CHECKLISTE.forEach(b => {
    push(h4(b.block));
    push(checks(b.punkte));
  });
  push(leer());
  push(recht([
    'Die aktive Ansprache bekannter Mängel ist im Besichtigungsprotokoll festzuhalten: wem wurde was gezeigt und gesagt. Diese Dokumentation ist der Nachweis der Offenlegung und trägt die Freizeichnung im Kaufvertrag (R10).',
    'Keine Aussagen zu Bauzulässigkeit, Umbaumöglichkeiten, Steuerfolgen oder Finanzierung. Solche Angaben sind Zusicherungen, für die der Makler haftet, und gehören an Gemeinde, Steueramt, Notariat oder Bank.']));

  push(h2('L2 · Interessentenformular'));
  push(abs('Wird vor Ort vollständig ausgefüllt und unterzeichnet. Ohne die Angaben zur Finanzierung wird kein Kaufangebot weiterverfolgt.'));
  F.INTERESSENTENFORMULAR.forEach(b => {
    push(h4(b.block));
    push(punkte(b.felder));
  });

  /* =========================================================== TEIL M */
  push(h1neu('Teil M · Kaufangebot'));
  push(recht([
    'Das Formular «Kaufangebot Immobilie» ist eine unverbindliche Absichtserklärung. Ein Kaufvertrag über ein Grundstück kommt in der Schweiz ausschliesslich durch öffentliche Beurkundung zustande (Art. 216 Abs. 1 OR, R1).',
    'Auch ein Vorvertrag zum Grundstückkauf bedarf der öffentlichen Beurkundung (Art. 216 Abs. 2 OR, R2). Enthält das Formular eine Kaufverpflichtung, eine Konventionalstrafe oder eine Verfallsklausel für eine Anzahlung, ist es als formungültiger Vorvertrag zu qualifizieren und nicht durchsetzbar.',
    'Das Formular ist vor der Verwendung durch die Rechtsberatung freizugeben und danach unverändert einzusetzen. Jede objektbezogene Ergänzung ist erneut vorzulegen.']));
  push(leer());
  push(tabelle(['Block', 'Rechtliche Wirkung', 'Inhalt'],
    F.KAUFANGEBOT.map(b => [b.block, b.bindung, b.felder.join(' · ')]),
    [1900, 1500, 6200]));
  push(leer());
  push(info('Was der Makler beim Angebotseingang tut', [
    'Eingang mit Datum und Uhrzeit protokollieren – bei mehreren Angeboten ist die Reihenfolge relevant.',
    'Vollständigkeit prüfen: fehlende Angaben nachfordern, bevor das Angebot dem Eigentümer vorgelegt wird.',
    'Objektbezogene Finanzierungsbestätigung verlangen. Eine allgemeine Kreditfähigkeitsauskunft genügt nicht.',
    'Erwerbsrechtliche Zulässigkeit abschliessend klären (R34, R35, R36).',
    'Identifikation des Käufers nach GwG vorbereiten und die wirtschaftlich berechtigte Person feststellen (R37).',
    'Jedes Angebot dem Eigentümer vorlegen – auch solche, die der Makler für aussichtslos hält. Die Auswahl ist nicht seine Aufgabe.']));

  /* =========================================================== TEIL N */
  push(h1neu('Teil N · Verhandlung und Entscheidungsvorlage'));
  push(abs('Die Verhandlung gehört zu Phase 16. Sie folgt dem Grundsatz aus Abschnitt A2: Der Makler liefert Entscheidungsgrundlagen und setzt den schriftlichen Entscheid des Eigentümers um.'));

  push(h2('N1 · Kriterien des Angebotsvergleichs'));
  push(abs('Jedes Angebot wird nach denselben Kriterien erfasst, damit es vergleichbar wird. Der Vergleich ist wertungsfrei; die Einschätzung der Abschlusswahrscheinlichkeit ist zu begründen.'));
  push(nrpunkte(F.ANGEBOTSVERGLEICH.map((c, i) => [String(i + 1) + '.', c])));

  push(h2('N2 · Entscheidungsvorlage'));
  push(tabelle(['Abschnitt', 'Inhalt'],
    F.ENTSCHEIDUNGSVORLAGE.map(e => [e.block, e.inhalt]), [2200, 7400]));

  push(h2('N3 · Verhandlungsspielraum neben dem Preis'));
  push(abs('Der Preis ist selten die einzige Verhandlungsmasse und oft nicht die wirksamste. Folgende Punkte sind zu prüfen, bevor über den Preis verhandelt wird:'));
  push(tabelle(['Verhandlungsmasse', 'Wirkung', 'Wann einsetzen'], [
    ['Übergabetermin', 'Für Käufer mit Kündigungsfrist oder auslaufender Festhypothek häufig mehr wert als ein Preisnachlass',
     'Wenn der Eigentümer zeitlich flexibel ist'],
    ['Inventar', 'Küchengeräte, Gartenmöbel, Storen, Einbauten lassen sich beziffern und ersparen dem Käufer Anschaffungen',
     'Wenn der Eigentümer Gegenstände ohnehin nicht mitnimmt'],
    ['Sanierungsbeitrag', 'Ein bezifferter Beitrag an eine konkrete Massnahme wirkt sachlicher als ein allgemeiner Nachlass',
     'Bei preisrelevantem, unbestrittenem Sanierungsbedarf'],
    ['Zahlungsmodalitäten', 'Früherer Beurkundungstermin oder kürzere Zahlungsfrist senken das Abwicklungsrisiko',
     'Wenn der Eigentümer Terminsicherheit braucht'],
    ['Nutzen- und Gefahrenübergang', 'Verschiebung kann Kosten und Risiken sinnvoll verteilen',
     'Bei Auseinanderfallen von Beurkundung und Umzug'],
    ['Wegbedingung der Gewährleistung', 'Kein Verhandlungsgegenstand für den Makler',
     'Nie – ausschliesslich über das Notariat regeln [RP]'],
  ], [2100, 4500, 3000]));

  push(h2('N4 · Verfahren bei mehreren Angeboten'));
  push(punkte([
    'Verfahren vor der ersten Rückmeldung festlegen und dem Eigentümer zum Entscheid vorlegen.',
    'Allen Interessenten dieselbe Information und dieselbe Frist geben; das Vorgehen schriftlich mitteilen.',
    'Angebotsbeträge Dritter nicht offenlegen. Zulässig ist der Hinweis, dass weitere Angebote vorliegen, wenn dies der Wahrheit entspricht.',
    'Keine Aufforderung zu Nachgeboten in einer Form, die einer Auktion gleichkommt, ohne dass dies allen Beteiligten vorab offengelegt wurde.',
    'Verfahren, Fristen und Mitteilungen lückenlos protokollieren.',
    'Zweitplatzierten nicht endgültig absagen, sondern transparent in Wartestellung halten – Reservationen platzen.']));
  push(leer());
  push(recht([
    'Erhält der Makler von der Käuferseite ein Honorar, liegt Doppelmäkelei vor. Ohne ausdrückliche Offenlegung und Zustimmung beider Parteien kann der Lohnanspruch verwirken (Art. 415 OR, R19).']));

  /* =========================================================== TEIL O */
  push(h1neu('Teil O · Reservation'));
  push(recht([
    'Dies ist der rechtlich heikelste Baustein des ganzen Prozesses. Eine Reservationsvereinbarung über ein Grundstück mit im Voraus bestimmtem Kaufpreis ist ein Vorvertrag im Sinne von Art. 216 Abs. 2 OR und bedarf zu ihrer Gültigkeit der öffentlichen Beurkundung. In der Praxis wird sie nicht beurkundet – sie ist damit formungültig (R2).',
    'Folge: Konventionalstrafen und Verfallsklauseln in einer nicht beurkundeten Reservationsvereinbarung sind nicht durchsetzbar, und geleistete Reservationszahlungen sind grundsätzlich zurückzuerstatten.',
    'Konsequenz für die Praxis des Unternehmens: Die Reservationsbestätigung wird ausschliesslich als unverbindliche Absichtserklärung ausgestellt. Sie enthält keine Kaufverpflichtung, keine Konventionalstrafe und keine Verfallsklausel. Reservationszahlungen werden nicht entgegengenommen – weder in Bargeld noch auf ein Konto des Maklers (R38).',
    'Ist im Einzelfall eine Anzahlung unvermeidlich, erfolgt sie ausschliesslich auf ein Konto des beauftragten Notariats, ist jederzeit vollumfänglich rückforderbar und bedarf der vorherigen Freigabe durch die Rechtsberatung.',
    'Die Vorlage ist vor jeder Verwendung durch das Notariat oder die Rechtsberatung zu prüfen.']));
  push(leer());
  push(h2('O1 · Aufbau der Reservationsbestätigung'));
  push(tabelle(['Zi.', 'Gegenstand', 'Inhalt'],
    F.RESERVATION.map(r => [r.zi, r.titel, r.inhalt]), [450, 2150, 7000]));
  push(leer());
  push(praxis('Was die Reservation trotz ihrer Unverbindlichkeit leistet', [
    'Sie hält die Einigung über Preis, Termin, Inventar und Bedingungen schriftlich fest – das verhindert die häufigsten Missverständnisse in der Beurkundungsphase.',
    'Sie dokumentiert gegenüber dem Eigentümer, weshalb die Vermarktung zurückgestellt wird.',
    'Sie legt den Zeitplan bis zur Beurkundung und die von jeder Partei beizubringenden Unterlagen fest.',
    'Sie befristet die Zurückstellung: Wird die Frist ohne Beurkundung überschritten, läuft die Vermarktung ohne weitere Mitteilung wieder an.',
    'Die verhaltenssteuernde Wirkung entsteht aus der Befristung und der Transparenz, nicht aus einer Strafe – die ohnehin nicht durchsetzbar wäre.']));

  /* =========================================================== TEIL P */
  push(h1neu('Teil P · Notariat und Kaufvertrag'));
  push(abs('Die Phasen 17 bis 19. Der Kaufvertrag wird vom Notariat redigiert und beurkundet. Der Makler beauftragt vollständig, prüft gegen die Einigung und koordiniert – er redigiert nicht und erteilt keine Rechtsauskunft.'));
  push(leer());
  push(recht([
    'Das Notariatssystem ist kantonal unterschiedlich: Amtsnotariat, freies Notariat oder Mischform. Zuständigkeit, Terminvorlauf, Gebührentarif und Formerfordernisse für Vollmachten sind für den betroffenen Kanton abzuklären (R1, R16, R26).']));

  push(h2('P1 · Vor dem Notariat – Übergabecheckliste F6'));
  push(abs('Vollständigkeit entscheidet über die Dauer bis zur Beurkundung. Jede fehlende Angabe kostet typischerweise eine Woche.'));
  push(tabelle(['Position', 'Was zu übermitteln ist'],
    F.NOTARIAT_VOR.map(n => [n.p, n.i]), [2400, 7200]));

  push(h2('P2 · Nach dem Notariat'));
  push(tabelle(['Position', 'Was zu erledigen und zu kontrollieren ist'],
    F.NOTARIAT_NACH.map(n => [n.p, n.i]), [2400, 7200]));
  push(leer());
  push(info('Drei Zeitpunkte, die nicht zu verwechseln sind', [
    'Beurkundung: Der Kaufvertrag wird gültig. Ab hier sind beide Parteien gebunden (R1).',
    'Nutzen- und Gefahrenübergang: Der im Vertrag vereinbarte Zeitpunkt, ab dem Nutzen, Kosten und Risiko auf den Käufer übergehen. Er bestimmt auch den Versicherungswechsel.',
    'Eigentumsübergang: Die Eintragung im Grundbuch. Erst damit wird der Käufer Eigentümer (Art. 656 Abs. 1 ZGB, R3).',
    'Diese drei Zeitpunkte fallen in der Regel nicht zusammen. Beide Parteien sind darauf ausdrücklich hinzuweisen – in der Vorlage K17 ist die Erklärung enthalten.']));

  /* =========================================================== TEIL Q */
  push(h1neu('Teil Q · Übergabeprotokoll'));
  push(abs('Die Übergabe gehört zu Phase 20 und findet erst nach bestätigter Eintragung im Grundbuch und vollständigem Zahlungseingang statt. Das Protokoll ist Formular F9.'));
  F.UEBERGABE.forEach(b => {
    push(h3(b.block));
    push(punkte(b.felder));
  });
  push(leer());
  push(praxis('Die vier häufigsten Fehler bei der Übergabe', [
    'Schlüssel werden nicht gezählt. Anzahl je Art im Protokoll festhalten und quittieren; fehlende Schlüssel ausdrücklich vermerken samt Vereinbarung dazu.',
    'Zählerstände werden ohne Zählernummer notiert. Ohne Nummer ist der Stand gegenüber dem Versorger nicht verwertbar. Zusätzlich fotografieren.',
    'Offene Punkte werden mündlich vereinbart. Sie gehören mit Verantwortlichkeit und Frist ins Protokoll, sonst sind sie nach zwei Wochen strittig.',
    'Das Protokoll wird nicht unterzeichnet oder nur in einem Exemplar erstellt. Beide Parteien unterzeichnen, beide erhalten eine Ausfertigung, eine bleibt im Objektdossier.']));

  /* =========================================================== TEIL R */
  push(h1neu('Teil R · Abschlusscheckliste des Maklers'));
  push(abs('Diese Liste wird je Objekt geführt und vor dem Abschluss des Mandats vollständig abgearbeitet. Sie ist als Arbeitsmappe 09 ausfüllbar. Die Spalte «Phase» verweist auf Teil B, die Spalte «Register» auf Teil W.'));
  push(leer());
  const agr = [];
  ABSCHLUSS.forEach(p => {
    if (p.g) { agr.push({titel: p.g, zeilen: []}); return; }
    agr[agr.length - 1].zeilen.push(p);
  });
  agr.forEach(g2 => {
    push(h3(g2.titel));
    push(tabelle(['☐', 'Position', 'Phase', 'Zuständig', 'Nachweis', 'Reg.'],
      g2.zeilen.map(p => ['☐', p.pos, String(p.phase), p.rolle, p.nachweis, p.recht || '—']),
      [400, 3500, 600, 1500, 2600, 1000]));
  });
  push(leer());
  push(info('Zur Herkunft dieser Liste', [
    'Achtundzwanzig Positionen entsprechen der im Auftrag vorgegebenen Liste.',
    'Siebenunddreissig Positionen sind ergänzt. Sie betreffen vor allem die geldwäschereirechtliche Identifikation, den Datenschutz, die Sicherstellung der Grundstückgewinnsteuer, die Hypothekenablösung, die Dokumentation der Mängeloffenlegung, die erwerbsrechtliche Zulässigkeit des Käufers sowie den organisatorischen Abschluss einschliesslich Archivierung und Löschfristen.',
    'Die Ergänzungen sind in der Arbeitsmappe 09 in der Spalte «Herkunft» als «ergänzt» gekennzeichnet.']));

  /* =========================================================== TEIL S */
  push(h1neu('Teil S · Dokumentenordner und Dateibenennung'));
  push(abs('Je Objekt wird ein Ordner mit der folgenden Struktur angelegt, und zwar in Phase 5 – nicht später. Die Struktur ist fix: Unterordner werden nicht umbenannt und nicht ergänzt, damit jede Person jedes Dossier auf Anhieb lesen kann.'));
  push(tabelle(['Nr.', 'Ordner', 'Inhalt'],
    B.ORDNER.map(o => [o.nr, o.name, o.inhalt]), [480, 2120, 7000]));

  push(h2('S1 · Regeln der Dateibenennung'));
  push(tabelle(['Regel', 'Vorgabe'],
    B.BENENNUNG.map(b2 => [b2.regel, b2.wert]), [1800, 7800]));

  push(h2('S2 · Beispiele'));
  push(mono(B.BENENNUNG_BEISPIELE));
  push(leer());
  push(recht([
    'Das Identifikationsdossier nach GwG wird gesondert geführt und archiviert; Aufbewahrungsdauer und Zugriffsberechtigung richten sich nach der Weisung des Unternehmens und der Selbstregulierungsorganisation (R37).',
    'Für Interessentendaten sind Löschfristen zu setzen und einzuhalten. Der Ordner 09 ist beim Abschluss des Dossiers zu bereinigen (R39).']));

  /* =========================================================== TEIL T */
  push(h1neu('Teil T · Kommunikationsvorlagen und Formulare, Übersicht'));
  push(abs('Die Volltexte der Vorlagen K1 bis K20 stehen in Dokument 05, die Formulare F1 bis F9 in Dokument 03. Platzhalter in eckigen Klammern werden je Vorgang ersetzt; jede Vorlage wird vor dem Versand gelesen und nicht bloss ausgefüllt.'));
  push(h2('T1 · Kommunikationsvorlagen'));
  push(tabelle(['Nr.', 'Vorlage', 'Phase', 'Kanal und Zeitpunkt'],
    VORLAGEN.map(v => [v.k, v.name, String(v.phase), v.kanal]),
    [700, 3100, 700, 5100]));
  push(h2('T2 · Formulare'));
  push(tabelle(['Nr.', 'Formular', 'Phase', 'Fundstelle im Handbuch'], [
    ['F1', 'Erstgesprächsprotokoll und Gesprächsleitfaden', '3', 'Teil D'],
    ['F2', 'Interessentenformular', '13–14', 'Teil L2'],
    ['F3', 'Besichtigungscheckliste für den Makler', '14', 'Teil L1'],
    ['F4', 'Kaufangebot Immobilie', '15', 'Teil M'],
    ['F5', 'Angebotsvergleich und Entscheidungsvorlage', '16', 'Teil N1 und N2'],
    ['F6', 'Notariatscheckliste, vor und nach der Beurkundung', '17–19', 'Teil P'],
    ['F7', 'Reservationsbestätigung', '17', 'Teil O'],
    ['F8', 'Inventarliste', '4 und 18', 'Teil Q6 und Dokument 03'],
    ['F9', 'Übergabeprotokoll', '20', 'Teil Q'],
  ], [700, 4100, 900, 3900]));
  push(leer());
  push(recht([
    'Die Formulare F4 «Kaufangebot» und F7 «Reservationsbestätigung» sowie jede Vertragsvorlage sind vor der Verwendung durch das Notariat oder die Rechtsberatung freizugeben und danach unverändert einzusetzen (R1, R2).']));

  /* =========================================================== TEIL U */
  push(h1neu('Teil U · Makler-Controlling'));
  push(abs('Das Controlling ist im Dashboard der Arbeitsmappe 06 hinterlegt und wird wöchentlich aktualisiert. Zweck ist nicht die Berichterstattung, sondern die rechtzeitige Erkennung von Fehlentwicklungen: Wer erst nach drei Monaten merkt, dass der Preis nicht trägt, hat die wirksamste Vermarktungsphase verloren.'));
  push(tabelle(['Kennzahl', 'Definition', 'Orientierung und Handlungsauslöser'],
    B.KENNZAHLEN.map(z => [z.k, z.def, z.ziel]), [2600, 3600, 3400]));
  push(leer());
  push(praxis('Wöchentliche Statusmeldung an den Eigentümer', [
    'Zahlen statt Eindrücke: Anfragen, Besichtigungen, Rückmeldungen, Angebote – jeweils in der Woche und kumuliert.',
    'Ablehnungsgründe in der Verteilung, nicht als Einzelanekdoten.',
    'Immer mit einer Aussage zur Konsequenz: Was bedeuten diese Zahlen, und was schlagen wir vor?',
    'Bei Erreichen eines Handlungsauslösers nicht zuwarten, sondern das vereinbarte Massnahmengespräch ansetzen. Die Auslösekriterien sind in Phase 9 im Strategieprotokoll festgelegt worden – sie werden angewendet, nicht neu verhandelt.']));

  /* =========================================================== TEIL V */
  push(h1neu('Teil V · Verkaufsprozess als Flow'));
  push(abs('Die Kurzform des Prozesses. Die Zahlen verweisen auf die Phasen in Teil B.'));
  push(leer());
  push(flowBlock(FLOW.map(f => [f, 'Phase ' + FLOW_PHASE[f]])));
  push(leer());
  push(info('Die vier Punkte, an denen der Prozess anhält', [
    'Nach Phase 6: Ist das Objekt in der vorgesehenen Form verkäuflich? Ohne nachgewiesene Verfügungsbefugnis und ohne geklärte Rechtslage entstehen keine Vermarktungskosten.',
    'Nach Phase 9: Steht der Preis? Ohne schriftlichen Preisentscheid kein Mandat.',
    'Nach Phase 10: Liegt das unterzeichnete Mandat samt vollständiger Identifikation vor? Ohne beides beginnt keine Vermarktung.',
    'Nach Phase 15: Ist die Finanzierung belegt? Ohne objektbezogene Bankbestätigung keine Verhandlung und keine Reservation.']));

  /* =========================================================== TEIL W */
  push(h1neu('Teil W · Rechtsgrundlagen-Register und Quellen'));
  push(recht([
    'Dieses Register nennt die Rechtsgrundlagen, auf die sich das Handbuch stützt. Es ist eine Arbeitshilfe und keine Rechtsauskunft.',
    'Rechtsstand: 18. September 2026. Rechtslage, Verordnungsrecht und kantonale Praxis ändern sich. Das Register ist vor jeder Mandatsausfertigung auf Aktualität zu prüfen; die Verantwortung dafür liegt bei der Rechtsberatung des Unternehmens.',
    'Kantonale Regelungen sind im Register nur dem Grundsatz nach erfasst. Für das konkrete Objekt gilt die Klärungsliste in Abschnitt A6.']));
  push(leer());
  const rgr = [];
  RECHT.forEach(r => {
    if (r.g) { rgr.push({titel: r.g, zeilen: []}); return; }
    rgr[rgr.length - 1].zeilen.push(r);
  });
  rgr.forEach(g3 => {
    push(h3(g3.titel));
    push(tabelle(['Nr.', 'Thema', 'Rechtsgrundlage', 'Kerninhalt', 'Umsetzung in der Praxis', 'Kz.'],
      g3.zeilen.map(r => [r.k, r.thema, r.grundlage, r.kern, r.praxis,
        (r.flag || '').split(' ').filter(Boolean).map(f => '[' + f + ']').join(' ') || '—']),
      [500, 1500, 1800, 2400, 2500, 900]));
  });

  push(h2('W1 · Besonders zu beachten: Unterstellung unter das Geldwäschereigesetz'));
  push(recht([
    'Mit der Teilrevision des Geldwäschereigesetzes, in Kraft ab 1. Oktober 2026, wird die berufsmässige Mitwirkung an Finanztransaktionen im Zusammenhang mit dem Kauf oder Verkauf von Grundstücken dem Gesetz unterstellt (Art. 2 Abs. 3bis und 3ter revGwG). Erfasst sind nach den vorliegenden Materialien auch Kaufversprechen und Kaufverträge sowie die Übertragung von Anteilen an Immobiliengesellschaften.',
    'Kernpflichten sind die Identifikation der Vertragspartei, die Feststellung der wirtschaftlich berechtigten Person, die Dokumentation der Geschäftsbeziehung und die Meldung bei begründetem Verdacht. Nach Art. 14 GwG ist der Anschluss an eine von der FINMA anerkannte Selbstregulierungsorganisation erforderlich.',
    'Nach den vorliegenden Materialien sind für die Unterstellung keine Übergangsfristen vorgesehen; laufende Mandate sind auf ihre Relevanz zu prüfen. Die Einzelheiten ergeben sich aus der revidierten Geldwäschereiverordnung.',
    'Dieser Abschnitt beruht auf öffentlich zugänglichen Fachpublikationen zum Stand vom 18. September 2026. Der für dieses Unternehmen konkret geltende Pflichtenumfang, die Anschlussfrist, das interne Weisungswesen, die Schulungspflichten und die Aufbewahrungsvorgaben sind zwingend durch die Rechtsabteilung und die Selbregulierungsorganisation zu bestätigen, bevor die Prozesse dieses Handbuchs in den Phasen 10, 15, 17 und 20 als vollständig gelten.']));

  push(h2('W2 · Verwendete Quellen'));
  push(abs('Die nachstehenden Quellen wurden am 18. September 2026 konsultiert. Gesetzestexte sind über die Systematische Rechtssammlung des Bundes zu verifizieren; die aufgeführten Fachpublikationen ersetzen die Konsultation der Primärquellen nicht.'));
  push(tabelle(['Gegenstand', 'Quelle'], [
    ['Formvorschriften Grundstückkauf und Vorvertrag, Reservationsvereinbarung',
     'Art. 216 OR (SR 220); Fachpublikationen zur Formungültigkeit von Reservationsvereinbarungen und Konventionalstrafen in nicht beurkundeten Vorverträgen'],
    ['Eigentumserwerb, Grundbuch, Dienstbarkeiten, Erbengemeinschaft, Ehegüterrecht, Erwachsenenschutz',
     'ZGB (SR 210)'],
    ['Mäklerrecht, Gewährleistung, Verjährung bei Gebäuden, Miete',
     'OR (SR 220)'],
    ['Grundstückgewinnsteuer, Anlagekosten, Ersatzbeschaffung',
     'Art. 12 StHG (SR 642.14) sowie kantonale Steuergesetze'],
    ['Sicherstellung der Grundstückgewinnsteuer, gesetzliches Grundpfandrecht',
     'Kantonale Steuergesetze; Praxisdarstellungen kantonaler Notariate und Steuerämter'],
    ['Mehrwertsteuer, Normalsatz 8,1 Prozent seit 1. Januar 2024',
     'MWSTG (SR 641.20); Eidgenössische Steuerverwaltung'],
    ['Gebäudeenergieausweis der Kantone, Verkaufspflicht in FR, VD, NE und JU',
     'Kantonale Energiegesetze; Mustervorschriften der Kantone im Energiebereich; Informationen des Vereins GEAK und kantonaler Energiefachstellen'],
    ['Unterstellung von Beratern unter das Geldwäschereigesetz ab 1. Oktober 2026',
     'Art. 2 Abs. 3bis und 3ter revGwG (SR 955.0), Art. 8a und Art. 14 GwG; revidierte Geldwäschereiverordnung; Fachpublikationen von Anwaltskanzleien und Branchenverbänden, Stand Juli bis September 2026'],
    ['Mindestanforderungen bei Hypothekarfinanzierungen: 10 Prozent harte Eigenmittel, Amortisation auf zwei Drittel innert 15 Jahren',
     'Selbstregulierung der Schweizerischen Bankiervereinigung, von der FINMA als Mindeststandard anerkannt; angepasste Fassung in Kraft seit 1. Januar 2025'],
    ['Erwerb von Grundstücken durch Personen im Ausland; Revisionsvorhaben in der Vernehmlassung bis 15. Juli 2026, nicht in Kraft',
     'BewG (SR 211.412.41) und BewV; Bundesamt für Justiz'],
    ['Zweitwohnungen, bäuerliches Bodenrecht, Raumplanung und Mehrwertausgleich',
     'ZWG (SR 702); BGBB (SR 211.412.11); RPG (SR 700)'],
    ['Belastete Standorte, Radon',
     'Art. 32dbis USG (SR 814.01); AltlV (SR 814.680); StSV (SR 814.501); kantonale Kataster und Radonkarte des BAG'],
    ['Datenschutz',
     'DSG (SR 235.1), revidierte Fassung, in Kraft seit 1. September 2023'],
  ], [3200, 6400]));
  push(leer());
  push(info('Änderungen an diesem Handbuch', [
    'Dieses Handbuch wird aus Textquellen erzeugt und nicht von Hand bearbeitet. Rückmeldungen werden unter Angabe der Kennung – Phasennummer, Dokumentennummer, Registernummer R oder Vorlagennummer K – in die Quelle eingearbeitet, damit die Nummerierung über alle Fassungen stabil bleibt.',
    'Version 1, Fassung vom 18. September 2026.']));

  return k;
}

/* Anzeigetext der Erfassungsart eines Aufnahmefelds */
function artText(art) {
  if (Array.isArray(art)) return art.slice(1).join(' · ');
  return {m2: 'm\u00B2', m3: 'm\u00B3', CHF: 'Betrag in CHF',
          'ja/nein': 'ja / nein', Zustand: 'Zustandsskala'}[art] || art;
}

/* Inseratsabschnitte als Tabellenzeilen */
function F_INSERAT() {
  return B.INSERAT_ABSCHNITTE.map(a => [a.t, a.v]);
}

module.exports = {kinder, STAND, TEILE, FLOW, FLOW_PHASE, ROLLEN, KANTONAL};
