const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("CertificateAuthenticator");
  const contract = await ContractFactory.deploy();

  await contract.waitForDeployment();

  console.log(`Contract deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
