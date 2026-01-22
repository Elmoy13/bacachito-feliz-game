import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Users, RotateCcw, Trophy } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import PlayerInput from '@/components/PlayerInput';
import { useGame } from '@/context/GameContext';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { 
    players, 
    isPlaying, 
    resetGame, 
    currentChallenge, 
    isGameOver,
    currentChallengeIndex,
    totalChallenges,
    selectedMode,
    prevChallenge
  } = useGame();
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  // Redirect if no players or not playing
  useEffect(() => {
    if (!isPlaying || players.length < 2) {
      navigate('/setup');
    }
  }, [isPlaying, players.length, navigate]);

  const handleExit = () => {
    resetGame();
    navigate('/');
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/setup');
  };

  if (!isPlaying) return null;

  const isExtreme = currentChallenge?.isExtreme;

  return (
    <motion.div 
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isExtreme ? 'bg-extreme' : 'bg-muted/30'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="relative z-20 pt-6 pb-2 px-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button 
            onClick={handleExit} 
            className={`p-2 rounded-xl transition-all hover:bg-background/10 ${
              isExtreme ? 'text-extreme-foreground' : 'text-foreground'
            }`}
            aria-label="Salir"
          >
            <X size={24} strokeWidth={2} />
          </button>

          {/* Center spacer */}
          <div className="w-10" />

          <button 
            onClick={() => setShowAddPlayer(true)}
            className={`p-2 rounded-xl transition-all hover:bg-background/10 flex items-center gap-1.5 ${
              isExtreme ? 'text-extreme-foreground' : 'text-foreground'
            }`}
            aria-label="Agregar jugador"
          >
            <Users size={20} strokeWidth={2} />
            <span className="font-semibold">{players.length}</span>
          </button>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center relative py-4">
        {isGameOver ? (
          // Game Over Screen
          <motion.div
            className="card-gameover max-w-sm mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Trophy size={64} className="mx-auto mb-6 opacity-90" />
            <h2 className="heading-large mb-3">¡Se acabó!</h2>
            <p className="body-large opacity-90 mb-8">
              {totalChallenges} retos completados con {players.length} valientes.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlayAgain}
                className="btn-secondary text-primary"
              >
                <RotateCcw size={18} className="mr-2" />
                Jugar otra vez
              </button>
              <button
                onClick={() => prevChallenge()}
                className="btn-ghost text-primary-foreground/80"
              >
                Ver cartas anteriores
              </button>
            </div>
          </motion.div>
        ) : (
          <StoryCard />
        )}
      </div>

      {/* Tap hint */}
      {!isGameOver && (
        <motion.div 
          className="pb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className={`body-small ${isExtreme ? 'text-extreme-foreground/60' : 'text-muted-foreground'}`}>
            toca para continuar →
          </p>
        </motion.div>
      )}

      {/* Add Player Modal */}
      <AnimatePresence>
        {showAddPlayer && (
          <motion.div
            className="fixed inset-0 bg-background z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="heading-medium">Agregar jugador</h2>
                <button 
                  onClick={() => setShowAddPlayer(false)}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>
              <PlayerInput />
              <button 
                onClick={() => setShowAddPlayer(false)}
                className="btn-primary w-full mt-8"
              >
                Listo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Game;
