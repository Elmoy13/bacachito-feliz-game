import { motion } from 'framer-motion';
import type { BacachitoMood } from '@/types/bacachito';
import { BODY_ANIMATIONS } from '@/data/bacachitoExpressions';

interface BacachitoBodyProps {
  mood: BacachitoMood;
  reducedMotion: boolean;
  children: React.ReactNode;
}

const BacachitoBody: React.FC<BacachitoBodyProps> = ({ mood, reducedMotion, children }) => {
  const anim = reducedMotion ? {} : BODY_ANIMATIONS[mood];

  return (
    <motion.g
      transform="translate(100, 140)"
      animate={anim}
      style={{ willChange: 'transform' }}
    >
      {/* Body outline stroke */}
      <path
        className="bk-line"
        strokeWidth="14"
        d="
          M-20,-85 L20,-85 L20,-55
          Q65,-55 65,-20 L65,85
          Q65,115 40,115 L-40,115
          Q-65,115 -65,85 L-65,-20
          Q-65,-55 -20,-55 Z
        "
      />
      {children}
    </motion.g>
  );
};

export default BacachitoBody;
