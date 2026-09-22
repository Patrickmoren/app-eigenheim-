/* Erzeugt 12_Offmarket_Handout – Vorlage und Regeln für den diskreten Verkauf.
   Gehört zu Vermarktungsstufe 3 (Teil F1) und Sonderfall S25.

   Aufbau: Teil A und B gehen nach aussen, Teil C bleibt intern. */
const {abs, mix, h1neu, h2, h3, h4, leer, punkte, nrpunkte, checks, tabelle,
       info, recht, praxis, titelblatt, felder, linien, seite} = require('../lib/blocks.js');
const {STAND, VERSION} = require('./handbuch2.js');

/* Leere Tabellenzeilen für Erfassungstabellen */
const leerzeilen = (spalten, anzahl) =>
  Array.from({length: anzahl}, () => Array.from({length: spalten}, () => ''));

/* ------------------------------------------------ Was nie hineingehört */
const TABU = [
{p: 'Genaue Adresse', warum: 'Mit Strasse und Hausnummer ist das Objekt in Minuten identifiziert – über Kartendienste, Grundbuchauskunft und Nachbarschaft. Damit ist die Diskretion aufgehoben, für die der Eigentümer auf Reichweite verzichtet.',
 statt: 'Gemeinde oder Quartier, Ausrichtung, Erschliessungsgüte. «Rechtsufriges Seeufergebiet, Gemeinde mit rund 4 000 Einwohnern.»'},
{p: 'Aussenaufnahme, die das Objekt erkennbar macht', warum: 'Ein Bild der Fassade oder der Umgebung identifiziert das Objekt so zuverlässig wie die Adresse.',
 statt: 'Innenaufnahmen ohne Blick nach draussen, Detailaufnahmen, Grundrissschema ohne Nordbezug – oder bewusst gar keine Bilder.'},
{p: 'Parzellennummer, Grundbuchblatt, Katasterplan', warum: 'Führt direkt zur Adresse.',
 statt: 'Nur die Grundstücksfläche als Zahl.'},
{p: 'Name der Eigentümerschaft', warum: 'Der häufigste Grund für Diskretion ist die Person, nicht das Objekt.',
 statt: 'Keine Angabe. Auch nicht «Erbengemeinschaft» oder «infolge Trennung» – das ist im Umfeld oft eindeutig.'},
{p: 'Verkaufsgrund', warum: 'Trennung, Nachlass, Geschäftslage oder Zeitdruck schwächen die Verhandlungsposition und verletzen die Vertraulichkeit gegenüber dem Eigentümer.',
 statt: 'Gar nichts. Wird gefragt: «Der Eigentümer hat sich für einen diskreten Verkauf entschieden.»'},
{p: 'Mindestpreis, Rückzugslinie, Nettoerlösüberlegungen', warum: 'Streng intern; ihre Kenntnis beendet jede Verhandlung zugunsten der Gegenseite.',
 statt: 'Angebotspreis oder «Preisvorstellung auf Anfrage» nach Entscheid des Eigentümers.'},
{p: 'Interna aus Bewertung und Strategie', warum: 'Bewertungsbericht, Wertspanne, Marktanalyse und Strategieprotokoll sind interne Dokumente.',
 statt: 'Eckdaten und Kurzbeschreibung – mehr braucht die erste Stufe nicht.'},
{p: 'Andere Interessenten und ihre Angebote', warum: 'Datenschutzverstoss und Vertrauensbruch (R39).',
 statt: 'Wenn zutreffend und sachlich nötig: «Es liegen weitere Interessenbekundungen vor.» Keine Zahlen, keine Namen.'},
{p: 'Finanzierungsunterlagen Dritter', warum: 'Streng vertraulich und zweckgebunden (R39).', statt: 'Nie.'},
{p: 'Unterlagen des Datenraums', warum: 'Grundbuchauszug, Baupläne, Mängelliste und Bewilligungen gehören in die zweite Stufe – nach Qualifizierung und Vertraulichkeitserklärung.',
 statt: 'Im Handout nur der Hinweis, dass diese Unterlagen nach Unterzeichnung der Vertraulichkeitserklärung zugänglich sind.'},
];

