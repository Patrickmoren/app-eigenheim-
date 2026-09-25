# Kairn (KAIRN)

**Der Token, mit dem KI-Agenten pro Anfrage bezahlen – ohne Gas, auf Base, gesteuert von der Community.**

<img src="brand/logo.svg" width="64" alt="Kairn-Logo">

Kairn unterstützt signierte Zahlungen nach EIP-3009 und ist damit kompatibel mit dem
x402-Protokoll (HTTP `402 Payment Required`). Ein Agent signiert, der Dienst reicht ein und
zahlt das Gas. Die Menge ist fest (1 Mrd.), es gibt keinen Owner und kein Nachprägen.

| | |
|---|---|
| Whitepaper | [docs/WHITEPAPER.md](docs/WHITEPAPER.md) |
| Go-Live-Checkliste | [docs/GO-LIVE.md](docs/GO-LIVE.md) |
| Recht und Risiken | [docs/RECHT-UND-RISIKEN.md](docs/RECHT-UND-RISIKEN.md) |
| Marke | [docs/MARKE.md](docs/MARKE.md) |
| Webseite | [website/index.html](website/index.html) |

## Aufbau

| Vertrag | Aufgabe |
|---|---|
| [`KairnToken`](contracts/KairnToken.sol) | ERC-20, EIP-3009, EIP-2612, ERC20Votes, Burn |
| [`KairnGovernor`](contracts/KairnGovernor.sol) | DAO-Abstimmungen |
| [`KairnTimelock`](contracts/KairnTimelock.sol) | DAO-Treasury mit 2 Tagen Wartefrist |
| [`KairnVesting`](contracts/KairnVesting.sol) | lineare Freigabe mit Cliff (Team, Partner) |
| [`KairnAirdrop`](contracts/KairnAirdrop.sol) | Merkle-Claim, Rest nach 180 Tagen ans Treasury |

Verteilung und Parameter: [`config/tokenomics.js`](config/tokenomics.js).

## Befehle

```bash
npm install
npm test                       # 31 Tests
npm run coverage               # Testabdeckung
npm run demo                   # Agent ohne ETH bezahlt eine API
npm run airdrop                # airdrop/liste.csv → Merkle-Root und Beweise

npm run node                   # lokale Chain (Terminal 1)
npm run deploy:local           # komplettes System deployen (Terminal 2)

npm run deploy:base-sepolia    # Testnetz (braucht .env)
npm run verify -- --network base-sepolia
npm run website -- base-sepolia

npm run deploy:base            # Mainnet – gesperrt bis CONFIRM_MAINNET=ja
```

Der Solidity-Compiler kommt aus dem npm-Paket `solc`, es braucht keinen Zugriff auf
`binaries.soliditylang.org`.

## Was beim Deployment passiert

1. Token wird geprägt, gesamte Menge an den Deployer
2. Timelock und Governor werden deployt, der Governor erhält die Vorschlagsrechte
3. **Der Deployer gibt seine Admin-Rolle ab** – ab hier steuert nur die DAO das Treasury
4. Vesting-Verträge und Airdrop werden deployt
5. Alle Token werden verteilt; das Skript prüft, dass die Summe exakt stimmt
6. Adressen landen in `deployments/<netzwerk>.json`

> Risikohinweis: KAIRN ist kein Anlageprodukt. Smart Contracts können Fehler enthalten.
> Vor dem Mainnet ist ein externes Audit und eine rechtliche Abklärung Pflicht (siehe Checkliste).
