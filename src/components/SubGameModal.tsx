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
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-[#1a1f35] to-[#0f1219] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden relative border border-white/10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-white pr-10">
              {selectedGame ? selectedGame.name : '🎮 Mini Juegos'}
            </h2>
            {selectedGame && (
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
                  <Timer size={16} className="text-white" />
                  <span className="text-white font-semibold text-sm">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                {timeRemaining === 0 && (
                  <span className="text-amber-300 font-semibold animate-pulse text-sm">
                    ¡Tiempo terminado!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            {!selectedGame ? (
              // Selección de juego
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {availableSubGames.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="p-4 sm:p-6 bg-gradient-to-br from-[#1e2742] to-[#151b2e] border-white/10 cursor-pointer hover:border-blue-500/50 transition-all"
                      onClick={() => selectGame(game)}
                    >
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-3">{game.icon}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{game.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3">{game.description}</p>
                        <div className="flex items-center justify-center gap-2 text-blue-400 text-xs">
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
                    <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-600 to-blue-500 border-0 shadow-xl">
                      <div className="text-center">
                        {shuffledCards[currentCardIndex]?.type && (
                          <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm font-semibold">
                            {shuffledCards[currentCardIndex].type === 'verdad' ? '💬 Verdad' : '🎭 Reto'}
                          </div>
                        )}
                        <p className="text-white text-xl sm:text-2xl font-bold leading-relaxed px-2">
                          {shuffledCards[currentCardIndex]?.text}
                        </p>
                        <div className="mt-4 sm:mt-6 text-blue-200 text-xs sm:text-sm">
                          Carta {currentCardIndex + 1} de {shuffledCards.length}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Controles */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <Button
                    onClick={prevCard}
                    variant="outline"
                    size="lg"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white text-sm sm:text-base"
                    disabled={currentCardIndex === 0}
                  >
                    <ArrowLeft size={18} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                  
                  <Button
                    onClick={shuffleCards}
                    variant="outline"
                    size="lg"
                    className="flex-shrink-0 bg-white/5 border-white/10 hover:bg-white/10 text-white px-3 sm:px-4"
                  >
                    <Shuffle size={18} />
                  </Button>

                  <Button
                    onClick={nextCard}
                    variant="default"
                    size="lg"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight size={18} className="ml-1 sm:ml-2" />
                  </Button>
                </div>

                <Button
                  onClick={goBackToSelection}
                  variant="outline"
                  size="lg"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white text-sm sm:text-base"
                >
                  Cambiar de juego
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#0f1219] p-4 border-t border-white/10">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white text-sm sm:text-base"
            >
              Volver al juego principal
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
