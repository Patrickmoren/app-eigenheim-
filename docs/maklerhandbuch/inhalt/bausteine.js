/* Strukturbausteine: Maklermandat, Verkaufsdossier, Inserat, Fotografie,
   CRM, Abschlusscheckliste, Ordnerstruktur, Controlling.
   Einzige Quelle für Handbuch (Teile G–K, R–U) und die abgeleiteten Dateien. */

/* ------------------------------------------- Teil G · Maklermandat, Struktur */
/* pruefen: true  => «Rechtliche Prüfung durch Notariat / Rechtsberatung erforderlich» */
const MANDAT = [
{zi: '1', titel: 'Vertragsparteien', inhalt:
  'Sämtliche Verfügungsberechtigten mit vollem Namen, Geburtsdatum, Zivilstand und Adresse; bei juristischen Personen Firma, Sitz, UID und die zeichnungsberechtigten Personen. Bei Erbengemeinschaft alle Erben oder die bestellte Erbenvertretung mit Nachweis. Auftragnehmer mit Firma, Sitz, UID und verantwortlicher Person.',
  pruefen: true, recht: 'R13 R14 R15 R16'},
{zi: '2', titel: 'Objekt', inhalt:
  'Gemeinde, Grundbuchblatt, Parzellennummer, Adresse, Grundstücksfläche gemäss Grundbuchauszug, Gebäudebezeichnung. Bei Verkauf mehrerer Parzellen oder Teilflächen genaue Umschreibung und Hinweis auf eine allfällig erforderliche Mutation.',
  pruefen: false, recht: 'R4'},
{zi: '3', titel: 'Auftrag und Art der Mäkelei', inhalt:
  'Klare Bezeichnung, ob Vermittlungs- oder Nachweismäkelei geschuldet ist, und wann der Anspruch entsteht. Die Unterscheidung bestimmt die Voraussetzungen des Honorars.',
  pruefen: true, recht: 'R17 R18'},
{zi: '4', titel: 'Verkaufsumfang', inhalt:
  'Liegenschaft mit oder ohne Inventar; Auflistung des mitverkauften Inventars als Beilage; Ausschluss bestimmter Gegenstände; Regelung zu vermieteten Teilen und bestehenden Mietverhältnissen.',
  pruefen: false, recht: 'R8'},
{zi: '5', titel: 'Leistungen des Auftragnehmers', inhalt:
  'Abschliessende Aufzählung: Objektaufnahme, Unterlagenbeschaffung, Bewertung und Preisempfehlung, Erstellung von Fotografie, Grundrissen, Dossier und Inseraten, Vermarktung auf definierten Kanälen, Interessentenqualifizierung, Besichtigungen, Verhandlungsführung im Rahmen des Auftrags, Begleitung bis Beurkundung, Übergabe und Abschluss. Ausdrücklich nicht geschuldet: Rechts-, Steuer- und Finanzierungsberatung sowie Bauexpertisen.',
  pruefen: false, recht: ''},
{zi: '6', titel: 'Vermarktung und Budget', inhalt:
  'Kanäle namentlich; Umfang von Fotografie, Grundrissen und optionalen Leistungen wie Drohne, Video, 360-Grad-Rundgang und virtuelle Möblierung; Kostenträger und Budgetobergrenze; Regelung, wer die Kosten trägt, wenn das Mandat vor einem Verkauf endet.',
  pruefen: true, recht: ''},
{zi: '7', titel: 'Besichtigungen', inhalt:
  'Zugangsregelung, Schlüsselübergabe und Aufbewahrung, Anwesenheit des Eigentümers, Umgang mit Sammelbesichtigungen, Vorlaufzeit für Terminanfragen, Regelung bei bewohntem Objekt.',
  pruefen: false, recht: ''},
{zi: '8', titel: 'Kommunikation und Berichterstattung', inhalt:
  'Rhythmus und Form der Statusmeldung, festgelegter Kennzahlensatz, Ansprechpersonen beider Seiten, Grundsatz, dass Interessentenanfragen ausschliesslich über den Auftragnehmer laufen.',
  pruefen: false, recht: ''},
{zi: '9', titel: 'Angebotspreis und Mindestpreis', inhalt:
  'Angebotspreis in Franken; Mindestpreis als intern klassifizierte Angabe mit ausdrücklicher Abrede, dass er keinem Interessenten genannt wird; Verfahren für eine Preisanpassung, insbesondere wer sie beschliesst und in welcher Form.',
  pruefen: false, recht: ''},
{zi: '10', titel: 'Honorar', inhalt:
  'Satz in Prozent des beurkundeten Kaufpreises oder Pauschale, ausdrücklich zuzüglich Mehrwertsteuer zum Normalsatz von 8,1 Prozent. Bemessungsgrundlage definieren, insbesondere ob der Inventarpreis einbezogen wird. Marktkonformität beachten: ein unverhältnismässig hoher Mäklerlohn kann bei Grundstückkäufen richterlich herabgesetzt werden.',
  pruefen: true, recht: 'R18 R20 R21'},
{zi: '11', titel: 'Entstehung und Fälligkeit des Anspruchs', inhalt:
  'Anknüpfung an das Zustandekommen des öffentlich beurkundeten Kaufvertrags; Fälligkeit und Zahlungsfrist; Regelung, ob der Anspruch bei Rückabwicklung oder bei Nichterfüllung durch den Käufer entfällt; Abrechnung über das Notariat, soweit vorgesehen.',
  pruefen: true, recht: 'R18'},
{zi: '12', titel: 'Aufwandersatz', inhalt:
  'Nur soweit ausdrücklich vereinbart; Aufzählung der ersatzfähigen Positionen, Obergrenze und Nachweispflicht. Ohne Vereinbarung besteht kein Anspruch auf Ersatz von Aufwendungen.',
  pruefen: true, recht: 'R18'},
{zi: '13', titel: 'Laufzeit', inhalt:
  'Beginn, feste Dauer und Regelung, ob und wie sich das Mandat verlängert. Eine automatische Verlängerung ohne ausdrückliche Zustimmung ist zu vermeiden.',
  pruefen: true, recht: ''},
{zi: '14', titel: 'Kündigung', inhalt:
  'Form, Frist und Folgen; Umgang mit laufenden Verhandlungen und mit Interessenten, die während der Laufzeit nachgewiesen wurden; Abgrenzung zum Nachwirkungsanspruch.',
  pruefen: true, recht: 'R17 R18'},
{zi: '15', titel: 'Exklusivität', inhalt:
  'Ob Alleinauftrag oder einfacher Auftrag; ob der Eigentümer selbst verkaufen darf und welche Folgen ein Eigenverkauf hat; Regelung zur Zusammenarbeit mit anderen Maklern und zur Provisionsteilung.',
  pruefen: true, recht: 'R17'},
{zi: '16', titel: 'Mitwirkungspflichten des Eigentümers', inhalt:
  'Fristgerechte Bereitstellung der Unterlagen; vollständige und wahrheitsgemässe Auskunft; Pflicht zur Offenlegung bekannter Mängel mit Verweis auf die unterzeichnete Mängelliste; Zugang für Besichtigungen; unverzügliche Mitteilung eigener Kontakte zu Kaufinteressenten; Unterlassen paralleler Eigenvermarktung, soweit Exklusivität vereinbart ist.',
  pruefen: true, recht: 'R9 R10'},
{zi: '17', titel: 'Umgang mit Interessenten', inhalt:
  'Qualifizierungskriterien; Grundsatz, dass Kaufangebote ausschliesslich schriftlich weitergeleitet werden; Vorlagepflicht jedes Angebots an den Eigentümer; Entscheidkompetenz allein beim Eigentümer; Gleichbehandlung bei mehreren Angeboten; Vertraulichkeit konkurrierender Angebotsbeträge.',
  pruefen: false, recht: ''},
{zi: '18', titel: 'Nachweis und Vermittlung, Nachwirkung', inhalt:
  'Dokumentation nachgewiesener Interessenten; Dauer und Umfang eines Anspruchs, wenn der Verkauf nach Mandatsende mit einem nachgewiesenen Interessenten zustande kommt. Diese Klausel ist häufig Streitgegenstand und eng zu fassen.',
  pruefen: true, recht: 'R17 R18'},
{zi: '19', titel: 'Doppelmäkelei und Interessenkonflikte', inhalt:
  'Offenlegung jeder Tätigkeit für die Käuferseite und Erfordernis der schriftlichen Zustimmung beider Parteien. Ohne Offenlegung und Zustimmung kann der Lohnanspruch verwirken.',
  pruefen: true, recht: 'R19'},
{zi: '20', titel: 'Reservationen', inhalt:
  'Befugnis zur Ausstellung einer Reservationsbestätigung als unverbindliche Absichtserklärung; ausdrückliches Verbot, Reservationszahlungen auf Konten des Auftragnehmers oder in Bargeld entgegenzunehmen; Hinweis, dass eine Bindung erst mit der öffentlichen Beurkundung entsteht.',
  pruefen: true, recht: 'R1 R2 R38'},
{zi: '21', titel: 'Geldwäschereirechtliche Sorgfaltspflichten', inhalt:
  'Pflicht des Eigentümers zur Mitwirkung bei Identifikation und Feststellung der wirtschaftlich berechtigten Person; Hinweis auf Dokumentations- und Aufbewahrungspflichten; Vorbehalt, das Mandat nicht zu beginnen oder zu beenden, wenn die Mitwirkung ausbleibt.',
  pruefen: true, recht: 'R37 R38'},
{zi: '22', titel: 'Datenschutz', inhalt:
  'Zweck und Umfang der Datenbearbeitung; Weitergabe an Notariat, Banken, Behörden und Dienstleister; Aufbewahrungs- und Löschfristen; Rechte der betroffenen Personen; Verweis auf die Datenschutzerklärung als Beilage.',
  pruefen: true, recht: 'R39'},
{zi: '23', titel: 'Haftung', inhalt:
  'Umfang und Grenzen der Haftung des Auftragnehmers; Klarstellung, dass Angaben des Eigentümers und Auskünfte Dritter ungeprüft übernommen werden, soweit keine Prüfpflicht besteht; Ausschluss der Haftung für Rechts-, Steuer- und Finanzierungsfragen.',
  pruefen: true, recht: ''},
{zi: '24', titel: 'Schlussbestimmungen', inhalt:
  'Anwendbares Recht, Gerichtsstand, Schriftformerfordernis für Änderungen, Salvatorische Klausel, Aufzählung der Beilagen, Ausfertigungen und Unterschriften aller Vertragsparteien mit Ort und Datum.',
  pruefen: true, recht: ''},
];

