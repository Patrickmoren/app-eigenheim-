# Go-Live-Checkliste

Das Mainnet-Deployment ist im Skript gesperrt, bis `CONFIRM_MAINNET=ja` gesetzt ist.
Diese Liste zuerst vollständig abarbeiten.

## A. Erledigt (automatisch vorbereitet)

- [x] Konzept, Name, Tokenomics, Governance-Parameter
- [x] Verträge: `KairnToken`, `KairnGovernor`, `KairnTimelock`, `KairnVesting`, `KairnAirdrop`
- [x] 31 Vertrags-Tests, 100 % Zeilenabdeckung (`npm test`, `npm run coverage`)
- [x] Deploy-Skript mit Verteilungsprüfung und Mainnet-Sperre
- [x] Verify-Skript für Basescan
- [x] Airdrop-Werkzeug (CSV → Merkle-Root und Beweise)
- [x] Demo der Agenten-Zahlung (`npm run demo`)
- [x] x402-Beispiel-API mit Agenten-Client und 8 Tests (`npm run demo:x402`)
- [x] Webseite mit Airdrop-Prüfung und Claim (`website/`)
- [x] Whitepaper, Markenleitfaden, Recht und Risiken

## B. Testnetz (Base Sepolia) – braucht dich

- [ ] Test-Wallet anlegen, Schlüssel in `.env` (`PRIVATE_KEY`)
- [ ] Test-ETH holen (z. B. Coinbase Developer Platform Faucet)
- [ ] Etherscan-API-Schlüssel (v2) in `.env`
- [ ] `npm run deploy:base-sepolia`
- [ ] `npm run verify -- --network base-sepolia`
- [ ] `npm run website -- base-sepolia` und Webseite testweise hosten
- [ ] Airdrop mit eigener Adresse auf der Liste durchspielen
- [ ] DAO-Vorschlag im Testnetz durchspielen (z. B. mit Tally)
- [ ] x402-Demo-API öffentlich hosten: `X402_SERVER_KEY` setzen, `npm run x402 -- base-sepolia`
- [ ] Bug-Bounty ausschreiben (z. B. Immunefi, Cantina)

## C. Vor dem Mainnet – braucht dich

**Recht**
- [ ] Kanzlei beauftragen, Fragen aus `RECHT-UND-RISIKEN.md` klären
- [ ] Stiftung oder andere Rechtsträgerin gründen
- [ ] Nutzungsbedingungen und Datenschutzerklärung für Webseite und Airdrop

**Sicherheit**
- [ ] Externes Audit (z. B. ChainSecurity (Zürich), OpenZeppelin, Trail of Bits); Befunde beheben
- [ ] Safe-Multisigs (z. B. 3 von 5) für Team, Partner, Liquidität, Stiftung anlegen
- [ ] Frisches Deploy-Wallet nur mit etwas ETH auf Base

**Marke**
- [ ] Markenrecherche „Kairn“ (Swissreg, EUIPO, USPTO), ggf. Anmeldung
- [ ] Domain und Social-Handles sichern (siehe `MARKE.md`)

**Airdrop**
- [ ] Kriterien festlegen, Liste erstellen, Sybil-Filter anwenden
- [ ] `airdrop/liste.csv` ersetzen → `npm run airdrop`
- [ ] Liste und Merkle-Root öffentlich machen

**Konfiguration**
- [ ] `.env`: `TEAM_ADDRESS`, `PARTNERS_ADDRESS`, `LIQUIDITY_ADDRESS`, `FOUNDATION_ADDRESS` = Multisigs
- [ ] `VESTING_START` festlegen (optional)
- [ ] Parameter in `config/tokenomics.js` final bestätigen

## D. Go-Live (nicht automatisiert)

- [ ] `CONFIRM_MAINNET=ja npm run deploy:base`
- [ ] `npm run verify -- --network base`
- [ ] `npm run website -- base`, Webseite veröffentlichen
- [ ] Liquiditätspool (z. B. Uniswap oder Aerodrome) aus der Liquiditäts-Multisig
- [ ] Token-Logo bei Basescan, CoinGecko und Token-Listen einreichen
- [ ] Ankündigung mit Vertragsadressen und Risikohinweis
