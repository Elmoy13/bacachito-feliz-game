import React from 'react';
import { INTENSITY_LABELS, type CardIntensity } from '@/types/customCards';

interface IntensitySelectorProps {
  value: CardIntensity;
  onChange: (intensity: CardIntensity) => void;
}

const IntensitySelector: React.FC<IntensitySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-2">
      {([1, 2, 3] as CardIntensity[]).map((level) => {
        const { label, emoji } = INTENSITY_LABELS[level];
        const isSelected = value === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl transition-all text-sm font-medium ${
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default IntensitySelector;
