export async function copyResultToClipboard(clanName: string, personality: string): Promise<boolean> {
  const text = `I got ${clanName} in the Whispers Of The White Moon Clan Quiz!\n\n${personality}\n\nTake the quiz: ${window.location.origin}#quiz`;
  
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
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

export async function downloadResultAsImage(element: HTMLElement, clanName: string): Promise<boolean> {
  try {
    // Use html2canvas if available (would need to be added to package.json)
    // For now, provide instructions to screenshot
    return false;
  } catch (error) {
    console.error('Failed to download image:', error);
    return false;
  }
}
