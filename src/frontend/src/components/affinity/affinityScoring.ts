import { CharacterScores, CharacterId, CharacterMatch } from './affinityTypes';

export function initializeCharacterScores(): CharacterScores {
  return {
    kazeyori: 0,
    haruna: 0,
    sankei: 0,
    aurelian: 0,
    harusuke: 0,
    mizuki: 0,
    kaze: 0,
    volt: 0,
    iwagami: 0
  };
}

export function calculateCharacterMatch(scores: CharacterScores): CharacterMatch {
  const entries = Object.entries(scores) as [CharacterId, number][];
  
  // Sort by score descending
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  
  const highestScore = sorted[0][1];
  
  // Check for ties in top scores
  const tiedForFirst = sorted.filter(([_, score]) => score === highestScore);
  
  let matchedCharacter: CharacterId;
  
  if (tiedForFirst.length > 1) {
    // Deterministic tie-break: alphabetical order
    const tiedIds = tiedForFirst.map(([id]) => id).sort();
    matchedCharacter = tiedIds[0];
  } else {
    matchedCharacter = sorted[0][0];
  }
  
  // Calculate Soul Resonance percentage (0-100)
  // Based on: (highest score / theoretical max) * 100
  // Theoretical max: 10 questions * 3 points = 30
  const theoreticalMax = 30;
  const rawPercentage = (highestScore / theoreticalMax) * 100;
  
  // Add bonus for consistency (how close second place is)
  const secondHighest = sorted[1][1];
  const consistency = highestScore - secondHighest;
  const consistencyBonus = Math.min(consistency * 2, 15); // Up to 15% bonus
  
  // Calculate final resonance, clamped to 0-100
  const soulResonance = Math.min(100, Math.max(0, Math.round(rawPercentage + consistencyBonus)));
  
  return {
    characterId: matchedCharacter,
    soulResonance
  };
}
