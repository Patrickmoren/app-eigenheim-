const { ethers } = require("hardhat");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const tokenomics = require("../config/tokenomics");
const { deployKairn } = require("../scripts/lib/deploy-kairn");

const unit = (n) => ethers.parseUnits(String(n), 18);
const DAY = 24 * 60 * 60;
const MONTH = 30 * DAY;

async function deploySystem() {
  const [deployer, alice, bob, carol, team, partners, liquidity, foundation, relayer] = await ethers.getSigners();
  const tree = StandardMerkleTree.of(
    [
      [alice.address, unit(25_000).toString()],
      [bob.address, unit(10_000).toString()],
    ],
    ["address", "uint256"]
  );
  const res = await deployKairn({
    tokenomics,
    addresses: {
      team: team.address,
      partners: partners.address,
      liquidity: liquidity.address,
      foundation: foundation.address,
    },
    airdrop: { merkleRoot: tree.root, total: unit(35_000) },
  });
  const proofOf = (addr) => {
    for (const [i, v] of tree.entries()) if (v[0] === addr) return { amount: BigInt(v[1]), proof: tree.getProof(i) };
    throw new Error("nicht in der Liste");
  };
  return { ...res, tree, proofOf, deployer, alice, bob, carol, team, partners, liquidity, foundation, relayer };
}

async function domain(token) {
  const { chainId } = await ethers.provider.getNetwork();
  return { name: "Kairn", version: "1", chainId, verifyingContract: await token.getAddress() };
}

const AUTH_FIELDS = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "validAfter", type: "uint256" },
  { name: "validBefore", type: "uint256" },
  { name: "nonce", type: "bytes32" },
];

async function signAuthorization(signer, token, msg, kind = "TransferWithAuthorization") {
  return signer.signTypedData(await domain(token), { [kind]: AUTH_FIELDS }, msg);
}

module.exports = { unit, DAY, MONTH, deploySystem, domain, signAuthorization, tokenomics };