/* ------------------------------------ Teil H · Verkaufsdossier, 23 Abschnitte */
const DOSSIER = [
{nr: 1, titel: 'Titelblatt', inhalt:
  'Aussenaufnahme als Leitbild, Objektbezeichnung, Ort, Angebotspreis oder «Preis auf Anfrage», Firmenlogo, Ausgabedatum und Versionsnummer.'},
{nr: 2, titel: 'Kurzbeschreibung', inhalt:
  'Fünf bis acht Sätze: Was ist das Objekt, für wen ist es, was macht es besonders. Keine Superlative, keine Adjektivketten.'},
{nr: 3, titel: 'Verkaufsargumente', inhalt:
  'Fünf bis sieben belegbare Punkte, je eine Zeile. Jeder Punkt muss an einer Zahl oder einem Beleg im Dossier festgemacht werden können.'},
{nr: 4, titel: 'Objektübersicht', inhalt:
  'Bildseite mit vier bis sechs Aufnahmen: Aussenansicht, Wohnbereich, Küche, Aussenbereich.'},
{nr: 5, titel: 'Eckdaten', inhalt:
  'Tabelle: Objekttyp, Baujahr, letzte Sanierung, Wohnfläche mit Norm, Nebenfläche, Grundstücksfläche, Volumen, Zimmer, Nassräume, Geschosse, Parkplätze, Heizsystem, Energieträger, GEAK-Klasse wenn vorhanden, Verfügbarkeit, Angebotspreis. Je Zeile die Quelle im Anhang nachweisbar.'},
{nr: 6, titel: 'Lage', inhalt:
  'Gemeinde und Quartier, Charakter, Erreichbarkeit mit Distanzen und Fahrzeiten, ÖV mit Haltestelle und Gehminuten, Einkauf, Schulen, Ärzte, Freizeit, Steuerfuss mit Jahr. Karte mit Objektmarkierung.'},
{nr: 7, titel: 'Grundstück', inhalt:
  'Fläche gemäss Grundbuchauszug, Parzellennummer, Zone, Nutzungskennzahlen mit Datum der Gemeindeauskunft, Topografie, Ausrichtung, Erschliessung. Dienstbarkeiten und Anmerkungen in Klartext mit ihrer praktischen Bedeutung.'},
{nr: 8, titel: 'Gebäude', inhalt:
  'Bauweise, Geschossaufbau, Volumen, Gebäudeversicherungswert mit Schatzungsdatum, Zustand der Gebäudehülle je Bauteil mit Jahr der letzten Erneuerung.'},
{nr: 9, titel: 'Wohnräume', inhalt:
  'Beschreibung je Geschoss mit Flächen, Belichtung, Ausrichtung und Bodenbelägen. Nüchtern und nachprüfbar.'},
{nr: 10, titel: 'Küche', inhalt:
  'Jahr, Ausführung, Arbeitsflächen, Geräte mit Fabrikat und Baujahr, Anordnung, Anbindung an den Essbereich.'},
{nr: 11, titel: 'Badezimmer', inhalt:
  'Je Nassraum: Geschoss, Jahr, Ausstattung, Belüftung, Bodenheizung.'},
{nr: 12, titel: 'Aussenbereich', inhalt:
  'Garten mit Fläche und Gestaltung, Terrasse, Balkon, Sitzplätze mit Ausrichtung, Einfriedung, Pool oder Teich mit Technik und Unterhalt.'},
{nr: 13, titel: 'Nebenräume', inhalt:
  'Keller, Estrich mit Ausbaustatus, Technikraum, Waschraum, Reduit, Nebengebäude mit Bewilligungsstatus.'},
{nr: 14, titel: 'Parkierung', inhalt:
  'Art und Anzahl, Tor und Antrieb, Ladeinfrastruktur, Eigentums- oder Mietverhältnis.'},
{nr: 15, titel: 'Grundrisse', inhalt:
  'Alle Geschosse, neu gezeichnet, mit Flächenangaben, Nordpfeil, Massstabshinweis und Legende. Möblierungsstandard über alle Geschosse gleich.'},
{nr: 16, titel: 'Situationsplan', inhalt:
  'Parzellengrenzen, Gebäudeumriss, Zufahrt, Nachbarparzellen, Nordpfeil. Quelle und Datum angeben.'},
{nr: 17, titel: 'Technische Informationen', inhalt:
  'Heizung mit System, Energieträger, Fabrikat und Baujahr, Warmwasser, Lüftung, Photovoltaik mit Leistung und Inbetriebnahme, Speicher, Elektroinstallation mit Datum der letzten Kontrolle, Sanitärleitungen, Smart-Home- und Sicherheitseinrichtungen.'},
{nr: 18, titel: 'Renovationen', inhalt:
  'Tabelle nach Jahr: Bauteil, Massnahme, Umfang. Nur belegte Massnahmen aufführen. Anschliessend offener Sanierungsbedarf mit Zeithorizont – diese Offenheit schafft Vertrauen und verhindert Preisabschläge aus Unsicherheit.'},
{nr: 19, titel: 'Energie', inhalt:
  'GEAK-Klassen für Gebäudehülle und Gesamtenergieeffizienz, sofern ein GEAK vorliegt, mit Ausstellungsdatum und Nummer. Ohne GEAK: Heizsystem, Energieträger und bekannte Verbrauchswerte mit Quelle und Bezugsjahr. Keine Effizienzangabe ohne Nachweis.'},
{nr: 20, titel: 'Preis', inhalt:
  'Angebotspreis, Inventarpreis wenn separat, Verfügbarkeit und frühestmöglicher Übergabetermin.'},
{nr: 21, titel: 'Kaufnebenkosten', inhalt:
  'Handänderungsabgabe, Beurkundungs- und Grundbuchgebühren als Spanne für den konkreten Kanton, mit Quelle, Datum und dem Hinweis, dass die Aufteilung zwischen den Parteien im Kaufvertrag geregelt wird und die Angaben unverbindlich sind. Keine Zahlen aus anderen Kantonen übernehmen.'},
{nr: 22, titel: 'Kontakt', inhalt:
  'Zuständige Person mit Funktion, Direktnummer, E-Mail, Telefonzeiten und Firmenangaben.'},
{nr: 23, titel: 'Rechtliche Hinweise', inhalt:
  'Angaben nach bestem Wissen auf Basis von Unterlagen und Auskünften des Eigentümers und der Behörden, ohne Gewähr für Vollständigkeit und Richtigkeit. Kein Angebot und keine Zusicherung im Rechtssinne. Ein Kaufvertrag über eine Liegenschaft kommt in der Schweiz erst durch öffentliche Beurkundung zustande. Flächenangaben mit Norm und Quelle. Verweis auf die Mängelliste als separates Dokument. Bilder können virtuelle Möblierung enthalten; solche Bilder sind als solche bezeichnet. Urheber- und Nutzungsrechte, Datenschutzhinweis, Ausgabedatum und Version.'},
];

