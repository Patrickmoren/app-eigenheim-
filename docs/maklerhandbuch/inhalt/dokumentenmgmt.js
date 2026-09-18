/* Dokumentenarchitektur Version 2: Kategorien, Metadaten, Vertraulichkeit,
   Freigabe, Aufbewahrung. Ergänzt die Ordnerstruktur aus Version 1. */

const STUFEN = [
{s: 'öffentlich', d: 'Für die Vermarktung bestimmt', bsp: 'Inseratstexte, Verkaufsdossier, Bilder, Grundrisse', regel: 'Freigegeben durch Gate 4; nur in der freigegebenen Version im Umlauf.'},
{s: 'intern', d: 'Nur im Unternehmen', bsp: 'Strategieprotokoll, Kalkulationen, Marktanalyse, Kontrollvermerke', regel: 'Nicht an Interessenten, nicht an das Notariat, nicht in den Datenraum.'},
{s: 'vertraulich', d: 'Nur an bestimmte Empfänger mit Grund', bsp: 'Bewertungsbericht, Mängelliste, Grundbuchbelege, Verträge, Mietverträge', regel: 'Empfängerkreis je Dokument festgelegt; Weitergabe protokolliert.'},
{s: 'streng vertraulich', d: 'Engster Kreis, gesonderte Ablage', bsp: 'Mindestpreis und Rückzugslinie, Finanzierungsnachweise Dritter, Compliance-Dossier, Ausweiskopien', regel: 'Kein Sammelversand, keine Ablage im allgemeinen Objektordner, Zugriff dokumentiert.'},
];

const KATEGORIEN = [
{k: '01 Eigentümerdokumente', inhalt: 'Eigentümerangaben, Ausweise, Adressnachweise, Vollmachten, Erbbescheinigung, KESB-Zustimmung, Zustimmung Ehegatte', stufe: 'streng vertraulich', frei: 'Makler erfasst, Verkaufsleitung prüft bei Gate 2', aufb: 'Nach interner Vorgabe; Ausweiskopien nach Compliance-Weisung'},
{k: '02 Objektunterlagen', inhalt: 'Objektaufnahme, Raumliste, Baupläne, Baubewilligungen, Renovationsnachweise, Gebäudeversicherungsausweis, Haustechnik, GEAK', stufe: 'vertraulich', frei: 'Makler', aufb: 'Bis Mandatsabschluss, danach nach interner Vorgabe'},
{k: '03 Rechtliche Unterlagen', inhalt: 'Grundbuchauszug und Belege, Katasterplan, Zonenauskunft, Katasterauszug belastete Standorte, Gefahrenkarte, Prüfbericht Recht, Behördenauskünfte', stufe: 'vertraulich', frei: 'Verkaufsleitung bei Gate 1', aufb: 'Lange Frist; Behördenauskünfte mit Datum'},
{k: '04 Bewertungsunterlagen', inhalt: 'Vergleichsobjekte mit Quellen, Bewertungsmappe, Bewertungsbericht, Nettoerlösrechnung, Grundlagenblatt', stufe: 'vertraulich', frei: 'Zweite bewertende Person bei Kontrollpunkt K1', aufb: 'Nach interner Vorgabe'},
{k: '05 Mandat und Strategie', inhalt: 'Maklermandat mit Beilagen, Mängelliste, Inventarliste, Preisentscheid, Strategieprotokoll, Mindestpreis', stufe: 'streng vertraulich für Mindestpreis, sonst vertraulich', frei: 'Verkaufsleitung bei Gate 2', aufb: 'Mindestens zehn Jahre für Mängelliste (R11, R46)'},
{k: '06 Marketingunterlagen', inhalt: 'Bilder in Web- und Druckauflösung, Grundrisse, Video, Rundgang, Inseratstexte je Kanal, Kontrollausdrucke, Fotografenvertrag', stufe: 'öffentlich; Fotografenvertrag intern', frei: 'Gate 4 und Eigentümerfreigabe', aufb: 'Nach Nutzungsrechtsvereinbarung'},
{k: '07 Verkaufsdossier', inhalt: 'Dossier je Version, Kurzdossier, Release-Checkliste, Versandprotokoll je Version', stufe: 'öffentlich; Versandprotokoll intern', frei: 'Gate 4', aufb: 'Alle Versionen aufbewahren – Nachweis, was wann kommuniziert wurde'},
{k: '08 Käuferunterlagen', inhalt: 'Käuferprofile, Interessentenformulare, Empfangsbestätigungen, Besichtigungsprotokolle, Rückmeldungen, Absagen', stufe: 'vertraulich', frei: 'Makler', aufb: 'Löschfrist je Interessent; Besichtigungsprotokolle mit Offenlegungsvermerk mindestens zehn Jahre'},
{k: '09 Finanzierungsunterlagen', inhalt: 'Finanzierungsbestätigungen, Eigenmittelnachweise, Bankkorrespondenz', stufe: 'streng vertraulich', frei: 'Makler; Kontrollpunkt K4 vor jeder Weitergabe', aufb: 'Löschung nach Verkaufsabschluss für nicht berücksichtigte Interessenten (R39)'},
{k: '10 Angebotsunterlagen', inhalt: 'Kaufangebote mit Eingangsvermerk, Angebotsvergleich, Entscheidungsvorlagen, Eigentümerentscheide, Verhandlungsprotokolle', stufe: 'streng vertraulich', frei: 'Verkaufsleitung bei Gate 6 und Gate 7', aufb: 'Lange Frist – Nachweis der Gleichbehandlung'},
{k: '11 Compliance-Dossier', inhalt: 'Triage-Protokoll, Identifikationsunterlagen, Formular wirtschaftlich berechtigte Person, Risikobeurteilung, Compliance-Freigaben', stufe: 'streng vertraulich', frei: 'Compliance', aufb: 'Nach GwG und SRO-Weisung – gesonderte Ablage (R37)'},
{k: '12 Vertrags- und Notariatsunterlagen', inhalt: 'Reservationsbestätigung, Notariatsauftrag und Checkliste, Vertragsentwürfe je Version, Prüfvermerke, beurkundete Ausfertigung, Grundbuchanmeldung, Eintragungsbestätigung', stufe: 'vertraulich', frei: 'Verkaufsleitung bei Gate 8 und Gate 9', aufb: 'Lange Frist'},
{k: '13 Übergabeunterlagen', inhalt: 'Übergabeprotokoll, Schlüssel-, Zähler- und Dokumentenliste, Fotos der Zählerstände, Empfangsbestätigungen, offene Punkte', stufe: 'vertraulich', frei: 'Beide Parteien mit Unterschrift', aufb: 'Mindestens zehn Jahre – Beweisvorsorge Übergabezustand'},
{k: '14 Finanzen', inhalt: 'Hypothekarunterlagen, Ablösekonditionen, Schuldbriefübersicht, Steuerberechnung, Sicherstellung, Honorarrechnung, Vermarktungskosten', stufe: 'vertraulich', frei: 'Makler; Verkaufsleitung für die Honorarabrechnung', aufb: 'Zehn Jahre für Buchungsbelege (R46)'},
{k: '15 Abschluss und Archiv', inhalt: 'Abschlusscheckliste, Kennzahlenblatt, Abschlussreport, Protokoll Abschlussgespräch, Referenz mit Einwilligung, Archivierungsvermerk, Löschprotokoll', stufe: 'intern', frei: 'Verkaufsleitung bei Kontrollpunkt K10', aufb: 'Nach Kategorie; Archivvermerk hält die Frist je Kategorie fest'},
];

