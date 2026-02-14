export interface PowerType {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface AbilityRule {
  id: string;
  title: string;
  description: string;
}

export interface ForbiddenTechnique {
  id: string;
  name: string;
  description: string;
  reason: string;
}

export interface CharacterAbility {
  characterName: string;
  clanAffiliation: string;
  abilities: string[];
  specialTechnique?: string;
}

export const powerTypes: PowerType[] = [
  {
    id: 'elemental',
    name: 'Elemental Manipulation',
    description: 'The ability to control and shape natural elements based on clan affiliation.',
    examples: ['Fire Generation', 'Water Shaping', 'Earth Control', 'Wind Manipulation', 'Lightning Channeling']
  },
  {
    id: 'lunar',
    name: 'Lunar Arts',
    description: 'Moon Clan exclusive powers that draw strength from lunar cycles and manipulate perception.',
    examples: ['Illusion Casting', 'Shadow Walking', 'Dream Weaving', 'Moonlight Empowerment']
  },
  {
    id: 'solar',
    name: 'Solar Arts',
    description: 'Sun Clan exclusive powers that harness radiant energy and divine light.',
    examples: ['Light Projection', 'Purification', 'Solar Empowerment', 'Radiant Healing']
  },
  {
    id: 'enhancement',
    name: 'Physical Enhancement',
    description: 'Techniques that augment physical capabilities beyond normal limits.',
    examples: ['Strength Amplification', 'Speed Boost', 'Durability Enhancement', 'Sensory Expansion']
  },
  {
    id: 'spiritual',
    name: 'Spiritual Connection',
    description: 'The ability to sense and interact with spiritual energy and life force.',
    examples: ['Energy Sensing', 'Spirit Communication', 'Life Force Manipulation', 'Aura Reading']
  }
];

export const abilityRules: AbilityRule[] = [
  {
    id: 'rule1',
    title: 'Clan Affinity Limitation',
    description: 'Each individual can only master abilities aligned with their birth clan. Cross-clan techniques require years of training and are significantly weaker.'
  },
  {
    id: 'rule2',
    title: 'Energy Depletion',
    description: 'All abilities consume spiritual energy. Overuse leads to exhaustion, unconsciousness, or in extreme cases, permanent damage to one\'s energy channels.'
  },
  {
    id: 'rule3',
    title: 'Environmental Influence',
    description: 'Powers are stronger in environments matching the clan element. Fire techniques weaken in water, lightning is dangerous in storms, etc.'
  },
  {
    id: 'rule4',
    title: 'Emotional Resonance',
    description: 'Strong emotions can amplify or destabilize abilities. Rage empowers Fire Clan, fear weakens Moon Clan, despair disrupts Water Clan techniques.'
  },
  {
    id: 'rule5',
    title: 'Technique Mastery Stages',
    description: 'Abilities progress through stages: Awakening (basic use), Refinement (controlled power), Mastery (advanced techniques), and Transcendence (legendary level).'
  },
  {
    id: 'rule6',
    title: 'Balance Principle',
    description: 'The natural world maintains equilibrium. Excessive use of one element in an area will attract its opposing force, creating dangerous imbalances.'
  }
];

export const forbiddenTechniques: ForbiddenTechnique[] = [
  {
    id: 'forbidden1',
    name: 'Soul Severance',
    description: 'A technique that permanently separates a person\'s spirit from their body, leaving them as an empty shell.',
    reason: 'Banned after the Great War. Considered the ultimate violation of life itself. Practitioners are hunted by all clans.'
  },
  {
    id: 'forbidden2',
    name: 'Eclipse Convergence',
    description: 'Combines Moon and Sun clan powers during an eclipse to tear rifts in reality itself.',
    reason: 'Caused the Cataclysm of the Third Age. Only three people ever mastered it; all three died using it.'
  },
  {
    id: 'forbidden3',
    name: 'Blood Binding',
    description: 'Forces another person to obey commands by corrupting their life force with the caster\'s blood.',
    reason: 'Strips free will and slowly kills both the victim and caster. Outlawed by the Council of Seven.'
  },
  {
    id: 'forbidden4',
    name: 'Elemental Fusion',
    description: 'Merges multiple elemental powers into unstable hybrid attacks of devastating power.',
    reason: 'Extremely volatile. Most attempts result in catastrophic explosions. Survivors suffer permanent energy corruption.'
  },
  {
    id: 'forbidden5',
    name: 'Ancestral Possession',
    description: 'Summons the spirit of a deceased ancestor to temporarily possess the user, granting their full power.',
    reason: 'The ancestor often refuses to leave, trapping the user\'s consciousness. Many practitioners never regain control.'
  }
];

export const characterAbilities: CharacterAbility[] = [
  {
    characterName: 'Harusuke',
    clanAffiliation: 'Moon Clan',
    abilities: ['Shadow Manipulation', 'Illusion Casting', 'Enhanced Perception', 'Moonlight Empowerment'],
    specialTechnique: 'Lunar Eclipse: Creates a field of absolute darkness where only the user can see'
  },
  {
    characterName: 'Aurelian',
    clanAffiliation: 'Sun Clan',
    abilities: ['Light Projection', 'Solar Healing', 'Radiant Barrier', 'Dawn\'s Blessing'],
    specialTechnique: 'Solar Flare: Releases a blinding burst of purifying light that burns away darkness'
  },
  {
    characterName: 'Kael',
    clanAffiliation: 'Fire Clan',
    abilities: ['Flame Generation', 'Heat Manipulation', 'Explosive Strikes', 'Fire Immunity'],
    specialTechnique: 'Inferno Rage: Transforms rage into an uncontrollable firestorm'
  },
  {
    characterName: 'Marina',
    clanAffiliation: 'Water Clan',
    abilities: ['Water Shaping', 'Healing Waters', 'Tidal Force', 'Mist Concealment'],
    specialTechnique: 'Ocean\'s Embrace: Creates a massive wave that can heal allies or crush enemies'
  },
  {
    characterName: 'Zephyr',
    clanAffiliation: 'Wind Clan',
    abilities: ['Wind Manipulation', 'Flight', 'Sonic Speed', 'Air Blade Creation'],
    specialTechnique: 'Tempest Dance: Becomes one with the wind, moving at impossible speeds'
  },
  {
    characterName: 'Terra',
    clanAffiliation: 'Earth Clan',
    abilities: ['Stone Manipulation', 'Seismic Sense', 'Earth Armor', 'Mountain\'s Endurance'],
    specialTechnique: 'Titan\'s Stand: Roots into the earth, becoming immovable and gaining immense strength'
  },
  {
    characterName: 'Volt',
    clanAffiliation: 'Lightning Clan',
    abilities: ['Lightning Generation', 'Electric Speed', 'Nervous System Enhancement', 'Thunder Strike'],
    specialTechnique: 'Storm\'s Fury: Channels lightning through their body for devastating speed and power'
  }
];
