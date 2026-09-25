// Demo: Ein KI-Agent ohne ETH bezahlt eine API-Anfrage mit KAIRN (EIP-3009).
// Der API-Server reicht die Signatur ein und zahlt das Gas – so wie bei x402.
//
// Aufruf: npx hardhat run scripts/demo-agent-payment.js

const { ethers } = require("hardhat");
const tokenomics = require("../config/tokenomics");
const { deployKairn } = require("./lib/deploy-kairn");

async function main() {
  const [deployer, apiServer, liquidity] = await ethers.getSigners();
  const { token } = await deployKairn({
    tokenomics,
    addresses: { team: deployer.address, partners: deployer.address, liquidity: liquidity.address, foundation: deployer.address },
    airdrop: { merkleRoot: ethers.ZeroHash, total: 0n },
  });

  // Frisches Agenten-Wallet: nur KAIRN, kein ETH
  const agent = ethers.Wallet.createRandom().connect(ethers.provider);
  await token.connect(liquidity).transfer(agent.address, ethers.parseUnits("10", 18));
  const fmt = async (a) => ethers.formatUnits(await token.balanceOf(a), 18);
  console.log(`Agent ${agent.address}`);
  console.log(`  ETH:   ${ethers.formatEther(await ethers.provider.getBalance(agent.address))}`);
  console.log(`  KAIRN: ${await fmt(agent.address)}\n`);

  // 1) Agent fragt die API an, 2) Server verlangt 0.02 KAIRN (HTTP 402)
  const price = { payTo: apiServer.address, amount: ethers.parseUnits("0.02", 18), maxTimeoutSeconds: 60 };
  console.log(`API → 402 Payment Required: ${ethers.formatUnits(price.amount, 18)} KAIRN an ${price.payTo}`);

  // 3) Agent signiert offline
  const now = (await ethers.provider.getBlock("latest")).timestamp;
  const auth = {
    from: agent.address,
    to: price.payTo,
    value: price.amount,
    validAfter: 0,
    validBefore: now + price.maxTimeoutSeconds,
    nonce: ethers.hexlify(ethers.randomBytes(32)),
  };
  const { chainId } = await ethers.provider.getNetwork();
  const signature = await agent.signTypedData(
    { name: "Kairn", version: "1", chainId, verifyingContract: await token.getAddress() },
    {
      TransferWithAuthorization: [
        { name: "from", type: "address" }, { name: "to", type: "address" },
        { name: "value", type: "uint256" }, { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" }, { name: "nonce", type: "bytes32" },
      ],
    },
    auth
  );
  console.log("Agent  → signiert TransferWithAuthorization (kein Gas)");

  // 4) Server reicht ein und zahlt das Gas
  const tx = await token.connect(apiServer)[
    "transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)"
  ](auth.from, auth.to, auth.value, auth.validAfter, auth.validBefore, auth.nonce, signature);
  const receipt = await tx.wait();
  console.log(`Server → reicht ein, Gas: ${receipt.gasUsed} Einheiten, bezahlt vom Server`);
  console.log("API    → 200 OK, Daten geliefert\n");

  console.log(`Agent KAIRN danach:  ${await fmt(agent.address)}`);
  console.log(`Agent ETH danach:    ${ethers.formatEther(await ethers.provider.getBalance(agent.address))}`);
  console.log(`Server KAIRN danach: ${await fmt(apiServer.address)}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
