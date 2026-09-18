/* Formulare F1 bis F9 sowie der Erstgesprächsleitfaden und die
   Ableitung der Verkaufsstrategie.
   Einzige Quelle – Handbuch (Teile D, L, M, N, O, P, Q) und Dokument 03. */

/* ---------------------------------- Teil D · Erstgesprächsleitfaden (F1) */
/* frage: zu stellende Frage · warum: weshalb sie gestellt wird · folge: was die
   Antwort für das Vorgehen bedeutet */
const ERSTGESPRAECH = [
{block: '1 · Eigentümer und Verfügungsbefugnis', fragen: [
 {frage: 'Wer ist im Grundbuch als Eigentümer eingetragen?', warum: 'Nur eingetragene Eigentümer können verkaufen.', folge: 'Abweichung zur auftretenden Person zwingend klären, bevor weitergearbeitet wird.'},
 {frage: 'Gibt es mehrere Eigentümer? In welcher Form – Mit- oder Gesamteigentum?', warum: 'Bestimmt, wer unterschreiben muss.', folge: 'Bei Gesamteigentum können nur alle gemeinsam verfügen.'},
 {frage: 'Wer entscheidet über den Verkauf? Wer muss zustimmen?', warum: 'Entscheidungsträger und Eigentümer sind nicht immer identisch.', folge: 'Alle Entscheidungsträger in den Prozess einbeziehen, sonst scheitert das Mandat später.'},
 {frage: 'Sind Sie verheiratet oder in eingetragener Partnerschaft? Welcher Güterstand?', warum: 'Über die Wohnung der Familie kann nur mit Zustimmung des anderen verfügt werden.', folge: 'Zustimmung schriftlich einholen.'},
 {frage: 'Ist die Liegenschaft die Wohnung der Familie?', warum: 'Löst besondere Zustimmungserfordernisse aus.', folge: 'Zustimmung dokumentieren.'},
 {frage: 'Handelt es sich um einen Erbgang? Wenn ja: Wer sind alle Erben?', warum: 'Erben bilden Gesamteigentum und verfügen gemeinsam.', folge: 'Erbbescheinigung und Ausweise aller Erben; oder Erbenvertretung.'},
 {frage: 'Besteht eine Beistandschaft oder eine Vorsorgevollmacht?', warum: 'Für Grundstückgeschäfte einer verbeiständeten Person ist die Zustimmung der Erwachsenenschutzbehörde erforderlich.', folge: 'Zustimmung vor Vermarktungsstart beschaffen.'},
 {frage: 'Ist eine Trennung oder Scheidung im Gang?', warum: 'Preis- und Terminentscheide werden dadurch oft blockiert.', folge: 'Vereinbarung beschaffen; Zustimmung beider klären.'},
 {frage: 'Ist die Eigentümerschaft eine juristische Person?', warum: 'Zeichnungsberechtigung und wirtschaftlich berechtigte Person sind festzustellen.', folge: 'Handelsregisterauszug und Formular zur wirtschaftlich berechtigten Person.'},
]},
{block: '2 · Verkaufsgrund und Dringlichkeit', fragen: [
 {frage: 'Warum möchten Sie verkaufen?', warum: 'Der Grund bestimmt Preisflexibilität, Terminspielraum und Verhandlungsverhalten.', folge: 'Offen formulieren und zuhören, nicht bewerten.'},
 {frage: 'Warum jetzt und nicht in einem Jahr?', warum: 'Deckt auf, ob ein Auslöser besteht oder eine allgemeine Absicht.', folge: 'Ohne Auslöser ist der Zeithorizont unzuverlässig – im CRM als Wertneugier markieren.'},
 {frage: 'Gibt es einen zeitlichen Druck? Woraus ergibt er sich konkret?', warum: 'Echter Druck lässt sich an einem Ereignis festmachen: Kaufvertrag eines Ersatzobjekts, Kündigung, Erbteilung, Finanzierungsablauf.', folge: 'Ohne benennbares Ereignis ist der Druck verhandlungstaktisch.'},
 {frage: 'Ist der Verkauf zwingend oder eine Option?', warum: 'Bestimmt, ob ein Verkauf zu einem Marktpreis überhaupt akzeptiert wird.', folge: 'Bei blosser Option Abbruchrisiko im CRM festhalten.'},
 {frage: 'Was passiert, wenn die Liegenschaft nicht verkauft wird?', warum: 'Zeigt die tatsächliche Alternative des Eigentümers.', folge: 'Bestimmt die realistische Preisuntergrenze.'},
 {frage: 'Haben Sie schon einmal versucht zu verkaufen?', warum: 'Vorgeschichte, frühere Angebotspreise und Marktreaktionen sind wertvoll.', folge: 'Frühere Inserate recherchieren; ein Objekt mit Vorgeschichte braucht eine andere Strategie.'},
]},
{block: '3 · Zeitplan', fragen: [
 {frage: 'Wann soll der Verkauf abgeschlossen sein?', warum: 'Bestimmt Vermarktungsform und Preisstrategie.', folge: 'Realistische Dauer gegenüberstellen: Vorbereitung, Vermarktung, Beurkundung, Eintragung.'},
 {frage: 'Wann soll die Liegenschaft frei werden?', warum: 'Der Übergabetermin ist ein zentrales Verhandlungselement.', folge: 'Spielraum ausloten; Flexibilität ist oft mehr wert als Preisnachlass.'},
 {frage: 'Haben Sie schon ein Ersatzobjekt? Bis wann brauchen Sie es?', warum: 'Verkettete Termine sind das häufigste Zeitrisiko.', folge: 'Bei gekoppelten Geschäften Reihenfolge und Zwischenfinanzierung mit der Bank klären.'},
 {frage: 'Gibt es Zeiträume, in denen keine Besichtigungen möglich sind?', warum: 'Vermarktungsplanung.', folge: 'Im Zeitplan berücksichtigen.'},
 {frage: 'Wann läuft Ihre Hypothek ab?', warum: 'Der Ablauftermin kann die Vorfälligkeitsentschädigung vermeiden oder verursachen.', folge: 'Ablösekonditionen bei der Bank einholen, bevor der Verkaufstermin fixiert wird.'},
]},
{block: '4 · Objekt', fragen: [
 {frage: 'In welchem Zustand ist die Liegenschaft aus Ihrer Sicht?', warum: 'Die Selbsteinschätzung zeigt, wie weit Erwartung und Zustand auseinanderliegen.', folge: 'Mit der eigenen Aufnahme abgleichen; grosse Abweichungen früh ansprechen.'},
 {frage: 'Welche Renovationen haben Sie durchgeführt? In welchem Jahr, mit welchen Kosten?', warum: 'Grundlage für Bewertung und Grundstückgewinnsteuer.', folge: 'Belege einfordern – ohne Rechnung keine steuerliche Anrechnung.'},
 {frage: 'Welche Mängel und bekannten Probleme gibt es?', warum: 'Offenlegungspflicht; die Freizeichnung im Kaufvertrag schützt nur bei vollständiger Offenlegung.', folge: 'Mängelliste eröffnen und vom Eigentümer unterzeichnen lassen.'},
 {frage: 'Gibt es Wasserschäden, Feuchtigkeit oder Schimmel – auch früher behoben?', warum: 'Häufigster Streitpunkt nach dem Verkauf.', folge: 'In die Mängelliste, auch wenn behoben.'},
 {frage: 'Sind alle Umbauten bewilligt?', warum: 'Nicht bewilligte Bauten sind ein erhebliches Risiko.', folge: 'Bewilligungen beschaffen oder Bestand im Gemeindearchiv klären.'},
 {frage: 'Gibt es laufende Projekte, Bewilligungen oder Verpflichtungen?', warum: 'Offene Vorhaben binden den Käufer oder eröffnen Chancen.', folge: 'Unterlagen und Geltungsdauer beschaffen.'},
 {frage: 'Bestehen Dienstbarkeiten, Wegrechte oder Nutzungsvereinbarungen mit Nachbarn?', warum: 'Belasten das Grundstück dinglich und gehen auf den Erwerber über.', folge: 'Grundbuchbelege beschaffen; gelebte Praxis erfragen und festhalten.'},
 {frage: 'Gibt es Streitigkeiten mit Nachbarn oder Behörden?', warum: 'Offenlegungspflichtig und preisrelevant.', folge: 'Unterlagen beschaffen und Rechtsberatung einbeziehen.'},
 {frage: 'Ist ein Teil vermietet – Einliegerwohnung, Garage, Parkplatz?', warum: 'Mietverhältnisse gehen auf den Erwerber über.', folge: 'Mietverträge, Depots und Nebenkostenabrechnungen beschaffen.'},
 {frage: 'War auf dem Grundstück früher ein Gewerbe, ein Öltank oder eine Auffüllung?', warum: 'Hinweis auf einen belasteten Standort.', folge: 'Katasterauszug einholen.'},
 {frage: 'Was schätzen Sie an dieser Liegenschaft am meisten?', warum: 'Liefert die glaubwürdigsten Verkaufsargumente.', folge: 'Wörtlich notieren und in die Dossiertexte übernehmen.'},
 {frage: 'Was würden Sie ändern, wenn Sie bleiben würden?', warum: 'Deckt Schwächen auf, die der Eigentümer sonst nicht nennt.', folge: 'In die Mängel- und Sanierungsliste übernehmen.'},
]},
{block: '5 · Preis und Erwartungen', fragen: [
 {frage: 'Welche Preisvorstellung haben Sie?', warum: 'Ausgangspunkt jedes weiteren Gesprächs.', folge: 'Notieren, nicht kommentieren und keine Gegenzahl nennen.'},
 {frage: 'Wie sind Sie zu dieser Vorstellung gekommen?', warum: 'Unterscheidet begründete Erwartung von Wunschdenken.', folge: 'Bei Online-Schätzung oder Nachbarschaftsgerücht auf die Bewertung verweisen.'},
 {frage: 'Liegen andere Bewertungen oder Schätzungen vor?', warum: 'Konkurrierende Zahlen prägen die Erwartung.', folge: 'Einsicht erbitten; Methode und Datum prüfen.'},
 {frage: 'Welchen Betrag müssen Sie mindestens erzielen? Woraus ergibt sich dieser?', warum: 'Meist bestimmt durch Hypothekenablösung und Ersatzobjekt.', folge: 'Intern festhalten, niemals gegenüber Interessenten nennen.'},
 {frage: 'Wissen Sie, was nach Abzug aller Kosten bei Ihnen bleibt?', warum: 'Die meisten Eigentümer rechnen brutto und unterschätzen Steuer und Ablösekosten.', folge: 'Nettoerlösrechnung für die Bewertungsbesprechung vorbereiten.'},
 {frage: 'Haben Sie die Grundstückgewinnsteuer berücksichtigt?', warum: 'Kantonal geregelt und oft erheblich.', folge: 'Eigentümer zur Schätzung beim Steueramt auffordern; der Makler rechnet nicht.'},
 {frage: 'Was erwarten Sie von uns als Makler?', warum: 'Deckt unausgesprochene Erwartungen auf.', folge: 'Leistungsumfang abgrenzen; nicht Geschuldetes klar benennen.'},
 {frage: 'Sprechen Sie mit weiteren Maklern?', warum: 'Bestimmt Vorgehen und Mandatsform.', folge: 'Bei bestehendem Exklusivmandat kein paralleles Mandat.'},
 {frage: 'Wie möchten Sie vermarkten – offen oder diskret?', warum: 'Diskretion reduziert die Reichweite und damit meist den Preis.', folge: 'Konsequenz offen benennen und Entscheid protokollieren.'},
]},
{block: '6 · Prozess und nächste Schritte', fragen: [
 {frage: 'Kennen Sie den Ablauf eines Hausverkaufs in der Schweiz?', warum: 'Fehlende Kenntnis der Beurkundungspflicht führt zu falschen Erwartungen.', folge: 'Prozessübersicht erklären: Unterlagen, Bewertung, Vermarktung, Notariat, Grundbuch, Übergabe.'},
 {frage: 'Ist Ihnen bewusst, dass Sie nach dem Verkauf für Mängel weiter haften?', warum: 'Bei Gebäuden gilt eine Frist von fünf Jahren seit Eigentumserwerb.', folge: 'Begründet die Notwendigkeit der vollständigen Mängelliste.'},
 {frage: 'Können Sie die Unterlagen bis [Datum] bereitstellen?', warum: 'Fehlende Unterlagen sind der häufigste Grund für Verzögerungen.', folge: 'Unterlagenliste mit Fristen und Zuständigkeiten übergeben.'},
 {frage: 'Wann passt Ihnen die Objektaufnahme? Sie dauert zwei bis drei Stunden.', warum: 'Konkreter nächster Schritt statt unverbindlichem Abschluss.', folge: 'Termin im Gespräch fixieren.'},
]},
];

