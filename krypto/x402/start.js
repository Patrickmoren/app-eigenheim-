// Startet die Beispiel-API gegen ein echtes Netz (Testnetz oder Base).
// Braucht in der .env: X402_SERVER_KEY (Wallet mit etwas ETH fürs Gas),
// optional X402_PAY_TO (Standard: Adresse des Server-Wallets), X402_PORT.
// Aufruf: node x402/start.js base-sepolia

require("dotenv").config({ path: require("node:path").join(__dirname, "..", ".env") });
const fs = require("node:fs");
const path = require("node:path");
const { ethers } = require("ethers");
const { createX402Server } = require("./server");
const routes = require("./routes");

const NETS = {
  "base-sepolia": { rpc: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org" },
  base: { rpc: process.env.BASE_RPC_URL || "https://mainnet.base.org" },
};

async function main() {
  const network = process.argv[2] || "base-sepolia";
  if (!NETS[network]) throw new Error(`Unbekanntes Netz: ${network}`);
  const file = path.join(__dirname, "..", "deployments", `${network}.json`);
  if (!fs.existsSync(file)) throw new Error(`deployments/${network}.json fehlt – zuerst deployen`);
  const { contracts } = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!process.env.X402_SERVER_KEY) throw new Error("X402_SERVER_KEY fehlt in der .env");

  const provider = new ethers.JsonRpcProvider(NETS[network].rpc);
  const relayer = new ethers.Wallet(process.env.X402_SERVER_KEY, provider);
  const payTo = process.env.X402_PAY_TO ? ethers.getAddress(process.env.X402_PAY_TO) : relayer.address;
  const port = Number(process.env.X402_PORT || 4020);

  createX402Server({ relayer, token: contracts.KairnToken, payTo, network, routes, log: console.log }).listen(port, () => {
    console.log(`Kairn Bergwetter läuft auf http://localhost:${port} (${network})`);
    console.log(`Zahlungen an ${payTo}, Gas zahlt ${relayer.address}`);
  });
}

main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
