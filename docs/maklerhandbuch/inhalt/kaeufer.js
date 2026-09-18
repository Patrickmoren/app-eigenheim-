/* Käufermanagement: Funnel, Käuferprofil, Angebotsvergleich, Verhandlung.
   Version 2 ersetzt die dreistufige Einteilung A/B/C aus Version 1 durch
   einen neunstufigen Funnel mit Übergangskriterien. */

/* -------------------------------------------------------- Neunstufiger Funnel */
const FUNNEL = [
{st: 1, name: 'Lead', def: 'Kontakt ist bekannt, es liegt keine Äusserung zu diesem Objekt vor.',
 kriterium: 'Kontaktdaten und Quelle erfasst.',
 aktion: 'Kurzdossier zustellen, Qualifizierungsgespräch anbieten.',
 daten: 'Name, Kontakt, Quelle, Datum', abbruch: 'Keine Reaktion nach zwei Kontaktversuchen.'},
{st: 2, name: 'Interessent', def: 'Hat sich zu diesem Objekt gemeldet, Kaufabsicht unbestimmt.',
 kriterium: 'Anfrage zu diesem Objekt liegt vor.',
 aktion: 'Qualifizierungsgespräch nach Käuferprofil führen.',
 daten: 'Haushalt, Wohnsituation, Zeithorizont', abbruch: 'Reine Wertneugier oder Marktbeobachtung.'},
{st: 3, name: 'Qualifizierter Interessent', def: 'Kaufabsicht ist plausibel, Finanzierung selbstdeklariert, erwerbsrechtlich zulässig.',
 kriterium: 'Käuferprofil vollständig; Staatsangehörigkeit, Wohnsitz und Nutzungsabsicht erfasst; Eigenmittel plausibel (R34).',
 aktion: 'Vollständiges Dossier gegen Empfangsbestätigung; Besichtigung terminieren.',
 daten: 'Finanzierungsstand, Eigenmittel, Bank, Nutzungsabsicht, Entscheidungsbefugnis',
 abbruch: 'Erwerbsrechtlich unzulässig; Eigenmittel offensichtlich nicht ausreichend; kein Entscheidungsträger erreichbar.'},
{st: 4, name: 'Besichtigung', def: 'Hat das Objekt besichtigt.',
 kriterium: 'Besichtigung durchgeführt und protokolliert; Offenlegung der Mängel vermerkt (R10).',
 aktion: 'Rückmeldung innerhalb von 48 Stunden strukturiert erheben.',
 daten: 'Preisempfinden, Bedenken, nächster Schritt', abbruch: 'Absage mit erfasstem Grund.'},
{st: 5, name: 'Qualifizierter Käufer', def: 'Verfolgt den Kauf weiter und hat die Finanzierung in Abklärung oder bestätigt.',
 kriterium: 'Zweitbesichtigung oder ausdrückliche Kaufabsicht mit Terminvorstellung; Finanzierungsabklärung nachweislich eingeleitet.',
 aktion: 'Angebotsformular abgeben und erläutern; objektbezogene Bankbestätigung verlangen.',
 daten: 'Kaufpreisrahmen, gewünschter Übergabetermin, Bedingungen',
 abbruch: 'Finanzierungsabklärung wird nicht eingeleitet.'},
{st: 6, name: 'Angebot', def: 'Hat ein schriftliches Angebot eingereicht.',
 kriterium: 'Angebot schriftlich, unterzeichnet, mit Eingangsvermerk (Datum und Uhrzeit).',
 aktion: 'Vollständigkeit prüfen, fehlende Angaben mit Frist nachfordern.',
 daten: 'Angebotspreis, Bedingungen, Vorbehalte, Gültigkeit', abbruch: 'Angebot wird zurückgezogen oder läuft ab.'},
{st: 7, name: 'Verhandlungsfähiges Angebot', def: 'Angebot ist vollständig und finanziell belegt.',
 kriterium: 'Gate 6 ist passiert: objektbezogene Finanzierungsbestätigung, Eigenmittelnachweis mit hartem Anteil, erwerbsrechtliche Zulässigkeit geklärt, GwG-Triage abgeschlossen (R37, R40).',
 aktion: 'In den Angebotsvergleich aufnehmen; Entscheidungsvorlage für den Eigentümer.',
 daten: 'Finanzierungsbestätigung, Abschlusswahrscheinlichkeit, Nettoerlös',
 abbruch: 'Finanzierungsbestätigung wird nicht beigebracht; Bewilligung wird verweigert.'},
{st: 8, name: 'Vertragskandidat', def: 'Einigung erzielt, Reservation ausgestellt, Notariat beauftragt.',
 kriterium: 'Gate 8 ist passiert; Reservationsbestätigung unterzeichnet; Identifikation abgeschlossen.',
 aktion: 'Notariat begleiten; Zweitinteressenten in Wartestellung halten.',
 daten: 'Beurkundungstermin, offene Bedingungen',
 abbruch: 'Rücktritt vor Beurkundung – bis dahin sind beide Seiten frei (R1, R2).'},
{st: 9, name: 'Käufer', def: 'Kaufvertrag ist beurkundet.',
 kriterium: 'Öffentliche Beurkundung erfolgt (R1). Eigentümer wird die Person erst mit dem Grundbucheintrag (R3).',
 aktion: 'Vollzug und Übergabe begleiten.',
 daten: 'Zahlungs- und Eintragungsstand, Übergabetermin', abbruch: 'Rückabwicklung – nur über Notariat und Rechtsberatung.'},
];

