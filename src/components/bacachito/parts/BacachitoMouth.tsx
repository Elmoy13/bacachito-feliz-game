import { AnimatePresence, motion } from 'framer-motion';
import type { BacachitoMood } from '@/types/bacachito';
import { MOUTH_PATHS } from '@/data/bacachitoExpressions';

interface BacachitoMouthProps {
  mood: BacachitoMood;
}

const BacachitoMouth: React.FC<BacachitoMouthProps> = ({ mood }) => {
  const mouth = MOUTH_PATHS[mood];
  const isStroke = mouth.isStroke;

  return (
    <AnimatePresence mode="wait">
      <motion.g
        id="bk-mouth"
        key={mood}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {isStroke ? (
          <path
            d={mouth.shape}
            fill="none"
            stroke="#212121"
            className="bk-line"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : (
          <>
            <path d={mouth.shape} className="bk-solid" />
            {mouth.detail && (
              <path
                d={mouth.detail}
                className={mouth.detailFill ? undefined : 'bk-white'}
                fill={mouth.detailFill ?? undefined}
              />
            )}
          </>
        )}

        {/* Scared teeth lines */}
        {mood === 'scared' && (
          <>
            <line x1="-6" y1="4" x2="-6" y2="12" stroke="#212121" strokeWidth="1.5" />
            <line x1="0" y1="4" x2="0" y2="12" stroke="#212121" strokeWidth="1.5" />
            <line x1="6" y1="4" x2="6" y2="12" stroke="#212121" strokeWidth="1.5" />
          </>
        )}
      </motion.g>
    </AnimatePresence>
  );
};

export default BacachitoMouth;
