
let provider;
let signer;
let contract;
let currentAccount;
let isConnected = false;
let institutionWallet = null;
const ALLOWED_GOVERNMENT_WALLET = "0x8d4FCF275740bDDd7bbFeC996F689bBc2f35743E".toLowerCase();
const ALLOWED_INSTITUTION_WALLETS = [
  "0x859c248490F8be17d12F8e5a4fE1fB384102a43A".toLowerCase(),
  "0xc852aF3B42e558e87000C076797D1175D413b603".toLowerCase(),
  "0x742C8ec1AB26fFf922a4b8B1db3BBdc74F2B7210".toLowerCase()
];
const CONTRACT_ADDRESS = "0x55c1c865dA8427aF791DebeE81fbbf63551f7DD2";
const POLYGON_AMOY_CHAIN_ID = "0x13882";
const POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology/";

const CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "recipientName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "courseName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificateHash",
          "type": "string"
        }
      ],
      "name": "CertificateIssued",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "CertificateRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "institution",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "institutionType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "registrationNumber",
          "type": "string"
        }
      ],
      "name": "InstitutionAuthorized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_institution",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_institutionType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_registrationNumber",
          "type": "string"
        }
      ],
      "name": "authorizeInstitution",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_bytes32",
          "type": "bytes32"
        }
      ],
      "name": "bytes32ToString",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "certificateHashExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "certificates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "recipientName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "courseName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "issuerName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "issueDate",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "certificateHash",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "dataHash",
          "type": "bytes32"
        },
        {
          "internalType": "bool",
          "name": "isValid",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "issuer",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "dataHashToId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_certificateHash",
          "type": "string"
        }
      ],
      "name": "doesCertificateHashExist",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_recipientName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_courseName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_issuerName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_timestamp",
          "type": "uint256"
        }
      ],
      "name": "generateCertificateHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_recipientName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_courseName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_issuerName",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        }
      ],
      "name": "generateDataHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getCertificateHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGovernmentAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_institution",
          "type": "address"
        }
      ],
      "name": "getInstitution",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getInstitutionAddressByIndex",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getInstitutionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalCertificates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "hashToId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "institutionAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "institutions",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "institutionType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "registrationNumber",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isAuthorized",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_institution",
          "type": "address"
        }
      ],
      "name": "isAuthorized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_recipientName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_courseName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_issuerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_certificateHash",
          "type": "string"
        }
      ],
      "name": "issueCertificate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_recipientName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_courseName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_issuerName",
          "type": "string"
        }
      ],
      "name": "issueCertificateWithAutoHash",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "revokeCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "validateCertificateIntegrity",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "verifyCertificate",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "recipientName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "courseName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "issuerName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "issueDate",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "certificateHash",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "dataHash",
              "type": "bytes32"
            },
            {
              "internalType": "bool",
              "name": "isValid",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "issuer",
              "type": "address"
            }
          ],
          "internalType": "struct CertificateAuthenticator.Certificate",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_dataHash",
          "type": "bytes32"
        }
      ],
      "name": "verifyCertificateByDataHash",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "recipientName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "courseName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "issuerName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "issueDate",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "certificateHash",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "dataHash",
              "type": "bytes32"
            },
            {
              "internalType": "bool",
              "name": "isValid",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "issuer",
              "type": "address"
            }
          ],
          "internalType": "struct CertificateAuthenticator.Certificate",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_certificateHash",
          "type": "string"
        }
      ],
      "name": "verifyCertificateByHash",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "recipientName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "courseName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "issuerName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "issueDate",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "certificateHash",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "dataHash",
              "type": "bytes32"
            },
            {
              "internalType": "bool",
              "name": "isValid",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "issuer",
              "type": "address"
            }
          ],
          "internalType": "struct CertificateAuthenticator.Certificate",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
if (window.ethereum) {
  window.ethereum.on('accountsChanged', function (accounts) {
    if (accounts.length > 0) {
      currentAccount = accounts[0];
      isConnected = true;
      updateConnectionStatus();

      const govPortal = document.getElementById('government');
      if (
        govPortal.classList.contains('active') &&
        currentAccount.toLowerCase() !== ALLOWED_GOVERNMENT_WALLET
      ) {
        govPortal.classList.remove('active');
        document.getElementById('govWalletModal').style.display = 'flex';
        document.getElementById('govWalletError').textContent =
          "You are not authorized for the Government Portal. Please connect the authorized government wallet.";
      }
    } else {
      isConnected = false;
      currentAccount = null;
      updateConnectionStatus();
      const govPortal = document.getElementById('government');
      if (govPortal.classList.contains('active')) {
        govPortal.classList.remove('active');
        document.getElementById('govWalletModal').style.display = 'flex';
        document.getElementById('govWalletError').textContent =
          "Please connect your MetaMask wallet to access the Government Portal.";
      }
    }
  });
}

