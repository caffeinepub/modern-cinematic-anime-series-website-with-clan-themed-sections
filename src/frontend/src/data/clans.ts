export interface Clan {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  glowClass: string;
  sigilPath: string;
}

export const clans: Clan[] = [
  {
    id: 'moon',
    name: 'Moon Clan',
    description: 'Masters of illusion and shadow manipulation, the Moon Clan draws power from the lunar cycles. Their abilities peak under moonlight, granting them enhanced perception and the power to bend reality itself.',
    accentColor: 'oklch(var(--clan-moon))',
    glowClass: 'glow-moon',
    sigilPath: '/assets/generated/sigil-moon.dim_512x512.png'
  },
  {
    id: 'sun',
    name: 'Sun Clan',
    description: 'Wielders of radiant energy and divine light, the Sun Clan channels the power of daybreak. Their warriors are known for their unwavering courage and ability to purify darkness with blazing solar techniques.',
    accentColor: 'oklch(var(--clan-sun))',
    glowClass: 'glow-sun',
    sigilPath: '/assets/generated/sigil-sun.dim_512x512.png'
  },
  {
    id: 'fire',
    name: 'Fire Clan',
    description: 'Born from volcanic fury, the Fire Clan commands destructive flames and explosive power. Their passionate warriors transform rage into devastating attacks that can reduce entire battlefields to ash.',
    accentColor: 'oklch(var(--clan-fire))',
    glowClass: 'glow-fire',
    sigilPath: '/assets/generated/sigil-fire.dim_512x512.png'
  },
  {
    id: 'water',
    name: 'Water Clan',
    description: 'Flowing like rivers and crashing like tides, the Water Clan adapts to any situation. Their mastery over liquid forms grants them healing abilities and the power to overwhelm opponents with relentless waves.',
    accentColor: 'oklch(var(--clan-water))',
    glowClass: 'glow-water',
    sigilPath: '/assets/generated/sigil-water.dim_512x512.png'
  },
  {
    id: 'lightning',
    name: 'Lightning Clan',
    description: 'Swift as thunder and deadly as a storm, the Lightning Clan harnesses electrical energy. Their techniques strike with blinding speed, making them the fastest warriors in all the realms.',
    accentColor: 'oklch(var(--clan-lightning))',
    glowClass: 'glow-lightning',
    sigilPath: '/assets/generated/sigil-lightning.dim_512x512.png'
  },
  {
    id: 'earth',
    name: 'Earth Clan',
    description: 'Rooted in ancient stone and eternal mountains, the Earth Clan possesses unbreakable defense and immense strength. Their connection to the land makes them nearly invincible on solid ground.',
    accentColor: 'oklch(var(--clan-earth))',
    glowClass: 'glow-earth',
    sigilPath: '/assets/generated/sigil-earth.dim_512x512.png'
  },
  {
    id: 'balance',
    name: 'Balance Clan',
    description: 'The Balance Clan once stood as the strongest and most feared clan in existence. Their warriors possessed the ability to manipulate multiple forces simultaneously, allowing them to maintain harmony between rival clans.\n\nTheir downfall marked the beginning of the modern era of conflict. Even after their disappearance, legends warn that true balance can never remain buried forever.',
    accentColor: 'oklch(var(--clan-balance))',
    glowClass: 'glow-balance',
    sigilPath: '/assets/generated/sigil-balance.dim_512x512.png'
  }
];
