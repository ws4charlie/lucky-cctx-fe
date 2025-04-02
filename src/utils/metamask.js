// src/utils/metamask.js
import { BrowserProvider } from 'ethers';

// ZetaChain Athens testnet configuration
const ZETACHAIN_TESTNET_CONFIG = {
  chainId: '0x1B59', // 7001 in hex
  chainName: 'ZetaChain Athens Testnet',
  nativeCurrency: {
    name: 'tZETA',
    symbol: 'tZETA',
    decimals: 18,
  },
  rpcUrls: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'],
  blockExplorerUrls: ['https://zetachain-testnet.blockscout.com/'],
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask and try again.");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Get the provider
    const provider = new BrowserProvider(window.ethereum);
    
    // Get the network
    const network = await provider.getNetwork();
    
    // Check if we're on ZetaChain Athens testnet
    if (network.chainId !== 7001n) { // Note the 'n' for BigInt
      try {
        await switchToZetaChain();
        // Create a new provider after switching
        const updatedProvider = new BrowserProvider(window.ethereum);
        return {
          address: accounts[0],
          provider: updatedProvider
        };
      } catch (switchError) {
        console.error("Network switch error:", switchError);
        // Even if switch fails, return the initial connection
        return {
          address: accounts[0],
          provider
        };
      }
    }
    
    return {
      address: accounts[0],
      provider
    };
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw error;
  }
};

// Helper function to switch to ZetaChain Athens testnet
export const switchToZetaChain = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ZETACHAIN_TESTNET_CONFIG.chainId }],
    });
  } catch (error) {
    // If the chain hasn't been added to MetaMask
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [ZETACHAIN_TESTNET_CONFIG],
        });
      } catch (addError) {
        throw new Error("Failed to add ZetaChain network to MetaMask: " + addError.message);
      }
    } else {
      throw error;
    }
  }
};

// Listen for account changes
export const setupAccountChangeListener = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
    
    // Return a cleanup function
    return () => {
      window.ethereum.removeListener('accountsChanged', callback);
    };
  }
  
  return () => {}; // Return a no-op cleanup function if ethereum is not available
};

// Listen for chain changes
export const setupChainChangeListener = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
      callback(chainId);
    });
    
    // Return a cleanup function
    return () => {
      window.ethereum.removeListener('chainChanged', callback);
    };
  }
  
  return () => {}; // Return a no-op cleanup function if ethereum is not available
};

// Format address for display (abbreviate)
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
};

// Get explorer URL for an address
export const getExplorerAddressUrl = (address) => {
  return `${ZETACHAIN_TESTNET_CONFIG.blockExplorerUrls[0]}address/${address}`;
};

// Get explorer URL for a transaction
export const getExplorerTxUrl = (txHash) => {
  return `${ZETACHAIN_TESTNET_CONFIG.blockExplorerUrls[0]}tx/${txHash}`;
};
