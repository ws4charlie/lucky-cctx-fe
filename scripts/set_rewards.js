// scripts/set_rewards.js
require('dotenv').config();
const { ethers } = require('ethers');
const { JsonRpcProvider } = require("ethers");
const { parseEther, formatEther, Contract } = require("ethers");

// ZetaChain Athens testnet RPC URL
const RPC_URL = process.env.RPC_URL;

// Contract address on ZetaChain Athens testnet
const CONTRACT_ADDRESS = '0x973499f438A924F38765539eB9d570543b5b9697';

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
      },
      {
        "internalType": "string[]",
        "name": "cctxIndices",
        "type": "string[]"
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
  GasGhost: 2,
  PatiencePioneer: 3
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
      console.log(`CCTX: ${testData.cctxIndices[i]}`);
      console.log("----------------------------------------");
    }
    
    // Call setRewards method with new parameter
    console.log("\nSending transaction...");
    const tx = await contractWithSigner.setRewards(
      testData.rewardTypes,
      testData.winners,
      testData.amounts,
      testData.cctxIndices
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
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
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
    RewardType.PatiencePioneer
  ];
  
  // Generate amounts (between 0.01 and 0.1 ZETA)
  const amounts = testAddresses.map(() => {
    const amount = 0.001 + Math.random() * 0.009; // Random amount between 0.01 and 0.1
    return parseEther(amount.toFixed(6)); // Convert to wei with 6 decimal precision
  });
  
  // Generate CCTX indices in the correct format
  const cctxIndices = [
    "0x83bcb2bc85f8d577ef7e27d1a9c47cd6b200954c0f4b02be5897bb7446942f63",
    "0x6c66f1c573c5e97e85de7b557df9026ce68621d4a0b45de8a9e4dafe435f2e8f",
    "0x4262f634530d4102ed15f13b8a190cc6cde1375b8f264ba8fd52d04e72d56cb5",
    "0xe887411ed653a10d384564d68e52503f3890753acd2abfa5d13dd244dd735949",
    "0x7f2101b8dbb5025746005ae7a179adaeaf7c666aa12cec7ebbcb283a3dfa1813"
  ];
  
  return {
    rewardTypes,
    winners: testAddresses,
    amounts,
    cctxIndices
  };
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  