import React from 'react';
import { ChallengeType } from '@/types/game';
import { getShareableGradient, getShareableBadgeText, getCardTypeEmoji } from '@/utils/shareUtils';
import type { CardIntensity } from '@/types/customCards';
import { INTENSITY_LABELS } from '@/types/customCards';

interface CardPreviewProps {
  text: string;
  type: ChallengeType;
  intensity: CardIntensity;
  isExtreme?: boolean;
  isPower?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({ text, type, intensity, isExtreme, isPower }) => {
  const gradient = getShareableGradient(type, isExtreme, isPower);
  const badge = getShareableBadgeText(type, isExtreme, isPower);
  const emoji = getCardTypeEmoji(type, isExtreme, isPower);
  const { emoji: intensityEmoji } = INTENSITY_LABELS[intensity];

  return (
    <div
      className="rounded-2xl p-5 text-white text-center flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden"
      style={{ background: gradient }}
    >
      {badge && (
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"
          style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
        >
          <span>{emoji}</span>
          <span>{badge}</span>
        </div>
      )}

      <div className="absolute top-3 right-3 text-xs opacity-60">
        {intensityEmoji}
      </div>

      <p className="font-bold text-sm leading-snug max-w-[240px]">
        {text || 'Escribe un reto...'}
      </p>

      <div className="absolute bottom-3 opacity-40 text-[10px] font-semibold">
        ✨ Carta personalizada
      </div>
    </div>
  );
};

export default CardPreview;
