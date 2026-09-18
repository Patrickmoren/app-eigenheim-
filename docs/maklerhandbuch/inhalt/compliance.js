/* Compliance-Teil: GwG-Triage, TJPG, Datenschutz, Aufbewahrung.
   Neu in Version 2. Grundlage der Phasen 10, 13, 15, 17 und 20.

   WICHTIG zur Quellengüte: Fedlex und die Bundesstellen waren bei der
   Erstellung aus der Arbeitsumgebung nicht erreichbar. Die Aussagen zum
   revidierten GwG und zum TJPG beruhen auf Fachpublikationen von
   Anwaltskanzleien, Branchenverbänden und Compliance-Dienstleistern mit
   Stand Juli bis September 2026. Sie sind als solche gekennzeichnet und vor
   dem Einsatz gegen den Verordnungstext zu verifizieren. */

const QUELLENVORBEHALT = [
  'Dieser Teil beruht auf Fachpublikationen, nicht auf dem Verordnungstext. Die Primärquellen – Fedlex, Bundesamt für Justiz, die revidierte Geldwäschereiverordnung und die Weisungen der zuständigen Selbstregulierungsorganisation – waren bei der Erstellung nicht zugänglich.',
  'Die Fachpublikationen widersprechen sich in einem zentralen Punkt: Compliance-Dienstleister stellen die Unterstellung der Immobilienvermittlung pauschal dar, anwaltliche Analysen betonen die tätigkeitsbezogene Anknüpfung und die Ausnahmen. Dieser Widerspruch ist nicht aus Sekundärquellen auflösbar.',
  'Konsequenz für die Praxis: Das Unternehmen klärt die Unterstellungsfrage einmal grundsätzlich mit Rechtsberatung und Selbstregulierungsorganisation ab und hinterlegt das Ergebnis als interne Weisung. Bis dahin gilt die Triage in C2 als vorsorgliche Arbeitsregel, nicht als Rechtsauskunft.',
];

/* ---------------------------------------------- Unterstellung: Anknüpfung */
const GWG_ANKNUEPFUNG = [
{p: 'Norm', i: 'Art. 2 Abs. 3bis und 3ter des revidierten GwG (SR 955.0). Ausführungsbestimmungen in der revidierten Geldwäschereiverordnung.'},
{p: 'Inkrafttreten', i: '1. Oktober 2026.'},
{p: 'Anknüpfung', i: 'Nicht die Berufsbezeichnung, sondern die konkrete Tätigkeit. Unterstellt ist, wer berufsmässig für Dritte an Finanztransaktionen im Zusammenhang mit dem Kauf oder Verkauf von Grundstücken mitwirkt, einschliesslich der Beschaffung von Mitteln.'},
{p: 'Erfasste Geschäfte', i: 'Kauf und Verkauf von Grundstücken einschliesslich Kaufversprechen und Kaufvertrag; wirtschaftlich gleichwirkende Geschäfte, insbesondere die Übertragung von Anteilen an Immobiliengesellschaften (Share Deal); nach einzelnen Darstellungen auch Geschäfte im Zusammenhang mit Zwangsverwertungen.'},
{p: 'Mehrfachunterstellung', i: 'Weil an die konkrete Mitwirkung angeknüpft wird, können in einer Transaktion mehrere Personen unterstellt sein – etwa Makler, Treuhänder und Anwalt gleichzeitig.'},
{p: 'Offene Abgrenzung', i: 'Ob eine reine Vermittlungstätigkeit ohne Mitwirkung an der Finanztransaktion die Unterstellung auslöst, wird in den Fachpublikationen unterschiedlich beurteilt. Diese Frage ist für das Unternehmen verbindlich zu klären, weil sie über den gesamten Pflichtenumfang entscheidet.'},
{p: 'Kernpflichten bei Unterstellung', i: 'Identifikation der Vertragspartei; Feststellung der wirtschaftlich berechtigten Person; Dokumentation der Geschäftsbeziehung; Meldung bei begründetem Verdacht; Anschluss an eine von der FINMA anerkannte Selbstregulierungsorganisation nach Art. 14 GwG; internes Weisungswesen, Risikoanalyse, Schulung und Kontrollen.'},
{p: 'Anschlussfrist', i: 'Eine Fachpublikation nennt den 1. Dezember 2026 als Frist für das Anschlussgesuch bei bereits ausgeübter Tätigkeit. Die Frist ist mit der Selbstregulierungsorganisation zu bestätigen.'},
];

