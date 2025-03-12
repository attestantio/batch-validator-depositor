import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { hre } from "hardhat";

describe("BatchValidatorDepositor", function () {
  async function deployDepositContractsFixture() {
    const [depositDeployer, batchDeployer] = await ethers.getSigners();

    const abi = require('./depositcontract/abi.json');
    const bytecode = require('./depositcontract/bytecode.json');

    const Deposit = await ethers.getContractFactory(abi, bytecode);
    const DepositWithDeployer = Deposit.connect(depositDeployer);
    const deposit = await DepositWithDeployer.deploy();

    const Batch = await ethers.getContractFactory("BatchValidatorDepositor");
    const BatchWithDeployer = Batch.connect(batchDeployer);
    const batch = await BatchWithDeployer.deploy(false, deposit.target);

    return { deposit, batch, depositDeployer ,batchDeployer};
  }

  describe("Deployment", function () {
    it("Should deploy", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);
      await expect (await deposit.get_deposit_count()).to.equal('0x0000000000000000');
    });
  });

  describe("Validation", function () {
    it("Should not allow no public keys", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = [];
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: you can deposit only 1 to 100 nodes per transaction"
      );
    });

    it("Should not allow too many public keys", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = new Array(101).fill('0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: you can deposit only 1 to 100 nodes per transaction"
      );
    });

    it("Should not allow incorrect number of withdrawal credentials", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = [];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: amount of parameters do not match"
      );
    });

    it("Should not allow incorrect number of signatures", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = [];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: amount of parameters do not match"
      );
    });

    it("Should not allow incorrect number of deposit data roots", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = [];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: amount of parameters do not match"
      );
    });

    it("Should not allow incorrect number of collateral", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = [];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: amount of parameters do not match"
      );
    });

    it("Should not allow incorrect value", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '64000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: provided ETH does not match required ETH"
      );
    });

    it("Should not allow incorrect pubkey length", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: incorrect pubkey length"
      );
    });

    it("Should not allow incorrect withdrawal credentials length", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = ['0x00000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: incorrect withdrawal credentials length"
      );
    });

    it("Should not allow incorrect signature length", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const withdrawal_credentials = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const signatures = ['0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'];
      const deposit_data_roots = ['0x0000000000000000000000000000000000000000000000000000000000000000'];
      const collateral = ['32000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.be.revertedWith(
        "BatchValidatorDepositor: incorrect signature length"
      );
    });
  });

  describe("Events", function () {
    it("Should emit an event on deposit", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x8e2d31d00f491bb3b11bc83a3f610f942758dffd1ff1ddaa8307add299733b170f71fb26000c4f2d5efdab67254413fa'];
      const withdrawal_credentials = ['0x010000000000000000000000ac83393be3e6490c5959847cabb0ff81c656427b'];
      const signatures = ['0xb9561533e0f8d2cd3741c701f7d337d947b3e3c1dc14ca673fac7952c0707abe4cf2eb93330cb3f78063e618548ea40a084c66f58c3e8183286d65b63a9f9f3e411f09d2a2e66d2d4f3fd2a2b297a088ec706525265ac4954785a50ef3c80ce2'];
      const deposit_data_roots = ['0x0678d05c612d015d0b527841e295f91759185dddf7b08640d74e3d933695bac8'];
      const collateral = ['32000000000000000000'];

      const littleEndianCollateral = toLittleEndian(collateral[0]/1000000000)
      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '32000000000000000000' },
      )).to.emit(deposit, "DepositEvent")
        .withArgs(pubkeys[0], withdrawal_credentials[0], littleEndianCollateral, signatures[0], '0x0000000000000000');
    });

    it("Should emit multiple events on deposits", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = ['0x8e2d31d00f491bb3b11bc83a3f610f942758dffd1ff1ddaa8307add299733b170f71fb26000c4f2d5efdab67254413fa','0x8ab3332e945acce729f33d2bb256fa3c0828258ba04ba66c7bbb1ec8ca2757961d783b4caff54ff599ac125b20b635c8'];
      const withdrawal_credentials = ['0x010000000000000000000000ac83393be3e6490c5959847cabb0ff81c656427b','0x020000000000000000000000ac83393be3e6490c5959847cabb0ff81c656427b'];
      const signatures = ['0xb9561533e0f8d2cd3741c701f7d337d947b3e3c1dc14ca673fac7952c0707abe4cf2eb93330cb3f78063e618548ea40a084c66f58c3e8183286d65b63a9f9f3e411f09d2a2e66d2d4f3fd2a2b297a088ec706525265ac4954785a50ef3c80ce2','0x973b90934c1d212583edc9341de2ee984aa2f8e8e19449b842a27816a053513aec7c75358c47bea9510d484a3a9197000818e25d9166325174eb4321b47f6a4f3d65d1c6d36af1c87a3bbf7b70b404c6d69ec9fd470e99cd0d65fcde376c8c76'];
      const deposit_data_roots = ['0x0678d05c612d015d0b527841e295f91759185dddf7b08640d74e3d933695bac8','0xb170f00db9f85ce62afb3eb5e0c7a518d369aba8bc0fbcd39c4d0f27fd055f03'];
      const collateral = ['32000000000000000000','2048000000000000000000'];

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '2080000000000000000000' },
      )).to.emit(deposit, "DepositEvent")
        .withArgs(pubkeys[0], withdrawal_credentials[0], toLittleEndian(collateral[0]/1000000000), signatures[0], '0x0000000000000000')
        .and.to.emit(deposit, "DepositEvent")
        .withArgs(pubkeys[1], withdrawal_credentials[1], toLittleEndian(collateral[1]/1000000000), signatures[1], '0x0100000000000000');
    });

    it("Should handle 100 deposits", async function () {
      const { deposit, batch, depositOwner, batchOwner } = await loadFixture(deployDepositContractsFixture);

      const pubkeys = new Array(100).fill('0x8e2d31d00f491bb3b11bc83a3f610f942758dffd1ff1ddaa8307add299733b170f71fb26000c4f2d5efdab67254413fa');
      const withdrawal_credentials = new Array(100).fill('0x010000000000000000000000ac83393be3e6490c5959847cabb0ff81c656427b');
      const signatures = new Array(100).fill('0xb9561533e0f8d2cd3741c701f7d337d947b3e3c1dc14ca673fac7952c0707abe4cf2eb93330cb3f78063e618548ea40a084c66f58c3e8183286d65b63a9f9f3e411f09d2a2e66d2d4f3fd2a2b297a088ec706525265ac4954785a50ef3c80ce2');
      const deposit_data_roots = new Array(100).fill('0x0678d05c612d015d0b527841e295f91759185dddf7b08640d74e3d933695bac8');
      const collateral = new Array(100).fill('32000000000000000000');

      await expect(batch.deposit(
              pubkeys,
              withdrawal_credentials,
              signatures,
              deposit_data_roots,
              collateral,
              { value: '3200000000000000000000' },
      )).to.emit(deposit, "DepositEvent")
        .withArgs(pubkeys[0], withdrawal_credentials[0], toLittleEndian(collateral[0]/1000000000), signatures[0], '0x0000000000000000')
        .and.to.emit(deposit, "DepositEvent")
        .withArgs(pubkeys[99], withdrawal_credentials[99], toLittleEndian(collateral[99]/1000000000), signatures[99], '0x6300000000000000');
    });
  });

  function toLittleEndian(input) {
    const value = BigInt(input);
    let hex = value.toString(16);
    if (hex.length % 2) hex = '0' + hex;
    let bigEndianBytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bigEndianBytes.length; i++) {
      bigEndianBytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    const littleEndianBytes = bigEndianBytes.reverse();
    const littleEndianHex = Array.from(littleEndianBytes, byte =>
      ('0' + (byte & 0xFF).toString(16)).slice(-2)
    ).join('');

    return '0x' + littleEndianHex.padEnd(16,'0');
  }
});
