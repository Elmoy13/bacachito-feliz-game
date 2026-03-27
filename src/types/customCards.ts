import { ChallengeType } from './game';

export type CardProbability = 1 | 2 | 3;

export const GAME_MODE_OPTIONS = [
  { id: 'precopeo', name: 'Pre-copeo', emoji: '🍺' },
  { id: 'peda', name: 'La Peda', emoji: '⚡' },
  { id: 'hot', name: 'Hot', emoji: '❤️‍🔥' },
  { id: 'fiesta', name: 'Fiesta', emoji: '🎉' },
  { id: 'random', name: 'Random Mix', emoji: '🎲' },
  { id: 'all', name: 'Todo o Nada', emoji: '💀' },
] as const;

export const PROBABILITY_LABELS: Record<CardProbability, { label: string; emoji: string; description: string }> = {
  1: { label: 'Baja', emoji: '🎯', description: '~25% de probabilidad' },
  2: { label: 'Normal', emoji: '🎲', description: '~50% de probabilidad' },
  3: { label: 'Alta', emoji: '🔥', description: '~100% de probabilidad' },
};

export interface CustomCard {
  id: string;
  text: string;
  type: ChallengeType;
  intensity: 1 | 2 | 3;
  timerSeconds?: number;
  powerType?: string;
  packId?: string;
  modes?: string[];       // mode ids where this card appears. empty/undefined = all modes
  probability?: CardProbability; // 1=baja 2=normal 3=alta. undefined defaults to 2
  createdAt: number;
  updatedAt: number;
}

export interface CustomPack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cardIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type CardIntensity = 1 | 2 | 3;

export const INTENSITY_LABELS: Record<CardIntensity, { label: string; emoji: string }> = {
  1: { label: 'Suave', emoji: '🍺' },
  2: { label: 'Medio', emoji: '🥃' },
  3: { label: 'Intenso', emoji: '💀' },
};

export const MAX_CUSTOM_CARDS = 200;
export const MAX_CUSTOM_PACKS = 20;
export const MAX_CARD_TEXT_LENGTH = 280;
export const MIN_CARD_TEXT_LENGTH = 10;
export const MAX_PACK_NAME_LENGTH = 40;
export const MIN_PACK_NAME_LENGTH = 3;
export const MAX_PACK_DESCRIPTION_LENGTH = 120;

export const TIMER_OPTIONS = [
  { value: 30, label: '30s' },
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
];

export const POWER_TYPES = [
  'ESCUDO',
  'ESPEJO',
  'DICTADOR',
  'CUPIDO',
  'REBOTE',
  'REY',
  'REINA',
  'SHAZAM',
];

export const PACK_EMOJIS = [
  '🍺', '🥃', '🍻', '🎉', '🔥', '🌶️', '💀', '👑',
  '🎲', '🃏', '💣', '🎯', '🏆', '🤪', '😈', '👀',
  '💋', '🎪', '🍾', '🥳',
];

export const TYPE_PLACEHOLDERS: Record<ChallengeType, string> = {
  direct: 'Ej: {player} tiene que imitar a {player2} por 30 segundos',
  group: 'Ej: El último en tocarse la nariz, bebe doble',
  category: 'Ej: Categoría: Marcas de cerveza mexicana',
  vote: 'Ej: ¿Quién es más probable que se quede dormido en la peda?',
  random: 'Ej: El que tenga más mensajes sin leer toma 3',
  timed: 'Ej: Nadie puede decir groserías por 2 minutos',
  power: 'Ej: Tienes un escudo, úsalo para rechazar cualquier reto',
  extreme: 'Ej: {player} se toma 3 shots seguidos o se va a su casa',
};