const FUNNEL_REGELN = [
  'Eine Stufe wird nur erreicht, wenn ihr Kriterium belegt ist. Die Stufe wird im CRM mit Datum und Begründung gesetzt.',
  'Rückstufungen sind normal und werden dokumentiert: eine geplatzte Finanzierung stuft von 7 auf 5 zurück, nicht auf «verloren».',
  'Ab Stufe 3 wird das vollständige Dossier abgegeben, nicht vorher. Ab Stufe 7 wird der Eigentümer mit Namen informiert.',
  'Die Stufen 1 bis 4 sind Mengengeschäft und werden über Quoten gesteuert. Die Stufen 5 bis 9 sind Einzelfallführung.',
  'Zweitinteressenten auf Stufe 7 werden bis zur Beurkundung gehalten, nicht abgesagt. Reservationen platzen; eine gehaltene Alternative spart Wochen.',
];

/* ------------------------------------------------------- Käuferprofil (F2) */
const PROFIL = [
{g: 'Identifikation'},
{f: 'Name und Vorname aller Kaufinteressenten', z: 'Vertragsparteien; alle müssen unterschreiben', pflicht: 'ab Stufe 2'},
{f: 'Kontaktdaten: Telefon, E-Mail, Adresse', z: 'Erreichbarkeit und Korrespondenz', pflicht: 'ab Stufe 1'},
{f: 'Geburtsdatum', z: 'Vorbereitung der Notariatsangaben', pflicht: 'ab Stufe 6'},
{f: 'Staatsangehörigkeit, Wohnsitz, Ausländerstatus', z: 'Bewilligungspflicht nach BewG (R34)', pflicht: 'ab Stufe 3, vor Terminvergabe'},
{g: 'Nutzung und Haushalt'},
{f: 'Anzahl Personen, die einziehen; Kinder mit Alter', z: 'Objektpassung', pflicht: 'ab Stufe 2'},
{f: 'Gewünschte Nutzung: Erstwohnsitz, Zweitwohnsitz, Vermietung, Anlage', z: 'Objektpassung; bestimmt die GwG-Ausnahme X1 (R37)', pflicht: 'ab Stufe 3'},
{f: 'Aktuelle Wohnsituation: Miete oder Eigentum', z: 'Zeithorizont und Abhängigkeiten', pflicht: 'ab Stufe 2'},
{f: 'Kündigungsfrist bzw. frühestmöglicher Auszug', z: 'Übergabetermin', pflicht: 'ab Stufe 3'},
{g: 'Finanzierung'},
{f: 'Finanzierungsstand: nein / in Abklärung / Selbstauskunft / Bankbestätigung', z: 'Funnelstufe und Gate 6', pflicht: 'ab Stufe 3'},
{f: 'Finanzierende Bank und Ansprechperson', z: 'Verifikation, nur mit Einwilligung (R39)', pflicht: 'ab Stufe 5'},
{f: 'Eigenmittel total', z: 'Plausibilisierung', pflicht: 'ab Stufe 3'},
{f: 'davon harte Eigenmittel, nicht aus der zweiten Säule', z: 'Rahmen der Selbstregulierung: mindestens 10 Prozent (R40)', pflicht: 'ab Stufe 5'},
{f: 'Herkunft der Eigenmittel', z: 'Plausibilität; bei Pfad A der Triage Pflicht (R37)', pflicht: 'ab Stufe 5'},
{f: 'Objektbezogene Finanzierungsbestätigung mit Datum, Betrag, Gültigkeit, Vorbehalten', z: 'Gate 6; ohne sie kein verhandlungsfähiges Angebot', pflicht: 'ab Stufe 7'},
{g: 'Abhängigkeiten und Entscheidungsfähigkeit'},
{f: 'Bestehende Immobilie im Eigentum', z: 'Abhängigkeitsrisiko', pflicht: 'ab Stufe 2'},
{f: 'Verkauf der bestehenden Immobilie erforderlich? Stand des Verkaufs', z: 'Häufigste Ursache geplatzter Reservationen', pflicht: 'ab Stufe 3'},
{f: 'Entscheidungsbefugnis: entscheidet die Person allein?', z: 'Verhandlungsfähigkeit', pflicht: 'ab Stufe 3'},
{f: 'Weitere Entscheidungsperson mit Rolle', z: 'Einbindung vor dem Angebot', pflicht: 'ab Stufe 3'},
{g: 'Kauf und Termin'},
{f: 'Kaufpreisrahmen von / bis', z: 'Passung zum Angebotspreis', pflicht: 'ab Stufe 3'},
{f: 'Gewünschter Kaufzeitpunkt', z: 'Terminplanung', pflicht: 'ab Stufe 3'},
{f: 'Gewünschter Übergabetermin; frühestens / spätestens', z: 'Verhandlungsmasse neben dem Preis', pflicht: 'ab Stufe 5'},
{f: 'Bedingungen und Vorbehalte', z: 'Abschlusssicherheit', pflicht: 'ab Stufe 5'},
{f: 'Interesse am Inventar', z: 'Verhandlungsmasse', pflicht: 'ab Stufe 5'},
{g: 'Prozessstand'},
{f: 'Unterlagenstatus: Kurzdossier / Dossier / Empfang bestätigt', z: 'Nachweis der Offenlegung', pflicht: 'ab Stufe 2'},
{f: 'Besichtigungsstatus und Datum', z: 'Funnelstufe', pflicht: 'ab Stufe 4'},
{f: 'Zweitbesichtigung mit Datum', z: 'Stärkster Frühindikator', pflicht: 'ab Stufe 5'},
{f: 'Erkannte Risiken', z: 'Steuerung der Abschlusssicherheit', pflicht: 'ab Stufe 5'},
{f: 'Nächste Aktion und Frist', z: 'Pflichtfeld; kein Interessent ohne nächste Aktion', pflicht: 'ab Stufe 1'},
{f: 'Funnelstufe mit Datum und Begründung', z: 'Steuerung und Auswertung', pflicht: 'ab Stufe 1'},
{f: 'Datenschutz: Löschfrist', z: 'Pflichtfeld (R39)', pflicht: 'ab Stufe 1'},
];

