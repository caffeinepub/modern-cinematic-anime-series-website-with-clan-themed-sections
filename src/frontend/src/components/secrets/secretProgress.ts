const STORAGE_KEY = 'wotw_secret_progress';

export interface SecretProgress {
  foundFragments: string[];
  unlockedCharacters: string[];
  unlockedArtwork: string[];
  discoveredVault: boolean;
}

function getDefaultProgress(): SecretProgress {
  return {
    foundFragments: [],
    unlockedCharacters: [],
    unlockedArtwork: [],
    discoveredVault: false
  };
}

export function loadProgress(): SecretProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load secret progress:', error);
  }
  return getDefaultProgress();
}

export function saveProgress(progress: SecretProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save secret progress:', error);
  }
}

export function markFragmentFound(fragmentId: string): void {
  const progress = loadProgress();
  if (!progress.foundFragments.includes(fragmentId)) {
    progress.foundFragments.push(fragmentId);
    saveProgress(progress);
  }
}

export function markCharacterUnlocked(characterId: string): void {
  const progress = loadProgress();
  if (!progress.unlockedCharacters.includes(characterId)) {
    progress.unlockedCharacters.push(characterId);
    saveProgress(progress);
  }
}

export function markArtworkUnlocked(artworkId: string): void {
  const progress = loadProgress();
  if (!progress.unlockedArtwork.includes(artworkId)) {
    progress.unlockedArtwork.push(artworkId);
    saveProgress(progress);
  }
}

export function markVaultDiscovered(): void {
  const progress = loadProgress();
  if (!progress.discoveredVault) {
    progress.discoveredVault = true;
    saveProgress(progress);
  }
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isFragmentFound(fragmentId: string): boolean {
  const progress = loadProgress();
  return progress.foundFragments.includes(fragmentId);
}

export function isCharacterUnlocked(characterId: string): boolean {
  const progress = loadProgress();
  return progress.unlockedCharacters.includes(characterId);
}

export function isArtworkUnlocked(artworkId: string): boolean {
  const progress = loadProgress();
  return progress.unlockedArtwork.includes(artworkId);
}
