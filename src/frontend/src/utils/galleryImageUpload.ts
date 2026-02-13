// Validation utility for image uploads (gallery and episodes)

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE_GALLERY = 5 * 1024 * 1024; // 5MB for gallery
const MAX_FILE_SIZE_EPISODE = 20 * 1024 * 1024; // 20MB for episodes

export interface ValidationResult {
  success: boolean;
  error?: string;
  dataUrl?: string;
}

/**
 * Validates an image file and converts it to a data URL if valid
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @returns Promise with validation result
 */
export async function validateAndConvertImage(
  file: File,
  maxSize: number = MAX_FILE_SIZE_GALLERY
): Promise<ValidationResult> {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please upload a PNG, JPEG, or WebP image.',
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      success: false,
      error: `File size exceeds ${sizeMB}MB. Please choose a smaller image.`,
    };
  }

  // Convert to data URL
  try {
    const dataUrl = await fileToDataUrl(file);
    return {
      success: true,
      dataUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to process image file. Please try again.',
    };
  }
}

/**
 * Converts a File to a data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Export constants for use in components
export const EPISODE_MAX_FILE_SIZE = MAX_FILE_SIZE_EPISODE;
export const GALLERY_MAX_FILE_SIZE = MAX_FILE_SIZE_GALLERY;