/* --------------------------------------------- Angebotsvergleichsmatrix (F5) */
const VERGLEICH = [
{k: 'Angebotspreis Liegenschaft', art: 'Betrag', bedeutung: 'Ausgangsgrösse, nicht Entscheidungsgrösse'},
{k: 'Angebot Inventar', art: 'Betrag', bedeutung: 'Getrennt ausweisen; steuerlich und vertraglich eigenständig'},
{k: 'Total', art: 'Betrag', bedeutung: 'Vergleichbarkeit über unterschiedliche Inventarregelungen hinweg'},
{k: 'Geschätzter Nettoerlös', art: 'Betrag', bedeutung: 'Die Zahl, die für den Eigentümer zählt. Identische Annahmen je Angebot, Annahmen offenlegen'},
{k: 'Finanzierungsstatus', art: 'fehlt / Selbstauskunft / Bankbestätigung objektbezogen', bedeutung: 'Nur die dritte Stufe erfüllt Gate 6 (R40)'},
{k: 'Eigenmittel total und harter Anteil', art: 'Betrag', bedeutung: 'Belastbarkeit der Finanzierung'},
{k: 'Finanzierungsvorbehalt', art: 'ja / nein, mit Frist', bedeutung: 'Grösstes Abbruchrisiko'},
{k: 'Verkauf einer bestehenden Immobilie erforderlich', art: 'ja / nein, mit Stand', bedeutung: 'Zweitgrösstes Abbruchrisiko; Kette von Terminen'},
{k: 'Weitere Bedingungen und Vorbehalte', art: 'Text', bedeutung: 'Gutachten, Bewilligung, Zustimmung Dritter'},
{k: 'Gewünschter Übergabetermin', art: 'Datum', bedeutung: 'Abweichung zum Wunsch des Eigentümers ausweisen'},
{k: 'Zahlungsmodalitäten', art: 'Text', bedeutung: 'Anzahlung, Fristen, Zahlungsweg; Barzahlung ausgeschlossen (R38)'},
{k: 'Nebenabreden', art: 'Text', bedeutung: 'Alles, was nicht in den Vertrag gehört, aber verlangt wird'},
{k: 'Erwerbsrechtliche Bewilligung erforderlich', art: 'ja / nein, mit Verfahrensstand', bedeutung: 'Zeit- und Abbruchrisiko (R34–R36)'},
{k: 'Identifikation nach Triage', art: 'offen / erfasst / vollständig', bedeutung: 'Gate 6 und Gate 8 (R37)'},
{k: 'Notariatsbereitschaft', art: 'Text', bedeutung: 'Ist der Käufer terminlich und formell bereit – Ausweise, Vollmachten, Sprache'},
{k: 'Gültigkeit des Angebots', art: 'Datum und Uhrzeit', bedeutung: 'Reihenfolge und Entscheidungsdruck'},
{k: 'Vertragsrisiken', art: 'Text', bedeutung: 'Erkennbare Streitpunkte für die Vertragsphase'},
{k: 'Weitere Unsicherheiten', art: 'Text', bedeutung: 'Alles, was die Abwicklung verzögern kann'},
{k: 'Abschlusswahrscheinlichkeit', art: 'hoch / mittel / gering mit Begründung', bedeutung: 'Sachliche Einschätzung, kein Werturteil über Personen'},
];

