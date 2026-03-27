export type BacachitoMood =
  | 'happy'
  | 'excited'
  | 'drunk'
  | 'wasted'
  | 'shocked'
  | 'fire'
  | 'evil'
  | 'love'
  | 'scared'
  | 'thinking'
  | 'celebrating'
  | 'sleeping'
  | 'dizzy'
  | 'cool'
  | 'angry';

export type ExtraType = 'cheeks' | 'sweat' | 'hearts' | 'confetti' | 'zzz' | 'stars' | 'sparkle';

export type CapStyle = 'normal' | 'jumping' | 'tilted' | 'swagger';

export type BacachitoSize = 'sm' | 'md' | 'lg';

export type BacachitoPosition = 'inline' | 'corner';

export interface BacachitoProps {
  mood?: BacachitoMood;
  size?: BacachitoSize;
  position?: BacachitoPosition;
  onTap?: () => void;
  className?: string;
}

export interface MoodConfig {
  cap: CapStyle;
  extras: ExtraType[];
  cheeksColor: string | null;
  labelEmoji: string;
}

export interface EyePaths {
  left: string;
  right: string;
  isStroke?: boolean;
  fillColor?: string;
  extras?: React.ReactNode;
}

export interface MouthPaths {
  shape: string;
  detail?: string;
  isStroke?: boolean;
  detailFill?: string;
}
