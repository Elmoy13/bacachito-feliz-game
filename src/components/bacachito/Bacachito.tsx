import React, { useState, useRef, useCallback, useEffect, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import type { BacachitoMood, BacachitoSize, BacachitoPosition, BacachitoProps } from '@/types/bacachito';
import { MOOD_CONFIG } from '@/data/bacachitoConfig';
import BacachitoSVG from './BacachitoSVG';
import SpeechBubble from './SpeechBubble';
import { useBacachitoSpeech } from '@/hooks/useBacachitoSpeech';
import { useShakeDetection } from '@/hooks/useShakeDetection';
import { trackEvent } from '@/lib/firebase';
import type { SlangRegion } from '@/types/slang';

// Error boundary as a class component
class BacachitoErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Silently fail — Bacachito is enhancement, not core
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const SIZE_CLASSES: Record<BacachitoSize, string> = {
  sm: 'w-14 sm:w-16',
  md: 'w-14 sm:w-[72px]',
  lg: 'w-24 sm:w-[120px]',
};

interface BacachitoInnerProps extends BacachitoProps {
  region?: SlangRegion;
  cardIndex?: number;
  isFirstCard?: boolean;
  isFirstExtreme?: boolean;
  isGameOver?: boolean;
  showSpeech?: boolean;
}

const BacachitoInner: React.FC<BacachitoInnerProps> = ({
  mood = 'happy',
  size = 'md',
  position = 'inline',
  onTap,
  className = '',
  region,
  cardIndex = 0,
  isFirstCard = false,
  isFirstExtreme = false,
  isGameOver = false,
  showSpeech = true,
}) => {
  const [activeMood, setActiveMood] = useState<BacachitoMood>(mood);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const tapTimestamps = useRef<number[]>([]);
  const moodOverrideTimeout = useRef<ReturnType<typeof setTimeout>>();

  const config = MOOD_CONFIG[activeMood];

  const { text, isVisible, triggerSpeech } = useBacachitoSpeech({
    mood: activeMood,
    region,
    cardIndex,
    isFirstCard,
    isFirstExtreme,
    isGameOver,
  });

  // Sync external mood with transition squeeze
  useEffect(() => {
    if (mood !== activeMood && !moodOverrideTimeout.current) {
      setIsSqueezing(true);
      const t = setTimeout(() => {
        setActiveMood(mood);
        setIsSqueezing(false);
      }, 200);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  // Temporary mood override helper
  const overrideMood = useCallback((tempMood: BacachitoMood, durationMs: number) => {
    if (moodOverrideTimeout.current) clearTimeout(moodOverrideTimeout.current);
    setActiveMood(tempMood);
    moodOverrideTimeout.current = setTimeout(() => {
      setActiveMood(mood);
      moodOverrideTimeout.current = undefined;
    }, durationMs);
  }, [mood]);

  // Easter egg: rapid tap (5 taps in 2s)
  const handleTap = useCallback(() => {
    onTap?.();
    triggerSpeech();

    const now = Date.now();
    tapTimestamps.current.push(now);
    // Keep only last 5
    if (tapTimestamps.current.length > 5) tapTimestamps.current.shift();

    if (tapTimestamps.current.length >= 5) {
      const first = tapTimestamps.current[0];
      if (now - first <= 2000) {
        tapTimestamps.current = [];
        overrideMood('dizzy', 3000);
        trackEvent('bacachito_easter_egg', { type: 'rapid_tap' });
      }
    }
  }, [onTap, triggerSpeech, overrideMood]);

  // Easter egg: shake detection
  const handleShake = useCallback(() => {
    overrideMood('scared', 2000);
    setTimeout(() => {
      // Only override to dizzy if still in scared (not overridden again)
      setActiveMood((current) => (current === 'scared' ? 'dizzy' : current));
      setTimeout(() => {
        setActiveMood(mood);
      }, 2000);
    }, 2000);
  }, [mood, overrideMood]);

  useShakeDetection({ onShake: handleShake, enabled: true });

  // Cleanup
  useEffect(() => {
    return () => {
      if (moodOverrideTimeout.current) clearTimeout(moodOverrideTimeout.current);
    };
  }, []);

  const sizeClass = SIZE_CLASSES[size];
  const isCorner = position === 'corner';
  const bubblePosition = 'right' as const;

  return (
    <div
      className={`${
        isCorner ? 'fixed z-40 pointer-events-none' : 'relative'
      } ${sizeClass} ${className}`}
    >
      <div className="relative">
        {/* Speech bubble */}
        {showSpeech && (
          <SpeechBubble text={text} isVisible={isVisible} position={bubblePosition} />
        )}

        {/* SVG wrapper with tap + squeeze */}
        <motion.div
          className="cursor-pointer pointer-events-auto"
          style={{ overflow: 'visible' }}
          onClick={handleTap}
          animate={isSqueezing ? { scale: [1, 0.9, 1.05, 1] } : { scale: 1 }}
          transition={isSqueezing ? { duration: 0.2 } : {}}
          whileTap={{ scale: 0.95 }}
          role="button"
          aria-label="Bacachito mascota"
          tabIndex={0}
        >
          <BacachitoSVG
            mood={activeMood}
            capStyle={config.cap}
            extras={config.extras}
            cheeksColor={config.cheeksColor}
          />
        </motion.div>
      </div>

      {/* Label emoji */}
      {size !== 'sm' && (
        <div className="text-center text-base select-none pointer-events-none mt-1">
          {config.labelEmoji}
        </div>
      )}
    </div>
  );
};

const Bacachito: React.FC<BacachitoInnerProps> = (props) => (
  <BacachitoErrorBoundary>
    <BacachitoInner {...props} />
  </BacachitoErrorBoundary>
);

export default Bacachito;