async function registerInstitution() {
  const institutionName = document.getElementById('institutionName').value.trim();
  const institutionType = document.getElementById('institutionType').value.trim();
  const institutionAddress = document.getElementById('institutionAddress').value.trim();
  const registrationNumber = document.getElementById('registrationNumber').value.trim();

  if (!institutionName || !institutionType || !institutionAddress || !registrationNumber) {
    showNotification('Please fill all fields', 'error');
    return;
  }
  if (!ethers.utils.isAddress(institutionAddress)) {
    showNotification('Invalid institution wallet address! Please enter a valid 0x... address.', 'error');
    return;
  }

  try {
    setButtonLoading('registerBtn', 'registerBtnText', 'registerLoading', true);
    const tx = await contract.authorizeInstitution(
      institutionAddress,
      institutionName,
      institutionType,
      registrationNumber
    );
    showNotification('Transaction submitted. Waiting for confirmation...', 'info');
    await tx.wait();
    showNotification('Institution registered successfully!', 'success');

    document.getElementById('institutionName').value = '';
    document.getElementById('institutionType').value = '';
    document.getElementById('institutionAddress').value = '';
    document.getElementById('registrationNumber').value = '';

    await loadAuthorizedInstitutions();
    loadSystemStats();
  } catch (error) {
    console.error('Error registering institution:', error);
    showNotification('Failed to register institution: ' + error.message, 'error');
  } finally {
    setButtonLoading('registerBtn', 'registerBtnText', 'registerLoading', false);
  }
}

async function loadAuthorizedInstitutions() {
    if (!window.ethereum || !isConnected) {
        console.warn('Wallet not connected');
        return;
    }
    
    const institutionsDiv = document.getElementById('authorizedInstitutions');
    institutionsDiv.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Loading institutions...</p>';

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS.trim(), CONTRACT_ABI, signer);

        let count = await contract.getInstitutionCount();
        count = Number(count.toString ? count.toString() : count);

        if (count === 0) {
            institutionsDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No institutions registered yet.</p>';
            return;
        }

        let html = '<div class="institutions-grid">';
        let totalCount = 0;

        for (let i = 0; i < count; i++) {
            try {
                const address = await contract.getInstitutionAddressByIndex(i);
                const institution = await contract.institutions(address);

                const statusClass = institution.isAuthorized ? 'active' : 'inactive';
                const statusText = institution.isAuthorized ? 'Active' : 'Inactive';
                const statusColor = institution.isAuthorized ? '#4CAF50' : '#f44336';

                html += `
                    <div class="institution-card">
                        <h4>${institution.name}</h4>
                        <p><strong>Type:</strong> ${institution.institutionType}</p>
                        <p><strong>Registration:</strong> ${institution.registrationNumber}</p>
                        <p><strong>Address:</strong> ${address.slice(0, 10)}...${address.slice(-8)}</p>
                        <p><strong>Status:</strong> <span class="status-badge ${statusClass}" style="color: ${statusColor};">${statusText}</span></p>
                        ${!institution.isAuthorized ? '<p style="color: #f44336; font-size: 12px;">⚠️ Not authorized to issue certificates</p>' : ''}
                    </div>
                `;
                totalCount++;
            } catch (error) {
                console.error(`Error loading institution ${i}:`, error);
            }
        }

        html += '</div>';

        if (totalCount === 0) {
            institutionsDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No institutions found.</p>';
        } else {
            institutionsDiv.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading institutions:', error);
        institutionsDiv.innerHTML = '<p style="text-align: center; color: #f44336; padding: 20px;">Error loading institutions</p>';
    }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('govConnectBtn').onclick = async function () {
    try {
      await connectWallet();

      if (currentAccount && currentAccount.toLowerCase() === ALLOWED_GOVERNMENT_WALLET) {
        document.getElementById('govWalletModal').style.display = 'none';
        document.getElementById('government').classList.add('active');
      } else {
        document.getElementById('govWalletError').textContent = "Access denied: Only the authorized government wallet can access this portal.";
      }
    } catch (err) {
      document.getElementById('govWalletError').textContent = err.message || "Wallet connection failed.";
    }
  };
  document.getElementById('govWalletModal').onclick = function (e) {
    if (e.target === this) this.style.display = 'none';
  };
});

