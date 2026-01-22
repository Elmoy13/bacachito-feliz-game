import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Timer, Sparkles } from 'lucide-react';

const StoryCard: React.FC = () => {
  const { 
    currentChallenge, 
    nextChallenge, 
    prevChallenge,
    getProcessedText,
    currentChallengeIndex
  } = useGame();
  
  const [direction, setDirection] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Process text once when challenge changes
  const processedContent = useMemo(() => {
    if (!currentChallenge) return { title: '', subtitle: '' };
    return {
      title: getProcessedText(currentChallenge.template),
      subtitle: currentChallenge.subtitle ? getProcessedText(currentChallenge.subtitle) : ''
    };
  }, [currentChallenge, currentChallengeIndex, getProcessedText]);

  // Handle timed challenges
  useEffect(() => {
    if (currentChallenge?.type === 'timed' && currentChallenge.duration) {
      setTimeLeft(currentChallenge.duration);
      setIsTimerActive(true);
    } else {
      setTimeLeft(null);
      setIsTimerActive(false);
    }
  }, [currentChallenge, currentChallengeIndex]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  if (!currentChallenge) return null;

  const isExtreme = currentChallenge.isExtreme;
  const isTimed = currentChallenge.type === 'timed';
  const isCategory = currentChallenge.type === 'category';

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.25) {
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
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

  // Background style based on challenge type
  const getCardStyle = () => {
    if (isExtreme) return 'bg-extreme text-extreme-foreground';
    if (isTimed) return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white';
    if (isCategory) return 'bg-gradient-to-br from-primary to-blue-600 text-white';
    return '';
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center cursor-pointer select-none px-4"
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
            stiffness: 400, 
            damping: 30,
            mass: 0.8
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className={`card-game ${getCardStyle()}`}
        >
          {/* Timer Display for timed challenges */}
          {isTimed && timeLeft !== null && (
            <motion.div
              className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <Timer size={20} className={timeLeft <= 10 ? 'animate-pulse text-red-200' : ''} />
              <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-200 animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </motion.div>
          )}

          {/* Emoji for extreme */}
          {isExtreme && (
            <motion.span
              className="text-6xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              🔥
            </motion.span>
          )}

          {/* Category icon */}
          {isCategory && (
            <motion.div
              className="mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <Sparkles size={40} className="opacity-80" />
            </motion.div>
          )}

          {/* Timer icon for timed */}
          {isTimed && (
            <motion.span
              className="text-5xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              ⏱️
            </motion.span>
          )}

          {/* Main Challenge Text */}
          <motion.h2
            className="heading-card mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {processedContent.title}
          </motion.h2>

          {/* Subtitle / Instructions - with better formatting for categories */}
          {processedContent.subtitle && (
            <motion.div
              className={`max-w-sm ${isExtreme ? 'text-extreme-foreground/90' : isTimed || isCategory ? 'text-white/90' : 'text-muted-foreground'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {processedContent.subtitle.split('\n').map((line, index) => (
                <p 
                  key={index} 
                  className={`body-large ${index > 0 ? 'mt-2 font-semibold' : ''}`}
                >
                  {line}
                </p>
              ))}
            </motion.div>
          )}

          {/* Timer progress bar */}
          {isTimed && timeLeft !== null && currentChallenge.duration && (
            <motion.div
              className="absolute bottom-8 left-8 right-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/80 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / currentChallenge.duration) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'linear' }}
                />
              </div>
              <p className="text-center text-sm mt-3 opacity-70">
                {timeLeft > 0 ? '¡El tiempo corre!' : '¡Se acabó el tiempo!'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StoryCard;
