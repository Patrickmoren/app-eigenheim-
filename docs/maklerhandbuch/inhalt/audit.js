/* Audit von Version 1 und Schlussaudit von Version 2.
   Bewertungsschlüssel A bis F gemäss Auftrag. */

const SCHLUESSEL = [
{k: 'A', b: 'fachlich korrekt und professionell', f: 'Bleibt erhalten, gegebenenfalls sprachlich gestrafft.'},
{k: 'B', b: 'korrekt, aber zu oberflächlich', f: 'Wird fachlich vertieft.'},
{k: 'C', b: 'unklar oder zu allgemein', f: 'Erhält konkrete operative Regeln und Entscheidungslogik.'},
{k: 'D', b: 'rechtlich oder fachlich kritisch', f: 'Wird korrigiert; Risiko und Änderung sind unten einzeln ausgewiesen.'},
{k: 'E', b: 'fehlt', f: 'Wird neu erstellt.'},
{k: 'F', b: 'redundant', f: 'Wird zusammengeführt oder gestrichen.'},
];

const METHODE = [
  'Geprüft wurde die Fassung vom 18. September 2026, 88 Seiten, Teile A bis W, mit den neun Begleitdateien.',
  'Grundlage der Prüfung: die Anforderungen an ein operatives Verkaufsmanagementsystem – eindeutige Prozesslogik je Phase, verbindliche Prüfpunkte, klare Entscheidungsträger, belegbare Dokumentation, Entscheidungslogik statt Handlungsaufforderung.',
  'Die Bewertung bezieht sich auf die Eignung als Steuerungsinstrument, nicht auf die sprachliche Qualität. Version 1 ist sprachlich und strukturell sauber; ihre Schwäche liegt in der fehlenden Verbindlichkeit und in einer rechtlich zu pauschalen Compliance-Annahme.',
  'Vier Befunde betreffen die Rechtslage und sind unten als D-Befunde mit acht Feldern ausgewiesen. Der gewichtigste kehrt eine Kernannahme von Version 1 um.',
];