/* ------------------------------ Was trotz Diskretion hineingehört */
const PFLICHT = [
{p: 'Baujahr und Zustand ohne Beschönigung', warum: 'Wer den Zustand erst nach der Besichtigung erfährt, bricht ab – der Termin war umsonst und die Diskretion einmal mehr aufgebraucht.'},
{p: 'Erheblicher Sanierungsbedarf, bauteilweise benannt', warum: 'Off-Market verkleinert den Interessentenkreis. Ein Abbruch kostet hier mehr als bei offener Vermarktung, weil kein Zulauf nachkommt.'},
{p: 'Wesentliche Belastungen und Beschränkungen dem Grundsatz nach', warum: 'Baurecht, Dienstbarkeiten mit Nutzungswirkung, Nutzungsbeschränkungen, Mietverhältnisse. Ohne Belegangabe, aber benannt (R5, R8).'},
{p: 'Nutzungsart und Verfügbarkeit', warum: 'Selbstnutzung, Vermietung, Zweitwohnungsstatus – bestimmt, ob der Interessent überhaupt erwerben kann (R35).'},
{p: 'Hinweis auf den Stand der Unterlagen', warum: 'Ob Grundbuchauszug, Baubewilligungen und GEAK vorliegen, sagt dem Interessenten, wie schnell es gehen kann.'},
];

/* ------------------------------------ Ablauf in zwei Stufen */
const ABLAUF = [
{s: 1, t: 'Auswahl', i: 'Interessenten aus der eigenen Datenbank und dem Netzwerk, deren Suchprofil zum Objekt passt und deren Finanzierungsrahmen plausibel ist. Auswahlkriterien dokumentieren (R39).', wer: 'Makler', gate: '—'},
{s: 2, t: 'Ansprache', i: 'Persönlich oder telefonisch, nicht per Sammelversand. Objekttyp, grobe Lage, Preisrahmen. Noch kein Handout.', wer: 'Makler', gate: '—'},
{s: 3, t: 'Vertraulichkeitserklärung', i: 'Vor der Abgabe des Handouts unterzeichnen lassen. Sie ist der einzige Schutz, den ein Handout hat, sobald es das Haus verlässt.', wer: 'Interessent', gate: '—'},
{s: 4, t: 'Handout abgeben', i: 'Personalisiert, mit Versionsnummer und Datum. Eingang im Verteilerprotokoll erfassen.', wer: 'Makler', gate: '—'},
{s: 5, t: 'Qualifizierung', i: 'Käuferprofil nach Formular F2 erheben; Funnelstufe setzen. Erwerbsrechtliche Zulässigkeit klären (R34).', wer: 'Makler', gate: '—'},
{s: 6, t: 'Datenraum öffnen', i: 'Ab Funnelstufe 3: vollständige Objektunterlagen einschliesslich Mängelliste gegen Empfangsbestätigung.', wer: 'Makler', gate: '—'},
{s: 7, t: 'Besichtigung', i: 'Einzeltermin, ohne Schild, ohne Markierung. Bei vermietetem Objekt Ankündigung an den Mieter (R47).', wer: 'Makler', gate: '—'},
{s: 8, t: 'Angebot', i: 'Schriftlich mit objektbezogener Finanzierungsbestätigung. Ab hier gilt der reguläre Prozess.', wer: 'Interessent', gate: 'GATE 6'},
];

