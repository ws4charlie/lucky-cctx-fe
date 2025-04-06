// src/utils/contract.js
import { formatEther, parseEther, Contract } from 'ethers';
import { CONTRACT_ADDRESS } from './ethers-provider';

// ABI for the LuckyCCTXs contract - directly from the ABI file
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "totalSupplyRWtoken",
        "type": "uint256"
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
      },
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "cctxIndices",
        "type": "string[]"
      }
    ],
    "name": "RewardsSet",
    "type": "event"
  },
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
    "name": "CurrentSupplyZeta",
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
    "name": "TotalSupplyRWtoken",
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
            "internalType": "string",
            "name": "cctxIndex",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "zetaBlock",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "chainID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "finalityTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "gasFee",
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
    "name": "lastRewardsBlock",
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
        "internalType": "string",
        "name": "cctxIndex",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "zetaBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "chainID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "finalityTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "gasFee",
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

// Get the ZETA token supply
export const getZetaSupply = async (contract) => {
  try {
    const supply = await contract.CurrentSupplyZeta();
    return supply;
  } catch (error) {
    console.error("Error getting ZETA supply:", error);
    return null;
  }
};

// Get the RW token total supply
export const getRWTokenSupply = async (contract) => {
  try {
    const supply = await contract.TotalSupplyRWtoken();
    return supply;
  } catch (error) {
    console.error("Error getting RWToken supply:", error);
    return null;
  }
};

// Calculate conversion rate
export const getConversionRate = async (contract) => {
  try {
    const zetaSupply = await getZetaSupply(contract);
    const rwTokenSupply = await getRWTokenSupply(contract);
    
    if (!zetaSupply || !rwTokenSupply || rwTokenSupply.toString() === '0') {
      return null;
    }
    
    // Convert from BigInt to string for calculation
    const zetaSupplyValue = Number(formatEther(zetaSupply));
    const rwTokenSupplyValue = Number(formatEther(rwTokenSupply));
    
    // Calculate rate
    const rate = zetaSupplyValue / rwTokenSupplyValue;
    
    return rate;
  } catch (error) {
    console.error("Error calculating conversion rate:", error);
    return null;
  }
};

// Helper function to convert reward type number to a readable name
const getRewardTypeName = (typeNumber) => {
  const types = {
    0: "Lucky CCTX",       // lucky CCTX
    1: "Finality Flash",   // fastest finality
    2: "Gas Ghost",        // lowest gas
    3: "Tortoise Trophy"   // slowest finality, previous "Patience Pioneer"
  };
  return types[typeNumber] || "Unknown";
};

// Get a contract instance with a provider
export const getContractWithSigner = async (provider) => {
  return new Contract(CONTRACT_ADDRESS, contractABI, provider);
};

// Get a contract instance without a signer (for read-only operations)
export const getContractReadOnly = (provider) => {
  return new Contract(CONTRACT_ADDRESS, contractABI, provider);
};

