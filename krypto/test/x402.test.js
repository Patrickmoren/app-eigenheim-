const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { unit, deploySystem } = require("./helpers");
const { createX402Server, b64, unb64 } = require("../x402/server");
const { createPayingFetch, AUTH_TYPES } = require("../x402/client");
const routes = require("../x402/routes");

describe("x402-Beispiel-API", function () {
  let api;
  afterEach(() => api && api.close());

  async function apiFixture() {
    const s = await deploySystem();
    const tokenAddr = await s.token.getAddress();
    const agent = ethers.Wallet.createRandom().connect(ethers.provider);
    await s.token.connect(s.liquidity).transfer(agent.address, unit(1));
    const { chainId } = await ethers.provider.getNetwork();
    return { ...s, tokenAddr, agent, chainId };
  }

  async function start(f) {
    api = createX402Server({ relayer: f.relayer, token: f.tokenAddr, payTo: f.carol.address, network: "hardhat", routes });
    await new Promise((r) => api.listen(0, r));
    return `http://localhost:${api.address().port}`;
  }

  // Baut einen X-PAYMENT-Header von Hand, um Manipulationen zu testen
  async function header(f, signer, overrides = {}) {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const authorization = {
      from: signer.address,
      to: f.carol.address,
      value: unit("0.02").toString(),
      validAfter: "0",
      validBefore: String(Math.max(now, Math.floor(Date.now() / 1000)) + 60),
      nonce: ethers.hexlify(ethers.randomBytes(32)),
      ...overrides,
    };
    const signature = await signer.signTypedData(
      { name: "Kairn", version: "1", chainId: f.chainId, verifyingContract: f.tokenAddr },
      AUTH_TYPES,
      authorization
    );
    return b64({ x402Version: 1, scheme: "exact", network: "hardhat", payload: { signature, authorization } });
  }

  it("antwortet ohne Zahlung mit 402 und den Bedingungen", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const res = await fetch(`${base}/wetter/zermatt`);
    expect(res.status).to.equal(402);
    const body = await res.json();
    expect(body.x402Version).to.equal(1);
    const [req] = body.accepts;
    expect(req).to.include({
      scheme: "exact",
      network: "hardhat",
      asset: f.tokenAddr,
      payTo: f.carol.address,
      maxAmountRequired: unit("0.02").toString(),
    });
    expect(req.extra).to.deep.equal({ name: "Kairn", version: "1" });
  });

  it("liefert Gratis-Endpunkte ohne Zahlung", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const res = await fetch(`${base}/orte`);
    expect(res.status).to.equal(200);
    expect((await res.json()).orte).to.include("zermatt");
  });

  it("Agent ohne ETH bezahlt automatisch und erhält Daten und Quittung", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const pay = createPayingFetch(f.agent, { chainId: f.chainId, token: f.tokenAddr, maxPerRequest: unit("0.5") });

    const res = await pay(`${base}/wetter/saentis`);
    expect(res.status).to.equal(200);
    expect((await res.json()).ort).to.equal("saentis");
    expect(res.receipt).to.include({ success: true, network: "hardhat", payer: f.agent.address });
    expect(await f.token.balanceOf(f.carol.address)).to.equal(unit("0.02"));
    expect(await f.token.balanceOf(f.agent.address)).to.equal(unit("0.98"));
    expect(await ethers.provider.getBalance(f.agent.address)).to.equal(0);
  });

  it("verlangt keine Zahlung für ungültige Anfragen", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const pay = createPayingFetch(f.agent, { chainId: f.chainId, token: f.tokenAddr, maxPerRequest: unit("0.5") });
    const res = await pay(`${base}/wetter/atlantis`);
    expect(res.status).to.equal(404);
    expect(await f.token.balanceOf(f.agent.address)).to.equal(unit(1));
  });

  it("lehnt zu kleine Beträge, falsche Empfänger und falsches Netz ab", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const cases = [
      [await header(f, f.agent, { value: unit("0.01").toString() }), "Betrag zu klein"],
      [await header(f, f.agent, { to: f.bob.address }), "falsche Adresse"],
    ];
    const wrongNet = unb64(await header(f, f.agent));
    wrongNet.network = "base";
    cases.push([b64(wrongNet), "Nur Schema"]);
    cases.push(["kein-base64-json", "kein gültiges"]);

    for (const [h, msg] of cases) {
      const res = await fetch(`${base}/wetter/zermatt`, { headers: { "X-PAYMENT": h } });
      expect(res.status).to.equal(402);
      expect((await res.json()).error).to.include(msg);
    }
    expect(await f.token.balanceOf(f.agent.address)).to.equal(unit(1));
  });

  it("verhindert, dass dieselbe Zahlung zweimal verwendet wird", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const h = await header(f, f.agent);
    const first = await fetch(`${base}/wetter/zermatt`, { headers: { "X-PAYMENT": h } });
    expect(first.status).to.equal(200);
    const second = await fetch(`${base}/wetter/zermatt`, { headers: { "X-PAYMENT": h } });
    expect(second.status).to.equal(402);
    expect((await second.json()).error).to.include("AuthorizationAlreadyUsed");
    expect(await f.token.balanceOf(f.carol.address)).to.equal(unit("0.02"));
  });

  it("lehnt Zahlungen ohne Deckung und mit fremder Signatur ab", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const broke = ethers.Wallet.createRandom();
    const r1 = await fetch(`${base}/wetter/zermatt`, { headers: { "X-PAYMENT": await header(f, broke) } });
    expect((await r1.json()).error).to.include("ERC20InsufficientBalance");

    const forged = await header(f, broke, { from: f.agent.address });
    const r2 = await fetch(`${base}/wetter/zermatt`, { headers: { "X-PAYMENT": forged } });
    expect((await r2.json()).error).to.include("InvalidSignature");
    expect(await f.token.balanceOf(f.agent.address)).to.equal(unit(1));
  });

  it("Client zahlt nie mehr als sein Limit", async function () {
    const f = await loadFixture(apiFixture);
    const base = await start(f);
    const pay = createPayingFetch(f.agent, { chainId: f.chainId, token: f.tokenAddr, maxPerRequest: unit("0.05") });
    await expect(pay(`${base}/lawinen/zermatt`)).to.be.rejectedWith("über dem Limit");
    expect(await f.token.balanceOf(f.agent.address)).to.equal(unit(1));
  });
});
