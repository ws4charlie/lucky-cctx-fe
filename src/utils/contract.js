// src/utils/contract.js
import { formatEther, parseEther, Contract } from 'ethers';

// Contract address on ZetaChain Athens testnet
const contractAddress = '0x651D44818E7B71B1C85d6dcC6AA61418E27c1a49';

// ABI for the LuckyCCTXs contract - directly from the ABI file
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "enum LuckyCCTXs.RewardType",
        "name": "rewardType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RewardClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "winners",
        "type": "address[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "enum LuckyCCTXs.RewardType[]",
        "name": "rewardTypes",
        "type": "uint8[]"
      }
    ],
    "name": "RewardsSet",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "EPOCH_TIME",
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
    "name": "canSetRewards",
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
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUnclaimedRewards",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserRewardsHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum LuckyCCTXs.RewardType",
            "name": "rewardType",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "claimed",
            "type": "bool"
          }
        ],
        "internalType": "struct LuckyCCTXs.Reward[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "hasUnclaimedRewards",
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
    "inputs": [],
    "name": "lastRewardsTimestamp",
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
    "name": "timeUntilNextRewards",
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
    "name": "totalRewardsDistributed",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userRewards",
    "outputs": [
      {
        "internalType": "enum LuckyCCTXs.RewardType",
        "name": "rewardType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "claimed",
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
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Helper function to convert reward type number to a readable name
const getRewardTypeName = (typeNumber) => {
  const types = {
    0: "Lucky CCTX",       // lucky CCTX
    1: "Finality Flash",   // fastest finality
    2: "Gas Ghost",        // lowest gas
  };
  return types[typeNumber] || "Unknown";
};

// Get a contract instance with a signer (for sending transactions)
export const getContractWithSigner = async (provider) => {
  const signer = provider.getSigner();
  return new Contract(contractAddress, contractABI, signer);
};

// Get a contract instance without a signer (for read-only operations)
export const getContractReadOnly = (provider) => {
  return new Contract(contractAddress, contractABI, provider);
};

// Check if the user has unclaimed rewards
export const checkUnclaimedRewards = async (contract, userAddress) => {
  try {
    return await contract.hasUnclaimedRewards(userAddress);
  } catch (error) {
    console.error("Error checking unclaimed rewards:", error);
    return false;
  }
};

// Get the amount of unclaimed rewards
export const getUnclaimedRewardsAmount = async (contract, userAddress) => {
  try {
    const amount = await contract.getUnclaimedRewards(userAddress);
    return formatEther(amount); // Convert from wei to ZETA
  } catch (error) {
    console.error("Error getting unclaimed rewards amount:", error);
    return "0";
  }
};

// Claim rewards
export const claimRewards = async (contract) => {
  try {
    const tx = await contract.claimRewards();
    return await tx.wait();
  } catch (error) {
    console.error("Error claiming rewards:", error);
    throw error;
  }
};

// Withdraw rewards to a specific address
export const withdrawRewards = async (contract, amount, toAddress) => {
  try {
    const amountInWei = parseEther(amount);
    const tx = await contract.withdraw(amountInWei, toAddress);
    return await tx.wait();
  } catch (error) {
    console.error("Error withdrawing rewards:", error);
    throw error;
  }
};

// Get all current winners by filtering RewardsSet events
export const fetchCurrentWinners = async (provider) => {
  try {
    console.log("Fetching current winners...");
    const contract = new Contract(contractAddress, contractABI, provider);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log(`Latest block: ${latestBlock}`);
    
    // Look back 1000 blocks to find the most recent RewardsSet event
    const fromBlock = Math.max(0, latestBlock - 1000);
    console.log(`Searching from block ${fromBlock} to ${latestBlock}`);
    
    // In ethers v6, you need to use the event name as a string
    // The filters.EventName() approach is different in v6
    try {
      // Create a filter for RewardsSet events
      const filter = contract.filters.RewardsSet();
    
      const events = await contract.queryFilter(filter, fromBlock, latestBlock);
      console.log(`Found ${events.length} RewardsSet events`);  
      
      // If no events, return empty array
      if (events.length === 0) {
        console.log("No RewardsSet events found");
        return [];
      }
      
      // Get the most recent event
      const latestEvent = events[events.length - 1];  
      console.log("Latest event found:", latestEvent.transactionHash);
      
      // In v6, args is accessed a bit differently
      // According to your contract: event RewardsSet(address[] winners, uint256[] amounts, RewardType[] rewardTypes);
      const winners = latestEvent.args[0];    // First argument is winners array
      const amounts = latestEvent.args[1];    // Second argument is amounts array
      const rewardTypes = latestEvent.args[2]; // Third argument is rewardTypes array
      
      console.log(`Found ${winners.length} winners in the event`);
      
      // Create winners list with details
      const winnersList = [];
      
      for (let i = 0; i < winners.length; i++) {
        console.log(`Processing winner ${i+1}: ${winners[i]}`);
        
        // Check if the winner has already claimed their reward
        let rewardsClaimed = false;
        try {
          const rewards = await contract.getUserRewardsHistory(winners[i]);
          
          // Find the most recent reward for this address that matches the reward from the event
          for (let j = rewards.length - 1; j >= 0; j--) {
            if (rewards[j].amount.toString() === amounts[i].toString() && 
                rewards[j].rewardType === rewardTypes[i]) {
              rewardsClaimed = rewards[j].claimed;
              break;
            }
          }
        } catch (error) {
          console.error(`Error checking if rewards claimed for ${winners[i]}:`, error);
        }
        
        winnersList.push({
          address: winners[i],
          amount: formatEther(amounts[i]),
          rewardType: rewardTypes[i],
          rewardTypeName: getRewardTypeName(rewardTypes[i]),
          claimed: rewardsClaimed
        });
      }
      
      console.log("Prepared winners list:", winnersList.length, "winners");
      return winnersList;
    } catch (eventError) {
      console.error("Error querying events:", eventError);
      
      // As a fallback, try to query user rewards directly for a few known addresses
      console.log("Trying alternative method - direct user query");
      const winnersList = [];
      const testAddresses = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Replace with your test addresses
        "0xeB28B665C1aDBA260a5465a450398c1EaA052F08",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
      ];
      
      for (const addr of testAddresses) {
        try {
          const hasRewards = await contract.hasUnclaimedRewards(addr);
          if (hasRewards) {
            console.log(`Found rewards for ${addr}`);
            const history = await contract.getUserRewardsHistory(addr);
            for (let j = 0; j < history.length; j++) {
              if (!history[j].claimed) {
                winnersList.push({
                  address: addr,
                  amount: formatEther(history[j].amount),
                  rewardType: history[j].rewardType,
                  rewardTypeName: getRewardTypeName(history[j].rewardType),
                  claimed: false
                });
              }
            }
          }
        } catch (e) {
          console.log(`Error checking address ${addr}:`, e.message);
        }
      }
      
      return winnersList;
    }
  } catch (error) {
    console.error("Error fetching current winners:", error);
    return [];
  }
};

// // Get all current winners by filtering RewardsSet events
// export const fetchCurrentWinners = async (provider) => {
//   try {
//     const contract = new Contract(contractAddress, contractABI, provider);
    
//     // Get the latest block number
//     const latestBlock = await provider.getBlockNumber();
    
//     // Look back 1000 blocks to find the most recent RewardsSet event
//     const fromBlock = Math.max(0, latestBlock - 1000);
    
//     // Create a filter for RewardsSet events
//     const filter = contract.filters.RewardsSet();
    
//     // Query for RewardsSet events
//     console.log("Fetching RewardsSet events from block:", fromBlock, "to", latestBlock);
//     const events = await contract.queryFilter(filter, fromBlock, latestBlock);
//     console.log("Found", events.length, "RewardsSet events");

//     // If no events, return empty array
//     if (events.length === 0) {
//       return [];
//     }
    
//     // Get the most recent event
//     const latestEvent = events[events.length - 1];
//     const { winners, amounts, rewardTypes } = latestEvent.args;
    
//     // Create winners list with details
//     const winnersList = [];
    
//     for (let i = 0; i < winners.length; i++) {
//       // Check if the winner has already claimed their reward
//       let rewardsClaimed = false;
//       try {
//         const rewards = await contract.getUserRewardsHistory(winners[i]);
        
//         // Find the most recent reward for this address that matches the reward from the event
//         for (let j = rewards.length - 1; j >= 0; j--) {
//           if (rewards[j].amount.toString() === amounts[i].toString() && 
//               rewards[j].rewardType === rewardTypes[i]) {
//             rewardsClaimed = rewards[j].claimed;
//             break;
//           }
//         }
//       } catch (error) {
//         console.error("Error checking if rewards claimed:", error);
//       }
      
//       winnersList.push({
//         address: winners[i],
//         amount: formatEther(amounts[i]),
//         rewardType: rewardTypes[i],
//         rewardTypeName: getRewardTypeName(rewardTypes[i]),
//         claimed: rewardsClaimed
//       });
//     }
    
//     return winnersList;
//   } catch (error) {
//     console.error("Error fetching current winners:", error);
//     return [];
//   }
// };

// Get user's reward history
export const getUserRewardsHistory = async (contract, userAddress) => {
  try {
    const rewards = await contract.getUserRewardsHistory(userAddress);
    return rewards.map(reward => ({
      rewardType: reward.rewardType,
      rewardTypeName: getRewardTypeName(reward.rewardType),
      amount: formatEther(reward.amount),
      claimed: reward.claimed
    }));
  } catch (error) {
    console.error("Error getting user rewards history:", error);
    return [];
  }
};

// Get time until next rewards update
export const getTimeUntilNextRewards = async (contract) => {
  try {
    const timeRemaining = await contract.timeUntilNextRewards();
    return timeRemaining.toNumber();
  } catch (error) {
    console.error("Error getting time until next rewards:", error);
    return 0;
  }
};
