##  Checkpoint 3 Update (4:00 PM IST)

---

### Work Completed So Far:

-  **Folder Structure Initialized**
  - /contracts – Solidity Smart Contract
  - /scripts – Deployment Scripts
  - /frontend – React frontend (WOULD START)
  - .env, .gitignore – Project configuration and secrets

-  **Initialized Tools**
  - npm init – Node package manager
  - hardhat – Ethereum dev environment
  - OpenZeppelin – Standardized secure contract templates

-  **MetaMask Setup**
  - Wallet connected and working on testnet

-  **Smart Contract Developed & Deployed**
  - Contract compiled, deployed, and ABI + Contract Address generated using **Hardhat**

---

##  Smart Contract Functionality

Below are the core features implemented in the **CertificateAuthenticator** contract:

###  Institution Management
- authorizeInstitution(...):   Government can authorize institutions with name, type, and registration ID.
- getInstitution(...):   Returns metadata of a registered institution.
- isAuthorized(...):   Checks if an address is a verified institution.
- getInstitutionCount():   Total number of registered institutions.
- getInstitutionAddressByIndex(index):   Gets institution address by array index.

---

###  Certificate Lifecycle
- issueCertificate(...):   Authorized institutions can issue certificates with metadata and IPFS hash.
- verifyCertificate(id):   Verifies certificate validity and metadata by ID.
- verifyCertificateByHash(ipfsHash):   Verifies certificate directly by IPFS hash.
- revokeCertificate(id):   Revoke a certificate (issuer or government only).
- getTotalCertificates():   Returns count of all certificates issued.

---

###  Utility Functions
- getGovernmentAddress(): Returns address of contract deployer (government).

---

##  Deployment Info

| Detail              | Value                                |
|---------------------|--------------------------------------|
| Network             | Hardhat / Polygon Amoy Testnet       |
| Contract Name       | CertificateAuthenticator           |
| Compiler Version    | ^0.8.19                            |
| Deployment Tool     | Hardhat                              |
| OpenZeppelin Used   | Yes (Ownable, Counters)              |
| Contract Address    | We are not sharing adress here in README file.       |
| ABI Path            | artifacts/contracts/CertificateAuthenticator.sol/CertificateAuthenticator.json |

---

## What's Next?

Next, we’ll begin building the **frontend interface**