/* Ableitung der Verkaufsstrategie aus dem Erstgespräch */
const STRATEGIE = [
{lage: 'Hoher, an ein Ereignis gebundener Zeitdruck; Ersatzobjekt bereits gekauft',
 empfehlung: 'Angebotspreis am unteren Rand der Wertspanne, offene Vermarktung auf allen Kanälen, Sammelbesichtigungen, Angebotsfrist mit festem Termin.',
 begruendung: 'Nachfrage wird bewusst gebündelt, um in kurzer Zeit mehrere Angebote zu erhalten. Der tiefere Angebotspreis wird häufig durch die Bietsituation aufgeholt; entscheidend ist die Termin­sicherheit.'},
{lage: 'Kein Zeitdruck, Preis hat Vorrang, Objekt in gutem Zustand',
 empfehlung: 'Angebotspreis in der oberen Hälfte der Spanne, Einzelbesichtigungen, längerer Vermarktungshorizont, keine Preisreduktion vor Ablauf von zwölf Wochen.',
 begruendung: 'Ohne Termindruck kann auf den passenden Käufer gewartet werden. Voraussetzung ist die schriftliche Zusage des Eigentümers, Preisreduktionen nicht vorzeitig zu verlangen – eine frühe Reduktion signalisiert dem Markt Schwäche.'},
{lage: 'Erheblicher Sanierungsbedarf, Objekt nicht bezugsfertig',
 empfehlung: 'Angebotspreis mit ausgewiesenem Sanierungsabzug, Zielgruppe Umbauwillige und Handwerkerkäufer, Sanierungsbedarf im Dossier bauteilweise offenlegen, gegebenenfalls Zustandsanalyse beilegen.',
 begruendung: 'Verschwiegener Sanierungsbedarf führt zu überhöhten Erwartungen, Abbrüchen nach der Besichtigung und Preisabschlägen aus Misstrauen. Eine belegte Kostenschätzung begrenzt den Abschlag auf das sachlich Begründete.'},
{lage: 'Erbengemeinschaft mit mehreren Beteiligten',
 empfehlung: 'Vor Vermarktungsstart eine Ansprechperson und eine schriftliche Entscheidungsregel festlegen; Angebotspreis in der Mitte der Spanne; sämtliche Informationen gleichzeitig an alle Erben.',
 begruendung: 'Verkäufe in Erbengemeinschaften scheitern häufiger an der internen Entscheidfindung als am Markt. Gleichbehandlung aller Erben und eine vorab definierte Entscheidungsregel verhindern Blockaden bei Angebotseingang.'},
{lage: 'Preisvorstellung deutlich über der Wertspanne, Eigentümer nicht beweglich',
 empfehlung: 'Mandat nur mit befristeter Testphase von sechs bis acht Wochen zum Wunschpreis und schriftlich vereinbartem Anpassungsmechanismus bei definierten Auslösekriterien – oder Mandat ablehnen.',
 begruendung: 'Ein überhöhter Angebotspreis verbrennt die wichtigste Vermarktungsphase und erzeugt eine Standzeit, die später Preisabschläge erzwingt. Ein vorab vereinbarter Anpassungsmechanismus macht den Entscheid an Kriterien fest statt an Stimmungen.'},
{lage: 'Diskretion gewünscht, etwa wegen Nachbarschaft, Trennung oder Geschäftslage',
 empfehlung: 'Vermarktung ausschliesslich über die eigene Interessentendatenbank und ausgewählten Direktversand, kein Portal, kein Schild, Adresse nicht veröffentlicht, Objekt nur nach Vertraulichkeitszusage zeigen.',
 begruendung: 'Diskretion kostet Reichweite und damit in der Regel Preis oder Zeit. Der Eigentümer muss diesen Zusammenhang schriftlich zur Kenntnis nehmen, damit die Erwartung später nicht am Ergebnis scheitert.'},
{lage: 'Objekt mit Vorgeschichte: bereits erfolglos am Markt gewesen',
 empfehlung: 'Vollständige Neuaufstellung – neue Fotografie, neue Grundrisse, neue Texte, Wartezeit von mindestens drei Monaten seit der letzten Veröffentlichung; Angebotspreis nach aktueller Bewertung, nicht am alten Preis orientiert.',
 begruendung: 'Wiedererkennbare Inserate reaktivieren die alten Ablehnungsgründe. Suchende erkennen dieselben Bilder und schliessen auf ein unverkäufliches Objekt; nur ein sichtbar neuer Auftritt stellt die Ausgangslage wieder her.'},
{lage: 'Rechtliche Unklarheit: fehlende Bewilligung, ungeklärte Dienstbarkeit, Eintrag im Kataster belasteter Standorte',
 empfehlung: 'Vermarktung erst nach Klärung; bis dahin kein Inserat. Ist eine Klärung nicht möglich, Sachverhalt im Dossier offenlegen und im Preis abbilden.',
 begruendung: 'Ungeklärte Rechtslagen führen zum Abbruch in der Beurkundungsphase – dem teuersten Zeitpunkt für alle Beteiligten. Frühe Klärung ist günstiger als eine gescheiterte Beurkundung.'},
];

