// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { formatEther } from 'ethers';
import WinnersList from './components/WinnersList';
import { createReadOnlyProvider } from './utils/ethers-provider';
import { 
  connectWallet, 
  setupAccountChangeListener, 
  setupChainChangeListener,
  switchToZetaChain,
  isMetaMaskInstalled
} from './utils/metamask';
import {
  getContractWithSigner, 
  getContractReadOnly,
  fetchCurrentWinners,
  claimRewards,
  checkUnclaimedRewards,
  getUnclaimedRewardsAmount,
  getTimeUntilNextRewards
} from './utils/contract';
import './styles/App.css';

function App() {
  // State variables
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [winners, setWinners] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [balance, setBalance] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [timeUntilNext, setTimeUntilNext] = useState(null);

  // Handle wallet connection
  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorMessage('');
    
    try {
      const { address, provider } = await connectWallet();
      setAddress(address);
      setProvider(provider);
      
      // Get network information
      const network = await provider.getNetwork();
      const isCorrectNetwork = network.chainId === 7001n;
      setIsCorrectNetwork(isCorrectNetwork);
      
      // Get contract instance
      const contractInstance = await getContractWithSigner(provider);
      setContract(contractInstance);
      
      // Get user balance
      const balance = await provider.getBalance(address);
      setBalance(formatEther(balance));

      // If not on correct network, show switch network message
      if (!isCorrectNetwork) {
        setErrorMessage("Please switch to ZetaChain Athens network");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setErrorMessage(error.message || "Failed to connect wallet");
      // Reset connection state
      setAddress(null);
      setProvider(null);
      setContract(null);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle network switch
  const handleSwitchNetwork = async () => {
    try {
      // Attempt to switch network
      await switchToZetaChain();
      
      // If switching succeeds, reconnect
      if (provider) {
        const network = await provider.getNetwork();
        const isCorrectNetwork = network.chainId === 7001n;
        
        if (isCorrectNetwork) {
          // Refresh contract instance and balance
          const contractInstance = await getContractWithSigner(provider);
          setContract(contractInstance);
          
          const balance = await provider.getBalance(address);
          setBalance(formatEther(balance));
          
          setIsCorrectNetwork(true);
          setErrorMessage('');
        } else {
          throw new Error("Failed to switch to ZetaChain Athens");
        }
      }
    } catch (error) {
      console.error("Network switch error:", error);
      setErrorMessage(error.message || "Failed to switch network");
      
      // Reset connection if switch fails
      setAddress(null);
      setProvider(null);
      setContract(null);
    }
  };

  const loadWinners = async () => {
    setLoadingWinners(true);
    
    try {
      // Always create a read-only provider if no provider exists
      const currentProvider = provider || createReadOnlyProvider();
      
      if (!currentProvider) {
        throw new Error("Unable to create provider for fetching winners");
      }
  
      const winnersData = await fetchCurrentWinners(currentProvider);
      setWinners(winnersData);
      
      // Keep existing contract-related logic if contract exists
      if (contract) {
        try {
          // Uncomment and implement these when ready
          // const timestamp = await contract.lastRewardsTimestamp();
          // setLastUpdateTime(Number(timestamp));
          
          // const timeRemaining = await getTimeUntilNextRewards(contract);
          // setTimeUntilNext(timeRemaining);
        } catch (contractError) {
          console.error("Error reading from contract:", contractError);
        }
      }
    } catch (error) {
      console.error("Error loading winners:", error);
      setErrorMessage("Failed to load winners. Please try again.");
    } finally {
      setLoadingWinners(false);
    }
  };

  // Handle claiming rewards
  const handleClaimReward = async () => {
    if (!contract || !address || !isCorrectNetwork) {
      setErrorMessage("Please connect your wallet to ZetaChain Athens testnet first");
      return;
    }

    setIsClaimingReward(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Check if user has unclaimed rewards
      const hasRewards = await checkUnclaimedRewards(contract, address);
      
      if (!hasRewards) {
        setErrorMessage("You don't have any rewards to claim");
        return;
      }
      
      // Get reward amount
      const rewardAmount = await getUnclaimedRewardsAmount(contract, address);
      
      // Claim rewards
      const tx = await claimRewards(contract);
      
      // Show success message
      setSuccessMessage(`Successfully claimed ${rewardAmount} tZETA! Transaction hash: ${tx.transactionHash}`);
      
      // Reload winners to update the UI
      await loadWinners();
      
      // Update balance
      if (provider) {
        const newBalance = await provider.getBalance(address);
        setBalance(formatEther(newBalance));
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      setErrorMessage(error.message || "Failed to claim reward");
    } finally {
      setIsClaimingReward(false);
    }
  };

  // Setup listeners and load initial data
  useEffect(() => {
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      setErrorMessage("MetaMask is not installed. Please install MetaMask to use this application.");
      
      // Load winners even if MetaMask is not installed
      loadWinners();
      return;
    }
    
    // Setup account change listener
    const accountCleanup = setupAccountChangeListener((newAddress) => {
      setAddress(newAddress);
    });
    
    // Setup chain change listener
    const chainCleanup = setupChainChangeListener((chainId) => {
      setIsCorrectNetwork(parseInt(chainId, 16) === 7001);
    });
    
    // Always load winners first
    loadWinners();
    
    // Try to connect to MetaMask if it's already authorized
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            handleConnect();
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
    
    // Cleanup function
    return () => {
      accountCleanup();
      chainCleanup();
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh winners list periodically (every 1 minute)
  useEffect(() => {
    const interval = setInterval(() => {
      loadWinners();
    }, 60000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer for next rewards
  useEffect(() => {
    if (timeUntilNext === 0 || timeUntilNext === null) return;
    
    const interval = setInterval(() => {
      setTimeUntilNext(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Reload winners when timer reaches zero
          loadWinners();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUntilNext]);

  return (
    <div className="app">
      <Header
        address={address}
        onConnect={handleConnect}
        isConnecting={isConnecting}
        isCorrectNetwork={isCorrectNetwork}
        onSwitchNetwork={handleSwitchNetwork}
        userBalance={balance}
      />
      
      <main className="main-content">
        <h1 className="main-title">Today's Lucky CCTX Winners</h1>
        
        {timeUntilNext !== null && timeUntilNext > 0 && (
          <div className="countdown-timer">
            Next rewards update in: {formatTime(timeUntilNext)}
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
            <button className="close-button" onClick={() => setErrorMessage('')}>×</button>
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
            <button className="close-button" onClick={() => setSuccessMessage('')}>×</button>
          </div>
        )}
        
        <WinnersList
          winners={winners}
          currentUserAddress={address}
          onClaimReward={handleClaimReward}
          claimingInProgress={isClaimingReward}
          loading={loadingWinners}
          lastUpdateTime={lastUpdateTime}
        />
        
        {/* {!address && (
          <div className="connect-prompt">
            <p>Connect your MetaMask wallet to check if you're a winner and claim rewards!</p>
            <button 
              className="connect-button-large"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          </div>
        )} */}
      </main>
      
      <footer className="app-footer">
        <p>Lucky CCTX - Rewarding ZetaChain cross-chain transactions</p>
        <p className="contract-address">
          Contract: <a 
            href="https://zetachain-testnet.blockscout.com/address/0x651D44818E7B71B1C85d6dcC6AA61418E27c1a49" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            0x651D44818E7B71B1C85d6dcC6AA61418E27c1a49
          </a>
        </p>
      </footer>
    </div>
  );
}

// Helper function to format time in mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default App;