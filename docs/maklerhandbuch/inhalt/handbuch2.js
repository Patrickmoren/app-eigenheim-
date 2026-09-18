/* Erzeugt 01_Maklerhandbuch_Hausverkauf.pdf, Version 2.
   Struktur Teile A bis K gemäss Auftrag. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkte, nrpunkte, checks, tabelle,
       info, recht, praxis, titelblatt, mono, flow} = require('../lib/blocks.js');

const {PHASEN}     = require('./phasen.js');
const {ZUSATZ}     = require('./phasen-v2.js');
const {GATES, GATE_ENTSCHEID} = require('./gates.js');
const {DOKUMENTE}  = require('./dokumente.js');
const {RECHT}      = require('./recht.js');
const {AUFNAHME}   = require('./objektaufnahme.js');
const {VORLAGEN}   = require('./kommunikation.js');
const {ABSCHLUSS}  = require('./abschluss.js');
const B            = require('./bausteine.js');
const BW           = require('./bewertung.js');
const F            = require('./formulare.js');
const P            = require('./preis.js');
const K            = require('./kaeufer.js');
const EG           = require('./eigentuemer.js');
const MK           = require('./marketing.js');
const CP           = require('./compliance.js');
const SF           = require('./sonderfaelle.js');
const ST           = require('./stoerungen.js');
const KN           = require('./kontrollen.js');
const CRM          = require('./crm.js');
const DM           = require('./dokumentenmgmt.js');
const BG           = require('./begriffe.js');

const STAND = '18. September 2026';
const VERSION = 'Version 2.0';

const TEILE = [
 ['A', 'Grundsystem: Zweck, Rollen, Prozessübersicht, Begriffe, Qualitätsprinzipien'],
 ['B', 'Verkaufsprozess: zwanzig Phasen und zehn Gates'],
 ['C', 'Bewertung, Preisbegriffe und Preissteuerung'],
 ['D', 'Eigentümer: Erstgespräch, Mandat, Reports, Entscheidungen'],
 ['E', 'Käufer: Funnel, Qualifikation, Angebote, Verhandlung'],
 ['F', 'Vermarktung: Stufen, Kanäle, Dossier, Marktsteuerung'],
 ['G', 'Recht und Compliance'],
 ['H', 'Notariat, Vertragsphase und Übergabe'],
 ['I', 'CRM, Dokumente und Qualitätssicherung'],
 ['J', 'Sonderfälle und Störfälle'],
 ['K', 'Vorlagen, Checklisten und Register'],
];

const ROLLEN = [
['Makler', 'Prozessführung Phase 1 bis 20',
 'Erheben, prüfen, bewerten, vermarkten, qualifizieren, aufbereiten, dokumentieren, koordinieren. Führt die GwG-Triage, legt Gates vor.',
 'Rechts-, Steuer- und Finanzierungsberatung; Bauexpertisen; Entscheid über Verkauf, Preis und Zuschlag'],
['Verkaufsleitung', 'Prüfer bei sieben von zehn Gates und sieben von zehn Kontrollpunkten',
 'Gate-Freigaben, bedingte Freigaben, Verweigerungen; Eskalationsinstanz; Entscheid über Mandatsannahme bei Sonderfällen und über Vermarktungsstufe.',
 'Entscheidungen, die dem Eigentümer zustehen; Rechtsauskunft'],
['Eigentümer', 'Alle Entscheide über Preis, Konditionen, Strategie und Zuschlag',
 'Unterlagen und Belege liefern, Mängel offenlegen, Preis und Strategie festlegen, über Angebote entscheiden, Verhandlungsauftrag erteilen, Steuerschätzung und Ablösekonditionen einholen.',
 'Verhandlungsführung im Detail; direkte Kommunikation mit Interessenten während der Vermarktung'],
['Käufer', 'Kaufentscheid und Finanzierung',
 'Schriftliches Angebot, Finanzierungsnachweis, Identifikation, Kaufpreiszahlung, Anmeldung bei Versorgern und Versicherung.',
 '—'],
['Notariat', 'Öffentliche Beurkundung und Vollzug',
 'Vertrag redigieren und beurkunden, Zahlung abwickeln, beim Grundbuchamt anmelden, Steuersicherstellung abwickeln, beide Parteien neutral belehren.',
 'Parteiinteressen vertreten; Preisverhandlung'],
['Finanzierung (Banken)', 'Kreditentscheid und Pfandrechte',
 'Käuferfinanzierung bestätigen, bestehende Hypothek ablösen, Schuldbriefe behandeln, Vorfälligkeitsentschädigung berechnen.',
 'Bewertung für Verkaufszwecke; Terminzusagen ohne Kreditentscheid'],
['Grundbuchamt', 'Führung des Grundbuchs',
 'Auszüge und Belege abgeben, Eigentumsübergang eintragen, Pfandrechte behandeln.',
 'Rechtsberatung; Wertauskunft'],
['Steueramt', 'Grundstückgewinnsteuer und Sicherstellung',
 'Steuer provisorisch berechnen, Sicherstellung bestätigen, veranlagen.',
 'Bewertung; Verkaufsberatung'],
['Compliance / SRO', 'Geldwäschereirechtliche Beurteilung',
 'Triage-Pfad A freigeben, Verdachtsfälle beurteilen, Weisungen und Pflichtenumfang festlegen, Meldeentscheid treffen.',
 'Operative Prozessführung; Preisentscheide'],
['Rechtsberatung', 'Vertragsvorlagen und Sonderfälle',
 'Vorlagen freigeben, Sonderfälle beurteilen, bei Störfällen mit Rechtsbezug Stellungnahmen freigeben.',
 'Operative Prozessführung'],
];

const QUALITAETSPRINZIPIEN = [
{p: 'Der Makler entscheidet nicht über den Verkauf', i: 'Er liefert vollständige, vergleichbare und wertungsfreie Entscheidungsgrundlagen und setzt den schriftlichen Entscheid des Eigentümers um. Das gilt für Angebotspreis, Preisänderung, Angebotsannahme und jeden Verhandlungsschritt.'},
{p: 'Keine Angabe ohne Quelle', i: 'Jede Zahl in Bewertung, Dossier und Inserat hat eine belegte Quelle mit Datum. Jede Angabe kann als zugesicherte Eigenschaft gelten (R9).'},
{p: 'Offenlegen statt beschönigen', i: 'Bekannte Mängel, Sanierungsbedarf, Belastungen und Beschränkungen werden aktiv offengelegt und dokumentiert. Das trägt die Freizeichnung im Kaufvertrag (R10) und verhindert Abbrüche nach der Besichtigung.'},
{p: 'Kein Gate ohne Prüfer und Nachweis', i: 'Zehn Gates mit Kriterien, Prüfer, Nachweis, Stop-Kriterien und Eskalation. Der Prüfer ist nie der Bearbeiter.'},
{p: 'Entscheidungslogik statt Handlungsaufforderung', i: '«Prüfen» ist keine Anweisung. Kritische Stellen führen die Entscheidung im Muster Voraussetzung, Handlung, Alternative, Verbot.'},
{p: 'Ursache vor Massnahme', i: 'Keine Preisänderung ohne dokumentierte Ursachenanalyse. Keine Massnahme, die den Zeitablauf als Ursache behandelt.'},
{p: 'Was nicht dokumentiert ist, ist nicht geschehen', i: 'Offenlegung, Instruktionen, Verhandlungsschritte, Kontrollen und Gate-Entscheide werden am gleichen Tag erfasst. Korrekturen werden als Korrekturen erfasst, nicht überschrieben.'},
{p: 'Rechtsstand und Quellengüte kennzeichnen', i: 'Jede Registerposition nennt die Normebene. Aussagen, die nicht auf dem Gesetzes- oder Verordnungstext beruhen, tragen einen Quellenvorbehalt.'},
{p: 'Kantonale Zahlen nie übernehmen', i: 'Das Handbuch enthält keine kantonalen Sätze, Gebühren oder Fristen. Sie werden je Objekt erfragt und mit Quelle und Datum zitiert.'},
{p: 'Fehler werden gemeldet, nicht verwaltet', i: 'Siebzehn Störfälle mit festgelegtem Ablauf. Die Meldung erfolgt am gleichen Tag, unabhängig davon, ob eine Lösung schon gefunden ist.'},
];

const SCHEITERN = [
['Unvollständige Verfügungsbefugnis', 'Verkauf scheitert kurz vor der Beurkundung, weil eine Unterschrift fehlt',
 'Gate 2 mit Stop-Kriterium je fehlender Unterschrift; Sonderfälle S1 bis S7 (R13–R16)'],
['Überhöhter Angebotspreis', 'Die wirksamsten zwei Wochen verstreichen; die Standzeit erzwingt später Reduktionen unter den ursprünglich erreichbaren Preis',
 'Gate 5 mit Eskalation; Auslösekriterien in Phase 9 vorab vereinbart; Sonderfall S28'],
['Verschwiegene Mängel', 'Abbruch nach der Besichtigung oder Gewährleistungsanspruch nach dem Verkauf',
 'Unterzeichnete Mängelliste in Phase 4; Offenlegungsteil in Gate 4; Offenlegungsvermerk im Besichtigungsprotokoll; Störfall T15 (R10, R11)'],
['Nicht belegte Finanzierung', 'Reservation platzt, Vermarktung war wochenlang zurückgestellt, Zweitinteressenten sind abgewandert',
 'Gate 6 verlangt die objektbezogene Bankbestätigung; Funnelstufe 7; Sonderfall S21; Preislogik P6 (R40)'],
['Unvollständige Unterlagen beim Notariat', 'Wochen zwischen Einigung und Beurkundung',
 'Gate 8 verlangt die Vollständigkeitsbestätigung des Notariats; Notariatscheckliste F9; Störfall T13'],
['Ungeklärter Bewilligungsstatus von Umbauten', 'Fläche als Wohnfläche beworben, Wiederherstellungsrisiko beim Käufer, Finanzierungsproblem',
 'Gate 1 mit Stop-Kriterium; Sonderfälle S15 und S16; Register R44'],
['Fehlende Ursachenanalyse vor der Preisreduktion', 'Reduktion wirkt nicht, weil die Ursache nicht der Preis war; Reduktionskette zerstört die Verhandlungsposition',
 'Teil C: Indikatoren, Logiken P1 bis P8, Kontrollpunkt K3 vor dem Eigentümergespräch'],
];

const KANTONAL = [
['Notariatssystem', 'Amtsnotariat, freies Notariat oder Mischform; Zuständigkeit, Terminvorlauf', 'Kantonales Notariat', 'R1'],
['Grundbuchamt', 'Zuständige Stelle, Bestellweg, Bearbeitungsdauer, Gebühren', 'Grundbuchamt', 'R4'],
['Handänderungssteuer', 'Bestehen, Höhe, Bemessungsgrundlage, Kostenträger', 'Notariat, Steuerverwaltung', 'R26'],
['Beurkundungs- und Grundbuchgebühren', 'Tarif und übliche Aufteilung', 'Notariat', 'R26'],
['Kostenfolge bei Abbruch', 'Welche Notariatskosten entstehen, wenn der Vertrag nicht zustande kommt, und wer sie trägt', 'Notariat', 'R18'],
['Grundstückgewinnsteuer', 'System, Satz, Besitzesdauerzuschläge und -ermässigungen, Fristen, Formular', 'Gemeinde- bzw. kantonales Steueramt', 'R22'],
['Sicherstellung der Steuer', 'Gesetzliches Grundpfandrecht, Rückbehalt oder Sperrkonto, Vorgehen des Notariats', 'Notariat, Steueramt', 'R25'],
['Ersatzbeschaffung', 'Fristen und Verfahren beim Steueraufschub', 'Steueramt', 'R24'],
['GEAK', 'Pflicht bei Handänderung – obligatorisch in FR, VD, NE und JU; übrige Kantone freiwillig. Stand bestätigen lassen', 'Kantonale Energiefachstelle', 'R33'],
['Nutzungskennzahlen', 'Bezeichnung, Definition, Berechnungsweise, Grenz- und Gebäudeabstände', 'Gemeinde, Bauverwaltung', 'R27'],
['Bestandesschutz', 'Behandlung nicht bewilligter Bauten, Verwirkungsfristen, Legalisierbarkeit', 'Baubehörde', 'R44'],
['Denkmalschutz', 'Schutzumfang, Auflagen, Beitragsregelungen', 'Kantonale Denkmalpflege, Gemeinde', 'R45'],
['Belastete Standorte', 'Zuständige Fachstelle, Bestellweg, Form des Auszugs', 'Kantonale Umweltfachstelle', 'R29'],
['Naturgefahren', 'Gefahrenkarte; obligatorische kantonale oder privatrechtliche Gebäudeversicherung', 'Kantonale Fachstelle, Gebäudeversicherung', 'R30'],
['Vollmachten', 'Formerfordernis: Schriftlichkeit, Beglaubigung oder öffentliche Beurkundung', 'Notariat', 'R16'],
['Zweitwohnungen', 'Zweitwohnungsanteil, Nutzungsbeschränkungen, Anmerkungen', 'Gemeinde', 'R35'],
['Bäuerliches Bodenrecht', 'Zuständige Behörde, Verfahren, Preisschranke', 'Kantonale Landwirtschaftsbehörde', 'R36'],
['Lex Koller', 'Zuständige Bewilligungsbehörde und Verfahren', 'Kantonale Bewilligungsbehörde', 'R34'],
['Mehrwertabgabe', 'Bestehen und Höhe bei Ein- und Umzonungen', 'Kanton, Gemeinde', 'R28'],
];

const FLOWS = [
 ['Lead', '1'], ['Erstkontakt', '2'], ['Erstgespräch', '3'], ['Objektaufnahme', '4'],
 ['Unterlagen', '5'], ['Rechtsprüfung', '6 · GATE 1'], ['Marktanalyse', '7 · GATE 3'],
 ['Bewertung', '8'], ['Preisentscheid', '9'], ['Mandat', '10 · GATE 2'],
 ['Vorbereitung', '11 · GATE 4+5'], ['Marktstart', '12'], ['Interessenten', '13'],
 ['Besichtigungen', '14'], ['Angebote', '15 · GATE 6'], ['Verhandlung', '16 · GATE 7'],
 ['Reservation', '17 · GATE 8'], ['Kaufvertrag', '18 · GATE 9'],
 ['Vollzug', '19 · GATE 10'], ['Übergabe', '20'], ['Abschluss', '20'],
];

const DATEIEN = [
['00_Audit_und_Falltests.pdf', 'Audit von Version 1, zehn Falltests, Schlussaudit, Restrisiken', 'Begleitdokument'],
['11_Kurzfassung_Praxis.pdf', 'Arbeitsebene für erfahrene Makler: Prozess, Gate-Karten, Entscheidungen, rote Linien', 'Verdichtung aus A–K'],
['01_Maklerhandbuch_Hausverkauf.pdf', 'Dieses Handbuch', 'Teile A–K'],
['02_Makler_Checklisten.xlsx', 'Phasen, Gates, Aufgaben, Dokumente, Vermarktung, Kontrollen, Register', 'B, F, I, K'],
['03_Makler_Formulare.docx', 'Formulare F1–F13 zum Ausfüllen', 'D, E, G, H'],
['04_Verkaufsdossier_Vorlage.docx', 'Dossier mit 23 Abschnitten und Release-Checkliste', 'F'],
['05_Kommunikationsvorlagen.docx', 'Vorlagen K1–K20 und Reports V1–V14', 'D'],
['06_Interessentenmanagement.xlsx', 'Funnel, Käuferprofile, Besichtigungen, Angebote, Preisindikatoren, Controlling', 'E, C, I'],
['07_Objektaufnahme.xlsx', '16 Blöcke, 182 Felder, Raumliste, Mängelliste, offene Punkte', 'B, C'],
['08_Bewertung_Vorlage.xlsx', 'Vergleichs-, Real- und Ertragswert, Sanierungsbedarf, Wertspanne, Nettoerlös', 'C'],
['09_Verkaeufer_Abschlusscheckliste.xlsx', 'Abschlusscheckliste, Kennzahlen, Übergabe', 'H, K'],
['10_Sonderfaelle_und_Stoerfaelle.xlsx', '30 Sonderfälle und 17 Störfälle zum Abarbeiten', 'J'],
];

function kinder() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  /* ======================================================== Titel */
  push(titelblatt({
    marke: 'Swiss Real Estate',
    titel: 'Sales Operating Manual',
    untertitel: 'Makler-Handbuch Hausverkauf Schweiz',
    stand: `${VERSION} · Fassung vom ${STAND} · Internes Arbeitsdokument`}));

  push(info('Was dieses Handbuch ist', [
    'Ein operatives Verkaufsmanagementsystem, kein Lehrbuch. Es steuert den Verkauf eines Wohnobjekts in der Schweiz von der Eigentümerakquise bis zur Übergabe und macht jede wesentliche Entscheidung nachvollziehbar.',
    'Zwanzig Phasen mit je achtzehn Feldern, zehn verbindliche Quality Gates, zehn Vier-Augen-Kontrollpunkte, dreissig Sonderfälle, siebzehn Störfälle und siebenundvierzig Rechtsgrundlagen mit Normebene.',
    'Version 2.0 baut auf Version 1 auf. Die Fachteile von Version 1 sind erhalten; ergänzt sind Verbindlichkeit, Entscheidungslogik, Verantwortlichkeit und Fehlerbehandlung. Fünf rechtlich oder fachlich kritische Befunde aus Version 1 sind korrigiert.',
    'Was geprüft und was geändert wurde, steht im Begleitdokument 00_Audit_und_Falltests – einschliesslich der drei Lücken, die die Falltests aufgedeckt haben.']));
  push(leer());
  push(recht([
    'Dieses Handbuch ist ein internes Arbeitsmittel und keine Rechtsberatung. Jede rechtlich relevante Aussage nennt die Grundlage und die Normebene im Register in Teil K.',
    'Mit [RP] gekennzeichnete Punkte sind vor der Verwendung durch Notariat oder Rechtsberatung zu prüfen. Das gilt für sämtliche Vertrags-, Reservations- und Angebotsvorlagen.',
    'Mit [KA] gekennzeichnete Punkte sind kantonal geregelt und vor jedem Mandat abzuklären; die Klärungsliste steht in Abschnitt A7.',
    'Mit [GW] gekennzeichnete Punkte sind geldwäschereirechtlich relevant. Die Aussagen zum revidierten GwG und zum TJPG beruhen auf Fachpublikationen und nicht auf dem Verordnungstext – Quellenvorbehalt in Teil G, Abschnitt C1.',
    'Rechtsstand: 18. September 2026. Vor jeder Mandatsausfertigung auf Aktualität prüfen.']));
  push(leer());
  push(h2('Inhaltsübersicht'));
  push(tabelle(['Teil', 'Gegenstand'], TEILE, [800, 8800]));

  /* ======================================================== TEIL A */
  push(h1neu('Teil A · Grundsystem'));

  push(h2('A1 · Zweck, Geltungsbereich und Abgrenzung'));
  push(abs('Gegenstand ist der Verkauf eines einzelnen Wohnobjekts in der Schweiz, im Regelfall eines Einfamilienhauses. Der Prozess beginnt mit der Erfassung eines Leads und endet mit dem Abschluss des Objektdossiers und der Nachbetreuung.'));
  push(abs('Mehrfamilienhäuser und Renditeobjekte folgen demselben Prozess, verlangen aber eine Ertragswertrechnung in Phase 8 und lösen in der Regel Pfad A der GwG-Triage aus, weil die Ausnahme für selbstgenutztes Wohneigentum nicht greift (Sonderfall S11).'));
  push(abs('Nicht Gegenstand:'));
  push(punkte([
    'Rechts-, Steuer- und Finanzierungsberatung. Der Makler erteilt sie nicht und verweist an die zuständige Stelle.',
    'Bautechnische Beurteilungen und Gutachten.',
    'Bauland ohne Gebäude, landwirtschaftliche Gewerbe und Zwangsverwertungen. Diese folgen Sonderregeln und werden nur mit Freigabe der Rechtsberatung bearbeitet (S12).',
    'Portfolio- und Auslastungssteuerung über mehrere Mandate hinweg. Das System steuert das einzelne Mandat.']));

  push(h2('A2 · Rollen und Verantwortlichkeiten'));
  push(abs('Zehn Rollen, durchgehend getrennt. Die letzte Spalte ist ebenso verbindlich wie die dritte.'));
  push(tabelle(['Rolle', 'Verantwortung', 'Aufgaben', 'Ausdrücklich nicht zuständig für'],
    ROLLEN, [1450, 1650, 3400, 3100]));

  push(h2('A3 · Qualitätsprinzipien'));
  push(abs('Zehn Grundsätze, auf die sich jede Regel dieses Handbuchs zurückführen lässt. Bei Zweifelsfällen entscheidet der Grundsatz, nicht die Einzelregel.'));
  push(tabelle(['Grundsatz', 'Bedeutung'],
    QUALITAETSPRINZIPIEN.map(q => [q.p, q.i]), [2600, 7000]));

  push(h2('A4 · Kennzeichnungssystem'));
  push(tabelle(['Kennzeichen', 'Bedeutung', 'Folge für die Arbeit'], [
    ['[RP]', 'Rechtliche Prüfung durch Notariat oder Rechtsberatung erforderlich', 'Nicht ohne Freigabe verwenden; bei Abweichung erneut vorlegen.'],
    ['[KA]', 'Kantonal unterschiedlich geregelt', 'Vor Mandatsbeginn abklären, Auskunft mit Quelle und Datum ablegen.'],
    ['[GW]', 'Geldwäschereirechtlich relevant', 'Triage in Teil G; Weisung von Unternehmen und SRO befolgen.'],
    ['R1 … R47', 'Rechtsgrundlagen-Register, Teil K', 'Dort stehen Grundlage, Normebene, Kerninhalt und Praxis.'],
    ['GATE 1 … 10', 'Quality Gate, Teil B', 'Kriterien, Prüfer, Nachweis, Stop-Kriterien, Eskalation.'],
    ['K1 … K10', 'Vier-Augen-Kontrollpunkt, Teil I', 'Der Kontrollierende ist nie der Erstellende.'],
    ['P1 … P8', 'Entscheidungslogik Preissteuerung, Teil C', 'Muster: WENN, Interpretation, DANN, SONST, NIE.'],
    ['S1 … S30', 'Sonderfall, Teil J', 'Erkennung, Risiko, Abklärung, Stop, Eskalation.'],
    ['T1 … T17', 'Störfall, Teil J', 'Ablauf von der Sofortmassnahme bis zur Wiederaufnahme.'],
    ['V1 … V14', 'Eigentümerdokument, Teil D', 'Anlass, Zweck, Inhalt, einzuholender Entscheid.'],
    ['F1 … F13', 'Formular, Dokument 03', 'Ausfüllbare Fassung.'],
    ['Kx', 'Kommunikationsvorlage, Dokument 05', 'Volltext dort.'],
  ], [1250, 3350, 5000]));

  push(h2('A5 · Prozessübersicht'));
  push(abs('Zwanzig Phasen, zehn Gates. Die Dauer ist ein Richtwert in Arbeitstagen; die Phasen 5 bis 8 laufen teilweise parallel. Eine Phase ist abgeschlossen, wenn ihr Output vorliegt und ihr Gate freigegeben ist.'));
  push(tabelle(['Nr.', 'Phase', 'Verantwortung', 'Tage', 'Gate', 'CRM-Status'],
    PHASEN.map(p => {
      const z = ZUSATZ[p.nr];
      return [String(p.nr), p.name, p.verantwortung, p.dauer,
        z.gates.length ? z.gates.map(g => 'GATE ' + g).join(', ') : '—', z.crm.status];
    }), [450, 2350, 1600, 650, 1250, 1300]));

  push(h2('A6 · Wo der Prozess in der Praxis scheitert'));
  push(abs('Sieben Ursachen, die nach Erfahrung die meisten gescheiterten oder verzögerten Verkäufe verursachen. Sie erklären, weshalb dieses Handbuch an den entsprechenden Stellen streng ist.'));
  push(tabelle(['Ursache', 'Wirkung', 'Wo das System eingreift'], SCHEITERN, [2000, 3300, 4300]));

  push(h2('A7 · Kantonale Klärungsliste'));
  push(abs('Die Schweiz hat kein einheitliches Immobilientransaktionsrecht. Diese Liste wird je Kanton einmal erstellt, mit Quelle und Datum abgelegt und jährlich überprüft. Das Handbuch enthält bewusst keine kantonalen Zahlen.'));
  push(tabelle(['Thema', 'Was abzuklären ist', 'Bei welcher Stelle', 'Register'],
    KANTONAL, [1700, 4200, 2600, 1100]));

  push(h2('A8 · Begriffe'));
  push(abs('Begriffe mit festgelegter Bedeutung im Sinne dieses Handbuchs. Abweichender allgemeiner Sprachgebrauch ist unerheblich.'));
  push(tabelle(['Begriff', 'Bedeutung'], BG.BEGRIFFE.map(b => [b.b, b.d]), [2400, 7200]));

  push(h2('A9 · Dateien'));
  push(tabelle(['Datei', 'Inhalt', 'Grundlage'], DATEIEN, [3100, 4500, 2000]));

  push(h2('A10 · Prozess als Flow'));
  push(abs('Die Kurzform mit den Gates. Zahlen verweisen auf die Phasen in Teil B.'));
  push(flow(FLOWS));
  push(info('Die vier Punkte, an denen der Prozess anhält', [
    'Gate 1 nach Phase 6: Ist das Objekt in der vorgesehenen Form verkäuflich? Ohne Freigabe entstehen keine Vermarktungskosten.',
    'Gate 2 nach Phase 10: Ist der Auftrag rechtlich tragfähig erteilt und die Triage dokumentiert? Ohne Freigabe keine Vermarktung.',
    'Gate 4 und 5 nach Phase 11: Sind die Unterlagen richtig und freigegeben, und darf das Objekt an den Markt?',
    'Gate 6 nach Phase 15: Ist die Finanzierung objektbezogen belegt? Ohne Freigabe keine Verhandlung und keine Reservation.']));

  /* ======================================================== TEIL B */
  push(h1neu('Teil B · Verkaufsprozess'));
  push(abs('Jede Phase folgt demselben Raster aus achtzehn Feldern. Die Felder «Entscheidungen» und «Entscheidungsträger» trennen, was der Makler vorbereitet, von dem, was der Eigentümer oder die Verkaufsleitung entscheidet. Die Felder «Stop-Kriterien» und «Eskalation» sind verbindlich.'));
  push(leer());
  push(h2('B1 · Das Gate-System'));
  push(abs('Ein Gate ist keine Formalität. Es hat einen Prüfer, der nicht der Bearbeiter ist, einen belegten Nachweis, Stop-Kriterien und einen Eskalationsweg. Über ein Stop-Kriterium kann nicht bedingt freigegeben werden.'));
  push(tabelle(['Entscheid', 'Bedeutung'], GATE_ENTSCHEID.map(g => [g.e, g.b]), [2400, 7200]));
  push(leer());
  push(tabelle(['Gate', 'Bezeichnung', 'Nach Phase', 'Leitfrage', 'Prüfer'],
    GATES.map(g => [String(g.nr), g.name, String(g.nachPhase), g.frage, g.pruefer]),
    [500, 1700, 800, 4100, 2500]));

  GATES.forEach(g => {
    push(h3(`GATE ${g.nr} · ${g.name}`));
    push(mix([{text: 'Leitfrage: ', bold: true}, g.frage]));
    push(tabelle(['Nach Phase', 'Prüfer', 'Nachweis'],
      [[String(g.nachPhase), g.pruefer, g.nachweis]], [1200, 3200, 5200]));
    push(h4('Freigabekriterien'));
    push(checks(g.kriterien));
    push(h4('Stop-Kriterien – keine bedingte Freigabe möglich'));
    push(punkte(g.stop));
    push(h4('Eskalation'));
    push(abs(g.eskalation));
  });

  push(h2('B2 · Die zwanzig Phasen'));
  PHASEN.forEach(p => {
    const z = ZUSATZ[p.nr];
    push(h3(`Phase ${p.nr} · ${p.name}`));
    push(tabelle(['Verantwortlich', 'Dauer', 'CRM-Status', 'Gate', 'Register'],
      [[p.verantwortung, p.dauer === 'laufend' ? 'laufend' : p.dauer + ' AT',
        z.crm.status, z.gates.length ? z.gates.map(g => 'GATE ' + g).join(', ') : '—',
        p.recht.length ? p.recht.join(', ') : '—']],
      [2300, 900, 1700, 1500, 3200]));

    push(h4('Zweck'));            push(abs(p.ziel));
    push(h4('Ausgangslage'));     push(abs(z.ausgangslage));
    push(h4('Beteiligte'));       push(abs(z.beteiligte));
    push(h4('Inputs'));           push(punkte(p.unterlagen));
    push(h4('Arbeitsschritte'));  push(punkte(p.makler));
    push(h4('Aufgaben des Eigentümers')); push(punkte(p.eigentuemer));
    push(h4('Prüfungen'));        push(punkte(p.pruefungen));
    push(h4('Entscheidungen'));   push(punkte(z.entscheidungen));
    push(h4('Entscheidungsträger')); push(abs(z.entscheider));
    push(h4('Risiken'));          push(punkte(z.risiken));
    push(h4('Dokumentation'));    push(punkte(z.dokumentation));
    push(h4('Dokumente'));        push(abs(z.dokumente.join(' · ')));
    push(h4('Kommunikation Eigentümer')); push(punkte(p.kommunikation));
    push(h4('CRM'));
    push(tabelle(['Status', 'Aktivität', 'Aufgabe', 'Frist', 'Priorität'],
      [[z.crm.status, z.crm.aktivitaet, z.crm.aufgabe, z.crm.frist, z.crm.prio]],
      [1500, 2100, 3400, 1500, 1100]));
    push(h4('Output'));           push(abs(p.ergebnis));
    push(h4('Quality Gate'));
    push(abs(z.gates.length
      ? z.gates.map(g => `GATE ${g} – ${GATES.find(x => x.nr === g).name}`).join(' und ')
        + ': Kriterien und Stop-Kriterien nach Abschnitt B1. Ohne Freigabe startet die nächste Phase nicht.'
      : 'Kein Gate. Übergang nach Erreichen des Outputs.'));
    push(h4('Stop-Kriterien'));   push(punkte(z.stop));
    push(h4('Eskalation'));       push(punkte(z.eskalation));
    push(leer());
  });


  /* ======================================================== TEIL C */
  push(h1neu('Teil C · Bewertung, Preisbegriffe und Preissteuerung'));

  push(h2('C1 · Die sechs Preisbegriffe'));
  push(abs('Version 1 kannte Wertspanne und Angebotspreis. Damit liessen sich zwei zentrale Gespräche nicht führen: weshalb ein Angebot unter dem Angebotspreis ein gutes Ergebnis sein kann, und die Trennung zwischen dem, was der Eigentümer braucht, und dem, was das Objekt wert ist.'));
  push(punkte(P.BEGRIFFE_WARUM));
  push(leer());
  push(tabelle(['Begriff', 'Definition', 'Wie bestimmt', 'Wer bestimmt', 'Abgrenzung'],
    P.BEGRIFFE.map(b => [b.b, b.def, b.bestimmt, b.wer, b.abgrenzung]),
    [1500, 2300, 2000, 1500, 2300]));
  push(info('Regel für die Kommunikation', [
    'Nach aussen geht ausschliesslich der strategische Angebotspreis.',
    'Zielpreis, erwartbarer Transaktionspreis und Mindestpreis sind intern; der Mindestpreis ist streng vertraulich.',
    'In der Bewertungsbesprechung werden alle sechs Werte benannt und auseinandergehalten.']));

  push(h2('C2 · Bewertungsmethoden'));
  BW.METHODEN.forEach(m => {
    push(h4(m.m));
    push(mix([{text: 'Einsatz: ', bold: true}, m.einsatz]));
    push(mix([{text: 'Vorgehen: ', bold: true}, m.vorgehen]));
    push(mix([{text: 'Grenzen: ', bold: true}, m.grenzen]));
  });
  push(recht(['Diese Bewertung ist eine Verkaufspreisempfehlung im Rahmen eines Verkaufsmandats. Sie ist keine Schatzung im Rechtssinne und kein Gutachten für Steuer-, Erb- oder Gerichtszwecke. Wird eine solche verlangt, ist eine qualifizierte Schätzungsexpertise zu beauftragen. Dieser Hinweis gehört in jeden Bewertungsbericht.']));

  push(h2('C3 · Einflussfaktoren und ihre Quellen'));
  push(tabelle(['Faktor', 'Wirkung auf den Wert', 'Quelle'],
    BW.EINFLUSS.map(e => [e.f, e.wirkung, e.quelle]), [2000, 4600, 3000]));

  push(h2('C4 · Ablauf der Bewertung'));
  push(nrpunkte(BW.ABLAUF.map(z => { const m = z.match(/^(\d+)\.\s+(.*)$/); return m ? [m[1] + '.', m[2]] : ['–', z]; })));
  push(praxis('Plausibilitätsprüfungen vor der Unterschrift', [
    'Preis pro Quadratmeter Wohnfläche gegen die Vergleichsobjekte: liegt er in der Spanne des Segments?',
    'Landanteil am Gesamtwert: bei Einfamilienhäusern je nach Lage typischerweise 30 bis 60 Prozent. Starke Abweichungen sind zu erklären.',
    'Neuwert Gebäude gegen Gebäudeversicherungswert: erhebliche Abweichungen deuten auf einen falschen Kubikmeterpreis oder eine veraltete Schatzung.',
    'Sanierungsbedarf gegen Zeitbauwert: über 40 Prozent verlangt eine Zustandsanalyse durch eine Fachperson – Eskalation nach Gate 3.',
    'Vergleichswert gegen Realwert: Abweichungen über 15 Prozent sind zu begründen, nicht zu mitteln.']));

  push(h2('C5 · Sonderfall Baurecht'));
  push(abs('Das Realwertschema ist beim Baurecht nicht unverändert anwendbar. Diese Anweisung wurde nach Falltest FT6 ergänzt (Lücke L2 im Begleitdokument).'));
  push(tabelle(['Punkt', 'Anweisung'], BW.BAURECHT.map(b => [b.p, b.i]), [2400, 7200]));

  push(h2('C6 · Bewertungsbericht'));
  push(abs('Der Bericht enthält die folgenden Abschnitte in dieser Reihenfolge. Nicht anwendbare Abschnitte werden mit Begründung als solche bezeichnet, nicht weggelassen.'));
  push(tabelle(['Abschnitt', 'Inhalt'], BW.VORLAGE.map(v => [v.a, v.i]), [2400, 7200]));
  push(leer());
  push(h4('Rechenschema Realwert'));
  push(tabelle(['Position', 'Einheit', 'Herkunft'],
    BW.REALWERT.map(r => [r.pos, r.einheit, r.formel ? 'Berechnet' : (r.hinweis || 'Eingabe')]),
    [4000, 1600, 4000]));
  push(h4('Bauteile für den Sanierungsbedarf'));
  push(abs('Bauteilweise mit Kostenschätzung und Zeithorizont, nie als Pauschale. Nur so lässt sich der Abzug gegenüber Eigentümer und Käufer begründen.'));
  push(punkte(BW.SANIERUNG_BAUTEILE));

  push(h2('C7 · Marktindikatoren'));
  push(abs('Grundlage jeder Aussage zur Marktreaktion und jeder Preisdiskussion. Erhebung im Controlling der Mappe 06.'));
  push(punkte(P.INDIKATOREN_GRUNDSATZ));
  push(leer());
  push(tabelle(['Indikator', 'Erhebung', 'Aussage'],
    P.INDIKATOREN.map(i => [i.i, i.erhebung, i.aussage]), [2600, 3200, 3800]));

  push(h2('C8 · Preissteuerung: Entscheidungslogik'));
  push(abs('Version 1 kannte die Regel «ab 90 Tagen Strategieüberprüfung». Der Zeitablauf ist kein Indikator für die Ursache: ein Objekt mit vielen Anfragen und wenigen Besichtigungen hat ein Darstellungsproblem, ein Objekt ohne Anfragen ein Positionierungsproblem. Beide sehen nach 90 Tagen gleich aus. Die folgenden acht Logiken ersetzen die Fristenregel.'));
  P.STEUERUNG.forEach(x => {
    push(h4(`${x.nr} · ${x.situation}`));
    push(mix([{text: 'WENN ', bold: true}, x.wenn]));
    push(mix([{text: 'Interpretation: ', bold: true}, x.interpretation]));
    push(mix([{text: 'DANN ', bold: true}, x.dann]));
    push(mix([{text: 'SONST ', bold: true}, x.sonst]));
    push(mix([{text: 'NIE: ', bold: true, color: '8C2F2F'}, x.nie]));
  });

  push(h2('C9 · Ablauf einer Preisänderung'));
  push(abs('Acht Schritte. Der Eigentümer entscheidet; der Makler liefert die Grundlage. Ohne Schritt 2 gibt es keine Empfehlung, ohne Schritt 6 keine Änderung.'));
  push(tabelle(['Nr.', 'Schritt', 'Inhalt'],
    P.PREISAENDERUNG.map(x => [String(x.s), x.t, x.i]), [500, 2100, 7000]));
  push(info('Auslösekriterien', [
    'Die Kriterien, bei deren Erreichen ein Massnahmengespräch angesetzt wird, werden in Phase 9 vorab mit dem Eigentümer vereinbart und im Strategieprotokoll festgehalten.',
    'Damit knüpft die spätere Diskussion an Kriterien an und nicht an Stimmungen. Das ist der wesentliche Unterschied zu einer Frist.',
    'Erreichte Kriterien werden angewendet, nicht neu verhandelt.']));

  /* ======================================================== TEIL D */
  push(h1neu('Teil D · Eigentümer'));

  push(h2('D1 · Erstgesprächsleitfaden'));
  push(abs('Gehört zu Phase 3, ausfüllbar als Formular F1. Reihenfolge einhalten: sie führt von der sachlichen Ausgangslage über das Motiv zum Preis. Wer mit dem Preis beginnt, erfährt den Rest nicht mehr.'));
  push(info('Drei Regeln', [
    'Erst zuhören, dann erklären. Der Eigentümer soll in der ersten Hälfte sprechen.',
    'Keine Preisnennung und keine Bandbreite vor Objektaufnahme und Bewertung. Eine im Erstgespräch genannte Zahl lässt sich nicht mehr zurücknehmen.',
    'Antworten wörtlich notieren, besonders zur Frage, was der Eigentümer an der Liegenschaft schätzt. Das sind die glaubwürdigsten Verkaufsargumente und sie stehen in keinem Dossier, das aus Unterlagen entsteht.']));
  F.ERSTGESPRAECH.forEach(b => {
    push(h4(b.block));
    push(tabelle(['Frage', 'Weshalb', 'Was die Antwort bedeutet'],
      b.fragen.map(f => [f.frage, f.warum, f.folge]), [3200, 3200, 3200]));
  });
  push(h4('Sonderfallerkennung im Erstgespräch'));
  push(abs('Neun der dreissig Sonderfälle in Teil J werden hier erkannt: S1 bis S7 zur Verfügungsbefugnis, S27 zur Vorgeschichte, S29 zu Konkurrenzmandaten. Wird einer erkannt, gilt dessen Abklärungsliste vor jedem weiteren Schritt.'));

  push(h2('D2 · Ableitung der Verkaufsstrategie'));
  push(abs('Aus Erstgespräch und Bewertung folgt die Strategie. Sie wird in Phase 9 festgelegt und protokolliert. Die acht Ausgangslagen decken die Regelfälle ab; Mischformen werden begründet zusammengesetzt.'));
  F.STRATEGIE.forEach((x, i) => {
    push(h4(`Ausgangslage ${i + 1} · ${x.lage}`));
    push(mix([{text: 'Empfehlung: ', bold: true}, x.empfehlung]));
    push(mix([{text: 'Begründung: ', bold: true}, x.begruendung]));
  });
  push(info('Was in jedem Strategieprotokoll steht', [
    'Angebotspreis und Mindestpreis, letzterer als streng vertraulich klassifiziert.',
    'Vermarktungsstufe nach Teil F und Vermarktungsform offen oder diskret, mit zur Kenntnis genommenen Konsequenzen.',
    'Kanäle, Zielgruppe, Besichtigungsform, Zeitplan mit Starttag.',
    'Auslösekriterien für die Preissteuerung nach Teil C, Abschnitt C9.',
    'Vorgehen bei mehreren gleichzeitigen Angeboten (S23).',
    'Datum und Unterschrift aller Verfügungsberechtigten.']));

  push(h2('D3 · Maklermandat'));
  push(recht([
    'Strukturvorgabe, kein Vertragstext. Verwendet wird ausschliesslich die freigegebene Vorlage des Unternehmens; jede Abweichung ist erneut vorzulegen.',
    'Die mit [RP] gekennzeichneten Ziffern sind in jedem Fall zu prüfen.']));
  push(tabelle(['Zi.', 'Gegenstand', 'Was zu regeln ist', 'Prüfung', 'Reg.'],
    B.MANDAT.map(m => [m.zi, m.titel, m.inhalt, m.pruefen ? '[RP]' : '—', m.recht || '—']),
    [450, 1750, 5500, 800, 1100]));
  push(info('Drei Klauseln, die am häufigsten Streit auslösen', [
    'Nachwirkung (Ziffer 18): Kommt der Verkauf nach Mandatsende mit einem während der Laufzeit nachgewiesenen Interessenten zustande, entsteht die Honorarfrage. Eng fassen und nachgewiesene Interessenten laufend dokumentieren.',
    'Exklusivität (Ziffer 15): Ob und mit welcher Folge der Eigentümer selbst verkaufen darf, muss ausdrücklich geregelt sein. Schweigen führt zum Streit.',
    'Aufwandersatz (Ziffer 12): Ohne ausdrückliche Vereinbarung besteht kein Anspruch. Wer Vermarktungskosten ersetzt haben will, muss das vereinbaren und begrenzen – siehe auch Teil G, Kostenfolgen bei Abbruch.']));

  push(h2('D4 · Die sechs Fragen jedes Reports'));
  push(abs('Der Eigentümer soll jederzeit sechs Fragen beantworten können. Ein Report, der eine davon offenlässt, ist unvollständig.'));
  push(nrpunkte(EG.SECHS_FRAGEN.map((f, i) => [String(i + 1) + '.', f])));

  push(h2('D5 · Eigentümerdokumente V1 bis V14'));
  push(tabelle(['Nr.', 'Dokument', 'Anlass', 'Zweck', 'Inhalt', 'Einzuholender Entscheid'],
    EG.REPORTS.map(r => [r.nr, r.t, r.anlass, r.zweck, r.inhalt, r.entscheid]),
    [500, 1500, 1400, 2000, 2600, 1600]));
  push(leer());
  push(info('Regeln für die Eigentümerkommunikation', EG.REPORT_REGELN));

  /* ======================================================== TEIL E */
  push(h1neu('Teil E · Käufer'));

  push(h2('E1 · Der neunstufige Funnel'));
  push(abs('Version 1 kannte drei Stufen und liess für die höchste eine «plausible Selbstauskunft» zur Finanzierung genügen. Zwischen «interessiert» und «Vertragskandidat» liegen mehrere Zustände mit unterschiedlichem Handlungsbedarf.'));
  push(tabelle(['St.', 'Stufe', 'Definition', 'Übergangskriterium', 'Aktion', 'Abbruchgrund'],
    K.FUNNEL.map(f => [String(f.st), f.name, f.def, f.kriterium, f.aktion, f.abbruch]),
    [400, 1500, 1900, 2400, 1900, 1500]));
  push(leer());
  push(info('Funnelregeln', K.FUNNEL_REGELN));

  push(h2('E2 · Käuferprofil'));
  push(abs('Erhoben nach Formular F2, geführt in Mappe 06. Die Spalte «ab Stufe» sagt, wann ein Feld vorliegen muss – nicht alles wird beim ersten Kontakt gefragt.'));
  const pgr = [];
  K.PROFIL.forEach(x => { if (x.g) { pgr.push({t: x.g, z: []}); return; } pgr[pgr.length - 1].z.push(x); });
  pgr.forEach(g => {
    push(h4(g.t));
    push(tabelle(['Feld', 'Zweck', 'Pflicht'], g.z.map(x => [x.f, x.z, x.pflicht]), [3200, 5000, 1400]));
  });

  push(h2('E3 · Besichtigung'));
  push(abs('Checkliste F3, fünf Blöcke von der Vorbereitung am Vortag bis zur Nachbereitung am gleichen Tag. Die vollständige Liste steht in Dokument 03; hier die Punkte, die am häufigsten übergangen werden.'));
  push(checks([
    'Alle Räume aufgeschlossen, auch Keller, Estrich, Technikraum und Garage – nicht gezeigte Räume erzeugen Misstrauen und Haftungsrisiko',
    'Bekannte Mängel aktiv ansprechen, nicht abwarten, ob sie auffallen',
    'Offenlegungsvermerk im Protokoll: wem wurde was gezeigt und gesagt',
    'Keine Aussagen zu Bauzulässigkeit, Steuerfolgen oder Finanzierung – konsequent an die zuständige Stelle verweisen',
    'Nicht sicher beantwortbare Fragen notieren und schriftlich nachliefern',
    'Bei vermietetem Objekt: Termin rechtzeitig schriftlich beim Mieter angekündigt, Zahl begrenzt, gebündelt (R47)',
    'Interessentenformular vor Ort vollständig ausfüllen lassen',
    'Rückmeldung innerhalb von 48 Stunden strukturiert erheben']));
  push(recht([
    'Der Offenlegungsvermerk im Besichtigungsprotokoll ist der Nachweis der Offenlegung. Er trägt die Wegbedingung der Gewährleistung im Kaufvertrag; diese ist ungültig, soweit Mängel arglistig verschwiegen wurden (R10).',
    'Bei vermieteten Objekten besteht eine Duldungspflicht des Mieters, aber kein freies Zutrittsrecht des Vermieters. Besichtigungen sind rechtzeitig anzukündigen und auf das Notwendige zu beschränken (Art. 257h OR, R47).']));

  push(h2('E4 · Kaufangebot'));
  push(recht([
    'Das Formular «Kaufangebot Immobilie» ist eine unverbindliche Absichtserklärung. Ein Kaufvertrag über ein Grundstück kommt ausschliesslich durch öffentliche Beurkundung zustande (Art. 216 Abs. 1 OR, R1).',
    'Auch ein Vorvertrag bedarf der öffentlichen Beurkundung (Art. 216 Abs. 2 OR, R2). Enthält das Formular eine Kaufverpflichtung, eine Konventionalstrafe oder eine Verfallsklausel, ist es ein formungültiger Vorvertrag und nicht durchsetzbar.',
    'Vor der Verwendung durch die Rechtsberatung freigeben und danach unverändert einsetzen.']));
  push(leer());
  push(tabelle(['Block', 'Rechtliche Wirkung', 'Inhalt'],
    F.KAUFANGEBOT.map(b => [b.block, b.bindung, b.felder.join(' · ')]), [1900, 1500, 6200]));
  push(info('Was der Makler beim Angebotseingang tut', [
    'Eingang mit Datum und Uhrzeit protokollieren – bei mehreren Angeboten ist die Reihenfolge relevant.',
    'Vollständigkeit prüfen und fehlende Angaben mit Frist nachfordern, bevor das Angebot vorgelegt wird.',
    'Objektbezogene Finanzierungsbestätigung verlangen; eine allgemeine Kreditfähigkeitsauskunft genügt nicht (R40).',
    'Erwerbsrechtliche Zulässigkeit abschliessend klären (R34–R36).',
    'GwG-Triage mit der Nutzungsabsicht abschliessen (R37).',
    'Jedes Angebot dem Eigentümer vorlegen – auch solche, die der Makler für aussichtslos hält. Die Auswahl ist nicht seine Aufgabe.']));

  push(h2('E5 · Angebotsvergleichsmatrix'));
  push(abs('Neunzehn Kriterien. Die Matrix erzeugt keine Rangliste, sondern macht ungleiche Angebote vergleichbar.'));
  push(tabelle(['Kriterium', 'Art', 'Bedeutung für die Entscheidung'],
    K.VERGLEICH.map(v => [v.k, v.art, v.bedeutung]), [2600, 2600, 4400]));
  push(leer());
  push(info('Regeln des Angebotsvergleichs', K.VERGLEICH_REGELN));

  push(h2('E6 · Verhandlung'));
  push(abs('Vor jeder Verhandlung sind elf Punkte bestimmt. Fehlt einer, wird nicht verhandelt.'));
  push(tabelle(['Punkt', 'Inhalt'], K.VERHANDLUNG_VORBEREITUNG.map(v => [v.p, v.i]), [2600, 7000]));
  push(h4('Verhandlungsmasse neben dem Preis'));
  push(abs('In dieser Reihenfolge prüfen, bevor über den Preis verhandelt wird. Der Preis ist selten die wirksamste Verhandlungsmasse.'));
  push(tabelle(['Masse', 'Wirkung', 'Wann einsetzen'], [
    ['Übergabetermin', 'Für Käufer mit Kündigungsfrist oder auslaufender Festhypothek häufig mehr wert als ein Preisnachlass', 'Wenn der Eigentümer zeitlich flexibel ist'],
    ['Inventar', 'Küchengeräte, Gartenmöbel, Storen, Einbauten lassen sich beziffern und ersparen Anschaffungen', 'Wenn der Eigentümer Gegenstände ohnehin nicht mitnimmt'],
    ['Sanierungsbeitrag', 'Ein bezifferter Beitrag an eine konkrete Massnahme wirkt sachlicher als ein allgemeiner Nachlass', 'Bei unbestrittenem, preisrelevantem Sanierungsbedarf'],
    ['Zahlungsmodalitäten', 'Früherer Beurkundungstermin oder kürzere Zahlungsfrist senken das Abwicklungsrisiko', 'Wenn der Eigentümer Terminsicherheit braucht'],
    ['Nutzen- und Gefahrenübergang', 'Verschiebung verteilt Kosten und Risiken sinnvoll', 'Bei Auseinanderfallen von Beurkundung und Umzug'],
    ['Wegbedingung der Gewährleistung', 'Kein Verhandlungsgegenstand für den Makler', 'Nie – ausschliesslich über das Notariat [RP]'],
  ], [2100, 4500, 3000]));
  push(h4('Verhandlungsprotokoll'));
  push(abs('Je wesentliche Runde, am gleichen Tag. Was nicht protokolliert ist, ist im Streitfall nicht geschehen.'));
  push(punkte(K.VERHANDLUNG_PROTOKOLL));
  push(h4('Verhandlungsregeln'));
  push(punkte(K.VERHANDLUNG_REGELN));
  push(h4('Verfahren bei mehreren Angeboten'));
  push(punkte([
    'Verfahren vor der ersten Rückmeldung festlegen und dem Eigentümer zum Entscheid vorlegen (S23).',
    'Allen Interessenten dieselbe Information und dieselbe Frist geben; das Vorgehen schriftlich mitteilen.',
    'Angebotsbeträge Dritter nicht offenlegen. Zulässig ist der wahrheitsgemässe Hinweis, dass weitere Angebote vorliegen.',
    'Keine Auktionsmechanik ohne vorherige Offenlegung gegenüber allen Beteiligten.',
    'Verfahren, Fristen und Mitteilungen lückenlos protokollieren.',
    'Zweitplatzierte nicht endgültig absagen, sondern transparent in Wartestellung halten – Reservationen platzen.']));

  /* ======================================================== TEIL F */
  push(h1neu('Teil F · Vermarktung'));

  push(h2('F1 · Die acht Vermarktungsstufen'));
  push(abs('Version 1 ordnete die Kanäle, kannte aber keine Stufen. Pre-Marketing, Off-Market, Soft Launch, Remarketing und Rückzug sind eigene Entscheidungen mit eigenen Folgen.'));
  MK.STUFEN.forEach(s2 => {
    push(h4(`Stufe ${s2.st} · ${s2.name}`));
    push(tabelle(['Zeitpunkt', 'Zweck', 'Zielgruppe'], [[s2.zeit, s2.zweck, s2.zielgruppe]], [2000, 4000, 3600]));
    push(tabelle(['Erfolgsmessung', 'Kosten', 'Verantwortlich'], [[s2.messung, s2.kosten, s2.verantwortlich]], [4000, 3000, 2600]));
    push(mix([{text: 'Regel: ', bold: true}, s2.regel]));
  });

  push(h2('F2 · Kanäle'));
  push(tabelle(['Kanal', 'Zielgruppe', 'Zweck', 'Zeitpunkt', 'Kosten', 'Verantw.', 'Erfolgsmessung'],
    MK.KANAELE.map(c => [c.k, c.zg, c.zweck, c.zeit, c.kosten, c.verantw, c.messung]),
    [1500, 1500, 1800, 1300, 1000, 900, 1600]));

  push(h2('F3 · Verkaufsdossier'));
  push(abs('Dreiundzwanzig Abschnitte in der Lesereihenfolge eines Kaufinteressenten. Die Vorlage steht in Dokument 04.'));
  push(tabelle(['Nr.', 'Abschnitt', 'Inhalt'],
    B.DOSSIER.map(d => [String(d.nr), d.titel, d.inhalt]), [520, 2080, 7000]));
  push(praxis('Die beiden Abschnitte, die über die Qualität entscheiden', [
    'Abschnitt 18, Renovationen und offener Sanierungsbedarf: Die Versuchung ist gross, den Sanierungsbedarf weglassen zu wollen. Das Gegenteil ist richtig. Ein offen benannter, bezifferter Bedarf begrenzt den Abschlag auf das Sachliche; ein verschwiegener erzeugt Misstrauen gegenüber allen übrigen Angaben und führt zum Abbruch nach der Besichtigung.',
    'Abschnitt 23, rechtliche Hinweise: Jede Angabe kann als Zusicherung gelten. Der Hinweisabschnitt ersetzt keine Sorgfalt, aber er grenzt ab, worauf die Angaben beruhen, und nennt Norm und Quelle der Flächen.']));

  push(h2('F4 · Release-Checkliste'));
  push(abs('Wird vor jeder Veröffentlichung vollständig abgearbeitet und abgezeichnet (Kontrollpunkt K2, Gate 4). Eine offene Position verhindert die Veröffentlichung.'));
  push(checks([
    'Eigentümerdaten und Eigentumsverhältnisse stimmen mit dem Grundbuchauszug überein',
    'Grundbuchauszug nicht älter als drei Monate; alle Belege bezogen',
    'Grundstücksfläche aus dem Grundbuchauszug; Parzellennummer auf allen Unterlagen identisch',
    'Wohn- und Nebenflächen mit Berechnungsnorm und belegter Quelle',
    'Baujahr aus amtlicher Quelle; Sanierungsjahre je Bauteil belegt',
    'Renovationen nur belegte Massnahmen; offener Sanierungsbedarf bauteilweise beziffert',
    'Bewilligungsstatus aller Umbauten geklärt; keine nicht bewilligte Fläche als Wohnfläche ausgewiesen (R44)',
    'Energieangaben nur bei vorliegendem GEAK, mit Nummer und Datum (R33)',
    'Heizsystem, Energieträger, Baujahr des Wärmeerzeugers belegt',
    'Parkierung: Art, Anzahl, Eigentums- oder Mietverhältnis',
    'Dienstbarkeiten, Grundlasten, Anmerkungen in Klartext mit praktischer Bedeutung (R5)',
    'Baurecht: Restlaufzeit, Zins, Heimfall, Zustimmungserfordernis (S9)',
    'Mietverhältnisse offengelegt; Übergang auf den Erwerber erläutert (R8)',
    'Pläne und Grundrisse neu gezeichnet, mit Flächen, Nordpfeil, Massstabshinweis',
    'Situationsplan mit Quelle und Datum',
    'Bilder gegen die Ausschlussliste geprüft; virtuelle Möblierung gekennzeichnet',
    'Texte je Kanal konsistent: Flächen, Zimmerzahl, Baujahr identisch',
    'Preis entspricht dem schriftlichen Preisentscheid',
    'Vermarktungsstufe und Kanäle entsprechen dem Strategieprotokoll',
    'Kaufnebenkosten für den zutreffenden Kanton, als Spanne mit Quelle und Datum (R26)',
    'Rechtliche Hinweise in der freigegebenen Fassung',
    'Datenschutzhinweis auf allen Anfragewegen verlinkt (R39)',
    'Bildrechte und Nutzungsdauer schriftlich geregelt',
    'Schriftliche Freigabe des Eigentümers liegt vor',
    'Vier-Augen-Prüfung K2 abgezeichnet']));

  push(h2('F5 · Inserat'));
  push(tabelle(['Abschnitt', 'Inhalt und Anforderung'],
    B.INSERAT_ABSCHNITTE.map(a => [a.t, a.v]), [2200, 7400]));
  push(h4('Sprachregeln'));
  push(punkte([
    'Keine Superlative und keine Ausrufezeichen: nicht «einmalige Traumlage», sondern «Südlage am Hang, Sicht auf [Objekt] gemäss Zonenplan».',
    'Keine Behauptungen ohne Beleg. «Ruhige Lage» ist eine Behauptung; «Sackgasse, kein Durchgangsverkehr, Tempo 30» ist eine Angabe.',
    'Zahlen statt Adjektive: Baujahr, Sanierungsjahr, Fläche, Gehminuten, Leistung in kWp.',
    'Ausbaupotenzial nur mit behördlicher Bestätigung und mit Quellenangabe (R27).',
    'Energieangaben nur bei vorliegendem GEAK; ohne GEAK das Heizsystem beschreiben, nicht die Effizienz behaupten (R33).',
    'Keine Zielgruppenansprache mit diskriminierendem Bezug. Das Objekt beschreiben, nicht die erwünschten Käufer.',
    'Einheitliche Schreibweise über alle Kanäle – Abweichungen sind die häufigste Reklamationsquelle.']));

  push(h2('F6 · Fotografie'));
  push(abs('Die Bildqualität entscheidet über die Klickrate und damit über die Anzahl Anfragen. Vollständige Listen in Dokument 03 und Mappe 02.'));
  push(h4('Vorbereitung durch den Eigentümer'));
  push(abs('Geht zwei Wochen vor dem Aufnahmetermin an den Eigentümer.'));
  push(checks(B.FOTO_VORBEREITUNG));
  push(h4('Zwingende Aufnahmen'));
  push(abs('Fehlt eine, entstehen Rückfragen und unnötige Besichtigungen. Interessenten misstrauen Objekten, deren Keller, Technik oder Nebenräume nicht gezeigt werden.'));
  push(punkte(B.FOTO_PFLICHT));
  push(h4('Zu vermeiden'));
  push(punkte(B.FOTO_MEIDEN));
  push(h4('Bildreihenfolge im Inserat'));
  push(abs('Die ersten drei Bilder bestimmen, ob das Inserat geöffnet wird. Reihenfolge über alle Kanäle identisch.'));
  push(nrpunkte(B.FOTO_REIHENFOLGE.map(r => { const m = r.match(/^(\d+)\.\s+(.*)$/); return m ? [m[1] + '.', m[2]] : ['–', r]; })));
  push(h4('Zusatzleistungen'));
  push(tabelle(['Leistung', 'Wann sinnvoll', 'Worauf zu achten ist'],
    B.FOTO_ZUSATZ.map(z => [z.leistung, z.wann, z.hinweis]), [1900, 3700, 4000]));
  push(recht([
    'Bildrechte und Nutzungsdauer sind mit dem Fotografen schriftlich zu regeln, einschliesslich der Nutzung nach Mandatsende.',
    'Keine identifizierbaren Personen, keine Nachbarfenster, keine Kennzeichen. Bei Drohnenaufnahmen zusätzlich die Vorschriften des Flugbetriebs und die Rechte der Nachbarn beachten (R39).',
    'Virtuelle Möblierung darf Bausubstanz und Ausbau nicht verändern – das wäre eine unzutreffende Zusicherung (R9).']));

  /* ======================================================== TEIL G */
  push(h1neu('Teil G · Recht und Compliance'));

  push(h2('G1 · Quellengüte und Rechtsstand'));
  push(recht(CP.QUELLENVORBEHALT));

  push(h2('G2 · Normebenen'));
  push(abs('Jede Registerposition in Teil K nennt ihre Normebene. Die Unterscheidung ist praktisch entscheidend: Bundesrecht gilt überall gleich, kantonales und kommunales Recht ist je Objekt zu klären, Praxis und Selbstregulierung sind veränderlich und interne Vorgaben sind vom Unternehmen zu setzen.'));
  push(tabelle(['Normebene', 'Bedeutung für die Arbeit'], [
    ['Bundesrecht', 'Gilt in der ganzen Schweiz. Direkt anwendbar, Artikel zitierbar.'],
    ['Kantonales Recht', 'Je Kanton unterschiedlich. Vor jedem Mandat über die Klärungsliste A7 abzuklären.'],
    ['Kommunales Recht', 'Je Gemeinde unterschiedlich, insbesondere Bau- und Zonenordnung. Schriftliche Auskunft mit Datum.'],
    ['Grundbuchpraxis', 'Verfahren, Fristen und Formen des zuständigen Grundbuchamts. Nicht verallgemeinerbar.'],
    ['Notariatspraxis', 'Abhängig vom Notariatssystem des Kantons; insbesondere Formerfordernisse für Vollmachten.'],
    ['Steuerrecht', 'Rahmen im Bundesrecht, Ausgestaltung kantonal. Keine Berechnung durch den Makler.'],
    ['Selbstregulierung', 'Branchenstandard, von der Aufsicht anerkannt. Verbindlich für die Beteiligten, aber kein Gesetz.'],
    ['Interne Vorgabe', 'Vom Unternehmen zu definieren: Provisionssätze, Löschfristen, Budgetgrenzen, Weisungswesen.'],
    ['Best Practice', 'Fachlich empfohlen, rechtlich nicht vorgeschrieben. Abweichung möglich, aber zu begründen.'],
  ], [2200, 7400]));

  push(h2('G3 · Geldwäschereirecht: Anknüpfung'));
  push(tabelle(['Punkt', 'Inhalt'], CP.GWG_ANKNUEPFUNG.map(x => [x.p, x.i]), [2200, 7400]));

  push(h2('G4 · Ausnahmen'));
  push(abs('Version 1 nahm die Unterstellung pauschal an und baute in vier Phasen eine ausnahmslose Identifikationspflicht ein. Das war in zwei Richtungen falsch: es erhob Daten ohne Rechtsgrundlage und prüfte zugleich am falschen Zeitpunkt. Die folgenden Ausnahmen sind die Grundlage der Triage.'));
  push(tabelle(['Nr.', 'Ausnahme', 'Inhalt', 'Folge für die Praxis', 'Vorbehalt'],
    CP.GWG_AUSNAHMEN.map(x => [x.nr, x.ausnahme, x.inhalt, x.folge, x.vorbehalt]),
    [450, 1750, 2700, 2700, 2000]));

  push(h2('G5 · Triage in sechs Schritten'));
  push(abs('Wird je Mandat durchgeführt und abgeschlossen, sobald die Nutzungsabsicht der Käuferschaft bekannt ist – also in Phase 15, nicht bei der Mandatsannahme. Zwischenergebnis wird bei Gate 2 festgehalten, Endergebnis bei Gate 6.'));
  CP.GWG_TRIAGE.forEach(t => {
    push(h4(`Schritt ${t.nr}`));
    push(mix([{text: 'Frage: ', bold: true}, t.frage]));
    push(mix([{text: 'JA → ', bold: true}, t.ja]));
    push(mix([{text: 'NEIN → ', bold: true}, t.nein]));
  });
  push(h4('Die drei Pfade'));
  push(tabelle(['Pfad', 'Pflichtenumfang', 'Verantwortung'],
    CP.GWG_PFADE.map(p2 => [p2.pfad, p2.inhalt, p2.verantwortung]), [1900, 5300, 2400]));

  push(h2('G6 · Transparenzregister TJPG'));
  push(tabelle(['Punkt', 'Inhalt'], CP.TJPG.map(x => [x.p, x.i]), [2200, 7400]));

  push(h2('G7 · Politisch exponierte Personen und Sanktionen'));
  push(tabelle(['Punkt', 'Inhalt'], CP.PEP.map(x => [x.p, x.i]), [2200, 7400]));

  push(h2('G8 · Datenschutz und Bildrechte'));
  push(tabelle(['Punkt', 'Inhalt'], CP.DATENSCHUTZ.map(x => [x.t, x.i]), [2200, 7400]));

  push(h2('G9 · Aufbewahrung'));
  push(abs('Version 1 verlangte, Aufbewahrungsfristen zu setzen, ohne sie zu benennen. Die Untergrenze für Geschäftsunterlagen sind zehn Jahre (Art. 958f OR, R46); für Offenlegungsnachweise gilt die längere Beweisvorsorge, weil die Gewährleistung bei Gebäuden fünf Jahre nach Eigentumserwerb verjährt (R11).'));
  push(tabelle(['Kategorie', 'Dauer', 'Grund', 'Stufe'],
    CP.AUFBEWAHRUNG.map(a => [a.kat, a.dauer, a.grund, a.stufe]), [2600, 2400, 3200, 1400]));

  push(h2('G10 · Kostenfolgen bei Abbruch'));
  push(abs('Ergänzt nach Falltest FT10 (Lücke L3). Die Frage stellt sich immer im ungünstigsten Moment – unmittelbar nach einem gescheiterten Abschluss. Sie ist deshalb vorher zu klären.'));
  push(tabelle(['Position', 'Regelung'], CP.KOSTENFOLGEN.map(x => [x.p, x.i]), [2200, 7400]));

  /* ======================================================== TEIL H */
  push(h1neu('Teil H · Notariat, Vertragsphase und Übergabe'));
  push(abs('Die Phasen 17 bis 20. Der Vertrag wird vom Notariat redigiert und beurkundet. Der Makler beauftragt vollständig, prüft gegen die Einigung und koordiniert – er redigiert nicht und erteilt keine Rechtsauskunft.'));
  push(recht(['Das Notariatssystem ist kantonal unterschiedlich: Amtsnotariat, freies Notariat oder Mischform. Zuständigkeit, Terminvorlauf, Gebührentarif, Kostenfolge bei Abbruch und Formerfordernisse für Vollmachten sind für den betroffenen Kanton abzuklären (R1, R16, R26).']));

  push(h2('H1 · Reservation'));
  push(recht([
    'Der rechtlich heikelste Baustein des ganzen Prozesses. Eine Reservationsvereinbarung über ein Grundstück mit im Voraus bestimmtem Kaufpreis ist ein Vorvertrag im Sinne von Art. 216 Abs. 2 OR und bedarf der öffentlichen Beurkundung. In der Praxis wird sie nicht beurkundet – sie ist damit formungültig (R2).',
    'Folge: Konventionalstrafen und Verfallsklauseln sind nicht durchsetzbar, geleistete Reservationszahlungen grundsätzlich zurückzuerstatten.',
    'Unternehmensgrundsatz: Die Reservationsbestätigung ist ausschliesslich eine unverbindliche Absichtserklärung ohne Kaufverpflichtung, Konventionalstrafe und Verfallsklausel. Reservationszahlungen werden nicht entgegengenommen – weder in Bargeld noch auf ein Konto des Maklers (R38).',
    'Ist im Einzelfall eine Anzahlung unvermeidlich, erfolgt sie ausschliesslich auf ein Konto des beauftragten Notariats, ist jederzeit vollumfänglich rückforderbar und bedarf der Freigabe der Rechtsberatung.']));
  push(tabelle(['Zi.', 'Gegenstand', 'Inhalt'],
    F.RESERVATION.map(r => [r.zi, r.titel, r.inhalt]), [450, 2150, 7000]));
  push(praxis('Was die Reservation trotz ihrer Unverbindlichkeit leistet', [
    'Sie hält die Einigung über Preis, Termin, Inventar und Bedingungen schriftlich fest.',
    'Sie dokumentiert gegenüber dem Eigentümer, weshalb die Vermarktung zurückgestellt wird.',
    'Sie legt den Zeitplan bis zur Beurkundung und die beizubringenden Unterlagen fest.',
    'Sie befristet die Zurückstellung: läuft die Frist ohne Beurkundung ab, läuft die Vermarktung ohne weitere Mitteilung wieder an.',
    'Die verhaltenssteuernde Wirkung entsteht aus Befristung und Transparenz, nicht aus einer Strafe – die ohnehin nicht durchsetzbar wäre.']));

  push(h2('H2 · Vor dem Notariat'));
  push(abs('Vollständigkeit entscheidet über die Dauer bis zur Beurkundung. Jede fehlende Angabe kostet typischerweise eine Woche. Gate 8 verlangt die Vollständigkeitsbestätigung des Notariats – nicht die eigene Einschätzung.'));
  push(tabelle(['Position', 'Was zu übermitteln ist'], F.NOTARIAT_VOR.map(n => [n.p, n.i]), [2400, 7200]));

  push(h2('H3 · Nach dem Notariat'));
  push(tabelle(['Position', 'Was zu erledigen und zu kontrollieren ist'],
    F.NOTARIAT_NACH.map(n => [n.p, n.i]), [2400, 7200]));
  push(info('Drei Zeitpunkte, die nicht zu verwechseln sind', [
    'Beurkundung: Der Kaufvertrag wird gültig. Ab hier sind beide Parteien gebunden (R1).',
    'Nutzen- und Gefahrenübergang: Der im Vertrag vereinbarte Zeitpunkt, ab dem Nutzen, Kosten und Risiko übergehen. Er bestimmt auch den Versicherungswechsel.',
    'Eigentumsübergang: Die Eintragung im Grundbuch. Erst damit wird der Käufer Eigentümer (Art. 656 Abs. 1 ZGB, R3).',
    'Diese drei fallen in der Regel nicht zusammen. Beide Parteien sind ausdrücklich darauf hinzuweisen; Vorlage K17 enthält die Erklärung.']));

  push(h2('H4 · Übergabe'));
  push(abs('Erst nach bestätigter Eintragung im Grundbuch und vollständigem Zahlungseingang – Gate 10. Das Protokoll ist Formular F11, die ausfüllbare Fassung steht in Dokument 03.'));
  push(tabelle(['Block', 'Gegenstand'],
    F.UEBERGABE.map(b => [b.block, b.felder.slice(0, 4).join(' · ') + (b.felder.length > 4 ? ' …' : '')]),
    [2400, 7200]));
  push(praxis('Die vier häufigsten Fehler bei der Übergabe', [
    'Schlüssel werden nicht gezählt. Anzahl je Art festhalten und quittieren; fehlende Schlüssel ausdrücklich vermerken samt Vereinbarung.',
    'Zählerstände ohne Zählernummer notiert. Ohne Nummer ist der Stand gegenüber dem Versorger nicht verwertbar. Zusätzlich fotografieren.',
    'Offene Punkte mündlich vereinbart. Sie gehören mit Verantwortlichkeit und Frist ins Protokoll, sonst sind sie nach zwei Wochen strittig.',
    'Protokoll nicht unterzeichnet oder nur in einem Exemplar. Beide Parteien unterzeichnen, beide erhalten eine Ausfertigung, eine bleibt im Dossier.']));

  /* ======================================================== TEIL I */
  push(h1neu('Teil I · CRM, Dokumente und Qualitätssicherung'));

  push(h2('I1 · Objektpipeline'));
  push(abs('Version 1 führte nur Interessentenstatus; der Objektfortschritt war nicht abbildbar. Siebzehn Status mit Pflichtfeldern.'));
  push(tabelle(['Status', 'Phase', 'Bedeutung', 'Pflichtfelder'],
    CRM.OBJEKTSTATUS.map(o => [o.st, o.phase, o.bedeutung, o.pflichtfeld]),
    [1900, 900, 3600, 3200]));
  push(h4('Verlustgründe'));
  push(abs('Bei Status «Verloren» ist der Grund zu erfassen. Die Verteilung ist die wichtigste Kennzahl für die Akquisequalität.'));
  push(punkte(CRM.VERLUSTGRUND));

  push(h2('I2 · Aktivitätsmodell'));
  push(tabelle(['Feld', 'Vorgabe'], CRM.AKTIVITAET.map(a => [a.f, a.z]), [2400, 7200]));

  push(h2('I3 · Was heute nicht vergessen werden darf'));
  push(abs('Die Tagesliste wird aus dem CRM erzeugt und in dieser Reihenfolge abgearbeitet.'));
  push(tabelle(['Kategorie', 'Auswahlkriterium', 'Priorität'],
    CRM.TAGESLISTE.map(t => [t.a, t.k, t.prio]), [2800, 4400, 2400]));

  push(h2('I4 · Vertraulichkeitsstufen'));
  push(tabelle(['Stufe', 'Bedeutung', 'Beispiele', 'Regel'],
    DM.STUFEN.map(s3 => [s3.s, s3.d, s3.bsp, s3.regel]), [1500, 1900, 3000, 3200]));

  push(h2('I5 · Dokumentenkategorien'));
  push(tabelle(['Kategorie', 'Inhalt', 'Stufe', 'Freigabe', 'Aufbewahrung'],
    DM.KATEGORIEN.map(c => [c.k, c.inhalt, c.stufe, c.frei, c.aufb]),
    [1900, 2900, 1500, 1700, 1600]));

  push(h2('I6 · Metadaten je Dokument'));
  push(tabelle(['Metadatum', 'Vorgabe'], DM.METADATEN.map(m => [m.m, m.v]), [2200, 7400]));

  push(h2('I7 · Datenraum'));
  push(punkte(DM.DATENRAUM));

  push(h2('I8 · Ordnerstruktur und Dateibenennung'));
  push(tabelle(['Nr.', 'Ordner', 'Inhalt'], B.ORDNER.map(o => [o.nr, o.name, o.inhalt]), [480, 2120, 7000]));
  push(h4('Benennungsregeln'));
  push(tabelle(['Regel', 'Vorgabe'], B.BENENNUNG.map(b2 => [b2.regel, b2.wert]), [1800, 7800]));
  push(h4('Beispiele'));
  push(mono(B.BENENNUNG_BEISPIELE));

  push(h2('I9 · Vier-Augen-Prinzip'));
  push(abs('Version 1 verlangte an mehreren Stellen eine Vier-Augen-Prüfung, ohne festzulegen, wer prüft, was geprüft wird und wie die Prüfung nachgewiesen wird. Eine Kontrolle ohne Prüfgegenstand und ohne Nachweis ist eine Absichtserklärung.'));
  push(punkte(KN.GRUNDSATZ));
  push(leer());
  push(tabelle(['Nr.', 'Kontrollpunkt', 'Phase', 'Gate', 'Erstellt', 'Kontrolliert'],
    KN.KONTROLLEN.map(c => [c.nr, c.punkt, String(c.phase), c.gate ? 'GATE ' + c.gate : '—',
      c.erstellt, c.kontrolliert]), [500, 2000, 700, 900, 2200, 3300]));
  KN.KONTROLLEN.forEach(c => {
    push(h4(`${c.nr} · ${c.punkt}`));
    push(mix([{text: 'Prüfgegenstand: ', bold: true}, c.gegenstand]));
    push(mix([{text: 'Nachweis: ', bold: true}, c.nachweis]));
    push(mix([{text: 'Folge: ', bold: true}, c.folge]));
  });

  push(h2('I10 · Controlling'));
  push(abs('Wöchentlich aktualisiert im Dashboard der Mappe 06. Zweck ist die rechtzeitige Erkennung von Fehlentwicklungen, nicht die Berichterstattung. Die Handlungsauslöser verweisen auf die Entscheidungslogiken in Teil C.'));
  push(tabelle(['Kennzahl', 'Definition', 'Orientierung'],
    B.KENNZAHLEN.map(z => [z.k, z.def, z.ziel]), [2600, 3600, 3400]));

  /* ======================================================== TEIL J */
  push(h1neu('Teil J · Sonderfälle und Störfälle'));

  push(h2('J1 · Sonderfallkatalog'));
  push(abs('Dreissig Fälle. Die Erkennung erfolgt spätestens in der angegebenen Phase, in neun Fällen bereits im Erstgespräch. Wird ein Fall erkannt, gilt dessen Abklärungsliste vor jedem weiteren Schritt.'));
  push(tabelle(['Nr.', 'Sonderfall', 'Phase', 'Erkennung'],
    SF.posten().map(s4 => [s4.nr, s4.fall, String(s4.phase), s4.erkennung]),
    [500, 2200, 700, 6200]));
  const sgr = [];
  SF.SONDERFAELLE.forEach(x => { if (x.g) { sgr.push({t: x.g, z: []}); return; } sgr[sgr.length - 1].z.push(x); });
  sgr.forEach(g => {
    push(h3(g.t));
    g.z.forEach(s4 => {
      push(h4(`${s4.nr} · ${s4.fall}`));
      push(tabelle(['Feld', 'Inhalt'], [
        ['Erkennung', s4.erkennung],
        ['Risiko', s4.risiko],
        ['Notwendige Abklärungen', s4.abklaerung],
        ['Zuständige Stelle', s4.stelle],
        ['Dokumente', s4.dokumente],
        ['Stop-Kriterium', s4.stop],
        ['Eskalation', s4.eskalation],
        ['Register', s4.recht || '—'],
      ], [2200, 7400]));
    });
  });

  push(h2('J2 · Störfälle'));
  push(abs('Siebzehn Fälle mit festgelegtem Ablauf. Version 1 kannte kein Fehlermanagement – dabei ist es der häufigste operative Bedarf überhaupt.'));
  push(info('Grundsätze', ST.GRUNDSAETZE));
  push(leer());
  push(tabelle(['Nr.', 'Störfall', 'Sofortmassnahme', 'Verantwortlich'],
    ST.posten().map(t => [t.nr, t.fall, t.sofort, t.wer]), [500, 2100, 4600, 2400]));
  const tgr = [];
  ST.STOERUNGEN.forEach(x => { if (x.g) { tgr.push({t: x.g, z: []}); return; } tgr[tgr.length - 1].z.push(x); });
  tgr.forEach(g => {
    push(h3(g.t));
    g.z.forEach(t => {
      push(h4(`${t.nr} · ${t.fall}`));
      push(tabelle(['Schritt', 'Inhalt'], [
        ['1 Sofortmassnahme', t.sofort],
        ['2 Verantwortlicher', t.wer],
        ['3 Information', t.info],
        ['4 Dokumentation', t.doku],
        ['5 Rechtliche Prüfung', t.recht],
        ['6 Eigentümerentscheid', t.entscheid],
        ['7 Wiederaufnahme', t.wieder],
        ['Prävention', t.praevention],
      ], [2200, 7400]));
    });
  });

  /* ======================================================== TEIL K */
  push(h1neu('Teil K · Vorlagen, Checklisten und Register'));

  push(h2('K1 · Formulare'));
  push(tabelle(['Nr.', 'Formular', 'Phase', 'Fundstelle'], [
    ['F1', 'Erstgesprächsprotokoll und Gesprächsleitfaden', '3', 'Teil D1'],
    ['F2', 'Käuferqualifikation und Käuferprofil', '13–14', 'Teil E2'],
    ['F3', 'Besichtigungscheckliste', '14', 'Teil E3'],
    ['F4', 'Kaufangebot Immobilie', '15', 'Teil E4'],
    ['F5', 'Angebotsvergleich und Entscheidungsvorlage', '16', 'Teil E5'],
    ['F6', 'Verhandlungsprotokoll', '16', 'Teil E6'],
    ['F7', 'Reservationsbestätigung', '17', 'Teil H1'],
    ['F8', 'Inventarliste', '4 und 18', 'Dokument 03'],
    ['F9', 'Notariatscheckliste vor und nach der Beurkundung', '17–19', 'Teil H2 und H3'],
    ['F10', 'Vertragscheckliste', '18', 'Kontrollpunkt K7'],
    ['F11', 'Übergabeprotokoll', '20', 'Teil H4'],
    ['F12', 'Schlüssel- und Zählerprotokoll', '20', 'Mappe 09'],
    ['F13', 'Archivcheckliste', '20', 'Kontrollpunkt K10'],
    ['F-GwG', 'Triage-Protokoll Geldwäschereirecht', '10, 13, 15', 'Teil G5'],
  ], [700, 4100, 900, 3900]));

  push(h2('K2 · Kommunikationsvorlagen'));
  push(abs('Volltexte in Dokument 05. Platzhalter in eckigen Klammern werden je Vorgang ersetzt; jede Vorlage wird gelesen und angepasst, nicht bloss ausgefüllt.'));
  push(tabelle(['Nr.', 'Vorlage', 'Phase', 'Kanal und Zeitpunkt'],
    VORLAGEN.map(v => [v.k, v.name, String(v.phase), v.kanal]), [700, 3000, 700, 5200]));

  push(h2('K3 · Dokumenten-Checkliste'));
  push(abs('Zweiundneunzig Positionen in fünf Gruppen. Wird je Objekt eröffnet und in Mappe 02 geführt. Zu jeder Unterlage werden Quelle, Ausstellungsdatum und Bezugsdatum festgehalten.'));
  push(tabelle(['Stufe', 'Bedeutung'], [
    ['Pflicht', 'Ohne diese Unterlage wird nicht vermarktet. Fehlt sie bei Vermarktungsstart, ist der Grund zu begründen und von der Verkaufsleitung freizugeben.'],
    ['empfehlenswert', 'Verbessert Bewertung, Vertrauen oder Abwicklung deutlich. Fehlen ist zu begründen.'],
    ['situationsabhängig', 'Nur bei Vorliegen des Sachverhalts. Ob er vorliegt, ist aktiv zu prüfen; auch «nicht zutreffend» ist ein Ergebnis.'],
  ], [1600, 8000]));
  const dgr = [];
  DOKUMENTE.forEach(d => { if (d.g) { dgr.push({t: d.g, z: []}); return; } dgr[dgr.length - 1].z.push(d); });
  dgr.forEach(g => {
    push(h3(g.t));
    push(tabelle(['Nr.', 'Unterlage', 'Stufe', 'Durch', 'Bezugsquelle', 'Hinweis', 'Reg.'],
      g.z.map(d => [d.nr, d.dok, d.stufe, d.wer, d.quelle, d.bemerkung, d.recht || '—']),
      [480, 1720, 1050, 900, 1300, 3350, 800]));
  });

  push(h2('K4 · Objektaufnahme'));
  push(abs('Sechzehn Blöcke mit 182 Feldern. Die Feldliste steht in Mappe 07 – dort wird gearbeitet. Hier die Blockstruktur und die Erfassungsregeln.'));
  push(info('Erfassungsregeln', [
    'Raum für Raum, nichts auslassen – auch Keller, Estrich, Technikraum und Nebengebäude.',
    'Flächen nicht schätzen: Wohnflächen aus den Bauplänen mit Berechnungsnorm, Grundstücksflächen aus dem Grundbuchauszug (R12).',
    'Jedes Feld ausfüllen. Ein offenes Feld wird mit «zu klären» markiert und in die Liste offener Punkte übernommen – ein leeres Feld ist kein Ergebnis.',
    'Zustandsbewertungen in einer Skala: neu, gut, gebraucht, sanierungsbedürftig, nicht vorhanden.',
    'Arbeitsfotos zu jedem Raum; sie dienen der Dokumentation, nicht der Vermarktung.',
    'Abweichung zwischen Plan und Bauzustand ist zwingend weiterzuverfolgen (R44, S15).']));
  push(tabelle(['Block', 'Felder', 'Kritische Felder'],
    AUFNAHME.map(b => [b.block, String(b.felder.length),
      b.felder.filter(f => f.hinweis && /R\d+|zwingend|nie|nur mit/i.test(f.hinweis))
        .map(f => f.feld).slice(0, 3).join(' · ') || '—']),
    [2800, 800, 6000]));

  push(h2('K5 · Abschlusscheckliste'));
  push(abs('Fünfundsechzig Positionen, geführt in Mappe 09. Achtundzwanzig stammen aus der Auftragsvorgabe, siebenunddreissig sind ergänzt. Die Spalte «Gate» verbindet die Position mit dem Prüfpunkt, an dem sie durchgesetzt wird.'));
  const agr = [];
  ABSCHLUSS.forEach(p2 => { if (p2.g) { agr.push({t: p2.g, z: []}); return; } agr[agr.length - 1].z.push(p2); });
  agr.forEach(g => {
    push(h3(g.t));
    push(tabelle(['\u2610', 'Position', 'Phase', 'Zuständig', 'Nachweis', 'Reg.'],
      g.z.map(p2 => ['\u2610', p2.pos, String(p2.phase), p2.rolle, p2.nachweis, p2.recht || '—']),
      [400, 3500, 600, 1500, 2600, 1000]));
  });

  push(h2('K6 · Rechtsgrundlagen-Register'));
  push(recht([
    'Siebenundvierzig Positionen. Das Register ist eine Arbeitshilfe und keine Rechtsauskunft.',
    'Rechtsstand: 18. September 2026. Vor jeder Mandatsausfertigung auf Aktualität zu prüfen; die Verantwortung liegt bei der Rechtsberatung des Unternehmens.',
    'Die Positionen R37, R38 und R42 tragen einen Quellenvorbehalt: sie beruhen auf Fachpublikationen und nicht auf dem Verordnungstext (Teil G1).',
    'Kantonale Regelungen sind nur dem Grundsatz nach erfasst. Für das konkrete Objekt gilt die Klärungsliste A7.']));
  const rgr = [];
  RECHT.forEach(r => { if (r.g) { rgr.push({t: r.g, z: []}); return; } rgr[rgr.length - 1].z.push(r); });
  rgr.forEach(g => {
    push(h3(g.t));
    push(tabelle(['Nr.', 'Thema', 'Normebene', 'Rechtsgrundlage', 'Kerninhalt', 'Praxis', 'Kz.'],
      g.z.map(r => [r.k, r.thema, r.ebene, r.grundlage, r.kern, r.praxis,
        (r.flag || '').split(' ').filter(Boolean).map(f => '[' + f + ']').join(' ') || '—']),
      [450, 1250, 1300, 1500, 2100, 2200, 800]));
  });

  push(h2('K7 · Änderungen an diesem Handbuch'));
  push(info('Pflege', [
    'Dieses Handbuch wird aus Textquellen erzeugt und nicht von Hand bearbeitet. Rückmeldungen werden unter Angabe der Kennung eingearbeitet: Phasennummer, GATE, Kx, Px, Sx, Tx, Vx, Fx oder Rx.',
    'Der Bau prüft vor jeder Erzeugung die Querverweise zwischen Phasen, Gates, Register, Sonderfällen, Störfällen, Kontrollpunkten und Vorlagen und bricht bei einem unbekannten Verweis ab.',
    'Version 2.0, Fassung vom 18. September 2026. Was gegenüber Version 1 geprüft und geändert wurde, steht im Begleitdokument 00_Audit_und_Falltests.']));

  return k;
}

module.exports = {kinder, STAND, VERSION, TEILE, ROLLEN, KANTONAL, FLOWS, DATEIEN};