/* -------------------------------------------- Teil L · Besichtigung (F2, F3) */
const INTERESSENTENFORMULAR = [
{block: 'Kontakt', felder: ['Name und Vorname', 'Weitere Kaufinteressenten mit Namen',
  'Adresse', 'Telefon', 'E-Mail', 'Datum der Besichtigung']},
{block: 'Haushalt', felder: ['Anzahl Personen, die einziehen', 'davon Kinder mit Alter',
  'Haustiere']},
{block: 'Aktuelle Wohnsituation', felder: ['Miete oder Eigentum',
  'Bei Eigentum: muss die jetzige Liegenschaft verkauft werden – ja oder nein',
  'Bei Miete: Kündigungsfrist und frühestmöglicher Auszug',
  'Bisherige Suchdauer']},
{block: 'Erwerbsrechtliche Angaben', felder: ['Staatsangehörigkeit aller Käufer',
  'Wohnsitz in der Schweiz – ja oder nein',
  'Bei ausländischer Staatsangehörigkeit: Ausländerstatus und Ausweiskategorie',
  'Vorgesehene Nutzung: Erstwohnsitz, Zweitwohnsitz, Vermietung']},
{block: 'Finanzierung', felder: ['Finanzierung geklärt: nein / in Abklärung / schriftliche Bestätigung liegt vor',
  'Finanzierende Bank', 'Eigenmittel total in CHF',
  'davon aus Vorsorgeguthaben der zweiten Säule in CHF',
  'davon aus Säule 3a in CHF',
  'Liegt eine objektbezogene Finanzierungsbestätigung vor – ja oder nein',
  'Bis wann kann eine Bestätigung beigebracht werden']},
{block: 'Kaufabsicht', felder: ['Interesse: hoch / mittel / gering / keines',
  'Gewünschter Übergabetermin', 'Frühestmöglicher Übergabetermin',
  'Interesse am angebotenen Inventar',
  'Beabsichtigte Umbauten oder Erweiterungen',
  'Bedingungen oder Vorbehalte für ein Kaufangebot']},
{block: 'Weitere Bemerkungen', felder: ['Offene Fragen des Interessenten',
  'Bedenken zum Objekt', 'Vereinbarter nächster Schritt mit Datum']},
{block: 'Bestätigungen', felder: ['Verkaufsdossier erhalten am',
  'Datenschutzerklärung erhalten und zur Kenntnis genommen',
  'Einwilligung zur Bearbeitung der Angaben für die Abwicklung dieses Kaufinteresses',
  'Ort, Datum und Unterschrift']},
];

