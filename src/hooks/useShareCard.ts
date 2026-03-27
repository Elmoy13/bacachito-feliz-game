import { useState, useCallback, useRef } from 'react';
import { Challenge } from '@/types/game';
import {
  generateCardImage,
  shareImage,
  downloadImage,
  copyTextToClipboard,
  sanitizeTextForShare,
  trackShareEvent,
} from '@/utils/shareUtils';

interface UseShareCardOptions {
  gameMode: string;
}

interface UseShareCardReturn {
  isGenerating: boolean;
  imageDataUrl: string | null;
  isSheetOpen: boolean;
  openShareSheet: () => void;
  closeShareSheet: () => void;
  generateImage: (element: HTMLElement) => Promise<void>;
  handleShare: (text: string) => Promise<'shared' | 'downloaded' | 'error'>;
  handleDownload: () => void;
  handleCopyText: (text: string) => Promise<boolean>;
  clearCache: () => void;
}

export const useShareCard = ({ gameMode }: UseShareCardOptions): UseShareCardReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const cachedChallengeIdRef = useRef<string | null>(null);

  const openShareSheet = useCallback(() => {
    setIsSheetOpen(true);
  }, []);

  const closeShareSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const generateImage = useCallback(async (element: HTMLElement) => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateCardImage(element);
      setImageDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating card image:', err);
      setImageDataUrl(null);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleShare = useCallback(async (text: string): Promise<'shared' | 'downloaded' | 'error'> => {
    if (!imageDataUrl) return 'error';
    try {
      const result = await shareImage(imageDataUrl, text);
      trackShareEvent('card', gameMode, result === 'shared' ? 'share' : 'download');
      return result;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'error'; // User cancelled
      }
      console.error('Error sharing:', err);
      return 'error';
    }
  }, [imageDataUrl, gameMode]);

  const handleDownload = useCallback(() => {
    if (!imageDataUrl) return;
    downloadImage(imageDataUrl);
    trackShareEvent('card', gameMode, 'download');
  }, [imageDataUrl, gameMode]);

  const handleCopyText = useCallback(async (text: string): Promise<boolean> => {
    const success = await copyTextToClipboard(text);
    if (success) {
      trackShareEvent('card', gameMode, 'copy');
    }
    return success;
  }, [gameMode]);

  const clearCache = useCallback(() => {
    setImageDataUrl(null);
    cachedChallengeIdRef.current = null;
  }, []);

  return {
    isGenerating,
    imageDataUrl,
    isSheetOpen,
    openShareSheet,
    closeShareSheet,
    generateImage,
    handleShare,
    handleDownload,
    handleCopyText,
    clearCache,
  };
};
