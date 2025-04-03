// scripts/set_rewards.js
require('dotenv').config();
const { ethers } = require('ethers');
const { JsonRpcProvider } = require("ethers");
const { parseEther, formatEther, Contract } = require("ethers");

// ZetaChain Athens testnet RPC URL
const RPC_URL = process.env.RPC_URL;

// Contract address on ZetaChain Athens testnet
const CONTRACT_ADDRESS = '0xB9117f51d18723bB3e3c85BF6672eFA626089C92';

const provider = new JsonRpcProvider(RPC_URL);

// ABI for the LuckyCCTXs contract - just what we need for setRewards
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "enum LuckyCCTXs.RewardType[]",
        "name": "rewardTypes",
        "type": "uint8[]"
      },
      {
        "internalType": "address[]",
        "name": "winners",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "setRewards",
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

// Enum for reward types
const RewardType = {
  LuckyCCTX: 0,
  FinalityFlash: 1,
  GasGhost: 2
};

async function main() {
  try {
    // Check if private key is available
    const privateKey = process.env.TEST_PK;
    if (!privateKey) {
      throw new Error("Private key not found. Please set TEST_PK in your .env file");
    }

    console.log("Setting up provider and wallet...");
    
    // Setup provider and wallet
    //const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const blockNumber = await provider.getBlockNumber();
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
    // Get the owner of the contract to verify we have the right key
    const contractOwner = await contractWithSigner.owner();
    const walletAddress = await wallet.getAddress();
    
    console.log(`Contract owner: ${contractOwner}`);
    console.log(`Wallet address: ${walletAddress}`);
    
    if (contractOwner.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error("The provided private key is not the owner of the contract");
    }
    
    // Example data for testing - replace with your own test data
    const testData = generateTestRewardsData();
    
    console.log("\nSetting rewards with the following data:");
    console.log("----------------------------------------");
    for (let i = 0; i < testData.winners.length; i++) {
      const rewardTypeName = Object.keys(RewardType).find(key => RewardType[key] === testData.rewardTypes[i]);
      console.log(`Winner: ${testData.winners[i]}`);
      console.log(`Reward Type: ${rewardTypeName} (${testData.rewardTypes[i]})`);
      console.log(`Amount: ${formatEther(testData.amounts[i])} ZETA`);
      console.log("----------------------------------------");
    }
    
    // Call setRewards method
    console.log("\nSending transaction...");
    const tx = await contractWithSigner.setRewards(
      testData.rewardTypes,
      testData.winners,
      testData.amounts
    );
    
    console.log(`Transaction sent: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`\nRewards successfully set!`);
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    process.exit(1);
  }
}

// Generate test data for setRewards
function generateTestRewardsData() {
  // Generate some random addresses for testing
  const testAddresses = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Replace with your test addresses
    "0xeB28B665C1aDBA260a5465a450398c1EaA052F08",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
  ];
  
  // Generate reward types (a mix of all types)
  const rewardTypes = [
    RewardType.LuckyCCTX,
    RewardType.LuckyCCTX,
    RewardType.FinalityFlash,
    RewardType.GasGhost,
    RewardType.LuckyCCTX
  ];
  
  // Generate amounts (between 0.01 and 0.1 ZETA)
  const amounts = testAddresses.map(() => {
    const amount = 0.001 + Math.random() * 0.009; // Random amount between 0.01 and 0.1
    return parseEther(amount.toFixed(6)); // Convert to wei with 6 decimal precision
  });
  
  return {
    rewardTypes,
    winners: testAddresses,
    amounts
  };
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
