// src/components/Header.js
import React from 'react';
import { formatAddress, getExplorerAddressUrl } from '../utils/metamask';

const Header = ({ 
  address, 
  onConnect, 
  isConnecting, 
  isCorrectNetwork,
  onSwitchNetwork,
  userBalance
}) => {
  // ZetaChain logo - can be replaced with actual logo URL
  //const zetaChainLogo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_HUxQ2Zk-zP20iJZfD5e1B8YYn9fJib8MtXyJbI17pQ&s";
  const zetaChainLogo = "/assets/images/zetachain_avatar_green.png";
  
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={zetaChainLogo} alt="ZetaChain Logo" className="zeta-logo" />
        <div className="logo-text">
          <h1>Fortune Cookie</h1>
          <p>Weekly winners of ZetaChain cross-chain transactions</p>
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
                {userBalance && (
                  <div className="balance-display">
                    {parseFloat(userBalance).toFixed(4)} ZETA
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