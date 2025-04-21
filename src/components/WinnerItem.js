// src/components/WinnerItem.js
import React from 'react';
import { formatAddress, getExplorerAddressUrl, getZetaScanTxUrl } from '../utils/metamask';
import { getChainInfo, formatFinalityTime, formatGasFee } from '../utils/chains';

// Get reward type icon
export const getRewardTypeIcon = (rewardType) => {
  // we have many icons to choose from:
  // 🍀 ⚡ 👻
  // 🍪
  // 🍩
  // 🥮
  // 🍰
  // 🍫
  // 🍭
  // 🍬
  // 🫔
  // 🐢
  // ⛽️
  switch (parseInt(rewardType)) {
    case 0: // Lucky CCTX
      return '🧇'; // Lucky clover
    case 1: // Finality Flash
      return '🍪'; // Lightning bolt
    case 2: // Gas Ghost
      return '🍩'; // Ghost
    case 3: // Patience Pioneer
      return '🐢';
    default:
      return '🥇';
  }
};

const WinnerItem = ({ 
  winner, 
  isCurrentUser, 
  onClaimReward, 
  claimingInProgress 
}) => {
  // Get badge color based on reward type
  const getBadgeColor = (rewardType) => {
    switch (parseInt(rewardType)) {
      case 0: // Lucky CCTX
        return 'bg-indigo-100 text-indigo-800';
      case 1: // Finality Flash
        return 'bg-yellow-100 text-yellow-800';
      case 2: // Gas Ghost
        return 'bg-green-100 text-green-800';
      case 3: // Patience Pioneer
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get chain information
  const chainInfo = getChainInfo(winner.chainID);

  return (
    <div className={`winner-item ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="winner-info">
        <div className="winner-address-container">
          <a 
            href={getExplorerAddressUrl(winner.address)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="winner-address"
          >
            {formatAddress(winner.address)}
          </a>
          {isCurrentUser && <span className="you-badge">You</span>}
        </div>
        
        <div className="winner-reward-details">
          <div className="reward-badges">
            <span className={`reward-type-badge ${getBadgeColor(winner.rewardType)}`}>
              {getRewardTypeIcon(winner.rewardType)} {winner.rewardTypeName}
            </span>
            
            {winner.chainID && (
              <span 
                className="chain-badge"
                style={{
                  backgroundColor: `${chainInfo.color}15`,
                  color: chainInfo.color,
                  border: `1px solid ${chainInfo.color}30`
                }}
              >
                {chainInfo.icon} {chainInfo.name}
              </span>
            )}
          </div>
          
          <div className="winner-amount">rewards: {winner.amount} ZETA</div>
          
          {/* Additional details section */}
          <div className="winner-additional-details">
            {(winner.finalityTime && (parseInt(winner.rewardType) === 1 || parseInt(winner.rewardType) === 3)) && (
              <div className="detail-item detail-full-width">
                <span className="detail-label">Finality:</span>
                <span className="detail-value">{formatFinalityTime(winner.finalityTime)}</span>
              </div>
            )}
            
            {(winner.gasFee && parseInt(winner.rewardType) === 2) && (
              <div className="detail-item detail-full-width">
                <span className="detail-label">Gas Fee:</span>
                <span className="detail-value">{formatGasFee(winner.gasFee, winner.chainID)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Transaction Link - Now last */}
        {winner.cctxIndex && (
          <div className="transaction-link-container">
            <a 
              href={getZetaScanTxUrl(winner.cctxIndex)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="transaction-link"
            >
              View Transaction
            </a>
          </div>
        )}
      </div>
      
      {isCurrentUser && !winner.claimed && (
        <button 
          className="claim-button" 
          onClick={() => onClaimReward(winner)}
          disabled={claimingInProgress}
        >
          {claimingInProgress ? 'Claiming...' : 'Claim Reward'}
        </button>
      )}
      
      {winner.claimed && (
        <div className="claimed-badge">
          ✓ Claimed
        </div>
      )}
    </div>
  );
};

export default WinnerItem;