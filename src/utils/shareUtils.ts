import { toPng } from 'html-to-image';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { initializeApp, getApp } from 'firebase/app';

/**
 * Sanitize challenge text for sharing: replace player placeholders
 * so no real player names appear in shared images.
 */
export const sanitizeTextForShare = (text: string): string => {
  return text
    .replace(/\{player2\}/gi, 'ALGUIEN')
    .replace(/\{player\}/gi, 'TÚ');
};

/**
 * Check if the Web Share API is available and supports file sharing.
 */
export const canUseWebShare = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share;
};

/**
 * Check if the Web Share API supports sharing files (images).
 */
export const canShareFiles = (): boolean => {
  return canUseWebShare() && !!navigator.canShare;
};

/**
 * Generate a PNG data URL from a DOM element using html-to-image.
 * Uses fontEmbedCSS for Safari iOS compatibility.
 */
export const generateCardImage = async (element: HTMLElement): Promise<string> => {
  const options = {
    quality: 1,
    pixelRatio: 2,
    cacheBust: true,
    width: 1080,
    height: 1920,
    style: {
      transform: 'none',
      opacity: '1',
    },
  };

  // First render primes fonts/images (Safari workaround)
  await toPng(element, options);

  // Second render produces the final clean image
  const dataUrl = await toPng(element, options);

  return dataUrl;
};

/**
 * Convert a data URL to a Blob.
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mime });
};

/**
 * Share an image via Web Share API, or fall back to download.
 */
export const shareImage = async (dataUrl: string, text: string): Promise<'shared' | 'downloaded'> => {
  const blob = dataUrlToBlob(dataUrl);
  const file = new File([blob], 'bacachito-feliz.png', { type: 'image/png' });

  if (canShareFiles()) {
    try {
      const shareData: ShareData = {
        title: 'Bacachito Feliz',
        text,
        files: [file],
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return 'shared';
      }
    } catch (err: unknown) {
      // User cancelled or share failed — fall through to download
      if (err instanceof Error && err.name === 'AbortError') {
        throw err; // Re-throw cancellations
      }
    }
  }

  // Fallback: download the image
  downloadImage(dataUrl);
  return 'downloaded';
};

/**
 * Download a data URL as a PNG file.
 */
export const downloadImage = (dataUrl: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `bacachito-feliz-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy text to clipboard.
 */
export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Log a share_card event to Firebase Analytics.
 */
export const trackShareEvent = async (
  cardType: string,
  gameMode: string,
  action: 'share' | 'download' | 'copy'
): Promise<void> => {
  try {
    const supported = await isSupported();
    if (!supported) return;
    const analytics = getAnalytics(getApp());
    logEvent(analytics, 'share_card', {
      card_type: cardType,
      game_mode: gameMode,
      share_action: action,
    });
  } catch {
    // Analytics is non-critical
  }
};

/**
 * Get emoji decoration for a card type.
 */
export const getCardTypeEmoji = (type: string, isExtreme?: boolean, isPower?: boolean): string => {
  if (isExtreme) return '🔥';
  if (isPower) return '⚡';
  switch (type) {
    case 'timed': return '⏱️';
    case 'category': return '🎯';
    case 'group': return '👥';
    case 'vote': return '🗳️';
    case 'direct': return '🎲';
    case 'random': return '🎰';
    default: return '🍾';
  }
};

/**
 * Get gradient CSS for shareable card background based on type.
 */
export const getShareableGradient = (type: string, isExtreme?: boolean, isPower?: boolean): string => {
  if (isExtreme) return 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
  if (isPower) return 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)';
  switch (type) {
    case 'timed': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    case 'category': return 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)';
    default: return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
  }
};

/**
 * Get badge label for a card type.
 */
export const getShareableBadgeText = (type: string, isExtreme?: boolean, isPower?: boolean): string | null => {
  if (isExtreme) return 'EXTREMO';
  if (isPower) return 'PODER';
  switch (type) {
    case 'timed': return 'TIEMPO';
    case 'category': return 'CATEGORÍA';
    case 'group': return 'GRUPAL';
    case 'vote': return 'VOTACIÓN';
    default: return null;
  }
};