/* --------------------------------------------------- Teil I · Inseratsvorlage */
const INSERAT_KANAELE = [
{kanal: 'Immobilienportale', laenge: 'Titel max. 60 Zeichen, Beschreibung 1500–2500 Zeichen',
 hinweis: 'Alle Pflichtfelder konsistent mit dem Dossier. Bilderreihenfolge nach Teil J. Keine Kontaktdaten im Beschreibungstext, soweit das Portal es untersagt.'},
{kanal: 'Eigene Website', laenge: 'Beschreibung 2000–3500 Zeichen',
 hinweis: 'Ausführlichste Fassung; Grundrisse und Dossier zum Download nach Anfrage, nicht offen. Datenschutzerklärung verlinkt.'},
{kanal: 'Social Media', laenge: '400–700 Zeichen',
 hinweis: 'Ein Bild oder Karussell, keine Preisdiskussion in Kommentaren. Anfragen in den privaten Kanal führen. Keine Zielgruppenansprache mit diskriminierendem Bezug.'},
{kanal: 'Newsletter', laenge: '600–900 Zeichen',
 hinweis: 'Betreff mit Ort und Objekttyp. Nur an Empfänger mit zulässiger Rechtsgrundlage; Abmeldung in jeder Sendung.'},
{kanal: 'Interessentenversand', laenge: '400–600 Zeichen persönliche Anrede',
 hinweis: 'Selektionskriterien im CRM dokumentieren. Persönlicher Bezug auf das Suchprofil.'},
];

