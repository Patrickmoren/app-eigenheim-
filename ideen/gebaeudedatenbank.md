# Hausrunde Schweiz: Selbstverwaltung plus Gebäudedatenbank

Stand 25.09.2026. Nur Schweiz.

## 1. Ausgangslage

Die reine Selbstverwaltungs-Software gibt es in der Schweiz schon: **[EinfachSTWEG](https://einfachstweg.ch/)**
(ab CHF 30/Mt.) liest QR-Rechnungen aus E-Mails, importiert Bankauszüge (camt.053), erstellt
Akontorechnungen, führt Versammlungen und hostet in der Schweiz. Dazu kommen Neowise und ImmoApp.
Eine blosse Kopie davon hätte keinen Grund zu existieren.

**Der Unterschied: Jede Gemeinschaft erfasst ohnehin Daten zu ihrem Gebäude** (Rechnungen,
Bauteile, Energie, Versicherung, Handwerker). Zusammengeführt und anonymisiert entsteht eine
Datenbank, die es in der Schweiz so nicht gibt: **was Gebäude im Unterhalt tatsächlich kosten**.
Jede neue Gemeinschaft macht die Datenbank besser, und damit das Produkt für alle. Das kann ein
reines Buchhaltungswerkzeug nicht nachbauen, ohne zuerst die Nutzer zu haben.

## 2. Was die Eigentümer davon haben

| Funktion | Nutzen | Ab wann sinnvoll |
|---|---|---|
| **Gebäude automatisch erfassen** | Adresse eingeben, Baujahr, Heizungsart, Energieträger und Anzahl Wohnungen kommen aus dem eidgenössischen Gebäude- und Wohnungsregister (GWR, öffentlich) | ab dem ersten Kunden |
| **Erneuerungsplan** | welche Bauteile wann fällig werden (Dach, Fassade, Fenster, Heizung, Lift) und wie viel der Fonds dafür braucht | ab dem ersten Kunden, mit Richtwerten |
| **Kosten mit echten Zahlen** | Erneuerungsplan rechnet mit tatsächlichen Rechnungen vergleichbarer Häuser statt mit Faustregeln | ab einigen Hundert Gebäuden |
| **Vergleich mit ähnlichen Häusern** | «Ihre Heizkosten pro m² liegen 18 % über vergleichbaren Häusern» – Hauswartung, Versicherung, Lift-Service, Heizung | nur wenn mindestens 10 vergleichbare Gebäude vorliegen |
| **Handwerker mit Erfahrungen** | welche Firmen andere Gemeinschaften in der Region beauftragt haben, zu welchen Preisen, mit welcher Zufriedenheit | ab einigen Hundert Gebäuden |
| **Gebäudebericht** | Zustand, Investitionen und Fondsstand auf einen Blick, für Verkauf, Bank oder Versammlung | ab dem ersten Kunden |

## 3. Wie damit Geld verdient wird

1. **Abo der Gemeinschaft** (Grundlage): etwa CHF 2 pro Einheit und Monat, mindestens CHF 15.
2. **Offerten über die Plattform:** Gemeinschaft holt Offerten bei Handwerkern ein; Handwerker
   zahlen für qualifizierte Anfragen (Modell der Offertenportale).
3. **Anonyme Auswertungen** für Banken (Hypotheken, Klimarisiken, Zustand), Versicherer und
   Gemeinden: nur aggregiert, nie Personendaten.

## 4. Rechtliche Leitplanken (revDSG)

- Die Gemeinschaft ist Verantwortliche für ihre Daten, Hausrunde bearbeitet sie im Auftrag.
  Für die **eigene, anonymisierte Auswertung** braucht es eine ausdrückliche Zustimmung der
  Gemeinschaft (Opt-in beim Einrichten, jederzeit widerrufbar).
- **Personendaten werden nie verkauft.** In die Datenbank fliessen nur Gebäude- und Kostendaten
  ohne Namen von Eigentümern.
- **Keine Rückschlüsse auf einzelne Häuser:** Vergleiche nur bei mindestens 10 Gebäuden in der
  Gruppe; Regionen gröber, wenn nötig.
- Hosting in der Schweiz, Auftragsbearbeitungsvertrag in den AGB, Zwei-Faktor-Anmeldung.
- Vor dem Start: Datenschutzerklärung und AGB durch eine Fachperson prüfen lassen.

## 5. Was programmiert werden muss

Die Testseiten sind nur HTML und CSS, um die Nachfrage zu messen. Das Produkt braucht deutlich mehr:

| Baustein | Inhalt |
|---|---|
| Oberfläche | Web-App (TypeScript, React), funktioniert auf dem Handy |
| Server und Datenbank | PostgreSQL: Gemeinschaften, Einheiten, Wertquoten, Eigentümer, Buchungen, Bauteile, Dokumente |
| Anmeldung und Rollen | Verwaltungsausschuss (bearbeiten), Eigentümer (lesen), Revisor (prüfen); Zwei-Faktor-Anmeldung |
| Buchhaltung | Budget, Akonto, Verteilung nach Wertquoten und Sonderschlüsseln, Jahresrechnung, Erneuerungsfonds |
| Schweizer Formate | QR-Rechnung auslesen (Standard SIX), Bankauszüge camt.053 importieren (ISO 20022), QR-Rechnungen erstellen |
| Dokumente | Ablage, Volltextsuche, PDF für Einladung, Protokoll, Abrechnung |
| Versammlung | Traktanden, Vollmachten, Abstimmung nach Köpfen und Wertquoten, Protokoll, Beschlussbuch |
| Gebäudedatenbank | GWR-Abfrage per Adresse, Bauteilkatalog, Kostenkategorien, anonymisierte Vergleiche |
| Betrieb | Schweizer Hosting, tägliche Sicherung, Protokoll aller Änderungen, E-Mail-Versand, Zahlungsabwicklung für das Abo |

Laufende Kosten am Anfang: rund CHF 20–60 im Monat (Hosting, E-Mail, Speicher). Das Programmieren
übernimmt Claude; du testest, lieferst Fachwissen und sprichst mit den ersten Gemeinschaften.

## 6. Grösse, ehrlich

Rund 970'000 Einheiten in knapp 100'000 Gemeinschaften. Wie viele sich selbst verwalten, ist
nicht belegt. Beispielrechnung: 10'000 Gemeinschaften × CHF 400/Jahr = **CHF 4 Mio. Abo-Umsatz**,
dazu Offerten und Auswertungen. **CHF 10 Mio. nur mit der Schweiz** setzen voraus, dass die
Datenbank später auch für private Vermieter von Mehrfamilienhäusern und für Banken ein Produkt
wird. Das ist möglich, aber heute nicht belegt.

## 7. Offene Punkte

1. **Arbeitgeber:** Verwaltungen betreuen auch Stockwerkeigentum. Vor dem Start klären.
2. **Warum wechselt jemand von EinfachSTWEG?** Nur wegen Preis und Datenbank. Der Test muss zeigen,
   ob das reicht.
3. **GWR-Daten:** Nutzungsbedingungen der öffentlichen Schnittstelle vor dem Bau prüfen.