const VERGLEICH_REGELN = [
  'Die Matrix erzeugt keine Rangliste und keine Empfehlung. Sie stellt her, dass ungleiche Angebote vergleichbar werden.',
  'Alle Angebote werden nach denselben Kriterien und mit denselben Annahmen aufbereitet. Eine Annahme, die bei einem Angebot getroffen wird, gilt für alle.',
  'Die Abschlusswahrscheinlichkeit wird begründet, nicht behauptet, und stützt sich auf Finanzierungsnachweis, Bedingungen und Termine – nicht auf Sympathie.',
  'Angebotsbeträge werden zwischen den Interessenten nicht offengelegt. Zulässig ist der wahrheitsgemässe Hinweis, dass weitere Angebote vorliegen.',
  'Die Entscheidung trifft der Eigentümer. Die Vorlage enthält Handlungsmöglichkeiten mit Konsequenzen, keine Empfehlung, die den Entscheid vorwegnimmt.',
];

/* ------------------------------------------------------ Verhandlungssystem */
const VERHANDLUNG_VORBEREITUNG = [
{p: 'Zielpreis', i: 'Vom Eigentümer bestimmt, intern klassifiziert. Steuert die Verhandlungsführung.'},
{p: 'Wunschpreis', i: 'Der Preis, mit dem die Verhandlung eröffnet wird – in der Regel über dem Zielpreis, aber begründbar.'},
{p: 'Verhandlungsspielraum', i: 'Die vom Eigentümer freigegebene Bandbreite zwischen Eröffnung und Rückzugslinie.'},
{p: 'Absolute Eigentümergrenze', i: 'Sofern vom Eigentümer vorgegeben. Streng intern. Wird nie genannt, auch nicht angedeutet.'},
{p: 'Nicht verhandelbare Punkte', i: 'Ausdrücklich benannt, etwa Übergabetermin, Verbleib bestimmter Einbauten, Zahlungsweg.'},
{p: 'Verhandlungsmasse neben dem Preis', i: 'Termin, Inventar, Sanierungsbeitrag, Zahlungsmodalitäten, Nutzen- und Gefahrenübergang. In dieser Reihenfolge prüfen, bevor über den Preis verhandelt wird.'},
{p: 'Mögliche Alternativen', i: 'Zweitplatzierte Angebote und ihr Stand. Eine Verhandlung ohne Alternative ist eine Bitte.'},
{p: 'Gegenleistungen', i: 'Was der Eigentümer für ein Zugeständnis erhält. Kein Zugeständnis ohne Gegenleistung.'},
{p: 'Fristen', i: 'Jede Aussage nach aussen ist befristet. Unbefristete Angebote verlieren ihre Wirkung.'},
{p: 'Eigentümerfreigaben', i: 'Schriftlicher Verhandlungsauftrag nach Gate 7. Ohne ihn wird nicht verhandelt.'},
{p: 'Kommunikationsstrategie', i: 'Wer sagt was, in welcher Reihenfolge, über welchen Kanal. Wer beim Eigentümer und beim Käufer Ansprechperson ist.'},
];