const INSERAT_ABSCHNITTE = [
{t: 'Titel', v: 'Objekttyp, Kernmerkmal und Ort in maximal 60 Zeichen. Beispielmuster: «Einfamilienhaus mit Südgarten in [Ort]». Keine Ausrufezeichen, keine Superlative, keine Grossbuchstabenwörter.'},
{t: 'Kurzbeschreibung', v: 'Zwei bis drei Sätze für die Trefferliste. Was es ist, für wen, was auffällt.'},
{t: 'Highlights', v: 'Vier bis sechs Stichpunkte, je maximal acht Wörter, alle belegbar. Beispiele: Baujahr und letzte Sanierung, Grundstücksfläche, Ausrichtung, Heizsystem, Parkierung, Verfügbarkeit.'},
{t: 'Objektbeschreibung', v: 'Rundgang in der Reihenfolge der Besichtigung: Ankunft und Aussenansicht, Eingang, Wohn- und Essbereich, Küche, Schlafbereich, Nassräume, Nebenräume, Technik. Flächen nennen, Zustand benennen, Sanierungsbedarf nicht verschweigen.'},
{t: 'Lagebeschreibung', v: 'Quartier und Charakter, Erreichbarkeit mit Distanzen und Fahrzeiten, ÖV mit Gehminuten, Einkauf, Schulen, Naherholung. Konkrete Angaben statt «zentral und ruhig».'},
{t: 'Ausstattung', v: 'Küche, Nassräume, Böden, Fenster, Heizung, Lüftung, Photovoltaik, Smart Home, Sonnenschutz – mit Jahr, wo relevant.'},
{t: 'Aussenbereich', v: 'Garten, Terrasse, Balkon, Sitzplätze mit Ausrichtung, Einfriedung, besondere Anlagen.'},
{t: 'Parkierung', v: 'Art, Anzahl, Ladeinfrastruktur.'},
{t: 'Besonderheiten', v: 'Was das Objekt wirklich unterscheidet, einschliesslich offenzulegender Punkte wie Dienstbarkeiten, Sanierungsbedarf oder Nutzungsbeschränkungen in sachlicher Formulierung.'},
{t: 'Preis', v: 'Angebotspreis oder «Preis auf Anfrage» nach Strategie; Inventar separat, wenn zutreffend; Verfügbarkeit.'},
{t: 'Kontakt', v: 'Zuständige Person, Direktnummer, E-Mail, Telefonzeiten. Hinweis auf Unterlagen nach Anfrage.'},
{t: 'Pflichthinweise', v: 'Angaben ohne Gewähr, Flächen mit Norm und Quelle, virtuelle Möblierung als solche bezeichnet, Datenschutzhinweis verlinkt.'},
];

