import { useState, useEffect, useRef, useMemo } from 'react';
import type { BacachitoMood, ExtraType, CapStyle } from '@/types/bacachito';
import type { Challenge } from '@/types/game';
import { MOOD_CONFIG } from '@/data/bacachitoConfig';

interface UseBacachitoMoodOptions {
  currentCardIndex: number;
  currentCard: Challenge | null;
  totalCards: number;
  gameMode: string | null;
  gameStatus: 'playing' | 'finished' | 'idle';
  lastInteractionTime: number;
}

interface UseBacachitoMoodReturn {
  mood: BacachitoMood;
  previousMood: BacachitoMood;
  isTransitioning: boolean;
  capStyle: CapStyle;
  extras: ExtraType[];
  cheeksColor: string | null;
  labelEmoji: string;
}

function getMoodFromCard(card: Challenge | null): BacachitoMood {
  if (!card) return 'happy';

  switch (card.type) {
    case 'direct':
      return 'happy';
    case 'group':
      return 'excited';
    case 'category':
      return 'thinking';
    case 'vote':
      return 'thinking';
    case 'random':
      return 'happy';
    case 'timed':
      return 'dizzy';
    case 'power': {
      const text = (card.template + ' ' + (card.subtitle ?? '')).toUpperCase();
      if (text.includes('ESCUDO')) return 'cool';
      if (text.includes('ESPEJO')) return 'evil';
      if (text.includes('DICTADOR')) return 'evil';
      if (text.includes('CUPIDO')) return 'love';
      return 'excited';
    }
    case 'extreme':
      return Math.random() < 0.5 ? 'shocked' : 'scared';
    default:
      return 'happy';
  }
}

function applyDrunkOverride(mood: BacachitoMood, progress: number): BacachitoMood {
  if (progress > 0.92) {
    if (Math.random() < 0.6) return 'wasted';
  } else if (progress > 0.68) {
    if (Math.random() < 0.35) return 'drunk';
  } else if (progress > 0.33) {
    if (Math.random() < 0.15) return 'drunk';
  }
  return mood;
}

export function useBacachitoMood({
  currentCardIndex,
  currentCard,
  totalCards,
  gameMode,
  gameStatus,
  lastInteractionTime,
}: UseBacachitoMoodOptions): UseBacachitoMoodReturn {
  const [mood, setMood] = useState<BacachitoMood>('happy');
  const [previousMood, setPreviousMood] = useState<BacachitoMood>('happy');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Step 1: Base mood from card type
    let newMood = getMoodFromCard(currentCard);

    // Step 2: Drunk override by progression
    const progress = totalCards > 0 ? currentCardIndex / totalCards : 0;
    newMood = applyDrunkOverride(newMood, progress);

    // Step 3: Special overrides
    if (gameStatus === 'finished') {
      newMood = 'celebrating';
    } else if (Date.now() - lastInteractionTime > 45000) {
      newMood = 'sleeping';
    } else if (gameMode === 'hot' && Math.random() < 0.25) {
      newMood = 'fire';
    }

    // Step 4: Transition
    if (newMood !== mood) {
      setPreviousMood(mood);
      setIsTransitioning(true);

      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setMood(newMood);
        setIsTransitioning(false);
      }, 200);
    }

    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCardIndex, currentCard, gameStatus, lastInteractionTime]);

  const config = useMemo(() => MOOD_CONFIG[mood], [mood]);

  return {
    mood,
    previousMood,
    isTransitioning,
    capStyle: config.cap,
    extras: config.extras,
    cheeksColor: config.cheeksColor,
    labelEmoji: config.labelEmoji,
  };
}
