export interface Episode {
  number: number;
  title: string;
  summary: string;
  status: 'Released' | 'Coming Soon';
  videoUrl?: string;
  thumbnailUrl?: string;
}

export const season1Episodes: Episode[] = [
  {
    number: 1,
    title: 'Moonrise',
    summary: 'The ancient clans gather under the white moon as a prophecy awakens. Harusuke begins his journey into a world of elemental powers and hidden destinies.',
    status: 'Released',
  },
  {
    number: 2,
    title: 'Flames of Conflict',
    summary: 'The Fire Clan challenges the balance of power. Sankei must prove his worth as tensions between the clans reach a boiling point.',
    status: 'Released',
  },
  {
    number: 3,
    title: 'Waters of Truth',
    summary: 'Haruna discovers a secret that could change everything. The Water Clan faces an internal struggle as old alliances are tested.',
    status: 'Released',
  },
  {
    number: 4,
    title: 'Lightning Strikes',
    summary: 'Volt unleashes his true power in a battle that shakes the foundations of the clans. New enemies emerge from the shadows.',
    status: 'Released',
  },
  {
    number: 5,
    title: 'Eclipse',
    summary: 'As the moon darkens, ancient forces awaken. The clans must unite or face destruction from a threat beyond their understanding.',
    status: 'Coming Soon',
  },
  {
    number: 6,
    title: 'The Balance Broken',
    summary: 'The Balance Clan reveals its true purpose. Kazeyori and Aurelian face off in an epic confrontation that will determine the fate of all clans.',
    status: 'Coming Soon',
  },
];
