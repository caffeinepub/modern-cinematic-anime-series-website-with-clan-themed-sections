// Frontend types for Fan Art Community features

export interface ArtistLeaderboardEntry {
  artistName: string;
  rank: number;
  totalVotes: number;
  submittedCount: number;
  badges: BadgeType[];
}

export type BadgeType = 'Rising Artist' | 'Community Favorite' | 'Monthly Champion' | 'Legendary Creator';

export interface HallOfFameEntry {
  artistName: string;
  featuredArtworkUrl: string;
  recognitionMessage: string;
  achievements: string[];
  creditLink?: string;
}

export interface ArtistProfile {
  artistName: string;
  submittedArtworks: ArtistArtwork[];
  totalVotes: number;
  badges: BadgeType[];
}

export interface ArtistArtwork {
  id: string;
  artworkTitle: string;
  imageUrl: string;
  votes: number;
  featured: boolean;
}