/* ------------------------------------------ Vertraulichkeitserklärung */
const NDA = [
{zi: '1', t: 'Parteien', i: 'Interessent mit vollem Namen, Geburtsdatum und Adresse; bei juristischen Personen Firma, Sitz und zeichnungsberechtigte Person. Der Makler als Empfänger der Erklärung, handelnd im Auftrag der Eigentümerschaft.'},
{zi: '2', t: 'Gegenstand', i: 'Sämtliche Informationen über ein näher bezeichnetes Objekt, das dem Interessenten im Rahmen eines diskreten Verkaufsprozesses zugänglich gemacht wird – ohne das Objekt in der Erklärung selbst zu identifizieren. Bezeichnung über eine Objektnummer.'},
{zi: '3', t: 'Vertraulichkeit', i: 'Verpflichtung, die Informationen weder Dritten zugänglich zu machen noch für andere Zwecke als die Prüfung eines eigenen Erwerbs zu verwenden. Einschluss der Tatsache, dass das Objekt überhaupt zum Verkauf steht.'},
{zi: '4', t: 'Zulässiger Empfängerkreis', i: 'Namentlich zu benennen: mitentscheidende Personen, finanzierende Bank, beigezogene Berater. Jeder Empfänger ist auf dieselbe Vertraulichkeit zu verpflichten.'},
{zi: '5', t: 'Verbot der Ansprache', i: 'Keine direkte Kontaktaufnahme mit der Eigentümerschaft, mit Mietern oder mit der Nachbarschaft. Alle Anfragen ausschliesslich über den Makler.'},
{zi: '6', t: 'Keine Weitergabe von Unterlagen', i: 'Handout und Unterlagen des Datenraums dürfen nicht kopiert, weitergeleitet oder veröffentlicht werden. Rückgabe oder Löschung nach Abschluss der Prüfung.'},
{zi: '7', t: 'Keine Verpflichtung', i: 'Ausdrückliche Feststellung: Die Erklärung begründet keine Verpflichtung zum Kauf und kein Recht auf Erwerb. Ein Kaufvertrag über ein Grundstück kommt ausschliesslich durch öffentliche Beurkundung zustande (Art. 216 Abs. 1 OR).'},
{zi: '8', t: 'Dauer', i: 'Geltungsdauer der Verpflichtung, auch für den Fall, dass kein Erwerb zustande kommt.'},
{zi: '9', t: 'Folgen einer Verletzung', i: 'Rechtsfolgen einer Verletzung. Ob und in welcher Höhe eine Konventionalstrafe vereinbart wird, ist durch die Rechtsberatung zu bestimmen – die Formulierung entscheidet über die Durchsetzbarkeit.'},
{zi: '10', t: 'Datenschutz', i: 'Zweck der Bearbeitung der Interessentendaten, Empfängerkreis, Aufbewahrung und Löschfrist (R39).'},
{zi: '11', t: 'Schlussbestimmungen', i: 'Anwendbares Recht, Gerichtsstand, Schriftform, Ort, Datum, Unterschrift aller Interessenten.'},
];

/* ---------------------------------------------------------------------
   handout() – geht nach aussen. Eigene Datei, damit die Fusszeile weder
   einen internen Dokumentnamen noch eine fremde Gesamtseitenzahl trägt.
   --------------------------------------------------------------------- */
