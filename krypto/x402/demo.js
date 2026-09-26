// Komplette x402-Demo auf der lokalen Hardhat-Chain:
// Deployment → API-Server starten → Agent ohne ETH ruft kostenpflichtige Endpunkte auf.
// Aufruf: npm run demo:x402

const { ethers } = require("hardhat");
const tokenomics = require("../config/tokenomics");
const { deployKairn } = require("../scripts/lib/deploy-kairn");
const { createX402Server } = require("./server");
const { createPayingFetch } = require("./client");
const routes = require("./routes");

async function main() {
  const [deployer, server, liquidity] = await ethers.getSigners();
  const { token } = await deployKairn({
    tokenomics,
    addresses: { team: deployer.address, partners: deployer.address, liquidity: liquidity.address, foundation: deployer.address },
    airdrop: { merkleRoot: ethers.ZeroHash, total: 0n },
  });
  const tokenAddr = await token.getAddress();

  const api = createX402Server({ relayer: server, token: tokenAddr, payTo: server.address, network: "hardhat", routes });
  await new Promise((r) => api.listen(0, r));
  const base = `http://localhost:${api.address().port}`;

  const agent = ethers.Wallet.createRandom().connect(ethers.provider);
  await token.connect(liquidity).transfer(agent.address, ethers.parseUnits("1", 18));
  const kairn = async (a) => ethers.formatUnits(await token.balanceOf(a), 18);
  console.log(`Agent ${agent.address}: ${await kairn(agent.address)} KAIRN, ${ethers.formatEther(await ethers.provider.getBalance(agent.address))} ETH\n`);

  const { chainId } = await ethers.provider.getNetwork();
  const pay = createPayingFetch(agent, { chainId, token: tokenAddr, maxPerRequest: ethers.parseUnits("0.5", 18) });

  const raw = await fetch(`${base}/wetter/zermatt`);
  const offer = await raw.json();
  console.log(`GET /wetter/zermatt ohne Zahlung → ${raw.status}, Preis ${ethers.formatUnits(offer.accepts[0].maxAmountRequired, 18)} KAIRN`);

  for (const p of ["/orte", "/wetter/zermatt", "/wetter/saentis", "/lawinen/saentis"]) {
    const res = await pay(`${base}${p}`);
    const data = await res.json();
    const paid = res.receipt ? `bezahlt, tx ${res.receipt.transaction.slice(0, 10)}…` : "gratis";
    console.log(`GET ${p.padEnd(18)} → ${res.status} (${paid}) ${JSON.stringify(data)}`);
  }

  console.log(`\nAgent danach:  ${await kairn(agent.address)} KAIRN, ${ethers.formatEther(await ethers.provider.getBalance(agent.address))} ETH`);
  console.log(`Server danach: ${await kairn(server.address)} KAIRN`);
  api.close();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
