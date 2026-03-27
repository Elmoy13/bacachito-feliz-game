import React from 'react';
import { motion } from 'framer-motion';
import type { SlangRegion } from '@/types/slang';
import { REGIONS } from '@/types/slang';
import { toast } from 'sonner';

interface RegionSelectorProps {
  selected: SlangRegion;
  onSelect: (region: SlangRegion) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selected, onSelect }) => {
  const handleSelect = (id: SlangRegion) => {
    onSelect(id);
    const info = REGIONS.find((r) => r.id === id);
    if (info) {
      toast(`${info.emoji} Modo ${info.name} activado`, {
        description: info.examplePhrase,
        duration: 2500,
      });
    }
  };

  return (
    <div>
      <h2 className="heading-medium mb-1">¿De dónde son, güey?</h2>
      <p className="body-small text-muted-foreground mb-4">
        El slang de las cartas cambiará según la región
      </p>

      <div className="grid grid-cols-2 gap-3">
        {REGIONS.map((region, index) => {
          const isSelected = selected === region.id;
          return (
            <motion.button
              key={region.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(region.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                  : 'border-border bg-card hover:bg-card/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{region.emoji}</span>
                <span className="font-semibold text-sm text-foreground">{region.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                {region.examplePhrase}
              </p>
              {isSelected && (
                <motion.div
                  layoutId="region-check"
                  className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default RegionSelector;
