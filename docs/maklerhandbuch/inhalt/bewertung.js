/* Bewertungsverfahren und Vorlage «Immobilienbewertung / Verkaufspreisempfehlung».
   Einzige Quelle – Handbuch (Teil F) und Arbeitsmappe 08 werden hieraus erzeugt. */

const METHODEN = [
{m: 'Vergleichswertmethode',
 einsatz: 'Leitmethode für Einfamilienhäuser in Gebieten mit ausreichender Transaktionsdichte.',
 vorgehen: 'Mindestens drei, besser fünf Vergleichsobjekte erheben. Je Objekt die Abweichung zum Bewertungsobjekt in Lage, Wohnfläche, Grundstücksfläche, Baujahr, Zustand und Ausbaustandard bestimmen und als begründeten Zu- oder Abschlag rechnen. Ergebnis ist eine Spanne, nicht ein Punktwert.',
 grenzen: 'Nicht tragfähig bei weniger als drei belastbaren Vergleichen, bei Sonderobjekten und in Gebieten mit sehr wenigen Transaktionen. Angebotspreise sind keine Abschlusspreise und entsprechend zu korrigieren.'},
{m: 'Realwertmethode',
 einsatz: 'Kontrollrechnung für jedes Einfamilienhaus; Leitmethode bei fehlenden Vergleichsobjekten und bei Sonderobjekten.',
 vorgehen: 'Landwert aus Landpreisen der Gemeinde mal Grundstücksfläche. Zeitbauwert des Gebäudes aus Neuwert abzüglich Altersentwertung. Umgebung und Nebenbauten separat. Abzug des aufgestauten Sanierungsbedarfs bauteilweise. Der Gebäudeversicherungswert ist eine Kontrollgrösse für den Neuwert, kein Marktwert.',
 grenzen: 'Gibt keine Marktnachfrage wieder. In gesuchten Lagen systematisch zu tief, in nachfrageschwachen Lagen zu hoch.'},
{m: 'Ertragswertmethode',
 einsatz: 'Nur bei relevantem Mietertrag: Einliegerwohnung, vermietete Garage, Mehrfamilienhaus, Renditeobjekt.',
 vorgehen: 'Nachhaltig erzielbarer Bruttomietertrag abzüglich nicht überwälzbarer Kosten, kapitalisiert mit einem marktgerechten Satz. Bei gemischter Nutzung anteilig neben der Vergleichswertrechnung führen.',
 grenzen: 'Bei selbstgenutzten Einfamilienhäusern nicht massgebend. Ein kalkulatorischer Eigenmietwert ist keine Bewertungsgrundlage.'},
];

const EINFLUSS = [
{f: 'Makrolage', wirkung: 'Gemeinde, Steuerfuss, Erreichbarkeit der Zentren, Entwicklung der Nachfrage', quelle: 'Kantonale Statistik, Gemeindekennzahlen'},
{f: 'Mikrolage', wirkung: 'Quartier, Aussicht, Besonnung, Lärm, Verkehr, Nachbarbebauung, Immissionsrisiko', quelle: 'Begehung, Lärmkataster, Gemeindeauskunft zu Bauvorhaben'},
{f: 'Grundstück', wirkung: 'Fläche, Zuschnitt, Topografie, Ausrichtung, Erschliessung, Belastungen', quelle: 'Grundbuchauszug, Katasterplan, Zonenauskunft'},
{f: 'Bauzustand', wirkung: 'Zustand je Bauteil, Alter der Haustechnik, aufgestauter Sanierungsbedarf', quelle: 'Objektaufnahme, Renovationsnachweise'},
{f: 'Wohnfläche und Raumangebot', wirkung: 'Fläche, Zimmerzahl, Grundrissqualität, Belichtung', quelle: 'Baupläne, Flächenberechnung'},
{f: 'Ausbaustandard', wirkung: 'Küche, Nassräume, Böden, Haustechnik, Energiestandard', quelle: 'Objektaufnahme, GEAK sofern vorhanden'},
{f: 'Nachfrage', wirkung: 'Zahl aktiver Suchender im Segment, Finanzierbarkeit im Zielpreisband, Zinsniveau', quelle: 'Eigene Datenbank, Portalstatistiken, Marktanalyse'},
{f: 'Angebotsdruck', wirkung: 'Konkurrierende Angebote, mittlere Angebotsdauer, Anteil mit Preisreduktion', quelle: 'Marktanalyse'},
{f: 'Sanierungsbedarf', wirkung: 'Direkter Abzug, bauteilweise beziffert mit Zeithorizont', quelle: 'Objektaufnahme, Kostenschätzung, gegebenenfalls Fachperson'},
{f: 'Ausbaupotenzial', wirkung: 'Zuschlag nur mit schriftlicher Bestätigung der Nutzungsreserve durch die Gemeinde', quelle: 'Gemeindeauskunft mit Datum'},
{f: 'Grundstückspotenzial', wirkung: 'Abparzellierung oder Verdichtung; Zuschlag nur bei behördlich bestätigter Zulässigkeit', quelle: 'Gemeindeauskunft, Zonenordnung'},
{f: 'Rechtliche Belastungen', wirkung: 'Dienstbarkeiten, Baurecht mit Restlaufzeit, Nutzungsbeschränkungen, Eintrag im Kataster belasteter Standorte', quelle: 'Grundbuchauszug und Belege, Prüfbericht Recht'},
];

