// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("CertificateAuthenticator"); // <- Your contract name
  const contract = await ContractFactory.deploy(); // <- Deploy it

  await contract.waitForDeployment(); // <- Await deployment

  console.log(`✅ Contract deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});