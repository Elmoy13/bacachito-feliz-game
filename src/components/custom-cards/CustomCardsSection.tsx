import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomCards } from '@/hooks/useCustomCards';
import type { CustomCard } from '@/types/customCards';
import { PROBABILITY_LABELS } from '@/types/customCards';

interface CustomCardsSectionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  selectedPackIds: string[];
  onPackToggle: (packId: string) => void;
  includeNoPack: boolean;
  onIncludeNoPackToggle: (val: boolean) => void;
  customCardCount: number;
  onCustomCardCountChange: (count: number) => void;
  selectedModeId: string | null;
}

const CustomCardsSection: React.FC<CustomCardsSectionProps> = ({
  enabled,
  onToggle,
  selectedPackIds,
  onPackToggle,
  includeNoPack,
  onIncludeNoPackToggle,
  customCardCount,
  onCustomCardCountChange,
  selectedModeId,
}) => {
  const navigate = useNavigate();
  const { cards, packs, loading } = useCustomCards();

  // Cards that match the selected game mode
  const modeFilteredCards = useMemo(() => {
    if (!selectedModeId) return cards;
    return cards.filter((c) => {
      // No modes set = available in all modes
      if (!c.modes || c.modes.length === 0) return true;
      return c.modes.includes(selectedModeId);
    });
  }, [cards, selectedModeId]);

  const availableCount = useMemo(() => {
    if (!enabled) return 0;
    let pool: CustomCard[] = [];
    if (includeNoPack) {
      pool = pool.concat(modeFilteredCards.filter((c) => !c.packId));
    }
    selectedPackIds.forEach((pid) => {
      pool = pool.concat(modeFilteredCards.filter((c) => c.packId === pid));
    });
    // Deduplicate
    const unique = new Map(pool.map((c) => [c.id, c]));
    return unique.size;
  }, [modeFilteredCards, enabled, includeNoPack, selectedPackIds]);

  if (loading) return null;

  if (cards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-5 text-center"
      >
        <p className="body-regular text-muted-foreground mb-3">
          ¿Quieres agregar tus propios retos?
        </p>
        <button
          onClick={() => navigate('/mis-cartas')}
          className="btn-primary text-sm"
        >
          <PenLine size={16} className="mr-2" />
          Crear cartas personalizadas
        </button>
      </motion.div>
    );
  }

  const modeCount = modeFilteredCards.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border p-5"
    >
      {/* Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-sm">Cartas personalizadas</h3>
          <p className="text-xs text-muted-foreground">
            {modeCount} de {cards.length} carta{cards.length !== 1 ? 's' : ''} para este modo
          </p>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            enabled ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              enabled ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Pack checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNoPack}
                onChange={(e) => onIncludeNoPackToggle(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-sm text-foreground">
                Todas mis cartas (sin pack)
                <span className="text-muted-foreground ml-1">
                  ({modeFilteredCards.filter((c) => !c.packId).length})
                </span>
              </span>
            </label>
            {packs.map((pack) => {
              const count = modeFilteredCards.filter((c) => c.packId === pack.id).length;
              return (
                <label key={pack.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPackIds.includes(pack.id)}
                    onChange={() => onPackToggle(pack.id)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    {pack.emoji} {pack.name}
                    <span className="text-muted-foreground ml-1">({count})</span>
                  </span>
                </label>
              );
            })}
          </div>

          {/* Count slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground font-medium">Cartas personalizadas a incluir</label>
              <span className="text-sm font-bold text-primary">{Math.min(customCardCount, availableCount)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.min(30, availableCount || 1)}
              value={Math.min(customCardCount, availableCount || 1)}
              onChange={(e) => onCustomCardCountChange(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Se mezclarán {Math.min(customCardCount, availableCount)} carta{Math.min(customCardCount, availableCount) !== 1 ? 's' : ''} tuya{Math.min(customCardCount, availableCount) !== 1 ? 's' : ''} con las cartas del juego
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CustomCardsSection;