const METADATEN = [
{m: 'Dateiname', v: '[JJJJ-MM-TT]_[Dokumentart]_[Präzisierung]_[Version].[Endung] – ohne Umlaute, Leerzeichen und Sonderzeichen'},
{m: 'Version', v: '_v1, _v2, … und _final für die freigegebene Fassung. Keine Dateinamen wie «neu» oder «aktuell». Alte Versionen werden nicht gelöscht.'},
{m: 'Datum', v: 'Datum des Dokuments, nicht des Ablegens'},
{m: 'Verantwortlicher', v: 'Person, die das Dokument erstellt hat – im Dokument selbst oder im Register'},
{m: 'Freigabestatus', v: 'Entwurf, in Prüfung, freigegeben, überholt. Nur «freigegeben» geht nach aussen.'},
{m: 'Freigebende Person', v: 'Name und Datum. Bei Dokumenten mit Kontrollpunkt zwingend.'},
{m: 'Ablage', v: 'Kategorie nach dieser Architektur; ein Dokument liegt an genau einer Stelle'},
{m: 'Vertraulichkeitsstufe', v: 'öffentlich, intern, vertraulich, streng vertraulich'},
{m: 'Aufbewahrung', v: 'Frist nach Kategorie; im Archivierungsvermerk beim Abschluss festgehalten'},
{m: 'Verteiler', v: 'Bei Dokumenten, die nach aussen gehen: wer hat welche Version wann erhalten. Voraussetzung für Störfall T6.'},
];

const DATENRAUM = [
'Der Datenraum ist die geordnete Abgabe der Objektunterlagen an qualifizierte Interessenten ab Funnelstufe 3. Er ersetzt den ungesteuerten E-Mail-Versand.',
'Er enthält nur Dokumente der Stufe «öffentlich» und ausgewählte «vertrauliche» Objektunterlagen: Grundbuchauszug, Katasterplan, Baupläne, Baubewilligungen, Gebäudeversicherungsausweis, GEAK, Mängelliste, Inventarliste, Kaufnebenkostenübersicht.',
'Er enthält nie: Bewertungsbericht, Strategieprotokoll, Mindestpreis, Nettoerlösrechnung, Angebote oder Finanzierungsnachweise Dritter, Ausweiskopien, Compliance-Dossier.',
'Je Interessent wird festgehalten, welche Dokumente in welcher Version wann abgegeben wurden. Das ist der Nachweis der Offenlegung (R10) und die Grundlage für eine Korrektur nach Störfall T6.',
'Der Index des Datenraums ist ein eigenes Dokument und wird mit dem Dossier freigegeben.',
];

module.exports = {STUFEN, KATEGORIEN, METADATEN, DATENRAUM};
