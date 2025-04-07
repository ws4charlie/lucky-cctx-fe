// src/utils/chains.js
// Centralized configuration for supported blockchain networks

export const SUPPORTED_CHAINS = {
    // Mainnet chains
    1: {
      name: 'Ethereum',
      shortName: 'ETH',
      icon: '🔷', // Alternatively, use a path to an image: '/assets/images/ethereum.svg'
      blockExplorer: 'https://etherscan.io',
      isTestnet: false,
      color: '#627EEA' // Ethereum blue
    },
    56: {
      name: 'BNB Chain',
      shortName: 'BNB',
      icon: '🟨', // Yellow square for BNB
      blockExplorer: 'https://bscscan.com',
      isTestnet: false,
      color: '#F0B90B' // Binance yellow
    },
    137: {
      name: 'Polygon',
      shortName: 'POL',
      icon: '🟣', // Purple circle for Polygon
      blockExplorer: 'https://polygonscan.com',
      isTestnet: false,
      color: '#8247E5' // Polygon purple
    },
    8453: {
      name: 'Base',
      shortName: 'ETH',
      icon: '🔵', // Blue circle for Base
      blockExplorer: 'https://basescan.org',
      isTestnet: false,
      color: '#0052FF' // Base blue
    },
    8332: {
      name: 'Bitcoin',
      shortName: 'BTC',
      icon: '₿', // Bitcoin symbol
      blockExplorer: 'https://blockstream.info',
      isTestnet: false,
      color: '#F7931A' // Bitcoin orange
    },
    7000: {
      name: 'ZetaChain',
      shortName: 'ZETA',
      icon: '', // Or use custom icon: '/assets/images/zetachain.svg' 
      blockExplorer: 'https://explorer.zetachain.com',
      isTestnet: false,
      color: '#6558FF' // ZetaChain purple
    },
    900: {  // The Solana chain ID in decimal
      name: 'Solana',
      shortName: 'SOL',
      icon: '◎',  // Solana symbol
      blockExplorer: 'https://explorer.solana.com',
      isTestnet: false,
      color: '#14F195' // Solana green
    },
    
    // Testnet chains
    11155111: {
      name: 'Sepolia',
      shortName: 'ETH',
      icon: '🔷', // Similar to ETH
      blockExplorer: 'https://sepolia.etherscan.io',
      isTestnet: true,
      color: '#627EEA' // Ethereum blue
    },
    97: {
      name: 'BNB Testnet',
      shortName: 'tBNB',
      icon: '🟨', // Yellow square for BNB
      blockExplorer: 'https://testnet.bscscan.com',
      isTestnet: true,
      color: '#F0B90B' // Binance yellow
    },
    80002: {
      name: 'Polygon Amoy',
      shortName: 'AMOY',
      icon: '🟣', // Purple circle for Polygon
      blockExplorer: 'https://amoy.polygonscan.com',
      isTestnet: true,
      color: '#8247E5' // Polygon purple
    },
    84532: {
      name: 'Base Sepolia',
      shortName: 'ETH',
      icon: '🔵', // Blue circle for Base
      blockExplorer: 'https://sepolia.basescan.org',
      isTestnet: true,
      color: '#0052FF' // Base blue
    },
    18334: {
      name: 'BTC Testnet4',
      shortName: 'tBTC',
      icon: '₿', // Bitcoin symbol
      blockExplorer: 'https://blockstream.info/testnet',
      isTestnet: true,
      color: '#F7931A' // Bitcoin orange
    },
    7001: {
      name: 'ZetaChain Athens',
      shortName: 'aZETA',
      icon: 'Z', // Or use custom icon: '/assets/images/zetachain.svg'
      blockExplorer: 'https://zetachain-testnet.blockscout.com/',
      zetaScanUrl: 'https://athens.explorer.zetachain.com/cc/',
      isTestnet: true,
      color: '#6558FF' // ZetaChain purple
    }
  };
  
  // Helper function to get chain information by ID
  export const getChainInfo = (chainId) => {
    const chainInfo = SUPPORTED_CHAINS[chainId];
    
    if (!chainInfo) {
      return {
        name: 'Unknown Chain',
        shortName: 'UNK',
        icon: '🔗',
        blockExplorer: '#',
        isTestnet: false,
        color: '#CCCCCC'
      };
    }
    
    return chainInfo;
  };
  
  // Helper function to format finality time
  export const formatFinalityTime = (seconds) => {
    if (!seconds) return 'Unknown';
    
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSecs = seconds % 60;
      return `${minutes}m ${remainingSecs}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSecs = seconds % 60;
      return `${hours}h ${minutes}m ${remainingSecs}s`;
    }
  };
  
  // Helper function to format gas fee
  export const formatGasFee = (fee, chainId) => {
    if (!fee) return 'Unknown';
    
    // Convert to a more readable format (assuming fee is in smallest unit)
    const readableFee = parseFloat(fee) / 1e18;
    
    // Get chain symbol
    const chainInfo = getChainInfo(chainId);
    
    return `${readableFee.toFixed(6)} ${chainInfo.shortName}`;
  };
  
  // Get an array of supported chain IDs for random selection
  export const getSupportedChainIds = () => {
    return Object.keys(SUPPORTED_CHAINS).map(id => parseInt(id));
  };
  
  // Get badge color based on reward type
  export const getBadgeColorForChain = (chainId) => {
    const chainInfo = getChainInfo(chainId);
    
    // Return a CSS class or style based on the chain color
    return {
      backgroundColor: `${chainInfo.color}20`, // 20% opacity of the color
      color: chainInfo.color,
      borderColor: `${chainInfo.color}40` // 40% opacity for border
    };
  };