// scripts/add_price.js
require('dotenv').config();
const { ethers } = require('ethers');
const { JsonRpcProvider } = require("ethers");
const { parseEther, formatEther, Contract } = require("ethers");

// ZetaChain Athens testnet RPC URL
const RPC_URL = process.env.RPC_URL;

// Contract address on ZetaChain
const CONTRACT_ADDRESS = '0x592dC2b7338D73d68982B8af71bb91a63E2289f2';

// The ZETA supply value to set
const ZETA_SUPPLY = '32746502468475000000';

// Minimal ABI for the AddPriceFeed function
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newSupply",
        "type": "uint256"
      }
    ],
    "name": "AddPriceFeed",
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
    
    // Check if private key is available
    const privateKey = process.env.TEST_PK;
    if (!privateKey) {
      throw new Error("Private key not found. Please set TEST_PK in your .env file");
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
    
    // Verify the wallet is the current owner
    if (currentOwner.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error("The provided private key is not the current owner of the contract");
    }
    
    console.log(`\nSetting ZETA supply to: ${ZETA_SUPPLY}`);
    
    // Call AddPriceFeed function
    const tx = await contractWithSigner.AddPriceFeed(ZETA_SUPPLY);
    
    console.log(`Transaction sent: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`\nZETA supply successfully updated!`);
    
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
  