document.addEventListener('DOMContentLoaded', function () {
  checkWalletConnection();
  updateCertificatePreview();
  updateCurrentDate();
  loadSystemStats();
  document.getElementById('contractAddress').textContent = CONTRACT_ADDRESS;
});

async function connectWallet() {
  try {
    if (typeof window.ethereum === 'undefined') {
      showNotification('MetaMask is not installed. Please install MetaMask to use this application.', 'error');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      showNotification('No wallet accounts found.', 'error');
      return;
    }

    currentAccount = accounts[0];

    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    await provider.ready;
    signer = provider.getSigner();

    const { chainId } = await provider.getNetwork();
    if (chainId !== 80002) {
      showNotification('Please switch to Polygon Amoy testnet.', 'error');
      return;
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    isConnected = true;

    updateConnectionStatus();
    loadAuthorizedInstitutions();
    loadIssuedCertificates();
    loadSystemStats();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    showNotification('Wallet connected successfully!', 'success');
  } catch (error) {
    console.error('Error connecting wallet:', error);
    showNotification('Failed to connect wallet: ' + error.message, 'error');
  }
}

async function switchToPolygonAmoy() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_AMOY_CHAIN_ID }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: POLYGON_AMOY_CHAIN_ID,
              chainName: 'Polygon Amoy Testnet',
              rpcUrls: [POLYGON_AMOY_RPC],
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              blockExplorerUrls: ['https://amoy.polygonscan.com/'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Polygon Amoy network');
      }
    } else {
      throw switchError;
    }
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    isConnected = false;
    currentAccount = null;
    updateConnectionStatus();
    showNotification('Wallet disconnected', 'info');
  } else {
    currentAccount = accounts[0];
    updateConnectionStatus();
    showNotification('Account switched', 'info');
  }
}

function handleChainChanged(chainId) {
  window.location.reload();
}

