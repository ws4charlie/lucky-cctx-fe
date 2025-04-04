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
  
  // Destructure winners by week
  const { thisWeek = [], lastWeek = [], twoWeeksAgo = [], threeWeeksAgo = [] } = winners;
  
  // All winners combined
  const allWinners = [...thisWeek, ...lastWeek, ...twoWeeksAgo, ...threeWeeksAgo];
  
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
  
  // Get human-readable week label
  const getWeekLabel = (week) => {
    switch(week) {
      case 'thisWeek': return 'This Week';
      case 'lastWeek': return 'Last Week';
      case 'twoWeeksAgo': return 'Two Weeks Ago';
      case 'threeWeeksAgo': return 'Three Weeks Ago';
      default: return week;
    }
  };
  
  // Filtered winners based on active tab
  const getFilteredWinners = () => {
    if (activeTab === 'all') {
      return { thisWeek, lastWeek, twoWeeksAgo, threeWeeksAgo };
    }
    
    if (activeTab === 'leaderboard') {
      return { thisWeek, lastWeek, twoWeeksAgo, threeWeeksAgo };
    }
    
    // Filter winners of the selected type for each week
    const filteredThisWeek = thisWeek.filter(winner => winner.rewardType.toString() === activeTab);
    const filteredLastWeek = lastWeek.filter(winner => winner.rewardType.toString() === activeTab);
    const filteredTwoWeeksAgo = twoWeeksAgo.filter(winner => winner.rewardType.toString() === activeTab);
    const filteredThreeWeeksAgo = threeWeeksAgo.filter(winner => winner.rewardType.toString() === activeTab);

    return {
      thisWeek: filteredThisWeek,
      lastWeek: filteredLastWeek,
      twoWeeksAgo: filteredTwoWeeksAgo,
      threeWeeksAgo: filteredThreeWeeksAgo
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
        <div className="winners-by-week">
          {['thisWeek', 'lastWeek', 'twoWeeksAgo', 'threeWeeksAgo'].map(week => {
            const weekWinners = filteredWinners[week] || [];
            
            // Skip if no winners for this week
            if (weekWinners.length === 0) return null;
            
            return (
              <div key={week} className="week-winners-section">
                <h3 className="week-heading">Winners {getWeekLabel(week)}</h3>
                
                <div className="winners-list-grid">
                  {weekWinners.map((winner, index) => (
                    <WinnerItem
                      key={`${winner.address}-${week}-${index}`}
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