TEAM CODE-MAVERICKS UPDATE

## Checkpoint 1 Update (1:00 PM IST): Project Initialized 
Below are the key tasks completed at this stage:

# Folder Structure Initialized

Untill now We have set up the basic folder layout to organize the project cleanly.


truestamp/
│
├── contracts/         # Will hold Solidity smart contracts
├── frontend/          # frontend


---

### NPM & Hardhat Initialized

We have initialized the project using the following commands:

bash
npm init -y
npm install --save-dev hardhat
npx hardhat


This created the following important files/folders automatically:


- node_modules/
- hardhat.config.js
- package.json
- package-lock.json
- scripts/deploy.js (auto)
- contracts/CertificateAuthenticator.sol (auto)
- test/Lock.js (auto)


---

###  MetaMask Wallet Set Up

We have Downloaded the MetaMask Extension and had created a account on it.
Our MetaMask wallet is now connected and configured to interact with the smart contracts we’ll be deploying. This ensures a smooth development experience when signing transactions via MetaMask.

---

## Next Up

We are now moving to *writing our first Solidity smart contract* that will allow:

- Institutions to register
- Certificates to be hashed and uploaded to blockchain
- Public to verify certificates

---

Stay tuned for the next checkpoint where we'll show working contract code and interaction!
