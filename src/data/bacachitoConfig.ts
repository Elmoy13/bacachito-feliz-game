import type { BacachitoMood, MoodConfig } from '@/types/bacachito';

export const MOOD_CONFIG: Record<BacachitoMood, MoodConfig> = {
  happy:       { cap: 'normal',  extras: [],                    cheeksColor: null,      labelEmoji: '🍻' },
  excited:     { cap: 'normal',  extras: [],                    cheeksColor: null,      labelEmoji: '🎉' },
  drunk:       { cap: 'tilted',  extras: ['cheeks'],            cheeksColor: '#F0997B', labelEmoji: '🥴' },
  wasted:      { cap: 'tilted',  extras: ['cheeks', 'sweat'],   cheeksColor: '#ED93B1', labelEmoji: '💀' },
  shocked:     { cap: 'jumping', extras: [],                    cheeksColor: null,      labelEmoji: '😱' },
  fire:        { cap: 'normal',  extras: ['cheeks', 'sweat'],   cheeksColor: '#E24B4A', labelEmoji: '🔥' },
  evil:        { cap: 'swagger', extras: [],                    cheeksColor: null,      labelEmoji: '😈' },
  love:        { cap: 'normal',  extras: ['cheeks', 'hearts'],  cheeksColor: '#ED93B1', labelEmoji: '💕' },
  scared:      { cap: 'normal',  extras: ['sweat'],             cheeksColor: null,      labelEmoji: '😰' },
  thinking:    { cap: 'normal',  extras: [],                    cheeksColor: null,      labelEmoji: '🤔' },
  celebrating: { cap: 'jumping', extras: ['cheeks', 'confetti'],cheeksColor: '#F0997B', labelEmoji: '🎊' },
  sleeping:    { cap: 'tilted',  extras: ['zzz'],               cheeksColor: null,      labelEmoji: '😴' },
  dizzy:       { cap: 'tilted',  extras: ['cheeks', 'stars'],   cheeksColor: '#97C459', labelEmoji: '🌀' },
  cool:        { cap: 'swagger', extras: ['sparkle'],           cheeksColor: null,      labelEmoji: '😎' },
  angry:       { cap: 'normal',  extras: ['cheeks'],            cheeksColor: '#E24B4A', labelEmoji: '😤' },
};
