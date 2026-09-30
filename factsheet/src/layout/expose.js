// Vorbereitung «Verkaufsexposé erstellen» (Version 2).
//
// Das Exposé verwendet dasselbe Datenmodell (schema.js), dieselbe Faktenaufbereitung (facts.js),
// dasselbe Design-System (design.js) und dieselben Block-Renderer wie das Factsheet.
// Neu hinzu kommen nur: zusätzliche KI-Textbausteine (Mikro-/Makrolage, Gebäude, Wohnungen,
// Aussenbereich, Mietersituation) und Seitenvorlagen ohne 2-Seiten-Grenze.
//
// Die Gliederung unten ordnet jedem Kapitel die Datenquellen zu. Kapitel ohne Daten entfallen
// automatisch – wie beim Factsheet wird nichts ergänzt.

export const EXPOSE_OUTLINE = [
  { id: 'titel', title: 'Titelblatt', sources: ['object', 'images.cover'], ai: ['title'] },
  { id: 'objekt', title: 'Objektbeschreibung', sources: ['object', 'units'], ai: ['objektbeschreibung'] },
  { id: 'lage', title: 'Lage', sources: ['object.location'], ai: ['mikrolage', 'makrolage'], newFields: ['object.macroLocation', 'object.microLocation'] },
  { id: 'gebaeude', title: 'Gebäude', sources: ['object.yearBuilt', 'object.condition', 'object.heating', 'investments'], ai: ['gebaeude'] },
  { id: 'wohnungen', title: 'Wohnungen & Grundrisse', sources: ['units', 'images.floorplan'], ai: ['wohnungen'], newFields: ['images.floorplans[]'] },
  { id: 'aussen', title: 'Aussenbereich & Parkierung', sources: ['parking', 'unitsExtra.annex'], ai: ['aussenbereich'], newFields: ['object.outdoor'] },
  { id: 'investitionen', title: 'Investitionen', sources: ['investments'] },
  { id: 'kennzahlen', title: 'Kennzahlen & Mietersituation', sources: ['finance', 'units.rent'], newFields: ['tenancy[]'] },
  { id: 'grundstueck', title: 'Grundstück & Rechtliches', sources: ['land'] },
  { id: 'potenzial', title: 'Potenzial', sources: ['marketing.potential'], ai: ['potenzial'] },
  { id: 'prozess', title: 'Verkaufsprozess', sources: ['process'] },
  { id: 'kontakt', title: 'Ansprechpartner', sources: ['contacts'] },
];
