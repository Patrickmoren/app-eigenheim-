// Unterlagen, die Banken für die Finanzierung einer Liegenschaft üblicherweise verlangen (Schweiz).
// Bedingte Positionen erscheinen nur, wenn sie das Objekt betreffen (Stockwerkeigentum, Baurecht,
// vermietete Einheiten). Der Status kommt aus der Erfassung «Unterlagen»; fehlt ein Eintrag, gilt «fehlt».
import { isEmpty } from './schema.js';
import { filledUnits } from './facts.js';

const isCondo = (p) => p.object.type === 'Eigentumswohnung' || /stockwerk/i.test(`${p.land.ownership} ${p.land.condoQuota}`) || !isEmpty(p.land.condoQuota);
const hasBuildingRight = (p) => !isEmpty(p.land.buildingRight) && !/^\s*(kein|nein)/i.test(p.land.buildingRight);
const isRented = (p) => filledUnits(p).some((u) => u.status === 'vermietet' || !isEmpty(u.rent)) || !isEmpty(p.finance.rentActual);
const hasBuilding = (p) => p.object.type !== 'Grundstück';

export const BANK_CHECKLIST = [
  { name: 'Grundbuchauszug', hint: 'aktuell, nicht älter als 3 Monate', match: /grundbuch/i },
  { name: 'Katasterplan / Situationsplan', match: /kataster|situation/i },
  { name: 'ÖREB-Katasterauszug', match: /öreb|oereb/i },
  { name: 'Gebäudeversicherungsausweis', hint: 'Versicherungswert und Index', match: /versicherung/i, when: hasBuilding },
  { name: 'Pläne (Grundrisse, Schnitte, Fassaden)', match: /plan|grundriss|schnitt/i, when: hasBuilding },
  { name: 'Baubeschrieb / Kubaturberechnung SIA 416', match: /baubeschrieb|kubatur|volumen/i, when: hasBuilding },
  { name: 'Aufstellung Investitionen / Renovationen', match: /investition|renovation|sanierung/i, when: hasBuilding },
  { name: 'Energieausweis (GEAK) / Heizungsangaben', match: /geak|energie|heizung/i, when: hasBuilding },
  { name: 'Fotos', match: /foto|bild/i },
  { name: 'Mieterspiegel', hint: 'aktuell, mit Mietbeginn und Nebenkosten', match: /mieterspiegel|mietzinsliste/i, when: isRented },
  { name: 'Mietverträge', match: /mietvertr/i, when: isRented },
  { name: 'Nebenkostenabrechnungen (2 Jahre)', match: /nebenkosten/i, when: isRented },
  { name: 'Liegenschaftsabrechnungen / Betriebskosten (2–3 Jahre)', match: /liegenschaftsabrechnung|betriebskosten|erfolgsrechnung/i, when: isRented },
  { name: 'Dienstbarkeitsverträge', match: /dienstbarkeit|grundlast/i, when: (p) => !isEmpty(p.land.encumbrances) && !/^\s*kein/i.test(p.land.encumbrances) },
  { name: 'Kataster belasteter Standorte', match: /belastet|altlast/i },
  { name: 'Stockwerkeigentum: Begründungsakt, Reglement, Wertquoten', match: /begründung|reglement|wertquote/i, when: isCondo },
  { name: 'Stockwerkeigentum: Erneuerungsfonds und Protokolle', match: /erneuerungsfonds|protokoll/i, when: isCondo },
  { name: 'Baurechtsvertrag', match: /baurecht/i, when: hasBuildingRight },
  { name: 'Verkehrswertschätzung', hint: 'falls vorhanden', match: /schätzung|schaetzung|bewertung|verkehrswert/i, optional: true },
];

// Checkliste mit Status je Position. Zusätzlich erfasste Unterlagen erscheinen am Schluss.
export function documentChecklist(p) {
  const entries = (p.documents || []).filter((d) => !isEmpty(d.name));
  const used = new Set();
  const rows = BANK_CHECKLIST.filter((c) => !c.when || c.when(p)).map((c) => {
    const hit = entries.find((d, i) => !used.has(i) && c.match.test(d.name) && used.add(i));
    return { name: c.name, hint: c.hint || '', status: hit ? hit.status : (c.optional ? 'optional' : 'fehlt'), date: hit ? hit.date : '', note: hit ? hit.note : '' };
  });
  entries.forEach((d, i) => { if (!used.has(i)) rows.push({ name: d.name, hint: '', status: d.status, date: d.date, note: d.note }); });
  return rows;
}
