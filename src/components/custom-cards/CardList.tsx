import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Trash2, Copy } from 'lucide-react';
import type { CustomCard } from '@/types/customCards';
import { MAX_CUSTOM_CARDS } from '@/types/customCards';
import { ChallengeType } from '@/types/game';
import { TYPE_CONFIG } from './TypeSelector';
import EmptyState from './EmptyState';

interface CardListProps {
  cards: CustomCard[];
  onEdit: (card: CustomCard) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCreate: () => void;
}

const FILTER_OPTIONS: { value: '' | ChallengeType; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'direct', label: 'Directo' },
  { value: 'group', label: 'Grupal' },
  { value: 'category', label: 'Categoría' },
  { value: 'vote', label: 'Votación' },
  { value: 'random', label: 'Random' },
  { value: 'timed', label: 'Tiempo' },
  { value: 'power', label: 'Poder' },
  { value: 'extreme', label: 'Extremo' },
];

const CardList: React.FC<CardListProps> = ({ cards, onEdit, onDelete, onDuplicate, onCreate }) => {
  const [filter, setFilter] = useState<'' | ChallengeType>('');

  const filtered = useMemo(
    () => (filter ? cards.filter((c) => c.type === filter) : cards),
    [cards, filter]
  );

  if (cards.length === 0) {
    return (
      <EmptyState
        title="Sin cartas aún"
        description="Crea tus propios retos personalizados para jugar con tus amigos."
        actionLabel="Crear primera carta"
        onAction={onCreate}
        emoji="🃏"
      />
    );
  }

  return (
    <div>
      {/* Counter */}
      <p className="body-small text-muted-foreground mb-3">
        {cards.length} carta{cards.length !== 1 ? 's' : ''} creada{cards.length !== 1 ? 's' : ''}
        <span className="text-muted-foreground/50"> · máx {MAX_CUSTOM_CARDS}</span>
      </p>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-hide">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Card list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((card, index) => {
            const config = TYPE_CONFIG[card.type];
            const Icon = config?.icon;
            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.03 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-xl p-4 border border-border flex items-start gap-3"
              >
                {/* Type badge */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${config?.bg || 'bg-secondary'}`}>
                  {Icon && <Icon size={18} className={config?.color} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{card.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {config?.label}
                    {card.packId && ' · En pack'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1">
                  <button
                    onClick={() => onDuplicate(card.id)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    title="Duplicar"
                  >
                    <Copy size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onEdit(card)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    title="Editar"
                  >
                    <PenLine size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onDelete(card.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardList;