/* -------------------------------- Teil J · Fotografie und Marketing-Checkliste */
const FOTO_PFLICHT = [
'Aussenaufnahme Hauptfassade, Hochformat und Querformat',
'Aussenaufnahme aus zweiter Perspektive, die Grundstück und Umgebung zeigt',
'Eingangsbereich von aussen',
'Eingangsbereich von innen',
'Wohnzimmer, zwei Perspektiven aus gegenüberliegenden Ecken',
'Essbereich',
'Küche, Gesamtansicht',
'Küche, Detail Arbeitsfläche und Geräte',
'Jedes Schlafzimmer, eine Aufnahme',
'Jedes Badezimmer, eine Aufnahme',
'Treppenhaus oder Verbindungsbereich',
'Keller, Übersicht',
'Technikraum mit Wärmeerzeuger',
'Waschraum',
'Estrich',
'Garage oder Einstellhalle',
'Garten, Gesamtansicht',
'Terrasse oder Sitzplatz',
'Balkon',
'Aussicht aus dem Hauptwohnraum',
'Umgebung und Quartierbild',
'Photovoltaikanlage, sofern vorhanden',
];

const FOTO_MEIDEN = [
'Personen, Haustiere, Kennzeichen von Fahrzeugen',
'Persönliche Gegenstände: Fotografien, Dokumente, Post, Medikamente, Kleidung, Hygieneartikel',
'Unaufgeräumte Flächen, offene Abfalleimer, Wäscheständer, Kabelsalat, Putzmaterial',
'Aufnahmen gegen das Licht, Spiegelungen mit sichtbarem Fotografen, Blitzlicht in Wohnräumen',
'Extreme Weitwinkelverzerrungen, die Räume grösser erscheinen lassen als sie sind',
'Detailaufnahmen ohne Aussagewert, etwa einzelne Steckdosen oder Türgriffe',
'Nachbargrundstücke und Nachbarfenster als Bildmotiv',
'Toiletten als Bildmittelpunkt; Nassräume mit geschlossenem WC-Deckel aufnehmen',
'Räume bei laufender Renovation oder mit Umzugskartons',
'Jahreszeitliche Widersprüche, etwa Schnee im Sommerinserat',
];

const FOTO_REIHENFOLGE = [
'1. Aussenaufnahme Hauptfassade – das Leitbild, bestimmt die Klickrate',
'2. Wohnzimmer oder der beeindruckendste Wohnraum',
'3. Küche, Gesamtansicht',
'4. Essbereich',
'5. Garten, Terrasse oder Sitzplatz',
'6. Hauptschlafzimmer',
'7. Hauptbadezimmer',
'8. Weitere Schlafzimmer',
'9. Weitere Nassräume',
'10. Aussicht',
'11. Nebenräume, Keller, Technik, Garage',
'12. Aussenansicht aus zweiter Perspektive und Quartierbild',
'13. Grundrisse je Geschoss',
'14. Situationsplan',
];

const FOTO_ZUSATZ = [
{leistung: 'Drohnenaufnahmen', wann: 'Grosse oder ungewöhnlich geformte Grundstücke, Hanglagen, Aussichtslagen, Objekte, deren Umgebung das Hauptargument ist.',
 hinweis: 'Bewilligungs- und Zonenvorschriften für den Flugbetrieb sowie Persönlichkeitsrechte der Nachbarn beachten; Einverständnis des Eigentümers einholen.'},
{leistung: 'Grundrisse', wann: 'Immer, ohne Ausnahme.',
 hinweis: 'Neu zeichnen lassen, nicht Baupläne scannen. Möblierungsstandard über alle Geschosse gleich. Flächen, Nordpfeil, Massstabshinweis, Legende.'},
{leistung: '360-Grad-Rundgang', wann: 'Objekte im oberen Preissegment, auswärtige oder internationale Zielgruppen, bewohnte Objekte zur Reduktion unnötiger Besichtigungen.',
 hinweis: 'Ersetzt keine Besichtigung. Reduziert erfahrungsgemäss die Zahl unqualifizierter Termine deutlich.'},
{leistung: 'Virtuelle Möblierung', wann: 'Leerstehende Objekte und Räume, deren Nutzung sich nicht erklärt.',
 hinweis: 'Jedes Bild sichtbar als «virtuell möbliert» kennzeichnen. Bausubstanz und Ausbau nie verändern – das wäre eine unzutreffende Zusicherung.'},
{leistung: 'Video', wann: 'Objekte mit erzählbarem Weg durch Haus und Umgebung; Social-Media-Vermarktung.',
 hinweis: '60 bis 120 Sekunden, ohne Musik mit Lizenzrisiko, mit stabilisierter Kameraführung.'},
{leistung: 'Verkaufsschild am Objekt', wann: 'Offene Vermarktung in gut frequentierter Lage.',
 hinweis: 'Nur mit ausdrücklicher Zustimmung des Eigentümers; bei diskreter Vermarktung ausgeschlossen.'},
];

