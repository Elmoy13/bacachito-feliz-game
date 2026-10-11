// Freemium configuration: what is free and what requires premium (VIP)
export const PREMIUM_CONFIG = {
  freeModes: ['precopeo'],
  premiumModes: ['peda', 'hot', 'fiesta', 'random', 'sincericidio', 'all'],
  freeFeatures: ['local-game', 'basic-cards', 'slang-regional'],
  premiumFeatures: [
    'multiplayer-remote',
    'custom-cards',
    'no-ads',
    'all-modes',
    'priority-support',
  ],
};

export const isPremiumMode = (modeId: string): boolean =>
  PREMIUM_CONFIG.premiumModes.includes(modeId);
