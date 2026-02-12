import { clans as staticClans } from '../data/clans';
import type { Clan as BackendClan, Character as BackendCharacter, Episode as BackendEpisode, GalleryItem as BackendGalleryItem } from '../backend';

// Helper to encode metadata in description field
export function encodeClanMetadata(description: string, metadata: { accentColor?: string; glowClass?: string; sigilPath?: string }): string {
  const metaJson = JSON.stringify(metadata);
  return `${description}|||META:${metaJson}`;
}

// Helper to decode metadata from description field
export function decodeClanMetadata(description: string): { description: string; metadata: { accentColor?: string; glowClass?: string; sigilPath?: string } } {
  const parts = description.split('|||META:');
  if (parts.length === 2) {
    try {
      const metadata = JSON.parse(parts[1]);
      return { description: parts[0], metadata };
    } catch {
      return { description, metadata: {} };
    }
  }
  return { description, metadata: {} };
}

// Get clan styling from static data or defaults
export function getClanStyling(clanName: string): { accentColor: string; glowClass: string; sigilPath: string } {
  const staticClan = staticClans.find(c => c.name.toLowerCase() === clanName.toLowerCase());
  if (staticClan) {
    return {
      accentColor: staticClan.accentColor,
      glowClass: staticClan.glowClass,
      sigilPath: staticClan.sigilPath,
    };
  }
  // Default styling
  return {
    accentColor: 'oklch(var(--primary))',
    glowClass: 'glow-primary',
    sigilPath: '/assets/generated/sigil-balance.dim_512x512.png',
  };
}

// Encode character metadata (personality, power) in bio field
export function encodeCharacterMetadata(bio: string, metadata: { personality?: string; power?: string; clan?: string }): string {
  const metaJson = JSON.stringify(metadata);
  return `${bio}|||META:${metaJson}`;
}

// Decode character metadata from bio field
export function decodeCharacterMetadata(bio: string): { bio: string; metadata: { personality?: string; power?: string; clan?: string } } {
  const parts = bio.split('|||META:');
  if (parts.length === 2) {
    try {
      const metadata = JSON.parse(parts[1]);
      return { bio: parts[0], metadata };
    } catch {
      return { bio, metadata: {} };
    }
  }
  return { bio, metadata: {} };
}

// Encode episode metadata (number, status) in description field
export function encodeEpisodeMetadata(description: string, metadata: { number?: number; status?: string }): string {
  const metaJson = JSON.stringify(metadata);
  return `${description}|||META:${metaJson}`;
}

// Decode episode metadata from description field
export function decodeEpisodeMetadata(description: string): { description: string; metadata: { number?: number; status?: string } } {
  const parts = description.split('|||META:');
  if (parts.length === 2) {
    try {
      const metadata = JSON.parse(parts[1]);
      return { description: parts[0], metadata };
    } catch {
      return { description, metadata: {} };
    }
  }
  return { description, metadata: {} };
}

// Encode gallery metadata (category, alt) in description field
export function encodeGalleryMetadata(description: string, metadata: { category?: string; alt?: string }): string {
  const metaJson = JSON.stringify(metadata);
  return `${description}|||META:${metaJson}`;
}

// Decode gallery metadata from description field
export function decodeGalleryMetadata(description: string): { description: string; metadata: { category?: string; alt?: string } } {
  const parts = description.split('|||META:');
  if (parts.length === 2) {
    try {
      const metadata = JSON.parse(parts[1]);
      return { description: parts[0], metadata };
    } catch {
      return { description, metadata: {} };
    }
  }
  return { description, metadata: {} };
}