/* -------------------------------------------- Abschnittsweise Bewertung */
const BEWERTUNG = [
{g: 'Teil A – Überblick'},
{a: 'A1 Zweck und Abgrenzung', n: 'A', b: 'Abgrenzung sauber, insbesondere die ausdrückliche Nichtzuständigkeit für Rechts-, Steuer- und Finanzierungsberatung.', v: 'Übernommen.'},
{a: 'A2 Rollen mit Nicht-Zuständigkeiten', n: 'A', b: 'Die Spalte «ausdrücklich nicht zuständig für» ist der stärkste Teil von Version 1 und in dieser Form unüblich.', v: 'Übernommen, um Compliance und Verkaufsleitung erweitert.'},
{a: 'A3 Kennzeichnungssystem', n: 'B', b: 'Kennzeichen [RP] und [KA] sind richtig, aber die Normebene der Aussage fehlt: Bundesrecht, kantonales Recht, Praxis oder Selbstregulierung sind nicht unterscheidbar.', v: 'Register erhält je Position eine Normebene; [GW] neu belegt.'},
{a: 'A4 Phasenübersicht', n: 'B', b: 'Übersicht mit Dauer und Meilenstein ist brauchbar, zeigt aber keine Prüfpunkte.', v: 'Um Gate-Spalte erweitert.'},
{a: 'A5 Wo der Prozess scheitert', n: 'A', b: 'Fünf Ursachen mit Wirkung und Gegenmassnahme – praxisnah und richtig priorisiert.', v: 'Übernommen, um zwei Ursachen ergänzt.'},
{a: 'A6 Kantonale Klärungsliste', n: 'A', b: 'Sechzehn Positionen mit zuständiger Stelle. Verhindert die häufigste Fehlerquelle, nämlich Zahlen aus einem anderen Kanton.', v: 'Übernommen und erweitert.'},

{g: 'Teil B – Phasen'},
{a: 'Phasenraster mit acht Rubriken', n: 'C', b: 'Ziel, Aufgaben, Unterlagen, Prüfungen, Kommunikation, Meilenstein, Abschlusskriterien. Es fehlen genau die Felder, die eine Steuerung ermöglichen: Ausgangslage, Beteiligte, Entscheidungen, Entscheidungsträger, Risiken, Dokumentationspflicht, CRM-Vorgabe, Stop-Kriterien, Eskalation.', v: 'Raster auf achtzehn Felder erweitert; V1-Inhalte unverändert übernommen.'},
{a: 'Abschlusskriterien «Weiter wenn»', n: 'C', b: 'Kriterien sind formuliert, aber ohne Prüfer, ohne Nachweis und ohne Folge bei Nichterfüllung. Eine Selbstprüfung ohne Nachweis ist keine Kontrolle.', v: 'In das Gate-System überführt; teilweise redundante Kriterien dort zusammengeführt.'},
{a: 'Phasenabfolge und Abhängigkeiten', n: 'A', b: 'Reihenfolge ist fachlich richtig; die Trennung von Rechtsprüfung (6) vor Bewertung (7–8) und Mandat (10) entspricht der Praxis und schützt vor Aufwandverlust.', v: 'Unverändert. Gate 1 nach Phase 6 verstärkt die Logik.'},
{a: 'Phase 17 Reservation', n: 'A', b: 'Rechtlich der stärkste Abschnitt: Formungültigkeit des Vorvertrags korrekt hergeleitet, Konsequenz konsequent umgesetzt.', v: 'Übernommen.'},

{g: 'Teil C bis F – Fachteile'},
{a: 'Teil C Dokumenten-Checkliste', n: 'A', b: '92 Positionen mit Stufe, Zuständigkeit, Bezugsquelle und Rechtsverweis. Vollständig und gut sortiert.', v: 'Übernommen; Datenraum-Index und Vertraulichkeitsstufe ergänzt.'},
{a: 'Teil D Erstgesprächsleitfaden', n: 'A', b: '45 Fragen mit Begründung und Folge – die Spalte «was die Antwort bedeutet» macht daraus ein Arbeitsinstrument.', v: 'Übernommen; Sonderfallerkennung ergänzt.'},
{a: 'Teil D Strategieableitung', n: 'B', b: 'Acht Ausgangslagen mit Empfehlung und Begründung, fachlich gut. Es fehlt die Verbindung zu messbaren Auslösekriterien.', v: 'Mit der indikatorbasierten Preissteuerung verbunden.'},
{a: 'Teil E Objektaufnahme', n: 'A', b: '16 Blöcke, 182 Felder, mit Erfassungsart und Hinweis. Vollständig.', v: 'Struktur übernommen; im Handbuch nur noch Blockstruktur und Regeln, Felder in der Arbeitsmappe (siehe F-Befund).'},
{a: 'Teil F Bewertungsmethoden', n: 'B', b: 'Drei Methoden mit Einsatz, Vorgehen und Grenzen – korrekt. Es fehlen die Unterscheidung der Preisbegriffe und Szenarien.', v: 'Sechs Preisbegriffe neu; Plausibilitätsprüfungen übernommen und erweitert.'},
{a: 'Teil F Bewertungsvorlage', n: 'A', b: '20 Abschnitte einschliesslich Annahmen und Vorbehalten. Der Hinweis, dass es keine Schatzung im Rechtssinne ist, ist richtig und wichtig.', v: 'Übernommen.'},

{g: 'Teil G bis N – Vertrag, Vermarktung, Käufer'},
{a: 'Teil G Maklermandat', n: 'A', b: '24 Ziffern mit Prüfkennzeichnung; die drei genannten Streitklauseln Nachwirkung, Exklusivität, Aufwandersatz treffen die Praxis.', v: 'Übernommen; Ziffer zu Interessenkonflikten geschärft.'},
{a: 'Teil H Verkaufsdossier', n: 'A', b: '23 Abschnitte in der Lesereihenfolge des Interessenten; die Begründung zu Abschnitt 18 ist fachlich stark.', v: 'Übernommen; verbindliche Release-Checkliste ergänzt.'},
{a: 'Teil I Inserat', n: 'B', b: 'Sprachregeln sind konkret und gut. Kanäle sind aufgezählt, aber nicht in Vermarktungsstufen geordnet.', v: 'Stufenmodell von Pre-Marketing bis Rückzug ergänzt.'},
{a: 'Teil J Fotografie', n: 'A', b: 'Pflichtaufnahmen, Ausschlussliste, Bildreihenfolge, Vorbereitungsliste – operativ direkt verwendbar.', v: 'Übernommen.'},
{a: 'Teil K Interessentenmanagement', n: 'C', b: 'Dreistufige Einteilung A/B/C mit 33 CRM-Feldern. Die Stufen sind zu grob und ihre Kriterien zu weich: Stufe A lässt eine «plausible Selbstauskunft» genügen.', v: 'Neunstufiger Funnel mit belegten Übergangskriterien; Käuferprofil mit Pflichtstufe je Feld.'},
{a: 'Teil L Besichtigung', n: 'A', b: 'Checkliste in fünf Blöcken; der Offenlegungsvermerk im Protokoll ist der entscheidende Punkt und richtig begründet.', v: 'Übernommen.'},
{a: 'Teil M Kaufangebot', n: 'A', b: 'Rechtliche Wirkung je Block ausgewiesen; Unverbindlichkeit korrekt hergeleitet.', v: 'Übernommen.'},
{a: 'Teil N Verhandlung', n: 'B', b: 'Verhandlungsmasse neben dem Preis ist ein starker Abschnitt. Es fehlen Vorbereitungsrahmen und Protokollstruktur.', v: 'Vorbereitung mit elf Punkten und Protokoll mit zehn Feldern ergänzt.'},

{g: 'Teil O bis W – Abschluss und Grundlagen'},
{a: 'Teil O Reservation', n: 'A', b: 'Fachlich und rechtlich der beste Teil von Version 1.', v: 'Unverändert übernommen.'},
{a: 'Teil P Notariat', n: 'A', b: 'Übergabecheckliste mit 16 Positionen; die Unterscheidung der drei Zeitpunkte ist didaktisch richtig gelöst.', v: 'Übernommen.'},
{a: 'Teil Q Übergabeprotokoll', n: 'A', b: 'Elf Blöcke, 64 Felder; die vier häufigsten Fehler sind zutreffend benannt.', v: 'Übernommen; im Handbuch gekürzt, Formular in Dokument 03 (siehe F-Befund).'},
{a: 'Teil R Abschlusscheckliste', n: 'B', b: '65 Positionen mit Phase, Zuständigkeit und Nachweis. Ohne Verbindung zu Prüfpunkten bleibt sie eine Liste.', v: 'Mit Gates und Kontrollpunkten verbunden.'},
{a: 'Teil S Ordnerstruktur', n: 'B', b: '17 Ordner und eine gute Namenskonvention. Es fehlen Vertraulichkeit, Freigabestatus, Version und Verteilernachweis.', v: 'Zu einer Dokumentenarchitektur mit Metadaten erweitert.'},
{a: 'Teil U Controlling', n: 'C', b: '23 Kennzahlen mit Definition. Die Spalte «Orientierung» enthält teils starre Regeln, etwa «ab 90 Tagen Strategieüberprüfung» – siehe D2.', v: 'Kennzahlen übernommen; Handlungsauslöser durch Entscheidungslogik ersetzt.'},
{a: 'Teil W Rechtsregister', n: 'B', b: '41 Positionen mit Grundlage, Kerninhalt und Praxis – Konzept richtig. Es fehlen Normebene und einzelne wertrelevante Themen.', v: 'Auf 46 Positionen erweitert, Normebene je Position, R37/R38 korrigiert.'},
{a: 'Teil W2 Quellenangabe', n: 'A', b: 'Die Offenlegung, dass Fedlex nicht erreichbar war und die Aussagen auf Fachpublikationen beruhen, ist korrekt und in einem Handbuch selten.', v: 'Übernommen und in Teil G verstärkt.'},
];

