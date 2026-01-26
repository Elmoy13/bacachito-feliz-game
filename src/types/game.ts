export type ChallengeType = 'direct' | 'group' | 'category' | 'extreme' | 'vote' | 'random' | 'timed' | 'power';

export interface Challenge {
  id: string;
  type: ChallengeType;
  template: string; // Uses {player} for random player insertion
  subtitle?: string;
  isExtreme?: boolean;
  isPower?: boolean;
  duration?: number; // Duration in seconds for timed challenges
}

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
