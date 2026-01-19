import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';

const CountdownOverlay: React.FC = () => {
  const { countdownActive, countdownValue, currentChallenge, revealAnswer } = useGame();

  return (
    <AnimatePresence>
      {countdownActive && (
        <motion.div
          className="fixed inset-0 bg-background z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            if (countdownValue === 0) {
              revealAnswer();
            }
          }}
        >
          <AnimatePresence mode="wait">
            {countdownValue > 0 ? (
              <motion.span
                key={countdownValue}
                className="countdown-number"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                {countdownValue}
              </motion.span>
            ) : (
              <motion.div
                key="action"
                className="text-center px-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="heading-display mb-4">¡Señalen!</h2>
                <p className="body-elegant text-muted-foreground">
                  {currentChallenge?.punishment}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CountdownOverlay;