/* ------------------------------------------- D-Befunde mit acht Feldern */
const D_BEFUNDE = [
{nr: 'D1', titel: 'Geldwäschereirechtliche Unterstellung pauschal angenommen',
 inhalt: 'Version 1 baut in den Phasen 10, 15, 17 und 20 eine ausnahmslose Identifikations- und Dokumentationspflicht ein: Identifikation aller Auftraggeber und Käufer, Feststellung der wirtschaftlich berechtigten Person, gesondertes Dossier – bei jedem Mandat. Register R37 stellt die Unterstellung als gegeben dar und verweist nur allgemein auf eine Bestätigung durch die Rechtsabteilung.',
 problem: 'Die Unterstellung nach Art. 2 Abs. 3bis und 3ter revGwG knüpft an die konkrete Mitwirkung an einer Finanztransaktion an, nicht an die Berufsbezeichnung. Die Fachpublikationen nennen ausdrücklich Ausnahmen, darunter den Kauf selbst bewohnter Wohnliegenschaften in der Schweiz, Ersatzliegenschaften nach Art. 12 Abs. 3 Bst. e StHG und Geschäfte unter CHF 5 Mio., die ausschliesslich über einen unterstellten Finanzintermediär abgewickelt werden. Der Normalfall dieses Handbuchs – Verkauf eines selbstgenutzten Einfamilienhauses an eine Familie, die dort einzieht – fällt damit voraussichtlich unter die Ausnahme.',
 risiko: 'Zwei gegenläufige Risiken. Erstens Überkonformität: Es werden Ausweiskopien, Angaben zur Mittelherkunft und Daten zu wirtschaftlich Berechtigten erhoben, für die keine gesetzliche Grundlage besteht. Eine Datenerhebung ohne Rechtsgrundlage ist selbst ein Datenschutzproblem (R39) – das Handbuch löst mit der einen Pflicht einen Verstoss gegen die andere aus. Zweitens Unterkonformität an der falschen Stelle: Weil Version 1 die Prüfung an den Mandatsbeginn legt, wird der Fall nicht erfasst, in dem die Unterstellung tatsächlich greift – der Erwerb zu Anlage- oder Vermietungszwecken. Diese Information entsteht erst bei der Käuferqualifikation, also fünf Phasen später.',
 aenderung: 'Die pauschale Pflicht wird durch eine Triage ersetzt, die je Mandat entscheidet. Der Prüfzeitpunkt verschiebt sich vom Mandatsbeginn zur Käuferqualifikation, weil die maassgebliche Ausnahme an der Nutzungsabsicht der Käuferschaft anknüpft.',
 loesung: 'Teil G, Abschnitt C2: sechsschrittiger Entscheidungsbaum mit den Ergebnispfaden A (unterstellt oder unklar, vollständige Pflichten, Compliance-Freigabe), B (Ausnahme greift voraussichtlich, reduzierter Umfang mit Beobachtungspflicht) und C (Verdachtsfall). Vier Ausnahmen sind einzeln mit Inhalt, Folge und Vorbehalt ausgewiesen. Ergebnis wird mit Begründung, Datum und prüfender Person abgelegt. Die Triage ist Kriterium in Gate 2 und Gate 6.',
 phase: 'Phasen 10, 13, 15, 17 und 20; Gates 2, 6 und 8',
 dokument: 'F-GwG Triage-Protokoll; Compliance-Dossier als eigene Dokumentenkategorie',
 verantwortung: 'Makler führt die Triage. Compliance entscheidet über Pfad A und gibt frei. Die grundsätzliche Unterstellungsfrage klärt die Rechtsabteilung mit der Selbstregulierungsorganisation einmal und hinterlegt sie als Weisung – bis dahin gilt vorsorglich Pfad B mit Dokumentationspflicht.'},

{nr: 'D2', titel: 'Preissteuerung als starre Frist',
 inhalt: 'Teil U von Version 1 nennt beim Kennwert «Tage am Markt» als Orientierung «segmentabhängig; ab 90 Tagen Strategieüberprüfung» und bei den Absagegründen «Häufung bei Preis ab 5 Nennungen erfordert Preisgespräch».',
 problem: 'Eine an den Zeitablauf gebundene Überprüfung sagt nicht, was zu tun ist, und legt die Preisreduktion als naheliegende Massnahme nahe. Der Zeitablauf ist kein Indikator für die Ursache. Ein Objekt mit vielen Anfragen und wenigen Besichtigungen hat ein Darstellungsproblem; ein Objekt ohne Anfragen hat ein Positionierungs- oder Auffindbarkeitsproblem. Beide sehen nach 90 Tagen gleich aus.',
 risiko: 'Verfrühte oder falsch bemessene Preisreduktion. Eine Reduktion, die keine Preisstufe der Suchfilter überschreitet, wird von der Zielgruppe nicht gesehen und ist verloren. Eine Reduktionskette in kurzen Abständen signalisiert Not und zerstört die Verhandlungsposition endgültig. Zudem entsteht ein Haftungsrisiko gegenüber dem Eigentümer, wenn eine Preisempfehlung ohne dokumentierte Ursachenanalyse abgegeben wurde.',
 aenderung: 'Zeitbezogene Regel durch indikatorbasierte Entscheidungslogik ersetzen. Preisreduktion nur nach dokumentiertem Ausschluss der drei übrigen Ursachenfelder.',
 loesung: 'Teil C: 14 Indikatoren mit Erhebung und Aussagekraft; acht Entscheidungslogiken P1 bis P8 im Muster WENN / Interpretation / DANN / SONST / NIE; achtstufiger Ablauf einer Preisänderung mit Vier-Augen-Prüfung vor dem Eigentümergespräch. Auslösekriterien werden in Phase 9 vorab mit dem Eigentümer vereinbart, damit die spätere Diskussion an Kriterien und nicht an Stimmungen anknüpft.',
 phase: 'Phasen 9, 12 und 14; Kontrollpunkt K3',
 dokument: 'V7 Marktfeedback und Ursachenanalyse; Blatt Preisindikatoren in Mappe 06',
 verantwortung: 'Makler erhebt und analysiert. Verkaufsleitung prüft die Vorlage im Vier-Augen-Prinzip. Der Eigentümer entscheidet schriftlich über jede Preisänderung.'},

{nr: 'D3', titel: 'Käuferqualifikation zu grob und Finanzierungsnachweis zu weich',
 inhalt: 'Teil K2 von Version 1 definiert drei Stufen. Stufe A – «Besichtigung, vollständiges Dossier, aktive Begleitung» – setzt voraus: «Finanzierung schriftlich bestätigt oder plausible Selbstauskunft mit belegten Eigenmitteln».',
 problem: 'Die Alternative «oder plausible Selbstauskunft» öffnet die höchste Stufe für unbelegte Finanzierungen. Zwischen «interessiert» und «Vertragskandidat» liegen faktisch mehrere Zustände mit unterschiedlichem Handlungsbedarf, die drei Stufen nicht abbilden. Ausserdem fehlt ein Zustand für Rückstufungen, etwa bei geplatzter Finanzierung.',
 risiko: 'Reservation und Rückstellung der Vermarktung auf einer nicht belegten Finanzierung. Platzt sie, war die Vermarktung wochenlang zurückgestellt, Zweitinteressenten sind abgewandert und die Standzeit ist gewachsen – der teuerste vermeidbare Fehler im ganzen Prozess.',
 aenderung: 'Neunstufiger Funnel mit je einem belegten Übergangskriterium. Die objektbezogene Bankbestätigung wird zum harten Kriterium für die Verhandlungsfähigkeit und zum Gate-Kriterium.',
 loesung: 'Teil E: Funnel von Lead bis Käufer mit Kriterium, Aktion, Pflichtdaten und Abbruchgrund je Stufe; fünf Funnelregeln, darunter die Pflicht zur dokumentierten Rückstufung und das Halten von Zweitinteressenten auf Stufe 7 bis zur Beurkundung. Gate 6 verlangt ausdrücklich die objektbezogene Bestätigung; eine allgemeine Kreditfähigkeitsauskunft genügt nicht.',
 phase: 'Phasen 13, 15 und 16; Gate 6; Kontrollpunkt K5',
 dokument: 'F2 Käuferqualifikation mit Pflichtstufe je Feld; Blatt Interessenten in Mappe 06',
 verantwortung: 'Makler stuft ein und begründet. Verkaufsleitung prüft die Angebotsfähigkeit bei Gate 6.'},

{nr: 'D4', titel: 'Wertrelevante Rechtsthemen ohne Grundlage im Register',
 inhalt: 'Denkmalschutz und nicht bewilligte Bauten erscheinen in Version 1 ausschliesslich als Positionen B18 und C3 der Dokumenten-Checkliste sowie als Prüffrage in Phase 4. Im Rechtsregister sind sie nicht geführt.',
 problem: 'Beide Themen sind wertbestimmend und haftungsrelevant. Ohne Registerposition fehlt die Rechtsgrundlage, die Normebene und die Praxisanweisung. Die Prüffrage in Phase 4 sagt, dass eine Planabweichung «zwingend weiterzuverfolgen» ist, aber nicht, gegen welche Grundlage, mit welcher Folge für Wohnflächenangabe und Bewertung, und wann der Prozess anzuhalten ist.',
 risiko: 'Eine nicht bewilligte Fläche wird als Wohnfläche ausgewiesen und beworben. Das ist eine unzutreffende Zusicherung (R9, R12) und kann bei Kenntnis als arglistiges Verschweigen gelten (R10). Beim Käufer entsteht ein Wiederherstellungsrisiko, bei der Bank ein Finanzierungsproblem. Beim Denkmalschutz besteht das Risiko, Umbaupotenzial zu bewerben, das nicht bewilligungsfähig ist.',
 aenderung: 'Beide Themen als eigene Registerpositionen mit Normebene, Kerninhalt und Praxisanweisung aufnehmen und mit Gate 1 verbinden.',
 loesung: 'Register R44 (nicht bewilligte Bauten und Bestandesschutz) und R45 (Denkmalschutz und Ortsbildschutz), beide mit Normebene «kantonales und kommunales Recht» und Kennzeichen [KA] [RP]. Gate 1 macht den geklärten Bewilligungsstatus zum Freigabekriterium und die ungeklärte Lage zum Stop-Kriterium. Sonderfälle S14 bis S16 führen das operative Vorgehen.',
 phase: 'Phasen 4, 5 und 6; Gate 1',
 dokument: 'Prüfbericht Recht; Blatt Register in Mappe 02',
 verantwortung: 'Makler beschafft die schriftliche Auskunft der Baubehörde. Verkaufsleitung entscheidet bei Gate 1; Rechtsberatung bei erkennbarem Risiko.'},

{nr: 'D5', titel: 'Vier-Augen-Prinzip referenziert, aber nicht definiert',
 inhalt: 'Version 1 verlangt an mehreren Stellen eine Vier-Augen-Prüfung: bei der Bewertung vor Versand, bei Dossier und Inserat gegen die Unterlagen, in der Abschlusscheckliste und in der Bewertungsmappe als Feld «Geprüft durch».',
 problem: 'Es ist nicht festgelegt, wer kontrolliert, was genau kontrolliert wird, wogegen kontrolliert wird und wie die Kontrolle nachgewiesen wird. Eine Kontrolle ohne Prüfgegenstand und ohne Nachweis ist eine Absichtserklärung. Zudem fehlt die Regelung für Einzelbesetzung, die in kleineren Einheiten der Normalfall ist.',
 risiko: 'Die Kontrolle findet faktisch nicht statt oder wird von der erstellenden Person selbst vermerkt. Damit entfällt die einzige systematische Absicherung gegen falsche Angaben in veröffentlichten Unterlagen – jener Fehlerklasse, die nach der Veröffentlichung nur noch mit Korrekturaufwand und Vertrauensverlust behebbar ist.',
 aenderung: 'Zehn verbindliche Kontrollpunkte mit Erstellendem, Kontrollierendem, Prüfgegenstand, Nachweis und Folge bei fehlender Kontrolle.',
 loesung: 'Teil I: Kontrollpunkte K1 bis K10 an Bewertung, Veröffentlichung, Preisänderung, Versand sensibler Unterlagen, Angebotsannahme, Verhandlung, Vertragsunterlagen, Notariatsfreigabe, Übergabe und Mandatsabschluss. Grundsatz: der Kontrollierende ist nie der Erstellende; bei Einzelbesetzung übernimmt die Verkaufsleitung oder eine benannte Stellvertretung. Kontrolliert wird gegen die Quelle, nicht gegen die Plausibilität. Drei zulässige Ergebnisse: freigegeben, freigegeben mit Auflage, zurückgewiesen.',
 phase: 'Phasen 8, 11, 12, 13, 15, 16, 17, 18 und 20',
 dokument: 'Kontrollvermerk je Punkt; Blatt Kontrollen in Mappe 02',
 verantwortung: 'Verkaufsleitung ist Prüfer bei sieben von zehn Punkten und verantwortet die Einhaltung.'},
];