const BESICHTIGUNG_CHECKLISTE = [
{block: 'Vorbereitung, am Vortag', punkte: [
  'Termin mit dem Eigentümer bestätigt und Abwesenheit abgesprochen',
  'Alle Schlüssel vorhanden und geprüft: Haustür, Keller, Estrich, Garage, Nebengebäude',
  'Interessent qualifiziert und erwerbsrechtliche Zulässigkeit geklärt',
  'Verkaufsdossier vorab versandt und Empfang bestätigt',
  'Unterlagen bereit: Dossier, Grundrisse, Interessentenformular, Mängelliste, Visitenkarte',
  'Antworten auf die drei wahrscheinlichsten kritischen Fragen vorbereitet']},
{block: 'Vor Ort, 20 Minuten vor dem Termin', punkte: [
  'Alle Räume aufgeschlossen, auch Keller, Estrich, Technikraum und Garage',
  'Licht in allen Räumen eingeschaltet, Storen hochgezogen',
  'Gelüftet, Heizung auf angenehme Temperatur',
  'Zugänge frei, Schuhwerk und persönliche Gegenstände weggeräumt',
  'Aussenbereich kontrolliert: Zufahrt frei, keine Fahrzeuge vor dem Haus']},
{block: 'Führung', punkte: [
  'Begrüssung, Ausweis- und Namenskontrolle, Dauer und Ablauf ankündigen',
  'Feste Reihenfolge: Aussenansicht, Eingang, Wohnbereich, Küche, Schlafbereich, Nassräume, Nebenräume, Technik, Aussenbereich',
  'Flächen und Baujahre nur nennen, wenn sie belegt sind',
  'Bekannte Mängel aktiv ansprechen, nicht abwarten, ob sie auffallen',
  'Sanierungsbedarf mit Zeithorizont benennen',
  'Keine Aussagen zu Bauzulässigkeit, Steuerfolgen oder Finanzierung – an die zuständige Stelle verweisen',
  'Fragen notieren, die nicht sicher beantwortet werden können, und schriftlich nachliefern']},
{block: 'Abschluss', punkte: [
  'Interessentenformular vollständig ausfüllen lassen',
  'Nächsten Schritt konkret vereinbaren, mit Datum',
  'Weiteres Vorgehen bei Kaufinteresse erklären: schriftliches Angebot, Finanzierungsbestätigung, unverbindlich bis zur Beurkundung',
  'Rückmeldung innerhalb von 48 Stunden ankündigen']},
{block: 'Nachbereitung, am gleichen Tag', punkte: [
  'Alle Räume abgeschlossen, Licht gelöscht, Fenster geschlossen',
  'Besichtigungsprotokoll erstellt, einschliesslich Vermerk der offengelegten Mängel',
  'CRM aktualisiert: Status, Interesse, nächste Aktion mit Datum',
  'Offene Fragen schriftlich beantwortet',
  'Eigentümer kurz informiert']},
];

