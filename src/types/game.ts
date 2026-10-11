export type ChallengeType = 'direct' | 'group' | 'category' | 'extreme' | 'vote' | 'random' | 'timed' | 'power' | 'prefieres';

export type SubGameType = 'verdad-reto' | 'yo-nunca' | 'quien-es-mas' | 'nunca-he' | 'confesiones' | 'retos-hot';

export interface SubGameCard {
  id: string;
  text: string;
  type?: 'verdad' | 'reto'; // Solo para verdad-reto
}

export interface SubGame {
  id: SubGameType;
  name: string;
  description: string;
  icon: string;
  cards: SubGameCard[];
  duration: number; // Duración en segundos
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  template: string; // Uses {player} for random player insertion
  subtitle?: string;
  isExtreme?: boolean;
  isPower?: boolean;
  duration?: number; // Duration in seconds for timed challenges
  hasSubGames?: boolean; // Indica si esta carta tiene subjuegos disponibles
  subGames?: SubGameType[]; // Lista de subjuegos disponibles para esta carta
  // Solo para type 'prefieres' ("¿Qué prefieres?"): template = '¿Qué prefieres?' (o un lead-in corto)
  optionA?: string; // 👍 Opción A (puede usar {player})
  optionB?: string; // 👎 Opción B (puede usar {player})
  sips?: number; // Tragos que toma la minoría (default PREFIERES_DEFAULT_SIPS)
}

// Tragos por defecto que toma la minoría en cartas "¿Qué prefieres?"
export const PREFIERES_DEFAULT_SIPS = 2;

export interface Player {
  id: string;
  name: string;
}

export interface GameState {
  players: Player[];
  currentChallengeIndex: number;
  challenges: Challenge[];
  isPlaying: boolean;
}

// Active power cards tracking
export interface ActivePower {
  playerId: string;
  playerName: string;
  powerType: string;
  description: string;
}
