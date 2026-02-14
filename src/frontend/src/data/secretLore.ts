export interface LoreFragment {
  id: string;
  title: string;
  content: string;
  unlockHint: string;
}

export interface HiddenCharacterInfo {
  id: string;
  characterName: string;
  secretTitle: string;
  revealedInfo: string;
}

export const loreFragments: LoreFragment[] = [
  {
    id: 'fragment1',
    title: 'The First Eclipse',
    content: 'Long before the seven clans divided, there was only one people under a single moon. The First Eclipse came without warning, splitting the sky and the people beneath it. Those who looked upon the eclipse were changed, their souls marked by the elements they witnessed in that moment of cosmic alignment.',
    unlockHint: 'Hidden in the world map lore'
  },
  {
    id: 'fragment2',
    title: 'Balance Clan\'s Last Stand',
    content: 'The Balance Clan did not fall in battle, as the legends claim. They chose to disappear. Their leader, Kaida the Harmonious, foresaw a future where their power would be used to enslave all other clans. In an act of ultimate sacrifice, they sealed their own abilities, scattering their bloodline across all seven clans.',
    unlockHint: 'Discover through exploration'
  },
  {
    id: 'fragment3',
    title: 'The Whispering Moon',
    content: 'The white moon that gives our world its name is not a celestial body, but a prison. Ancient texts speak of a being of immense power sealed within, whose whispers can still be heard by those sensitive to spiritual energy. Some believe the moon\'s phases are actually the being\'s attempts to break free.',
    unlockHint: 'Found in secret locations'
  },
  {
    id: 'fragment4',
    title: 'The Eighth Clan',
    content: 'Historical records mention an eighth clan that existed before the Balance Clan\'s fall: the Void Clan. Masters of nothingness and absence, they could erase anything from existence. They were completely wiped from history after attempting to erase the moon itself. Only fragments of their existence remain.',
    unlockHint: 'Unlock through discovery'
  }
];

export const hiddenCharacterInfo: HiddenCharacterInfo[] = [
  {
    id: 'secret1',
    characterName: 'Harusuke',
    secretTitle: 'The Last Balance Heir',
    revealedInfo: 'Harusuke carries the dormant bloodline of the Balance Clan. His exceptional ability to understand and counter techniques from all clans is not mere talent—it\'s his ancestral heritage awakening. He doesn\'t yet know that his recurring dreams of seven moons are actually genetic memories.'
  },
  {
    id: 'secret2',
    characterName: 'Aurelian',
    secretTitle: 'Bearer of the Solar Curse',
    revealedInfo: 'Aurelian\'s radiant power comes at a terrible cost. Each time he uses his full strength, his life force burns away like a candle. The Sun Clan elders know he has less than five years to live unless he stops using his abilities entirely. He has chosen to burn brightly rather than fade slowly.'
  }
];

export const bonusArtwork = [
  {
    id: 'art1',
    title: 'Moonlit Shrine',
    path: '/assets/generated/bonus-art-moon-shrine.dim_1600x900.png',
    description: 'The ancient shrine where the Balance Clan performed their final ritual'
  },
  {
    id: 'art2',
    title: 'Forbidden Scroll',
    path: '/assets/generated/bonus-art-forbidden-scroll.dim_1600x900.png',
    description: 'One of the lost scrolls containing forbidden technique instructions'
  },
  {
    id: 'art3',
    title: 'Constellation Map',
    path: '/assets/generated/bonus-art-constellation-map.dim_1600x900.png',
    description: 'The celestial map used by ancient clan leaders to predict eclipses'
  },
  {
    id: 'art4',
    title: 'Ethereal Portrait',
    path: '/assets/generated/bonus-art-silhouette-portrait.dim_1200x1500.png',
    description: 'A mysterious figure from the Balance Clan\'s final days'
  }
];
