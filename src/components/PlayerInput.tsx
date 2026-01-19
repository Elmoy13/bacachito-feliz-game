import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGame } from '@/context/GameContext';

interface PlayerInputProps {
  compact?: boolean;
  onClose?: () => void;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ compact = false, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const { players, addPlayer, removePlayer } = useGame();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addPlayer(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-x-4 bottom-24 sm:right-6 sm:left-auto sm:w-80 bg-card p-6 shadow-2xl z-50"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="label-uppercase text-muted-foreground">Agregar jugador</span>
          <button onClick={onClose} className="p-1 hover:opacity-60 transition-opacity">
            <X size={18} />
          </button>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nombre..."
          className="input-editorial text-base py-3"
          autoFocus
        />
        <button onClick={handleSubmit} className="btn-editorial w-full mt-4 py-3">
          Agregar
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un nombre..."
          className="input-editorial"
          autoFocus
        />
      </motion.div>

      <motion.button
        onClick={handleSubmit}
        className="btn-editorial w-full mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
        Agregar Jugador
      </motion.button>

      <AnimatePresence mode="popLayout">
        {players.length > 0 && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="label-uppercase text-muted-foreground mb-4">
              Jugadores ({players.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {players.map((player, index) => (
                <motion.button
                  key={player.id}
                  onClick={() => removePlayer(player.id)}
                  className="player-tag group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {player.name}
                  <X size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerInput;