/* ------------------------------------------------------- E-Befunde: Lücken */
const E_BEFUNDE = [
{nr: 'E1', l: 'Gate-System', w: 'Prozess läuft linear ohne verbindliche Prüfpunkte; Abschlusskriterien sind Selbstprüfung ohne Prüfer und Nachweis.', v: 'Teil B: zehn Gates mit 84 Kriterien, 37 Stop-Kriterien, Prüfer, Nachweis, Eskalation und drei Freigabeergebnissen.'},
{nr: 'E2', l: 'Sonderfallkatalog', w: 'Sonderfälle sind über Phasen und Checkliste verstreut; keine Erkennung, keine Eskalationsregel.', v: 'Teil J: 30 Sonderfälle mit Erkennung, Risiko, Abklärung, zuständiger Stelle, Dokumenten, Stop-Kriterium und Eskalation.'},
{nr: 'E3', l: 'Fehler- und Notfallmanagement', w: 'Kein Kapitel zum Vorgehen bei Fehlern. Der häufigste operative Bedarf überhaupt.', v: 'Teil J: 17 Störfälle mit Sofortmassnahme, Verantwortlichem, Information, Dokumentation, Rechtsprüfung, Eigentümerentscheid, Wiederaufnahme und Prävention.'},
{nr: 'E4', l: 'Objektstatus-Pipeline im CRM', w: 'Version 1 führt nur Interessentenstatus. Der Objektfortschritt ist nicht abbildbar.', v: 'Teil I: 17 Objektstatus mit Phase, Bedeutung und Pflichtfeldern; zehn Verlustgründe.'},
{nr: 'E5', l: 'Dokumentenarchitektur', w: 'Ordnerstruktur und Namenskonvention vorhanden, aber keine Vertraulichkeit, kein Freigabestatus, keine Versionierung, kein Verteilernachweis.', v: 'Teil I: 15 Kategorien mit Vertraulichkeitsstufe, Freigabe und Aufbewahrung; zehn Metadatenfelder; Datenraum mit Verteilernachweis.'},
{nr: 'E6', l: 'Vermarktungsstufen', w: 'Kanäle sind geordnet, aber es gibt keine Stufen. Pre-Marketing, Off-Market, Soft Launch, Remarketing und Rückzug fehlen.', v: 'Teil F: acht Stufen mit Zweck, Zielgruppe, Zeitpunkt, Kosten, Verantwortlichem, Messung und Regel; neun Kanäle mit denselben Feldern.'},
{nr: 'E7', l: 'Eigentümerreports', w: 'Kommunikationsvorlagen vorhanden, aber kein Reportsystem. Der wöchentliche Report und die Ursachenanalyse fehlen.', v: 'Teil D: 14 Dokumente V1 bis V14 mit Anlass, Zweck, Inhalt und Entscheid; sechs Fragen, die jeder Report beantwortet.'},
{nr: 'E8', l: 'Verhandlungsvorbereitung und -protokoll', w: 'Verhandlungsmasse ist beschrieben, aber Vorbereitungsrahmen und Dokumentation fehlen.', v: 'Teil E: elf Vorbereitungspunkte, zehn Protokollfelder, sechs Verhandlungsregeln.'},
{nr: 'E9', l: 'Entscheidungslogik', w: 'Version 1 sagt an kritischen Stellen «prüfen», ohne die Entscheidung zu führen.', v: 'Acht Preislogiken P1–P8, sechsschrittige GwG-Triage, 30 Sonderfälle und 17 Störfälle – alle im Muster Voraussetzung, Handlung, Alternative, Verbot.'},
{nr: 'E10', l: 'Begriffsverzeichnis', w: 'Zentrale Begriffe werden verwendet, ohne definiert zu sein: Wertspanne, Freizeichnung, Nachwirkung, harte Eigenmittel.', v: 'Teil A: 30 Begriffe mit festgelegter Bedeutung im Sinne dieses Handbuchs.'},
{nr: 'E11', l: 'TJPG und Transparenzregister', w: 'In Version 1 nicht erwähnt, obwohl per 1. Oktober 2026 in Kraft und bei juristischen Personen als Partei relevant.', v: 'Register R42 und Teil G, Abschnitt C3, mit ausdrücklicher Abgrenzung dessen, was der Makler nicht tut.'},
{nr: 'E12', l: 'PEP- und Sanktionsabklärungen', w: 'Nicht behandelt.', v: 'Teil G, Abschnitt C4, mit Arbeitsregel je Triage-Pfad und ausdrücklicher Kennzeichnung der Abhängigkeit von Unterstellung und SRO.'},
{nr: 'E13', l: 'Aufbewahrungsfristen', w: 'Teil S nennt «Aufbewahrungsfristen setzen», ohne sie zu benennen.', v: 'Teil G: neun Kategorien mit Dauer, Grund und Vertraulichkeitsstufe; Registerposition R46 zur handelsrechtlichen Untergrenze.'},
{nr: 'E14', l: 'Interessenkonflikte', w: 'Doppelmäkelei ist behandelt, weitere Konflikte nicht: eigene Kaufabsicht, nahestehende Personen, Beteiligungen, Doppelmandat.', v: 'Sonderfall S30 mit Offenlegungs- und Zustimmungspflicht; Registerposition R43 zur Treuepflicht.'},
{nr: 'E15', l: 'Falltests', w: 'Das System wurde nicht gegen reale Fallverläufe geprüft.', v: 'Teil K: zehn Falltests mit Prozessverlauf, Entscheidungen, Gates, Eskalationen und Ergebnis; die dabei gefundenen Lücken sind eingearbeitet.'},
];

