// src/components/Header.js
import React from 'react';
import { formatAddress, getExplorerAddressUrl } from '../utils/metamask';

const Header = ({ 
  address, 
  onConnect, 
  isConnecting, 
  isCorrectNetwork,
  onSwitchNetwork,
  userBalance,
  conversionRate
}) => {
  // ZetaChain logo
  const zetaChainLogo = "/assets/images/zetachain_avatar_green.png";
  
  // Format the conversion rate for display
  const formatConversionRate = (rate) => {
    if (rate === null || rate === undefined) {
      return "Loading...";
    }
    
    return rate.toFixed(2);
  };
  
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={zetaChainLogo} alt="ZetaChain Logo" className="zeta-logo" />
        <div className="logo-text">
          <h1>Fortune Cookie</h1>
          <p>Daily winners of ZetaChain cross-chain transactions</p>
        </div>
      </div>
      
      <div className="wallet-container">
        {address ? (
          <div className="wallet-info">
            {!isCorrectNetwork ? (
              <button 
                className="network-switch-button" 
                onClick={onSwitchNetwork}
              >
                Switch to ZetaChain Athens
              </button>
            ) : (
              <>
                <div className="wallet-balance-wrapper">
                  <div className="wallet-top-row">
                    {userBalance && (
                      <div className="balance-display">
                        {parseFloat(userBalance).toFixed(4)} rwZETA
                      </div>
                    )}
                    
                    <a 
                      href={getExplorerAddressUrl(address)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="address-display"
                    >
                      <span>{formatAddress(address)}</span>
                      <svg className="external-link-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                  
                  <div className="conversion-rate-display">
                    <span className="conversion-label">rwZETA =</span>
                    <span className="conversion-value">{formatConversionRate(conversionRate)} ZETA</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button 
            className="connect-button" 
            onClick={onConnect} 
            disabled={isConnecting}
          >
            <img 
              src="/assets/images/metamask.png" 
              alt="MetaMask" 
              className="metamask-icon"
            />
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        )}
      </div>
      
      {!isCorrectNetwork && address && (
        <div className="network-alert">
          Please switch to ZetaChain Athens testnet to interact with this application.
        </div>
      )}
    </header>
  );
};

export default Header;