const VERHANDLUNG_PROTOKOLL = [
'Datum und Uhrzeit',
'Beteiligte mit Rolle',
'Kanal: persönlich, telefonisch, schriftlich',
'Aussage der Käuferschaft, möglichst wörtlich bei Zahlen und Bedingungen',
'Gegenposition der Verkäuferschaft',
'Aussage des Maklers – was zugesagt und was ausdrücklich nicht zugesagt wurde',
'Instruktion des Eigentümers, auf die sich der Schritt stützt, mit Datum',
'Ergebnis der Runde',
'Offene Punkte',
'Nächste Aktion mit Verantwortlichem und Frist',
];

const VERHANDLUNG_REGELN = [
  'Der Makler verhandelt ausschliesslich innerhalb des schriftlichen Auftrags. Überschreitet ein Schritt den Rahmen, wird die Verhandlung unterbrochen und der Eigentümer eingeholt – auch wenn das Momentum kostet.',
  'Keine Zusage zu Gewährleistung, Freizeichnung, Bauzulässigkeit, Steuerfolgen oder Finanzierung. Solche Punkte gehören in den Vertrag und zum Notariat.',
  'Mindestpreis und absolute Grenze werden nie genannt, nie angedeutet und nie durch ein Verhandlungsverhalten erkennbar gemacht.',
  'Bei mehreren Interessenten gilt Gleichbehandlung: gleiche Information, gleiche Frist, dokumentiertes Verfahren.',
  'Jede wesentliche Runde wird am gleichen Tag protokolliert. Was nicht protokolliert ist, ist im Streitfall nicht geschehen.',
  'Erhält der Makler von der Käuferseite ein Honorar, liegt Doppelmäkelei vor: ohne Offenlegung und Zustimmung beider Seiten kann der Lohnanspruch verwirken (R19).',
];

module.exports = {FUNNEL, FUNNEL_REGELN, PROFIL, VERGLEICH, VERGLEICH_REGELN,
  VERHANDLUNG_VORBEREITUNG, VERHANDLUNG_PROTOKOLL, VERHANDLUNG_REGELN};
