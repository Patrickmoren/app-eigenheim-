// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Capped} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title EigenToken
/// @notice ERC-20-Token mit fester Obergrenze (Cap), Burn-Funktion und
///         gasloser Freigabe per Signatur (EIP-2612 "permit").
/// @dev Nur der Owner darf neue Token prägen, und nie über den Cap hinaus.
contract EigenToken is ERC20, ERC20Burnable, ERC20Capped, ERC20Permit, Ownable {
    /// @param name_          Voller Name, z. B. "Eigen Token"
    /// @param symbol_        Kürzel, z. B. "EIGEN"
    /// @param cap_           Maximale Gesamtmenge (in kleinster Einheit, 18 Dezimalstellen)
    /// @param initialSupply  Menge, die beim Deployment an initialOwner geht
    /// @param initialOwner   Adresse, die Token erhält und prägen darf
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap_,
        uint256 initialSupply,
        address initialOwner
    )
        ERC20(name_, symbol_)
        ERC20Capped(cap_)
        ERC20Permit(name_)
        Ownable(initialOwner)
    {
        if (initialSupply > 0) {
            _mint(initialOwner, initialSupply);
        }
    }

    /// @notice Prägt neue Token. Schlägt fehl, wenn der Cap überschritten würde.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // ERC20 und ERC20Capped überschreiben beide _update; der Cap-Check muss greifen.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