/* ------------------------------------------------ Ausnahmen (Triage-Basis) */
const GWG_AUSNAHMEN = [
{nr: 'X1', ausnahme: 'Kauf einer in der Schweiz selbst bewohnten Wohnliegenschaft',
 inhalt: 'Nach den vorliegenden Darstellungen löst das Geschäft rund um das selbstgenutzte Eigenheim keine Unterstellung aus. Diese Ausnahme wird ohne Schwellenwert und ohne Erfordernis der Abwicklung über einen schweizerischen Finanzintermediär beschrieben.',
 folge: 'Das ist der Regelfall dieses Handbuchs. Trifft die Ausnahme zu, entfallen die geldwäschereirechtlichen Sorgfaltspflichten aus dieser Unterstellung. Die Prüfung, ob sie zutrifft, hängt von der Nutzung durch die Käuferschaft ab und ist deshalb Teil der Käuferqualifikation, nicht des Mandatsbeginns.',
 vorbehalt: 'Wortlaut und Reichweite sind gegen die Verordnung zu prüfen. Compliance bestätigt.'},
{nr: 'X2', ausnahme: 'Ersatzliegenschaft im Sinne von Art. 12 Abs. 3 Bst. e StHG',
 inhalt: 'Der Kauf einer Wohnliegenschaft, die in der Schweiz als Ersatzliegenschaft dient, wird in denselben Darstellungen als Ausnahme genannt.',
 folge: 'Praktisch relevant, wenn die Käuferschaft aus einem Verkauf einer selbstgenutzten Liegenschaft ersatzbeschafft.',
 vorbehalt: 'Wortlaut gegen die Verordnung prüfen. Compliance bestätigt.'},
{nr: 'X3', ausnahme: 'Bagatellschwelle unter CHF 5 Mio. bei Abwicklung über einen unterstellten Finanzintermediär',
 inhalt: 'Übertragungen von Grundstücken und Rechtseinheiten mit einem Wert unter CHF 5 Mio. werden als ausgenommen beschrieben, soweit der Kaufpreis ausschliesslich über einen dem GwG unterstellten Finanzintermediär geleistet und empfangen wird.',
 folge: 'Greift zusätzlich zu X1. Setzt voraus, dass tatsächlich keine Zahlung ausserhalb des Bankwegs erfolgt – also keine Barzahlung, keine Direktzahlung, keine Verrechnung. Die Zahlungsabwicklung über das Notariat ist deshalb auch compliance-seitig zu dokumentieren.',
 vorbehalt: 'Schwellenwert, Bemessung und Nachweisanforderungen gegen die Verordnung prüfen. Compliance bestätigt.'},
{nr: 'X4', ausnahme: 'Keine Mitwirkung an einer Finanztransaktion',
 inhalt: 'Wird ausschliesslich vermittelt, ohne Mitwirkung an der Finanztransaktion und ohne Beschaffung von Mitteln, ist nach den anwaltlichen Analysen die Anknüpfung nicht erfüllt.',
 folge: 'Diese Ausnahme ist die unsicherste. Sie darf nicht als Gestaltungsmittel verwendet werden, um Pflichten zu vermeiden.',
 vorbehalt: 'Streitig. Verbindliche Klärung durch Rechtsberatung und SRO erforderlich, bevor darauf abgestellt wird.'},
];

