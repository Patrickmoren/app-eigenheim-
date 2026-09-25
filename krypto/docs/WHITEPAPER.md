# Kairn (KAIRN) – Litepaper

*Version 0.9 · Entwurf vor dem Testnetz-Start*

## 1. Problem

KI-Agenten erledigen immer mehr Aufgaben selbständig: Sie recherchieren, buchen und rufen
dafür Dutzende kostenpflichtiger APIs auf. Klassische Bezahlwege passen dazu schlecht:

- Kreditkarten und Abos lohnen sich nicht für Beträge von wenigen Rappen pro Anfrage.
- API-Schlüssel pro Anbieter skalieren nicht, wenn ein Agent Hunderte Dienste nutzt.
- Normale Krypto-Zahlungen verlangen, dass der Agent zusätzlich ETH für Gas hält und
  selbst Transaktionen sendet.

## 2. Lösung

Das offene Protokoll **x402** belebt den HTTP-Status `402 Payment Required`: Der Server
nennt einen Preis, der Agent antwortet mit einer **signierten Zahlungsautorisierung**
(EIP-3009), der Server reicht sie on-chain ein und zahlt das Gas.

**Kairn ist ein Token, der genau dafür gebaut ist.** Er unterstützt EIP-3009 wie USDC,
akzeptiert Signaturen von Smart-Contract-Wallets (ERC-1271), die viele Agenten-Frameworks
verwenden, und läuft auf **Base**, wo eine Transaktion Bruchteile eines Rappens kostet.

Im Unterschied zu einem Stablecoin ist KAIRN zusätzlich das **Stimmrecht** im Ökosystem:
Wer Kairn nutzt, entscheidet über die Förderung von Agenten-Diensten mit.

## 3. Vertrag

| Eigenschaft | Umsetzung |
|---|---|
| Standard | ERC-20, 18 Dezimalstellen |
| Menge | 1'000'000'000 KAIRN, einmalig geprägt |
| Kontrolle | kein Owner, keine Mint-, Pause- oder Upgrade-Funktion |
| Agenten-Zahlungen | EIP-3009 `transferWithAuthorization`, `receiveWithAuthorization`, `cancelAuthorization` (bytes- und v,r,s-Signaturen) |
| Smart-Wallets | ERC-1271-Signaturen werden akzeptiert |
| Freigaben | EIP-2612 `permit` |
| Governance | ERC20Votes mit Zeitstempel-Uhr (EIP-6372) |
| Deflation | freiwilliges `burn` |
| Basis | OpenZeppelin Contracts 5.6 |

## 4. Tokenomics

| Zuteilung | Anteil | Menge | Freigabe |
|---|---:|---:|---|
| DAO-Treasury | 40 % | 400 Mio. | nur per DAO-Beschluss, Timelock 2 Tage |
| Community-Airdrop | 20 % | 200 Mio. | Claim während 180 Tagen, Rest ans Treasury |
| Team | 15 % | 150 Mio. | 12 Monate Cliff, linear bis Monat 48 |
| Partner & Berater | 10 % | 100 Mio. | 6 Monate Cliff, linear bis Monat 24 |
| Liquidität | 10 % | 100 Mio. | DEX-Pool beim Launch (Multisig) |
| Stiftung / Betrieb | 5 % | 50 Mio. | Multisig: Recht, Audits, Listings |

Grundsätze:

- **Kein Vorverkauf, keine Investoren-Tranche.** 60 % gehen direkt an die Community (Airdrop + Treasury).
- **Das Team wird langsamer frei als alle anderen.** Die Freigabe erfolgt linear statt
  in Blöcken, um grosse Verkaufsdrucktage zu vermeiden.
- **Nicht abgeholte Airdrop-Token** gehen ans Treasury, nie ans Team.

## 5. Governance

Die Kairn DAO basiert auf OpenZeppelin Governor:

| Parameter | Wert |
|---|---|
| Vorschlagsschwelle | 1'000'000 KAIRN (0,1 %) |
| Wartezeit bis Abstimmung | 1 Tag |
| Abstimmungsdauer | 7 Tage |
| Quorum | 4 % der Gesamtmenge |
| Verlängerung bei spätem Quorum | 2 Tage |
| Timelock | 2 Tage |

Alle Parameter lassen sich nur per DAO-Beschluss ändern. Der Deployer gibt beim Deployment
seine Admin-Rolle am Timelock ab; das wird im Test `Deployer hat keine Macht über das Treasury` geprüft.

Typische Verwendungen des Treasury: Grants für x402-Integrationen in Agenten-Frameworks,
Sicherheitsaudits, Bug-Bounties, Liquiditäts-Anreize, Bezahlung der Stiftung.

## 6. Airdrop-Kriterien (Vorschlag)

Die Liste entsteht vor dem Mainnet-Launch aus nachprüfbaren On-Chain-Daten, z. B.:

1. Teilnahme am Testnetz-Programm (x402-Zahlungen mit Test-KAIRN)
2. Entwicklerinnen und Entwickler von Agenten-Tools mit öffentlichem Code
3. Aktive Nutzer von x402-Diensten auf Base

Sybil-Filter (Mehrfachkonten) werden vor der Veröffentlichung der Merkle-Root angewendet.
Die vollständige Liste wird mit der Root veröffentlicht, damit jede Person sie nachrechnen kann.

## 7. Roadmap

1. **Verträge und Tests** – erledigt
2. **Testnetz Base Sepolia** – öffentlicher Probebetrieb, Bug-Bounty, Demo-API mit x402
3. **Audit und Recht** – externes Audit, FINMA-Einordnung, Multisigs
4. **Launch auf Base** – Deployment, Airdrop, Liquiditätspool, Übergabe an die DAO

## 8. Risiken

Smart Contracts können trotz Tests und Audit Fehler enthalten. Der Wert von KAIRN kann auf
null fallen; es gibt keine Rendite- oder Rücknahmezusage. Die rechtliche Einordnung von
Token kann sich ändern. Siehe `RECHT-UND-RISIKEN.md`.
