const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");
  
  // Deploy Token
  const Token = await hre.ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);
  
  // Deploy Faucet
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);
  
  // Grant minter role to faucet
  const MINTER_ROLE = await token.MINTER_ROLE();
  const tx = await token.grantRole(MINTER_ROLE, faucetAddress);
  await tx.wait();
  console.log("Minter role granted to faucet");
  
  // Save addresses to file for frontend
  const fs = require("fs");
  const addresses = {
    token: tokenAddress,
    faucet: faucetAddress,
    network: hre.network.name
  };
  
  fs.writeFileSync(
    "../frontend/src/contracts/addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  
  console.log("Addresses saved to frontend/src/contracts/addresses.json");
  
  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // Verify contracts on Etherscan
  console.log("Verifying contracts on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [],
    });
  } catch (error) {
    console.log("Token verification error:", error.message);
  }
  
  try {
    await hre.run("verify:verify", {
      address: faucetAddress,
      constructorArguments: [tokenAddress],
    });
  } catch (error) {
    console.log("Faucet verification error:", error.message);
  }
  
  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});