function updateConnectionStatus() {
  const statusDot = document.getElementById('connectionStatus');
  const statusText = document.getElementById('connectionText');
  const networkInfo = document.getElementById('networkInfo');
  const accountInfo = document.getElementById('accountInfo');
  const accountAddress = document.getElementById('accountAddress');
  const connectButton = document.getElementById('connectWallet');

  if (isConnected && currentAccount) {
    statusDot.className = 'status-dot connected';
    statusText.textContent = 'Connected';
    networkInfo.textContent = 'Network: Polygon Amoy Testnet';
    `accountAddress.textContent = Account: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
    accountInfo.style.display = 'block';
    connectButton.textContent = 'Connected';
    connectButton.disabled = true;
    connectButton.classList.add('btn-connected');

    document.getElementById('networkStatus').textContent = '🟢 Connected';
  } else {
    statusDot.className = 'status-dot';
    statusText.textContent = 'Not Connected';
    networkInfo.textContent = 'Network: Not Connected';
    accountInfo.style.display = 'none';
    connectButton.textContent = 'Connect MetaMask';
    connectButton.disabled = false;
    connectButton.classList.remove('btn-connected');

    document.getElementById('networkStatus').textContent = '🔴 Disconnected';
  }
}

async function checkWalletConnection() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }
}

function updateCurrentDate() {
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('previewIssueDate').textContent = dateString;
}

function showEmailSection() {
  document.getElementById('emailSection').style.display = 'block';
  document.getElementById('emailRecipient').value = document.getElementById('studentEmail').value;
}

function hideEmailSection() {
  document.getElementById('emailSection').style.display = 'none';
}

async function sendCertificateEmail() {
  try {
    setButtonLoading('sendEmailBtn', 'sendEmailBtnText', 'sendEmailLoading', true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showNotification('Email sent successfully! (Simulated)', 'success');
    hideEmailSection();
  } catch (error) {
    console.error('Error sending email:', error);
    showNotification('Failed to send email', 'error');
  } finally {
    setButtonLoading('sendEmailBtn', 'sendEmailBtnText', 'sendEmailLoading', false);
  }
}

async function loadIssuedCertificates() {
  if (!isConnected) return;
  const certificatesDiv = document.getElementById('issuedCertificates');
  try {
    const total = await contract.getTotalCertificates();
    if (total == 0) {
      certificatesDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No certificates issued yet.</p>';
      return;
    }
    let html = '';
    for (let i = Math.max(1, total - 4); i <= total; i++) {
      const cert = await contract.certificates(i);
      if (cert.issuer.toLowerCase() !== currentAccount.toLowerCase()) continue;
      html += `<div class="certificate-card">
                    <p><strong>ID:</strong> ${cert.id}</p>
                    <p><strong>Student:</strong> ${cert.recipientName}</p>
                    <p><strong>Course:</strong> ${cert.courseName}</p>
                    <p><strong>Issue Date:</strong> ${new Date(cert.issueDate * 1000).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${cert.isValid ? 'status-approved' : 'status-rejected'}">${cert.isValid ? 'Valid' : 'Revoked'}</span></p>
                </div>`;
    }
    if (!html) {
      certificatesDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No certificates issued yet.</p>';
    } else {
      certificatesDiv.innerHTML = html;
    }
  } catch (error) {
    console.error('Error loading issued certificates:', error);
    certificatesDiv.innerHTML = '<p style="color: #f44336; padding: 20px;">Error loading certificates.</p>';
  }
}

async function loadSystemStats() {
  if (!isConnected) return;

  try {
    const [institutionCount, certificateCount] = await Promise.all([
      contract.getInstitutionCount(),
      contract.getCertificateCount()
    ]);

    document.getElementById('totalInstitutions').textContent = institutionCount.toString();
    document.getElementById('totalCertificates').textContent = certificateCount.toString();

  } catch (error) {
    console.error('Error loading system stats:', error);
  }
}

function showPage(pageId, event) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => tab.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');

  if (pageId === 'government') {
    document.getElementById('govWalletModal').style.display = 'flex';
    document.getElementById('govWalletError').textContent = '';
  } else {
    document.getElementById(pageId).classList.add('active');
  }
}

function setButtonLoading(buttonId, textId, loadingId, isLoading) {
  const button = document.getElementById(buttonId);
  const text = document.getElementById(textId);
  const loading = document.getElementById(loadingId);

  if (isLoading) {
    button.disabled = true;
    text.style.display = 'none';
    loading.style.display = 'inline-block';
  } else {
    button.disabled = false;
    text.style.display = 'inline';
    loading.style.display = 'none';
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => { notification.classList.add('show'); }, 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) notification.parentNode.removeChild(notification);
    }, 300);
  }, 4000);
}

function openInstitutionPortal() {
  document.getElementById('instWalletModal').style.display = 'block';
  document.getElementById('instWalletError').innerText = '';

  document.getElementById('instConnectBtn').onclick = async function () {
    if (typeof window.ethereum === 'undefined') {
      document.getElementById('instWalletError').innerText = "MetaMask is not installed!";
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      institutionWallet = accounts[0];
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const isAllowed = ALLOWED_INSTITUTION_WALLETS.includes(institutionWallet.toLowerCase());
      const isAuthorized = await contract.isAuthorized(institutionWallet);

      if (isAllowed) {
        document.getElementById('instWalletModal').style.display = 'none';
        showPage('institution');
        document.getElementById('accountInfo').style.display = 'block';
        document.getElementById('accountAddress').innerText = institutionWallet;
      } else {
        document.getElementById('instWalletError').innerText =
          "This wallet is NOT authorized as an institution by the government.";
      }

    } catch (err) {
      document.getElementById('instWalletError').innerText =
        "Wallet connection failed: " + (err.message || err);
    }
  };

  window.onclick = function (event) {
    const modal = document.getElementById('instWalletModal');
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function formatAddress(address) {
  if (!address) return 'N/A';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showNotification('Failed to copy to clipboard', 'error');
  });
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('copy-btn')) {
    const textToCopy = e.target.getAttribute('data-copy');
    copyToClipboard(textToCopy);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const addresses = document.querySelectorAll('.address');
  addresses.forEach(addr => {
    addr.addEventListener('click', function () {
      copyToClipboard(this.textContent);
    });
    addr.style.cursor = 'pointer';
    addr.title = 'Click to copy';
  });
});

function generateCertificateData(studentName, courseName, issuerName, certificateId, issueDate) {
    return {
        studentName,
        courseName,
        issuerName,
        certificateId,
        issueDate,
        issueTimestamp: Date.now()
    };
}

function deterministicStringify(obj) {
    return JSON.stringify({
        studentName: obj.studentName,
        courseName: obj.courseName,
        issuerName: obj.issuerName,
        certificateId: obj.certificateId,
        issueDate: obj.issueDate,
        issueTimestamp: obj.issueTimestamp
    });
}

async function issueCertificate() {
    if (!isConnected) {
        showNotification('Please connect your wallet first', 'error');
        return;
    }

    const studentName = document.getElementById('studentName').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    const completionDate = document.getElementById('completionDate').value || new Date().toISOString().split('T')[0];
    const grade = document.getElementById('grade').value.trim() || 'Pass';
    
    let issuerName = "Institution";
    const issuerNameInput = document.getElementById('institutionName');
    if (issuerNameInput && issuerNameInput.value.trim()) {
        issuerName = issuerNameInput.value.trim();
    }

    if (!studentName || !courseName || !issuerName) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    try {
        setButtonLoading('issueBtn', 'issueBtnText', 'issueLoading', true);

        const isAuthorized = await contract.isAuthorized(currentAccount);
        if (!isAuthorized) {
            throw new Error('Your wallet is not authorized to issue certificates');
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const issueDateISO = new Date(timestamp * 1000).toISOString();

        const certificateData = {
            studentName: studentName,
            courseName: courseName,
            completionDate: completionDate,
            grade: grade,
            issuerName: issuerName,
            issueDate: issueDateISO,
            issueTimestamp: timestamp,
            issuer: currentAccount
        };

        const dataForHashing = JSON.stringify({
            studentName: certificateData.studentName,
            courseName: certificateData.courseName,
            completionDate: certificateData.completionDate,
            grade: certificateData.grade,
            issuerName: certificateData.issuerName,
            issueDate: certificateData.issueDate,
            issueTimestamp: certificateData.issueTimestamp,
            issuer: certificateData.issuer
        });

        const certificateHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(dataForHashing));

        const tx = await contract.issueCertificate(
            studentName,
            courseName,
            issuerName,
            certificateHash
        );

        showNotification('Transaction submitted. Waiting for confirmation...', 'info');
        const receipt = await tx.wait();

        const certificateId = receipt.events?.find(e => e.event === 'CertificateIssued')?.args?.id || 'N/A';

        certificateData.certificateId = certificateId.toString();
        certificateData.certificateHash = certificateHash;
        certificateData.transactionHash = receipt.transactionHash;
        certificateData.blockNumber = receipt.blockNumber;

        const downloadableData = JSON.stringify(certificateData, null, 2);
        window.lastIssuedCertificateDownload = downloadableData;

        window.lastIssuedCertificate = certificateData;

        showNotification('Certificate issued successfully with hash stored!', 'success');
        document.getElementById('txHash').textContent = receipt.transactionHash;
        document.getElementById('certId').textContent = certificateId.toString();
        document.getElementById('blockNumber').textContent = receipt.blockNumber;
        document.getElementById('certificateHash').textContent = certificateHash;
        document.getElementById('polygonScanLink').href = `https://amoy.polygonscan.com/tx/${receipt.transactionHash}`;
        document.getElementById('transactionInfo').style.display = 'block';
        document.getElementById('previewCertId').textContent = certificateId.toString();
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('emailBtn').disabled = false;

        document.getElementById('previewStudentName').textContent = studentName;
        document.getElementById('previewCourseName').textContent = courseName;
        document.getElementById('previewDate').textContent = completionDate;
        document.getElementById('previewGrade').textContent = grade;

        loadIssuedCertificates();
        loadSystemStats();

    } catch (error) {
        console.error('Error issuing certificate:', error);
        showNotification('Failed to issue certificate: ' + error.message, 'error');
    } finally {
        setButtonLoading('issueBtn', 'issueBtnText', 'issueLoading', false);
    }
}

function downloadCertificate() {
    try {
        if (!window.lastIssuedCertificateDownload) {
            showNotification('No certificate data available for download', 'error');
            return;
        }

        const dataStr = window.lastIssuedCertificateDownload;
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `certificate_${document.getElementById('previewCertId').textContent}.json`;
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', exportFileDefaultName);
        link.click();
        
        showNotification('Certificate downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading certificate:', error);
        showNotification('Failed to download certificate', 'error');
    }
}

function generateCertificateHash(certificateData) {
    const dataForHashing = JSON.stringify({
        studentName: certificateData.studentName,
        courseName: certificateData.courseName,
        completionDate: certificateData.completionDate,
        grade: certificateData.grade,
        issuerName: certificateData.issuerName,
        issueDate: certificateData.issueDate,
        issueTimestamp: certificateData.issueTimestamp,
        issuer: certificateData.issuer
    });
    
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(dataForHashing));
}

function updateCertificatePreview() {
    const studentName = document.getElementById('studentName').value || 'Student Name';
    const courseName = document.getElementById('courseName').value || 'Course Name';
    const completionDate = document.getElementById('completionDate').value || 'Not specified';
    const grade = document.getElementById('grade').value || 'Not specified';
    
    document.getElementById('previewStudentName').textContent = studentName;
    document.getElementById('previewCourseName').textContent = courseName;
    document.getElementById('previewDate').textContent = completionDate;
    document.getElementById('previewGrade').textContent = grade;
    document.getElementById('previewStudentAddr').textContent = 'Not specified';
}
