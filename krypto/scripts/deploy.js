// Deployt das komplette Kairn-System.
//   npm run deploy:local         – lokale Hardhat-Chain
//   npm run deploy:base-sepolia  – Base-Testnetz
//   npm run deploy:base          – Base Mainnet (GO-LIVE, verlangt CONFIRM_MAINNET=ja)

const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { ethers } = hre;
const tokenomics = require("../config/tokenomics");
const { deployKairn, MAINNET_CHAIN_IDS } = require("./lib/deploy-kairn");

async function main() {
  const [deployer] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();
  const isMainnet = MAINNET_CHAIN_IDS.has(chainId);

  console.log(`Netzwerk: ${hre.network.name} (Chain-ID ${chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Guthaben: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

  if (isMainnet && process.env.CONFIRM_MAINNET !== "ja") {
    throw new Error(
      "Mainnet-Deployment gesperrt. Erst die Go-Live-Checkliste (docs/GO-LIVE.md) abarbeiten, " +
        "dann mit CONFIRM_MAINNET=ja erneut starten."
    );
  }

  // Empfänger-Adressen
  const addresses = {};
  for (const [key, alloc] of Object.entries(tokenomics.allocations)) {
    if (!alloc.env) continue;
    const value = process.env[alloc.env];
    if (!value) {
      if (isMainnet) throw new Error(`${alloc.env} fehlt in der .env`);
      console.log(`Hinweis: ${alloc.env} leer – im Testnetz wird der Deployer verwendet`);
      addresses[key] = deployer.address;
    } else {
      addresses[key] = ethers.getAddress(value);
    }
  }

  // Airdrop-Baum
  const proofsFile = path.join(__dirname, "..", "airdrop", "proofs.json");
  if (!fs.existsSync(proofsFile)) throw new Error("airdrop/proofs.json fehlt – zuerst `npm run airdrop` ausführen");
  const { merkleRoot, total } = JSON.parse(fs.readFileSync(proofsFile, "utf8"));

  const vestingStart = process.env.VESTING_START ? BigInt(process.env.VESTING_START) : undefined;

  const res = await deployKairn({
    tokenomics,
    addresses,
    airdrop: { merkleRoot, total: BigInt(total) },
    vestingStart,
    log: (m) => console.log(m),
  });

  const out = {
    network: hre.network.name,
    chainId: Number(chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      KairnToken: await res.token.getAddress(),
      KairnTimelock: await res.timelock.getAddress(),
      KairnGovernor: await res.governor.getAddress(),
      VestingTeam: await res.teamVesting.getAddress(),
      VestingPartners: await res.partnerVesting.getAddress(),
      KairnAirdrop: await res.airdrop.getAddress(),
    },
    parameters: {
      vestingStart: Number(res.start),
      airdropDeadline: Number(res.deadline),
      merkleRoot,
      addresses,
    },
  };
  const outFile = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + "\n");
  console.log(`\nAdressen gespeichert: ${path.relative(process.cwd(), outFile)}`);
  console.log("Verifizieren: npm run verify -- --network " + hre.network.name);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
