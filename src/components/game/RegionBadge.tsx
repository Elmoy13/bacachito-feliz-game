import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SlangRegion } from '@/types/slang';
import { REGIONS } from '@/types/slang';

interface RegionBadgeProps {
  region: SlangRegion;
}

const RegionBadge: React.FC<RegionBadgeProps> = ({ region }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulse, setPulse] = useState(false);

  const info = REGIONS.find((r) => r.id === region);
  if (!info) return null;

  // Subtle pulse every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: pulse ? 1.12 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <button
        onClick={() => setShowTooltip((v) => !v)}
        onBlur={() => setShowTooltip(false)}
        className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-lg shadow-sm"
        aria-label={`Región: ${info.name}`}
      >
        {info.emoji}
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 whitespace-nowrap bg-card border border-border rounded-lg px-3 py-1.5 shadow-lg z-50"
          >
            <span className="text-xs text-foreground font-medium">
              Jugando en modo {info.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RegionBadge;
