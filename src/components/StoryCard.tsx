import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Clock, Zap, Target, Crown } from 'lucide-react';

interface StoryCardProps {
  onOpenSubGame?: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ onOpenSubGame }) => {
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
  const isPower = currentChallenge.isPower;
  const isTimed = currentChallenge.type === 'timed';
  const isCategory = currentChallenge.type === 'category';
  const hasSubGames = currentChallenge.hasSubGames;

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si tiene subjuegos, no avanzar con tap (se deben usar los botones)
    if (hasSubGames) return;
    
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

  // Get card style class based on challenge type
  const getCardClass = () => {
    if (isExtreme) return 'card-game card-game-extreme';
    if (isPower) return 'card-game card-game-power';
    if (isTimed) return 'card-game card-game-timed';
    if (isCategory) return 'card-game card-game-category';
    return 'card-game card-game-normal';
  };

  // Get icon for card type
  const getCardIcon = () => {
    if (isExtreme) return <Zap size={32} className="opacity-90" />;
    if (isPower) return <Crown size={32} className="opacity-90" />;
    if (isTimed) return <Clock size={32} className="opacity-90" />;
    if (isCategory) return <Target size={32} className="opacity-90" />;
    return null;
  };

  // Get badge text
  const getBadgeText = () => {
    if (isExtreme) return 'EXTREMO';
    if (isPower) return 'PODER';
    if (isTimed) return 'TIEMPO';
    if (isCategory) return 'CATEGORÍA';
    return null;
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
          className={getCardClass()}
        >
          {/* Badge for card type */}
          {getBadgeText() && (
            <motion.div
              className="power-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {getCardIcon()}
              <span className="ml-1">{getBadgeText()}</span>
            </motion.div>
          )}

          {/* Timer Display for timed challenges */}
          {isTimed && timeLeft !== null && (
            <motion.div
              className="timer-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <Clock size={20} className={timeLeft <= 10 ? 'animate-pulse' : ''} />
              <span className={`text-xl font-bold ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </motion.div>
          )}

          {/* Card Type Icon */}
          {!getBadgeText() && (
            <motion.div
              className="mb-6 opacity-80"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              {getCardIcon()}
            </motion.div>
          )}

          {/* Main Challenge Text */}
          <motion.h2
            className="heading-card mb-6 leading-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {processedContent.title}
          </motion.h2>

          {/* Subtitle / Instructions */}
          {processedContent.subtitle && (
            <motion.div
              className="max-w-sm opacity-90"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {processedContent.subtitle.split('\n').map((line, index) => (
                <p 
                  key={index} 
                  className={`body-large ${index > 0 ? 'mt-3 font-bold text-lg' : ''}`}
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
              <p className="text-center text-sm mt-3 opacity-70 font-medium">
                {timeLeft > 0 ? '¡El tiempo corre!' : '¡Se acabó el tiempo!'}
              </p>
            </motion.div>
          )}
          
          {/* Power card special instruction */}
          {isPower && (
            <motion.div
              className="absolute bottom-8 left-8 right-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm opacity-70 font-medium">
                Guarda este poder para usarlo cuando quieras
              </p>
            </motion.div>
          )}

          {/* SubGame choice buttons */}
          {hasSubGames && (
            <motion.div
              className="absolute bottom-6 left-6 right-6 flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextChallenge();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold transition-all"
              >
                Continuar normal
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSubGame?.();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all shadow-lg"
              >
                Cambiar juego
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StoryCard;
