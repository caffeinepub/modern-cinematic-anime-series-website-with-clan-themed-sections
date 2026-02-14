export interface ClanResult {
  id: string;
  name: string;
  personality: string;
  isSecret?: boolean;
}

export const clanResults: ClanResult[] = [
  {
    id: 'moon',
    name: 'Moon Clan',
    personality: 'Calm, observant, emotionally strong, loyal to balance and hidden truth.'
  },
  {
    id: 'fire',
    name: 'Fire Clan',
    personality: 'Passionate, brave, aggressive, natural leaders and fearless fighters.'
  },
  {
    id: 'water',
    name: 'Water Clan',
    personality: 'Adaptive, intelligent, emotionally deep, strategic and patient.'
  },
  {
    id: 'sun',
    name: 'Sun Clan',
    personality: 'Charismatic, confident, inspiring, protective and honorable.'
  },
  {
    id: 'earth',
    name: 'Earth Clan',
    personality: 'Strong-willed, dependable, grounded, protective of family and tradition.'
  },
  {
    id: 'wind',
    name: 'Wind Clan',
    personality: 'Free-spirited, creative, unpredictable, fast thinkers and explorers.'
  },
  {
    id: 'lightning',
    name: 'Lightning Clan',
    personality: 'Energetic, bold, sharp-minded, quick decision makers, thrives under pressure.'
  },
  {
    id: 'balance',
    name: 'Balance Clan',
    personality: 'Extremely rare individuals capable of understanding all clans and maintaining harmony between them.',
    isSecret: true
  }
];
