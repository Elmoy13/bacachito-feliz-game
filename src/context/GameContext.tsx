import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { Player, Challenge } from '@/types/game';
import { gameModes, getChallengesByMode, GameMode } from '@/data/challenges';
import { saveGameSession, trackEvent } from '@/lib/firebase';
import { incrementGamesPlayed } from '@/components/pwa/InstallPrompt';
import type { CustomCard } from '@/types/customCards';
import type { SlangRegion } from '@/types/slang';
import { DEFAULT_REGION, SLANG_STORAGE_KEY } from '@/types/slang';

export interface ActiveTimedCard {
  challenge: Challenge;
  startTime: number;
  duration: number;
  processedText: string;
  cardIndex: number; // Agregamos índice para identificar cartas únicas
}

export interface CustomCardsConfig {
  enabled: boolean;
  selectedPackIds: string[];
  includeNoPack: boolean;
  customCardCount: number;
  cards: CustomCard[];
}

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
  activeTimedCards: ActiveTimedCard[];
  customCardsConfig: CustomCardsConfig;
  setCustomCardsConfig: (config: CustomCardsConfig) => void;
  slangRegion: SlangRegion;
  setSlangRegion: (region: SlangRegion) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  selectMode: (modeId: string) => void;
  startGame: () => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
  resetGame: () => void;
  getProcessedText: (template: string) => string;
  removeTimedCard: (index: number) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Fisher-Yates shuffle mejorado con mejor randomización
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  // Múltiples pasadas de shuffle para mejor aleatoriedad
  for (let pass = 0; pass < 3; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  return shuffled;
};

