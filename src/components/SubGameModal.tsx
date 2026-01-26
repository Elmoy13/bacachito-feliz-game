import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubGame, SubGameType, SubGameCard } from '../types/game';
import { subGames } from '../data/subgames';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Timer, ArrowRight, ArrowLeft, Shuffle } from 'lucide-react';

interface SubGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableGames: SubGameType[];
}

export const SubGameModal: React.FC<SubGameModalProps> = ({ isOpen, onClose, availableGames }) => {
  const [selectedGame, setSelectedGame] = useState<SubGame | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<SubGameCard[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const availableSubGames = subGames.filter(game => availableGames.includes(game.id));

  // Iniciar timer cuando se selecciona un juego
  useEffect(() => {
    if (selectedGame && isTimerActive) {
      setTimeRemaining(selectedGame.duration);
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedGame, isTimerActive]);

  const selectGame = (game: SubGame) => {
    setSelectedGame(game);
    // Mezclar cartas
    const shuffled = [...game.cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
    setIsTimerActive(true);
  };

  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Reiniciar al principio
      setCurrentCardIndex(0);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
  };

  const goBackToSelection = () => {
    setSelectedGame(null);
    setIsTimerActive(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-white">
              {selectedGame ? selectedGame.name : '🎮 Subjuegos'}
            </h2>
            {selectedGame && (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                  <Timer size={16} className="text-white" />
                  <span className="text-white font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                {timeRemaining === 0 && (
                  <span className="text-yellow-300 font-semibold animate-pulse">
                    ¡Tiempo terminado!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {!selectedGame ? (
              // Selección de juego
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSubGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 cursor-pointer hover:border-purple-500 transition-all"
                      onClick={() => selectGame(game)}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-3">{game.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{game.description}</p>
                        <div className="flex items-center justify-center gap-2 text-purple-400 text-xs">
                          <Timer size={14} />
                          <span>{game.duration / 60} minutos</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Jugando el subjuego
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCardIndex}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <Card className="p-8 bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500">
                      <div className="text-center">
                        {shuffledCards[currentCardIndex]?.type && (
                          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-white/20 text-white text-sm font-semibold">
                            {shuffledCards[currentCardIndex].type === 'verdad' ? '💬 Verdad' : '🎭 Reto'}
                          </div>
                        )}
                        <p className="text-white text-2xl font-bold leading-relaxed">
                          {shuffledCards[currentCardIndex]?.text}
                        </p>
                        <div className="mt-6 text-purple-300 text-sm">
                          Carta {currentCardIndex + 1} de {shuffledCards.length}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Controles */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    onClick={prevCard}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled={currentCardIndex === 0}
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Anterior
                  </Button>
                  
                  <Button
                    onClick={shuffleCards}
                    variant="outline"
                    size="lg"
                    className="flex-shrink-0"
                  >
                    <Shuffle size={20} />
                  </Button>

                  <Button
                    onClick={nextCard}
                    variant="default"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Siguiente
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>

                <Button
                  onClick={goBackToSelection}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Cambiar de juego
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-900 p-4 border-t border-gray-800">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Volver al juego principal
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