/* --------------------------------------------- Teil M · Kaufangebot (F4) */
const KAUFANGEBOT = [
{block: '1 · Kaufinteressent', bindung: 'Angabe',
 felder: ['Name und Vorname aller Kaufinteressenten', 'Geburtsdatum', 'Zivilstand',
  'Adresse', 'Telefon und E-Mail', 'Staatsangehörigkeit',
  'Wohnsitz in der Schweiz und Ausländerstatus',
  'Vorgesehene Eigentumsform und Quoten']},
{block: '2 · Objekt', bindung: 'Angabe',
 felder: ['Adresse', 'Gemeinde und Kanton', 'Grundbuchblatt', 'Parzellennummer',
  'Grundstücksfläche gemäss Grundbuchauszug', 'Objektbezeichnung']},
{block: '3 · Angebotspreis', bindung: 'unverbindlich',
 felder: ['Angebotspreis für die Liegenschaft in CHF', 'Angebot für das Inventar in CHF',
  'Total in CHF', 'Angebotspreis in Worten']},
{block: '4 · Übergabe', bindung: 'unverbindlich',
 felder: ['Gewünschter Übergabetermin', 'Frühestmöglicher Übergabetermin',
  'Spätestmöglicher Übergabetermin', 'Gewünschter Nutzen- und Gefahrenübergang']},
{block: '5 · Finanzierung', bindung: 'Angabe',
 felder: ['Finanzierende Bank', 'Eigenmittel total in CHF',
  'davon aus Vorsorgeguthaben in CHF', 'Hypothekarbetrag in CHF',
  'Liegt eine objektbezogene Finanzierungsbestätigung bei – ja oder nein',
  'Datum und Gültigkeit der Bestätigung', 'Vorbehalte der Bank']},
{block: '6 · Bedingungen und Vorbehalte', bindung: 'unverbindlich',
 felder: ['Finanzierungsvorbehalt – ja oder nein, bis wann geklärt',
  'Verkauf einer eigenen Liegenschaft als Bedingung – ja oder nein',
  'Vorbehalt einer Bauexpertise oder eines Gutachtens – bis wann',
  'Vorbehalt einer behördlichen Bewilligung – welche',
  'Weitere Bedingungen',
  'Gewünschte Regelungen im Kaufvertrag']},
{block: '7 · Gültigkeit', bindung: 'unverbindlich',
 felder: ['Dieses Angebot gilt bis einschliesslich [Datum], [Zeit]',
  'Danach erlischt es ohne weitere Mitteilung']},
{block: '8 · Kenntnisnahme durch den Kaufinteressenten', bindung: 'Erklärung',
 felder: [
  'Ich habe das Verkaufsdossier und die Mängelliste erhalten und zur Kenntnis genommen.',
  'Ich habe die Liegenschaft am [Datum] besichtigt.',
  'Mir ist bekannt, dass ein Kaufvertrag über eine Liegenschaft in der Schweiz nur durch öffentliche Beurkundung zustande kommt und dass dieses Angebot keine Verpflichtung zum Kauf begründet.',
  'Mir ist bekannt, dass auch die Verkäuferschaft durch dieses Angebot und dessen Annahme nicht zum Verkauf verpflichtet wird.',
  'Ich habe die Datenschutzerklärung erhalten und bin mit der Bearbeitung meiner Angaben zur Abwicklung dieses Kaufinteresses einverstanden.',
  'Meine Angaben sind vollständig und wahrheitsgemäss.']},
{block: '9 · Unterschriften', bindung: 'Angabe',
 felder: ['Ort und Datum', 'Unterschrift aller Kaufinteressenten',
  'Eingang beim Makler am [Datum], [Zeit]',
  'Weitergeleitet an die Verkäuferschaft am [Datum]']},
];

