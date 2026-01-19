import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';

const ProgressBar: React.FC = () => {
  const { shuffledChallenges, currentChallengeIndex } = useGame();

  if (shuffledChallenges.length === 0) return null;

  // Show individual segments like Instagram stories
  const segments = Math.min(shuffledChallenges.length, 20); // Max 20 visible segments
  const segmentWidth = 100 / segments;

  return (
    <div className="w-full flex gap-1 px-4">
      {Array.from({ length: segments }).map((_, index) => {
        const isActive = index === currentChallengeIndex % segments;
        const isCompleted = index < currentChallengeIndex % segments;
        
        return (
          <div
            key={index}
            className="h-1 flex-1 bg-foreground/20 overflow-hidden"
          >
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: isCompleted ? '100%' : '0%' }}
              animate={{ 
                width: isCompleted ? '100%' : isActive ? '100%' : '0%' 
              }}
              transition={{ 
                duration: isActive ? 0.3 : 0,
                ease: 'easeOut'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
