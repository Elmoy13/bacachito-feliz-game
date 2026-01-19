import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Player, Challenge, fallbackChallenges } from '@/types/game';
import { db, collection, getDocs } from '@/lib/firebase';

interface GameContextType {
  players: Player[];
  currentChallengeIndex: number;
  isPlaying: boolean;
  shuffledChallenges: Challenge[];
  currentChallenge: Challenge | null;
  progress: number;
  totalChallenges: number;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  resetGame: () => void;
  getRandomPlayer: () => Player | null;
  getProcessedText: (template: string) => string;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>(fallbackChallenges);
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch challenges from Firebase
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'challenges'));
        const firebaseChallenges: Challenge[] = [];
        
        querySnapshot.forEach((doc) => {
          firebaseChallenges.push({ id: doc.id, ...doc.data() } as Challenge);
        });

        if (firebaseChallenges.length > 0) {
          setChallenges(firebaseChallenges);
        }
      } catch (err) {
        console.warn('Using local challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const addPlayer = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (trimmedName && !players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setPlayers(prev => [...prev, { id: crypto.randomUUID(), name: trimmedName }]);
    }
  }, [players]);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const getRandomPlayer = useCallback((): Player | null => {
    if (players.length === 0) return null;
    return players[Math.floor(Math.random() * players.length)];
  }, [players]);

  const getProcessedText = useCallback((template: string): string => {
    let text = template;
    
    // Replace {player} with random player name
    while (text.includes('{player}')) {
      const player = getRandomPlayer();
      text = text.replace('{player}', player?.name || 'Alguien');
    }
    
    // Replace {player2} with different random player
    if (text.includes('{player2}')) {
      const player = getRandomPlayer();
      text = text.replace('{player2}', player?.name || 'Otro');
    }
    
    return text;
  }, [getRandomPlayer]);

  const startGame = useCallback(() => {
    if (players.length >= 2) {
      // Shuffle challenges for this session
      const shuffled = shuffleArray(challenges);
      setShuffledChallenges(shuffled);
      setCurrentChallengeIndex(0);
      setIsPlaying(true);
    }
  }, [players, challenges]);

  const nextChallenge = useCallback(() => {
    setCurrentChallengeIndex(prev => {
      if (prev >= shuffledChallenges.length - 1) {
        // Reshuffle when we reach the end
        setShuffledChallenges(shuffleArray(challenges));
        return 0;
      }
      return prev + 1;
    });
  }, [shuffledChallenges.length, challenges]);

  const prevChallenge = useCallback(() => {
    setCurrentChallengeIndex(prev => Math.max(0, prev - 1));
  }, []);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setCurrentChallengeIndex(0);
    setShuffledChallenges([]);
  }, []);

  const currentChallenge = useMemo(() => {
    if (shuffledChallenges.length === 0) return null;
    return shuffledChallenges[currentChallengeIndex] || null;
  }, [shuffledChallenges, currentChallengeIndex]);

  const progress = useMemo(() => {
    if (shuffledChallenges.length === 0) return 0;
    return ((currentChallengeIndex + 1) / shuffledChallenges.length) * 100;
  }, [currentChallengeIndex, shuffledChallenges.length]);

  const value: GameContextType = {
    players,
    currentChallengeIndex,
    isPlaying,
    shuffledChallenges,
    currentChallenge,
    progress,
    totalChallenges: shuffledChallenges.length,
    addPlayer,
    removePlayer,
    startGame,
    nextChallenge,
    prevChallenge,
    resetGame,
    getRandomPlayer,
    getProcessedText,
    isLoading,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
