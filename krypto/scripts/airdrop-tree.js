// Erstellt aus airdrop/liste.csv (adresse,menge in ganzen KAIRN) den Merkle-Baum.
// Ausgabe:
//   airdrop/tree.json    – vollständiger Baum (für das Deploy-Skript)
//   airdrop/proofs.json  – Adresse → { amount, proof } (für die Claim-Webseite)
//
// Aufruf: node scripts/airdrop-tree.js [pfad/zur/liste.csv]

const fs = require("fs");
const path = require("path");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { getAddress, parseUnits, formatUnits } = require("ethers");

const input = process.argv[2] || path.join(__dirname, "..", "airdrop", "liste.csv");
const outDir = path.join(__dirname, "..", "airdrop");

function buildTree(csv) {
  const seen = new Set();
  const values = [];
  csv.split(/\r?\n/).forEach((line, i) => {
    const t = line.trim();
    if (!t || t.startsWith("#") || /^adresse/i.test(t)) return;
    const [addr, amount] = t.split(/[,;]/).map((s) => s.trim());
    let checksummed;
    try {
      checksummed = getAddress(addr.toLowerCase());
    } catch {
      throw new Error(`Zeile ${i + 1}: ungültige Adresse "${addr}"`);
    }
    if (seen.has(checksummed)) throw new Error(`Zeile ${i + 1}: Adresse doppelt ${checksummed}`);
    if (!/^\d+(\.\d{1,18})?$/.test(amount || "")) throw new Error(`Zeile ${i + 1}: ungültige Menge "${amount}"`);
    const wei = parseUnits(amount, 18);
    if (wei === 0n) throw new Error(`Zeile ${i + 1}: Menge 0`);
    seen.add(checksummed);
    values.push([checksummed, wei.toString()]);
  });
  if (values.length === 0) throw new Error("Liste ist leer");
  return StandardMerkleTree.of(values, ["address", "uint256"]);
}

function main() {
  const tree = buildTree(fs.readFileSync(input, "utf8"));
  let total = 0n;
  const proofs = {};
  for (const [i, [addr, amount]] of tree.entries()) {
    total += BigInt(amount);
    proofs[addr] = { amount, proof: tree.getProof(i) };
  }
  fs.writeFileSync(path.join(outDir, "tree.json"), JSON.stringify(tree.dump(), null, 2));
  fs.writeFileSync(
    path.join(outDir, "proofs.json"),
    JSON.stringify({ merkleRoot: tree.root, total: total.toString(), claims: proofs }, null, 2)
  );
  console.log(`Einträge:    ${tree.length}`);
  console.log(`Total:       ${formatUnits(total, 18)} KAIRN`);
  console.log(`Merkle-Root: ${tree.root}`);
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(`Fehler: ${e.message}`);
    process.exitCode = 1;
  }
}

module.exports = { buildTree };
