/* CRM-Struktur Version 2: Objektpipeline, Aktivitätsmodell, Tagesliste. */

const OBJEKTSTATUS = [
{st: 'Lead', phase: '1', bedeutung: 'Verkaufsanlass erkannt, Eigentümer noch nicht kontaktiert', pflichtfeld: 'Quelle, Objektadresse, nächste Aktion'},
{st: 'Erstkontakt', phase: '2', bedeutung: 'Kontakt aufgenommen, Qualifizierung läuft', pflichtfeld: 'Qualifizierungsergebnis, Termin'},
{st: 'Eigentümergespräch', phase: '3', bedeutung: 'Erstgespräch geführt, Bewertungsauftrag erteilt', pflichtfeld: 'Erstgesprächsprotokoll, Verfügungsbefugnis'},
{st: 'Bewertung', phase: '4–9', bedeutung: 'Aufnahme, Unterlagen, Rechtsprüfung, Bewertung, Preisentscheid', pflichtfeld: 'Gate 1 und Gate 3 Stand, Preisentscheid'},
{st: 'Mandat', phase: '10', bedeutung: 'Mandat unterzeichnet, Onboarding abgeschlossen', pflichtfeld: 'Gate 2 Stand, Triage-Ergebnis, Budget'},
{st: 'Vorbereitung', phase: '11', bedeutung: 'Vermarktungsmittel in Erstellung', pflichtfeld: 'Release-Checkliste, Eigentümerfreigabe'},
{st: 'Vermarktungsfreigabe', phase: '11', bedeutung: 'Gate 4 und Gate 5 in Prüfung', pflichtfeld: 'Gate-Protokolle, Starttag'},
{st: 'Aktiv am Markt', phase: '12', bedeutung: 'Veröffentlicht, Anfragen laufen', pflichtfeld: 'Starttag, Indikatoren, Wochenreport'},
{st: 'Besichtigungen', phase: '13–14', bedeutung: 'Qualifizierung und Besichtigungen laufen', pflichtfeld: 'Funnelverteilung, Absagegründe'},
{st: 'Angebote', phase: '15', bedeutung: 'Mindestens ein Angebot eingegangen', pflichtfeld: 'Angebotsjournal, Gate 6 Stand'},
{st: 'Verhandlung', phase: '16', bedeutung: 'Verhandlungsauftrag erteilt, Runden laufen', pflichtfeld: 'Verhandlungsauftrag, Protokoll, Gate 7'},
{st: 'Notariat', phase: '17', bedeutung: 'Reservation ausgestellt, Notariat beauftragt', pflichtfeld: 'Gate 8 Stand, Beurkundungstermin'},
{st: 'Beurkundet', phase: '18', bedeutung: 'Kaufvertrag öffentlich beurkundet', pflichtfeld: 'Gate 9 Stand, Fristenplan'},
{st: 'Vollzug', phase: '19', bedeutung: 'Zahlung und Grundbucheintragung laufen', pflichtfeld: 'Zahlungs- und Eintragungsstand'},
{st: 'Übergabe', phase: '20', bedeutung: 'Eintragung bestätigt, Übergabe terminiert', pflichtfeld: 'Gate 10 Stand, Übergabetermin'},
{st: 'Abgeschlossen', phase: '20', bedeutung: 'Übergeben, abgerechnet, archiviert', pflichtfeld: 'Abschlusscheckliste, Archivvermerk, Wiedervorlage'},
{st: 'Verloren', phase: '—', bedeutung: 'Mandat nicht erteilt, gekündigt oder Objekt zurückgezogen', pflichtfeld: 'Verlustgrund, Zeitpunkt, Wiedervorlage'},
];

const VERLUSTGRUND = ['Preisvorstellung nicht überbrückbar', 'Mandat an Mitbewerber',
 'Eigentümer verschiebt den Verkauf', 'Eigentümer zieht zurück',
 'Verfügungsbefugnis nicht herstellbar', 'Rechtliche Hindernisse (Gate 1)',
 'Sonderfall ohne Freigabe', 'Interessenkonflikt', 'Mandat gekündigt', 'anderes'];

const AKTIVITAET = [
{f: 'Verantwortlicher', z: 'Eine Person, nicht ein Team. Vertretung wird benannt.'},
{f: 'Datum', z: 'Zeitpunkt der Aktivität.'},
{f: 'Art', z: 'Telefonat, E-Mail, Termin, Besichtigung, Dokumentversand, Gate-Prüfung, Kontrolle, Störfall.'},
{f: 'Aufgabe', z: 'Konkrete Handlung. «Nachfassen» ist keine Aufgabe; «Finanzierungsbestätigung bei Meier bis 12.03. einfordern» ist eine.'},
{f: 'Priorität', z: 'hoch, mittel, tief. Alles am Gate ist hoch.'},
{f: 'Frist', z: 'Datum. Pflichtfeld: keine Aufgabe ohne Frist.'},
{f: 'Status', z: 'offen, in Arbeit, erledigt, entfällt, blockiert. Bei «blockiert» ist der Grund zu erfassen.'},
{f: 'Nächster Schritt', z: 'Was nach Erledigung folgt. Verhindert, dass ein Vorgang nach einer erledigten Aufgabe stillsteht.'},
{f: 'Dokument', z: 'Verweis auf die Ablage nach der Dokumentenarchitektur.'},
{f: 'Kommunikationsnotiz', z: 'Sachlich. Der Eintrag ist gegenüber der betroffenen Person auskunftspflichtig (R39).'},
{f: 'Gate-Bezug', z: 'Welches Gate die Aktivität vorbereitet oder betrifft.'},
];

const TAGESLISTE = [
{a: 'Überfällige Aufgaben', k: 'Frist überschritten, Status nicht erledigt', prio: 'zuerst, ohne Ausnahme'},
{a: 'Gate-Vorlagen', k: 'Gate-Prüfung angefordert oder mit Bedingung freigegeben', prio: 'hoch – ein blockiertes Gate hält den ganzen Vorgang'},
{a: 'Unbeantwortete Anfragen', k: 'Eingang älter als vier Arbeitsstunden ohne Antwort', prio: 'hoch – Reaktionszeit ist ein Indikator'},
{a: 'Rückmeldungen nach Besichtigung', k: 'Besichtigung älter als 48 Stunden ohne erfasste Rückmeldung', prio: 'hoch'},
{a: 'Ablaufende Angebotsfristen', k: 'Gültigkeit läuft in 48 Stunden ab', prio: 'hoch'},
{a: 'Ablaufende Reservationsfristen', k: 'Reservation läuft in fünf Arbeitstagen ab', prio: 'hoch'},
{a: 'Offene Bedingungen aus Gate-Freigaben', k: 'Bedingt freigegeben, Bedingung nicht erledigt', prio: 'hoch'},
{a: 'Fällige Eigentümerreports', k: 'Wochenreport nicht versandt', prio: 'mittel – aber nie überspringen'},
{a: 'Offene Dokumentenpositionen', k: 'Pflichtposition der Checkliste länger als zwei Wochen offen', prio: 'mittel'},
{a: 'Fällige Löschfristen', k: 'Löschfrist erreicht', prio: 'mittel – Datenschutzpflicht (R39)'},
{a: 'Interessenten ohne nächste Aktion', k: 'Funnelstufe ab 3, Feld «nächste Aktion» leer', prio: 'mittel'},
{a: 'Wiedervorlagen', k: 'Wiedervorlagedatum erreicht', prio: 'tief'},
];

module.exports = {OBJEKTSTATUS, VERLUSTGRUND, AKTIVITAET, TAGESLISTE};
