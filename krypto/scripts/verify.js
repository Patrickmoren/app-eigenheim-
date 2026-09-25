// Verifiziert alle Verträge eines Deployments auf Basescan/Etherscan.
// Aufruf: npx hardhat run scripts/verify.js --network base-sepolia

const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const tokenomics = require("../config/tokenomics");

async function verify(address, constructorArguments) {
  try {
    await hre.run("verify:verify", { address, constructorArguments });
  } catch (e) {
    if (/already verified/i.test(e.message)) console.log(`${address}: bereits verifiziert`);
    else throw e;
  }
}

async function main() {
  const file = path.join(__dirname, "..", "deployments", `${hre.network.name}.json`);
  const d = JSON.parse(fs.readFileSync(file, "utf8"));
  const c = d.contracts;
  const p = d.parameters;
  const a = tokenomics.allocations;

  await verify(c.KairnToken, [d.deployer]);
  await verify(c.KairnTimelock, [tokenomics.governance.timelockDelay, [], [hre.ethers.ZeroAddress], d.deployer]);
  await verify(c.KairnGovernor, [c.KairnToken, c.KairnTimelock]);
  await verify(c.VestingTeam, [p.addresses.team, p.vestingStart, a.team.duration, a.team.cliff]);
  await verify(c.VestingPartners, [p.addresses.partners, p.vestingStart, a.partners.duration, a.partners.cliff]);
  await verify(c.KairnAirdrop, [c.KairnToken, p.merkleRoot, p.airdropDeadline, c.KairnTimelock]);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
