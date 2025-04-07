// scripts/change-admin.js
require('dotenv').config();
const { ethers } = require('ethers');
const { JsonRpcProvider } = require("ethers");

// ZetaChain Athens testnet RPC URL
const RPC_URL = process.env.RPC_URL;

// Contract address on ZetaChain
const CONTRACT_ADDRESS = '0x79EE15e8A98F7b9f765D6bfAe7c1DC78100B0C41';

// Your new owner address
const NEW_OWNER_ADDRESS = '0xBB8cC1baDD3ec0a27bDFB100A7e425B598670De4';

// Minimal ABI for the transferOwnership function
const CONTRACT_ABI = [
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
  }
];

async function main() {
  try {
    // Check required environment variables
    if (!RPC_URL) {
      throw new Error("RPC_URL not set in environment");
    }
    if (!CONTRACT_ADDRESS) {
      throw new Error("CONTRACT_ADDRESS not set in environment");
    }
    if (!NEW_OWNER_ADDRESS) {
      throw new Error("NEW_OWNER_ADDRESS not set in environment");
    }
    
    // Check if private key is available
    const privateKey = process.env.TEST_PK;
    if (!privateKey) {
      throw new Error("Private key not found. Please set PRIVATE_KEY or TEST_PK in your .env file");
    }

    console.log("Setting up provider and wallet...");
    
    // Setup provider and wallet
    const provider = new JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
    // Get the current owner of the contract
    const currentOwner = await contractWithSigner.owner();
    const walletAddress = await wallet.getAddress();
    
    console.log(`Current contract owner: ${currentOwner}`);
    console.log(`Wallet address: ${walletAddress}`);
    console.log(`New owner address: ${NEW_OWNER_ADDRESS}`);
    
    // Verify the wallet is the current owner
    if (currentOwner.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error("The provided private key is not the current owner of the contract");
    }
    
    // Verify the new owner address is valid
    if (!ethers.isAddress(NEW_OWNER_ADDRESS)) {
      throw new Error("Invalid new owner address");
    }
    
    console.log("\nTransferring ownership...");
    
    // Transfer ownership
    const tx = await contractWithSigner.transferOwnership(NEW_OWNER_ADDRESS);
    
    console.log(`Transaction sent: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`\nOwnership successfully transferred to ${NEW_OWNER_ADDRESS}!`);
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    process.exit(1);
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });