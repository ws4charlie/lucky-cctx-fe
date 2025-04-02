// src/components/WinnersList.js
import React, { useState } from 'react';
import WinnerItem from './WinnerItem';

const WinnersList = ({ 
  winners, 
  currentUserAddress, 
  onClaimReward, 
  claimingInProgress,
  loading,
  lastUpdateTime
}) => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Group winners by reward type
  const winnersByType = winners.reduce((acc, winner) => {
    const typeId = winner.rewardType.toString();
    if (!acc[typeId]) {
      acc[typeId] = [];
    }
    acc[typeId].push(winner);
    return acc;
  }, {});
  
  // Filtered winners based on active tab
  const getFilteredWinners = () => {
    if (activeTab === 'all') {
      return winners;
    }
    return winnersByType[activeTab] || [];
  };
  
  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="winners-loading">
        <div className="loader"></div>
        <p>Loading winners...</p>
      </div>
    );
  }
  
  if (winners.length === 0) {
    return (
      <div className="no-winners">
        <div className="empty-state-icon">🏆</div>
        <h3>No winners announced yet</h3>
        <p>The next round of winners will be announced soon. Check back later!</p>
      </div>
    );
  }
  
  return (
    <div className="winners-container">
      {lastUpdateTime && (
        <div className="last-update-time">
          Last updated: {formatTimestamp(lastUpdateTime)}
        </div>
      )}
      
      <div className="winners-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Winners
        </button>
        
        {Object.keys(winnersByType).map(typeId => {
          const typeName = winnersByType[typeId][0].rewardTypeName;
          const count = winnersByType[typeId].length;
          const icon = getRewardTypeIcon(parseInt(typeId));
          
          return (
            <button 
              key={typeId}
              className={`tab-button ${activeTab === typeId ? 'active' : ''}`}
              onClick={() => setActiveTab(typeId)}
            >
              {icon} {typeName} ({count})
            </button>
          );
        })}
      </div>
      
      <div className="winners-list-grid">
        {getFilteredWinners().map((winner, index) => (
          <WinnerItem
            key={`${winner.address}-${index}`}
            winner={winner}
            isCurrentUser={currentUserAddress?.toLowerCase() === winner.address.toLowerCase()}
            onClaimReward={onClaimReward}
            claimingInProgress={claimingInProgress}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to get icon for reward type
function getRewardTypeIcon(rewardType) {
  switch (parseInt(rewardType)) {
    case 0: // Lucky CCTX
      return '🍀';
    case 1: // Finality Flash
      return '⚡';
    case 2: // Gas Ghost
      return '👻';
    default:
      return '🏆';
  }
}

export default WinnersList;