/* Eigentümerführung: Reports und Entscheidungsvorlagen.
   Version 2. Der Eigentümer soll jederzeit sechs Fragen beantworten können:
   Wo stehen wir? Was wurde gemacht? Was ist passiert? Was bedeutet es?
   Was muss entschieden werden? Was passiert als Nächstes? */

const SECHS_FRAGEN = [
'Wo stehen wir? – Phase, Gate-Stand, Tage am Markt.',
'Was wurde gemacht? – Massnahmen der Periode, mit Zahlen.',
'Was ist passiert? – Reaktion des Markts: Anfragen, Besichtigungen, Rückmeldungen, Angebote.',
'Was bedeutet es? – Interpretation des Maklers, nicht nur die Zahlen.',
'Was muss entschieden werden? – Offene Entscheidungen mit Frist und Konsequenz je Variante.',
'Was passiert als Nächstes? – Nächste Schritte mit Verantwortlichem und Termin.',
];

/* Jedes Dokument gegenüber dem Eigentümer, mit Zweck und Auslöser */
const REPORTS = [
{nr: 'V1', t: 'Erstgesprächsprotokoll', anlass: 'Nach Phase 3, innert 24 Stunden',
 zweck: 'Verstandene Ausgangslage spiegeln und korrigierbar machen; Beweissicherung zur Verfügungsbefugnis und zu genannten Mängeln.',
 inhalt: 'Ausgangslage, Verkaufsanlass, Zeitplan, Preisvorstellung mit Herleitung, genannte Mängel, Sonderfälle, nächste Schritte mit Terminen.',
 entscheid: 'Auftrag zur Bewertung.'},
{nr: 'V2', t: 'Bewertungsbericht', anlass: 'Phase 8, persönlich übergeben',
 zweck: 'Nachvollziehbare Wertspanne mit Grundlagen, Annahmen und Vorbehalten.',
 inhalt: 'Nach Teil C: Grundlagen, Vergleichsobjekte, Methoden, Gewichtung, Wertspanne, Chancen, Risiken.',
 entscheid: 'Keiner – dient der Vorbereitung von V3.'},
{nr: 'V3', t: 'Preis- und Strategievorlage', anlass: 'Phase 9, Bewertungsbesprechung',
 zweck: 'Preisentscheid und Strategie auf einer Grundlage treffen, die alle sechs Preisbegriffe auseinanderhält.',
 inhalt: 'Sechs Preisbegriffe für dieses Objekt; drei Preisstrategien mit Konsequenz für Dauer und Verhandlungsposition; Nettoerlösrechnung je Variante; Vermarktungsstufe; Auslösekriterien der Preissteuerung.',
 entscheid: 'Angebotspreis, Mindestpreis, Vermarktungsform, Zeitplan, Auslösekriterien – schriftlich.'},
{nr: 'V4', t: 'Vermarktungsfreigabe', anlass: 'Phase 11, vor Gate 4',
 zweck: 'Inhaltliche und rechtliche Richtigkeit der Vermarktungsmittel durch den Eigentümer bestätigen lassen.',
 inhalt: 'Dossier, Bildauswahl, Grundrisse, Inseratstexte, Offenlegungsteil, Kaufnebenkosten, Adressanzeige.',
 entscheid: 'Schriftliche Freigabe; Entscheid zu Zusatzleistungen und Adressanzeige.'},
{nr: 'V5', t: 'Wöchentlicher Verkaufsreport', anlass: 'Ab Marktstart, fester Wochentag',
 zweck: 'Marktreaktion in Zahlen statt in Eindrücken; Grundlage jeder späteren Preisdiskussion.',
 inhalt: 'Die sechs Fragen; Indikatorensatz Woche und kumuliert; Verteilung der Absagegründe; Stand der Auslösekriterien; offene Entscheidungen.',
 entscheid: 'In der Regel keiner; bei erreichtem Auslösekriterium Terminvorschlag für das Massnahmengespräch.'},
{nr: 'V6', t: 'Besichtigungsreport', anlass: 'Nach jeder Besichtigung bzw. gesammelt wöchentlich',
 zweck: 'Rückmeldungen ungefiltert weitergeben, auch die unangenehmen.',
 inhalt: 'Je Termin: Interessent anonymisiert, Funnelstufe, Preisempfinden, Bedenken, nächster Schritt, Absagegrund.',
 entscheid: 'Keiner; Grundlage für V8.'},
{nr: 'V7', t: 'Marktfeedback und Ursachenanalyse', anlass: 'Bei Erreichen eines Auslösekriteriums',
 zweck: 'Ursache der Nichtakzeptanz bestimmen, bevor über Massnahmen gesprochen wird.',
 inhalt: 'Indikatoren seit Marktstart; Ausschluss der vier Ursachenfelder Preis, Darstellung, Zielgruppe, Objekt; Handlungsmöglichkeiten mit Wirkung, Aufwand und Risiko; mindestens eine Möglichkeit ohne Preisänderung; Nettoerlös je Variante.',
 entscheid: 'Massnahme – mit oder ohne Preisänderung – schriftlich.'},
{nr: 'V8', t: 'Angebotsvergleich und Entscheidungsvorlage', anlass: 'Phase 16, nach Gate 6',
 zweck: 'Ungleiche Angebote vergleichbar machen und den Entscheid beim Eigentümer belassen.',
 inhalt: 'Matrix nach Teil E; Nettoerlös je Angebot mit offengelegten Annahmen; Abschlusssicherheit begründet; Handlungsmöglichkeiten mit Konsequenzen; Entscheidfelder.',
 entscheid: 'Annahme, Gegenangebot mit Konditionen, Ablehnung oder Fristverfahren – schriftlich. Dieser Entscheid ist zugleich der Verhandlungsauftrag.'},
{nr: 'V9', t: 'Verhandlungsstand', anlass: 'Nach jeder wesentlichen Runde',
 zweck: 'Verhandlungsverlauf nachvollziehbar halten und die nächste Instruktion einholen.',
 inhalt: 'Auszug aus dem Verhandlungsprotokoll; erreichter Stand gegen den Auftrag; verbleibender Spielraum; nächster Schritt.',
 entscheid: 'Fortsetzung, Anpassung des Rahmens oder Abbruch.'},
{nr: 'V10', t: 'Reservations- und Notariatsstatus', anlass: 'Phase 17, nach Gate 8',
 zweck: 'Klarheit über die rechtliche Unverbindlichkeit der Reservation und über den Zeitplan.',
 inhalt: 'Einigung; ausdrückliche Erläuterung, dass Bindung erst mit der Beurkundung entsteht; Zeitplan bis zur Übergabe; beizubringende Unterlagen je Partei; Stand der Zweitinteressenten.',
 entscheid: 'Zurückstellung der Vermarktung; Wahl des Notariats.'},
{nr: 'V11', t: 'Vertragsstatus', anlass: 'Phase 18, mit dem Entwurf',
 zweck: 'Prüfung des Entwurfs durch den Eigentümer ermöglichen und die Rollen klarstellen.',
 inhalt: 'Entwurf; Prüfpunkte in einfacher Sprache; die drei Zeitpunkte Beurkundung, Nutzen- und Gefahrenübergang, Eigentumsübergang; vom Makler gemeldete Abweichungen und deren Stand; Hinweis, dass Rechtsauskunft dem Notariat oder einer eigenen Rechtsberatung zusteht.',
 entscheid: 'Freigabe des Entwurfs; Terminbestätigung.'},
{nr: 'V12', t: 'Vollzugsstatus', anlass: 'Phase 19, wöchentlich',
 zweck: 'Die für Laien intransparente Phase zwischen Beurkundung und Übergabe begleiten.',
 inhalt: 'Fristenplan mit Ist-Stand: Zahlungseingang, Grundbuchanmeldung, Eintragung, Hypothekenablösung, Steuersicherstellung, Versorger- und Versicherungswechsel.',
 entscheid: 'Nur bei Verzug: Massnahmen.'},
{nr: 'V13', t: 'Übergabeplanung', anlass: 'Vor Phase 20, nach Gate 10',
 zweck: 'Übergabe ohne offene Punkte durchführen.',
 inhalt: 'Termin und Ablauf; Schlüssel-, Zähler- und Dokumentenliste; Räumungs- und Reinigungsstand; mitzubringende Unterlagen; Umgang mit offenen Punkten.',
 entscheid: 'Terminbestätigung.'},
{nr: 'V14', t: 'Abschlussreport', anlass: 'Phase 20, mit Abschlussgespräch',
 zweck: 'Ergebnis gegen Erwartung spiegeln, Pflichten nach dem Verkauf benennen, Mandat kaufmännisch schliessen.',
 inhalt: 'Bewertete Spanne, Angebotspreis, erzielter Preis, Abweichung; Kennzahlen der Vermarktung; Verlauf; Hinweis auf die kantonale Frist der Grundstückgewinnsteuer und auf die Gewährleistungsfrist von fünf Jahren bei Gebäuden (R11, R22); Unterlagenzusammenstellung für die Steuererklärung; Honorarabrechnung.',
 entscheid: 'Kenntnisnahme; Rückmeldung zur Zusammenarbeit; Einwilligung für eine Referenz.'},
];

const REPORT_REGELN = [
  'Zahlen statt Eindrücke. «Es läuft gut» ist kein Report.',
  'Jeder Report endet mit offenen Entscheidungen und nächsten Schritten – auch wenn beide leer sind; dann steht das dort.',
  'Unangenehme Rückmeldungen werden ungefiltert weitergegeben. Ein Eigentümer, der erst nach drei Monaten erfährt, dass der Preis nicht getragen wird, verliert das Vertrauen zu Recht.',
  'Reports gehen an alle Verfügungsberechtigten gleichzeitig und gleichlautend. Bei Erbengemeinschaften ist das nicht Höflichkeit, sondern Konfliktprävention.',
  'Kein Report enthält den Mindestpreis, die absolute Grenze oder Angebotsbeträge Dritter in einer Form, die nach aussen gelangen dürfte.',
];

module.exports = {SECHS_FRAGEN, REPORTS, REPORT_REGELN};
