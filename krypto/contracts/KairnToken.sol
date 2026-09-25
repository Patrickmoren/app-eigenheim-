// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

/// @title Kairn (KAIRN)
/// @notice Zahlungs- und Governance-Token für KI-Agenten.
///
///  - Feste Menge: 1'000'000'000 KAIRN werden einmalig beim Deployment geprägt.
///    Es gibt keinen Owner, keine Mint-Funktion, keine Pause, kein Upgrade.
///  - EIP-2612 `permit`: Freigaben per Signatur.
///  - EIP-3009 `transferWithAuthorization`: Zahlungen per Signatur, ein Dritter
///    (z. B. ein x402-Facilitator) reicht sie ein und zahlt das Gas. Damit können
///    KI-Agenten pro API-Aufruf bezahlen, ohne selbst ETH zu halten.
///    Signaturen von Smart-Contract-Wallets (ERC-1271) werden akzeptiert.
///  - ERC20Votes: Stimmrecht für die Kairn-DAO, Zeitstempel als Uhr (L2-tauglich).
///  - Burnable: Jeder kann eigene Token vernichten.
contract KairnToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 ether;

    // keccak256("TransferWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)")
    bytes32 public constant TRANSFER_WITH_AUTHORIZATION_TYPEHASH =
        0x7c7c6cdb67a18743f49ec6fa9b35f50d52ed05cbed4cc592e13b44501c1a2267;
    // keccak256("ReceiveWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)")
    bytes32 public constant RECEIVE_WITH_AUTHORIZATION_TYPEHASH =
        0xd099cc98ef71107a616c4f0f941f04c322d8e254fe26b3c6668db87aae413de8;
    // keccak256("CancelAuthorization(address authorizer,bytes32 nonce)")
    bytes32 public constant CANCEL_AUTHORIZATION_TYPEHASH =
        0x158b0a9edf7a828aad02f63cd515c68ef2f50ba807396f6d12842833a1597429;

    /// @dev authorizer => nonce => bereits verwendet oder storniert
    mapping(address => mapping(bytes32 => bool)) private _authorizationStates;

    event AuthorizationUsed(address indexed authorizer, bytes32 indexed nonce);
    event AuthorizationCanceled(address indexed authorizer, bytes32 indexed nonce);

    error AuthorizationNotYetValid();
    error AuthorizationExpired();
    error AuthorizationAlreadyUsed();
    error InvalidSignature();
    error CallerMustBePayee();

    /// @param recipient Erhält die gesamte Menge und verteilt sie im Deploy-Skript
    ///                  auf DAO, Vesting, Airdrop und Liquidität.
    constructor(address recipient) ERC20("Kairn", "KAIRN") ERC20Permit("Kairn") {
        _mint(recipient, TOTAL_SUPPLY);
    }

    // ---------------------------------------------------------------------
    // EIP-3009
    // ---------------------------------------------------------------------

    function authorizationState(address authorizer, bytes32 nonce) external view returns (bool) {
        return _authorizationStates[authorizer][nonce];
    }

    /// @notice Führt eine vom Absender signierte Überweisung aus. Jeder darf sie einreichen.
    function transferWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) public {
        _transferWithAuthorization(
            TRANSFER_WITH_AUTHORIZATION_TYPEHASH, from, to, value, validAfter, validBefore, nonce, signature
        );
    }

    /// @notice Variante mit v, r, s (Kompatibilität mit USDC und bestehenden Tools).
    function transferWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        transferWithAuthorization(from, to, value, validAfter, validBefore, nonce, abi.encodePacked(r, s, v));
    }

    /// @notice Wie transferWithAuthorization, darf aber nur vom Empfänger eingereicht
    ///         werden. Schützt vor Front-Running, wenn ein Contract Zahlungen annimmt.
    function receiveWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) public {
        if (to != msg.sender) revert CallerMustBePayee();
        _transferWithAuthorization(
            RECEIVE_WITH_AUTHORIZATION_TYPEHASH, from, to, value, validAfter, validBefore, nonce, signature
        );
    }

    function receiveWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        receiveWithAuthorization(from, to, value, validAfter, validBefore, nonce, abi.encodePacked(r, s, v));
    }

    /// @notice Storniert eine noch nicht verwendete Autorisierung.
    function cancelAuthorization(address authorizer, bytes32 nonce, bytes memory signature) public {
        if (_authorizationStates[authorizer][nonce]) revert AuthorizationAlreadyUsed();
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(CANCEL_AUTHORIZATION_TYPEHASH, authorizer, nonce)));
        if (!SignatureChecker.isValidSignatureNow(authorizer, digest, signature)) revert InvalidSignature();
        _authorizationStates[authorizer][nonce] = true;
        emit AuthorizationCanceled(authorizer, nonce);
    }

    function cancelAuthorization(address authorizer, bytes32 nonce, uint8 v, bytes32 r, bytes32 s) external {
        cancelAuthorization(authorizer, nonce, abi.encodePacked(r, s, v));
    }

    function _transferWithAuthorization(
        bytes32 typeHash,
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) private {
        if (block.timestamp <= validAfter) revert AuthorizationNotYetValid();
        if (block.timestamp >= validBefore) revert AuthorizationExpired();
        if (_authorizationStates[from][nonce]) revert AuthorizationAlreadyUsed();

        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(typeHash, from, to, value, validAfter, validBefore, nonce))
        );
        if (!SignatureChecker.isValidSignatureNow(from, digest, signature)) revert InvalidSignature();

        _authorizationStates[from][nonce] = true;
        emit AuthorizationUsed(from, nonce);
        _transfer(from, to, value);
    }

    // ---------------------------------------------------------------------
    // Governance-Uhr: Zeitstempel statt Blocknummer (auf L2s zuverlässiger)
    // ---------------------------------------------------------------------

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    // ---------------------------------------------------------------------
    // Pflicht-Overrides wegen Mehrfachvererbung
    // ---------------------------------------------------------------------

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
