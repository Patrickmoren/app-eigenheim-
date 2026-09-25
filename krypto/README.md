# Eigen Token (EIGEN) – ERC-20 auf Ethereum

Ein eigener Token als Smart Contract, gebaut mit [Hardhat](https://hardhat.org) und den
geprüften Bausteinen von [OpenZeppelin](https://docs.openzeppelin.com/contracts/5.x/).

## Was der Token kann

| Funktion | Beschreibung |
|---|---|
| **ERC-20** | Standard-Token: übertragen, Guthaben abfragen, Freigaben (`approve` / `transferFrom`). Funktioniert mit jedem Wallet (MetaMask usw.). |
| **Cap** | Feste Obergrenze der Gesamtmenge (Standard: 21 Mio.). Kann nie überschritten werden. |
| **Mint** | Nur der Owner kann neue Token prägen, bis zum Cap. |
| **Burn** | Jeder kann eigene Token vernichten (`burn`), mit Freigabe auch fremde (`burnFrom`). |
| **Permit** | Freigabe per Signatur (EIP-2612), ohne eigene Transaktion und ohne Gas. |
| **Ownership** | Owner übertragbar; mit `renounceOwnership` wird das Prägen für immer gesperrt. |

Code: [`contracts/EigenToken.sol`](contracts/EigenToken.sol) · Tests: [`test/EigenToken.test.js`](test/EigenToken.test.js)

## Loslegen

```bash
cd krypto
npm install
npm test            # kompiliert und führt die Tests aus
```

Der Solidity-Compiler kommt aus dem npm-Paket `solc` (siehe `hardhat.config.js`),
es braucht also keinen Zugriff auf `binaries.soliditylang.org`.

## Lokal ausprobieren

```bash
npm run node            # Terminal 1: lokale Blockchain mit 20 Test-Konten à 10'000 ETH
npm run deploy:local    # Terminal 2: Token deployen
```

In MetaMask kann man das Netzwerk `http://127.0.0.1:8545` (Chain-ID 31337) hinzufügen,
einen der ausgegebenen Test-Schlüssel importieren und die Token-Adresse als Token hinzufügen.

## Auf das Sepolia-Testnetz

1. `.env.example` nach `.env` kopieren und ausfüllen:
   - `SEPOLIA_RPC_URL` – kostenlos bei Alchemy oder Infura
   - `PRIVATE_KEY` – **nur ein eigenes Test-Wallet**, nie das Hauptwallet
   - optional `ETHERSCAN_API_KEY` für die automatische Verifizierung
   - Name, Symbol, Cap und Startmenge nach Wunsch
2. Test-ETH für das Wallet über einen Sepolia-Faucet holen.
3. `npm run deploy:sepolia`

## Bevor es echt wird (Mainnet)

- **Unabhängiges Audit** des Contracts. Einmal deployt, ist der Code unveränderlich.
- **Owner absichern**: Multisig (z. B. Safe) statt eines einzelnen Schlüssels.
- **Recht (Schweiz)**: Je nach Zweck gilt ein Token als Zahlungs-, Nutzungs- oder
  Anlage-Token. Die FINMA-Wegleitung für ICOs und allenfalls GwG/FIDLEG vorher prüfen,
  am besten mit Fachberatung.
- **Liquidität und Handel** (z. B. Uniswap-Pool) sind ein eigenes Thema und nicht Teil dieses Projekts.
