// src/components/LeaderboardView.js
import React from 'react';
import { formatAddress, getExplorerAddressUrl } from '../utils/metamask';

const LeaderboardView = ({ 
  topWinnersByAmount, 
  topWinnersByFrequency, 
  currentUserAddress 
}) => {
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-section">
        <h3 className="leaderboard-title">Top Fortune Winners</h3>
        <div className="leaderboard-grid">
          {topWinnersByAmount.length > 0 ? (
            topWinnersByAmount.map((winner) => (
              <div 
                key={`amount-${winner.address}`} 
                className={`leaderboard-item ${winner.address.toLowerCase() === currentUserAddress?.toLowerCase() ? 'current-user' : ''}`}
              >
                <div className="leaderboard-rank">
                  <span className="rank-badge">{winner.badge}</span>
                </div>
                <div className="leaderboard-details">
                  <div className="leaderboard-address-container">
                    <a 
                      href={getExplorerAddressUrl(winner.address)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="leaderboard-address"
                    >
                      {formatAddress(winner.address)}
                    </a>
                    {winner.address.toLowerCase() === currentUserAddress?.toLowerCase() && (
                      <span className="you-badge-leaderboard">You</span>
                    )}
                  </div>
                  <div className="leaderboard-value">
                    <strong>Total: {winner.totalAmount.toFixed(6)} ZETA</strong>
                  </div>
                  <div className="leaderboard-subvalue">
                    Won {winner.count} {winner.count === 1 ? 'time' : 'times'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="leaderboard-empty">No winners data available</div>
          )}
        </div>
      </div>
      
      <div className="leaderboard-section">
        <h3 className="leaderboard-title">Top Frequent Winners</h3>
        <div className="leaderboard-grid">
          {topWinnersByFrequency.length > 0 ? (
            topWinnersByFrequency.map((winner) => (
              <div 
                key={`frequency-${winner.address}`} 
                className={`leaderboard-item ${winner.address.toLowerCase() === currentUserAddress?.toLowerCase() ? 'current-user' : ''}`}
              >
                <div className="leaderboard-rank">
                  <span className="rank-badge">{winner.badge}</span>
                </div>
                <div className="leaderboard-details">
                  <div className="leaderboard-address-container">
                    <a 
                      href={getExplorerAddressUrl(winner.address)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="leaderboard-address"
                    >
                      {formatAddress(winner.address)}
                    </a>
                    {winner.address.toLowerCase() === currentUserAddress?.toLowerCase() && (
                      <span className="you-badge-leaderboard">You</span>
                    )}
                  </div>
                  <div className="leaderboard-value">
                    <strong>Won {winner.count} {winner.count === 1 ? 'time' : 'times'}</strong>
                  </div>
                  <div className="leaderboard-subvalue">
                    Total: {winner.totalAmount.toFixed(6)} ZETA
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="leaderboard-empty">No winners data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;