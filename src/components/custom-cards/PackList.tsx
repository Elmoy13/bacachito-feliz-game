import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Trash2 } from 'lucide-react';
import type { CustomPack, CustomCard } from '@/types/customCards';
import { MAX_CUSTOM_PACKS } from '@/types/customCards';
import EmptyState from './EmptyState';

interface PackListProps {
  packs: CustomPack[];
  cards: CustomCard[];
  onEdit: (pack: CustomPack) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

const PackList: React.FC<PackListProps> = ({ packs, cards, onEdit, onDelete, onCreate }) => {
  const getPackCardCount = (packId: string) => cards.filter((c) => c.packId === packId).length;

  if (packs.length === 0) {
    return (
      <EmptyState
        title="Sin packs aún"
        description="Organiza tus cartas en packs temáticos."
        actionLabel="Crear primer pack"
        onAction={onCreate}
        emoji="📦"
      />
    );
  }

  return (
    <div>
      <p className="body-small text-muted-foreground mb-4">
        {packs.length} pack{packs.length !== 1 ? 's' : ''}
        <span className="text-muted-foreground/50"> · máx {MAX_CUSTOM_PACKS}</span>
      </p>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {packs.map((pack, index) => {
            const cardCount = getPackCardCount(pack.id);
            return (
              <motion.div
                key={pack.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{pack.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{pack.name}</h3>
                    {pack.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{pack.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {cardCount} carta{cardCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <button
                      onClick={() => onEdit(pack)}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                      title="Editar"
                    >
                      <PenLine size={14} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onDelete(pack.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PackList;
