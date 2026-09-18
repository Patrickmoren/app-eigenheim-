/* Abschlusscheckliste des Maklers (Teil R) und Arbeitsmappe 09.
   neu: true  => im Auftrag nicht enthaltene, vom Verfasser ergänzte Position.
   phase      => Phase, in der die Position erledigt wird (Teil B) */

const P = (pos, phase, rolle, nachweis, neu, recht) =>
  ({pos, phase, rolle, nachweis, neu: !!neu, recht: recht || ''});

const ABSCHLUSS = [
{g: 'Mandat und Auftraggeber'},
P('Maklervertrag von allen Verfügungsberechtigten unterzeichnet', 10, 'Makler', 'Mandat, unterzeichnet', false, 'R13 R14'),
P('Eigentümer geprüft: Identität und Verfügungsbefugnis nachgewiesen', 3, 'Makler', 'Ausweise, Grundbuchauszug', false, 'R13 R14 R15'),
P('Vollmachten liegen in der für die Beurkundung nötigen Form vor', 10, 'Makler', 'Vollmachten', true, 'R16'),
P('Zustimmung der Erwachsenenschutzbehörde vorhanden, soweit erforderlich', 10, 'Eigentümer', 'KESB-Zustimmung', true, 'R15'),
P('Identifikation nach GwG abgeschlossen: Eigentümer und wirtschaftlich Berechtigte', 10, 'Makler', 'Identifikationsdossier', true, 'R37'),
P('Datenschutzerklärung übergeben und Empfang dokumentiert', 10, 'Makler', 'Empfangsbestätigung', true, 'R39'),

{g: 'Prüfung und Unterlagen'},
P('Grundbuch geprüft: Eigentum, Dienstbarkeiten, Pfandrechte, Anmerkungen', 6, 'Makler', 'Prüfbericht Recht', false, 'R4 R5'),
P('Vorkaufsrechte geklärt und, soweit bestehend, korrekt bedient', 6, 'Makler mit Rechtsberatung', 'Prüfbericht, Korrespondenz', true, 'R6'),
P('Objektunterlagen vollständig gemäss Dokumenten-Checkliste A bis E', 5, 'Makler', 'Dokumenten-Checkliste', false, ''),
P('Katasterauszug belastete Standorte eingeholt und ausgewertet', 5, 'Makler', 'Katasterauszug', true, 'R29'),
P('Naturgefahren geprüft und Gebäudeversicherung erfasst', 5, 'Makler', 'Gefahrenkartenauszug, Police', true, 'R30'),
P('GEAK-Pflicht für den Kanton geklärt und Nachweis beschafft, soweit nötig', 5, 'Makler', 'Auskunft Energiefachstelle, GEAK', true, 'R33'),
P('Bewilligungsstatus aller Umbauten geklärt', 4, 'Makler', 'Baubewilligungen, Archivrecherche', true, 'R10'),
P('Mängelliste erstellt und vom Eigentümer unterzeichnet', 4, 'Makler', 'Mängelliste, unterzeichnet', true, 'R10'),
P('Inventarliste erstellt und mit dem Eigentümer bestätigt', 4, 'Makler', 'Inventarliste', true, ''),

{g: 'Bewertung und Strategie'},
P('Bewertung erstellt und im Vier-Augen-Prinzip geprüft', 8, 'Makler', 'Bewertungsbericht, unterschrieben', false, ''),
P('Schätzung der Grundstückgewinnsteuer eingeholt', 9, 'Eigentümer', 'Berechnung des Steueramts', true, 'R22'),
P('Ablösekonditionen der Hypothek schriftlich eingeholt', 5, 'Eigentümer', 'Bestätigung der Bank', true, 'R41'),
P('Nettoerlösrechnung erstellt und mit dem Eigentümer besprochen', 9, 'Makler', 'Nettoerlösrechnung', true, 'R21 R22 R26'),
P('Verkaufspreis festgelegt und schriftlich bestätigt', 9, 'Eigentümer', 'Protokoll Preisentscheid', false, ''),
P('Verkaufsstrategie definiert: Preis, Kanäle, Zielgruppe, Zeitplan', 9, 'Makler', 'Protokoll Verkaufsstrategie', false, ''),

{g: 'Vermarktung'},
P('Fotos erstellt und Bildauswahl getroffen', 11, 'Makler', 'Bilddateien, Bildauswahl', false, ''),
P('Grundrisse neu gezeichnet und gegen die Baupläne geprüft', 11, 'Makler', 'Grundrissdateien', false, ''),
P('Verkaufsdossier erstellt und gegen die Quellen geprüft', 11, 'Makler', 'Dossier, Prüfvermerk', false, 'R9 R12'),
P('Kaufnebenkosten für den Kanton beim Notariat erfragt', 11, 'Makler', 'Auskunft des Notariats mit Datum', true, 'R26'),
P('Schriftliche Freigabe des Eigentümers für die Vermarktung eingeholt', 11, 'Eigentümer', 'Freigabe-E-Mail oder Formular', true, ''),
P('Inserat online auf allen vereinbarten Kanälen und kontrolliert', 12, 'Makler', 'Kontrollausdrucke, Links', false, ''),

{g: 'Interessenten und Angebote'},
P('Interessenten im CRM erfasst und eingestuft', 13, 'Makler', 'CRM-Auszug', false, ''),
P('Erwerbsrechtliche Zulässigkeit der Interessenten geprüft', 13, 'Makler', 'CRM-Eintrag, Behördenauskunft', true, 'R34 R35 R36'),
P('Besichtigungen durchgeführt und protokolliert', 14, 'Makler', 'Besichtigungsprotokolle', false, ''),
P('Offenlegung bekannter Mängel gegenüber Interessenten dokumentiert', 14, 'Makler', 'Besichtigungsprotokoll', true, 'R10'),
P('Finanzierungen geprüft: objektbezogene Bankbestätigung liegt vor', 15, 'Makler', 'Finanzierungsbestätigung', false, 'R40'),
P('Identifikation des Käufers nach GwG abgeschlossen', 17, 'Makler', 'Identifikationsdossier Käufer', true, 'R37'),
P('Kaufangebot schriftlich erhalten und protokolliert', 15, 'Makler', 'Kaufangebot mit Eingangsvermerk', false, ''),
P('Eigentümer über jedes Angebot informiert', 15, 'Makler', 'Versandnachweis, Entscheidungsvorlage', false, ''),
P('Verhandlungsauftrag des Eigentümers schriftlich eingeholt', 16, 'Eigentümer', 'Schriftlicher Auftrag', true, ''),
P('Verhandlung abgeschlossen und Einigung schriftlich festgehalten', 16, 'Makler', 'Verhandlungsprotokoll', false, ''),

{g: 'Abschluss beim Notariat'},
P('Reservation erfolgt, ohne Konventionalstrafe und ohne Anzahlung beim Makler', 17, 'Makler', 'Reservationsbestätigung', false, 'R2 R38'),
P('Zweitinteressenten über die Wartestellung informiert', 17, 'Makler', 'Korrespondenz', true, ''),
P('Notariat beauftragt und Unterlagen vollständig übermittelt', 17, 'Makler', 'Notariatsauftrag, Checkliste F6', false, ''),
P('Sicherstellung der Grundstückgewinnsteuer geregelt', 17, 'Makler mit Notariat', 'Vertragsbestimmung, Bestätigung', true, 'R25'),
P('Schuldbriefe und Hypothekenablösung geregelt', 17, 'Eigentümer mit Bank', 'Ablösebestätigung', true, 'R41'),
P('Kaufvertrag erstellt und gegen die Einigung geprüft', 18, 'Notariat, Prüfung Makler', 'Entwurf mit Prüfbemerkungen', false, ''),
P('Kaufvertrag öffentlich beurkundet', 18, 'Notariat', 'Beurkundete Ausfertigung', false, 'R1'),
P('Mängelliste und Inventarliste als Vertragsbeilagen aufgenommen', 18, 'Makler', 'Vertragsbeilagen', true, 'R10'),
P('Zahlung geregelt und Zahlungseingang bestätigt', 19, 'Notariat', 'Zahlungsbestätigung', false, ''),
P('Eigentumsübertragung im Grundbuch eingetragen', 19, 'Grundbuchamt', 'Eintragungsbestätigung', false, 'R3'),

{g: 'Übergabe'},
P('Versorger und Versicherungen auf den Übergabetermin umgestellt', 19, 'Eigentümer und Käufer', 'Bestätigungen', true, ''),
P('Übergabe erfolgt und Übergabeprotokoll von beiden Parteien unterzeichnet', 20, 'Makler', 'Übergabeprotokoll', false, ''),
P('Schlüssel übergeben und im Protokoll je Art und Anzahl quittiert', 20, 'Makler', 'Schlüsselliste im Protokoll', false, ''),
P('Zählerstände mit Zählernummer erfasst und fotografiert', 20, 'Makler', 'Zählerliste, Fotos', true, ''),
P('Technische Unterlagen an den Käufer übergeben', 20, 'Makler', 'Empfangsbestätigung', true, ''),
P('Offene Punkte aus der Übergabe erledigt und abgeschlossen', 20, 'Makler', 'Nachverfolgung im Protokoll', true, ''),

{g: 'Kaufmännischer und organisatorischer Abschluss'},
P('Inserate offline genommen und Portale bereinigt', 20, 'Makler', 'Kontrollausdrucke', true, ''),
P('Absagen an alle nicht berücksichtigten Interessenten versandt', 20, 'Makler', 'Korrespondenz, CRM', true, ''),
P('Maklerprovision abgerechnet, Mehrwertsteuer ausgewiesen', 20, 'Makler', 'Honorarrechnung', false, 'R21'),
P('Kennzahlen im Controlling erfasst und abgeschlossen', 20, 'Makler', 'Kennzahlenblatt', true, ''),
P('Dossier abgeschlossen: Ordnerstruktur vollständig, Dateien benannt', 20, 'Makler', 'Objektordner nach Teil S', false, ''),
P('GwG-Dossier gesondert und vollständig archiviert', 20, 'Makler', 'Archivvermerk', true, 'R37'),
P('Löschfristen für Interessentendaten gesetzt, Daten bereinigt', 20, 'Makler', 'CRM-Protokoll', true, 'R39'),
P('Aufbewahrungsfrist des Objektdossiers gesetzt und vermerkt', 20, 'Makler', 'Archivierungsvermerk', true, ''),
P('Eigentümerabschlussgespräch durchgeführt', 20, 'Makler', 'Protokoll Abschlussgespräch', false, ''),
P('Eigentümer auf Steuerfristen und Gewährleistungsfrist hingewiesen', 20, 'Makler', 'Abschlussbericht', true, 'R11 R22'),
P('Referenz oder Rückmeldung eingeholt, Einwilligung dokumentiert', 20, 'Makler', 'Einwilligung', true, 'R39'),
P('Wiedervorlage im CRM auf zwölf Monate gesetzt', 20, 'Makler', 'CRM-Eintrag', true, ''),
];

const posten = () => ABSCHLUSS.filter(p => p.pos);
const ergaenzt = () => posten().filter(p => p.neu);

module.exports = {ABSCHLUSS, posten, ergaenzt};
