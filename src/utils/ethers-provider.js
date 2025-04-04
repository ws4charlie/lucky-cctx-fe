// src/utils/ethers-provider.js
import { ethers } from 'ethers';

export const ZETACHAIN_CHAIN_ID = 7001n;
export const ZETACHAIN_CHAIN_ID_DEC = 7001;
export const ZETACHAIN_CHAIN_ID_HEX = '0x1B59';
export const CONTRACT_ADDRESS = '0xd54b34AFCf923Ada37c1fCb7C662E637254351a6';

// ZetaChain network configuration
export const ZETACHAIN_CONFIG = {
  chainId: ZETACHAIN_CHAIN_ID_DEC,
  chainIdHex: ZETACHAIN_CHAIN_ID_HEX, // 7001 in hex
  name: 'ZetaChain Testnet',
  rpcUrl: 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public',
  blockExplorer: 'https://zetachain-testnet.blockscout.com/',
  zetaScanUrl: 'https://athens.explorer.zetachain.com/cc/'
};

// Create a read-only provider for ZetaChain
export const createReadOnlyProvider = () => {
  try {
    // Use the JsonRpcProvider directly
    return new ethers.JsonRpcProvider(ZETACHAIN_CONFIG.rpcUrl, {
      name: ZETACHAIN_CONFIG.name,
      chainId: ZETACHAIN_CONFIG.chainId
    });
  } catch (error) {
    console.error('Error creating read-only provider:', error);
    return null;
  }
};
