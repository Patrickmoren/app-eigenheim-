// x402-Server: verlangt pro Anfrage eine Zahlung in KAIRN (HTTP 402).
//
// Ablauf nach x402 (Version 1, Schema "exact"):
//  1. Anfrage ohne Zahlung            → 402 mit den Zahlungsbedingungen ("accepts")
//  2. Anfrage mit Header X-PAYMENT    → Server prüft die EIP-3009-Signatur per
//     Simulation, reicht sie on-chain ein (zahlt das Gas) und liefert die Daten.
//     Die Quittung steht im Header X-PAYMENT-RESPONSE.
//
// Der Server ist sein eigener "Facilitator" (Abrechner). So funktioniert er mit
// jedem EIP-3009-Token, ohne externen Dienst. Abhängig nur von ethers und node:http.

const http = require("node:http");
const { ethers } = require("ethers");

const X402_VERSION = 1;
const TOKEN_ABI = [
  "function transferWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce,bytes signature)",
  "function name() view returns (string)",
  // Fehler des Vertrags, damit Ablehnungen einen verständlichen Namen haben
  "error AuthorizationNotYetValid()",
  "error AuthorizationExpired()",
  "error AuthorizationAlreadyUsed()",
  "error InvalidSignature()",
  "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
];

// Namen des Vertragsfehlers ermitteln – je nach Provider steckt er an anderer Stelle
function revertName(contract, e) {
  if (e.revert?.name) return e.revert.name;
  const data = e.data ?? e.info?.error?.data ?? e.error?.data;
  if (typeof data === "string" && data.startsWith("0x")) {
    try {
      return contract.interface.parseError(data).name;
    } catch {}
  }
  return e.shortMessage || "abgelehnt";
}

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64");
const unb64 = (str) => JSON.parse(Buffer.from(str, "base64").toString("utf8"));

/**
 * @param {object} o
 * @param {ethers.Signer} o.relayer    Wallet des Servers; zahlt das Gas beim Einreichen
 * @param {string} o.token             Adresse des KAIRN-Vertrags
 * @param {string} o.payTo             Empfänger der Zahlungen
 * @param {string} o.network           x402-Netzwerkname, z. B. "base" oder "base-sepolia"
 * @param {Record<string, {price: string, description: string, handler: (url: URL) => any, validate?: (url: URL) => string | null}>} o.routes
 *        Schlüssel = Pfad-Präfix, price in KAIRN (z. B. "0.02"); price "0" = gratis.
 *        validate prüft die Anfrage VOR der Zahlung, damit niemand für einen Fehler bezahlt.
 */
function createX402Server({ relayer, token, payTo, network, routes, log = () => {} }) {
  const contract = new ethers.Contract(token, TOKEN_ABI, relayer);
  const pending = new Set(); // Nonces, die gerade abgerechnet werden
  let domainName;

  const requirementsFor = (url, route) => ({
    scheme: "exact",
    network,
    maxAmountRequired: ethers.parseUnits(route.price, 18).toString(),
    resource: url.href,
    description: route.description,
    mimeType: "application/json",
    payTo,
    maxTimeoutSeconds: 60,
    asset: token,
    extra: { name: domainName, version: "1" },
  });

  function send(res, status, body, headers = {}) {
    res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...headers });
    res.end(JSON.stringify(body));
  }

  async function settle(header, req) {
    let payment;
    try {
      payment = unb64(header);
    } catch {
      return { error: "X-PAYMENT ist kein gültiges Base64-JSON" };
    }
    if (payment.x402Version !== X402_VERSION) return { error: `x402Version ${X402_VERSION} erwartet` };
    if (payment.scheme !== "exact" || payment.network !== req.network) {
      return { error: `Nur Schema "exact" auf ${req.network} wird akzeptiert` };
    }
    const a = payment.payload?.authorization;
    const signature = payment.payload?.signature;
    if (!a || !signature) return { error: "payload.authorization oder payload.signature fehlt" };

    let value;
    try {
      value = BigInt(a.value);
    } catch {
      return { error: "authorization.value ist keine Zahl" };
    }
    if (!ethers.isAddress(a.to) || ethers.getAddress(a.to) !== ethers.getAddress(req.payTo)) {
      return { error: "Zahlung geht an die falsche Adresse" };
    }
    if (value < BigInt(req.maxAmountRequired)) return { error: "Betrag zu klein" };

    const now = Math.floor(Date.now() / 1000);
    const chainNow = Number((await relayer.provider.getBlock("latest")).timestamp);
    const t = Math.max(now, chainNow);
    if (Number(a.validBefore) < t + 6) return { error: "Autorisierung läuft zu bald ab" };
    if (Number(a.validAfter) > t) return { error: "Autorisierung ist noch nicht gültig" };

    const key = `${a.from.toLowerCase()}:${a.nonce}`;
    if (pending.has(key)) return { error: "Diese Zahlung wird bereits abgerechnet" };
    pending.add(key);
    try {
      const args = [a.from, a.to, a.value, a.validAfter, a.validBefore, a.nonce, signature];
      // Simulation prüft Signatur (auch ERC-1271), Guthaben und Nonce, ohne Gas zu kosten
      try {
        await contract.transferWithAuthorization.staticCall(...args);
      } catch (e) {
        return { error: `Zahlung ungültig: ${revertName(contract, e)}` };
      }
      const tx = await contract.transferWithAuthorization(...args);
      await tx.wait();
      log(`bezahlt: ${ethers.formatUnits(value, 18)} KAIRN von ${a.from} (tx ${tx.hash})`);
      return { receipt: { success: true, transaction: tx.hash, network: req.network, payer: ethers.getAddress(a.from) } };
    } finally {
      pending.delete(key);
    }
  }

  const server = http.createServer(async (req, res) => {
    try {
      domainName ??= await contract.name();
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const prefix = Object.keys(routes).find((p) => url.pathname === p || url.pathname.startsWith(p + "/"));
      if (!prefix || req.method !== "GET") return send(res, 404, { error: "Nicht gefunden" });

      const route = routes[prefix];
      const invalid = route.validate?.(url);
      if (invalid) return send(res, 404, { error: invalid });
      if (route.price === "0") return send(res, 200, await route.handler(url));

      const requirements = requirementsFor(url, route);
      const header = req.headers["x-payment"];
      if (!header) {
        return send(res, 402, { x402Version: X402_VERSION, error: "X-PAYMENT header is required", accepts: [requirements] });
      }

      const result = await settle(header, requirements);
      if (result.error) {
        return send(res, 402, { x402Version: X402_VERSION, error: result.error, accepts: [requirements] });
      }
      send(res, 200, await route.handler(url), { "x-payment-response": b64(result.receipt) });
    } catch (e) {
      log(`Fehler: ${e.message}`);
      send(res, 500, { error: "Interner Fehler" });
    }
  });

  return server;
}

module.exports = { createX402Server, X402_VERSION, b64, unb64 };