const ABLAUF = [
'1. Eingangsgrössen aus der Objektaufnahme und den beschafften Unterlagen übernehmen. Jede Zahl mit Quelle. Keine Bewertung auf Angaben, die nur mündlich vorliegen.',
'2. Flächen und Volumen gegen Grundbuchauszug, Baupläne und Gebäudeversicherungsausweis abgleichen. Abweichungen klären, bevor gerechnet wird.',
'3. Marktanalyse abschliessen: Vergleichsobjekte, Angebotsdruck, Standortfaktoren.',
'4. Vergleichswert rechnen: je Vergleichsobjekt begründete Zu- und Abschläge, daraus eine Spanne.',
'5. Realwert als Kontrollrechnung: Landwert, Zeitbauwert, Umgebung, abzüglich Sanierungsbedarf.',
'6. Ertragswert nur bei relevantem Mietertrag; bei gemischter Nutzung anteilig.',
'7. Sanierungsbedarf bauteilweise beziffern und als Abzug führen, nicht nur qualitativ beschreiben.',
'8. Potenziale prüfen: nur behördlich bestätigte Reserven bewerten.',
'9. Methoden gewichten und die Gewichtung begründen. Weichen Vergleichs- und Realwert um mehr als 15 Prozent ab, die Ursache benennen.',
'10. Wertspanne festlegen. Die Spanne ist das Ergebnis, nicht der Punktwert.',
'11. Angebotspreis empfehlen und im Verhältnis zur Spanne begründen.',
'12. Chancen und Risiken auflisten, je Position mit Wirkung auf Preis oder Angebotsdauer.',
'13. Vermarktungsstrategie ableiten: Preisstrategie, Zielgruppe, Kanäle, Besichtigungsform, Zeitplan.',
'14. Vier-Augen-Prüfung im Team. Erst danach unterschreiben und datieren.',
];

/* Vorlage «Immobilienbewertung / Verkaufspreisempfehlung» */
const VORLAGE = [
{a: 'Objekt', i: 'Adresse, Gemeinde, Kanton, Parzellennummer, Grundbuchblatt, Objekttyp, Baujahr, Wohnfläche mit Norm, Nebenfläche, Grundstücksfläche, Volumen, Zimmer, Parkplätze.'},
{a: 'Eigentümer', i: 'Namen aller Eigentümer, Eigentumsform und Quoten gemäss Grundbuchauszug, Auftraggeber der Bewertung.'},
{a: 'Bewertungsdatum und Bearbeitung', i: 'Datum der Bewertung, Datum der Objektbesichtigung, bearbeitende Person, prüfende Person, Version.'},
{a: 'Zweck und Umfang', i: 'Verkaufspreisempfehlung im Rahmen eines Verkaufsmandats. Ausdrücklich keine Schatzung im Rechtssinne, kein Gutachten für Steuer-, Erb- oder Gerichtszwecke. Beruht auf Besichtigung, Unterlagen und Behördenauskünften ohne bautechnische Untersuchung.'},
{a: 'Grundlagen', i: 'Auflistung jeder verwendeten Unterlage mit Ausstellungsdatum und Bezugsquelle: Grundbuchauszug, Katasterplan, Zonenauskunft, Baupläne, Baubewilligungen, Gebäudeversicherungsausweis, Renovationsnachweise, Katasterauszug belastete Standorte, Naturgefahrenkarte, GEAK. Ebenso Datum der Objektaufnahme und Name der aufnehmenden Person.'},
{a: 'Annahmen und Vorbehalte', i: 'Flächenquelle und Berechnungsnorm. Angaben des Eigentümers, die nicht überprüft wurden. Noch offene Punkte, etwa fehlende Baubewilligungen. Wirkung dieser Unsicherheiten auf das Ergebnis.'},
{a: 'Vergleichsobjekte', i: 'Tabelle mit mindestens drei Objekten: Lage, Wohnfläche, Grundstücksfläche, Baujahr, Zustand, Preis, Preis pro Quadratmeter, Angebots- oder Abschlusspreis, Angebotsdauer, Quelle mit Abrufdatum, Abweichung zum Bewertungsobjekt und begründeter Zu- oder Abschlag.'},
{a: 'Marktanalyse', i: 'Angebotssituation im Segment, Zahl konkurrierender Angebote, mittlere Angebotsdauer, Anteil mit Preisreduktion, Nachfrageeinschätzung, Zinsumfeld, saisonale Effekte, Standortfaktoren mit Quelle.'},
{a: 'Rechnung Vergleichswert', i: 'Herleitung mit allen Zu- und Abschlägen, Ergebnisspanne.'},
{a: 'Rechnung Realwert', i: 'Landwert, Zeitbauwert Gebäude, Umgebung und Nebenbauten, Zwischentotal, Abzug Sanierungsbedarf bauteilweise, Ergebnis.'},
{a: 'Rechnung Ertragswert', i: 'Nur bei relevantem Mietertrag: Mietertrag, Kosten, Kapitalisierungssatz mit Begründung, Ergebnis. Sonst mit Begründung als nicht anwendbar bezeichnen.'},
{a: 'Gewichtung', i: 'Anteil jeder Methode in Prozent mit Begründung; Erläuterung der Abweichungen zwischen den Methoden.'},
{a: 'Wertspanne', i: 'Untere und obere Grenze in Franken sowie der Mittelwert. Zusätzlich der Preis pro Quadratmeter Wohnfläche als Plausibilitätsgrösse.'},
{a: 'Empfohlener Angebotspreis', i: 'Ein Betrag in Franken, mit der Begründung, wo er innerhalb der Spanne liegt und warum.'},
{a: 'Begründung', i: 'Zusammenhängender Text: welche Faktoren den Wert tragen, welche ihn dämpfen, wie die Methoden zusammenspielen.'},
{a: 'Chancen', i: 'Je Position: Sachverhalt, Wirkung auf Preis oder Angebotsdauer, Voraussetzung für den Eintritt.'},
{a: 'Risiken', i: 'Je Position: Sachverhalt, Wirkung, Gegenmassnahme. Sanierungsbedarf, rechtliche Belastungen, Lärm, Angebotsdruck, Finanzierbarkeit im Zielpreisband.'},
{a: 'Vermarktungsstrategie', i: 'Preisstrategie mit Begründung, Zielgruppe, Kanäle, Besichtigungsform, Zeitplan, Umgang mit Angeboten, vorgesehene Massnahmen bei ausbleibender Nachfrage mit Auslösekriterium.'},
{a: 'Nettoerlösrechnung', i: 'Angebotspreis abzüglich Hypothekenablösung, allfälliger Vorfälligkeitsentschädigung, geschätzter Grundstückgewinnsteuer nach Angabe des Steueramts, Notariats- und Grundbuchgebühren, Handänderungsabgabe nach kantonaler Regelung sowie Honorar zuzüglich Mehrwertsteuer. Als unverbindliche Orientierung mit Spannen und Quellen kennzeichnen.'},
{a: 'Unterschrift', i: 'Ort, Datum, bearbeitende und prüfende Person mit Funktion.'},
];

