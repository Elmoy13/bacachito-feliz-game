import type { Challenge, ChallengeType } from './game';

export type RoomStatus = 'created' | 'waiting' | 'playing' | 'finished';

export interface RoomMeta {
  code: string;
  hostUid: string;
  hostName: string;
  mode: string;
  slangRegion: string;
  status: RoomStatus;
  maxPlayers: number;
  createdAt: number;
}

export interface RoomPlayer {
  name: string;
  emoji: string;
  isHost: boolean;
  isOnline: boolean;
  joinedAt: number;
  lastSeen: number;
}

/** Card stored in RTDB — template already resolved with player names */
export interface ResolvedCard {
  id: string;
  type: ChallengeType;
  text: string;
  subtitle?: string;
  isExtreme?: boolean;
  isPower?: boolean;
  duration?: number;
  hasSubGames?: boolean;
  isCustom?: boolean;
}

export interface ActiveTimer {
  cardIndex: number;
  startedAt: number;
  durationSeconds: number;
}

export interface RoomGameState {
  currentCardIndex: number;
  cards: ResolvedCard[];
  timedCards?: {
    activeTimers: ActiveTimer[];
  };
  powerCards?: {
    usedPowers: Record<string, string[]>;
  };
}

export interface Reaction {
  id: string;
  emoji: string;
  playerName: string;
  timestamp: number;
}

export interface VoteState {
  question: string;
  candidates: string[];
  votes: Record<string, string>;
  results: { winner: string; count: number } | null;
}

export interface Room {
  meta: RoomMeta;
  players: Record<string, RoomPlayer>;
  gameState: RoomGameState | null;
  currentVote: VoteState | null;
}

export const PLAYER_EMOJIS = [
  '🤠', '😎', '🥳', '🤪', '😈', '👻', '🎃', '🦁',
  '🐻', '🦊', '🐸', '🍺', '🌮', '🎸', '🏄‍♂️', '🤡',
  '🦄', '🎯', '🔥', '💀', '🍕', '🎪', '🌶️', '👑',
  '🎲', '🃏', '🍾', '🥃', '🧨', '🎵',
];

export const REACTION_EMOJIS = ['😂', '🔥', '💀', '🤮', '😈'] as const;

export const MAX_ROOM_PLAYERS = 12;
export const ROOM_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
export const HOST_DISCONNECT_TIMEOUT_MS = 30_000;
export const PRESENCE_HEARTBEAT_MS = 30_000;
export const REACTION_COOLDOWN_MS = 5_000;
export const MAX_REACTIONS_PER_COOLDOWN = 3;
export const REACTION_DISPLAY_MS = 2_000;
export const REACTION_CLEANUP_MS = 3_000;