// Selecciona un subset aleatorio y balanceado de cartas
const selectBalancedChallenges = (challenges: Challenge[], count: number = 40): Challenge[] => {
  // Separar por tipos para balance
  const byType: Record<string, Challenge[]> = {};
  
  challenges.forEach(challenge => {
    const type = challenge.type;
    if (!byType[type]) {
      byType[type] = [];
    }
    byType[type].push(challenge);
  });
  
  // Mezclar cada tipo independientemente
  Object.keys(byType).forEach(type => {
    byType[type] = shuffleArray(byType[type]);
  });
  
  const selected: Challenge[] = [];
  
  // Función helper para agregar variación aleatoria a un porcentaje
  const randomVariation = (base: number, variation: number = 0.02) => {
    const rand = (Math.random() - 0.5) * 2 * variation; // -variation a +variation
    return Math.max(0, base + rand);
  };
  
  // Distribución variable: cada partida es diferente
  const normalTotal = randomVariation(0.70, 0.05); // 65-75% cartas normales
  const specialTotal = 1 - normalTotal;
  
  // Distribuir cartas normales con variación
  const directPct = randomVariation(0.20, 0.03);
  const groupPct = randomVariation(0.18, 0.03);
  const categoryPct = randomVariation(0.15, 0.03);
  const votePct = randomVariation(0.10, 0.02);
  const randomPct = randomVariation(0.07, 0.02);
  
  // Distribuir cartas especiales con variación
  const timedPct = randomVariation(0.10, 0.03);
  const powerPct = randomVariation(0.10, 0.03);
  const extremePct = randomVariation(0.10, 0.03);
  
  const distribution = {
    'direct': Math.floor(count * directPct * normalTotal),
    'group': Math.floor(count * groupPct * normalTotal),
    'category': Math.floor(count * categoryPct * normalTotal),
    'vote': Math.floor(count * votePct * normalTotal),
    'random': Math.floor(count * randomPct * normalTotal),
    'timed': Math.floor(count * timedPct * specialTotal),
    'power': Math.floor(count * powerPct * specialTotal),
    'extreme': Math.floor(count * extremePct * specialTotal),
  };
  
  // Tomar cartas según la distribución
  Object.keys(distribution).forEach(type => {
    const takeCount = distribution[type];
    const available = byType[type] || [];
    const toTake = Math.min(takeCount, available.length);
    selected.push(...available.slice(0, toTake));
  });
  
  // Si no alcanzamos el count, completar con cartas normales prioritariamente
  if (selected.length < count) {
    const normalTypes = ['direct', 'group', 'category', 'vote', 'random'];
    const remaining = challenges.filter(c => 
      !selected.includes(c) && normalTypes.includes(c.type)
    );
    const shuffledRemaining = shuffleArray(remaining);
    const needed = count - selected.length;
    selected.push(...shuffledRemaining.slice(0, needed));
  }
  
  // GARANTIZAR que al menos 1 carta con subjuegos esté incluida
  const hasSubGameCard = selected.some(c => c.hasSubGames);
  if (!hasSubGameCard) {
    // Buscar todas las cartas con subjuegos disponibles
    const subGameCards = challenges.filter(c => c.hasSubGames);
    if (subGameCards.length > 0) {
      // Seleccionar una al azar
      const randomSubGameCard = subGameCards[Math.floor(Math.random() * subGameCards.length)];
      // Reemplazar una carta normal aleatoria (que no sea especial)
      const normalCardIndex = selected.findIndex(c => 
        ['direct', 'group', 'category', 'vote', 'random'].includes(c.type) && !c.hasSubGames
      );
      if (normalCardIndex !== -1) {
        selected[normalCardIndex] = randomSubGameCard;
      }
    }
  }
  
  // Shuffle final para que no estén agrupadas por tipo
  return shuffleArray(selected);
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [activeTimedCards, setActiveTimedCards] = useState<ActiveTimedCard[]>([]);
  const [customCardsConfig, setCustomCardsConfig] = useState<CustomCardsConfig>({
    enabled: false,
    selectedPackIds: [],
    includeNoPack: true,
    customCardCount: 15,
    cards: [],
  });
  const [slangRegion, setSlangRegionState] = useState<SlangRegion>(() => {
    try {
      return (localStorage.getItem(SLANG_STORAGE_KEY) as SlangRegion) || DEFAULT_REGION;
    } catch {
      return DEFAULT_REGION;
    }
  });

  const setSlangRegion = useCallback((region: SlangRegion) => {
    setSlangRegionState(region);
    try { localStorage.setItem(SLANG_STORAGE_KEY, region); } catch { /* ignore */ }
  }, []);
  
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
      
      // Determine custom cards to include
      let customChallenges: Challenge[] = [];
      let customCount = 0;
      
      if (customCardsConfig.enabled && customCardsConfig.cards.length > 0) {
        // Filter cards by selected packs
        let pool = customCardsConfig.cards.filter((c) => {
          if (customCardsConfig.includeNoPack && !c.packId) return true;
          if (c.packId && customCardsConfig.selectedPackIds.includes(c.packId)) return true;
          return false;
        });
        
        // Filter by current game mode
        pool = pool.filter((c) => {
          if (!c.modes || c.modes.length === 0) return true; // no modes = all modes
          return c.modes.includes(selectedMode.id);
        });
        
        // Weighted selection based on probability
        // probability 1 (Baja) = weight 1, probability 2 (Normal) = weight 2, probability 3 (Alta) = weight 4
        const probabilityWeights: Record<number, number> = { 1: 1, 2: 2, 3: 4 };
        
        // Build weighted pool: repeat cards based on their probability weight
        const weightedPool: typeof pool = [];
        pool.forEach((card) => {
          const weight = probabilityWeights[card.probability || 2];
          for (let i = 0; i < weight; i++) {
            weightedPool.push(card);
          }
        });
        
        // Shuffle weighted pool and pick unique cards up to customCardCount
        const shuffledWeighted = shuffleArray(weightedPool);
        const pickedIds = new Set<string>();
        const pickedCards: typeof pool = [];
        
        for (const card of shuffledWeighted) {
          if (pickedIds.has(card.id)) continue;
          pickedIds.add(card.id);
          pickedCards.push(card);
          if (pickedCards.length >= customCardsConfig.customCardCount) break;
        }
        
        customCount = pickedCards.length;
        
        // Convert CustomCard to Challenge
        customChallenges = pickedCards.map((cc) => ({
          id: `custom-${cc.id}`,
          type: cc.type,
          template: cc.text,
          duration: cc.timerSeconds,
          isExtreme: cc.type === 'extreme',
          isPower: cc.type === 'power',
          isCustom: true,
        } as Challenge & { isCustom: boolean }));
      }
      
      // Reduce base cards proportionally to make room for custom
      // Random card count between 30-40 per game
      const totalTarget = 30 + Math.floor(Math.random() * 11);
      const baseCount = Math.min(totalTarget - customCount, challenges.length);
      const selectedChallenges = selectBalancedChallenges(challenges, baseCount);
      
      // Merge and shuffle
      const allChallenges = shuffleArray([...selectedChallenges, ...customChallenges]);
      
      setShuffledChallenges(allChallenges);
      setCurrentChallengeIndex(0);
      setIsPlaying(true);
      setIsGameOver(false);
      setActiveTimedCards([]);
      usedPlayersRef.current.clear();
      
      // Track custom cards analytics
      if (customCount > 0) {
        trackEvent('custom_cards_used_in_game', {
          custom_card_count: customCount,
          total_cards: allChallenges.length,
          mode: selectedMode.id,
        });
      }

      // Track slang region
      trackEvent('slang_region_distribution', { region: slangRegion });
      
      // Save game session to Firebase silently
      try {
        const playerNames = players.map(p => p.name);
        const sessionId = await saveGameSession(playerNames, selectedMode.name);
        console.log('Partida iniciada y guardada:', sessionId);
      } catch (error) {
        console.error('Error al guardar la partida:', error);
      }
    }
  }, [players, selectedMode, customCardsConfig, slangRegion]);

  const nextChallenge = useCallback(() => {
    // Si la carta actual es timed, agregarla a las cartas activas
    const current = shuffledChallenges[currentChallengeIndex];
    if (current?.type === 'timed' && current.duration) {
      // Verificar si ya existe un timer activo para esta carta
      const alreadyActive = activeTimedCards.some(card => card.cardIndex === currentChallengeIndex);
      
      if (!alreadyActive) {
        const processedText = getProcessedText(current.template);
        const newTimedCard: ActiveTimedCard = {
          challenge: current,
          startTime: Date.now(),
          duration: current.duration,
          processedText,
          cardIndex: currentChallengeIndex
        };
        setActiveTimedCards(prev => [...prev, newTimedCard]);
      }
    }
    
    if (currentChallengeIndex >= shuffledChallenges.length - 1) {
      setIsGameOver(true);
      incrementGamesPlayed();
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  }, [currentChallengeIndex, shuffledChallenges, getProcessedText, activeTimedCards]);

  const prevChallenge = useCallback(() => {
    if (isGameOver) {
      setIsGameOver(false);
    } else {
      setCurrentChallengeIndex(prev => Math.max(0, prev - 1));
    }
  }, [isGameOver]);

  const removeTimedCard = useCallback((index: number) => {
    setActiveTimedCards(prev => prev.filter((_, i) => i !== index));
  }, []);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setCurrentChallengeIndex(0);
    setShuffledChallenges([]);
    setIsGameOver(false);
    setActiveTimedCards([]);
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
    activeTimedCards,
    customCardsConfig,
    setCustomCardsConfig,
    slangRegion,
    setSlangRegion,
    addPlayer,
    removePlayer,
    selectMode,
    startGame,
    nextChallenge,
    prevChallenge,
    resetGame,
    getProcessedText,
    removeTimedCard,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
