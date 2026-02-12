export interface GalleryItem {
  id: string;
  title: string;
  category: 'Concept Art' | 'Fight Scenes' | 'Character Designs';
  src: string;
  alt: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'character-showcase-01',
    title: 'Character Showcase',
    category: 'Character Designs',
    src: '/assets/bestest.png',
    alt: 'Character design showcase featuring clan warriors and elemental forms',
  },
];

export const galleryCategories = ['Concept Art', 'Fight Scenes', 'Character Designs'] as const;
