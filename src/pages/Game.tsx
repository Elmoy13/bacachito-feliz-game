import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Users } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import ProgressBar from '@/components/ProgressBar';
import PlayerInput from '@/components/PlayerInput';
import { useGame } from '@/context/GameContext';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { players, isPlaying, resetGame, currentChallenge } = useGame();
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

  if (!isPlaying) return null;

  const isExtreme = currentChallenge?.isExtreme;

  return (
    <motion.div 
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isExtreme ? 'bg-extreme' : 'bg-background'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="relative z-20 pt-4 pb-2">
        {/* Progress Bar */}
        <ProgressBar />

        {/* Controls */}
        <div className="flex items-center justify-between px-4 mt-4">
          <button 
            onClick={handleExit} 
            className={`p-2 transition-opacity hover:opacity-60 ${
              isExtreme ? 'text-extreme-foreground' : 'text-foreground'
            }`}
            aria-label="Salir"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          <motion.h1 
            className={`font-serif text-lg italic ${
              isExtreme ? 'text-extreme-foreground' : 'text-foreground'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Bacachito
          </motion.h1>

          <button 
            onClick={() => setShowAddPlayer(true)}
            className={`p-2 transition-opacity hover:opacity-60 flex items-center gap-1 ${
              isExtreme ? 'text-extreme-foreground' : 'text-foreground'
            }`}
            aria-label="Agregar jugador"
          >
            <Users size={18} strokeWidth={1.5} />
            <span className="text-sm">{players.length}</span>
          </button>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center relative">
        <StoryCard />
      </div>

      {/* Add Player Modal */}
      <AnimatePresence>
        {showAddPlayer && (
          <motion.div
            className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="heading-medium">Agregar</h2>
                <button 
                  onClick={() => setShowAddPlayer(false)}
                  className="p-2 hover:opacity-60 transition-opacity"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <PlayerInput />
              <button 
                onClick={() => setShowAddPlayer(false)}
                className="btn-editorial w-full mt-8"
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
