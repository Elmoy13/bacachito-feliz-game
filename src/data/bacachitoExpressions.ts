import type { BacachitoMood, EyePaths, MouthPaths } from '@/types/bacachito';
import type { MotionProps } from 'framer-motion';

export const EYE_PATHS: Record<BacachitoMood, EyePaths> = {
  happy: {
    left: 'M -36,-15 A 12,14 0 0,1 -12,-15 Z',
    right: 'M 12,-15 A 12,14 0 0,1 36,-15 Z',
  },
  excited: {
    left: 'M -36,-22 A 12,14 0 0,1 -12,-22 A 12,14 0 0,1 -36,-22 Z',
    right: 'M 12,-22 A 12,14 0 0,1 36,-22 A 12,14 0 0,1 12,-22 Z',
  },
  drunk: {
    left: 'M -35,-17 L -13,-17 L -13,-13 L -35,-13 Z',
    right: 'M 13,-17 L 35,-17 L 35,-13 L 13,-13 Z',
  },
  wasted: {
    left: 'M -32,-22 L -16,-8 M -16,-22 L -32,-8',
    right: 'M 16,-22 L 32,-8 M 32,-22 L 16,-8',
    isStroke: true,
  },
  shocked: {
    left: 'M -36,-26 A 12,14 0 0,1 -12,-26 A 12,14 0 0,1 -36,-26 Z',
    right: 'M 12,-26 A 12,14 0 0,1 36,-26 A 12,14 0 0,1 12,-26 Z',
  },
  fire: {
    left: 'M -24,-28 L -18,-15 L -24,-8 L -30,-15 Z',
    right: 'M 24,-28 L 30,-15 L 24,-8 L 18,-15 Z',
    fillColor: '#EF8B2C',
  },
  evil: {
    left: 'M -35,-20 L -13,-16 L -13,-12 L -35,-14 Z',
    right: 'M 13,-16 L 35,-20 L 35,-14 L 13,-12 Z',
  },
  love: {
    left: 'M -24,-10 C -24,-20 -34,-20 -34,-14 C -34,-8 -24,-2 -24,-2 C -24,-2 -14,-8 -14,-14 C -14,-20 -24,-20 -24,-10 Z',
    right: 'M 24,-10 C 24,-20 14,-20 14,-14 C 14,-8 24,-2 24,-2 C 24,-2 34,-8 34,-14 C 34,-20 24,-20 24,-10 Z',
    fillColor: '#E24B4A',
  },
  scared: {
    left: 'M -36,-26 A 12,14 0 0,1 -12,-26 A 12,14 0 0,1 -36,-26 Z',
    right: 'M 12,-26 A 12,14 0 0,1 36,-26 A 12,14 0 0,1 12,-26 Z',
  },
  thinking: {
    left: 'M -35,-15 L -13,-15',
    right: 'M 12,-15 A 12,14 0 0,1 36,-15 Z',
    isStroke: true,
  },
  celebrating: {
    left: 'M -35,-12 Q -24,-22 -13,-12',
    right: 'M 13,-12 Q 24,-22 35,-12',
    isStroke: true,
  },
  sleeping: {
    left: 'M -35,-15 Q -24,-10 -13,-15',
    right: 'M 13,-15 Q 24,-10 35,-15',
    isStroke: true,
  },
  dizzy: {
    left: 'M -32,-22 L -16,-8 M -16,-22 L -32,-8',
    right: 'M 16,-22 L 32,-8 M 32,-22 L 16,-8',
    isStroke: true,
  },
  cool: {
    left: 'M -37,-22 L -11,-22 L -11,-10 L -37,-10 Z',
    right: 'M 11,-22 L 37,-22 L 37,-10 L 11,-10 Z',
  },
  angry: {
    left: 'M -36,-15 A 12,14 0 0,1 -12,-15 Z',
    right: 'M 12,-15 A 12,14 0 0,1 36,-15 Z',
  },
};

