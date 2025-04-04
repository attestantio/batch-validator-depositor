/*
 * Electra-compatible batch validator deposit contract.
 * 
 * Based on the Abyss ETH2 depositor.
 */

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../contracts/interfaces/IDepositContract.sol";

contract BatchValidatorDepositor is Pausable, Ownable {

    /**
     * @dev Eth2 Deposit Contract address.
     */
    IDepositContract public depositContract;

    /**
     * @dev Minimal and maximum amount of nodes per transaction.
     */
    uint256 public constant nodesMinAmount = 1;
    uint256 public constant nodesMaxAmount = 100;
    uint256 public constant pubkeyLength = 48;
    uint256 public constant credentialsLength = 32;
    uint256 public constant signatureLength = 96;

    /**
     * @dev Setting Eth2 Smart Contract address during construction.
     */
    constructor(bool mainnet, address depositContract_) Ownable(msg.sender) {
        if (mainnet == true) {
            depositContract = IDepositContract(0x00000000219ab540356cBB839Cbe05303d7705Fa);
        } else if (depositContract_ == 0x0000000000000000000000000000000000000000) {
            depositContract = IDepositContract(0x8c5fecdC472E27Bc447696F431E425D02dd46a8c);
        } else {
            depositContract = IDepositContract(depositContract_);
        }
    }

    /**
     * @dev This contract will not accept direct ETH transactions.
     */
    receive() external payable {
        revert("BatchValidatorDepositor: do not send ETH directly here");
    }

    /**
     * @dev Function that allows to deposit up to 100 nodes at once.
     *
     * - pubkeys                - Array of BLS12-381 public keys.
     * - withdrawal_credentials - Array of commitments to a public keys for withdrawals.
     * - signatures             - Array of BLS12-381 signatures.
     * - deposit_data_roots     - Array of the SHA-256 hashes of the SSZ-encoded DepositData objects.
     * - collateral             - Array of the Wei amounts to be deposited with each request.
     */
    function deposit(
        bytes[] calldata pubkeys,
        bytes[] calldata withdrawal_credentials,
        bytes[] calldata signatures,
        bytes32[] calldata deposit_data_roots,
        uint256[] calldata collateral
    ) external payable whenNotPaused {

        uint256 nodesAmount = pubkeys.length;

        require(nodesAmount >= nodesMinAmount && nodesAmount <= nodesMaxAmount, "BatchValidatorDepositor: you can deposit only 1 to 100 nodes per transaction");

        require(
            withdrawal_credentials.length == nodesAmount &&
            signatures.length == nodesAmount &&
            deposit_data_roots.length == nodesAmount &&
            collateral.length == nodesAmount,
            "BatchValidatorDepositor: amount of parameters do not match");

        uint256 totalCollateral = 0;
        for (uint256 i = 0; i < collateral.length; ++i) {
                totalCollateral += collateral[i];
        }
        require(msg.value == totalCollateral, "BatchValidatorDepositor: provided ETH does not match required ETH");

        for (uint256 i = 0; i < nodesAmount; ++i) {
            require(pubkeys[i].length == pubkeyLength, "BatchValidatorDepositor: incorrect pubkey length");
            require(withdrawal_credentials[i].length == credentialsLength, "BatchValidatorDepositor: incorrect withdrawal credentials length");
            require(signatures[i].length == signatureLength, "BatchValidatorDepositor: incorrect signature length");

            IDepositContract(address(depositContract)).deposit{value: collateral[i]}(
                pubkeys[i],
                withdrawal_credentials[i],
                signatures[i],
                deposit_data_roots[i]
            );
        }

        emit DepositEvent(msg.sender, nodesAmount, msg.value);
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function pause() public onlyOwner {
      _pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpause() public onlyOwner {
      _unpause();
    }

    event DepositEvent(address from, uint256 nodesAmount, uint256 totalCollateral);
}

