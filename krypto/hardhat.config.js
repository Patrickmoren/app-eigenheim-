require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { subtask } = require("hardhat/config");
const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");

// Compiler aus dem npm-Paket "solc" statt Download von binaries.soliditylang.org.
// So funktioniert das Kompilieren auch in Umgebungen ohne Zugriff auf diesen Host.
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async ({ solcVersion }, hre, runSuper) => {
  const solc = require("solc/package.json");
  if (solcVersion !== solc.version) return runSuper();
  return {
    compilerPath: require.resolve("solc/soljson.js"),
    isSolcJs: true,
    version: solcVersion,
    longVersion: require("solc").version(),
  };
});

const { PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, BASE_RPC_URL, ETHERSCAN_API_KEY } = process.env;
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks: {
    "base-sepolia": {
      url: BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
      accounts,
    },
    base: {
      url: BASE_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
      accounts,
    },
  },
  // Etherscan-API v2: ein Schlüssel für alle Chains inkl. Base
  etherscan: { apiKey: ETHERSCAN_API_KEY || "" },
  sourcify: { enabled: false },
  gasReporter: { enabled: process.env.REPORT_GAS === "true", currency: "CHF" },
};
