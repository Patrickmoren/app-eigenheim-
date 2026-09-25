// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/// @title Kairn Community-Airdrop
/// @notice Berechtigte Adressen holen ihre Token mit einem Merkle-Beweis ab.
///         Die Liste wird off-chain erstellt (scripts/airdrop-tree.js), on-chain
///         steht nur die Merkle-Root. Nach `claimDeadline` kann jeder die nicht
///         abgeholten Token an das DAO-Treasury zurückschicken.
///
///  Blätter im Format von StandardMerkleTree (npm: openzeppelin merkle-tree):
///  keccak256(bytes.concat(keccak256(abi.encode(account, amount))))
contract KairnAirdrop {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    bytes32 public immutable merkleRoot;
    uint256 public immutable claimDeadline;
    address public immutable treasury;

    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed account, address indexed to, uint256 amount);
    event Swept(uint256 amount);

    error AlreadyClaimed();
    error InvalidProof();
    error ClaimPeriodOver();
    error ClaimPeriodActive();
    error ZeroAddress();

    constructor(IERC20 token_, bytes32 merkleRoot_, uint256 claimDeadline_, address treasury_) {
        if (address(token_) == address(0) || treasury_ == address(0)) revert ZeroAddress();
        token = token_;
        merkleRoot = merkleRoot_;
        claimDeadline = claimDeadline_;
        treasury = treasury_;
    }

    /// @notice Holt den Anteil von `msg.sender` ab und sendet ihn an `to`.
    function claim(address to, uint256 amount, bytes32[] calldata proof) external {
        if (block.timestamp > claimDeadline) revert ClaimPeriodOver();
        if (to == address(0)) revert ZeroAddress();
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));
        if (!MerkleProof.verifyCalldata(proof, merkleRoot, leaf)) revert InvalidProof();

        hasClaimed[msg.sender] = true;
        emit Claimed(msg.sender, to, amount);
        token.safeTransfer(to, amount);
    }

    /// @notice Schickt nach Fristende alle Restbestände an das Treasury.
    function sweep() external {
        if (block.timestamp <= claimDeadline) revert ClaimPeriodActive();
        uint256 amount = token.balanceOf(address(this));
        emit Swept(amount);
        token.safeTransfer(treasury, amount);
    }
}
