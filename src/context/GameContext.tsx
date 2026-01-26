import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { Player, Challenge } from '@/types/game';
import { gameModes, getChallengesByMode, GameMode } from '@/data/challenges';
import { saveGameSession } from '@/lib/firebase';

interface GameContextType {
  players: Player[];
  currentChallengeIndex: number;
  isPlaying: boolean;
  shuffledChallenges: Challenge[];
  currentChallenge: Challenge | null;
  totalChallenges: number;
  isGameOver: boolean;
  selectedMode: GameMode | null;
  gameModes: GameMode[];
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  selectMode: (modeId: string) => void;
  startGame: () => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  resetGame: () => void;
  getProcessedText: (template: string) => string;
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
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  
  // Keep track of used player combinations to avoid repeats
  const usedPlayersRef = useRef<Set<string>>(new Set());

  const addPlayer = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (trimmedName && !players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setPlayers(prev => [...prev, { id: crypto.randomUUID(), name: trimmedName }]);
    }
  }, [players]);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const selectMode = useCallback((modeId: string) => {
    const mode = gameModes.find(m => m.id === modeId);
    setSelectedMode(mode || null);
  }, []);

  // Get a random player that hasn't been used recently, avoiding duplicates
  const getRandomPlayer = useCallback((excludeNames: string[] = []): Player | null => {
    if (players.length === 0) return null;
    
    const availablePlayers = players.filter(p => !excludeNames.includes(p.name));
    
    if (availablePlayers.length === 0) {
      // If all players are excluded, just return a random one
      return players[Math.floor(Math.random() * players.length)];
    }
    
    return availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
  }, [players]);

  // Process text with player names - ensures {player} and {player2} are different
  const getProcessedText = useCallback((template: string): string => {
    let text = template;
    const usedNames: string[] = [];
    
    // Replace all {player} instances with different random players
    while (text.includes('{player}')) {
      const player = getRandomPlayer(usedNames);
      const name = player?.name || 'Alguien';
      usedNames.push(name);
      text = text.replace('{player}', name);
    }
    
    // Replace {player2} with a different player than those already used
    if (text.includes('{player2}')) {
      const player2 = getRandomPlayer(usedNames);
      text = text.replace('{player2}', player2?.name || 'Otro');
    }
    
    return text;
  }, [getRandomPlayer]);

  const startGame = useCallback(async () => {
    if (players.length >= 2 && selectedMode) {
      const challenges = getChallengesByMode(selectedMode.id);
      const shuffled = shuffleArray(challenges);
      setShuffledChallenges(shuffled);
      setCurrentChallengeIndex(0);
      setIsPlaying(true);
      setIsGameOver(false);
      usedPlayersRef.current.clear();
      
      // Save game session to Firebase silently
      try {
        const playerNames = players.map(p => p.name);
        const sessionId = await saveGameSession(playerNames, selectedMode.name);
        console.log('Partida iniciada y guardada:', sessionId);
      } catch (error) {
        console.error('Error al guardar la partida:', error);
      }
    }
  }, [players, selectedMode]);

  const nextChallenge = useCallback(() => {
    if (currentChallengeIndex >= shuffledChallenges.length - 1) {
      setIsGameOver(true);
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  }, [currentChallengeIndex, shuffledChallenges.length]);

  const prevChallenge = useCallback(() => {
    if (isGameOver) {
      setIsGameOver(false);
    } else {
      setCurrentChallengeIndex(prev => Math.max(0, prev - 1));
    }
  }, [isGameOver]);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setCurrentChallengeIndex(0);
    setShuffledChallenges([]);
    setIsGameOver(false);
    usedPlayersRef.current.clear();
  }, []);

  const currentChallenge = useMemo(() => {
    if (shuffledChallenges.length === 0 || isGameOver) return null;
    return shuffledChallenges[currentChallengeIndex] || null;
  }, [shuffledChallenges, currentChallengeIndex, isGameOver]);

  const value: GameContextType = {
    players,
    currentChallengeIndex,
    isPlaying,
    shuffledChallenges,
    currentChallenge,
    totalChallenges: shuffledChallenges.length,
    isGameOver,
    selectedMode,
    gameModes,
    addPlayer,
    removePlayer,
    selectMode,
    startGame,
    nextChallenge,
    prevChallenge,
    resetGame,
    getProcessedText,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
