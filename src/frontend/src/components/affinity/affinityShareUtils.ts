export function buildShareText(characterName: string, whyYouMatch: string, soulResonance: number): string {
  const baseUrl = window.location.origin;
  const affinityUrl = `${baseUrl}/#affinity`;
  
  return `I matched with ${characterName}! 🌙✨\n\n${whyYouMatch}\n\nSoul Resonance: ${soulResonance}%\n\nDiscover your character match: ${affinityUrl}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (err) {
    return false;
  }
}

export async function shareResult(characterName: string, whyYouMatch: string, soulResonance: number): Promise<boolean> {
  const shareText = buildShareText(characterName, whyYouMatch, soulResonance);
  
  // Try Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Character Affinity Match',
        text: shareText
      });
      return true;
    } catch (err) {
      // User cancelled or share failed, fall back to clipboard
      if ((err as Error).name === 'AbortError') {
        return false;
      }
    }
  }
  
  // Fallback to clipboard
  return await copyToClipboard(shareText);
}
