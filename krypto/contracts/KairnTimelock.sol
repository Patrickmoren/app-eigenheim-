// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/// @title Kairn Treasury (Timelock)
/// @notice Hält das DAO-Treasury. Nur der Governor darf Vorschläge einreihen;
///         ausgeführt werden sie frühestens nach `minDelay` (Standard 2 Tage).
contract KairnTimelock is TimelockController {
    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors, address admin)
        TimelockController(minDelay, proposers, executors, admin)
    {}
}
