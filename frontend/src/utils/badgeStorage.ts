/**
 * LocalStorage utilities for badge persistence
 * Stores unlocked badge IDs for cross-session persistence
 */

const BADGE_STORAGE_KEY = 'wotm_unlocked_badges';

export interface BadgeProgress {
  unlockedBadgeIds: string[];
  lastUpdated: number;
}

/**
 * Save unlocked badge IDs to localStorage
 */
export function saveBadgeProgress(badgeIds: string[]): void {
  try {
    const progress: BadgeProgress = {
      unlockedBadgeIds: badgeIds,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save badge progress:', error);
  }
}

/**
 * Load unlocked badge IDs from localStorage
 */
export function loadBadgeProgress(): string[] {
  try {
    const stored = localStorage.getItem(BADGE_STORAGE_KEY);
    if (!stored) return [];
    
    const progress: BadgeProgress = JSON.parse(stored);
    return progress.unlockedBadgeIds || [];
  } catch (error) {
    console.error('Failed to load badge progress:', error);
    return [];
  }
}

/**
 * Check if a specific badge is unlocked
 */
export function isBadgeUnlocked(badgeId: string): boolean {
  const unlockedBadges = loadBadgeProgress();
  return unlockedBadges.includes(badgeId);
}

/**
 * Add a new badge to the unlocked list
 */
export function unlockBadge(badgeId: string): void {
  const currentBadges = loadBadgeProgress();
  if (!currentBadges.includes(badgeId)) {
    saveBadgeProgress([...currentBadges, badgeId]);
  }
}

/**
 * Clear all badge progress (useful on logout)
 */
export function clearBadgeProgress(): void {
  try {
    localStorage.removeItem(BADGE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear badge progress:', error);
  }
}
