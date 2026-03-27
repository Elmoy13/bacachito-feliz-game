import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBlobs from '@/components/coming-soon/AnimatedBlobs';
import ShimmerText from '@/components/coming-soon/ShimmerText';
import InstagramButton from '@/components/coming-soon/InstagramButton';
import BacachitoSVG from '@/components/bacachito/BacachitoSVG';
import { MOOD_CONFIG } from '@/data/bacachitoConfig';
import type { BacachitoMood } from '@/types/bacachito';

const CYCLE_MOODS: BacachitoMood[] = ['happy', 'excited', 'cool', 'celebrating', 'love', 'fire'];

// Particle ring dots
const RING_DOTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i / 8) * 360,
  delay: i * 0.15,
  size: Math.random() > 0.5 ? 3 : 2,
}));

const ComingSoon: React.FC = () => {
  const [tapCount, setTapCount] = useState(0);
  const [moodIndex, setMoodIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMoodIndex((i) => (i + 1) % CYCLE_MOODS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMood = CYCLE_MOODS[moodIndex];
  const config = MOOD_CONFIG[currentMood];

  const handleTap = useCallback(() => {
    setTapCount((c) => c + 1);
  }, []);

  const secretMessage = tapCount >= 20
    ? 'Ya te dije que no está listo...'
    : tapCount >= 12
      ? 'Necesitas ayuda profesional'
      : tapCount >= 7
        ? 'Sigues tocando... qué necio'
        : tapCount >= 3
          ? 'No importa cuántas veces toques'
          : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Animated background blobs */}
      <AnimatedBlobs />

      {/* Floating micro particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/15 pointer-events-none"
          style={{
            left: `${15 + i * 13}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30 - i * 8, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto flex flex-col items-center">

        {/* Bacachito SVG + effects — self-contained centered block */}
        <motion.div
          className="relative w-28 sm:w-36 ml-auto"
          style={{ aspectRatio: '160 / 260' }}
          initial={{ opacity: 0, scale: 0, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 180, damping: 14 }}
          onClick={handleTap}
        >
          {/* Pulsing glow — centered via inset-0 flex */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-48 h-48 rounded-full bg-primary/8"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-72 h-72 rounded-full bg-primary/4"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
          </div>

          {/* Spinning orbit ring — centered via inset-0 flex */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-44 h-44 rounded-full border border-primary/[0.08]"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {RING_DOTS.map((dot) => (
                <motion.div
                  key={dot.id}
                  className="absolute rounded-full bg-primary/20"
                  style={{
                    width: dot.size,
                    height: dot.size,
                    top: 88 + 88 * Math.sin((dot.angle * Math.PI) / 180) - dot.size / 2,
                    left: 88 + 88 * Math.cos((dot.angle * Math.PI) / 180) - dot.size / 2,
                  }}
                  animate={{ opacity: [0.15, 0.5, 0.15], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: dot.delay }}
                />
              ))}
            </motion.div>
          </div>

          {/* Second ring, counter-rotating — centered via inset-0 flex */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-60 h-60 rounded-full border border-primary/[0.05]"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-primary/15"
                style={{ top: -3, left: '50%', transform: 'translateX(-50%)' }}
              />
              <motion.div
                className="absolute w-1 h-1 rounded-full bg-primary/25"
                style={{ bottom: -2, left: '50%', transform: 'translateX(-50%)' }}
              />
            </motion.div>
          </div>

          {/* Bacachito SVG — absolute fill, sized by container aspect-ratio */}
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <motion.div
              animate={{ rotate: [0, 1.5, -1.5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="cursor-pointer w-full h-full"
            >
              <BacachitoSVG
                mood={currentMood}
                capStyle={config.cap}
                extras={config.extras}
                cheeksColor={config.cheeksColor}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Title with stagger */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="heading-display">
            Bacachito
          </h1>
          <motion.h1
            className="heading-display"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="italic text-primary">Feliz</span>
          </motion.h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="body-large text-muted-foreground mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          La elegancia de ponerse hasta atrás.
        </motion.p>

        {/* Animated separator */}
        <motion.div
          className="mt-8 mb-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div
            className="h-px bg-border"
            initial={{ width: 0 }}
            animate={{ width: 24 }}
            transition={{ delay: 0.65, duration: 0.5, ease: 'easeOut' }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="h-px bg-border"
            initial={{ width: 0 }}
            animate={{ width: 24 }}
            transition={{ delay: 0.65, duration: 0.5, ease: 'easeOut' }}
          />
        </motion.div>

        {/* MUY PRONTO — shimmer with bounce entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 18 }}
        >
          <ShimmerText className="text-2xl font-extrabold tracking-wide uppercase" delay={0.7}>
            Muy Pronto
          </ShimmerText>
        </motion.div>

        {/* Description */}
        <motion.p
          className="body-regular text-muted-foreground mt-3 max-w-[280px]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          Estamos preparando la peda más épica. Síguenos para ser los primeros en jugar.
        </motion.p>

        {/* Instagram button */}
        <div className="mt-6">
          <InstagramButton delay={0.95} />
        </div>

        {/* Secret tap messages */}
        <div className="h-6 mt-3">
          <AnimatePresence mode="wait">
            {secretMessage && (
              <motion.p
                key={secretMessage}
                className="body-small text-muted-foreground/70 italic"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {secretMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Disclaimer */}
        <motion.p
          className="body-small text-muted-foreground/50 mt-auto pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          Bebe con responsabilidad. Solo mayores de 18.
        </motion.p>
      </div>
    </div>
  );
};

export default ComingSoon;
