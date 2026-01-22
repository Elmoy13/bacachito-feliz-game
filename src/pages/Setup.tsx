import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import PlayerInput from '@/components/PlayerInput';
import { useGame } from '@/context/GameContext';

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { players, startGame, gameModes, selectedMode, selectMode } = useGame();

  const handleStartGame = () => {
    if (players.length >= 2 && selectedMode) {
      startGame();
      navigate('/game');
    }
  };

  const canStart = players.length >= 2 && selectedMode;

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-ghost -ml-4 mb-6"
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver
          </button>

          <h1 className="heading-large mb-2">
            Arma tu peda
          </h1>
          <p className="body-regular text-muted-foreground">
            Agrega jugadores y elige el modo de juego.
          </p>
        </motion.div>

        {/* Players Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="heading-medium mb-4">
            Jugadores
          </h2>
          <PlayerInput />
          {players.length === 1 && (
            <p className="body-small text-muted-foreground mt-3">
              Agrega al menos un jugador más.
            </p>
          )}
        </motion.section>

        {/* Game Mode Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="heading-medium mb-4">
            Modo de juego
          </h2>
          <div className="grid gap-3">
            {gameModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => selectMode(mode.id)}
                className={`card-mode flex items-center gap-4 text-left w-full ${
                  selectedMode?.id === mode.id ? 'selected' : ''
                }`}
              >
                <span className="text-3xl">{mode.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{mode.name}</h3>
                  <p className="body-small text-muted-foreground">{mode.description}</p>
                </div>
                {selectedMode?.id === mode.id && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check size={14} className="text-primary-foreground" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleStartGame}
            disabled={!canStart}
            className="btn-primary w-full text-base py-4"
          >
            {!selectedMode 
              ? 'Elige un modo' 
              : players.length < 2 
                ? 'Faltan jugadores' 
                : `Empezar con ${players.length} jugadores`
            }
          </button>
          
          {selectedMode && (
            <p className="body-small text-center text-muted-foreground mt-4">
              {selectedMode.challenges?.length || 0} cartas en este modo
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Setup;
