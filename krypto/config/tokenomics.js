// Verteilung der 1'000'000'000 KAIRN. Summe der Prozente muss 100 ergeben.
// Adressen kommen aus der .env (siehe .env.example); fehlt eine, wird im
// Testnetz die Deployer-Adresse verwendet, im Mainnet bricht das Skript ab.

const MONAT = 30 * 24 * 60 * 60;

module.exports = {
  totalSupply: 1_000_000_000,

  allocations: {
    // DAO-Treasury (Timelock): Grants für Agenten-Entwickler, Integrationen, Audits
    treasury: { percent: 40 },
    // Community-Airdrop per Merkle-Claim; Rest nach Frist an das Treasury
    airdrop: { percent: 20, claimDays: 180 },
    // Team: 12 Monate Cliff, danach linear bis Monat 48
    team: { percent: 15, env: "TEAM_ADDRESS", cliff: 12 * MONAT, duration: 48 * MONAT },
    // Partner & Berater: 6 Monate Cliff, danach linear bis Monat 24
    partners: { percent: 10, env: "PARTNERS_ADDRESS", cliff: 6 * MONAT, duration: 24 * MONAT },
    // Liquidität für den DEX-Pool (Multisig)
    liquidity: { percent: 10, env: "LIQUIDITY_ADDRESS" },
    // Stiftung / Betrieb (Multisig): Recht, Listings, Infrastruktur
    foundation: { percent: 5, env: "FOUNDATION_ADDRESS" },
  },

  governance: {
    timelockDelay: 2 * 24 * 60 * 60, // 2 Tage
  },
};
