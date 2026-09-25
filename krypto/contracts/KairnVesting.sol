// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VestingWallet} from "@openzeppelin/contracts/finance/VestingWallet.sol";
import {VestingWalletCliff} from "@openzeppelin/contracts/finance/VestingWalletCliff.sol";

/// @title Kairn Vesting
/// @notice Gibt Token linear frei: vor dem Cliff nichts, danach anteilig zur
///         verstrichenen Zeit seit `start`, nach `start + duration` alles.
///         Der Begünstigte ruft `release(token)` auf, um freigegebene Token abzuholen.
contract KairnVesting is VestingWalletCliff {
    constructor(address beneficiary, uint64 start, uint64 duration, uint64 cliff)
        VestingWallet(beneficiary, start, duration)
        VestingWalletCliff(cliff)
    {}
}
