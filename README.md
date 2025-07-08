# Checkpoint 2 (2:00 PM IST) – Smart Contract Development Initiated

## Progress Summary

Since Checkpoint 1, we have made meaningful progress in backend logic and overall setup:

- Submitted the **Hackathon Presentation PPT**
- Began developing the **Solidity Smart Contract**
- Added `.env` to securely manage environment variables
- Added `.gitignore` to exclude unnecessary files like `node_modules`, `.env`, and build artifacts

---

## Project Structure Update

```bash
.
├── contracts/
│   └── CertificateAuthenticator.sol      # Solidity smart contract started
├── .env                                  # Secure environment config
├── .gitignore                            # Git ignored files
├── hardhat.config.js                     # Hardhat configuration
├── package.json                          # npm config
├── README.md                             # This file

In Smart Contract We have Completed Following Functionalities:

Completed Function
authorizeInstitution(...)
Purpose: Authorizes a new institution by storing its details and marking it as authorized.
Access Control: Only the owner can call this function (onlyOwner modifier).
Emits: InstitutionAuthorized event on successful registration.

Logic:
Checks for a valid address.
If the institution is not already authorized, it adds it to institutionAddresses[].
Stores the institution details in the institutions mapping.
Emits an event.

Currently Being Built:

Certificate Verification
Certificate Revocation
Certificate Count Function
Owner Utility Functions

Next Steps We Will Take:-

Complete all contract logic
Write unit tests
Deploy to testnet (Polygon/Hardhat localnet)
Connect frontend to smart contract
