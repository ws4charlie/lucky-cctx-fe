// scripts/set_rewards.js
require('dotenv').config();
const { ethers } = require('ethers');
const { JsonRpcProvider } = require("ethers");
const { parseEther, formatEther, Contract } = require("ethers");

// ZetaChain Athens testnet RPC URL
const RPC_URL = process.env.RPC_URL;

// Contract address on ZetaChain
const CONTRACT_ADDRESS = '0xdB466D34D45638558e01e6c0f4da3A7De500cdAB';

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
      },
      {
        "internalType": "uint256[]",
        "name": "chainIDs",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "finalityTimes",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "gasFees",
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
  GasGhost: 2,
  PatiencePioneer: 3
};

// Import chain configuration (create a CommonJS version for Node.js)
const SUPPORTED_CHAINS = {
  // Mainnet chains
  1: {
    name: 'Ethereum',
    shortName: 'ETH',
  },
  56: {
    name: 'BNB Chain',
    shortName: 'BNB',
  },
  137: {
    name: 'Polygon',
    shortName: 'Polygon',
  },
  8453: {
    name: 'Base',
    shortName: 'BASE',
  },
  8332: {
    name: 'Bitcoin',
    shortName: 'BTC',
  },
};

// Get an array of supported chain IDs for random selection
const getSupportedChainIds = () => {
  return Object.keys(SUPPORTED_CHAINS).map(id => parseInt(id));
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
      const chainName = SUPPORTED_CHAINS[testData.chainIDs[i]]?.name || 'Unknown Chain';
      
      console.log(`Winner: ${testData.winners[i]}`);
      console.log(`Reward Type: ${rewardTypeName} (${testData.rewardTypes[i]})`);
      console.log(`Amount: ${formatEther(testData.amounts[i])} rwZETA`);
      console.log(`CCTX: ${testData.cctxIndices[i]}`);
      console.log(`Chain ID: ${testData.chainIDs[i]} (${chainName})`);
      console.log(`Finality Time: ${testData.finalityTimes[i]} seconds`);
      console.log(`Gas Fee: ${formatEther(testData.gasFees[i])} (chain native)`);
      console.log("----------------------------------------");
    }
    
    // Call setRewards method with all parameters
    console.log("\nSending transaction...");
    const tx = await contractWithSigner.setRewards(
      testData.rewardTypes,
      testData.winners,
      testData.amounts,
      testData.cctxIndices,
      testData.chainIDs,
      testData.finalityTimes,
      testData.gasFees
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
    "0xEbA816378707e47f18320e672603c7790058a936",
    "0xeB28B665C1aDBA260a5465a450398c1EaA052F08", // your own address for test
    "0xcdB2b5041eD88E7AFcD6383992E38AB148B4831c",
    "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
  ];
  
  // Generate reward types (a mix of all types)
  const rewardTypes = [
    RewardType.LuckyCCTX,
    RewardType.FinalityFlash,
    RewardType.GasGhost,
    RewardType.PatiencePioneer
  ];
  
  // Generate amounts - fixed tiny amount for all addresses except your own
  const amounts = testAddresses.map((address) => {
    // For your address, use a larger amount so you can claim it back
    if (address.toLowerCase() === "0xeB28B665C1aDBA260a5465a450398c1EaA052F08".toLowerCase()) {
      return parseEther("0.000002"); // 2x for your address
    }
    // For all other addresses, use the minimal amount
    return parseEther("0.000001");
  });
  
  // The rest of your function remains the same
  const cctxIndices = [
    "0x7cfa622b9569e380a648fb853205fc4c72802c9f2962dee662124fe5f1c74127",
    "0x60e9b0734279312be76d11d6dee7abb390ca8e3df3e2bff15a7c7fbd9872c458",
    "0x9f54fc6775cd639032f7f304e7398bb4a8be0f2761b05820db3a5fca5b0763ea",
    "0x0ae1e196341eca049fadb46d93f179fdb5541455f239b6bdb40c6772670234c6"
  ];

  // Generate random chain IDs from supported chains
  const supportedChainIds = getSupportedChainIds();
  const chainIDs = testAddresses.map(() => {
    const randomIndex = Math.floor(Math.random() * supportedChainIds.length);
    return supportedChainIds[randomIndex];
  });

  // Generate random finality times (10 seconds to 5 minutes)
  const finalityTimes = testAddresses.map(() => {
    const baseTime = 10; // Base time in seconds
    const randomTime = Math.floor(Math.random() * 290) + baseTime; // Random time between 10 and 300 seconds
    return randomTime;
  });

  // Generate random gas fees (0.0001 to 0.01 in native token)
  const gasFees = testAddresses.map(() => {
    const gasFee = 0.0001 + Math.random() * 0.0099; // Random fee between 0.0001 and 0.01
    return parseEther(gasFee.toFixed(6)); // Convert to wei with 6 decimal precision
  });
  
  return {
    rewardTypes,
    winners: testAddresses,
    amounts,
    cctxIndices,
    chainIDs,
    finalityTimes,
    gasFees
  };
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });