import { AnimatePresence, motion } from 'framer-motion';
import type { BacachitoMood } from '@/types/bacachito';
import { EYE_PATHS } from '@/data/bacachitoExpressions';

interface BacachitoEyesProps {
  mood: BacachitoMood;
}

const BacachitoEyes: React.FC<BacachitoEyesProps> = ({ mood }) => {
  const eyes = EYE_PATHS[mood];
  const fillClass = eyes.fillColor ? undefined : 'bk-solid';
  const fillColor = eyes.fillColor ?? undefined;
  const isStroke = eyes.isStroke;

  return (
    <AnimatePresence mode="wait">
      <motion.g
        id="bk-eyes"
        key={mood}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {isStroke ? (
          <>
            <path
              d={eyes.left}
              fill="none"
              stroke="#212121"
              className="bk-line"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* For thinking mood, right eye is fill-based */}
            {mood === 'thinking' ? (
              <path d={eyes.right} className="bk-solid" />
            ) : (
              <path
                d={eyes.right}
                fill="none"
                stroke="#212121"
                className="bk-line"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </>
        ) : (
          <>
            <path d={eyes.left} className={fillClass} fill={fillColor} />
            <path d={eyes.right} className={fillClass} fill={fillColor} />
          </>
        )}

        {/* Shocked pupils */}
        {mood === 'shocked' && (
          <>
            <circle cx="-24" cy="-20" r="3" className="bk-solid" />
            <circle cx="24" cy="-20" r="3" className="bk-solid" />
          </>
        )}

        {/* Scared pupils (descentered downward) */}
        {mood === 'scared' && (
          <>
            <circle cx="-22" cy="-16" r="2.5" className="bk-solid" />
            <circle cx="22" cy="-16" r="2.5" className="bk-solid" />
          </>
        )}

        {/* Cool sunglasses extras: bridge + arms */}
        {mood === 'cool' && (
          <>
            <line x1="-11" y1="-16" x2="11" y2="-16" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
            <line x1="-37" y1="-16" x2="-42" y2="-20" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="37" y1="-16" x2="42" y2="-20" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
            {/* Lens tint */}
            <path d="M -37,-22 L -11,-22 L -11,-10 L -37,-10 Z" fill="rgba(33,33,33,0.3)" />
            <path d="M 11,-22 L 37,-22 L 37,-10 L 11,-10 Z" fill="rgba(33,33,33,0.3)" />
          </>
        )}

        {/* Angry eyebrows */}
        {mood === 'angry' && (
          <>
            <line x1="-34" y1="-28" x2="-14" y2="-24" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
            <line x1="14" y1="-24" x2="34" y2="-28" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Dizzy rotation animation on X eyes */}
        {mood === 'dizzy' && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 -15"
            to="360 0 -15"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </motion.g>
    </AnimatePresence>
  );
};

export default BacachitoEyes;