const FOTO_VORBEREITUNG = [
'Fenster geputzt, Storen und Rollläden einheitlich hochgezogen',
'Alle Räume aufgeräumt, Flächen geleert, persönliche Gegenstände weggeräumt',
'Küche vollständig abgeräumt, keine Geräte und keine Tücher sichtbar',
'Nassräume geleert: keine Hygieneartikel, keine Tücher, WC-Deckel geschlossen',
'Betten gemacht, einheitliche Wäsche, Teppiche gerade',
'Alle Lampen funktionstüchtig, gleiche Lichtfarbe, Leuchtmittel ersetzt',
'Fahrzeuge aus der Einfahrt und vor dem Haus entfernt',
'Garten gemäht, Laub entfernt, Gartenmöbel gestellt und gereinigt',
'Abfall- und Recyclingbehälter aus dem Sichtfeld',
'Haustiere und Tierzubehör während der Aufnahme nicht im Haus',
'Heizung so eingestellt, dass keine Kondensation an den Fenstern entsteht',
'Bei Aussenaufnahmen: Wetter- und Sonnenstand am Vortag prüfen, Termin notfalls verschieben',
];

/* -------------------------------------------------- Teil K · CRM-Struktur */
const CRM_FELDER = [
{feld: 'Interessenten-Nr.', art: 'Text', zweck: 'Eindeutige Kennung, fortlaufend je Objekt'},
{feld: 'Objekt', art: 'Text', zweck: 'Objektnummer, damit Interessenten über Objekte hinweg auswertbar sind'},
{feld: 'Name', art: 'Text', zweck: 'Vollständiger Name aller Kaufinteressenten'},
{feld: 'Kontakt Telefon', art: 'Text', zweck: 'Direktnummer'},
{feld: 'Kontakt E-Mail', art: 'Text', zweck: 'Korrespondenzadresse'},
{feld: 'Datum Anfrage', art: 'Datum', zweck: 'Startpunkt der Reaktionszeitmessung'},
{feld: 'Quelle', art: 'Auswahl', zweck: 'Portal, Website, Newsletter, Empfehlung, Schild, Direktkontakt'},
{feld: 'Personen im Haushalt', art: 'Zahl', zweck: 'Passung zum Objekt'},
{feld: 'Aktuelle Wohnsituation', art: 'Auswahl', zweck: 'Miete, Eigentum mit Verkaufsbedarf, Eigentum ohne Verkaufsbedarf'},
{feld: 'Staatsangehörigkeit und Ausländerstatus', art: 'Text', zweck: 'Erwerbsrechtliche Zulässigkeit (R34); vor Terminvergabe erfassen'},
{feld: 'Finanzierung vorhanden', art: 'Auswahl', zweck: 'nein, in Abklärung, Selbstauskunft, schriftliche Bestätigung'},
{feld: 'Finanzierende Bank', art: 'Text', zweck: 'Ansprechpartner für die Verifikation, nur mit Einwilligung'},
{feld: 'Eigenmittel total', art: 'CHF', zweck: 'Plausibilisierung'},
{feld: 'davon harte Eigenmittel', art: 'CHF', zweck: 'Ohne Guthaben der zweiten Säule; Rahmen der Selbstregulierung (R40)'},
{feld: 'Gewünschter Einzug', art: 'Datum', zweck: 'Passung zum Terminwunsch des Eigentümers'},
{feld: 'Dossier versandt am', art: 'Datum', zweck: 'Nachweis der Unterlagenabgabe'},
{feld: 'Besichtigung am', art: 'Datum', zweck: 'Erste Besichtigung'},
{feld: 'Zweitbesichtigung am', art: 'Datum', zweck: 'Starkes Kaufsignal'},
{feld: 'Interesse', art: 'Auswahl', zweck: 'hoch, mittel, gering, keines'},
{feld: 'Stufe', art: 'Auswahl', zweck: 'A finanziert und entscheidungsfähig, B Finanzierung offen, C nicht qualifiziert'},
{feld: 'Angebot', art: 'Auswahl', zweck: 'nein, angekündigt, eingegangen, zurückgezogen'},
{feld: 'Angebotsdatum', art: 'Datum', zweck: 'Reihenfolge bei mehreren Angeboten'},
{feld: 'Angebotspreis', art: 'CHF', zweck: 'Vergleich und Controlling'},
{feld: 'Bedingungen und Vorbehalte', art: 'Text', zweck: 'Finanzierungsvorbehalt, Verkauf eigener Liegenschaft, Gutachten'},
{feld: 'Finanzierungsnachweis', art: 'Auswahl', zweck: 'fehlt, Selbstauskunft, Bankbestätigung objektbezogen'},
{feld: 'Identifikation GwG', art: 'Auswahl', zweck: 'offen, erfasst, vollständig dokumentiert (R37)'},
{feld: 'Status', art: 'Auswahl', zweck: 'neu, qualifiziert, Besichtigung terminiert, besichtigt, Angebot, Verhandlung, Reservation, abgeschlossen, abgesagt'},
{feld: 'Absagegrund', art: 'Auswahl', zweck: 'Preis, Lage, Zustand, Grösse, Finanzierung, Zeitpunkt, anderes Objekt, Lärm, Sanierungsbedarf'},
{feld: 'Nächste Aktion', art: 'Text', zweck: 'Konkrete Handlung, nicht «nachfassen»'},
{feld: 'Nächste Aktion fällig', art: 'Datum', zweck: 'Steuert die Wiedervorlage'},
{feld: 'Zuständig', art: 'Text', zweck: 'Verantwortliche Person'},
{feld: 'Datenschutz: Löschfrist', art: 'Datum', zweck: 'Pflichtfeld; Zweckbindung und Löschung dokumentieren (R39)'},
{feld: 'Bemerkungen', art: 'Text', zweck: 'Gesprächsnotizen, sachlich formuliert – der Eintrag ist auskunftspflichtig (R39)'},
];