/* ------------------------------------------------- F-Befunde: Redundanzen */
const F_BEFUNDE = [
{nr: 'F1', r: 'Objektaufnahme doppelt', w: 'Alle 182 Felder stehen im Handbuch (Teil E) und in Arbeitsmappe 07.',
 m: 'Im Handbuch nur Blockstruktur, Erfassungsregeln und die kritischen Felder; die Feldliste bleibt der Arbeitsmappe. Kein Informationsverlust – gearbeitet wird ohnehin in der Mappe.'},
{nr: 'F2', r: 'Formulare doppelt', w: 'Interessentenformular, Übergabeprotokoll und Notariatscheckliste stehen vollständig im Handbuch und in Dokument 03.',
 m: 'Im Handbuch Zweck, Struktur in Blöcken und die Prüfpunkte; die ausfüllbare Fassung bleibt in Dokument 03.'},
{nr: 'F3', r: 'Vorlagenübersicht doppelt', w: 'Teil T listet die 20 Kommunikationsvorlagen, die in Dokument 05 nochmals mit derselben Tabelle beginnen.',
 m: 'Eine Übersicht im Handbuch mit Verweis; Dokument 05 beginnt direkt mit den Vorlagen.'},
{nr: 'F4', r: 'Prozessübersicht doppelt', w: 'Teil A4 zeigt alle 20 Phasen als Tabelle, Teil V dieselbe Abfolge als Flow über zwei Seiten.',
 m: 'Flow auf eine Seite verdichtet und um die Gates ergänzt – dadurch wird er zum eigenständigen Steuerungsbild statt zur Wiederholung.'},
{nr: 'F5', r: 'Abschlusskriterien und Gate-Kriterien überschneiden sich', w: 'Die «Weiter wenn»-Kriterien der Phasen 6, 10, 11, 15 und 17 wiederholen sich in den Gate-Kriterien.',
 m: 'Kriterien einmal im Gate, in der Phase nur der Verweis auf das Gate. Verhindert, dass zwei Listen auseinanderlaufen.'},
{nr: 'F6', r: 'Rechtshinweise mehrfach ausformuliert', w: 'Der Hinweis zur Formungültigkeit der Reservation steht in Phase 15, Phase 17, Teil M, Teil O und Teil T.',
 m: 'Einmal vollständig in Teil G mit Registerbezug, an den übrigen Stellen der Verweis R2. Der Hinweis bleibt an allen Stellen sichtbar, aber nur an einer pflegbar.'},
];

