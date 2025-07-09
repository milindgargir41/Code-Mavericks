# TrueStamp : Blockchain Certificate Authentication System

### Available at : https://lively-kringle-ea06ae.netlify.app/

## Problem Statement
Certificate forgery and tampering have become alarmingly common, compromising the authenticity of academic and professional credentials. Traditional paper-based systems are prone to manipulation, loss, and fraud.

## Our Solution – TrueStamp
TrueStamp is a decentralized certificate authentication platform powered by blockchain. It ensures certificates are:
- **Immutable**  – Once issued, can't be changed.
- **Verifiable**  – Anyone can verify its authenticity.
- **Secure**  – Only authorized institutions (approved by government) can issue certificates.

## Key Features
- **Single Government Wallet Control**: Only the registered MetaMask wallet of the government can authorize institutions.
- **Restricted Access for Institutions**: Only institutions authorized by the government can issue certificates.
- **Public Verification Portal**: Anyone can verify certificates using IPFS hash or ID.
- **Real-Time Wallet Validation**: Access to portals is restricted based on wallet address at runtime.
- **Live Status Indicators**: Show wallet connection and network in real time.

## Tech Stack & Methodology
- **Frontend**: HTML, CSS, JavaScript
- **Blockchain**: Solidity (Smart Contract), Hardhat, Polygon Amoy Testnet
- **Libraries**: Ethers.js, OpenZeppelin
- **Storage**: IPFS for storing certificates securely
- **Authentication**: MetaMask wallet integration
- **Smart Contract Deployment**: Hardhat + Ethers

## How to Setup & Run

```bash
# Initialize Node project
npm init -y

# Install essential packages
npm install hardhat ethers
npm install @openzeppelin/contracts

# Install dev dependencies and Hardhat toolbox
npm install --save-dev
npm install @nomicfoundation/hardhat-toolbox

# Install dotenv for environment management
npm install dotenv

# Launch Hardhat project wizard
npx hardhat init

# Install Ethers again to ensure compatibility
npm install ethers

npx hardhat compile
# Compiles your Solidity smart contract and generates necessary artifacts in the artifacts/ and cache/ folders.

npx hardhat run scripts/deploy.js --network polygonAmoy
# Deploys your smart contract to the Polygon Amoy Testnet using the specified script.
# Make sure to copy the generated contract address and use it inside your frontend JavaScript code for interaction.
```

### Project Structure Created by Hardhat:
- contracts/ – Solidity smart contracts
- ignition/ – Deployment logic
- test/ – Test scripts for smart contracts
- .gitignore – Ignore node_modules, etc.
- hardhat.config.js – Hardhat configuration
- README.md – Project documentation

---

Made with Love at HackOrbit 2025 by Code-Mavericks.
