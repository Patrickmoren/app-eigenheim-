/* Begriffsverzeichnis. Neu in Version 2.
   Nur Begriffe, die in diesem Handbuch eine festgelegte Bedeutung haben. */

const BEGRIFFE = [
{b: 'Gate', d: 'Verbindlicher Prüfpunkt zwischen zwei Phasen mit Kriterien, Prüfer, Nachweis, Stop-Kriterien und Eskalationsweg. Zehn Gates, Teil B.'},
{b: 'Stop-Kriterium', d: 'Sachverhalt, bei dem der Prozess angehalten wird. Ein Stop-Kriterium kann nicht bedingt freigegeben werden.'},
{b: 'Bedingte Freigabe', d: 'Gate-Freigabe trotz eines offenen, nicht kritischen Kriteriums. Nur durch die Verkaufsleitung, mit Bedingung, Zuständigkeit und Frist.'},
{b: 'Funnelstufe', d: 'Eine der neun Stufen von Lead bis Käufer, Teil E. Wird nur mit belegtem Kriterium gesetzt.'},
{b: 'Marktwert', d: 'Wahrscheinlichster Preis unter normalen Bedingungen und üblicher Vermarktungsdauer. Objektbezogen, personenunabhängig.'},
{b: 'Realistischer Vermarktungspreis', d: 'Spanne, in der das Objekt im aktuellen Marktumfeld absetzbar ist. Kann vom Marktwert abweichen.'},
{b: 'Strategischer Angebotspreis', d: 'Der veröffentlichte Preis. Steuerungsinstrument, keine Wertaussage. Die einzige Preiszahl, die nach aussen geht.'},
{b: 'Zielpreis', d: 'Vom Eigentümer angestrebtes Verhandlungsergebnis. Intern.'},
{b: 'Erwartbarer Transaktionspreis', d: 'Preis, mit dem nach aktuellem Angebotsstand zu rechnen ist. Ändert sich laufend.'},
{b: 'Mindestpreis / Eigentümergrenze', d: 'Betrag, unter dem nicht verkauft wird. Streng intern, wird nie genannt.'},
{b: 'Wertspanne', d: 'Ergebnis der Bewertung: untere und obere Grenze mit begründeter Gewichtung. Kein Punktwert.'},
{b: 'Auslösekriterium', d: 'Vorab vereinbarter Indikatorwert, bei dessen Erreichen ein Massnahmengespräch angesetzt wird. Ersetzt die pauschale Frist.'},
{b: 'Triage', d: 'Sechsschrittige Prüfung, ob ein Mandat geldwäschereirechtlich unterstellt ist, mit den Ergebnispfaden A, B und C. Teil G.'},
{b: 'Pfad A / B / C', d: 'Ergebnis der Triage: A unterstellt oder unklar, B Ausnahme greift voraussichtlich, C Verdachtsfall.'},
{b: 'Wirtschaftlich berechtigte Person', d: 'Natürliche Person, die eine Rechtseinheit letztlich kontrolliert. Nach TJPG ab 25 Prozent des Kapitals oder der Stimmen oder Kontrolle auf andere Weise (R42).'},
{b: 'Nutzen- und Gefahrenübergang', d: 'Im Vertrag vereinbarter Zeitpunkt, ab dem Nutzen, Kosten und Risiko auf den Käufer übergehen. Nicht identisch mit Beurkundung oder Eigentumsübergang.'},
{b: 'Eigentumsübergang', d: 'Eintragung im Grundbuch. Erst damit wird der Käufer Eigentümer (R3).'},
{b: 'Freizeichnung', d: 'Vertragliche Wegbedingung der Gewährleistung. Ungültig, soweit Mängel arglistig verschwiegen wurden (R10).'},
{b: 'Nachweis- und Vermittlungsmäkelei', d: 'Die beiden Formen des Mäklervertrags. Bestimmen, wann der Lohnanspruch entsteht (R17, R18).'},
{b: 'Doppelmäkelei', d: 'Tätigkeit für beide Parteien. Ohne Offenlegung und Zustimmung beider kann der Lohnanspruch verwirken (R19).'},
{b: 'Nachwirkung', d: 'Anspruch, wenn der Verkauf nach Mandatsende mit einem während der Laufzeit nachgewiesenen Interessenten zustande kommt.'},
{b: 'Harte Eigenmittel', d: 'Eigenmittel, die nicht aus Guthaben der zweiten Säule stammen. Mindestens 10 Prozent nach der Selbstregulierung (R40).'},
{b: 'Reservation', d: 'Unverbindliche Absichtserklärung ohne Kaufverpflichtung, Konventionalstrafe und Zahlung. Eine bindende Reservation wäre ein formungültiger Vorvertrag (R2).'},
{b: 'Release-Checkliste', d: 'Prüfliste, die vor der Veröffentlichung des Verkaufsdossiers vollständig abgearbeitet und abgezeichnet wird. Gate 4.'},
{b: 'Datenraum', d: 'Geordnete Abgabe der Objektunterlagen an Interessenten ab Funnelstufe 3, mit Verteilernachweis je Version.'},
{b: 'Kontrollpunkt', d: 'Einer von zehn verbindlichen Vier-Augen-Punkten, Teil I. Der Kontrollierende ist nie der Erstellende.'},
{b: 'Störfall', d: 'Einer von siebzehn Fehlerfällen mit festgelegtem Ablauf von der Sofortmassnahme bis zur Wiederaufnahme, Teil J.'},
{b: 'Sonderfall', d: 'Einer von dreissig Fällen mit besonderem Abklärungs- und Eskalationsbedarf, Teil J. Erkennung spätestens in Phase 3.'},
{b: 'Normebene', d: 'Kennzeichnung im Rechtsregister, ob eine Aussage auf Bundesrecht, kantonalem oder kommunalem Recht, Grundbuch- oder Notariatspraxis, Steuerrecht, Selbstregulierung, interner Vorgabe oder Best Practice beruht.'},
{b: 'Quellenvorbehalt', d: 'Kennzeichnung, dass eine Aussage auf Fachpublikationen und nicht auf dem Gesetzes- oder Verordnungstext beruht. Betrifft in dieser Fassung GwG und TJPG.'},
];

module.exports = {BEGRIFFE};
