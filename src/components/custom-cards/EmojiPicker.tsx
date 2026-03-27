import React from 'react';
import { PACK_EMOJIS } from '@/types/customCards';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-10 gap-1.5">
      {PACK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl transition-all ${
            value === emoji
              ? 'bg-primary/20 ring-2 ring-primary scale-110'
              : 'bg-secondary/50 hover:bg-secondary hover:scale-105'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
