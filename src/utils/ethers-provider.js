// src/utils/ethers-provider.js
import { ethers } from 'ethers';

export const ZETACHAIN_CHAIN_ID = 7000n;
export const ZETACHAIN_CHAIN_ID_DEC = 7000;
export const ZETACHAIN_CHAIN_ID_HEX = '0x1B58'; // 7000 in hex
export const CONTRACT_ADDRESS = '0x0840E50eacBCF898B09Bd386A55E92E981835F91';

// ZetaChain network configuration
export const ZETACHAIN_CONFIG = {
  chainId: ZETACHAIN_CHAIN_ID_DEC,
  chainIdHex: ZETACHAIN_CHAIN_ID_HEX,
  name: 'ZetaChain Mainnet',
  rpcUrl: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
  blockExplorer: 'https://zetachain.blockscout.com/',
  zetaScanUrl: 'https://explorer.zetachain.com/cc/'
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