/* ------------------------------------------------------ Triage (C2 im Buch) */
/* Entscheidungsbaum: WENN / DANN / SONST. Ergebnis bestimmt den Pflichtenpfad. */
const GWG_TRIAGE = [
{nr: 1, frage: 'Hat das Unternehmen die Unterstellungsfrage grundsätzlich geklärt und als Weisung hinterlegt?',
 ja: 'Weiter mit Schritt 2 nach der internen Weisung.',
 nein: 'STOP für die Compliance-Beurteilung, nicht für das Mandat. Vorsorglich Pfad B anwenden und die Klärung bei der Verkaufsleitung anstossen. Ohne interne Weisung darf niemand die Unterstellung im Einzelfall selbst verneinen.'},
{nr: 2, frage: 'Ist das Geschäft ein Share Deal, also Übertragung von Anteilen an einer Immobiliengesellschaft?',
 ja: 'Pfad A: vollständige Sorgfaltspflichten annehmen. Compliance vor der Mandatsannahme beiziehen. Keine Ausnahme unterstellen.',
 nein: 'Weiter mit Schritt 3.'},
{nr: 3, frage: 'Ist die Verkäuferschaft oder die Käuferschaft eine juristische Person, eine Personengesellschaft, ein Trust oder eine Struktur mit nicht offensichtlicher Eigentümerschaft?',
 ja: 'Pfad A. Zusätzlich TJPG-Bezug prüfen (Abschnitt C3).',
 nein: 'Weiter mit Schritt 4.'},
{nr: 4, frage: 'Erwirbt die Käuferschaft die Liegenschaft zur eigenen Wohnnutzung in der Schweiz – oder als Ersatzliegenschaft im Sinne von Art. 12 Abs. 3 Bst. e StHG?',
 ja: 'Ausnahme X1 bzw. X2 kommt in Betracht. Nutzung im Käuferprofil dokumentieren und durch die Käuferschaft schriftlich bestätigen lassen. Danach Pfad B.',
 nein: 'Erwerb zu Anlage-, Vermietungs- oder gewerblichen Zwecken: Ausnahme X1 greift nicht. Weiter mit Schritt 5.'},
{nr: 5, frage: 'Liegt der Transaktionswert unter CHF 5 Mio. UND wird der Kaufpreis ausschliesslich über einen dem GwG unterstellten Finanzintermediär geleistet und empfangen?',
 ja: 'Ausnahme X3 kommt in Betracht. Zahlungsweg im Dossier belegen. Danach Pfad B.',
 nein: 'Pfad A: vollständige Sorgfaltspflichten annehmen, Compliance beiziehen.'},
{nr: 6, frage: 'Wird eine Zahlung ausserhalb des Bankwegs angeboten oder geleistet – Bargeld, Direktzahlung, Verrechnung, Zahlung durch einen Dritten?',
 ja: 'Unabhängig von jeder Ausnahme: Zahlung nicht annehmen, Vorgang sofort an Compliance, Mandat bis zur Klärung anhalten. Art. 8a GwG beachten.',
 nein: 'Triage abgeschlossen. Ergebnis mit Datum, Begründung und prüfender Person im Dossier ablegen.'},
];

const GWG_PFADE = [
{pfad: 'Pfad A – unterstellt oder unklar',
 inhalt: 'Identifikation von Verkäufer- und Käuferschaft anhand amtlicher Ausweise mit Kopie; bei juristischen Personen Handelsregisterauszug und Zeichnungsberechtigung; Feststellung der wirtschaftlich berechtigten Person mit Formular; Abklärung von Herkunft der Mittel; Risikobeurteilung des Geschäfts; Abklärung PEP- und Sanktionsbezug nach interner Weisung; Dokumentation im gesonderten Compliance-Dossier; Meldung bei begründetem Verdacht ausschliesslich über die Meldestelle des Unternehmens.',
 verantwortung: 'Makler erhebt, Compliance beurteilt und gibt frei. Ohne Freigabe kein Vermarktungsstart und keine Reservation.'},
{pfad: 'Pfad B – Ausnahme greift voraussichtlich',
 inhalt: 'Reduzierter, aber nicht entfallender Umfang: Identifikation der Auftraggeber für die Vertragsabwicklung – das verlangt ohnehin das Notariat; Dokumentation des Triage-Ergebnisses mit Begründung; schriftliche Bestätigung der Nutzungsabsicht durch die Käuferschaft; Grundsatz keine Barzahlung; Beobachtungspflicht: ändert sich die Nutzungsabsicht oder der Zahlungsweg, ist die Triage zu wiederholen.',
 verantwortung: 'Makler führt und dokumentiert. Verkaufsleitung prüft im Vier-Augen-Prinzip vor Gate 8.'},
{pfad: 'Pfad C – Verdachtsfall',
 inhalt: 'Auffälligkeiten nach der internen Weisung: Zahlungsangebote ausserhalb des Bankwegs, unerklärliche Mittelherkunft, Unwille zur Identifikation, wechselnde Käuferidentitäten, auffällige Preisgestaltung, Druck auf schnellen Abschluss ohne wirtschaftlichen Grund, Einschaltung nicht erklärter Dritter. Keine eigene Ermittlung, keine Information der betroffenen Person über eine allfällige Meldung.',
 verantwortung: 'Makler informiert unverzüglich Compliance und dokumentiert nur Tatsachen. Entscheid über eine Meldung liegt ausschliesslich bei der Meldestelle des Unternehmens.'},
];

