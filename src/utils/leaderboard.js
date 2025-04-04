// Helper functions to calculate leaderboard statistics

// Calculate top winners by total ZETA amount
export const calculateTopWinnersByAmount = (winnersData) => {
    // Combine all days
    const allDays = ['today', 'yesterday', 'twoDaysAgo', 'threeDaysAgo'];
    const allWinners = [];
    
    allDays.forEach(day => {
      if (winnersData[day] && Array.isArray(winnersData[day])) {
        allWinners.push(...winnersData[day]);
      }
    });
    
    // Create a map to aggregate total amount by address
    const winnerAmounts = {};
    
    allWinners.forEach(winner => {
      const address = winner.address.toLowerCase();
      const amount = parseFloat(winner.amount);
      
      if (!winnerAmounts[address]) {
        winnerAmounts[address] = {
          address: winner.address,
          totalAmount: 0,
          count: 0
        };
      }
      
      winnerAmounts[address].totalAmount += amount;
      winnerAmounts[address].count += 1;
    });
    
    // Convert to array and sort by total amount
    const sortedWinners = Object.values(winnerAmounts)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 3); // Get top 3
    
    // Add badges to top 3
    const badges = ['🥇', '🥈', '🥉'];
    sortedWinners.forEach((winner, index) => {
      winner.badge = badges[index];
      winner.rank = index + 1;
    });
    
    return sortedWinners;
  };
  
  // Calculate top winners by frequency
  export const calculateTopWinnersByFrequency = (winnersData) => {
    // Combine all days
    const allDays = ['today', 'yesterday', 'twoDaysAgo', 'threeDaysAgo'];
    const allWinners = [];
    
    allDays.forEach(day => {
      if (winnersData[day] && Array.isArray(winnersData[day])) {
        allWinners.push(...winnersData[day]);
      }
    });
    
    // Create a map to count occurrences by address
    const winnerCounts = {};
    
    allWinners.forEach(winner => {
      const address = winner.address.toLowerCase();
      const amount = parseFloat(winner.amount);
      
      if (!winnerCounts[address]) {
        winnerCounts[address] = {
          address: winner.address,
          totalAmount: 0,
          count: 0
        };
      }
      
      winnerCounts[address].totalAmount += amount;
      winnerCounts[address].count += 1;
    });
    
    // Convert to array and sort by count
    const sortedWinners = Object.values(winnerCounts)
      .sort((a, b) => b.count - a.count || b.totalAmount - a.totalAmount) // Sort by count, then by amount as tiebreaker
      .slice(0, 3); // Get top 3
    
    // Add badges to top 3
    const badges = ['🥇', '🥈', '🥉'];
    sortedWinners.forEach((winner, index) => {
      winner.badge = badges[index];
      winner.rank = index + 1;
    });
    
    return sortedWinners;
  };