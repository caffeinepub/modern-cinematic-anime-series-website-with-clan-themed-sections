export interface Character {
  id: string;
  name: string;
  clan: string;
  personality: string;
  power: string;
  role: string;
}

export const characters: Character[] = [
  {
    id: 'harusuke',
    name: 'Harusuke',
    clan: 'Moon Clan',
    personality: 'A stoic and disciplined warrior with unwavering loyalty to the Moon Clan. Harusuke carries the weight of ancient traditions and seeks to protect the balance between light and shadow.',
    power: 'Master of lunar illusions and shadow manipulation. Can create mirror images and bend moonlight to confuse enemies or reveal hidden truths.',
    role: 'Protagonist warrior defending the Moon Clan against rising threats from rival factions.'
  },
  {
    id: 'kazeyori',
    name: 'Kazeyori',
    clan: 'Moon Clan',
    personality: 'Mysterious and enigmatic, Kazeyori walks the line between wisdom and secrecy. Known for cryptic guidance and deep understanding of lunar prophecies.',
    power: 'Channels moonlight into healing energy and protective barriers. Can read the phases of the moon to predict future events.',
    role: 'Spiritual guide and mentor to Moon Clan warriors, keeper of ancient lunar secrets.'
  },
  {
    id: 'aurelian',
    name: 'Aurelian',
    clan: 'Sun Clan',
    personality: 'Ambitious and ruthless, Aurelian believes in the absolute supremacy of the Sun Clan. His charisma masks a dangerous obsession with power and domination.',
    power: 'Wields devastating solar flares and radiant energy blasts. Can superheat the battlefield and blind opponents with pure light.',
    role: 'Primary antagonist seeking to overthrow the balance and establish Sun Clan dominance over all realms.'
  },
  {
    id: 'valerion',
    name: 'Valerion',
    clan: 'Unknown',
    personality: 'A calculating and enigmatic strategist who operates from the shadows. Valerion\'s true motives remain unclear, making him unpredictable and dangerous.',
    power: 'Master tactician with the ability to manipulate multiple elemental forces. Rumored to possess forbidden techniques that transcend clan boundaries.',
    role: 'Season 2 villain orchestrating conflicts between clans for mysterious purposes.'
  },
  {
    id: 'sankei',
    name: 'Sankei',
    clan: 'Fire Clan',
    personality: 'Passionate and hot-headed, Sankei fights with fierce determination and unbreakable spirit. Quick to anger but fiercely protective of allies.',
    power: 'Commands explosive flames and volcanic fury. Can create walls of fire and launch devastating flame projectiles.',
    role: 'Fire Clan protagonist fighting to prove the strength and honor of his people.'
  },
  {
    id: 'haruna',
    name: 'Haruna',
    clan: 'Earth Clan',
    personality: 'Grounded and patient, Haruna embodies the steadfast nature of the earth. She values stability and uses her strength to protect the vulnerable.',
    power: 'Controls stone and earth, creating impenetrable defenses and seismic attacks. Can sense vibrations through the ground to detect enemies.',
    role: 'Earth Clan protagonist and defender, maintaining the foundation of peace between clans.'
  },
  {
    id: 'mizuki',
    name: 'Mizuki',
    clan: 'Water Clan',
    personality: 'Adaptable and empathetic, Mizuki flows through challenges with grace and wisdom. She seeks peaceful solutions but will fight when necessary.',
    power: 'Manipulates water in all forms - liquid, ice, and mist. Can heal wounds and create powerful tidal waves.',
    role: 'Water Clan protagonist working to maintain harmony and heal the wounds of war.'
  },
  {
    id: 'kazei',
    name: 'Kazei',
    clan: 'Wind Clan',
    personality: 'Free-spirited and unpredictable, Kazei values freedom above all else. Quick-witted and agile, he never stays in one place for long.',
    power: 'Controls wind currents and air pressure. Can create devastating tornadoes and move with incredible speed on wind currents.',
    role: 'Wind Clan protagonist bringing swift justice and protecting the freedom of all clans.'
  },
  {
    id: 'volt',
    name: 'Volt',
    clan: 'Lightning Clan',
    personality: 'Energetic and impulsive, Volt strikes fast and thinks later. His enthusiasm is infectious, but his recklessness can lead to trouble.',
    power: 'Harnesses electrical energy for devastating lightning strikes. Can move at blinding speed and electrify his attacks.',
    role: 'Lightning Clan protagonist bringing electrifying power to the fight against darkness.'
  }
];
