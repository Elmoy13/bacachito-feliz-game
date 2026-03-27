import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Challenge } from '@/types/game';
import ShareSheet from './ShareSheet';

interface ShareButtonProps {
  challenge: Challenge;
  processedText: string;
  gameMode: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ challenge, processedText, gameMode }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsSheetOpen(true);
        }}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="Compartir carta"
      >
        <Share2 size={20} className="text-white/80" />
      </button>

      <ShareSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        challenge={challenge}
        processedText={processedText}
        gameMode={gameMode}
      />
    </>
  );
};

export default ShareButton;
