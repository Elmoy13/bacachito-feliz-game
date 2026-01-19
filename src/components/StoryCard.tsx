import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useGame } from '@/context/GameContext';

const StoryCard: React.FC = () => {
  const { 
    currentChallenge, 
    nextChallenge, 
    prevChallenge,
    getProcessedText,
    currentChallengeIndex
  } = useGame();
  
  const [direction, setDirection] = useState(0);

  // Process text once when challenge changes
  const processedContent = useMemo(() => {
    if (!currentChallenge) return { title: '', subtitle: '' };
    return {
      title: getProcessedText(currentChallenge.template),
      subtitle: currentChallenge.subtitle ? getProcessedText(currentChallenge.subtitle) : ''
    };
  }, [currentChallenge, currentChallengeIndex, getProcessedText]);

  if (!currentChallenge) return null;

  const isExtreme = currentChallenge.isExtreme;

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.3) {
      setDirection(-1);
      prevChallenge();
    } else {
      setDirection(1);
      nextChallenge();
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setDirection(1);
      nextChallenge();
    } else if (info.offset.x > threshold) {
      setDirection(-1);
      prevChallenge();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      setDirection(1);
      nextChallenge();
    } else if (e.key === 'ArrowLeft') {
      setDirection(-1);
      prevChallenge();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center cursor-pointer select-none"
      onClick={handleTap}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Tap para siguiente reto"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentChallenge.id + currentChallengeIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 35,
            mass: 0.8
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className={`
            w-full max-w-lg mx-4 p-8 sm:p-12 
            flex flex-col items-center justify-center text-center
            min-h-[60vh] sm:min-h-[500px]
            ${isExtreme 
              ? 'bg-extreme text-extreme-foreground' 
              : 'bg-card text-card-foreground shadow-card'
            }
          `}
        >
          {/* Challenge Type Label */}
          <motion.span
            className={`label-uppercase mb-6 ${isExtreme ? 'text-extreme-foreground/70' : 'text-muted-foreground'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {currentChallenge.type === 'direct' && 'Directo'}
            {currentChallenge.type === 'group' && 'Todos'}
            {currentChallenge.type === 'category' && 'Categoría'}
            {currentChallenge.type === 'extreme' && '🔥 Extremo'}
            {currentChallenge.type === 'vote' && 'Votación'}
            {currentChallenge.type === 'random' && 'Random'}
          </motion.span>

          {/* Main Challenge Text */}
          <motion.h2
            className={`heading-card mb-8 ${isExtreme ? 'text-extreme-foreground' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {processedContent.title}
          </motion.h2>

          {/* Subtitle / Instructions */}
          {processedContent.subtitle && (
            <motion.p
              className={`body-elegant max-w-sm ${isExtreme ? 'text-extreme-foreground/80' : 'text-muted-foreground'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {processedContent.subtitle}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tap Hints */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <motion.p 
          className="body-small text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          toca para continuar →
        </motion.p>
      </div>
    </div>
  );
};

export default StoryCard;
