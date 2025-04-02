// src/utils/ethers-provider.js
import { ethers } from 'ethers';

// ZetaChain Athens testnet RPC URL
const ZETACHAIN_RPC_URL = 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public';

// Create a read-only provider for ZetaChain Athens testnet
export const createReadOnlyProvider = () => {
  try {
    // Use the JsonRpcProvider directly
    return new ethers.JsonRpcProvider(ZETACHAIN_RPC_URL, {
      name: 'ZetaChain Athens',
      chainId: 7001
    });
  } catch (error) {
    console.error('Error creating read-only provider:', error);
    return null;
  }
};