/* ---------------------------- Teil N · Angebotsvergleich, Entscheidungsvorlage (F5) */
const ANGEBOTSVERGLEICH = [
'Angebotsnummer und Eingangsdatum',
'Kaufinteressent',
'Angebotspreis Liegenschaft',
'Angebot Inventar',
'Total',
'Abweichung zum Angebotspreis in Prozent',
'Geschätzter Nettoerlös für die Verkäuferschaft',
'Finanzierungsnachweis: fehlt / Selbstauskunft / Bankbestätigung objektbezogen',
'Anteil harte Eigenmittel',
'Finanzierungsvorbehalt',
'Bedingung Verkauf eigener Liegenschaft',
'Weitere Bedingungen und Vorbehalte',
'Gewünschter Übergabetermin und Abweichung zum Wunsch des Eigentümers',
'Erwerbsrechtliche Bewilligung erforderlich',
'Identifikation nach GwG abgeschlossen',
'Gültigkeit des Angebots',
'Einschätzung der Abschlusswahrscheinlichkeit: hoch / mittel / gering, mit Begründung',
'Wesentliche Risiken der Abwicklung',
];

const ENTSCHEIDUNGSVORLAGE = [
{block: 'Ausgangslage',
 inhalt: 'Objekt, Angebotspreis, Tage am Markt, Anzahl Anfragen, Besichtigungen und Angebote, wesentliche Rückmeldungen und Ablehnungsgründe.'},
{block: 'Angebotsvergleich',
 inhalt: 'Tabelle aller Angebote nach den Kriterien des Angebotsvergleichs, ohne Wertung.'},
{block: 'Nettoerlös je Angebot',
 inhalt: 'Je Angebot: Kaufpreis abzüglich Hypothekenablösung, allfälliger Vorfälligkeitsentschädigung, geschätzter Grundstückgewinnsteuer, Notariats- und Grundbuchgebühren, Handänderungsabgabe nach kantonaler Regelung, Honorar zuzüglich Mehrwertsteuer. Gleiche Annahmen für alle Angebote; Annahmen offenlegen.'},
{block: 'Abwicklungssicherheit',
 inhalt: 'Je Angebot eine sachliche Einschätzung: Qualität des Finanzierungsnachweises, Zahl und Art der Bedingungen, Terminrisiken, Bewilligungserfordernisse. Kein Werturteil über Personen.'},
{block: 'Verhandlungsspielraum',
 inhalt: 'Wo besteht Spielraum neben dem Preis: Übergabetermin, Inventar, Sanierungsbeitrag, Zahlungsmodalitäten. Einschätzung, welches Angebot bei welchem Punkt beweglich ist.'},
{block: 'Handlungsmöglichkeiten',
 inhalt: 'Je Möglichkeit – Annahme, Gegenangebot, Ablehnung, Fristsetzung bei mehreren Angeboten – die Konsequenz für Preis, Termin und Risiko. Keine Empfehlung, die den Entscheid vorwegnimmt.'},
{block: 'Entscheid der Verkäuferschaft',
 inhalt: 'Ankreuzfelder: Annahme von Angebot Nr. [ ] · Gegenangebot zu folgenden Konditionen [ ] · Ablehnung [ ] · Fristverfahren bei mehreren Angeboten [ ]. Mit Ort, Datum und Unterschrift aller Verfügungsberechtigten. Dieser unterzeichnete Entscheid ist der Verhandlungsauftrag an den Makler.'},
];

/* --------------------------------------------- Teil O · Reservation (F7) */
const RESERVATION = [
{zi: '1', titel: 'Parteien',
 inhalt: 'Verkäuferschaft und Kaufinteressent mit vollem Namen, Geburtsdatum und Adresse; Makler als ausstellende Stelle.'},
{zi: '2', titel: 'Objekt',
 inhalt: 'Adresse, Gemeinde, Grundbuchblatt, Parzellennummer, Grundstücksfläche gemäss Grundbuchauszug.'},
{zi: '3', titel: 'Einigung',
 inhalt: 'Kaufpreis, Inventarpreis, vorgesehener Übergabetermin, Nutzen- und Gefahrenübergang, weitere vereinbarte Punkte.'},
{zi: '4', titel: 'Rechtlicher Charakter',
 inhalt: 'Ausdrückliche Feststellung: Diese Reservationsbestätigung hält die erzielte Einigung fest und dokumentiert, dass die Vermarktung zurückgestellt wird. Sie begründet weder eine Verpflichtung zum Kauf noch zum Verkauf. Ein Kaufvertrag über eine Liegenschaft kommt in der Schweiz ausschliesslich durch öffentliche Beurkundung zustande. Beide Parteien können bis zur Beurkundung zurücktreten, ohne eine Entschädigung oder Strafe zu schulden.'},
{zi: '5', titel: 'Keine Reservationszahlung',
 inhalt: 'Es wird keine Reservationszahlung geleistet. Sollte im Einzelfall und nach Freigabe durch die Rechtsberatung eine Zahlung vorgesehen werden, erfolgt sie ausschliesslich auf ein Konto des beauftragten Notariats, ist jederzeit und vollumfänglich rückforderbar und nie in Bargeld.'},
{zi: '6', titel: 'Dauer',
 inhalt: 'Die Reservation gilt bis [Datum]. Kommt bis dahin keine Beurkundung zustande und wird die Frist nicht schriftlich verlängert, wird die Vermarktung ohne weitere Mitteilung wieder aufgenommen.'},
{zi: '7', titel: 'Vorgehen bis zur Beurkundung',
 inhalt: 'Zeitplan mit Beauftragung des Notariats, Zustellung des Vertragsentwurfs, Beurkundungstermin, Zahlung, Eintragung und Übergabe. Aufzählung der von jeder Partei beizubringenden Unterlagen mit Frist.'},
{zi: '8', titel: 'Kosten',
 inhalt: 'Feststellung, dass durch diese Bestätigung keine Kosten für den Kaufinteressenten entstehen, und Hinweis darauf, wie die Kosten von Notariat, Grundbuch und Handänderung nach kantonaler Regelung getragen werden.'},
{zi: '9', titel: 'Datenschutz',
 inhalt: 'Zweck der Datenbearbeitung, Weitergabe an Notariat und Banken, Aufbewahrung und Löschung.'},
{zi: '10', titel: 'Unterschriften',
 inhalt: 'Ort, Datum, Unterschriften der Verkäuferschaft, des Kaufinteressenten und des Maklers; je eine Ausfertigung für jede Partei.'},
];