function handout() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  /* ---- Seite 1 ---- */
  push(h2('[Objekttyp] in [Region oder Gemeindetyp]'));
  push(abs('Diskreter Verkauf · Objektnummer [Nr.] · Stand [Datum] · Version [x]'));
  push(leer());
  push(abs('[Kurzbeschreibung in vier bis sechs Sätzen: Was ist das Objekt, für wen eignet es sich, was fällt auf. Nüchtern, ohne Superlative, ohne identifizierende Details.]', {italics: true}));
  push(linien(4));

  push(h3('Eckdaten'));
  push(tabelle(['Merkmal', 'Angabe'], [
    ['Objekttyp', ''],
    ['Region / Gemeindetyp', '[ohne Adresse und ohne Parzellennummer]'],
    ['Baujahr', ''],
    ['Letzte wesentliche Sanierung', ''],
    ['Wohnfläche (Norm angeben)', ''],
    ['Nebenfläche', ''],
    ['Grundstücksfläche', ''],
    ['Zimmer / Nassräume', ''],
    ['Parkierung', ''],
    ['Heizsystem und Energieträger', ''],
    ['GEAK, sofern vorhanden', ''],
    ['Eigentumsform', '[Allein-, Mit-, Stockwerkeigentum, Baurecht]'],
    ['Nutzung / Verfügbarkeit', '[selbstgenutzt, vermietet, frei ab]'],
    ['Preisvorstellung', '[Betrag oder «auf Anfrage»]'],
  ], [3400, 6200]));

  push(h3('Was das Objekt auszeichnet'));
  push(abs('[Drei bis fünf Punkte, jeder belegbar. Keine Aussage, die nicht im Datenraum nachweisbar ist.]', {italics: true}));
  push(punkte(['[Punkt 1]', '[Punkt 2]', '[Punkt 3]', '[Punkt 4]', '[Punkt 5]']));

  push(h3('Was Sie wissen sollten'));
  push(abs('[Sanierungsbedarf, wesentliche Belastungen, Nutzungsbeschränkungen und Mietverhältnisse dem Grundsatz nach. Dieser Abschnitt wird nicht weggelassen.]', {italics: true}));
  push(linien(4));

  push(seite());
  /* ---- Seite 2 ---- */
  push(h3('Vorgehen'));
  push(nrpunkte([
    ['1.', 'Sie prüfen anhand dieser Angaben, ob das Objekt grundsätzlich in Frage kommt.'],
    ['2.', 'Bei Interesse unterzeichnen Sie die beiliegende Vertraulichkeitserklärung.'],
    ['3.', 'Anschliessend erhalten Sie die vollständigen Unterlagen: Grundbuchauszug, Pläne, Baubewilligungen, Angaben zur Haustechnik, Mängelliste und, sofern vorhanden, den GEAK.'],
    ['4.', 'Danach vereinbaren wir einen Einzeltermin vor Ort.'],
    ['5.', 'Ein Kaufangebot reichen Sie schriftlich ein, zusammen mit einer objektbezogenen Finanzierungsbestätigung Ihrer Bank.'],
  ]));

  push(h3('Vertraulichkeit'));
  push(abs('Die Eigentümerschaft hat sich für einen diskreten Verkauf entschieden. Das Objekt wird nicht öffentlich ausgeschrieben und ist auf keinem Portal zu finden. Wir bitten Sie, diese Unterlage und die Tatsache des Verkaufs vertraulich zu behandeln und weder die Eigentümerschaft noch Mieter oder Nachbarn direkt zu kontaktieren. Alle Fragen laufen über die unten genannte Stelle.'));

  push(h3('Kontakt'));
  push(felder(['Zuständige Person und Funktion', 'Direktnummer', 'E-Mail',
    'Erreichbarkeit', 'Firma']));

  push(h3('Rechtliche Hinweise'));
  push(punkte([
    'Die Angaben beruhen auf Unterlagen und Auskünften der Eigentümerschaft sowie auf Behördenauskünften. Sie erfolgen nach bestem Wissen, jedoch ohne Gewähr für Vollständigkeit und Richtigkeit.',
    'Diese Unterlage ist bewusst zusammenfassend. Die vollständigen Angaben einschliesslich der Mängelliste erhalten Sie nach Unterzeichnung der Vertraulichkeitserklärung.',
    'Diese Unterlage ist kein Angebot im Rechtssinne und enthält keine Zusicherung. Ein Kaufvertrag über ein Grundstück kommt in der Schweiz ausschliesslich durch öffentliche Beurkundung zustande (Art. 216 Abs. 1 OR).',
    'Flächenangaben: Die Wohnfläche ist nach [Norm] berechnet, die Grundstücksfläche entspricht dem Grundbuchauszug vom [Datum]. Massabweichungen sind möglich.',
    'Personendaten werden gemäss unserer Datenschutzerklärung bearbeitet, abrufbar unter [Adresse].',
    'Weitergabe an Dritte ist nicht gestattet. Ausgabe [Datum], Version [x], persönlich für [Name des Empfängers].',
  ]));

  return k;
}

/* ---------------------------------------------------------------------
   regeln() – bleibt intern. Wird nie mitgegeben.
   --------------------------------------------------------------------- */
