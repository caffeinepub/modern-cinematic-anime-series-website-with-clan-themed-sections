/**
 * Badge data structures and definitions
 * Matches the backend UserBadge type
 */

export interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  unlockType: 'characterMatch' | 'clanLoyalty' | 'secretCombo';
  unlockCondition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  badgeId: string;
  earnedAt: number;
}

/**
 * Sample badge definitions
 * These should match the backend badge definitions
 */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'clan_moon',
    name: 'Moon Clan Loyalty',
    emoji: '🌙',
    tagline: 'Sworn to the Moon',
    unlockType: 'clanLoyalty',
    unlockCondition: 'Complete the Clan Quiz and match with Moon Clan',
    rarity: 'common',
  },
  {
    id: 'clan_sun',
    name: 'Sun Clan Loyalty',
    emoji: '☀️',
    tagline: 'Blessed by the Sun',
    unlockType: 'clanLoyalty',
    unlockCondition: 'Complete the Clan Quiz and match with Sun Clan',
    rarity: 'common',
  },
  {
    id: 'clan_water',
    name: 'Water Clan Loyalty',
    emoji: '💧',
    tagline: 'Flow like Water',
    unlockType: 'clanLoyalty',
    unlockCondition: 'Complete the Clan Quiz and match with Water Clan',
    rarity: 'common',
  },
  {
    id: 'clan_fire',
    name: 'Fire Clan Loyalty',
    emoji: '🔥',
    tagline: 'Burning Bright',
    unlockType: 'clanLoyalty',
    unlockCondition: 'Complete the Clan Quiz and match with Fire Clan',
    rarity: 'common',
  },
  {
    id: 'clan_earth',
    name: 'Earth Clan Loyalty',
    emoji: '🌍',
    tagline: 'Grounded and Strong',
    unlockType: 'clanLoyalty',
    unlockCondition: 'Complete the Clan Quiz and match with Earth Clan',
    rarity: 'common',
  },
  {
    id: 'clan_lightning',
    name: 'Lightning Clan Loyalty',
    emoji: '⚡',
    tagline: 'Swift as Lightning',
    unlockType: 'clanLoyalty',
    unlockCondition: 'Complete the Clan Quiz and match with Lightning Clan',
    rarity: 'common',
  },
  {
    id: 'clan_balance',
    name: 'Balance Clan Loyalty',
    emoji: '⚖️',
    tagline: 'Keeper of Balance',
    unlockType: 'clanLoyalty',
    unlockCondition: 'Complete the Clan Quiz and match with Balance Clan',
    rarity: 'legendary',
  },
  {
    id: 'character_kazeyori',
    name: 'Kazeyori Match',
    emoji: '🗡️',
    tagline: 'Soul Resonance with Kazeyori',
    unlockType: 'characterMatch',
    unlockCondition: 'Complete the Character Affinity Matcher and match with Kazeyori',
    rarity: 'rare',
  },
  {
    id: 'character_haruna',
    name: 'Haruna Match',
    emoji: '🌊',
    tagline: 'Soul Resonance with Haruna',
    unlockType: 'characterMatch',
    unlockCondition: 'Complete the Character Affinity Matcher and match with Haruna',
    rarity: 'rare',
  },
];

/**
 * Get badge definition by ID
 */
export function getBadgeById(badgeId: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(badge => badge.id === badgeId);
}

/**
 * Get all badges of a specific rarity
 */
export function getBadgesByRarity(rarity: BadgeDefinition['rarity']): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(badge => badge.rarity === rarity);
}

/**
 * Get all badges of a specific unlock type
 */
export function getBadgesByUnlockType(unlockType: BadgeDefinition['unlockType']): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(badge => badge.unlockType === unlockType);
}
