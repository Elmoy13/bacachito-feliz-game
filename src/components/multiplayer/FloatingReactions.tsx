import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reaction } from '@/types/multiplayer';

interface FloatingReactionsProps {
  reactions: (Reaction & { x: number })[];
}

const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            animate={{ opacity: 0, y: -300, scale: 0.6, x: (Math.random() - 0.5) * 40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ position: 'absolute', bottom: '15%', left: `${r.x}%` }}
            className="flex flex-col items-center"
          >
            <span className="text-4xl">{r.emoji}</span>
            <span className="text-xs text-foreground/70 font-medium mt-0.5">
              {r.playerName}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingReactions;
