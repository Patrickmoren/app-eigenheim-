// Kopiert Airdrop-Daten und Vertragsadressen in den Webseiten-Ordner.
// Aufruf: node scripts/build-website.js <netzwerk>   (z. B. base-sepolia oder base)

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const net = process.argv[2];
fs.copyFileSync(path.join(root, "airdrop", "proofs.json"), path.join(root, "website", "airdrop.json"));
console.log("website/airdrop.json aktualisiert");

if (net) {
  const src = path.join(root, "deployments", `${net}.json`);
  if (!fs.existsSync(src)) {
    console.error(`deployments/${net}.json fehlt – zuerst deployen`);
    process.exitCode = 1;
  } else {
    fs.copyFileSync(src, path.join(root, "website", "deployment.json"));
    console.log(`website/deployment.json aus ${net} übernommen – Claim-Knopf ist aktiv`);
  }
}
