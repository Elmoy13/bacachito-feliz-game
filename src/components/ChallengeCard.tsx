import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import CountdownOverlay from './CountdownOverlay';

const ChallengeCard: React.FC = () => {
  const { 
    currentChallenge, 
    players, 
    currentPlayerIndex, 
    showAnswer, 
    revealAnswer, 
    startCountdown,
    nextChallenge,
    countdownActive 
  } = useGame();

  const currentPlayer = players[currentPlayerIndex % players.length];

  if (!currentChallenge) return null;

  const renderChallengeContent = () => {
    switch (currentChallenge.type) {
      case 'trivia':
        return (
          <div className="space-y-8">
            <motion.p 
              className="label-uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentChallenge.title}
            </motion.p>
            
            <motion.h2 
              className="heading-medium text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {currentChallenge.question}
            </motion.h2>

            <AnimatePresence mode="wait">
              {!showAnswer ? (
                <motion.button
                  key="reveal"
                  onClick={revealAnswer}
                  className="btn-outline-editorial mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ver Respuesta
                </motion.button>
              ) : (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="heading-large italic">{currentChallenge.answer}</p>
                  <p className="body-elegant text-muted-foreground">
                    {currentChallenge.punishment}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'pointing':
        return (
          <div className="space-y-8">
            <motion.p 
              className="label-uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Señalamiento
            </motion.p>
            
            <motion.h2 
              className="heading-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {currentChallenge.title}
            </motion.h2>

            <motion.p 
              className="heading-large italic text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentChallenge.target}
            </motion.p>

            <motion.button
              onClick={startCountdown}
              className="btn-editorial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.98 }}
            >
              Iniciar Cuenta
            </motion.button>

            {showAnswer && (
              <motion.p 
                className="body-elegant text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentChallenge.punishment}
              </motion.p>
            )}
          </div>
        );

      case 'category':
        return (
          <div className="space-y-8">
            <motion.p 
              className="label-uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {currentChallenge.title}
            </motion.p>
            
            <motion.h2 
              className="heading-large italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {currentChallenge.category}
            </motion.h2>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="body-elegant">
                Empieza: <span className="font-medium">{currentPlayer?.name}</span>
              </p>
              <p className="body-small text-muted-foreground">
                Gira a la derecha. {currentChallenge.punishment}
              </p>
            </motion.div>
          </div>
        );

      case 'archetype':
        const getArchetypePlayer = () => {
          if (!players.length) return null;
          // For demo, we just pick based on type
          // In real app, you'd sort by actual age or attribute
          switch (currentChallenge.archetypeType) {
            case 'youngest':
              return players[players.length - 1];
            case 'oldest':
              return players[0];
            default:
              return players[Math.floor(Math.random() * players.length)];
          }
        };
        
        const targetPlayer = getArchetypePlayer();
        const text = currentChallenge.archetypeText?.replace('[Nombre]', targetPlayer?.name || 'Alguien');

        return (
          <div className="space-y-8">
            <motion.p 
              className="label-uppercase text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Arquetipo
            </motion.p>
            
            <motion.h2 
              className="heading-medium text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {text}
            </motion.h2>

            <motion.p 
              className="body-elegant text-muted-foreground italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentChallenge.punishment}
            </motion.p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <CountdownOverlay />
      
      <motion.div 
        className="card-game"
        key={currentChallenge.id}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -30 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {!countdownActive && renderChallengeContent()}

        <motion.button
          onClick={nextChallenge}
          className="btn-ghost-editorial absolute bottom-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
        >
          Siguiente reto →
        </motion.button>
      </motion.div>
    </>
  );
};

export default ChallengeCard;
