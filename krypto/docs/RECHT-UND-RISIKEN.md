# Recht und Risiken

> Dies ist **keine Rechtsberatung**, sondern eine Liste der Fragen, die vor dem Go-Live
> mit einer auf Blockchain spezialisierten Kanzlei in der Schweiz zu klären sind.

## Einordnung in der Schweiz (FINMA)

Die FINMA-Wegleitung zu ICOs (2018, mit Ergänzungen) unterscheidet drei Token-Arten:

| Art | Merkmal | Folge |
|---|---|---|
| Zahlungs-Token | dient als Zahlungsmittel | Geldwäschereigesetz (GwG) kann greifen |
| Nutzungs-Token | gibt Zugang zu einer Anwendung | in der Regel kein Effekt |
| Anlage-Token | Anspruch auf Gewinn, Dividende o. ä. | gilt als Effekt/Wertpapier |

**Kairn** hat eine Zahlungsfunktion (Agenten bezahlen APIs) und ein Stimmrecht, aber
**keinen Gewinnanspruch**. Wahrscheinlich ist eine Einstufung als Zahlungs-Token oder
Hybrid (Zahlung/Nutzung). Zu klären:

1. Löst die Ausgabe GwG-Pflichten aus (Anschluss an eine Selbstregulierungsorganisation)?
2. Genügt eine **Gratis-Verteilung per Airdrop** ohne Verkauf, um Pflichten zu vermeiden oder zu reduzieren?
3. Empfiehlt sich eine **Unterstellungsanfrage / No-Action-Letter** bei der FINMA?
4. Welche Rechtsform hat die Stiftung (z. B. Schweizer Stiftung in Zug) und wer sitzt im Stiftungsrat?

## EU (MiCA)

Kairn fällt als „anderer Krypto-Wert“ unter Titel II der MiCA-Verordnung.

- Ein **kostenloses Angebot** (Airdrop) ist von der Whitepaper-Pflicht grundsätzlich ausgenommen.
- Für die **Zulassung zum Handel** auf einer europäischen Börse braucht es ein
  MiCA-konformes Whitepaper. Diese Pflicht liegt je nach Konstellation beim Anbieter oder bei der Börse.
- Marketingmitteilungen müssen redlich, klar und nicht irreführend sein.

## USA

Ohne Vorabklärung US-Personen vom Airdrop und von Marketing ausschliessen (Geo-Blocking,
Bedingungen), bis die Einordnung durch die SEC geklärt ist.

## Steuern

- Airdrop-Empfänger: in der Schweiz je nach Kanton Einkommen zum Verkehrswert.
- Stiftung und Team: Bewertung der Token zum Zeitpunkt der Zuteilung mit der ESTV klären.

## Technische Risiken

| Risiko | Massnahme |
|---|---|
| Fehler im Vertrag | 31 Tests, 100 % Zeilenabdeckung, OpenZeppelin-Basis, **externes Audit vor Mainnet** |
| Verlust des Deploy-Schlüssels | Deployer hält nach dem Deployment nichts mehr; alle Empfänger sind Multisigs |
| Governance-Übernahme durch Grossinhaber | Quorum 4 %, Timelock 2 Tage, Verlängerung bei spätem Quorum |
| Sybil-Angriffe beim Airdrop | Filter vor Veröffentlichung der Merkle-Root |
| Phishing-Seiten | offizielle Adressen nur auf der eigenen Domain und verifiziert auf Basescan |
| Signatur-Missbrauch (EIP-3009) | kurze Gültigkeit (`validBefore`), `receiveWithAuthorization` für Verträge |

## Kommunikation

- Nie Rendite, Kursziele oder „Investment“ versprechen.
- Risikohinweis auf Webseite und in allen Kanälen (siehe Fusszeile der Webseite).
- Team- und Stiftungsadressen öffentlich machen, damit Bewegungen nachvollziehbar sind.
