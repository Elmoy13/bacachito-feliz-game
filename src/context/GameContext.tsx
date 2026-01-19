import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Player, Challenge, GameState, fallbackChallenges } from '@/types/game';
import { db, collection, getDocs } from '@/lib/firebase';

interface GameContextType extends GameState {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  nextChallenge: () => void;
  revealAnswer: () => void;
  startCountdown: () => void;
  resetGame: () => void;
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [challenges, setChallenges] = useState<Challenge[]>(fallbackChallenges);
  const [usedChallenges, setUsedChallenges] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError(null);
        } else {
          // Use fallback if no challenges in Firebase
          setChallenges(fallbackChallenges);
        }
      } catch (err) {
        console.warn('Firebase connection failed, using local challenges:', err);
        setChallenges(fallbackChallenges);
        setError('Modo offline: usando retos locales');
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

  const getRandomChallenge = useCallback((): Challenge => {
    // Get available challenges (not used yet)
    let available = challenges.filter(c => !usedChallenges.has(c.id));
    
    // If all challenges used, reset
    if (available.length === 0) {
      setUsedChallenges(new Set());
      available = challenges;
    }

    // Pick random challenge
    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];
    
    // Mark as used
    setUsedChallenges(prev => new Set([...prev, selected.id]));
    
    return selected;
  }, [challenges, usedChallenges]);

  const getCurrentPlayer = useCallback((): Player | null => {
    if (players.length === 0) return null;
    return players[currentPlayerIndex % players.length];
  }, [players, currentPlayerIndex]);

  const startGame = useCallback(() => {
    if (players.length >= 2) {
      setIsPlaying(true);
      setUsedChallenges(new Set());
      const challenge = getRandomChallenge();
      setCurrentChallenge(challenge);
      setCurrentPlayerIndex(Math.floor(Math.random() * players.length));
    }
  }, [players, getRandomChallenge]);

  const nextChallenge = useCallback(() => {
    setShowAnswer(false);
    setCountdownActive(false);
    setCountdownValue(3);
    const challenge = getRandomChallenge();
    setCurrentChallenge(challenge);
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
  }, [getRandomChallenge, players.length]);

  const revealAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const startCountdown = useCallback(() => {
    setCountdownActive(true);
    setCountdownValue(3);
    
    const interval = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setCountdownActive(false);
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setCurrentChallenge(null);
    setShowAnswer(false);
    setCountdownActive(false);
    setCountdownValue(3);
    setUsedChallenges(new Set());
    setCurrentPlayerIndex(0);
  }, []);

  const value: GameContextType = {
    players,
    currentPlayerIndex,
    currentChallenge,
    isPlaying,
    showAnswer,
    countdownActive,
    countdownValue,
    challenges,
    isLoading,
    error,
    addPlayer,
    removePlayer,
    startGame,
    nextChallenge,
    revealAnswer,
    startCountdown,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
