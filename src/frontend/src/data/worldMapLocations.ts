export interface WorldMapLocation {
  id: string;
  name: string;
  xPercent: number;
  yPercent: number;
  region?: string;
  clan?: string;
  loreText: string;
  shape: string; // SVG path data for the traced hotspot region
}

export const worldMapLocations: WorldMapLocation[] = [
  {
    id: 'frozen-tides',
    name: 'Frozen Tides',
    xPercent: 18,
    yPercent: 28,
    region: 'Northern Waters',
    clan: 'Moon Clan',
    loreText: 'The Frozen Tides are a mystical expanse where the Moon Clan draws its power from the eternal ice and lunar reflections. Here, the boundary between reality and illusion blurs under the pale moonlight, and ancient ice formations hold secrets of shadow manipulation passed down through generations.',
    shape: 'M 8,15 L 5,20 L 3,28 L 5,35 L 10,38 L 18,40 L 25,38 L 30,33 L 32,25 L 30,18 L 25,13 L 18,10 L 12,12 Z'
  },
  {
    id: 'cincthed-sands',
    name: 'Cincthed Sands',
    xPercent: 68,
    yPercent: 25,
    region: 'Eastern Desert',
    clan: 'Sun Clan',
    loreText: 'The Cincthed Sands shimmer with radiant solar energy, home to the Sun Clan\'s most sacred temples. The desert\'s golden dunes amplify the power of daybreak, and warriors train here to channel divine light. Legends say the sands themselves were blessed by the first sunrise.',
    shape: 'M 58,12 L 52,18 L 50,25 L 52,32 L 58,36 L 68,38 L 78,36 L 85,30 L 88,22 L 86,15 L 80,10 L 72,8 L 65,10 Z'
  },
  {
    id: 'stormlands',
    name: 'Stormlands',
    xPercent: 52,
    yPercent: 42,
    region: 'Central Highlands',
    clan: 'Lightning Clan',
    loreText: 'Perpetual thunderstorms rage across the Stormlands, where the Lightning Clan harnesses electrical fury from the sky. The constant crackling of energy in the air makes this region nearly uninhabitable to outsiders, but Lightning warriors thrive in the chaos, moving with the speed of thunder itself.',
    shape: 'M 42,32 L 38,38 L 38,45 L 42,52 L 50,55 L 58,54 L 65,50 L 68,43 L 67,36 L 62,30 L 55,28 L 48,30 Z'
  },
  {
    id: 'ashen-peaks',
    name: 'Ashen Peaks',
    xPercent: 28,
    yPercent: 48,
    region: 'Western Mountains',
    clan: 'Fire Clan',
    loreText: 'Born from ancient volcanic eruptions, the Ashen Peaks are a landscape of smoldering craters and rivers of molten rock. The Fire Clan built their strongholds within the heart of active volcanoes, where they forge their legendary weapons and channel the earth\'s destructive fury into devastating flame techniques.',
    shape: 'M 15,38 L 10,43 L 8,50 L 10,58 L 16,62 L 25,64 L 35,62 L 42,56 L 44,48 L 42,42 L 36,38 L 28,36 L 20,37 Z'
  },
  {
    id: 'azure-isles',
    name: 'Azure Isles',
    xPercent: 78,
    yPercent: 58,
    region: 'Eastern Archipelago',
    clan: 'Water Clan',
    loreText: 'The Azure Isles float serenely in crystal-clear waters, connected by flowing bridges of living water. The Water Clan\'s mastery over tides and currents is unmatched here, where they practice healing arts and devastating wave techniques. The islands themselves shift with the moon\'s pull, never remaining in the same configuration.',
    shape: 'M 68,48 L 64,52 L 63,58 L 66,65 L 72,68 L 80,69 L 88,67 L 93,62 L 95,55 L 93,49 L 88,45 L 82,44 L 75,46 Z'
  },
  {
    id: 'emerald-vale',
    name: 'Emerald Vale',
    xPercent: 52,
    yPercent: 68,
    region: 'Southern Forests',
    clan: 'Earth Clan',
    loreText: 'The Emerald Vale is an ancient forest where massive trees have stood for millennia, their roots running deeper than any mountain. The Earth Clan draws strength from these eternal groves, their connection to the land making them immovable defenders. Stone monuments scattered throughout mark the sites of legendary battles.',
    shape: 'M 38,58 L 33,63 L 32,70 L 35,77 L 42,80 L 52,82 L 62,80 L 68,75 L 70,68 L 68,61 L 62,57 L 54,56 L 46,57 Z'
  },
  {
    id: 'whispering-sea',
    name: 'Whispering Sea',
    xPercent: 52,
    yPercent: 82,
    region: 'Southern Ocean',
    clan: 'Balance Clan',
    loreText: 'The Whispering Sea earned its name from the haunting echoes that drift across its waters—remnants of the Balance Clan\'s final stand. Once a neutral meeting ground where all clans gathered in peace, it now serves as a solemn reminder of what was lost. Sailors report seeing ghostly lights beneath the waves, as if the Balance Clan\'s power still lingers, waiting to resurface.',
    shape: 'M 35,78 L 28,82 L 25,88 L 28,94 L 38,98 L 52,100 L 66,98 L 76,94 L 79,88 L 76,82 L 69,78 L 60,76 L 48,76 Z'
  }
];
