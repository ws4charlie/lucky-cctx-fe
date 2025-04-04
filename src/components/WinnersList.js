// src/components/WinnersList.js
import React, { useState, useMemo } from 'react';
import WinnerItem, { getRewardTypeIcon } from './WinnerItem';
import LeaderboardView from './LeaderboardView';
import { calculateTopWinnersByAmount, calculateTopWinnersByFrequency } from '../utils/leaderboard';

const WinnersList = ({ 
  winners, 
  currentUserAddress, 
  onClaimReward, 
  claimingInProgress,
  loading,
  lastUpdateTime
}) => {
  const [activeTab, setActiveTab] = useState('leaderboard'); // Default to leaderboard
  
  // Destructure winners by day
  const { today = [], yesterday = [], twoDaysAgo = [], threeDaysAgo = [] } = winners;
  
  // All winners combined
  const allWinners = [...today, ...yesterday, ...twoDaysAgo, ...threeDaysAgo];
  
  // Calculate leaderboard data - memoized to prevent recalculation on every render
  const topWinnersByAmount = useMemo(() => 
    calculateTopWinnersByAmount(winners), 
    [winners]
  );
  
  const topWinnersByFrequency = useMemo(() => 
    calculateTopWinnersByFrequency(winners), 
    [winners]
  );
  
  // Group all winners by reward type
  const winnersByType = allWinners.reduce((acc, winner) => {
    const typeId = winner.rewardType.toString();
    if (!acc[typeId]) {
      acc[typeId] = [];
    }
    acc[typeId].push(winner);
    return acc;
  }, {});
  
  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  // Get human-readable day label
  const getDayLabel = (day) => {
    switch(day) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'twoDaysAgo': return 'Two Days Ago';
      case 'threeDaysAgo': return 'Three Days Ago';
      default: return day;
    }
  };
  
  // Filtered winners based on active tab
  const getFilteredWinners = () => {
    if (activeTab === 'all') {
      return { today, yesterday, twoDaysAgo, threeDaysAgo };
    }
    
    if (activeTab === 'leaderboard') {
      return { today, yesterday, twoDaysAgo, threeDaysAgo };
    }
    
    // Filter winners of the selected type for each day
    const filteredToday = today.filter(winner => winner.rewardType.toString() === activeTab);
    const filteredYesterday = yesterday.filter(winner => winner.rewardType.toString() === activeTab);
    const filteredTwoDaysAgo = twoDaysAgo.filter(winner => winner.rewardType.toString() === activeTab);
    const filteredThreeDaysAgo = threeDaysAgo.filter(winner => winner.rewardType.toString() === activeTab);

    return {
      today: filteredToday,
      yesterday: filteredYesterday,
      twoDaysAgo: filteredTwoDaysAgo,
      threeDaysAgo: filteredThreeDaysAgo
    };
  };
  
  if (loading) {
    return (
      <div className="winners-loading">
        <div className="loader"></div>
        <p>Loading winners...</p>
      </div>
    );
  }
  
  if (allWinners.length === 0 && !loading) {
    return (
      <div className="no-winners">
        <div className="empty-state-icon">🏆</div>
        <h3>No winners announced yet</h3>
        <p>The next round of winners will be announced soon. Check back later!</p>
      </div>
    );
  }
  
  const filteredWinners = getFilteredWinners();
  
  return (
    <div className="winners-container">
      {lastUpdateTime && (
        <div className="last-update-time">
          Last updated: {formatTimestamp(lastUpdateTime)}
        </div>
      )}
      
      <div className="winners-tabs">
        <button 
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
        
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
      
      {/* Leaderboard View */}
      {activeTab === 'leaderboard' && (
        <LeaderboardView 
          topWinnersByAmount={topWinnersByAmount}
          topWinnersByFrequency={topWinnersByFrequency}
          currentUserAddress={currentUserAddress}
        />
      )}
      
      {/* Regular Winners View for other tabs */}
      {activeTab !== 'leaderboard' && (
        <div className="winners-by-day">
          {['today', 'yesterday', 'twoDaysAgo', 'threeDaysAgo'].map(day => {
            const dayWinners = filteredWinners[day] || [];
            
            // Skip if no winners for this day
            if (dayWinners.length === 0) return null;
            
            return (
              <div key={day} className="day-winners-section">
                <h3 className="day-heading">Winners {getDayLabel(day)}</h3>
                
                <div className="winners-list-grid">
                  {dayWinners.map((winner, index) => (
                    <WinnerItem
                      key={`${winner.address}-${day}-${index}`}
                      winner={winner}
                      isCurrentUser={currentUserAddress?.toLowerCase() === winner.address.toLowerCase()}
                      onClaimReward={onClaimReward}
                      claimingInProgress={claimingInProgress}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WinnersList;