/* ------------------------------------------------------------------- TJPG */
const TJPG = [
{p: 'Norm und Inkrafttreten', i: 'Bundesgesetz über die Transparenz juristischer Personen und die Identifikation der wirtschaftlich berechtigten Personen (TJPG), in Kraft ab 1. Oktober 2026.'},
{p: 'Gegenstand', i: 'Zentrales, nicht öffentliches Register der wirtschaftlich berechtigten Personen juristischer Personen. Zugriff ist nach den vorliegenden Darstellungen der Kontrollstelle, bestimmten Behörden und Finanzintermediären vorbehalten.'},
{p: 'Meldepflichtig', i: 'Nach den vorliegenden Darstellungen schweizerische Kapitalgesellschaften und weitere Rechtseinheiten, ausländische juristische Personen mit tatsächlicher Verwaltung oder Grundeigentum in der Schweiz sowie Trustees mit Wohnsitz oder Sitz in der Schweiz.'},
{p: 'Schwelle', i: 'Wirtschaftlich berechtigt ist, wer direkt oder indirekt, allein oder in Absprache, mindestens 25 Prozent des Kapitals oder der Stimmen hält oder die Gesellschaft auf andere Weise kontrolliert; subsidiär das oberste Mitglied des leitenden Organs.'},
{p: 'Fristen', i: 'Nach den vorliegenden Darstellungen Übergangsfristen von bis zu zwei Jahren für bestehende Gesellschaften, kürzer bei komplexeren Strukturen; für nach dem 1. Oktober 2026 gegründete Gesellschaften Meldung innert eines Monats nach Handelsregistereintrag.'},
{p: 'Relevanz für den Hausverkauf', i: 'Zwei Berührungspunkte. Erstens: Ist die Verkäufer- oder Käuferschaft eine juristische Person, gehört die eigene Meldepflicht dieser Partei nicht zum Mandat – wohl aber die Feststellung der wirtschaftlich berechtigten Person für die Transaktion. Zweitens: Ist das eigene Unternehmen eine betroffene Rechtseinheit, besteht eine eigene Meldepflicht, die nichts mit dem Mandat zu tun hat und von der Geschäftsleitung zu erfüllen ist.'},
{p: 'Was der Makler nicht tut', i: 'Keine Beratung der Gegenpartei zu ihren TJPG-Pflichten, keine Registerabfrage im Namen Dritter, keine Zusage zur Registrierung. Hinweis auf die eigene Prüfpflicht der Partei und Verweis an deren Rechtsberatung.'},
];

/* -------------------------------------------------- PEP und Sanktionen */
const PEP = [
{p: 'Ausgangslage', i: 'Abklärungen zu politisch exponierten Personen und zu Sanktionslisten sind Pflichten unterstellter Finanzintermediäre. Ob und in welchem Umfang sie für dieses Unternehmen gelten, richtet sich nach der Unterstellung und der Weisung der Selbstregulierungsorganisation.'},
{p: 'Arbeitsregel bis zur Klärung', i: 'Bei Pfad A wird der Name der Vertragsparteien und der wirtschaftlich berechtigten Personen nach interner Weisung abgeglichen. Bei Pfad B erfolgt kein systematischer Abgleich; auffällige Hinweise werden gleichwohl an Compliance gemeldet.'},
{p: 'Kennzeichnung', i: 'Abhängig von Unternehmensstruktur, GwG-Unterstellung und SRO-Zugehörigkeit – intern zu prüfen. Dieses Handbuch legt keinen Umfang fest.'},
{p: 'Was nie geschieht', i: 'Kein eigenmächtiger Abgleich über beliebige Internetquellen, keine Ablage von Treffern ohne Compliance-Beurteilung, keine Mitteilung an die betroffene Person.'},
];

