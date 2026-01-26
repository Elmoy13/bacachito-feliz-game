import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Users, Plus, RotateCcw, Trophy, Clock } from 'lucide-react';
import StoryCard from '@/components/StoryCard';
import PlayerInput from '@/components/PlayerInput';
import { SubGameModal } from '@/components/SubGameModal';
import { useGame } from '@/context/GameContext';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { 
    players, 
    isPlaying, 
    resetGame, 
    currentChallenge, 
    isGameOver,
    totalChallenges,
    prevChallenge,
    activeTimedCards,
    removeTimedCard
  } = useGame();
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [expandedTimedCard, setExpandedTimedCard] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showSubGameModal, setShowSubGameModal] = useState(false);

  // Don't auto-open subgame modal - let user choose

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-remove expired timed cards
  useEffect(() => {
    activeTimedCards.forEach((card, index) => {
      const elapsed = (currentTime - card.startTime) / 1000;
      if (elapsed >= card.duration) {
        removeTimedCard(index);
      }
    });
  }, [currentTime, activeTimedCards, removeTimedCard]);

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
  const isPower = currentChallenge?.isPower;
  const isTimed = currentChallenge?.type === 'timed';
  const isCategory = currentChallenge?.type === 'category';

  // Get background color based on card type
  const getBgClass = () => {
    if (isExtreme) return 'bg-gradient-to-br from-red-600 to-red-800';
    if (isPower) return 'bg-gradient-to-br from-purple-600 to-purple-800';
    if (isTimed) return 'bg-gradient-to-br from-amber-500 to-orange-600';
    if (isCategory) return 'bg-gradient-to-br from-blue-500 to-blue-700';
    return 'bg-gradient-to-br from-primary to-blue-700';
  };

  return (
    <motion.div 
      className={`min-h-screen flex flex-col transition-all duration-500 ${getBgClass()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="relative z-20 pt-6 pb-2 px-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button 
            onClick={handleExit} 
            className="p-2.5 rounded-xl transition-all hover:bg-white/10 text-white"
            aria-label="Salir"
          >
            <X size={24} strokeWidth={2} />
          </button>

          {/* Active Timed Cards */}
          <div className="flex items-center gap-2">
            {activeTimedCards.map((card, index) => {
              const elapsed = (currentTime - card.startTime) / 1000;
              const remaining = Math.max(0, card.duration - elapsed);
              const minutes = Math.floor(remaining / 60);
              const seconds = Math.floor(remaining % 60);
              
              return (
                <motion.button
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => setExpandedTimedCard(index)}
                  className="relative bg-amber-500/90 backdrop-blur-sm text-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-amber-600/90 transition-colors"
                >
                  <Clock size={16} />
                  <span className="text-sm font-bold">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <button 
            onClick={() => setShowAddPlayer(true)}
            className="p-2.5 rounded-xl transition-all hover:bg-white/10 flex items-center gap-2 text-white"
            aria-label="Agregar jugador"
          >
            <Users size={20} strokeWidth={2} />
            <Plus size={16} strokeWidth={2.5} className="-ml-1" />
            <span className="font-bold">{players.length}</span>
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
            <h2 className="heading-large mb-3">¡Partida terminada!</h2>
            <p className="body-large opacity-90 mb-2">
              {totalChallenges} retos completados
            </p>
            <p className="body-regular opacity-75 mb-8">
              con {players.length} valiente{players.length > 1 ? 's' : ''}: {players.map(p => p.name).join(', ')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlayAgain}
                className="btn-secondary text-primary"
              >
                <RotateCcw size={18} className="mr-2" />
                Nueva partida
              </button>
              <button
                onClick={() => prevChallenge()}
                className="btn-ghost text-primary-foreground/80"
              >
                Ver cartas anteriores
              </button>
              <button
                onClick={handleExit}
                className="btn-ghost text-primary-foreground/60 text-sm"
              >
                Salir al menú
              </button>
            </div>
          </motion.div>
        ) : (
          <StoryCard onOpenSubGame={() => setShowSubGameModal(true)} />
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
          <p className="body-small text-white/60">
            toca para continuar
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
                <h2 className="heading-medium">Jugadores</h2>
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

      {/* Expanded Timed Card Modal */}
      <AnimatePresence>
        {expandedTimedCard !== null && activeTimedCards[expandedTimedCard] && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedTimedCard(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white">
                  <Clock size={24} />
                  <span className="text-lg font-bold">
                    {(() => {
                      const card = activeTimedCards[expandedTimedCard];
                      const elapsed = (currentTime - card.startTime) / 1000;
                      const remaining = Math.max(0, card.duration - elapsed);
                      const minutes = Math.floor(remaining / 60);
                      const seconds = Math.floor(remaining % 60);
                      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    })()}
                  </span>
                </div>
                <button
                  onClick={() => setExpandedTimedCard(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {activeTimedCards[expandedTimedCard].processedText}
              </h3>
              <p className="text-white/90 text-lg">
                {activeTimedCards[expandedTimedCard].challenge.subtitle}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SubGame Modal */}
      {currentChallenge?.hasSubGames && currentChallenge?.subGames && (
        <SubGameModal
          isOpen={showSubGameModal}
          onClose={() => setShowSubGameModal(false)}
          availableGames={currentChallenge.subGames}
        />
      )}
    </motion.div>
  );
};

export default Game;