/* -------------------------------------------- Schlussaudit Version 2 */
const SCHLUSSAUDIT = [
{d: 'Fachlichkeit', e: 'erfüllt', b: 'Phasenraster mit 18 Feldern, Gates, Kontrollpunkte und Entscheidungslogiken bilden einen steuerbaren Prozess. Die V1-Fachteile sind erhalten.'},
{d: 'Schweizer Praxis', e: 'erfüllt', b: 'Kantonale Klärungsliste, Notariats- und Grundbuchschnittstelle, Steuersicherstellung, GEAK-Pflichtkantone, Selbstregulierung der Banken – durchgehend auf den Schweizer Ablauf bezogen.'},
{d: 'Recht', e: 'teilweise erfüllt', b: '46 Registerpositionen mit Normebene und Praxisanweisung. Einschränkung: Fedlex und die Bundesstellen waren nicht erreichbar; die Aussagen zu revGwG und TJPG beruhen auf Fachpublikationen und sind als solche gekennzeichnet. Verifikation gegen die Primärquellen steht aus.'},
{d: 'Compliance', e: 'teilweise erfüllt', b: 'Triage, Pfade, TJPG, PEP und Aufbewahrung sind operativ ausgearbeitet. Die grundsätzliche Unterstellungsfrage ist aus Sekundärquellen nicht auflösbar und ausdrücklich der Rechtsabteilung und der SRO zugewiesen.'},
{d: 'Bewertung', e: 'erfüllt', b: 'Drei Methoden, sechs Preisbegriffe, zwölf Einflussfaktoren mit Quelle, Plausibilitätsprüfungen, Gate 3 zur Datengrundlage, Rechenmappe mit Formeln.'},
{d: 'Preissteuerung', e: 'erfüllt', b: '14 Indikatoren, acht Entscheidungslogiken, achtstufiger Änderungsablauf mit Vier-Augen-Prüfung. Die starre Fristenregel von V1 ist entfernt.'},
{d: 'Verkauf und Vermarktung', e: 'erfüllt', b: 'Acht Vermarktungsstufen, neun Kanäle mit Erfolgsmessung, Release-Checkliste, Gate 4 und Gate 5.'},
{d: 'Käufermanagement', e: 'erfüllt', b: 'Neunstufiger Funnel mit belegten Kriterien, Käuferprofil mit 30 Feldern und Pflichtstufe, harte Finanzierungsanforderung in Gate 6.'},
{d: 'Verhandlung', e: 'erfüllt', b: 'Vorbereitungsrahmen, Gate 7 als Freigabe der Verhandlungskompetenz, Protokollstruktur, sechs Regeln, Verfahren bei mehreren Angeboten.'},
{d: 'Eigentümermanagement', e: 'erfüllt', b: '14 Reports mit Anlass und Entscheid, sechs Leitfragen, Trennung von Darstellung und Entscheid durchgehend beim Eigentümer.'},
{d: 'CRM', e: 'erfüllt', b: '17 Objektstatus, 11 Aktivitätsfelder, 12 Tageslistenkategorien einschliesslich der Frage, was heute nicht vergessen werden darf.'},
{d: 'Dokumentenmanagement', e: 'erfüllt', b: '15 Kategorien mit Vertraulichkeit und Aufbewahrung, 10 Metadatenfelder, Datenraum mit Verteilernachweis, Versionierungsregel.'},
{d: 'Datenschutz', e: 'erfüllt', b: 'Rollen, Rechtsgrundlage je Datenkategorie, Weitergabe, Auskunftsrecht mit Folge für CRM-Einträge, Löschfristen als Pflichtfeld, Bildrechte, Störfall T16.'},
{d: 'Qualitätssicherung', e: 'erfüllt', b: 'Zehn Gates, zehn Kontrollpunkte, drei Freigabeergebnisse, Nachweispflicht je Kontrolle, Bau bricht bei fehlerhaften Querverweisen ab.'},
{d: 'Sonderfälle', e: 'erfüllt', b: '30 Fälle mit Erkennungszeitpunkt, Stop-Kriterium und Eskalation; alle im Auftrag genannten Fälle abgedeckt.'},
{d: 'Notariat und Übergabe', e: 'erfüllt', b: 'Gates 8 bis 10, Notariatscheckliste vor und nach der Beurkundung, Unterscheidung der drei Zeitpunkte, Übergabeprotokoll mit Quittierung.'},
{d: 'Fehlerbehandlung', e: 'erfüllt', b: '17 Störfälle mit vollständigem Ablauf und Präventionsbezug auf das Gate oder den Kontrollpunkt, der den Fall verhindert.'},
{d: 'Skalierbarkeit', e: 'teilweise erfüllt', b: 'Rollen, Gates und Kontrollpunkte sind auf mehrere Bearbeiter ausgelegt; Einzelbesetzung ist geregelt. Nicht geleistet: Mengensteuerung über mehrere Mandate hinweg – Portfolio- und Auslastungssicht fehlen und wären Gegenstand einer Version 3.'},
];

