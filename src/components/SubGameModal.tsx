import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubGame, SubGameType, SubGameCard } from '../types/game';
import { subGames } from '../data/subgames';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  X, Timer, ArrowRight, ArrowLeft, Shuffle, 
  MessageCircleQuestion, Ban, Users, XCircle, Heart, Flame,
  Clock, Gamepad2, ChevronLeft, Sparkles
} from 'lucide-react';

interface SubGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableGames: SubGameType[];
}

// Map game IDs to icons
const gameIcons: Record<SubGameType, React.ReactNode> = {
  'verdad-reto': <MessageCircleQuestion size={32} />,
  'yo-nunca': <Ban size={32} />,
  'quien-es-mas': <Users size={32} />,
  'nunca-he': <XCircle size={32} />,
  'confesiones': <Heart size={32} />,
  'retos-hot': <Flame size={32} />,
};

// Card type icons
const cardTypeIcons = {
  verdad: <MessageCircleQuestion size={16} />,
  reto: <Sparkles size={16} />,
};

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
    const shuffled = [...game.cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
    setIsTimerActive(true);
  };

  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
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

  const getCardGradient = () => {
    if (!selectedGame) return 'from-primary to-blue-600';
    switch (selectedGame.id) {
      case 'verdad-reto': return 'from-violet-600 to-purple-700';
      case 'yo-nunca': return 'from-rose-600 to-red-700';
      case 'quien-es-mas': return 'from-blue-600 to-indigo-700';
      case 'nunca-he': return 'from-amber-500 to-orange-600';
      case 'confesiones': return 'from-pink-600 to-rose-700';
      case 'retos-hot': return 'from-red-600 to-rose-800';
      default: return 'from-primary to-blue-600';
    }
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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden relative border border-white/10"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${getCardGradient()} p-4 sm:p-6 relative`}>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              {selectedGame && (
                <button
                  onClick={goBackToSelection}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <div className="flex items-center gap-3">
                {selectedGame ? (
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    {gameIcons[selectedGame.id]}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <Gamepad2 size={24} />
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedGame ? selectedGame.name : 'Mini Juegos'}
                </h2>
              </div>
            </div>
            
            {selectedGame && (
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock size={16} className="text-white" />
                  <span className={`text-white font-bold ${timeRemaining <= 30 ? 'animate-pulse text-amber-200' : ''}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                {timeRemaining === 0 && (
                  <span className="text-amber-200 font-bold animate-pulse">
                    ¡Tiempo terminado!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
            {!selectedGame ? (
              // Game Selection Grid
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSubGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Card
                      className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 border-white/10 cursor-pointer hover:border-white/30 transition-all group"
                      onClick={() => selectGame(game)}
                    >
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          {gameIcons[game.id]}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white mb-1">{game.name}</h3>
                        <p className="text-gray-400 text-xs line-clamp-2">{game.description}</p>
                        <div className="flex items-center justify-center gap-1 text-white/50 text-xs mt-2">
                          <Timer size={12} />
                          <span>{game.duration / 60} min</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Playing the subgame
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCardIndex}
                    initial={{ x: 100, opacity: 0, rotateY: -15 }}
                    animate={{ x: 0, opacity: 1, rotateY: 0 }}
                    exit={{ x: -100, opacity: 0, rotateY: 15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <Card className={`p-6 sm:p-8 bg-gradient-to-br ${getCardGradient()} border-0 shadow-2xl min-h-[200px] flex flex-col justify-center`}>
                      <div className="text-center">
                        {shuffledCards[currentCardIndex]?.type && (
                          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold">
                            {cardTypeIcons[shuffledCards[currentCardIndex].type as 'verdad' | 'reto']}
                            <span>{shuffledCards[currentCardIndex].type === 'verdad' ? 'Verdad' : 'Reto'}</span>
                          </div>
                        )}
                        <p className="text-white text-lg sm:text-xl font-bold leading-relaxed">
                          {shuffledCards[currentCardIndex]?.text}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="flex items-center justify-between gap-2">
                  <Button
                    onClick={prevCard}
                    variant="outline"
                    size="lg"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    disabled={currentCardIndex === 0}
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                  
                  <Button
                    onClick={shuffleCards}
                    variant="outline"
                    size="lg"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white px-4"
                  >
                    <Shuffle size={18} />
                  </Button>

                  <Button
                    onClick={nextCard}
                    size="lg"
                    className={`flex-1 bg-gradient-to-r ${getCardGradient()} hover:opacity-90 text-white border-0`}
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-900/80 backdrop-blur-sm p-4 border-t border-white/10">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <X size={16} className="mr-2" />
              Volver al juego principal
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
