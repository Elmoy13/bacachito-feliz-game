import { motion } from 'framer-motion';
import type { CapStyle } from '@/types/bacachito';
import { CAP_ANIMATIONS } from '@/data/bacachitoExpressions';

interface BacachitoCapProps {
  capStyle: CapStyle;
  reducedMotion: boolean;
}

const BacachitoCap: React.FC<BacachitoCapProps> = ({ capStyle, reducedMotion }) => {
  const anim = reducedMotion ? {} : CAP_ANIMATIONS[capStyle];

  return (
    <motion.g id="bk-cap" animate={anim}>
      <rect className="bk-solid" x="-22" y="-120" width="44" height="16" rx="3" />
      <rect className="bk-solid" x="-18" y="-98" width="36" height="13" />
    </motion.g>
  );
};

export default BacachitoCap;