const RESTRISIKEN = [
  'Rechtsstand: Die Aussagen zu revGwG und TJPG beruhen auf Fachpublikationen vom Juli bis September 2026, nicht auf dem Verordnungstext. Fedlex und die Bundesstellen waren aus der Arbeitsumgebung nicht erreichbar. Vor dem produktiven Einsatz sind diese Abschnitte gegen die Primärquellen zu verifizieren.',
  'Widersprüchliche Sekundärquellen: Ob eine reine Vermittlungstätigkeit ohne Mitwirkung an der Finanztransaktion die Unterstellung auslöst, wird unterschiedlich beurteilt. Die Triage behandelt diesen Fall vorsorglich, löst die Rechtsfrage aber nicht.',
  'Vertragsvorlagen: Teil G bleibt eine Strukturvorgabe. Mandat, Kaufangebot und Reservationsbestätigung sind vor der ersten Verwendung juristisch zu prüfen und danach unverändert einzusetzen.',
  'Kantonale Angaben: Das Handbuch enthält bewusst keine kantonalen Zahlen, Sätze oder Fristen. Ohne ausgefüllte Klärungsliste A6 ist es je Kanton unvollständig.',
  'Interne Vorgaben: Provisionssätze, Löschfristen, Aufbewahrungsdauern, Budgetgrenzen und das GwG-Weisungswesen sind als «interne Vorgabe definieren» gekennzeichnet und vom Unternehmen festzulegen.',
];

module.exports = {SCHLUESSEL, METHODE, BEWERTUNG, D_BEFUNDE, E_BEFUNDE,
  F_BEFUNDE, SCHLUSSAUDIT, RESTRISIKEN};
