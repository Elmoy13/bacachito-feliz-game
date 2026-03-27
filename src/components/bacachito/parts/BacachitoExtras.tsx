import { AnimatePresence, motion } from 'framer-motion';
import type { ExtraType } from '@/types/bacachito';

interface BacachitoExtrasProps {
  extras: ExtraType[];
  cheeksColor: string | null;
}

const CONFETTI_COLORS = ['#E24B4A', '#2563eb', '#EF9F27', '#97C459', '#ED93B1'];

const Cheeks: React.FC<{ color: string }> = ({ color }) => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.6 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <ellipse cx="-42" cy="8" rx="10" ry="6" fill={color} />
    <ellipse cx="42" cy="8" rx="10" ry="6" fill={color} />
  </motion.g>
);

const SweatDrop: React.FC = () => (
  <motion.g
    initial={{ opacity: 1, y: 0 }}
    animate={{ opacity: [1, 1, 0], y: [0, 10, 20] }}
    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
  >
    <path d="M 52,-30 Q 55,-22 52,-16 Q 49,-22 52,-30 Z" fill="#85B7EB" />
  </motion.g>
);

const Hearts: React.FC = () => (
  <>
    {[{ x: -15, delay: 0 }, { x: 0, delay: 0.3 }, { x: 15, delay: 0.6 }].map((h, i) => (
      <motion.g
        key={i}
        initial={{ opacity: 0, y: -130, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], y: [-130, -145, -155, -170], scale: [0.5, 1, 1, 0.5] }}
        transition={{ duration: 2, delay: h.delay, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <text x={h.x} y={0} fontSize="12" textAnchor="middle" fill="#E24B4A">♥</text>
      </motion.g>
    ))}
  </>
);

const Confetti: React.FC = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const tx = Math.cos(angle) * (20 + Math.random() * 30);
      const ty = -Math.abs(Math.sin(angle)) * (40 + Math.random() * 30) - 120;
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const rotation = Math.random() * 360;

      return (
        <motion.rect
          key={i}
          x={-2}
          y={-120}
          width={4}
          height={8}
          rx={1}
          fill={color}
          initial={{ opacity: 1, x: 0, y: -120, rotate: 0 }}
          animate={{ opacity: [1, 1, 0], x: tx, y: ty, rotate: rotation }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      );
    })}
  </>
);

const Zzz: React.FC = () => (
  <>
    {[
      { size: 12, delay: 0 },
      { size: 16, delay: 0.8 },
      { size: 20, delay: 1.6 },
    ].map((z, i) => (
      <motion.text
        key={i}
        x={30}
        y={-110}
        fontSize={z.size}
        fill="#212121"
        opacity={0.7}
        fontWeight="bold"
        initial={{ opacity: 0, x: 30, y: -110 }}
        animate={{
          opacity: [0, 0.8, 0.8, 0],
          x: [30, 40, 50, 55],
          y: [-110, -125, -140, -160],
        }}
        transition={{ duration: 2.4, delay: z.delay, repeat: Infinity }}
      >
        Z
      </motion.text>
    ))}
  </>
);

const Stars: React.FC = () => (
  <>
    {[0, 120, 240].map((startAngle, i) => (
      <motion.g
        key={i}
        initial={{ rotate: startAngle }}
        animate={{ rotate: startAngle + 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ originX: '0px', originY: '-105px' }}
      >
        <path
          d="M 0,-140 L 3,-135 L 8,-135 L 4,-131 L 6,-126 L 0,-129 L -6,-126 L -4,-131 L -8,-135 L -3,-135 Z"
          fill="#EF9F27"
          transform={`rotate(${startAngle} 0 -105) translate(35, 0)`}
        />
      </motion.g>
    ))}
  </>
);

const Sparkle: React.FC = () => (
  <motion.g
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.2, repeat: Infinity }}
  >
    <path
      d="M 28,-19 L 31,-16 L 34,-19 L 31,-22 Z"
      fill="white"
    />
  </motion.g>
);

const EXTRA_COMPONENTS: Record<ExtraType, React.FC<{ cheeksColor?: string }>> = {
  cheeks: ({ cheeksColor }) => <Cheeks color={cheeksColor ?? '#F0997B'} />,
  sweat: () => <SweatDrop />,
  hearts: () => <Hearts />,
  confetti: () => <Confetti />,
  zzz: () => <Zzz />,
  stars: () => <Stars />,
  sparkle: () => <Sparkle />,
};

const BacachitoExtras: React.FC<BacachitoExtrasProps> = ({ extras, cheeksColor }) => {
  return (
    <AnimatePresence>
      {extras.map((extra) => {
        const Component = EXTRA_COMPONENTS[extra];
        return (
          <motion.g
            key={extra}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Component cheeksColor={cheeksColor ?? undefined} />
          </motion.g>
        );
      })}
    </AnimatePresence>
  );
};

export default BacachitoExtras;
