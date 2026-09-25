const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const unit = (n) => ethers.parseUnits(String(n), 18);

describe("EigenToken", function () {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const token = await ethers.deployContract("EigenToken", [
      "Eigen Token", "EIGEN", unit(21_000_000), unit(1_000_000), owner.address,
    ]);
    return { token, owner, alice, bob };
  }

  describe("Deployment", function () {
    it("setzt Name, Symbol, Dezimalstellen und Cap", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("Eigen Token");
      expect(await token.symbol()).to.equal("EIGEN");
      expect(await token.decimals()).to.equal(18);
      expect(await token.cap()).to.equal(unit(21_000_000));
    });

    it("gibt die Startmenge dem Owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      expect(await token.totalSupply()).to.equal(unit(1_000_000));
      expect(await token.balanceOf(owner.address)).to.equal(unit(1_000_000));
      expect(await token.owner()).to.equal(owner.address);
    });

    it("lehnt eine Startmenge über dem Cap ab", async function () {
      const [owner] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("EigenToken");
      await expect(
        factory.deploy("X", "X", unit(100), unit(101), owner.address)
      ).to.be.revertedWithCustomError(factory, "ERC20ExceededCap");
    });
  });

  describe("Transfers", function () {
    it("überträgt Token und sendet ein Transfer-Event", async function () {
      const { token, owner, alice } = await loadFixture(deployFixture);
      await expect(token.transfer(alice.address, unit(50)))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, alice.address, unit(50));
      expect(await token.balanceOf(alice.address)).to.equal(unit(50));
    });

    it("scheitert bei zu wenig Guthaben", async function () {
      const { token, alice, bob } = await loadFixture(deployFixture);
      await expect(token.connect(alice).transfer(bob.address, 1))
        .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("unterstützt approve + transferFrom", async function () {
      const { token, owner, alice, bob } = await loadFixture(deployFixture);
      await token.approve(alice.address, unit(10));
      await token.connect(alice).transferFrom(owner.address, bob.address, unit(10));
      expect(await token.balanceOf(bob.address)).to.equal(unit(10));
      expect(await token.allowance(owner.address, alice.address)).to.equal(0);
    });
  });

  describe("Mint", function () {
    it("Owner kann prägen", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await token.mint(alice.address, unit(500));
      expect(await token.balanceOf(alice.address)).to.equal(unit(500));
      expect(await token.totalSupply()).to.equal(unit(1_000_500));
    });

    it("andere können nicht prägen", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await expect(token.connect(alice).mint(alice.address, 1))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
        .withArgs(alice.address);
    });

    it("bis genau zum Cap erlaubt, darüber nicht", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await token.mint(alice.address, unit(20_000_000));
      expect(await token.totalSupply()).to.equal(unit(21_000_000));
      await expect(token.mint(alice.address, 1))
        .to.be.revertedWithCustomError(token, "ERC20ExceededCap");
    });
  });

  describe("Burn", function () {
    it("verringert Guthaben und Gesamtmenge", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await token.burn(unit(100));
      expect(await token.balanceOf(owner.address)).to.equal(unit(999_900));
      expect(await token.totalSupply()).to.equal(unit(999_900));
    });

    it("burnFrom braucht eine Freigabe", async function () {
      const { token, owner, alice } = await loadFixture(deployFixture);
      await expect(token.connect(alice).burnFrom(owner.address, 1))
        .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
      await token.approve(alice.address, unit(5));
      await token.connect(alice).burnFrom(owner.address, unit(5));
      expect(await token.totalSupply()).to.equal(unit(999_995));
    });
  });

  describe("Permit (EIP-2612)", function () {
    it("setzt eine Freigabe per Signatur", async function () {
      const { token, owner, alice } = await loadFixture(deployFixture);
      const value = unit(42);
      const deadline = ethers.MaxUint256;
      const nonce = await token.nonces(owner.address);
      const { chainId } = await ethers.provider.getNetwork();

      const signature = await owner.signTypedData(
        { name: "Eigen Token", version: "1", chainId, verifyingContract: await token.getAddress() },
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        { owner: owner.address, spender: alice.address, value, nonce, deadline }
      );
      const { v, r, s } = ethers.Signature.from(signature);

      // Alice reicht die Signatur ein – der Owner zahlt kein Gas
      await token.connect(alice).permit(owner.address, alice.address, value, deadline, v, r, s);
      expect(await token.allowance(owner.address, alice.address)).to.equal(value);
      expect(await token.nonces(owner.address)).to.equal(nonce + 1n);
    });
  });

  describe("Ownership", function () {
    it("kann übertragen und aufgegeben werden", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await token.transferOwnership(alice.address);
      expect(await token.owner()).to.equal(alice.address);
      await token.connect(alice).renounceOwnership();
      expect(await token.owner()).to.equal(ethers.ZeroAddress);
      await expect(token.connect(alice).mint(alice.address, 1))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });
});
