import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applySlang } from '@/utils/slangEngine';
import type { SlangRegion } from '@/types/slang';
import { REGIONS } from '@/types/slang';

const PREVIEW_TEMPLATE = 'Si {player} no se {{drink_imperative}} su {{beer}}, es un {{chicken}} 🍻';

interface RegionPreviewCardProps {
  region: SlangRegion;
  playerName?: string;
}

const RegionPreviewCard: React.FC<RegionPreviewCardProps> = ({ region, playerName }) => {
  const resolvedText = useMemo(() => {
    const withPlayer = PREVIEW_TEMPLATE.replace('{player}', playerName || 'TÚ');
    return applySlang(withPlayer, region);
  }, [region, playerName]);

  const regionInfo = REGIONS.find((r) => r.id === region);

  return (
    <div className="mt-4 mb-2">
      <p className="body-small text-muted-foreground mb-2">Vista previa</p>
      <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-5 overflow-hidden">
        {/* Region badge */}
        {regionInfo && (
          <span className="absolute top-3 right-3 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
            {regionInfo.emoji} {regionInfo.name}
          </span>
        )}

        <AnimatePresence mode="wait">
          <motion.p
            key={region}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-foreground font-semibold text-sm leading-relaxed pr-16"
          >
            {resolvedText}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegionPreviewCard;