/* ------------------------------------------- Teil U · Controlling-Kennzahlen */
const KENNZAHLEN = [
{k: 'Tage am Markt', def: 'Kalendertage seit der Veröffentlichung', ziel: 'Segmentabhängig; ab 90 Tagen Strategieüberprüfung'},
{k: 'Anzahl Anfragen', def: 'Alle eingegangenen Kontaktaufnahmen', ziel: 'In den ersten 14 Tagen der grösste Teil'},
{k: 'Anfragen pro Woche', def: 'Anfragen der Kalenderwoche', ziel: 'Rückgang unter 20 Prozent des Startwerts ist ein Warnsignal'},
{k: 'Reaktionszeit', def: 'Stunden von der Anfrage bis zur ersten Antwort', ziel: 'Unter 4 Arbeitsstunden'},
{k: 'Anzahl Interessenten', def: 'Im CRM erfasste Personen oder Haushalte', ziel: '—'},
{k: 'Anzahl qualifizierte Interessenten', def: 'Stufe A: finanziert und entscheidungsfähig', ziel: 'Mindestens 20 Prozent der Anfragen'},
{k: 'Anzahl verhandlungsfähige Interessenten', def: 'Funnelstufe 7 und höher: Angebot vollständig und finanziell belegt', ziel: 'Der Indikator, der Abschlussnähe tatsächlich abbildet'},
{k: 'Anzahl Besichtigungen', def: 'Durchgeführte Termine', ziel: '—'},
{k: 'Quote Anfrage zu Besichtigung', def: 'Besichtigungen geteilt durch Anfragen', ziel: 'Tiefe Quote deutet auf Preis- oder Erwartungsproblem'},
{k: 'Anzahl Zweitbesichtigungen', def: 'Termine mit demselben Interessenten', ziel: 'Stärkster Frühindikator für ein Angebot'},
{k: 'Anzahl Absagen', def: 'Interessenten mit Status abgesagt', ziel: '—'},
{k: 'Gründe für Absagen', def: 'Verteilung nach Absagegrund', ziel: 'Häufung bei «Preis» ab 5 Nennungen erfordert Preisgespräch'},
{k: 'Anzahl Angebote', def: 'Schriftlich eingegangene Kaufangebote', ziel: '—'},
{k: 'Angebotspreise', def: 'Einzelwerte aller Angebote', ziel: '—'},
{k: 'Durchschnittlicher Angebotspreis', def: 'Mittel aller eingegangenen Angebote', ziel: '—'},
{k: 'Höchstes Angebot', def: 'Grösster Angebotswert', ziel: '—'},
{k: 'Abweichung zum Angebotspreis', def: 'Höchstes Angebot geteilt durch Angebotspreis, minus 1', ziel: 'Abweichung über 10 Prozent nach unten: Preisstrategie prüfen'},
{k: 'Abweichung zur Bewertung', def: 'Erzielter Preis im Verhältnis zur bewerteten Spanne', ziel: 'Innerhalb der Spanne'},
{k: 'Preisreduktionen', def: 'Anzahl und Höhe der Anpassungen mit Datum', ziel: 'Möglichst keine; jede Reduktion schwächt die Verhandlungsposition'},
{k: 'Quote Besichtigung zu Angebot', def: 'Angebote geteilt durch Besichtigungen', ziel: 'Unter 10 Prozent nach 10 Besichtigungen: Ursache klären'},
{k: 'Dauer Einigung bis Beurkundung', def: 'Kalendertage', ziel: 'Verzögerungen meist durch fehlende Unterlagen beim Notariat'},
{k: 'Dauer Beurkundung bis Eintragung', def: 'Kalendertage', ziel: 'Kantonal unterschiedlich'},
{k: 'Aktueller Status', def: 'Phase 1 bis 20 gemäss Teil B', ziel: 'Wöchentlich aktualisieren'},
{k: 'Vermarktungskosten', def: 'Aufgelaufene Kosten gegen Budget', ziel: 'Innerhalb der Budgetfreigabe'},
];