/* ------------------------------------- Teil P · Notariat und Kaufvertrag (F6) */
const NOTARIAT_VOR = [
{p: 'Käuferdaten', i: 'Vollständige Namen, Geburtsdaten, Heimatorte, Zivilstand, Güterstand, Adressen, Staatsangehörigkeit, Ausländerstatus, vorgesehene Eigentumsform und Quoten; Ausweiskopien.'},
{p: 'Verkäuferdaten', i: 'Wie beim Käufer; zusätzlich Nachweis der Verfügungsbefugnis, Vollmachten, Erbbescheinigung und KESB-Zustimmung, soweit erforderlich.'},
{p: 'Grundbuch', i: 'Aktueller Auszug mit allen Belegen; Bestätigung, dass der eingetragene Eigentümer mit der Verkäuferschaft übereinstimmt.'},
{p: 'Schuldbriefe', i: 'Art (Register- oder Papier-Schuldbrief), Anzahl, Nominalbetrag, Rang, Inhaber, Verwahrort; Bestätigung der Bank über Ablösung, Übertragung oder Neuerrichtung.'},
{p: 'Kaufpreis', i: 'Kaufpreis Liegenschaft und Inventarpreis getrennt, in Zahlen und Worten.'},
{p: 'Zahlungsmodalitäten', i: 'Beträge, Termine, Konten, Bedingungen für die Anmeldung beim Grundbuchamt, Behandlung einer Anzahlung, Verzugsfolgen.'},
{p: 'Übergabetermin', i: 'Datum der Übergabe sowie – davon zu unterscheiden – Zeitpunkt des Nutzen- und Gefahrenübergangs.'},
{p: 'Inventar', i: 'Liste des mitverkauften Inventars mit Wertansatz als Vertragsbeilage.'},
{p: 'Dienstbarkeiten', i: 'Alle zu übernehmenden Dienstbarkeiten, Grundlasten, Anmerkungen und Vormerkungen mit Belegverweis.'},
{p: 'Mietverhältnisse', i: 'Bestehende Mietverträge mit Angaben zu Mietzins, Nebenkosten und Depot; Regelung des Übergangs.'},
{p: 'Gewährleistung und Mängelliste', i: 'Vom Eigentümer unterzeichnete Mängelliste mit Nachweis der Übergabe an den Käufer als Vertragsbeilage; vorgesehene Freizeichnungsklausel.'},
{p: 'Grundstückgewinnsteuer', i: 'Provisorische Berechnung des Steueramts; vorgesehene Sicherstellung durch Rückbehalt oder Sperrkonto.'},
{p: 'Finanzierungsbestätigung', i: 'Objektbezogene Bestätigung der Käuferbank mit Datum, Betrag und allfälligen Vorbehalten.'},
{p: 'Bewilligungen', i: 'Erforderliche Bewilligungen oder Zustimmungen: Lex Koller, bäuerliches Bodenrecht, Erwachsenenschutzbehörde, Zweitwohnungsrecht.'},
{p: 'Offene Punkte', i: 'Liste aller ungeklärten Fragen mit Verantwortlichkeit und Frist; Bestätigung des Notariats, dass die Unterlagen vollständig sind.'},
{p: 'Sprache und Vertretung', i: 'Bedarf an Übersetzung; Vertretung durch Vollmacht und deren Formerfordernis.'},
{p: 'Kostenregelung und Kostenfolge bei Abbruch', i: 'Wer trägt Beurkundungs-, Grundbuch- und Handänderungskosten und in welchem Verhältnis. Zusätzlich vorab zu klären: welche Kosten entstehen, wenn der Vertrag nicht zustande kommt, und wer sie trägt. Antwort schriftlich vom Notariat einholen und im Dossier ablegen – nach einem Abbruch ist diese Frage nicht mehr neutral verhandelbar.'},
];

const NOTARIAT_NACH = [
{p: 'Vertragsunterzeichnung', i: 'Beurkundete Ausfertigung erhalten, geprüft und abgelegt; Fristenplan an alle Beteiligten versandt.'},
{p: 'Zahlungsabwicklung', i: 'Zahlungseingang beim Notariat bestätigt; Ablösung der bestehenden Hypothek veranlasst; Restbetrag an die Verkäuferschaft überwiesen.'},
{p: 'Steuersicherstellung', i: 'Rückbehalt überwiesen und Bestätigung des Steueramts erhalten.'},
{p: 'Eigentumsübertragung', i: 'Anmeldung beim Grundbuchamt erfolgt; Eintragung bestätigt. Erst mit der Eintragung wird der Käufer Eigentümer.'},
{p: 'Grundbuch', i: 'Neuer Auszug mit dem Käufer als Eigentümer zur Ablage; Löschung, Übertragung oder Neuerrichtung der Pfandrechte kontrolliert.'},
{p: 'Versicherungen und Versorger', i: 'Gebäudeversicherung, Haftpflicht, Strom, Wasser, Abwasser, Kehricht, Kaminfeger und Serviceverträge auf den Übergabetermin umgestellt.'},
{p: 'Übergabe', i: 'Termin bestätigt; Übergabeprotokoll vorbereitet; beide Parteien über den Ablauf informiert.'},
{p: 'Schlüssel', i: 'Alle Schlüssel, Fernbedienungen und Badges gezählt, im Protokoll erfasst und quittiert.'},
{p: 'Zählerstände', i: 'Strom, Wasser, Gas, Wärme und Öltankstand mit Zählernummer, Datum und Foto erfasst; an die Versorger gemeldet.'},
{p: 'Dokumentenübergabe', i: 'Pläne, Bewilligungen, Bedienungsanleitungen, Serviceverträge, Garantien und GEAK übergeben; Empfang bestätigt.'},
{p: 'Honorar', i: 'Honorarrechnung gestellt, Mehrwertsteuer ausgewiesen, Zahlungseingang kontrolliert.'},
{p: 'Abschluss', i: 'Abschlusscheckliste abgearbeitet, Kennzahlen erfasst, Dossier archiviert, Abschlussgespräch geführt.'},
];

