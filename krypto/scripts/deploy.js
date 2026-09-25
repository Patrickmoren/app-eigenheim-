const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  const name = process.env.TOKEN_NAME || "Eigen Token";
  const symbol = process.env.TOKEN_SYMBOL || "EIGEN";
  const cap = ethers.parseUnits(process.env.TOKEN_CAP || "21000000", 18);
  const initial = ethers.parseUnits(process.env.TOKEN_INITIAL_SUPPLY || "1000000", 18);

  console.log(`Netzwerk:  ${hre.network.name}`);
  console.log(`Deployer:  ${deployer.address}`);
  console.log(`Token:     ${name} (${symbol})`);
  console.log(`Cap:       ${ethers.formatUnits(cap, 18)}`);
  console.log(`Startmenge: ${ethers.formatUnits(initial, 18)}`);

  const token = await ethers.deployContract("EigenToken", [
    name, symbol, cap, initial, deployer.address,
  ]);
  await token.waitForDeployment();
  const address = await token.getAddress();
  console.log(`\nDeployt unter: ${address}`);

  if (hre.network.name === "sepolia" && process.env.ETHERSCAN_API_KEY) {
    console.log("Warte auf Bestätigungen für die Verifizierung ...");
    await token.deploymentTransaction().wait(5);
    await hre.run("verify:verify", {
      address,
      constructorArguments: [name, symbol, cap, initial, deployer.address],
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