/* -------------------------------------------- Teil S · Ordner und Benennung */
const ORDNER = [
{nr: '01', name: 'Eigentümer', inhalt: 'Eigentümerangaben, Ausweise, Adressnachweise, Vollmachten, Erbbescheinigung, KESB-Zustimmung, Identifikationsdossier GwG, Datenschutzerklärung mit Empfangsbestätigung'},
{nr: '02', name: 'Grundbuch und Recht', inhalt: 'Grundbuchauszug, Belege zu Dienstbarkeiten, Grundlasten, Anmerkungen und Vormerkungen, Baurechtsvertrag, Prüfbericht Recht, Korrespondenz mit Grundbuchamt und Rechtsberatung'},
{nr: '03', name: 'Grundstück', inhalt: 'Katasterplan, Situationsplan, Zonenauskunft, Nutzungskennzahlen, Baulinien, Katasterauszug belastete Standorte, Naturgefahrenkarte, Erschliessungsnachweise, Auskünfte der Gemeinde'},
{nr: '04', name: 'Gebäude und Technik', inhalt: 'Baupläne, Baubewilligungen, Renovationsnachweise, Gebäudeversicherungsausweis, Heizungs- und Haustechnikunterlagen, GEAK, Photovoltaik, Sicherheitsnachweis Elektro, Schadstoffabklärung'},
{nr: '05', name: 'Bewertung', inhalt: 'Objektaufnahme, Marktanalyse, Vergleichsobjekte mit Quellen, Bewertungsbericht, Nettoerlösrechnung, Protokoll Preisentscheid'},
{nr: '06', name: 'Maklervertrag', inhalt: 'Mandat mit Beilagen, Mängelliste, Inventarliste, Budgetfreigabe, Nachträge, Korrespondenz zum Mandat'},
{nr: '07', name: 'Vermarktung', inhalt: 'Fotografien in Web- und Druckauflösung, Grundrisse, Videos, 360-Grad-Rundgang, Inseratstexte je Kanal, Kontrollausdrucke, Freigaben des Eigentümers'},
{nr: '08', name: 'Verkaufsdossier', inhalt: 'Dossier je Version, Kurzdossier, Kaufnebenkostenübersicht des Notariats'},
{nr: '09', name: 'Interessenten', inhalt: 'CRM-Auszüge, Interessentenformulare, Versandprotokolle, Empfangsbestätigungen Dossier, Absagen'},
{nr: '10', name: 'Besichtigungen', inhalt: 'Terminplanung, Besichtigungsprotokolle mit Offenlegungsvermerk, Rückmeldungen'},
{nr: '11', name: 'Angebote', inhalt: 'Kaufangebote, Finanzierungsbestätigungen, Eigenmittelnachweise, Identifikationsdossiers Käufer, Angebotsvergleich'},
{nr: '12', name: 'Verhandlungen', inhalt: 'Entscheidungsvorlagen, schriftliche Verhandlungsaufträge des Eigentümers, Verhandlungsprotokolle, Gegenangebote'},
{nr: '13', name: 'Notariat', inhalt: 'Notariatsauftrag, Notariatscheckliste, Korrespondenz, Terminbestätigungen, Gebührenaufstellung'},
{nr: '14', name: 'Kaufvertrag', inhalt: 'Entwürfe mit Versionsstand, Prüfbemerkungen, beurkundete Ausfertigung, Vertragsbeilagen, Grundbuchanmeldung, Eintragungsbestätigung'},
{nr: '15', name: 'Übergabe', inhalt: 'Übergabeprotokoll, Schlüssel- und Zählerliste, Fotos der Zählerstände, Empfangsbestätigung übergebener Dokumente, Nachverfolgung offener Punkte'},
{nr: '16', name: 'Finanzen', inhalt: 'Hypothekarunterlagen, Ablösekonditionen, Schuldbriefübersicht, Zahlungsbestätigungen, Steuerberechnung, Sicherstellung, Honorarrechnung, Vermarktungskosten'},
{nr: '17', name: 'Abschluss', inhalt: 'Abschlusscheckliste, Kennzahlenblatt, Abschlussbericht, Protokoll Abschlussgespräch, Referenz mit Einwilligung, Archivierungsvermerk mit Aufbewahrungsfrist'},
];

const BENENNUNG = [
{regel: 'Aufbau', wert: '[JJJJ-MM-TT]_[Dokumentart]_[Präzisierung].[Endung]'},
{regel: 'Datum', wert: 'Datum des Dokuments, nicht des Ablegens. Format JJJJ-MM-TT, damit die Sortierung chronologisch bleibt.'},
{regel: 'Dokumentart', wert: 'Aus einer festen Liste, in Grossschreibung am Wortanfang: Grundbuchauszug, Katasterplan, Zonenauskunft, Baubewilligung, Bewertungsbericht, Maklermandat, Kaufangebot, Kaufvertrag, Uebergabeprotokoll.'},
{regel: 'Präzisierung', wert: 'Parzelle, Bauteil, Name oder Version. Mit Bindestrich verbunden.'},
{regel: 'Zeichen', wert: 'Nur Buchstaben, Zahlen, Bindestrich und Unterstrich. Keine Umlaute, keine Leerzeichen, keine Sonderzeichen – Umlaute werden umschrieben: ae, oe, ue.'},
{regel: 'Versionen', wert: 'Endung _v1, _v2; die finale Fassung _final. Keine Dateinamen wie «neu» oder «aktuell».'},
{regel: 'Personenbezug', wert: 'Bei Interessentendokumenten Nachname und Interessentennummer, damit die Löschung nach Frist zuordenbar bleibt.'},
];

const BENENNUNG_BEISPIELE = [
'2026-09-18_Grundbuchauszug_Parzelle-1234.pdf',
'2026-09-18_Katasterplan_Parzelle-1234.pdf',
'2026-09-22_Zonenauskunft_Gemeinde-Musterwil.pdf',
'2026-09-25_Objektaufnahme_Musterstrasse-12_v1.xlsx',
'2026-10-02_Bewertungsbericht_Musterstrasse-12_final.pdf',
'2026-10-08_Maklermandat_Muster-Anna-und-Beat_signiert.pdf',
'2026-10-20_Verkaufsdossier_Musterstrasse-12_v2.pdf',
'2026-11-14_Kaufangebot_Meier-I-0042.pdf',
'2026-11-14_Finanzierungsbestaetigung_Meier-I-0042.pdf',
'2026-11-28_Kaufvertrag_Entwurf_v3.pdf',
'2026-12-15_Kaufvertrag_beurkundet.pdf',
'2027-01-31_Uebergabeprotokoll_Musterstrasse-12_signiert.pdf',
];

module.exports = {MANDAT, DOSSIER, INSERAT_KANAELE, INSERAT_ABSCHNITTE,
  FOTO_PFLICHT, FOTO_MEIDEN, FOTO_REIHENFOLGE, FOTO_ZUSATZ, FOTO_VORBEREITUNG,
  CRM_FELDER, KENNZAHLEN, ORDNER, BENENNUNG, BENENNUNG_BEISPIELE};