function regeln() {
  const k = [];
  const push = (...x) => x.flat().forEach(e => k.push(e));

  push(titelblatt({
    marke: 'Off-Market',
    titel: 'Regeln, Beilagen und Freigabe',
    untertitel: 'Internes Begleitdokument zur Handout-Vorlage · Vermarktungsstufe 3 · Sonderfall S25',
    stand: `${VERSION} · Fassung vom ${STAND} · INTERN – nicht weitergeben`}));

  push(info('Die beiden Dateien', [
    'Dokument 12 «Off-Market-Handout, Vorlage» enthält ausschliesslich das zweiseitige Handout. Es wird je Objekt ausgefüllt und geht nach aussen. Es trägt bewusst keinen internen Dokumentnamen und keine fremde Seitenzahl in der Fusszeile.',
    'Dieses Dokument 13 enthält alles Übrige: Regeln zum Inhalt, Ablauf, Vertraulichkeitserklärung, Verteilerprotokoll und die Freigabe vor der ersten Abgabe. Es bleibt intern.',
    'Reihenfolge im Einsatz: erst Teil 4 (Freigabe) abarbeiten, dann Dokument 12 ausfüllen, dann abgeben und in Teil 3 (Verteilerprotokoll) erfassen.']));
  push(leer());
  push(info('Was das Handout ist – und was nicht', [
    'Es ist die erste Stufe eines zweistufigen Verfahrens: Handout, dann Vertraulichkeitserklärung, dann Datenraum. Es weckt Interesse und ermöglicht eine erste Einschätzung, ohne das Objekt identifizierbar zu machen.',
    'Es ist kein Verkaufsdossier. Das vollständige Dossier mit Grundbuchauszug, Plänen, Bewilligungen und Mängelliste folgt erst nach Qualifizierung und unterzeichneter Vertraulichkeitserklärung.',
    'Es ist kein Angebot im Rechtssinne und begründet keine Bindung. Verbindlich wird ein Kauf ausschliesslich durch öffentliche Beurkundung (R1).']));
  push(leer());
  push(recht([
    'Diskretion reduziert die Offenlegungspflicht nicht. Bekannte Mängel, Belastungen und Nutzungsbeschränkungen sind auch off-market offenzulegen; die Wegbedingung der Gewährleistung im Kaufvertrag trägt nur bei vollständiger Offenlegung (Art. 199 OR, R10).',
    'Die Vertraulichkeitserklärung in Teil B ist eine Strukturvorgabe, kein freigegebener Vertragstext. Sie ist vor der ersten Verwendung durch die Rechtsberatung zu prüfen; das gilt besonders für Ziffer 9 (Folgen einer Verletzung).',
    'Off-Market setzt einen schriftlichen Entscheid des Eigentümers voraus, in dem er den Reichweitenverzicht und dessen Folge für Preis oder Dauer zur Kenntnis nimmt. Ohne diesen Entscheid wird nicht off-market vermarktet (Sonderfall S25).']));

  /* ==================================================== 1 */
  push(h1neu('1 · Was ins Handout gehört und was nicht'));
  push(h2('1.1 Was nie hineingehört'));
  push(tabelle(['Nie', 'Weshalb', 'Stattdessen'],
    TABU.map(t => [t.p, t.warum, t.statt]), [2100, 4100, 3400]));
  push(h2('1.2 Was trotz Diskretion hineingehört'));
  push(abs('Off-Market reduziert die Reichweite, nicht die Offenlegung. Der häufigste Fehler ist, das Handout so schlank zu halten, dass die unangenehmen Punkte erst bei der Besichtigung auftauchen.'));
  push(tabelle(['Gehört hinein', 'Weshalb'], PFLICHT.map(p => [p.p, p.warum]), [3000, 6600]));
  push(h2('1.3 Preisangabe'));
  push(tabelle(['Variante', 'Wann', 'Folge'], [
    ['Angebotspreis genannt', 'Wenn die Preisvorstellung marktnah ist und der Kreis der Angesprochenen klein und qualifiziert',
     'Schnellste Selektion. Der Interessent weiss sofort, ob es passt. Empfohlener Regelfall.'],
    ['Preisvorstellung auf Anfrage', 'Wenn die Preisfindung noch offen ist oder der Eigentümer die Zahl nicht in Umlauf haben will',
     'Erzeugt eine zusätzliche Kontaktstufe und damit Kontrolle – kostet aber Tempo und selektiert schlechter.'],
    ['Preisrahmen als Spanne', 'Bei Objekten, deren Wert stark von der Nutzung des Käufers abhängt',
     'Nur mit schriftlichem Entscheid des Eigentümers. Die Spanne wird sonst zur Untergrenze.'],
  ], [2400, 3600, 3600]));
  push(recht(['Der Mindestpreis und die Rückzugslinie erscheinen in keiner Variante. Sie sind streng vertraulich und gehen aus keinem Dokument nach aussen.']));

  /* ==================================================== 2 */
  push(h1neu('2 · Ablauf in zwei Stufen'));
  push(tabelle(['Nr.', 'Schritt', 'Inhalt', 'Durch', 'Gate'],
    ABLAUF.map(a => [String(a.s), a.t, a.i, a.wer, a.gate]),
    [450, 1600, 5150, 1300, 1100]));
  push(info('Die Trennlinie', [
    'Vor der Vertraulichkeitserklärung: Objekttyp, grobe Lage, Eckdaten, Preisrahmen.',
    'Nach der Vertraulichkeitserklärung: Adresse, Grundbuchauszug, Pläne, Bewilligungen, Mängelliste, GEAK.',
    'Wer diese Linie verwischt, hat entweder die Diskretion aufgegeben oder die Offenlegung verzögert. Beides schadet.']));

  push(h2('2.1 Vertraulichkeitserklärung'));
  push(recht([
    'RECHTLICHE PRÜFUNG ERFORDERLICH. Strukturvorgabe, kein Vertragstext. Vor der ersten Verwendung durch die Rechtsberatung freigeben und danach unverändert einsetzen.',
    'Ziffer 9 ist gesondert zu prüfen: Die Formulierung entscheidet darüber, ob die Folgen einer Verletzung durchsetzbar sind.',
    'Die Erklärung darf keine Verpflichtung zum Kauf und kein Erwerbsrecht begründen – sonst stellt sich die Frage eines formbedürftigen Vorvertrags (Art. 216 Abs. 2 OR, R2).']));
  push(leer());
  push(tabelle(['Zi.', 'Gegenstand', 'Was zu regeln ist'],
    NDA.map(n => [n.zi, n.t, n.i]), [450, 2150, 7000]));
  push(leer());
  push(praxis('Zwei Punkte aus der Praxis', [
    'Die Erklärung bezeichnet das Objekt nicht. Sie verweist auf eine Objektnummer. Sonst ist das Dokument, das die Vertraulichkeit sichern soll, selbst die Indiskretion – etwa wenn es bei der Bank des Interessenten abgelegt wird.',
    'Der zulässige Empfängerkreis wird namentlich erfasst, nicht pauschal erlaubt. «Meine Berater» ist keine Eingrenzung. Wer später im Umlauf auftaucht, muss auf dem Formular stehen.']));

  /* ==================================================== 3 */
  push(h1neu('3 · Verteilerprotokoll'));
  push(abs('Je Objekt zu führen. Es erfüllt zwei Zwecke gleichzeitig, und der zweite wird regelmässig unterschätzt.'));
  push(info('Wozu das Protokoll dient', [
    'Erstens Kontrolle: Off-Market lebt davon, dass bekannt ist, wer was in welcher Fassung hat. Muss eine Angabe korrigiert werden, ist der Verteiler die Voraussetzung dafür, dass die Korrektur alle erreicht (Störfall T6).',
    'Zweitens Provisionsschutz: Das Protokoll ist der Nachweis, wem die Gelegenheit zum Abschluss nachgewiesen wurde – mit Datum. Bei Nachweismäkelei und bei einer Nachwirkungsklausel ist genau das die Beweisfrage (R17, R18). Off-market wiegt das schwerer als bei offener Vermarktung, weil kein Inserat den Nachweis stützt.',
    'Drittens Datenschutz: Empfänger, Zweck und Löschfrist sind dokumentiert (R39).']));
  push(leer());
  push(tabelle(['Nr.', 'Datum', 'Empfänger', 'Firma / Rolle', 'Kanal',
    'NDA unterzeichnet', 'Handout-Version', 'Datenraum ab', 'Funnelstufe',
    'Rückmeldung', 'Löschfrist'],
    leerzeilen(11, 16), [400, 750, 1400, 1200, 700, 900, 900, 850, 850, 950, 700]));
  push(leer());
  push(h4('Pflichtregeln für das Protokoll'));
  push(punkte([
    'Jede Abgabe wird erfasst – auch die mündliche Ansprache ohne Handout, mit Vermerk «nur Ansprache».',
    'Die Handout-Version wird mitgeführt. Wird das Handout geändert, erhält es eine neue Versionsnummer und alle bisherigen Empfänger die neue Fassung.',
    'Kein Datenraumzugang ohne unterzeichnete Vertraulichkeitserklärung und ohne Eintrag in dieser Liste.',
    'Nicht weiterverfolgte Interessenten werden nach Ablauf der Löschfrist gelöscht; der Eintrag über den Nachweis bleibt, soweit er für den Provisionsnachweis erforderlich ist (R39).',
  ]));

  /* ==================================================== 4 */
  push(h1neu('4 · Freigabe vor der ersten Abgabe'));
  push(abs('Einmal je Objekt abzuarbeiten, danach je Version zu wiederholen. Entspricht Kontrollpunkt K2 in verkürzter Form.'));
  push(checks([
    'Schriftlicher Entscheid des Eigentümers für die Off-Market-Vermarktung liegt vor, mit Kenntnisnahme der Reichweitenfolge (S25)',
    'Gate 1 ist freigegeben – die Verkäuflichkeit ist geklärt',
    'Gate 2 ist freigegeben – Mandat unterzeichnet, Triage dokumentiert',
    'Preisentscheid liegt schriftlich vor; Variante der Preisangabe ist bestimmt (1.3)',
    'Handout enthält keine Angabe aus der Tabu-Liste 1.1',
    'Handout enthält alle Punkte aus 1.2, insbesondere den Abschnitt «Was Sie wissen sollten»',
    'Jede Zahl im Handout ist gegen ihre Quelle geprüft (R9, R12)',
    'Flächen mit Berechnungsnorm und Quelle deklariert',
    'Keine Energieangabe ohne vorliegenden GEAK (R33)',
    'Bilder – sofern verwendet – machen das Objekt nicht identifizierbar',
    'Rechtliche Hinweise vollständig, einschliesslich Personalisierung des Empfängers',
    'Vertraulichkeitserklärung in der freigegebenen Fassung liegt bei',
    'Verteilerprotokoll ist eröffnet',
    'Vier-Augen-Prüfung durch eine zweite Person erfolgt und abgezeichnet',
    'Schriftliche Freigabe des Eigentümers für das Handout liegt vor',
  ]));

  push(h2('4.1 Wenn das Handout doch in Umlauf gerät'));
  push(abs('Das ist der Störfall, der off-market am meisten kostet. Vorgehen analog Störfall T6, mit zwei Besonderheiten.'));
  push(tabelle(['Schritt', 'Inhalt'], [
    ['1 Feststellen', 'Welche Version ist wo aufgetaucht? Personalisierung und Verteilerprotokoll führen zur Quelle.'],
    ['2 Eigentümer informieren', 'Am gleichen Tag, bevor er es von Dritten erfährt. Das ist der Punkt, an dem Mandate verloren gehen.'],
    ['3 Quelle ansprechen', 'Sachlich, unter Hinweis auf die Vertraulichkeitserklärung. Keine Drohung ohne Rechtsberatung.'],
    ['4 Rechtsberatung', 'Beiziehen, bevor gegenüber der Quelle oder Dritten Stellung genommen wird.'],
    ['5 Eigentümerentscheid', 'Off-market fortsetzen, in eine offene Vermarktung wechseln oder pausieren. Der Entscheid gehört dem Eigentümer.'],
    ['6 Dokumentieren', 'Zeitpunkt, Version, Empfängerkette, getroffene Massnahmen – im Objektdossier.'],
  ], [2200, 7400]));

  push(h2('4.2 Einbettung ins System'));
  push(tabelle(['Thema', 'Fundstelle'], [
    ['Off-Market als Vermarktungsstufe: Zweck, Zielgruppe, Erfolgsmessung', 'Handbuch Teil F1, Stufe 3'],
    ['Sonderfall Off-Market-Verkauf mit Stop-Kriterium und Eskalation', 'Handbuch Teil J1, S25'],
    ['Sonderfall diskreter Verkauf – Abgrenzung', 'Handbuch Teil J1, S24'],
    ['Datenraum: Inhalt, Ausschlüsse, Verteilernachweis', 'Handbuch Teil I7'],
    ['Käuferfunnel und Qualifizierung', 'Handbuch Teil E1 und E2 · Formular F2'],
    ['Vertraulichkeitsstufen der Dokumente', 'Handbuch Teil I4'],
    ['Störfall: veröffentlichte Information muss korrigiert werden', 'Handbuch Teil J2, T6'],
    ['Offenlegungspflicht und Freizeichnung', 'Handbuch Teil K6, R9 und R10'],
    ['Nachweis- und Vermittlungsmäkelei, Nachwirkung', 'Handbuch Teil K6, R17 und R18 · Teil D3, Ziffer 18'],
    ['Datenschutz und Löschfristen', 'Handbuch Teil G8'],
    ['Preisbegriffe und was nach aussen geht', 'Handbuch Teil C1 · Kurzfassung Teil 4'],
  ], [4600, 5000]));

  return k;
}

module.exports = {handout, regeln, TABU, PFLICHT, ABLAUF, NDA};