export const MOUTH_PATHS: Record<BacachitoMood, MouthPaths> = {
  happy: {
    shape: 'M -28,3 C -28,38 28,38 28,3 Z',
    detail: 'M -15,18 Q 0,10 15,18 Q 0,30 -15,18 Z',
  },
  excited: {
    shape: 'M -30,0 C -30,45 30,45 30,0 Z',
    detail: 'M -18,16 Q 0,6 18,16 Q 0,34 -18,16 Z',
  },
  drunk: {
    shape: 'M -25,8 C -20,30 25,25 22,5 Z',
    detail: 'M -12,18 Q 2,12 14,16 Q 2,24 -12,18 Z',
  },
  wasted: {
    shape: 'M -8,8 A 8,10 0 0,1 8,8 A 8,10 0 0,1 -8,8 Z',
  },
  shocked: {
    shape: 'M -14,5 A 14,16 0 0,1 14,5 A 14,16 0 0,1 -14,5 Z',
  },
  fire: {
    shape: 'M -26,3 C -26,36 26,36 26,3 Z',
    detail: 'M -10,20 Q 0,40 10,20 Z',
    detailFill: '#E24B4A',
  },
  evil: {
    shape: 'M -30,10 Q -15,4 0,14 Q 15,4 30,10 Q 15,28 0,22 Q -15,28 -30,10 Z',
    detail: 'M -16,14 Q 0,8 16,14 Q 0,20 -16,14 Z',
  },
  love: {
    shape: 'M -22,5 C -22,30 22,30 22,5 Z',
    detail: 'M -12,18 Q 0,10 12,18 Q 0,26 -12,18 Z',
  },
  scared: {
    shape: 'M -18,4 L 18,4 L 18,28 L -18,28 Z',
    detail: 'M -18,4 L 18,4 L 18,12 L -18,12 Z',
  },
  thinking: {
    shape: 'M -20,12 Q 0,8 20,16',
    isStroke: true,
  },
  celebrating: {
    shape: 'M -30,0 C -30,50 30,50 30,0 Z',
    detail: 'M -18,18 Q 0,6 18,18 Q 0,38 -18,18 Z',
  },
  sleeping: {
    shape: 'M -12,10 Q 0,16 12,10',
    isStroke: true,
  },
  dizzy: {
    shape: 'M -22,12 C -14,6 -6,18 2,12 C 10,6 18,18 22,12',
    isStroke: true,
  },
  cool: {
    shape: 'M -20,10 Q 0,10 22,4',
    isStroke: true,
  },
  angry: {
    shape: 'M -22,18 Q 0,6 22,18 Z',
  },
};

export const CAP_ANIMATIONS: Record<string, MotionProps['animate']> = {
  normal: {},
  jumping: {
    y: [0, -25, -25, 0],
    rotate: [0, 10, -5, 0],
    transition: { duration: 0.6, times: [0, 0.3, 0.6, 1] },
  },
  tilted: {
    rotate: 12,
    x: 5,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  swagger: {
    rotate: -8,
    x: -3,
    y: -3,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const BODY_ANIMATIONS: Record<BacachitoMood, MotionProps['animate']> = {
  happy: {
    y: [0, -3, 0],
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
  excited: {
    y: [0, -8, 0],
    transition: { repeat: Infinity, duration: 0.4, ease: 'easeInOut' },
  },
  drunk: {
    rotate: [-5, 5, -5],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  wasted: {
    rotate: [-12, 12, -12],
    x: [-4, 4, -4],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  },
  shocked: {
    x: [-4, 4, -4, 4, 0],
    transition: { duration: 0.3 },
  },
  fire: {
    x: [-1.5, 1.5, -1.5],
    transition: { repeat: Infinity, duration: 0.08 },
  },
  evil: {
    rotate: 3,
    transition: { duration: 0.4 },
  },
  love: {
    y: [0, -10, 0],
    transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
  },
  scared: {
    x: [-2, 2, -1, 1, -2, 2, 0],
    y: [-1, 1, -1, 0],
    transition: { repeat: Infinity, duration: 0.15 },
  },
  thinking: {
    rotate: -5,
    transition: { duration: 0.5 },
  },
  celebrating: {
    y: [0, -25, 0],
    scale: [1, 1.05, 1],
    transition: { repeat: 2, duration: 0.5, ease: 'easeOut' },
  },
  sleeping: {
    rotate: [0, 2, 0, -2, 0],
    transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
  },
  dizzy: {
    rotate: [-8, 8, -6, 10, -8],
    x: [-3, 3, -5, 2, -3],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
  cool: {
    rotate: -3,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  angry: {
    x: [-2, 2, -2, 2, 0],
    transition: { repeat: Infinity, duration: 0.2, repeatDelay: 1.5 },
  },
};