/* -------------------------------------------------- Datenschutz, Bildrechte */
const DATENSCHUTZ = [
{t: 'Rechtsgrundlage', i: 'DSG (SR 235.1), revidierte Fassung, in Kraft seit 1. September 2023. Bearbeitung nur rechtmässig, verhältnismässig und zweckgebunden; Informations- und Auskunftspflichten.'},
{t: 'Rollen', i: 'Das Unternehmen ist Verantwortlicher für Eigentümer- und Interessentendaten. Fotograf, Grundrissdienstleister, CRM-Anbieter und Portale sind Auftragsbearbeiter; der Vertrag mit ihnen muss die Bearbeitung regeln.'},
{t: 'Rechtsgrundlage je Datenkategorie', i: 'Eigentümerdaten: Vertragserfüllung (Mandat). Interessentendaten: Vertragsanbahnung und Einwilligung. Finanzierungsnachweise: Einwilligung mit klarem Zweck. Newsletter: Einwilligung mit jederzeitiger Abmeldung.'},
{t: 'Weitergabe', i: 'An Notariat, Banken, Behörden und Dienstleister nur soweit für die Abwicklung erforderlich. Finanzierungsnachweise nur mit Einwilligung des Interessenten; eine Rückfrage bei dessen Bank setzt die Einwilligung voraus.'},
{t: 'Auskunftsrecht', i: 'Jeder Interessent kann Auskunft über die zu seiner Person gespeicherten Daten verlangen. Deshalb sind CRM-Bemerkungen sachlich zu halten: was nicht in einer Auskunft stehen darf, gehört nicht ins Feld.'},
{t: 'Löschfristen', i: 'Das Feld «Löschfrist» im CRM ist Pflichtfeld. Nicht weiterverfolgte Interessenten werden nach der intern festgelegten Frist gelöscht. Vertrags- und Abwicklungsunterlagen unterliegen davon abweichend den Aufbewahrungspflichten.'},
{t: 'Bildrechte', i: 'Nutzungsrechte, Nutzungsdauer und Nutzung nach Mandatsende sind mit dem Fotografen schriftlich zu regeln. Keine identifizierbaren Personen, keine Nachbarfenster, keine Kennzeichen. Virtuelle Möblierung ist zu kennzeichnen; sie darf Bausubstanz und Ausbau nicht verändern.'},
{t: 'Datenpanne', i: 'Verlust, Fehlversand oder unbefugter Zugriff auf Personendaten wird unverzüglich der internen Stelle gemeldet. Ob eine Meldung an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten erforderlich ist, beurteilt nicht der Makler. Vorgehen siehe Störfall S15 in Teil J.'},
];

const AUFBEWAHRUNG = [
{kat: 'Maklermandat und Nachträge', dauer: 'Nach interner Vorgabe, mindestens bis zum Ablauf der Verjährung allfälliger Ansprüche aus dem Mandat', grund: 'Nachweis des Auftrags und der Provision', stufe: 'intern'},
{kat: 'Mängelliste, Offenlegungsnachweise, Besichtigungsprotokolle', dauer: 'Mindestens zehn Jahre ab Eigentumsübergang', grund: 'Gewährleistung bei Gebäuden verjährt fünf Jahre nach Eigentumserwerb (Art. 219 Abs. 3 OR); Beweisvorsorge darüber hinaus', stufe: 'vertraulich'},
{kat: 'Bewertungsbericht und Grundlagen', dauer: 'Nach interner Vorgabe', grund: 'Nachvollziehbarkeit der Preisempfehlung', stufe: 'vertraulich'},
{kat: 'Compliance-Dossier: Identifikation, wirtschaftlich Berechtigte, Triage', dauer: 'Nach GwG und SRO-Weisung – intern festzulegen', grund: 'Gesetzliche Aufbewahrungspflicht bei Unterstellung', stufe: 'streng vertraulich'},
{kat: 'Interessentendaten ohne Abschluss', dauer: 'Interne Löschfrist, kurz zu halten', grund: 'Zweckbindung nach DSG', stufe: 'vertraulich'},
{kat: 'Finanzierungsnachweise nicht berücksichtigter Interessenten', dauer: 'Löschung nach Abschluss des Verkaufs', grund: 'Zweck entfallen', stufe: 'streng vertraulich'},
{kat: 'Vertrags- und Notariatsunterlagen', dauer: 'Nach interner Vorgabe, lange Frist', grund: 'Abwicklungs- und Beweisunterlagen', stufe: 'vertraulich'},
{kat: 'Übergabeprotokoll und Zählerstände', dauer: 'Mindestens zehn Jahre', grund: 'Beweisvorsorge Übergabezustand', stufe: 'vertraulich'},
{kat: 'Buchhaltungsunterlagen, Honorarrechnung', dauer: 'Zehn Jahre nach OR-Buchführungsvorschriften', grund: 'Handelsrechtliche Aufbewahrung', stufe: 'intern'},
];