/* Rechenschema für die Arbeitsmappe 08.
   formel: Excel-Formel relativ zur Zeile; wird beim Erzeugen eingesetzt. */
const REALWERT = [
{pos: 'Landfläche', einheit: 'm²', eingabe: true},
{pos: 'Landpreis', einheit: 'CHF/m²', eingabe: true, hinweis: 'Quelle und Datum in der Bemerkung'},
{pos: 'Landwert', einheit: 'CHF', formel: 'PRODUKT_LAND'},
{pos: 'Gebäudevolumen', einheit: 'm³', eingabe: true, hinweis: 'Aus Gebäudeversicherungsausweis'},
{pos: 'Neuwert pro m³', einheit: 'CHF/m³', eingabe: true},
{pos: 'Neuwert Gebäude', einheit: 'CHF', formel: 'PRODUKT_GEB'},
{pos: 'Altersentwertung', einheit: '%', eingabe: true, hinweis: 'Bauteilgewichtet, unter Berücksichtigung erfolgter Sanierungen'},
{pos: 'Zeitbauwert Gebäude', einheit: 'CHF', formel: 'ZEITBAUWERT'},
{pos: 'Umgebung und Nebenbauten', einheit: 'CHF', eingabe: true},
{pos: 'Baunebenkosten', einheit: 'CHF', eingabe: true},
{pos: 'Zwischentotal', einheit: 'CHF', formel: 'ZWISCHEN'},
{pos: 'Abzug aufgestauter Sanierungsbedarf', einheit: 'CHF', eingabe: true, hinweis: 'Summe aus dem Blatt Sanierungsbedarf'},
{pos: 'Realwert', einheit: 'CHF', formel: 'REALWERT'},
];

const SANIERUNG_BAUTEILE = [
'Dach und Spenglerarbeiten', 'Fassade und Aussenwärmedämmung', 'Fenster und Aussentüren',
'Wärmeerzeuger', 'Wärmeabgabe und Verteilung', 'Warmwasseraufbereitung',
'Lüftung', 'Sanitärleitungen und Apparate', 'Elektroinstallation',
'Küche', 'Badezimmer und Nassräume', 'Bodenbeläge', 'Innentüren und Innenausbau',
'Umgebung, Zufahrt, Einfriedung', 'Kanalisation und Entwässerung',
];

module.exports = {METHODEN, EINFLUSS, ABLAUF, VORLAGE, REALWERT, SANIERUNG_BAUTEILE};
