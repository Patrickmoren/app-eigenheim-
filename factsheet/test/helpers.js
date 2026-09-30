import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const EXAMPLE_DIR = path.join(ROOT, 'examples', 'neumattstrasse-15');

export function example({ images = true } = {}) {
  const p = JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, 'objekt.json'), 'utf8'));
  p.images = {};
  if (images) {
    for (const [slot, name] of Object.entries({ cover: 'titelbild', object: 'objektfoto', location: 'lagefoto', floorplan: 'grundriss' })) {
      p.images[slot] = `data:image/jpeg;base64,${fs.readFileSync(path.join(EXAMPLE_DIR, `${name}.jpg`)).toString('base64')}`;
    }
  }
  return p;
}

export function exampleTexts() {
  return JSON.parse(fs.readFileSync(path.join(EXAMPLE_DIR, 'texte.json'), 'utf8'));
}

// Objekt mit allen optionalen Angaben in grossem Umfang – Belastungstest für die 2-Seiten-Grenze.
export function maximalObject() {
  const p = example();
  p.object.type = 'Mehrfamilienhaus';
  p.object.yearBuilt = 1964;
  p.object.livingArea = 1180;
  p.object.condition = 'Gebäudehülle 2012 energetisch saniert, Küchen und Bäder zwischen 2015 und 2021 in zehn Wohnungen erneuert, übrige Wohnungen im Originalzustand mit laufendem Unterhalt; Flachdach 2018 neu abgedichtet.';
  p.object.location += ' Einkaufsmöglichkeiten (Coop, Migros) in 400 m, Primar- und Sekundarschule in 600 m, Tramhaltestelle Linie 10 in 250 m.';
  p.units = [
    { count: 4, kind: 'Wohnung', rooms: 2.5, area: 58, floor: 'EG–3. OG', rent: 1450, features: 'Balkon, Kellerabteil' },
    { count: 6, kind: 'Wohnung', rooms: 3.5, area: 78, floor: 'EG–3. OG', rent: 1780, features: 'Balkon, 2016 renoviert' },
    { count: 4, kind: 'Wohnung', rooms: 4.5, area: 96, floor: '1.–3. OG', rent: 2150, features: 'Balkon, Reduit, 2019 renoviert' },
    { count: 1, kind: 'Gewerbe', rooms: '', area: 120, floor: 'EG', rent: 2400, features: 'Ladenlokal mit Schaufensterfront' },
    { count: 1, kind: 'Atelier', rooms: '', area: 45, floor: 'UG', rent: 650, features: 'separater Zugang' },
  ];
  p.unitsExtra.annex = 'Kellerabteile, 2 Waschküchen mit Trockenraum, Veloraum, Hobbyraum, Estrich';
  p.parking = { garage: 16, outdoor: 6, visitor: 2, other: '4 Motorradplätze' };
  p.finance = {
    rentActual: 339600, rentTarget: 362400, occupancy: 97, ancillary: 'Akonto, gemäss Heizkostenabrechnung',
    priceLabel: 'Kaufpreisvorstellung', price: 9850000, insuranceValue: 8900000, showGrossYield: true,
    kpis: [{ label: 'Leerstand', value: '1 Wohnung (Stichtag 30.09.2026)' }, { label: 'Betriebskosten', value: 'CHF 41’000 p.a.' }],
  };
  p.land = {
    ownership: 'Stockwerkeigentum, alle Einheiten in einer Hand', zone: 'Wohnzone W4', oereb: 'Keine Einträge im ÖREB-Kataster ausser Zonenplan und Lärmempfindlichkeitsstufe',
    buildingLines: 'Strassenbaulinie 4 m', noiseLevel: 'ES II', encumbrances: 'Fuss- und Fahrwegrecht zugunsten Parzelle 1905',
    parcels: [
      { number: '1904', area: 1890, ownership: 'Stockwerkeigentum', share: '1000/1000', note: 'Hauptliegenschaft' },
      { number: '1904-1', area: '', ownership: 'Miteigentum', share: '16/22', note: 'Einstellhalle' },
      { number: '1911', area: 210, ownership: 'Alleineigentum', share: '', note: 'Aussenparkplätze' },
    ],
  };
  p.object.plotArea = 2100;
  p.investments = Array.from({ length: 9 }, (_, i) => ({ year: 2012 + i, measure: `Massnahme ${i + 1}: Erneuerung von Küchen, Bädern und Leitungen in einzelnen Wohnungen` }));
  p.marketing.highlights = 'Gut vermietetes Wohn- und Geschäftshaus\nTramhaltestelle in 250 m\nMietzinspotenzial gemäss SOLL-Mietertrag\nEinstellhalle mit 16 Plätzen\nLadenlokal im EG';
  p.marketing.potential = 'Dachausbau gemäss Vorabklärung Bauamt möglich; Mietzinsanpassung bei Mieterwechsel';
  p.process = {
    situation: 'Die Eigentümerschaft hat die Schaeppi Grundstücke AG mit dem Verkauf der Liegenschaft im Rahmen eines strukturierten Bieterverfahrens beauftragt.',
    ndaRequired: true, stages: 'zweistufig', viewing: 'Nach Vereinbarung ab 15.10.2026', indicativeOffer: '31.10.2026',
    dueDiligence: 'Datenraum ab 10.11.2026 für ausgewählte Interessenten', bindingOffer: '15.12.2026', timeline: 'Eigentumsübertragung im 1. Quartal 2027',
  };
  p.contacts.push({ name: 'Maria Muster', role: 'Transaktionsberaterin', phone: '+41 61 225 20 00', email: 'm.muster@schaeppi.ch' });
  return p;
}

export function longTexts() {
  const s = (n, word) => Array.from({ length: n }, (_, i) => `Satz ${word} Nummer eins mit sachlichem Inhalt ohne neue Fakten und in üblicher Länge.`).join(' ');
  return {
    provider: 'test',
    title: 'Mehrfamilienhaus mit Einstellhalle und Ladenlokal',
    overview: { ausgangslage: s(6, 'A'), objektLage: s(7, 'B'), baujahrInvestitionen: s(6, 'C'), einheiten: s(6, 'D') },
    arguments: Array.from({ length: 5 }, (_, i) => ({ title: `Argument ${i + 1} mit längerem Titel`, text: s(3, 'E'), basis: ['lage'] })),
    edited: {},
  };
}
