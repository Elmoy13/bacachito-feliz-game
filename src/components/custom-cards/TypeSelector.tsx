import React from 'react';
import { ChallengeType } from '@/types/game';
import { Zap, Users, Target, Vote, Shuffle, Clock, Crown, Flame } from 'lucide-react';

const TYPE_CONFIG: Record<ChallengeType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  direct: { label: 'Directo', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  group: { label: 'Grupal', icon: Users, color: 'text-green-400', bg: 'bg-green-500/20' },
  category: { label: 'Categoría', icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  vote: { label: 'Votación', icon: Vote, color: 'text-violet-400', bg: 'bg-violet-500/20' },
  random: { label: 'Random', icon: Shuffle, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  timed: { label: 'Tiempo', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  power: { label: 'Poder', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  extreme: { label: 'Extremo', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/20' },
};

interface TypeSelectorProps {
  value: ChallengeType;
  onChange: (type: ChallengeType) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {(Object.entries(TYPE_CONFIG) as [ChallengeType, typeof TYPE_CONFIG[ChallengeType]][]).map(
        ([type, config]) => {
          const Icon = config.icon;
          const isSelected = value === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-xs font-medium ${
                isSelected
                  ? `${config.bg} ${config.color} ring-2 ring-current`
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={20} />
              <span>{config.label}</span>
            </button>
          );
        }
      )}
    </div>
  );
};

export default TypeSelector;
export { TYPE_CONFIG };
