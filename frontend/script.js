// Global variables 
let provider;
let signer;
let contract;
let currentAccount;
let isConnected = false;
let institutionWallet = null;
const ALLOWED_GOVERNMENT_WALLET = "0x6E369fa5583F8b46D620B585cb4EbcF23EdADD5c".toLowerCase();
const ALLOWED_INSTITUTION_WALLETS = [
  "0x6E369fa5583F8b46D620B585cb4EbcF23EdADD5c".toLowerCase(),
  "0xc852aF3B42e558e87000C076797D1175D413b603".toLowerCase(),
  "0x742C8ec1AB26fFf922a4b8B1db3BBdc74F2B7210".toLowerCase()
];
// Smart contract ke liye configuration
const CONTRACT_ADDRESS = "0xfd51E113Cb657c5151b1d98e0e5e469ea91B62b1"; // Replace with your actual contract address
const POLYGON_AMOY_CHAIN_ID = "0x13882"; // 80002 in hex
const POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology/";

// Contract ABI (Application Binary Interface)
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
          "name": "ipfsHash",
          "type": "string"
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
          "name": "_ipfsHash",
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
              "name": "ipfsHash",
              "type": "string"
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
          "name": "_ipfsHash",
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
              "name": "ipfsHash",
              "type": "string"
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


// Listen for MetaMask account changes and handle UI/government portal access
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length > 0) {
            currentAccount = accounts[0];
            isConnected = true;
            updateConnectionStatus();

            // If the government portal is open, check if the account is still allowed
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
            // Optionally, close the government portal if no account is connected
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

// Handler for modal connect button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('govConnectBtn').onclick = async function() {
    try {
        // Always prompt MetaMask to connect (even if already connected)
        await connectWallet();

        // Check if the connected account matches the allowed government wallet
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
    document.getElementById('govWalletModal').onclick = function(e) {
        if (e.target === this) this.style.display = 'none';
    };
});
document.addEventListener('DOMContentLoaded', function() {
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

        // Prompt user to connect
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            showNotification('No wallet accounts found.', 'error');
            return;
        }

        currentAccount = accounts[0];

        // Create provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        await provider.ready;
        signer = provider.getSigner();

        // Wait for network info
        const { chainId } = await provider.getNetwork();
        if (chainId !== 80002) {
            showNotification('Please switch to Polygon Amoy testnet.', 'error');
            return;
        }

        // Setup contract AFTER confirming network
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        isConnected = true;

        updateConnectionStatus();
        loadAuthorizedInstitutions();
        loadIssuedCertificates();
        loadSystemStats();

        // Listen for account and chain changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showNotification('Failed to connect wallet: ' + error.message, 'error');
    }
}
