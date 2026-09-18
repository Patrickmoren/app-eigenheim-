/* Erzeugt 04_Verkaufsdossier_Vorlage – die 23 Abschnitte als Platzhaltervorlage. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkte, tabelle, info, recht, praxis,
       titelblatt, checks, felder, linien} = require('../lib/blocks.js');
const B = require('./bausteine.js');
const {STAND} = require('./handbuch2.js');

/* Platzhalterblock für eine Bildfläche */
const bildflaeche = (bez, anzahl) => tabelle([bez],
  Array.from({length: anzahl}, () => ['']), [9600]);

function bloecke() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  push(titelblatt({
    marke: 'Verkaufsdossier',
    titel: '[Objektbezeichnung], [Ort]',
    untertitel: '[Angebotspreis CHF … / Preis auf Anfrage]',
    stand: '[Ausgabedatum] · Version [x] · [Firma]'}));

  push(info('Zur Verwendung dieser Vorlage', [
    'Diese Vorlage folgt der Struktur in Teil H des Makler-Handbuchs. Die Reihenfolge der 23 Abschnitte ist verbindlich; sie folgt der Lesereihenfolge eines Kaufinteressenten.',
    'Alle Platzhalter in eckigen Klammern sind zu ersetzen. Ein nicht zutreffender Abschnitt wird mit «nicht zutreffend» bezeichnet und nicht gelöscht – so bleibt die Struktur über alle Objekte vergleichbar.',
    'Unter jedem Abschnitt steht in Kursivschrift, was hineingehört und woher die Angabe kommt. Diese Hinweiszeilen werden in der Endfassung entfernt.',
    'Jede Zahl braucht eine Quelle. Grundstücksfläche aus dem Grundbuchauszug, Wohnfläche aus dem Plan mit Berechnungsnorm, Volumen und Versicherungswert aus dem Gebäudeversicherungsausweis.']));
  push(recht([
    'Jede Angabe in diesem Dossier kann gegenüber dem Käufer als zugesicherte Eigenschaft gelten (Art. 197 ff. OR). Es werden ausschliesslich belegte Angaben aufgenommen.',
    'Abschnitt 18 (Renovationen und Sanierungsbedarf) und der Verweis auf die Mängelliste sind Teil der Offenlegung. Eine Wegbedingung der Gewährleistung im Kaufvertrag ist ungültig, soweit Mängel arglistig verschwiegen wurden (Art. 199 OR).',
    'Abschnitt 21 (Kaufnebenkosten) ist für den konkreten Kanton beim Notariat zu erfragen und als Spanne mit Quelle, Datum und Unverbindlichkeitsvermerk auszuweisen.',
    'Der Text von Abschnitt 23 (rechtliche Hinweise) ist durch die Rechtsberatung freizugeben und unverändert zu übernehmen.']));
  push(leer());
  push(h2('Vor der Freigabe zu prüfen'));
  push(checks([
    'Jede Zahl gegen die Quelle geprüft: Grundstücksfläche, Wohnfläche, Nebenfläche, Volumen, Versicherungswert, Baujahr, Sanierungsjahre',
    'Wohnfläche mit Berechnungsnorm und Quelle deklariert',
    'Bekannte Mängel und Sanierungsbedarf in Abschnitt 18 offengelegt',
    'Dienstbarkeiten, Anmerkungen und Nutzungsbeschränkungen in Abschnitt 7 in Klartext erläutert',
    'Ausbaupotenzial nur mit schriftlicher behördlicher Bestätigung erwähnt',
    'Energieangaben nur bei vorliegendem GEAK, mit Nummer und Datum',
    'Kaufnebenkosten für den zutreffenden Kanton mit Quelle und Datum',
    'Bilder mit virtueller Möblierung als solche bezeichnet',
    'Keine identifizierbaren Personen, keine Nachbarfenster, keine Kennzeichen auf den Bildern',
    'Vier-Augen-Prüfung im Team erfolgt',
    'Schriftliche Freigabe des Eigentümers eingeholt']));

  B.DOSSIER.forEach(d => {
    push(h1neu(`${d.nr}. ${d.titel}`));
    push(abs(d.inhalt, {italics: true}));
    push(leer());

    switch (d.nr) {
      case 1:
        push(bildflaeche('[Aussenaufnahme Hauptfassade – Leitbild]', 8));
        push(felder(['Objektbezeichnung', 'Ort', 'Angebotspreis', 'Ausgabedatum und Version']));
        break;
      case 2:
        push(abs('[Fünf bis acht Sätze: Was ist das Objekt, für wen ist es geeignet, was fällt auf. Nüchtern, ohne Superlative. Keine Aussage, die nicht im Dossier belegt ist.]'));
        push(linien(6));
        break;
      case 3:
        push(abs('[Fünf bis sieben belegbare Punkte. Jeder Punkt muss an einer Zahl oder einem Beleg in diesem Dossier festgemacht werden können.]', {italics: true}));
        push(punkte(['[Verkaufsargument 1]', '[Verkaufsargument 2]', '[Verkaufsargument 3]',
          '[Verkaufsargument 4]', '[Verkaufsargument 5]', '[Verkaufsargument 6]',
          '[Verkaufsargument 7]']));
        break;
      case 4:
        push(bildflaeche('[Bildseite: Aussenansicht · Wohnbereich · Küche · Aussenbereich]', 10));
        break;
      case 5:
        push(tabelle(['Eckdatum', 'Angabe', 'Quelle'], [
          ['Objekttyp', '', ''], ['Baujahr', '', 'Gebäuderegister / Baubewilligung'],
          ['Letzte Sanierung', '', 'Renovationsnachweis'],
          ['Wohnfläche', '', 'Plan, Norm: [Norm]'],
          ['Nebenfläche', '', 'Plan'],
          ['Grundstücksfläche', '', 'Grundbuchauszug vom [Datum]'],
          ['Gebäudevolumen', '', 'Gebäudeversicherungsausweis'],
          ['Anzahl Zimmer', '', 'Zählweise: [Angabe]'],
          ['Anzahl Nassräume', '', ''], ['Geschosse', '', ''],
          ['Parkplätze', '', ''], ['Heizsystem und Energieträger', '', ''],
          ['GEAK-Klasse Hülle / Gesamt', '', 'GEAK Nr. [Nummer] vom [Datum]'],
          ['Verfügbarkeit', '', ''], ['Angebotspreis', '', ''],
        ], [3000, 3600, 3000]));
        break;
      case 6:
        push(felder(['Gemeinde und Quartier', 'Charakter der Lage',
          'ÖV: Haltestelle, Linien, Gehminuten', 'Bahnhof: Distanz und Fahrzeit zum Zentrum',
          'Autobahnanschluss: Distanz', 'Einkauf: Angebot und Gehminuten',
          'Schulen: Stufen und Gehminuten', 'Kinderbetreuung',
          'Ärzte, Apotheke, Spital', 'Freizeit und Naherholung',
          'Steuerfuss der Gemeinde (Jahr)']));
        push(bildflaeche('[Karte mit Objektmarkierung]', 6));
        break;
      case 7:
        push(tabelle(['Angabe', 'Wert', 'Quelle und Datum'], [
          ['Parzellennummer', '', 'Grundbuchauszug'],
          ['Grundstücksfläche', '', 'Grundbuchauszug'],
          ['Bauzone', '', 'Gemeindeauskunft vom [Datum]'],
          ['Nutzungskennzahlen', '', 'Gemeindeauskunft vom [Datum]'],
          ['Topografie und Ausrichtung', '', 'Begehung'],
          ['Erschliessung', '', 'Gemeinde / Werke'],
        ], [3000, 3600, 3000]));
        push(h4('Dienstbarkeiten, Grundlasten, Anmerkungen und Vormerkungen'));
        push(abs('[Je Position in Klartext: Was belastet oder begünstigt das Grundstück, wen betrifft es, welche praktische Bedeutung hat es für den Käufer, welche Unterhaltspflichten folgen daraus. Belegverweis angeben.]', {italics: true}));
        push(tabelle(['Position', 'Art', 'Betrifft', 'Praktische Bedeutung', 'Beleg'],
          Array.from({length: 6}, () => ['', '', '', '', '']),
          [1000, 1600, 1600, 3800, 1600]));
        break;
      case 8:
        push(tabelle(['Bauteil', 'Ausführung', 'Jahr der letzten Erneuerung', 'Zustand'], [
          ['Bauweise und Tragstruktur', '', '', ''], ['Dach', '', '', ''],
          ['Fassade', '', '', ''], ['Fenster', '', '', ''],
          ['Aussentüren', '', '', ''], ['Sonnenschutz', '', '', ''],
        ], [2600, 2800, 2400, 1800]));
        push(felder(['Gebäudevolumen und Berechnungsnorm',
          'Gebäudeversicherungswert und Schatzungsdatum']));
        break;
      case 9:
        push(tabelle(['Geschoss', 'Räume', 'Fläche', 'Belichtung und Ausrichtung', 'Bodenbelag und Jahr'],
          Array.from({length: 6}, () => ['', '', '', '', '']),
          [1600, 2400, 1200, 2400, 2000]));
        break;
      case 10:
        push(felder(['Jahr der Erstellung bzw. Renovation', 'Form und Fläche',
          'Korpus, Fronten, Arbeitsfläche',
          'Geräte mit Fabrikat und Baujahr', 'Garantien', 'Anbindung an den Essbereich']));
        push(bildflaeche('[Küche: Gesamtansicht und Detail]', 6));
        break;
      case 11:
        push(tabelle(['Nassraum', 'Geschoss', 'Jahr', 'Ausstattung', 'Belüftung', 'Bodenheizung'],
          Array.from({length: 4}, () => ['', '', '', '', '', '']),
          [1600, 1400, 900, 2900, 1600, 1200]));
        break;
      case 12:
        push(felder(['Gartenfläche und Gestaltung', 'Terrasse: Lage, Material, Jahr',
          'Balkon: Anzahl, Lage, Material', 'Sitzplatz und Beschattung',
          'Einfriedung und Sichtschutz', 'Pool, Teich, Whirlpool mit Technik und Unterhalt',
          'Bewässerung und Aussenbeleuchtung']));
        push(bildflaeche('[Garten, Terrasse, Sitzplatz]', 8));
        break;
      case 13:
        push(felder(['Keller: Anzahl, Fläche, Nutzung', 'Estrich: Fläche und Ausbaustatus',
          'Technikraum', 'Waschraum mit Geräten und Baujahr', 'Reduit und Abstellräume',
          'Nebengebäude mit Bewilligungsstatus']));
        break;
      case 14:
        push(felder(['Garage: Art und Anzahl Plätze', 'Tor und Antrieb, Anzahl Fernbedienungen',
          'Aussenparkplätze: Anzahl, gedeckt oder offen',
          'Ladeinfrastruktur für Elektrofahrzeuge',
          'Eigentums- oder Mietverhältnis der Parkplätze']));
        break;
      case 15:
        push(abs('[Alle Geschosse, neu gezeichnet, mit Flächenangaben, Nordpfeil, Massstabshinweis und Legende. Möblierungsstandard über alle Geschosse gleich.]', {italics: true}));
        push(bildflaeche('[Grundriss Untergeschoss]', 9));
        push(bildflaeche('[Grundriss Erdgeschoss]', 9));
        push(bildflaeche('[Grundriss Obergeschoss]', 9));
        push(bildflaeche('[Grundriss Dachgeschoss]', 9));
        break;
      case 16:
        push(bildflaeche('[Situationsplan mit Parzellengrenzen, Gebäudeumriss, Zufahrt, Nordpfeil]', 12));
        push(felder(['Quelle und Datum des Plans']));
        break;
      case 17:
        push(tabelle(['Anlage', 'Angabe', 'Jahr', 'Bemerkung'], [
          ['Heizsystem und Energieträger', '', '', ''],
          ['Wärmeerzeuger: Fabrikat und Leistung', '', '', ''],
          ['Wärmeabgabe', '', '', ''], ['Warmwassererzeugung', '', '', ''],
          ['Lüftung', '', '', ''],
          ['Photovoltaik: Leistung in kWp', '', '', ''],
          ['Batteriespeicher', '', '', ''],
          ['Elektroinstallation: letzte periodische Kontrolle', '', '', ''],
          ['Sanitärleitungen', '', '', ''],
          ['Smart Home, Alarm, Sonnenschutz', '', '', ''],
        ], [3200, 2800, 1200, 2400]));
        break;
      case 18:
        push(h4('Durchgeführte Renovationen'));
        push(abs('[Nur belegte Massnahmen. Aufsteigend nach Jahr.]', {italics: true}));
        push(tabelle(['Jahr', 'Bauteil', 'Massnahme und Umfang', 'Beleg vorhanden'],
          Array.from({length: 10}, () => ['', '', '', '']),
          [1000, 2200, 4800, 1600]));
        push(h4('Offener Sanierungsbedarf'));
        push(abs('[Bauteilweise mit Zeithorizont. Dieser Abschnitt wird vollständig ausgefüllt. Ein offen benannter Sanierungsbedarf begrenzt den Preisabschlag auf das Sachliche; ein verschwiegener erzeugt Misstrauen gegenüber allen übrigen Angaben.]', {italics: true}));
        push(tabelle(['Bauteil', 'Feststellung', 'Zeithorizont', 'Bemerkung'],
          Array.from({length: 8}, () => ['', '', '', '']),
          [2200, 4000, 1800, 1600]));
        push(abs('Bekannte Mängel sind in der separaten Mängelliste erfasst. Sie wird jedem Kaufinteressenten vor der Beurkundung abgegeben und ist Bestandteil des Kaufvertrags.'));
        break;
      case 19:
        push(felder(['GEAK-Klasse Gebäudehülle', 'GEAK-Klasse Gesamtenergieeffizienz',
          'GEAK-Nummer und Ausstellungsdatum',
          'Ohne GEAK: Heizsystem und Energieträger',
          'Ohne GEAK: bekannte Verbrauchswerte mit Quelle und Bezugsjahr']));
        push(abs('Ohne vorliegenden GEAK wird keine Energieeffizienz behauptet. Beschrieben wird ausschliesslich die Anlage.', {italics: true}));
        break;
      case 20:
        push(felder(['Angebotspreis Liegenschaft', 'Inventarpreis, falls separat',
          'Verfügbarkeit', 'Frühestmöglicher Übergabetermin']));
        break;
      case 21:
        push(tabelle(['Position', 'Spanne für den Kanton [Kanton]', 'Üblicher Kostenträger', 'Quelle und Datum'], [
          ['Handänderungsabgabe', '', '', ''],
          ['Beurkundungsgebühren', '', '', ''],
          ['Grundbuchgebühren', '', '', ''],
          ['Kosten der Errichtung von Schuldbriefen', '', '', ''],
        ], [2600, 2800, 2200, 2000]));
        push(abs('Diese Angaben sind unverbindliche Richtwerte für den Kanton [Kanton], erfragt beim Notariat [Name] am [Datum]. Die Aufteilung der Kosten zwischen Käuferschaft und Verkäuferschaft wird im Kaufvertrag geregelt. Massgebend sind die kantonalen und kommunalen Tarife.', {italics: true}));
        break;
      case 22:
        push(felder(['Zuständige Person und Funktion', 'Direktnummer', 'E-Mail',
          'Telefonzeiten', 'Firma, Adresse, Website']));
        break;
      case 23:
        push(punkte([
          'Die Angaben in diesem Dossier beruhen auf Unterlagen und Auskünften der Eigentümerschaft sowie auf Auskünften von Behörden. Sie erfolgen nach bestem Wissen, jedoch ohne Gewähr für Vollständigkeit und Richtigkeit.',
          'Dieses Dossier ist kein Angebot im Rechtssinne und enthält keine Zusicherung. Ein Kaufvertrag über ein Grundstück kommt in der Schweiz ausschliesslich durch öffentliche Beurkundung zustande (Art. 216 Abs. 1 OR).',
          'Flächenangaben: Die Grundstücksfläche entspricht dem Grundbuchauszug vom [Datum]. Die Wohnfläche ist nach [Norm] berechnet und der Quelle [Quelle] entnommen. Massabweichungen sind möglich.',
          'Bekannte Mängel sind in der separaten Mängelliste erfasst, die jedem Kaufinteressenten abgegeben wird und Bestandteil des Kaufvertrags ist.',
          'Die Kaufnebenkosten in Abschnitt 21 sind unverbindliche Richtwerte für den Kanton [Kanton]; massgebend sind die kantonalen und kommunalen Tarife.',
          'Mit «virtuell möbliert» bezeichnete Bilder zeigen eine digital eingefügte Einrichtung. Bausubstanz und Ausbau sind unverändert.',
          'Bild- und Planmaterial ist urheberrechtlich geschützt. Vervielfältigung und Weitergabe an Dritte sind ohne schriftliche Zustimmung nicht gestattet.',
          'Personendaten werden gemäss unserer Datenschutzerklärung bearbeitet, abrufbar unter [Adresse].',
          'Ausgabedatum: [Datum] · Version [x]']));
        push(recht(['Dieser Abschnitt ist durch die Rechtsberatung freizugeben und unverändert zu übernehmen. Objektbezogene Angaben in eckigen Klammern sind zu ergänzen, der übrige Text bleibt unverändert.']));
        break;
    }
  });

  return k;
}

module.exports = {bloecke};
