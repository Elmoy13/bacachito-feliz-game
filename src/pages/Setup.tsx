import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Blob from '@/components/Blob';
import PlayerInput from '@/components/PlayerInput';
import { useGame } from '@/context/GameContext';

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { players, startGame, isLoading, error } = useGame();

  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-12">
      {/* Background Blobs */}
      <Blob className="blob-1 opacity-50" delay={0} />
      <Blob className="blob-2 opacity-50" delay={0.2} />

      {/* Header */}
      <motion.div 
        className="relative z-10 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={() => navigate('/')}
          className="btn-ghost-editorial mb-8 -ml-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver
        </button>

        <motion.h1
          className="heading-large mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ¿Quiénes
          <br />
          <span className="italic">la arman?</span>
        </motion.h1>

        <motion.p
          className="body-elegant text-muted-foreground mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Agrega a los valientes que participarán esta noche.
        </motion.p>

        {error && (
          <motion.p
            className="body-small text-muted-foreground mb-4 bg-secondary px-4 py-2 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <PlayerInput />

        {players.length >= 2 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={handleStartGame}
              className="btn-editorial w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando retos...' : 'Comenzar Juego'}
            </button>
          </motion.div>
        )}

        {players.length < 2 && players.length > 0 && (
          <motion.p
            className="body-small text-muted-foreground mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Mínimo 2 jugadores para empezar.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Setup;
