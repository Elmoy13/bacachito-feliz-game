import { useReducedMotion } from 'framer-motion';
import type { BacachitoMood, ExtraType, CapStyle } from '@/types/bacachito';
import BacachitoBody from './parts/BacachitoBody';
import BacachitoCap from './parts/BacachitoCap';
import BacachitoEyes from './parts/BacachitoEyes';
import BacachitoMouth from './parts/BacachitoMouth';
import BacachitoLabel from './parts/BacachitoLabel';
import BacachitoExtras from './parts/BacachitoExtras';

interface BacachitoSVGProps {
  mood: BacachitoMood;
  capStyle: CapStyle;
  extras: ExtraType[];
  cheeksColor: string | null;
}

const BacachitoSVG: React.FC<BacachitoSVGProps> = ({ mood, capStyle, extras, cheeksColor }) => {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="20 10 160 260"
      overflow="visible"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
    >
      <style>{`
        .bk-line { fill: none; stroke: #212121; stroke-linejoin: round; stroke-linecap: round; }
        .bk-solid { fill: #212121; }
        .bk-white { fill: #ffffff; }
        @media (prefers-color-scheme: dark) {
          .bk-line { stroke: #e8e6df; }
          .bk-solid { fill: #e8e6df; }
        }
      `}</style>

      <BacachitoBody mood={mood} reducedMotion={prefersReducedMotion}>
        {/* Cap */}
        <BacachitoCap capStyle={capStyle} reducedMotion={prefersReducedMotion} />

        {/* White fill interior */}
        <path
          className="bk-white"
          d="
            M-20,-85 L20,-85 L20,-55
            Q65,-55 65,-20 L65,85
            Q65,115 40,115 L-40,115
            Q-65,115 -65,85 L-65,-20
            Q-65,-55 -20,-55 Z
          "
        />

        {/* Label */}
        <BacachitoLabel mood={mood} />

        {/* Eyes */}
        <BacachitoEyes mood={mood} />

        {/* Mouth */}
        <BacachitoMouth mood={mood} />

        {/* Extras (cheeks, sweat, hearts, etc.) */}
        <BacachitoExtras extras={extras} cheeksColor={cheeksColor} />
      </BacachitoBody>
    </svg>
  );
};

export default BacachitoSVG;
