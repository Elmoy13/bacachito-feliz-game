import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import Blob from '@/components/Blob';
import ChallengeCard from '@/components/ChallengeCard';
import FloatingAddButton from '@/components/FloatingAddButton';
import { useGame } from '@/context/GameContext';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { players, isPlaying, resetGame, currentPlayerIndex } = useGame();

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

  const currentPlayer = players[currentPlayerIndex % players.length];

  if (!isPlaying) return null;

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-8">
      {/* Background Blobs */}
      <Blob className="blob-1 opacity-30" delay={0} />
      <Blob className="blob-2 opacity-30" delay={0.2} />

      {/* Header */}
      <motion.div 
        className="relative z-10 flex items-center justify-between max-w-lg mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button onClick={handleExit} className="btn-ghost-editorial -ml-4">
          <ArrowLeft size={16} className="mr-2" />
          Salir
        </button>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={16} />
          <span className="body-small">{players.length}</span>
        </div>
      </motion.div>

      {/* Current Player Indicator */}
      <motion.div
        className="relative z-10 text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="label-uppercase text-muted-foreground mb-1">Turno de</p>
        <p className="heading-medium italic">{currentPlayer?.name}</p>
      </motion.div>

      {/* Challenge Card */}
      <div className="relative z-10 flex justify-center">
        <ChallengeCard />
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton />
    </div>
  );
};

export default Game;
