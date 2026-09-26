// x402-Client für Agenten: fetch(), das bei HTTP 402 automatisch mit KAIRN bezahlt.
// Der Agent braucht nur KAIRN, kein ETH – er signiert bloss.

const { ethers } = require("ethers");
const { X402_VERSION, b64, unb64 } = require("./server");

const AUTH_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
};

/**
 * @param {ethers.Signer} wallet       Wallet des Agenten
 * @param {object} o
 * @param {bigint} o.chainId
 * @param {string} o.token             nur Zahlungen in diesem Token akzeptieren
 * @param {bigint} o.maxPerRequest     Obergrenze pro Anfrage in Wei (Schutz vor teuren Servern)
 */
function createPayingFetch(wallet, { chainId, token, maxPerRequest }) {
  return async function payingFetch(url, init = {}) {
    const first = await fetch(url, init);
    if (first.status !== 402) return first;

    const body = await first.json();
    const req = (body.accepts || []).find(
      (r) => r.scheme === "exact" && r.asset && ethers.getAddress(r.asset) === ethers.getAddress(token)
    );
    if (!req) throw new Error("Server akzeptiert kein KAIRN");
    const amount = BigInt(req.maxAmountRequired);
    if (amount > maxPerRequest) {
      throw new Error(`Preis ${ethers.formatUnits(amount, 18)} KAIRN über dem Limit von ${ethers.formatUnits(maxPerRequest, 18)}`);
    }

    const now = Math.floor(Date.now() / 1000);
    const authorization = {
      from: await wallet.getAddress(),
      to: req.payTo,
      value: amount.toString(),
      validAfter: "0",
      validBefore: String(now + (req.maxTimeoutSeconds || 60)),
      nonce: ethers.hexlify(ethers.randomBytes(32)),
    };
    const signature = await wallet.signTypedData(
      { name: req.extra?.name || "Kairn", version: req.extra?.version || "1", chainId, verifyingContract: req.asset },
      AUTH_TYPES,
      authorization
    );
    const payment = { x402Version: X402_VERSION, scheme: "exact", network: req.network, payload: { signature, authorization } };

    const headers = new Headers(init.headers);
    headers.set("X-PAYMENT", b64(payment));
    const paid = await fetch(url, { ...init, headers });
    const receipt = paid.headers.get("x-payment-response");
    paid.receipt = receipt ? unb64(receipt) : null;
    return paid;
  };
}

module.exports = { createPayingFetch, AUTH_TYPES };
