const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { unit, deploySystem, domain, signAuthorization } = require("./helpers");

describe("KairnToken", function () {
  describe("Grunddaten", function () {
    it("Name, Symbol, Dezimalstellen, feste Menge", async function () {
      const { token } = await loadFixture(deploySystem);
      expect(await token.name()).to.equal("Kairn");
      expect(await token.symbol()).to.equal("KAIRN");
      expect(await token.decimals()).to.equal(18);
      expect(await token.totalSupply()).to.equal(unit(1_000_000_000));
    });

    it("hat weder Owner noch Mint-Funktion", async function () {
      const { token } = await loadFixture(deploySystem);
      const names = token.interface.fragments.filter((f) => f.type === "function").map((f) => f.name);
      expect(names).to.not.include("mint");
      expect(names).to.not.include("owner");
      expect(names).to.not.include("pause");
    });

    it("burn verringert die Gesamtmenge", async function () {
      const { token, liquidity } = await loadFixture(deploySystem);
      await token.connect(liquidity).burn(unit(1));
      expect(await token.totalSupply()).to.equal(unit(999_999_999));
    });
  });

  describe("Permit (EIP-2612)", function () {
    it("setzt eine Freigabe per Signatur", async function () {
      const { token, liquidity, alice } = await loadFixture(deploySystem);
      const value = unit(42);
      const deadline = ethers.MaxUint256;
      const nonce = await token.nonces(liquidity.address);
      const sig = ethers.Signature.from(
        await liquidity.signTypedData(
          await domain(token),
          {
            Permit: [
              { name: "owner", type: "address" },
              { name: "spender", type: "address" },
              { name: "value", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "deadline", type: "uint256" },
            ],
          },
          { owner: liquidity.address, spender: alice.address, value, nonce, deadline }
        )
      );
      await token.connect(alice).permit(liquidity.address, alice.address, value, deadline, sig.v, sig.r, sig.s);
      expect(await token.allowance(liquidity.address, alice.address)).to.equal(value);
    });
  });

  describe("Agenten-Zahlungen (EIP-3009)", function () {
    async function paymentFixture() {
      const s = await deploySystem();
      await s.token.connect(s.liquidity).transfer(s.alice.address, unit(100));
      const now = await time.latest();
      const msg = {
        from: s.alice.address,
        to: s.bob.address,
        value: unit(1),
        validAfter: 0,
        validBefore: now + 3600,
        nonce: ethers.hexlify(ethers.randomBytes(32)),
      };
      return { ...s, msg };
    }
    const TWA_BYTES = "transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)";
    const TWA_VRS = "transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)";
    const RWA = "receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,bytes)";
    const args = (m) => [m.from, m.to, m.value, m.validAfter, m.validBefore, m.nonce];

    it("Relayer reicht die Zahlung ein und zahlt das Gas (bytes-Signatur)", async function () {
      const { token, alice, bob, relayer, msg } = await loadFixture(paymentFixture);
      const sig = await signAuthorization(alice, token, msg);
      await expect(token.connect(relayer)[TWA_BYTES](...args(msg), sig))
        .to.emit(token, "AuthorizationUsed").withArgs(alice.address, msg.nonce)
        .and.to.emit(token, "Transfer").withArgs(alice.address, bob.address, unit(1));
      expect(await token.balanceOf(bob.address)).to.equal(unit(1));
      expect(await token.authorizationState(alice.address, msg.nonce)).to.equal(true);
    });

    it("funktioniert auch mit v, r, s (USDC-kompatibel)", async function () {
      const { token, alice, relayer, msg } = await loadFixture(paymentFixture);
      const sig = ethers.Signature.from(await signAuthorization(alice, token, msg));
      await token.connect(relayer)[TWA_VRS](...args(msg), sig.v, sig.r, sig.s);
      expect(await token.balanceOf(msg.to)).to.equal(unit(1));
    });

    it("verhindert Wiederverwendung (Replay)", async function () {
      const { token, alice, relayer, msg } = await loadFixture(paymentFixture);
      const sig = await signAuthorization(alice, token, msg);
      await token.connect(relayer)[TWA_BYTES](...args(msg), sig);
      await expect(token.connect(relayer)[TWA_BYTES](...args(msg), sig))
        .to.be.revertedWithCustomError(token, "AuthorizationAlreadyUsed");
    });

    it("lehnt manipulierte Beträge und fremde Signaturen ab", async function () {
      const { token, alice, bob, relayer, msg } = await loadFixture(paymentFixture);
      const sig = await signAuthorization(alice, token, msg);
      await expect(token.connect(relayer)[TWA_BYTES](...args({ ...msg, value: unit(2) }), sig))
        .to.be.revertedWithCustomError(token, "InvalidSignature");
      const bobSig = await signAuthorization(bob, token, msg);
      await expect(token.connect(relayer)[TWA_BYTES](...args(msg), bobSig))
        .to.be.revertedWithCustomError(token, "InvalidSignature");
    });

    it("respektiert das Zeitfenster", async function () {
      const { token, alice, relayer, msg } = await loadFixture(paymentFixture);
      const now = await time.latest();
      const early = { ...msg, validAfter: now + 1000 };
      await expect(token.connect(relayer)[TWA_BYTES](...args(early), await signAuthorization(alice, token, early)))
        .to.be.revertedWithCustomError(token, "AuthorizationNotYetValid");
      const sig = await signAuthorization(alice, token, msg);
      await time.increaseTo(msg.validBefore);
      await expect(token.connect(relayer)[TWA_BYTES](...args(msg), sig))
        .to.be.revertedWithCustomError(token, "AuthorizationExpired");
    });

    it("scheitert bei zu wenig Guthaben", async function () {
      const { token, alice, relayer, msg } = await loadFixture(paymentFixture);
      const big = { ...msg, value: unit(101) };
      await expect(token.connect(relayer)[TWA_BYTES](...args(big), await signAuthorization(alice, token, big)))
        .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("receiveWithAuthorization darf nur der Empfänger einreichen", async function () {
      const { token, alice, bob, relayer, msg } = await loadFixture(paymentFixture);
      const sig = await signAuthorization(alice, token, msg, "ReceiveWithAuthorization");
      await expect(token.connect(relayer)[RWA](...args(msg), sig))
        .to.be.revertedWithCustomError(token, "CallerMustBePayee");
      await token.connect(bob)[RWA](...args(msg), sig);
      expect(await token.balanceOf(bob.address)).to.equal(unit(1));
    });

    it("eine Transfer-Signatur gilt nicht als Receive-Signatur", async function () {
      const { token, alice, bob, msg } = await loadFixture(paymentFixture);
      const sig = await signAuthorization(alice, token, msg);
      await expect(token.connect(bob)[RWA](...args(msg), sig))
        .to.be.revertedWithCustomError(token, "InvalidSignature");
    });

    it("cancelAuthorization macht eine Signatur ungültig", async function () {
      const { token, alice, relayer, msg } = await loadFixture(paymentFixture);
      const sig = await signAuthorization(alice, token, msg);
      const cancelSig = await alice.signTypedData(
        await domain(token),
        { CancelAuthorization: [{ name: "authorizer", type: "address" }, { name: "nonce", type: "bytes32" }] },
        { authorizer: alice.address, nonce: msg.nonce }
      );
      await expect(
        token.connect(relayer)["cancelAuthorization(address,bytes32,bytes)"](alice.address, msg.nonce, cancelSig)
      ).to.emit(token, "AuthorizationCanceled").withArgs(alice.address, msg.nonce);
      await expect(token.connect(relayer)[TWA_BYTES](...args(msg), sig))
        .to.be.revertedWithCustomError(token, "AuthorizationAlreadyUsed");
    });

    it("v,r,s-Varianten von receive und cancel; bereits genutzte Nonce nicht stornierbar", async function () {
      const { token, alice, bob, relayer, msg } = await loadFixture(paymentFixture);
      const RWA_VRS = "receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)";
      const r = ethers.Signature.from(await signAuthorization(alice, token, msg, "ReceiveWithAuthorization"));
      await token.connect(bob)[RWA_VRS](...args(msg), r.v, r.r, r.s);
      expect(await token.balanceOf(bob.address)).to.equal(unit(1));

      const cancelTypes = { CancelAuthorization: [{ name: "authorizer", type: "address" }, { name: "nonce", type: "bytes32" }] };
      const used = ethers.Signature.from(
        await alice.signTypedData(await domain(token), cancelTypes, { authorizer: alice.address, nonce: msg.nonce })
      );
      const CANCEL_VRS = "cancelAuthorization(address,bytes32,uint8,bytes32,bytes32)";
      await expect(token.connect(relayer)[CANCEL_VRS](alice.address, msg.nonce, used.v, used.r, used.s))
        .to.be.revertedWithCustomError(token, "AuthorizationAlreadyUsed");

      const fresh = ethers.hexlify(ethers.randomBytes(32));
      const bad = await bob.signTypedData(await domain(token), cancelTypes, { authorizer: alice.address, nonce: fresh });
      await expect(token.connect(relayer)["cancelAuthorization(address,bytes32,bytes)"](alice.address, fresh, bad))
        .to.be.revertedWithCustomError(token, "InvalidSignature");
      const ok = ethers.Signature.from(
        await alice.signTypedData(await domain(token), cancelTypes, { authorizer: alice.address, nonce: fresh })
      );
      await token.connect(relayer)[CANCEL_VRS](alice.address, fresh, ok.v, ok.r, ok.s);
      expect(await token.authorizationState(alice.address, fresh)).to.equal(true);
    });

    it("akzeptiert Smart-Contract-Wallets (ERC-1271)", async function () {
      const { token, alice, bob, relayer, liquidity } = await loadFixture(paymentFixture);
      const wallet = await ethers.deployContract("MockSmartWallet", [alice.address]);
      const walletAddr = await wallet.getAddress();
      await token.connect(liquidity).transfer(walletAddr, unit(10));
      const m = {
        from: walletAddr, to: bob.address, value: unit(3), validAfter: 0,
        validBefore: (await time.latest()) + 3600, nonce: ethers.hexlify(ethers.randomBytes(32)),
      };
      await token.connect(relayer)[TWA_BYTES](...args(m), await signAuthorization(alice, token, m));
      expect(await token.balanceOf(bob.address)).to.equal(unit(3));

      const m2 = { ...m, nonce: ethers.hexlify(ethers.randomBytes(32)) };
      await expect(token.connect(relayer)[TWA_BYTES](...args(m2), await signAuthorization(bob, token, m2)))
        .to.be.revertedWithCustomError(token, "InvalidSignature");
    });
  });

  describe("Stimmrecht (ERC20Votes)", function () {
    it("nutzt Zeitstempel als Uhr", async function () {
      const { token } = await loadFixture(deploySystem);
      expect(await token.CLOCK_MODE()).to.equal("mode=timestamp");
      expect(await token.clock()).to.equal(await time.latest());
    });

    it("Stimmen zählen erst nach Delegation und folgen Transfers", async function () {
      const { token, liquidity, alice } = await loadFixture(deploySystem);
      expect(await token.getVotes(liquidity.address)).to.equal(0);
      await token.connect(liquidity).delegate(liquidity.address);
      expect(await token.getVotes(liquidity.address)).to.equal(unit(100_000_000));
      await token.connect(liquidity).transfer(alice.address, unit(1_000));
      expect(await token.getVotes(liquidity.address)).to.equal(unit(99_999_000));
    });
  });
});
