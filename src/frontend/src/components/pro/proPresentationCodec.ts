import { ProBlock } from './proPresentationTypes';

export function encodeProPresentation(blocks: ProBlock[]): string {
  try {
    return JSON.stringify(blocks);
  } catch (error) {
    console.error('Failed to encode Pro presentation:', error);
    return '[]';
  }
}

export function decodeProPresentation(content: string): ProBlock[] {
  if (!content || content.trim() === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(content);
    
    // Validate structure
    if (!Array.isArray(parsed)) {
      console.warn('Pro presentation content is not an array, returning empty');
      return [];
    }

    // Validate each block
    const validBlocks = parsed.filter((block): block is ProBlock => {
      return (
        typeof block === 'object' &&
        block !== null &&
        typeof block.id === 'string' &&
        typeof block.title === 'string' &&
        typeof block.body === 'string'
      );
    });

    return validBlocks;
  } catch (error) {
    console.error('Failed to decode Pro presentation:', error);
    return [];
  }
}