/* ---------------------------------------- Teil Q · Übergabeprotokoll (F9) */
const UEBERGABE = [
{block: '1 · Angaben zur Übergabe', felder: [
  'Datum und Uhrzeit der Übergabe', 'Ort', 'Anwesende Personen mit Funktion',
  'Protokollführung durch']},
{block: '2 · Parteien', felder: [
  'Verkäuferschaft: Namen und Adressen', 'Käuferschaft: Namen und Adressen',
  'Vertretung durch Vollmacht – ja oder nein']},
{block: '3 · Objekt', felder: [
  'Adresse', 'Gemeinde', 'Grundbuchblatt und Parzellennummer',
  'Datum der Beurkundung', 'Datum der Eintragung im Grundbuch',
  'Vereinbarter Nutzen- und Gefahrenübergang']},
{block: '4 · Schlüssel und Zugangsmittel', felder: [
  'Haustür: Anzahl', 'Nebeneingang: Anzahl', 'Keller: Anzahl', 'Estrich: Anzahl',
  'Garage, Schlüssel: Anzahl', 'Garage, Fernbedienungen: Anzahl',
  'Briefkasten: Anzahl', 'Nebengebäude und Gartenhaus: Anzahl',
  'Badges, Codes, Zylindernummern',
  'Storen- und Sonnenschutzfernbedienungen: Anzahl',
  'Fehlende Schlüssel und Vereinbarung dazu',
  'Alle Schlüssel vollständig übergeben – ja oder nein']},
{block: '5 · Zählerstände', felder: [
  'Strom: Zählernummer, Stand, Datum', 'Strom Niedertarif: Zählernummer, Stand',
  'Wasser: Zählernummer, Stand', 'Gas: Zählernummer, Stand',
  'Wärmezähler: Zählernummer, Stand', 'Öltank: Füllstand und geschätzte Menge',
  'Photovoltaik: Zählerstand Erzeugung und Einspeisung',
  'Fotos aller Zählerstände erstellt – ja oder nein',
  'Meldung an die Versorger erfolgt am']},
{block: '6 · Übergebenes Inventar', felder: [
  'Position, Anzahl, Zustand – je Zeile',
  'Übereinstimmung mit der Inventarliste des Kaufvertrags – ja oder nein',
  'Abweichungen und Vereinbarung dazu']},
{block: '7 · Übergebene Dokumente', felder: [
  'Baupläne und Grundrisse', 'Baubewilligungen', 'Bedienungsanleitungen',
  'Serviceverträge und Garantieunterlagen', 'Heizungsunterlagen und Wartungsnachweise',
  'Sicherheitsnachweis Elektro', 'GEAK', 'Photovoltaikunterlagen',
  'Unterlagen zu Dienstbarkeiten', 'Weitere Dokumente',
  'Empfang aller Dokumente bestätigt – ja oder nein']},
{block: '8 · Zustand und Mängel', felder: [
  'Zustand der Liegenschaft gemäss gemeinsamer Begehung',
  'Bei der Übergabe festgestellte Mängel – je Zeile Raum, Mangel, Feststellung',
  'Bereits im Kaufvertrag und in der Mängelliste erfasste Mängel – Verweis',
  'Reinigungszustand',
  'Räumung vollständig – ja oder nein']},
{block: '9 · Offene Punkte', felder: [
  'Punkt, Verantwortlichkeit, Frist, Erledigungsvermerk – je Zeile',
  'Vereinbarte Nachverfolgung durch']},
{block: '10 · Bemerkungen', felder: [
  'Bemerkungen der Verkäuferschaft', 'Bemerkungen der Käuferschaft',
  'Bemerkungen des Maklers']},
{block: '11 · Unterschriften', felder: [
  'Die Parteien bestätigen die Richtigkeit und Vollständigkeit dieses Protokolls.',
  'Ort und Datum', 'Unterschrift Verkäuferschaft', 'Unterschrift Käuferschaft',
  'Unterschrift Makler',
  'Je eine Ausfertigung für jede Partei übergeben – ja oder nein']},
];

/* Inventarliste (F8) */
const INVENTAR_SPALTEN = ['Nr.', 'Raum', 'Position', 'Anzahl', 'Baujahr',
  'Zustand', 'Bleibt / geht / verhandelbar', 'Wertansatz CHF', 'Bemerkung'];

module.exports = {ERSTGESPRAECH, STRATEGIE, INTERESSENTENFORMULAR,
  BESICHTIGUNG_CHECKLISTE, KAUFANGEBOT, ANGEBOTSVERGLEICH, ENTSCHEIDUNGSVORLAGE,
  RESERVATION, NOTARIAT_VOR, NOTARIAT_NACH, UEBERGABE, INVENTAR_SPALTEN};