export const checkUnclaimedRewards = async (contract, userAddress) => {
  try {
    // Try direct call first
    const hasRewards = await contract.hasUnclaimedRewards(userAddress);
    console.log('Has unclaimed rewards:', hasRewards);
    return hasRewards;
  } catch (error) {
    console.error("Detailed error checking unclaimed rewards:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
    return false;
  }
};

export const getUnclaimedRewardsAmount = async (contract, userAddress) => {
  try {
    const amount = await contract.getUnclaimedRewards(userAddress);
    console.log('Unclaimed rewards amount:', formatEther(amount));
    return formatEther(amount);
  } catch (error) {
    console.error("Detailed error getting unclaimed rewards amount:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
    return "0";
  }
};

// Claim rewards
export const claimRewards = async (contract) => {
  try {
    // Ensure we're using the contract with a signer
    const signerContract = contract.connect(await contract.runner.provider.getSigner());
    const tx = await signerContract.claimRewards();

    // Wait for the transaction to be mined and get the receipt
    const receipt = await tx.wait();
    return {
      transactionHash: tx.hash || receipt.hash || 'Unknown',
      receipt: receipt
    };
  } catch (error) {
    console.error("Error claiming rewards:", error);
    throw error;
  }
};

// src/utils/contract.js - Updated fetchWinners function

// Fetch winners from multiple weeks
export const fetchWinners = async (provider) => {
  try {
    console.log("Fetching winners from multiple weeks...");
    const contract = new Contract(CONTRACT_ADDRESS, contractABI, provider);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log(`Latest block: ${latestBlock}`);

    const lastRewardsBlock = await contract.lastRewardsBlock();
    console.log(`Last rewards block: ${lastRewardsBlock}`)
    
    // Look back more blocks to find multiple weeks of events
    const fromBlock = Number(lastRewardsBlock) - 1000;
    const toBlock = Number(lastRewardsBlock);
    console.log(`Searching from block ${fromBlock} to ${toBlock}`);
    
    // Create a filter for RewardsSet events
    const filter = contract.filters.RewardsSet();
    
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    console.log(`Found ${events.length} RewardsSet events`);  
    
    // If no events, return empty array
    if (events.length === 0) {
      console.log("No RewardsSet events found");
      return { thisWeek: [], lastWeek: [], twoWeeksAgo: [], threeWeeksAgo: [] };
    }
    
    // Sort events by block number in descending order (newest first)
    const sortedEvents = [...events].sort((a, b) => 
      b.blockNumber - a.blockNumber
    );
    
    // Process up to 4 most recent events (thisWeek, lastWeek, twoWeeksAgo, threeWeeksAgo)
    const processedEvents = {};
    
    // Labels for each week
    const labels = ['thisWeek', 'lastWeek', 'twoWeeksAgo', 'threeWeeksAgo'];

    // Process each event (up to 4)
    for (let i = 0; i < Math.min(sortedEvents.length, 4); i++) {
      const event = sortedEvents[i];
      const week = labels[i];
      
      // Get the block timestamp to display the actual date
      const block = await provider.getBlock(event.blockNumber);
      const timestamp = block ? block.timestamp : null;
      
      // In v6, args is accessed a bit differently
      const winners = event.args[0];    // First argument is winners array
      const amounts = event.args[1];    // Second argument is amounts array
      const rewardTypes = event.args[2]; // Third argument is rewardTypes array
      const cctxIndex = event.args[3]; // Fourth argument is cctxIndex array
      
      console.log(`Found ${winners.length} winners for ${week} in event at block ${event.blockNumber}`);
      
      // Create winners list with details
      const winnersList = [];
      
      for (let j = 0; j < winners.length; j++) {
        // Check if the winner has already claimed their reward
        let rewardsClaimed = false;
        let chainID = null;
        let finalityTime = null;
        let gasFee = null;
        
        try {
          const rewards = await contract.getUserRewardsHistory(winners[j]);
          
          // Find the reward that matches this event
          for (let k = rewards.length - 1; k >= 0; k--) {
            if (Number(rewards[k].zetaBlock) === event.blockNumber) {
              rewardsClaimed = rewards[k].claimed;
              chainID = rewards[k].chainID ? Number(rewards[k].chainID) : null;
              finalityTime = rewards[k].finalityTime ? Number(rewards[k].finalityTime) : null;
              gasFee = rewards[k].gasFee ? rewards[k].gasFee.toString() : null;
              break;
            }
          }
        } catch (error) {
          console.error(`Error checking rewards for ${winners[j]}:`, error);
        }
        
        winnersList.push({
          address: winners[j],
          amount: formatEther(amounts[j]),
          rewardType: rewardTypes[j],
          rewardTypeName: getRewardTypeName(rewardTypes[j]),
          cctxIndex: cctxIndex[j],
          claimed: rewardsClaimed,
          blockNumber: event.blockNumber,
          timestamp: timestamp,
          chainID: chainID,
          finalityTime: finalityTime,
          gasFee: gasFee
        });
      }
      
      processedEvents[week] = winnersList;
    }
    
    // Fill in any missing weeks with empty arrays
    labels.forEach(label => {
      if (!processedEvents[label]) {
        processedEvents[label] = [];
      }
    });
    
    console.log("Prepared winners data:", processedEvents);
    return processedEvents;
  } catch (error) {
    console.error("Error fetching winners:", error);
    return { thisWeek: [], lastWeek: [], twoWeeksAgo: [], threeWeeksAgo: [] };
  }
};

// Get all current winners by filtering RewardsSet events
export const fetchCurrentWinners = async (provider) => {
  try {
    console.log("Fetching current winners...");
    const contract = new Contract(CONTRACT_ADDRESS, contractABI, provider);
    
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
      const cctxIndex = latestEvent.args[3]; // Fourth argument is cctxIndex array

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
            if (Number(rewards[j].zetaBlock) === latestEvent.blockNumber) {
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
          cctxIndex: cctxIndex[i],
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
        // "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Use your hardcoded test addresses
        // "0xeB28B665C1aDBA260a5465a450398c1EaA052F08",
        // "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        // "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        // "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
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
      cctxIndex: reward.cctxIndex,
      zetaBlock: reward.zetaBlock,
      claimed: reward.claimed
    }));
  } catch (error) {
    console.error("Error getting user rewards history:", error);
    return [];
  }
};