/* Kostenfolgen bei Abbruch eines Verkaufs.
   Ergänzt nach Falltest FT10 (Lücke L3). */
const KOSTENFOLGEN = [
{p: 'Maklerhonorar', i: 'Der Mäklerlohn wird nur fällig, wenn der Vertrag infolge des Nachweises oder der Vermittlung zustande kommt (Art. 413 Abs. 1 OR, R18). Scheitert der Verkauf vor der Beurkundung, besteht kein Honoraranspruch – unabhängig vom bereits geleisteten Aufwand.'},
{p: 'Aufwandersatz', i: 'Ein Anspruch auf Ersatz von Aufwendungen besteht nur, wenn er im Mandat ausdrücklich vereinbart ist (Ziffer 12 der Mandatsstruktur). Ohne Vereinbarung trägt der Auftragnehmer den Aufwand. Deshalb sind ersatzfähige Positionen, Obergrenze und Nachweispflicht bei der Mandatsausfertigung zu regeln, nicht im Streitfall.'},
{p: 'Vermarktungskosten', i: 'Fotografie, Grundrisse, GEAK und Portalkosten folgen der im Mandat vereinbarten Kostenträgerschaft und der Budgetfreigabe. Ist geregelt, wer sie bei einem Abbruch trägt, entsteht hier kein Streit.'},
{p: 'Notariatskosten', i: 'Die Kostenfolge bei einem Abbruch richtet sich nach dem Auftragsverhältnis zum Notariat und nach kantonalem Gebührenrecht. Sie ist bei der Auftragserteilung vorab zu klären und zu dokumentieren, nicht nach dem Scheitern. Die Notariatscheckliste fragt dies ab.'},
{p: 'Reservationszahlung', i: 'Es wird keine entgegengenommen. Wurde im Einzelfall eine Zahlung auf ein Notariatskonto geleistet, ist sie vollumfänglich zurückzuerstatten; eine Verfallsklausel wäre in einer nicht beurkundeten Reservationsvereinbarung nicht durchsetzbar (R2, R38).'},
{p: 'Konventionalstrafe', i: 'Keine. Eine Konventionalstrafe in einem nicht öffentlich beurkundeten Vorvertrag zum Grundstückkauf ist nicht durchsetzbar (R2). Wird sie von der Gegenseite behauptet, geht der Fall an die Rechtsberatung.'},
{p: 'Kosten der Käuferseite', i: 'Aufwendungen der Käuferschaft – Bankgebühren, Gutachten, Reisekosten – trägt diese selbst, soweit nichts anderes schriftlich vereinbart ist. Keine Zusage dazu ohne Rechtsberatung.'},
{p: 'Dokumentation', i: 'Bei jedem Abbruch werden die angefallenen Kosten je Position, ihre Grundlage und die Kostenträgerschaft festgehalten. Das ist Teil des Störfalls T7 bzw. T8.'},
];

module.exports = {QUELLENVORBEHALT, KOSTENFOLGEN, GWG_ANKNUEPFUNG, GWG_AUSNAHMEN, GWG_TRIAGE,
  GWG_PFADE, TJPG, PEP, DATENSCHUTZ, AUFBEWAHRUNG};
