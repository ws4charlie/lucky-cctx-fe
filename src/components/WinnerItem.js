// src/components/WinnerItem.js
import React from 'react';
import { formatAddress, getExplorerAddressUrl } from '../utils/metamask';

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
  switch (parseInt(rewardType)) {
    case 0: // Lucky CCTX
      return '🧇'; // Lucky clover
    case 1: // Finality Flash
      return '🍪'; // Lightning bolt
    case 2: // Gas Ghost
      return '🍩'; // Ghost
    default:
      return '🥮';
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <span className={`reward-type-badge ${getBadgeColor(winner.rewardType)}`}>
            {getRewardTypeIcon(winner.rewardType)} {winner.rewardTypeName}
          </span>
          <div className="winner-amount">{winner.amount} ZETA</div>
        </div>
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