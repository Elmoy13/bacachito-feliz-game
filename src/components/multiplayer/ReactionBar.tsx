import React from 'react';
import { motion } from 'framer-motion';
import { REACTION_EMOJIS } from '@/types/multiplayer';

interface ReactionBarProps {
  onReaction: (emoji: string) => void;
  disabled?: boolean;
}

const ReactionBar: React.FC<ReactionBarProps> = ({ onReaction, disabled }) => {
  return (
    <div className="flex justify-center gap-3">
      {REACTION_EMOJIS.map((emoji) => (
        <motion.button
          key={emoji}
          onClick={() => onReaction(emoji)}
          disabled={disabled}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className={`w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-xl transition-opacity ${
            disabled ? 'opacity-40' : ''
          }`}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
};

export default ReactionBar;
