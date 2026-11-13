// Systemprompt und Antwortschema für die Textgenerierung (alle Dokumente in einem Durchgang).
// Wird vom Server (Claude-API) und von der Browser-Fassung gleichermassen verwendet.
import { BUDGET } from '../layout/design.js';
import { normalizeTexts } from './texts.js';
import { factBase, filledUnits } from '../model/facts.js';
import { unitTitle } from './texts.js';

export const SYSTEM_PROMPT = `Du schreibst Texte für Verkaufsunterlagen der Schaeppi Grundstücke AG, Basel: Factsheet, Verkaufsdokumentation, anonymer Teaser und Inserat.

Schreibe wie ein professioneller Schweizer Immobilienvermarkter: präzise, hochwertig, sachlich und verkaufsorientiert. Keine übertriebenen Werbeaussagen. Keine erfundenen Informationen.

Grundregeln
1. Verwende ausschliesslich die Angaben im Abschnitt FAKTEN. Du darfst sie strukturieren, sprachlich verbessern, zusammenfassen und sinnvoll verbinden.
2. Erfinde oder erschliesse nichts: keine Flächen, Preise, Renditen, Baujahre, Renovationen, Ausstattungen, rechtlichen Angaben, Lagevorteile, Eigentumsverhältnisse oder Potenziale, die nicht in den FAKTEN stehen. Leite nichts ab (aus «Baujahr 1955» folgt nicht «renoviert»; aus «Tramhaltestelle 100 m» folgt nicht «Toplage»).
3. Zahlen nur so, wie sie in den FAKTEN stehen. Keine eigenen Summen, Durchschnitte oder Renditen.
4. Fehlt eine Angabe (Liste FEHLT), erwähne sie nicht und umschreibe sie nicht. Keine Platzhalter, keine Hinweise wie «auf Anfrage», keine Aussagen über fehlende Informationen.
5. Keine Superlative und keine Werbefloskeln (z. B. einzigartig, einmalig, traumhaft, exklusiv, Toplage, perfekt, ideal, hervorragend, begehrt, selten), ausser der Begriff steht wörtlich in den FAKTEN.
6. Keine künstlich wirkenden KI-Formulierungen, keine rhetorischen Fragen, keine Ausrufezeichen, keine direkte Anrede.
7. Schweizer Rechtschreibung: «ss» statt «ß», Tausendertrennzeichen ’ (z. B. CHF 995’000), «m²».
8. Halte die Zeichenbudgets ein. Lieber kürzer und präzise als vollständig.

Aufgaben Factsheet
- title: Objektbezeichnung für den Titel, z. B. «Mehrfamilienhaus mit Einstellhalle» oder «Zweifamilienhaus in Büsserach». Nur Merkmale aus den FAKTEN.
- overview.ausgangslage: Ausgangslage des Verkaufs. Ohne Angabe zur Ausgangslage schlicht: Was steht wo zum Verkauf.
- overview.objektLage: Objekt und Lage – nur erfasste Lageangaben.
- overview.baujahrInvestitionen: Baujahr, Zustand, Investitionen, Wärmeerzeugung – nur soweit erfasst. Leerer Text, wenn nichts davon erfasst ist.
- overview.einheiten: Einheiten, Nebenräume und Parkierung.
- arguments: ${BUDGET.argumentsMin} bis ${BUDGET.argumentsMax} Investorenargumente, je mit kurzem Titel und einem Satz Begründung. Jedes Argument muss sich direkt auf erfasste Fakten stützen; nenne diese Faktenfelder in basis. Kategorien wie Lage, Nachfrage, Mietsteigerungs-, Ausbau- oder Entwicklungspotenzial, Zustand oder Erschliessung nur verwenden, wenn die FAKTEN sie tatsächlich belegen. Reichen die Fakten nicht für drei belastbare Argumente, gib weniger aus.

Aufgaben Verkaufsdokumentation (ausführlicher, ruhiger Erzählton, ganze Absätze)
- expose.objekt: Das Objekt im Überblick – Art, Einheiten, Grundstück, Zustand, Investitionen, Parkierung.
- expose.region: Gemeinde und Region nur aus dem Faktenfeld region. Leerer Text, wenn region fehlt.
- expose.lage: Unmittelbare Lage und Umgebung nur aus dem Faktenfeld lage. Leerer Text, wenn lage fehlt.
- expose.units: genau ein Eintrag je Zeile unter EINHEITEN, in derselben Reihenfolge; title = die vorgegebene Bezeichnung, text = Beschrieb nur aus den Angaben dieser Einheit und den allgemeinen Fakten.

Aufgaben anonymer Teaser (vor Unterzeichnung der Geheimhaltungsverpflichtung)
- teaser.title und teaser.text: ohne Strasse, Hausnummer, Postleitzahl, Parzellen- oder Grundstücksnummern und ohne Namen von Personen. Ortsangabe nur gemäss Faktenfeld teaser_ort (falls vorhanden, sonst Gemeinde).

Aufgaben Inserat (Immobilienportale)
- inserat.title: prägnanter Inserattitel.
- inserat.short: ein bis zwei Sätze für die Trefferliste.
- inserat.text: Beschrieb in kurzen Absätzen (Leerzeile dazwischen): Objekt, Lage, Einheiten, Zustand, Verfügbarkeit.`;

