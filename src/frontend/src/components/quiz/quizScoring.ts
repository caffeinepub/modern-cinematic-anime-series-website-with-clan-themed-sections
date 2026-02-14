export interface ClanScores {
  moon: number;
  fire: number;
  water: number;
  sun: number;
  earth: number;
  wind: number;
  lightning: number;
}

export function initializeScores(): ClanScores {
  return {
    moon: 0,
    fire: 0,
    water: 0,
    sun: 0,
    earth: 0,
    wind: 0,
    lightning: 0
  };
}

export function calculateResult(scores: ClanScores): string {
  const entries = Object.entries(scores) as [keyof ClanScores, number][];
  
  // Sort by score descending
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  
  const highestScore = sorted[0][1];
  const secondHighest = sorted[1][1];
  const thirdHighest = sorted[2][1];
  
  // Check for Balance Clan (rare outcome)
  // Balance requires: top 3 scores are close (within 3 points) AND all scores are reasonably high
  const topThreeClose = (highestScore - thirdHighest) <= 3;
  const allScoresReasonable = sorted.every(([_, score]) => score >= 3);
  const highOverallScore = highestScore >= 12;
  
  if (topThreeClose && allScoresReasonable && highOverallScore) {
    return 'balance';
  }
  
  // Check for ties in top scores
  const tiedForFirst = sorted.filter(([_, score]) => score === highestScore);
  
  if (tiedForFirst.length > 1) {
    // If there's a tie, pick the first one alphabetically for consistency
    const tiedIds = tiedForFirst.map(([id]) => id).sort();
    return tiedIds[0];
  }
  
  // Return the clan with highest score
  return sorted[0][0];
}
