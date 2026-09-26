// Beispiel-API: Bergwetter für Agenten. Die Werte sind Demodaten.
const ORTE = {
  zermatt: { hoehe: 1608, temperatur: 4, wind_kmh: 12, schneefallgrenze: 2400, wetter: "leicht bewölkt" },
  grindelwald: { hoehe: 1034, temperatur: 9, wind_kmh: 8, schneefallgrenze: 2600, wetter: "sonnig" },
  saentis: { hoehe: 2502, temperatur: -3, wind_kmh: 45, schneefallgrenze: 2100, wetter: "Nebel" },
  davos: { hoehe: 1560, temperatur: 6, wind_kmh: 15, schneefallgrenze: 2300, wetter: "wechselhaft" },
};

const ortAus = (url) => url.pathname.split("/")[2]?.toLowerCase();
const pruefeOrt = (url) =>
  ORTE[ortAus(url)] ? null : `Unbekannter Ort. Verfügbar: ${Object.keys(ORTE).join(", ")}`;

module.exports = {
  "/": {
    price: "0",
    description: "Übersicht",
    handler: () => ({
      dienst: "Kairn Bergwetter (Demo)",
      bezahlung: "x402, KAIRN",
      endpunkte: {
        "/orte": "gratis – Liste der Orte",
        "/wetter/<ort>": "0.02 KAIRN – aktuelles Bergwetter",
        "/lawinen/<ort>": "0.10 KAIRN – Lawinenlage",
      },
    }),
  },
  "/orte": { price: "0", description: "Liste der Orte", handler: () => ({ orte: Object.keys(ORTE) }) },
  "/wetter": {
    price: "0.02",
    description: "Aktuelles Bergwetter für einen Ort",
    validate: pruefeOrt,
    handler: (url) => ({ ort: ortAus(url), ...ORTE[ortAus(url)], demo: true }),
  },
  "/lawinen": {
    price: "0.10",
    description: "Lawinengefahrenstufe (1–5) für einen Ort",
    validate: pruefeOrt,
    handler: (url) => {
      const ort = ortAus(url);
      return { ort, gefahrenstufe: ORTE[ort].hoehe > 2000 ? 3 : 2, demo: true, hinweis: "Offizielle Lage: slf.ch" };
    },
  },
};
