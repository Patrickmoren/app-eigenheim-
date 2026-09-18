/* Erzeugt 00_Audit_und_Falltests – Audit von Version 1, Falltests, Schlussaudit. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkte, nrpunkte, tabelle, info, recht,
       praxis, titelblatt, checks} = require('../lib/blocks.js');
const A  = require('./audit.js');
const FT = require('./falltests.js');
const {STAND, VERSION} = require('./handbuch2.js');

function bloecke() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  push(titelblatt({
    marke: 'Audit und Falltests',
    titel: 'Makler-Handbuch Hausverkauf Schweiz',
    untertitel: 'Prüfung von Version 1 · Überarbeitung zu Version 2.0 · Zehn Falltests · Schlussaudit',
    stand: `Fassung vom ${STAND} · Begleitdokument zu ${VERSION}`}));

  push(info('Was dieses Dokument leistet', [
    'Es weist nach, was an Version 1 geprüft, was übernommen, was vertieft und was korrigiert wurde. Es ist die Begründung für Version 2.0 und macht die Überarbeitung überprüfbar.',
    'Teil 1 bewertet 32 Abschnitte von Version 1 nach dem Schlüssel A bis F. Teil 2 führt die fünf kritischen Befunde mit je acht Feldern. Teil 3 listet die fünfzehn Lücken, Teil 4 die sechs Redundanzen.',
    'Teil 5 führt zehn Verkaufsfälle durch das neue System. Drei Lücken, die dabei aufgedeckt wurden, sind in Version 2.0 geschlossen und in Teil 6 einzeln ausgewiesen.',
    'Teil 7 ist das Schlussaudit über achtzehn Dimensionen, Teil 8 nennt die verbleibenden Risiken.']));

  /* ---------------------------------------------------------- Teil 1 */
  push(h1neu('1 · Bewertung von Version 1'));
  push(h2('1.1 Methode'));
  push(punkte(A.METHODE));
  push(h2('1.2 Bewertungsschlüssel'));
  push(tabelle(['Note', 'Bedeutung', 'Folge'], A.SCHLUESSEL.map(s => [s.k, s.b, s.f]),
    [700, 3400, 5500]));
  push(h2('1.3 Ergebnis im Überblick'));
  const b = A.BEWERTUNG.filter(x => x.a);
  const z = {};
  b.forEach(x => { z[x.n] = (z[x.n] || 0) + 1; });
  push(tabelle(['Note', 'Anzahl Abschnitte', 'Beurteilung'], [
    ['A', String(z.A || 0), 'Bleiben erhalten. Der Kern von Version 1 ist fachlich tragfähig – insbesondere Dokumentencheckliste, Objektaufnahme, Mandatsstruktur, Dossier, Reservation und Notariatsschnittstelle.'],
    ['B', String(z.B || 0), 'Korrekt, aber zu flach für die Steuerung. Vertieft.'],
    ['C', String(z.C || 0), 'Zu allgemein für operative Anwendung. Mit Entscheidungslogik und Verbindlichkeit versehen.'],
    ['D', String(A.D_BEFUNDE.length), 'Rechtlich oder fachlich kritisch. Einzeln korrigiert, siehe Teil 2.'],
    ['E', String(A.E_BEFUNDE.length), 'Fehlende Bestandteile eines operativen Systems. Neu erstellt, siehe Teil 3.'],
    ['F', String(A.F_BEFUNDE.length), 'Redundanzen. Zusammengeführt, siehe Teil 4.'],
  ], [700, 1500, 7400]));
  push(praxis('Gesamtbeurteilung von Version 1', [
    'Version 1 ist ein gutes Fachhandbuch und kein Steuerungssystem. Die Fachteile sind vollständig und in mehreren Punkten über dem Branchendurchschnitt – die Rollenabgrenzung mit Nicht-Zuständigkeiten, die rechtliche Behandlung der Reservation und die offene Kennzeichnung der Quellengüte sind in dieser Form unüblich.',
    'Die Schwäche liegt nicht im Inhalt, sondern in der Verbindlichkeit: Abschlusskriterien ohne Prüfer, Kontrollen ohne Prüfgegenstand, Kennzahlen mit starren Fristen, Anweisungen, die «prüfen» sagen, ohne die Entscheidung zu führen.',
    'Der gewichtigste Befund ist rechtlicher Natur und kehrt eine Kernannahme um: Version 1 baute eine ausnahmslose geldwäschereirechtliche Identifikationspflicht ein, obwohl der Normalfall dieses Handbuchs voraussichtlich unter eine Ausnahme fällt (D1).',
    'Nichts Wesentliches wurde gestrichen. Drei Teile sind gekürzt, weil sie in den Begleitdateien vollständig vorliegen – das ist keine Reduktion, sondern das Ende einer Doppelpflege.']));

  push(h2('1.4 Bewertung im Einzelnen'));
  const gr = [];
  A.BEWERTUNG.forEach(x => { if (x.g) { gr.push({t: x.g, z: [] }); return; } gr[gr.length - 1].z.push(x); });
  gr.forEach(g => {
    push(h3(g.t));
    push(tabelle(['Abschnitt', 'Note', 'Beurteilung', 'Behandlung in Version 2'],
      g.z.map(x => [x.a, x.n, x.b, x.v]), [1900, 600, 3600, 3500]));
  });

  /* ---------------------------------------------------------- Teil 2 */
  push(h1neu('2 · Kritische Befunde'));
  push(abs('Fünf Befunde mit rechtlicher oder fachlicher Tragweite. Je Befund die acht im Auftrag verlangten Felder.'));
  A.D_BEFUNDE.forEach(d => {
    push(h2(`${d.nr} · ${d.titel}`));
    push(tabelle(['Feld', 'Inhalt'], [
      ['1 Bestehender Inhalt', d.inhalt],
      ['2 Problem', d.problem],
      ['3 Risiko', d.risiko],
      ['4 Erforderliche Änderung', d.aenderung],
      ['5 Konkrete neue Lösung', d.loesung],
      ['6 Betroffene Phase', d.phase],
      ['7 Benötigtes Dokument', d.dokument],
      ['8 Verantwortlichkeit', d.verantwortung],
    ], [2200, 7400]));
  });
  push(recht([
    'Befund D1 betrifft die Rechtslage und beruht auf Fachpublikationen, weil Fedlex und die Bundesstellen aus der Arbeitsumgebung nicht erreichbar waren. Die Sekundärquellen widersprechen sich: Compliance-Dienstleister stellen die Unterstellung der Immobilienvermittlung pauschal dar, anwaltliche Analysen betonen die tätigkeitsbezogene Anknüpfung und die Ausnahmen.',
    'Version 2.0 löst diesen Widerspruch nicht auf – das kann ein Handbuch aus Sekundärquellen nicht. Sie ersetzt die pauschale Annahme durch eine dokumentierte Triage und weist die Klärung ausdrücklich der Rechtsabteilung und der Selbstregulierungsorganisation zu. Bis zur Klärung gilt vorsorglich der reduzierte Pfad B mit Dokumentationspflicht.']));

  /* ---------------------------------------------------------- Teil 3 */
  push(h1neu('3 · Fehlende Bestandteile'));
  push(abs('Fünfzehn Bestandteile eines operativen Verkaufsmanagementsystems fehlten in Version 1 vollständig.'));
  push(tabelle(['Nr.', 'Fehlender Bestandteil', 'Auswirkung des Fehlens', 'Umsetzung in Version 2'],
    A.E_BEFUNDE.map(e => [e.nr, e.l, e.w, e.v]), [500, 2100, 3400, 3600]));

  /* ---------------------------------------------------------- Teil 4 */
  push(h1neu('4 · Redundanzen'));
  push(abs('Sechs Doppelungen. Die Zusammenführung folgt dem Grundsatz, dass jeder Inhalt genau einmal gepflegt wird – zwei Listen laufen mit der Zeit auseinander.'));
  push(tabelle(['Nr.', 'Redundanz', 'Wo', 'Zusammenführung'],
    A.F_BEFUNDE.map(f => [f.nr, f.r, f.w, f.m]), [500, 1900, 3200, 4000]));
  push(info('Wirkung auf den Umfang', [
    'Version 1 hatte 264 Seiten. Die Zusammenführungen sparen rund zwanzig Seiten, die Ergänzungen kosten deutlich mehr.',
    'Der Umfang von Version 2.0 wächst also – aber nicht durch mehr Text zum gleichen Inhalt, sondern durch Gates, Sonderfälle, Störfälle, Kontrollpunkte und Entscheidungslogik. Das sind die Teile, die aus einem Handbuch ein System machen.',
    'Gestrichen wurde kein Fachinhalt. Die drei gekürzten Teile – Objektaufnahme, Formulare, Vorlagenübersicht – liegen in den Begleitdateien vollständig vor, wo mit ihnen gearbeitet wird.']));

  /* ---------------------------------------------------------- Teil 5 */
  push(h1neu('5 · Falltests'));
  push(abs('Zehn Verkaufsfälle wurden durch Version 2.0 geführt. Prüffrage: Kann ein Makler den Fall mit diesem Handbuch vollständig bearbeiten – und wo bricht das System ab?'));
  FT.FALLTESTS.forEach(t => {
    push(h2(`${t.nr} · ${t.fall}`));
    push(tabelle(['Feld', 'Inhalt'], [
      ['Ausgangslage', t.ausgangslage],
      ['Prozessverlauf', t.verlauf],
      ['Entscheidungen und Entscheidungsträger', t.entscheidungen],
      ['Gates', t.gates],
      ['Dokumente', t.dokumente],
      ['Eskalationen', t.eskalation],
      ['Ausgelöste Stop-Kriterien', t.stop],
      ['Prozessende', t.ende],
      ['Befund', t.befund],
    ], [2600, 7000]));
  });

  /* ---------------------------------------------------------- Teil 6 */
  push(h1neu('6 · Lücken aus den Falltests'));
  push(abs('Drei Lücken wurden aufgedeckt und in Version 2.0 geschlossen. Sie sind hier ausgewiesen, weil ein Falltest ohne Befund keinen Wert hat.'));
  A_LUECKEN(push);

  /* ---------------------------------------------------------- Teil 7 */
  push(h1neu('7 · Schlussaudit Version 2.0'));
  push(abs('Achtzehn Dimensionen, bewertet mit erfüllt, teilweise erfüllt, nicht erfüllt oder kritisch.'));
  const sz = {};
  A.SCHLUSSAUDIT.forEach(x => { sz[x.e] = (sz[x.e] || 0) + 1; });
  push(tabelle(['Ergebnis', 'Anzahl'], Object.entries(sz).map(([e, n]) => [e, String(n)]),
    [3000, 1500]));
  push(leer());
  push(tabelle(['Dimension', 'Ergebnis', 'Begründung'],
    A.SCHLUSSAUDIT.map(x => [x.d, x.e, x.b]), [2200, 1700, 5700]));
  push(info('Zu den drei nicht vollständig erfüllten Dimensionen', [
    'Recht und Compliance sind als «teilweise erfüllt» bewertet, weil die Primärquellen nicht zugänglich waren – nicht weil die Ausarbeitung fehlt. Sobald der Verordnungstext geprüft ist, kann die Bewertung ohne Änderung am System auf «erfüllt» gehen.',
    'Skalierbarkeit ist «teilweise erfüllt», weil das System das einzelne Mandat steuert. Eine Portfolio- und Auslastungssicht über mehrere Mandate wäre Gegenstand einer Version 3 und ist hier bewusst nicht behauptet.']));

  /* ---------------------------------------------------------- Teil 8 */
  push(h1neu('8 · Verbleibende Risiken'));
  push(recht(A.RESTRISIKEN));
  push(leer());
  push(h2('8.1 Was vor dem produktiven Einsatz zu erledigen ist'));
  push(checks([
    'Rechtsabteilung und Selbstregulierungsorganisation klären die geldwäschereirechtliche Unterstellung des Unternehmens und hinterlegen das Ergebnis als interne Weisung',
    'Abschnitte G3 bis G7 gegen den Text des revidierten GwG, der revidierten GwV und des TJPG verifizieren',
    'Anschlussfrist bei der Selbstregulierungsorganisation bestätigen',
    'Maklermandat, Kaufangebot F4 und Reservationsbestätigung F7 juristisch prüfen und freigeben',
    'Kantonale Klärungsliste A7 für jeden Kanton ausfüllen, in dem gearbeitet wird',
    'Interne Vorgaben festlegen: Provisionssätze, Löschfristen, Aufbewahrungsdauern, Budgetgrenzen, Reaktionszeitziele',
    'Kontrollpunkte K1 bis K10 personell zuweisen, einschliesslich Stellvertretung bei Einzelbesetzung',
    'Objektstatus und Pflichtfelder im eingesetzten CRM abbilden',
    'Vier-Augen-Prinzip und Gate-Freigaben im CRM als Pflichtschritte hinterlegen',
    'Schulung zu Teil G (Compliance), Teil C (Preissteuerung) und Teil J (Sonderfälle und Störfälle)']));

  return k;
}

function A_LUECKEN(push) {
  FT.LUECKEN.forEach(l => {
    push(h2(`${l.nr} · aus Falltest ${l.quelle}`));
    push(tabelle(['Feld', 'Inhalt'], [
      ['Lücke', l.luecke],
      ['Wirkung, wäre sie offengeblieben', l.wirkung],
      ['Wie sie geschlossen wurde', l.geschlossen],
    ], [2600, 7000]));
  });
}

module.exports = {bloecke};