export function budgetText(factor = 1) {
  const b = (n) => Math.round(n * factor);
  return [
    `title: höchstens ${BUDGET.title} Zeichen`,
    `overview.ausgangslage: höchstens ${b(BUDGET.ausgangslage)} Zeichen`,
    `overview.objektLage: höchstens ${b(BUDGET.objektLage)} Zeichen`,
    `overview.baujahrInvestitionen: höchstens ${b(BUDGET.baujahrInvestitionen)} Zeichen`,
    `overview.einheiten: höchstens ${b(BUDGET.einheiten)} Zeichen`,
    `arguments[].title: höchstens ${BUDGET.argumentTitle} Zeichen`,
    `arguments[].text: höchstens ${b(BUDGET.argumentText)} Zeichen`,
    `expose.objekt: höchstens ${b(BUDGET.exposeObjekt)} Zeichen`,
    `expose.region: höchstens ${b(BUDGET.exposeRegion)} Zeichen`,
    `expose.lage: höchstens ${b(BUDGET.exposeLage)} Zeichen`,
    `expose.units[].text: höchstens ${b(BUDGET.unitText)} Zeichen`,
    `teaser.title: höchstens ${BUDGET.teaserTitle} Zeichen, teaser.text: höchstens ${b(BUDGET.teaserText)} Zeichen`,
    `inserat.title: höchstens ${BUDGET.inseratTitle} Zeichen, inserat.short: höchstens ${BUDGET.inseratShort} Zeichen, inserat.text: höchstens ${BUDGET.inseratText} Zeichen`,
  ].join('\n');
}

export function userMessage({ facts, missing }, { factor = 1, previous = null, units = [] } = {}) {
  const parts = [
    'FAKTEN (vom Benutzer erfasst, einzige zulässige Quelle):',
    JSON.stringify(facts, null, 2),
    '',
    'EINHEITEN (je ein Eintrag in expose.units, gleiche Reihenfolge):',
    units.length ? units.map((u, i) => `${i + 1}. ${u}`).join('\n') : '– keine –',
    '',
    `FEHLT (nicht erwähnen): ${missing.length ? missing.join(', ') : '–'}`,
    '',
    'ZEICHENBUDGETS:',
    budgetText(factor),
  ];
  if (previous) {
    parts.push('', 'VERDICHTEN: Die folgende Fassung ist zu lang. Kürze sie auf die Budgets, ohne neue Inhalte hinzuzufügen. Streiche Wiederholungen zuerst.', JSON.stringify(previous, null, 2));
  }
  return parts.join('\n');
}

// JSON-Schema der Antwort. basis ist auf die tatsächlich vorhandenen Faktenfelder beschränkt.
export function responseSchema(factKeys) {
  const str = { type: 'string' };
  return {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'overview', 'arguments', 'expose', 'teaser', 'inserat'],
    properties: {
      title: str,
      expose: {
        type: 'object',
        additionalProperties: false,
        required: ['objekt', 'region', 'lage', 'units'],
        properties: {
          objekt: str, region: str, lage: str,
          units: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'text'], properties: { title: str, text: str } } },
        },
      },
      teaser: { type: 'object', additionalProperties: false, required: ['title', 'text'], properties: { title: str, text: str } },
      inserat: { type: 'object', additionalProperties: false, required: ['title', 'short', 'text'], properties: { title: str, short: str, text: str } },
      overview: {
        type: 'object',
        additionalProperties: false,
        required: ['ausgangslage', 'objektLage', 'baujahrInvestitionen', 'einheiten'],
        properties: { ausgangslage: str, objektLage: str, baujahrInvestitionen: str, einheiten: str },
      },
      arguments: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['title', 'text', 'basis'],
          properties: {
            title: str,
            text: str,
            basis: { type: 'array', items: { type: 'string', enum: factKeys.length ? factKeys : ['adresse'] } },
          },
        },
      },
    },
  };
}

// Eine vollständige Anfrage (für jeden Anbieter gleich): System, Nachricht, Schema.
export function buildRequest(p, { factor = 1, previous = null } = {}) {
  const fb = factBase(p);
  const units = filledUnits(p).map((u) => `${unitTitle(u)}${u.features ? ` – ${u.features}` : ''}${u.rent ? ` – Nettomiete CHF ${u.rent}/Mt.` : ''}`);
  return { system: SYSTEM_PROMPT, message: userMessage(fb, { factor, previous, units }), schema: responseSchema(Object.keys(fb.facts)) };
}

// Antwort (JSON-Text) in die Textstruktur überführen.
export function parseResponse(text, provider) {
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('Die KI-Antwort war kein gültiges JSON.'); }
  const texts = normalizeTexts(data);
  texts.provider = provider;
  texts.generatedAt = new Date().toISOString();
  return texts;
}
