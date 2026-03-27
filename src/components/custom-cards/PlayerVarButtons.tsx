import React from 'react';

interface PlayerVarButtonsProps {
  onInsert: (variable: string) => void;
}

const PlayerVarButtons: React.FC<PlayerVarButtonsProps> = ({ onInsert }) => {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onInsert('{player}')}
        className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-mono font-semibold transition-all hover:bg-blue-500/25 active:scale-95"
      >
        {'{player}'}
      </button>
      <button
        type="button"
        onClick={() => onInsert('{player2}')}
        className="px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-400 text-xs font-mono font-semibold transition-all hover:bg-violet-500/25 active:scale-95"
      >
        {'{player2}'}
      </button>
    </div>
  );
};

export default PlayerVarButtons;
