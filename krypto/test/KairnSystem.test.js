const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { unit, DAY, MONTH, deploySystem } = require("./helpers");

describe("Kairn-System", function () {
  describe("Launch-Verteilung", function () {
    it("verteilt exakt die Tokenomics", async function () {
      const { token, timelock, teamVesting, partnerVesting, airdrop, liquidity, foundation, deployer } =
        await loadFixture(deploySystem);
      const bal = (x) => token.balanceOf(x);
      expect(await bal(await timelock.getAddress())).to.equal(unit(400_000_000 + 200_000_000 - 35_000));
      expect(await bal(await airdrop.getAddress())).to.equal(unit(35_000));
      expect(await bal(await teamVesting.getAddress())).to.equal(unit(150_000_000));
      expect(await bal(await partnerVesting.getAddress())).to.equal(unit(100_000_000));
      expect(await bal(liquidity.address)).to.equal(unit(100_000_000));
      expect(await bal(foundation.address)).to.equal(unit(50_000_000));
      expect(await bal(deployer.address)).to.equal(0);
    });

    it("Deployer hat keine Macht über das Treasury", async function () {
      const { timelock, governor, deployer } = await loadFixture(deploySystem);
      const ADMIN = await timelock.DEFAULT_ADMIN_ROLE();
      expect(await timelock.hasRole(ADMIN, deployer.address)).to.equal(false);
      expect(await timelock.hasRole(await timelock.PROPOSER_ROLE(), deployer.address)).to.equal(false);
      expect(await timelock.hasRole(await timelock.PROPOSER_ROLE(), await governor.getAddress())).to.equal(true);
      expect(await timelock.hasRole(await timelock.CANCELLER_ROLE(), await governor.getAddress())).to.equal(true);
      // Ausführen darf jeder (nach Ablauf der Wartefrist)
      expect(await timelock.hasRole(await timelock.EXECUTOR_ROLE(), ethers.ZeroAddress)).to.equal(true);
      // Timelock verwaltet sich selbst
      expect(await timelock.hasRole(ADMIN, await timelock.getAddress())).to.equal(true);
    });

    it("bricht ab, wenn die Airdrop-Liste die Zuteilung übersteigt", async function () {
      const tokenomics = require("../config/tokenomics");
      const { deployKairn } = require("../scripts/lib/deploy-kairn");
      const [d] = await ethers.getSigners();
      const addr = { team: d.address, partners: d.address, liquidity: d.address, foundation: d.address };
      await expect(
        deployKairn({ tokenomics, addresses: addr, airdrop: { merkleRoot: ethers.ZeroHash, total: unit(200_000_001) } })
      ).to.be.rejectedWith("Airdrop-Liste");
    });
  });

  describe("Airdrop", function () {
    it("Berechtigte holen ihren Anteil ab – genau einmal", async function () {
      const { token, airdrop, alice, carol, proofOf } = await loadFixture(deploySystem);
      const { amount, proof } = proofOf(alice.address);
      await expect(airdrop.connect(alice).claim(carol.address, amount, proof))
        .to.emit(airdrop, "Claimed").withArgs(alice.address, carol.address, amount);
      expect(await token.balanceOf(carol.address)).to.equal(unit(25_000));
      await expect(airdrop.connect(alice).claim(alice.address, amount, proof))
        .to.be.revertedWithCustomError(airdrop, "AlreadyClaimed");
    });

    it("lehnt falsche Beträge und Unberechtigte ab", async function () {
      const { airdrop, alice, carol, proofOf } = await loadFixture(deploySystem);
      const { amount, proof } = proofOf(alice.address);
      await expect(airdrop.connect(alice).claim(alice.address, amount + 1n, proof))
        .to.be.revertedWithCustomError(airdrop, "InvalidProof");
      await expect(airdrop.connect(carol).claim(carol.address, amount, proof))
        .to.be.revertedWithCustomError(airdrop, "InvalidProof");
    });

    it("lehnt Null-Adressen ab", async function () {
      const { token, airdrop, alice, proofOf } = await loadFixture(deploySystem);
      const { amount, proof } = proofOf(alice.address);
      await expect(airdrop.connect(alice).claim(ethers.ZeroAddress, amount, proof))
        .to.be.revertedWithCustomError(airdrop, "ZeroAddress");
      const F = await ethers.getContractFactory("KairnAirdrop");
      await expect(F.deploy(await token.getAddress(), ethers.ZeroHash, 0, ethers.ZeroAddress))
        .to.be.revertedWithCustomError(F, "ZeroAddress");
    });

    it("nach der Frist: kein Claim mehr, Rest geht ans Treasury", async function () {
      const { token, airdrop, timelock, alice, bob, proofOf } = await loadFixture(deploySystem);
      await expect(airdrop.sweep()).to.be.revertedWithCustomError(airdrop, "ClaimPeriodActive");
      const { amount, proof } = proofOf(bob.address);
      await airdrop.connect(bob).claim(bob.address, amount, proof);

      await time.increaseTo((await airdrop.claimDeadline()) + 1n);
      const a = proofOf(alice.address);
      await expect(airdrop.connect(alice).claim(alice.address, a.amount, a.proof))
        .to.be.revertedWithCustomError(airdrop, "ClaimPeriodOver");

      const before = await token.balanceOf(await timelock.getAddress());
      await airdrop.sweep();
      expect(await token.balanceOf(await timelock.getAddress())).to.equal(before + unit(25_000));
      expect(await token.balanceOf(await airdrop.getAddress())).to.equal(0);
    });
  });

  describe("Vesting", function () {
    it("Team: nichts vor 12 Monaten, danach linear, nach 48 Monaten alles", async function () {
      const { token, teamVesting: vesting, team: teamSigner, start } = await loadFixture(deploySystem);
      const tokenAddr = await token.getAddress();
      const releasable = () => vesting["releasable(address)"](tokenAddr);

      await time.increaseTo(start + BigInt(12 * MONTH) - 10n);
      expect(await releasable()).to.equal(0);

      await time.increaseTo(start + BigInt(24 * MONTH));
      // Hälfte von 150 Mio.; Toleranz für wenige Sekunden Blockzeit (≈1'206 KAIRN/s)
      expect(await releasable()).to.be.closeTo(unit(75_000_000), unit(5_000));

      await vesting["release(address)"](tokenAddr);
      expect(await token.balanceOf(teamSigner.address)).to.be.closeTo(unit(75_000_000), unit(5_000));

      await time.increaseTo(start + BigInt(48 * MONTH));
      await vesting["release(address)"](tokenAddr);
      expect(await token.balanceOf(teamSigner.address)).to.equal(unit(150_000_000));
    });

    it("Partner: nichts vor 6 Monaten, nach 24 Monaten alles", async function () {
      const { token, partnerVesting: vesting, start } = await loadFixture(deploySystem);
      const tokenAddr = await token.getAddress();
      await time.increaseTo(start + BigInt(6 * MONTH) - 10n);
      expect(await vesting["releasable(address)"](tokenAddr)).to.equal(0);
      await time.increaseTo(start + BigInt(24 * MONTH));
      expect(await vesting["releasable(address)"](tokenAddr)).to.equal(unit(100_000_000));
    });
  });

  describe("DAO-Governance", function () {
    it("Vorschlag → Abstimmung → Timelock → Auszahlung aus dem Treasury", async function () {
      const { token, governor, timelock, liquidity, foundation, carol } = await loadFixture(deploySystem);
      // Stimmen: 100 Mio. (Liquidität) + 50 Mio. (Stiftung) = 15 % > 4 % Quorum
      await token.connect(liquidity).delegate(liquidity.address);
      await token.connect(foundation).delegate(foundation.address);
      await time.increase(1);

      const grant = unit(250_000);
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("transfer", [carol.address, grant])];
      const description = "Grant #1: x402-Integration für Agenten-Framework";
      const descHash = ethers.id(description);

      await governor.connect(liquidity).propose(targets, values, calldatas, description);
      const id = await governor.hashProposal(targets, values, calldatas, descHash);
      expect(await governor.state(id)).to.equal(0); // Pending

      await time.increase(DAY + 1);
      expect(await governor.state(id)).to.equal(1); // Active
      await governor.connect(liquidity).castVote(id, 1);
      await governor.connect(foundation).castVote(id, 1);

      await time.increase(7 * DAY);
      expect(await governor.state(id)).to.equal(4); // Succeeded

      await governor.queue(targets, values, calldatas, descHash);
      await expect(governor.execute(targets, values, calldatas, descHash))
        .to.be.revertedWithCustomError(timelock, "TimelockUnexpectedOperationState");

      await time.increase(2 * DAY);
      const before = await token.balanceOf(await timelock.getAddress());
      await governor.execute(targets, values, calldatas, descHash);
      expect(await token.balanceOf(carol.address)).to.equal(grant);
      expect(await token.balanceOf(await timelock.getAddress())).to.equal(before - grant);
    });

    it("Antragsteller kann seinen Vorschlag vor der Abstimmung zurückziehen", async function () {
      const { token, governor, liquidity } = await loadFixture(deploySystem);
      await token.connect(liquidity).delegate(liquidity.address);
      await time.increase(1);
      const call = [[liquidity.address], [0], ["0x"]];
      await governor.connect(liquidity).propose(...call, "zurückziehen");
      const id = await governor.hashProposal(...call, ethers.id("zurückziehen"));
      expect(await governor.proposalNeedsQueuing(id)).to.equal(true);
      await governor.connect(liquidity).cancel(...call, ethers.id("zurückziehen"));
      expect(await governor.state(id)).to.equal(2); // Canceled
    });

    it("unter der Vorschlagsschwelle kann niemand vorschlagen", async function () {
      const { token, governor, liquidity, alice } = await loadFixture(deploySystem);
      await token.connect(liquidity).transfer(alice.address, unit(999_999));
      await token.connect(alice).delegate(alice.address);
      await time.increase(1);
      await expect(governor.connect(alice).propose([alice.address], [0], ["0x"], "x"))
        .to.be.revertedWithCustomError(governor, "GovernorInsufficientProposerVotes");
    });

    it("scheitert ohne Quorum", async function () {
      const { token, governor, liquidity, alice } = await loadFixture(deploySystem);
      await token.connect(liquidity).transfer(alice.address, unit(2_000_000));
      await token.connect(alice).delegate(alice.address);
      await time.increase(1);
      await governor.connect(alice).propose([alice.address], [0], ["0x"], "klein");
      const id = await governor.hashProposal([alice.address], [0], ["0x"], ethers.id("klein"));
      await time.increase(DAY + 1);
      await governor.connect(alice).castVote(id, 1);
      await time.increase(7 * DAY);
      expect(await governor.state(id)).to.equal(3); // Defeated
    });

    it("Parameter: 1 Tag Wartezeit, 7 Tage Abstimmung, 1 Mio. Schwelle, 4 % Quorum", async function () {
      const { governor, timelock } = await loadFixture(deploySystem);
      expect(await governor.votingDelay()).to.equal(DAY);
      expect(await governor.votingPeriod()).to.equal(7 * DAY);
      expect(await governor.proposalThreshold()).to.equal(unit(1_000_000));
      expect(await governor["quorumNumerator()"]()).to.equal(4);
      expect(await governor.lateQuorumVoteExtension()).to.equal(2 * DAY);
      expect(await timelock.getMinDelay()).to.equal(2 * DAY);
    });
  });
});
