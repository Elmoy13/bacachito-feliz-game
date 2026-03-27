import { useState, useCallback, useRef, useEffect } from 'react';
import type { BacachitoMood } from '@/types/bacachito';
import { bacachitoQuotes } from '@/data/bacachitoQuotes';
import { useSlangText } from '@/hooks/useSlangText';
import type { SlangRegion } from '@/types/slang';

interface UseBacachitoSpeechOptions {
  mood: BacachitoMood;
  region?: SlangRegion;
  cardIndex?: number;
  isFirstCard?: boolean;
  isFirstExtreme?: boolean;
  isGameOver?: boolean;
}

interface UseBacachitoSpeechReturn {
  text: string | null;
  isVisible: boolean;
  triggerSpeech: () => void;
}

export function useBacachitoSpeech({
  mood,
  region,
  cardIndex = 0,
  isFirstCard = false,
  isFirstExtreme = false,
  isGameOver = false,
}: UseBacachitoSpeechOptions): UseBacachitoSpeechReturn {
  const [text, setText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const usedPhrases = useRef(new Set<string>());
  const lastBubbleCardIndex = useRef(-3);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { applySlang } = useSlangText(region);

  const getRandomPhrase = useCallback((currentMood: BacachitoMood): string | null => {
    const pool = bacachitoQuotes[currentMood];
    const available = pool.filter((p) => !usedPhrases.current.has(p));

    if (available.length === 0) {
      // Reset used phrases for this mood if all used
      pool.forEach((p) => usedPhrases.current.delete(p));
      return pool[Math.floor(Math.random() * pool.length)] ?? null;
    }

    return available[Math.floor(Math.random() * available.length)] ?? null;
  }, []);

  const showBubble = useCallback((phrase: string) => {
    const processed = applySlang(phrase);
    usedPhrases.current.add(phrase);
    setText(processed);

    // Clear existing timeouts
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);

    setIsVisible(true);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setText(null);
    }, 3000);
  }, [applySlang]);

  const triggerSpeech = useCallback(() => {
    const phrase = getRandomPhrase(mood);
    if (phrase) showBubble(phrase);
  }, [mood, getRandomPhrase, showBubble]);

  // Auto speech on card changes
  useEffect(() => {
    const alwaysShow = isFirstCard || isFirstExtreme || isGameOver;
    const cooldownMet = cardIndex - lastBubbleCardIndex.current >= 2;
    const randomChance = Math.random() < 0.25;

    if (alwaysShow || (cooldownMet && randomChance)) {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);

      showTimeoutRef.current = setTimeout(() => {
        const phrase = getRandomPhrase(mood);
        if (phrase) {
          showBubble(phrase);
          lastBubbleCardIndex.current = cardIndex;
        }
      }, 600);
    }

    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIndex, isGameOver]);

  // Auto speech on mount (for static screens like Setup)
  useEffect(() => {
    const mountTimer = setTimeout(() => {
      if (Math.random() < 0.5) {
        const phrase = getRandomPhrase(mood);
        if (phrase) showBubble(phrase);
      }
    }, 2000);
    return () => clearTimeout(mountTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
  }, []);

  return { text, isVisible, triggerSpeech };
}
