export interface GalleryItem {
  id: string;
  title: string;
  category: 'Concept Art' | 'Fight Scenes' | 'Character Designs';
  src: string;
  alt: string;
}

export const galleryItems: GalleryItem[] = [];

export const galleryCategories = ['Concept Art', 'Fight Scenes', 'Character Designs'] as const;
