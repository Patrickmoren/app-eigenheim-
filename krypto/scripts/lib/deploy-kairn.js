// Deployt das komplette Kairn-System und verteilt alle Token.
// Wird vom Deploy-Skript UND von den Tests verwendet, damit genau der
// getestete Ablauf auch live läuft.

const { ethers } = require("hardhat");

const MAINNET_CHAIN_IDS = new Set([1n, 8453n]); // Ethereum, Base

/**
 * @param {object} p
 * @param {object} p.tokenomics      config/tokenomics.js
 * @param {object} p.addresses       { team, partners, liquidity, foundation }
 * @param {object} p.airdrop         { merkleRoot, total } (total in Wei)
 * @param {bigint} [p.vestingStart]  Unix-Zeit; Standard: jetzt
 * @param {(msg: string) => void} [p.log]
 */
async function deployKairn({ tokenomics, addresses, airdrop, vestingStart, log = () => {} }) {
  const [deployer] = await ethers.getSigners();
  const unit = (n) => ethers.parseUnits(String(n), 18);
  const a = tokenomics.allocations;

  const percentSum = Object.values(a).reduce((s, x) => s + x.percent, 0);
  if (percentSum !== 100) throw new Error(`Prozente ergeben ${percentSum}, nicht 100`);

  const total = unit(tokenomics.totalSupply);
  const share = (pct) => (total * BigInt(pct)) / 100n;
  const airdropShare = share(a.airdrop.percent);
  if (airdrop.total > airdropShare) {
    throw new Error("Airdrop-Liste ist grösser als die Airdrop-Zuteilung");
  }

  const now = BigInt((await ethers.provider.getBlock("latest")).timestamp);
  const start = vestingStart ?? now;

  // 1) Token – gesamte Menge an den Deployer, der sie gleich weiterverteilt
  const token = await ethers.deployContract("KairnToken", [deployer.address]);
  await token.waitForDeployment();
  log(`KairnToken      ${await token.getAddress()}`);

  // 2) Timelock (Treasury) mit Deployer als vorübergehendem Admin
  const timelock = await ethers.deployContract("KairnTimelock", [
    tokenomics.governance.timelockDelay, [], [ethers.ZeroAddress], deployer.address,
  ]);
  await timelock.waitForDeployment();
  log(`KairnTimelock   ${await timelock.getAddress()}`);

  // 3) Governor
  const governor = await ethers.deployContract("KairnGovernor", [
    await token.getAddress(), await timelock.getAddress(),
  ]);
  await governor.waitForDeployment();
  log(`KairnGovernor   ${await governor.getAddress()}`);

  // 4) Rollen: nur der Governor schlägt vor und storniert; danach Admin abgeben
  const gov = await governor.getAddress();
  await (await timelock.grantRole(await timelock.PROPOSER_ROLE(), gov)).wait();
  await (await timelock.grantRole(await timelock.CANCELLER_ROLE(), gov)).wait();
  await (await timelock.renounceRole(await timelock.DEFAULT_ADMIN_ROLE(), deployer.address)).wait();
  log("Timelock-Admin abgegeben – nur noch die DAO steuert das Treasury");

  // 5) Vesting
  const team = await ethers.deployContract("KairnVesting", [
    addresses.team, start, a.team.duration, a.team.cliff,
  ]);
  await team.waitForDeployment();
  log(`Vesting Team    ${await team.getAddress()}`);

  const partners = await ethers.deployContract("KairnVesting", [
    addresses.partners, start, a.partners.duration, a.partners.cliff,
  ]);
  await partners.waitForDeployment();
  log(`Vesting Partner ${await partners.getAddress()}`);

  // 6) Airdrop
  const deadline = now + BigInt(a.airdrop.claimDays * 24 * 60 * 60);
  const drop = await ethers.deployContract("KairnAirdrop", [
    await token.getAddress(), airdrop.merkleRoot, deadline, await timelock.getAddress(),
  ]);
  await drop.waitForDeployment();
  log(`KairnAirdrop    ${await drop.getAddress()}`);

  // 7) Verteilung – jeder Anteil wird explizit berechnet. Das Treasury erhält
  //    zusätzlich den Teil der Airdrop-Zuteilung, den die Liste nicht braucht.
  const transfers = [
    ["Airdrop", await drop.getAddress(), airdrop.total],
    ["Vesting Team", await team.getAddress(), share(a.team.percent)],
    ["Vesting Partner", await partners.getAddress(), share(a.partners.percent)],
    ["Liquidität", addresses.liquidity, share(a.liquidity.percent)],
    ["Stiftung", addresses.foundation, share(a.foundation.percent)],
    ["DAO-Treasury", await timelock.getAddress(), share(a.treasury.percent) + airdropShare - airdrop.total],
  ];
  const sum = transfers.reduce((s, [, , amount]) => s + amount, 0n);
  if (sum !== total) throw new Error(`Verteilung ergibt ${sum}, erwartet ${total}`);

  for (const [name, to, amount] of transfers) {
    await (await token.transfer(to, amount)).wait();
    log(`→ ${name.padEnd(16)} ${ethers.formatUnits(amount, 18)} KAIRN`);
  }

  return { token, timelock, governor, teamVesting: team, partnerVesting: partners, airdrop: drop, deadline, start };
}

module.exports = { deployKairn, MAINNET_CHAIN_IDS };
