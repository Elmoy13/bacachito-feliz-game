import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Copy, X, Loader2 } from 'lucide-react';
import { Challenge } from '@/types/game';
import ShareableCard from './ShareableCard';
import { useShareCard } from '@/hooks/useShareCard';
import { canUseWebShare, sanitizeTextForShare } from '@/utils/shareUtils';
import { toast } from 'sonner';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  processedText: string;
  gameMode: string;
}

const ShareSheet: React.FC<ShareSheetProps> = ({
  isOpen,
  onClose,
  challenge,
  processedText,
  gameMode,
}) => {
  const shareableRef = useRef<HTMLDivElement>(null);
  const hasGeneratedRef = useRef<string | null>(null);

  const {
    isGenerating,
    imageDataUrl,
    generateImage,
    handleShare,
    handleDownload,
    handleCopyText,
    clearCache,
  } = useShareCard({ gameMode });

  // Generate image when sheet opens (with caching by challenge id + index)
  useEffect(() => {
    if (!isOpen || !shareableRef.current || hasGeneratedRef.current === challenge.id) return;

    // Small delay to ensure DOM is painted before capture
    const timeout = setTimeout(() => {
      if (shareableRef.current) {
        hasGeneratedRef.current = challenge.id;
        generateImage(shareableRef.current).catch(() => {
          hasGeneratedRef.current = null;
          toast.error('Error al generar la imagen');
        });
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [isOpen, challenge.id, generateImage]);

  // Clean cache when challenge changes while closed
  useEffect(() => {
    if (!isOpen) {
      hasGeneratedRef.current = null;
      clearCache();
    }
  }, [challenge.id, isOpen, clearCache]);

  const safeText = sanitizeTextForShare(processedText);

  const onShare = async () => {
    const result = await handleShare(safeText);
    if (result === 'shared') {
      toast.success('¡Carta compartida!');
      onClose();
    } else if (result === 'downloaded') {
      toast.success('¡Imagen descargada!');
      onClose();
    }
  };

  const onDownload = () => {
    handleDownload();
    toast.success('¡Imagen descargada!');
    onClose();
  };

  const onCopy = async () => {
    const fullText = challenge.subtitle
      ? `${safeText}\n${sanitizeTextForShare(challenge.subtitle)}`
      : safeText;
    const success = await handleCopyText(`${fullText}\n\n🍾 Bacachito Feliz - @bacachitofeliz`);
    if (success) {
      toast.success('¡Texto copiado!');
    } else {
      toast.error('No se pudo copiar');
    }
  };

  return (
    <>
      {/* Offscreen shareable card for image generation */}
      <ShareableCard
        ref={shareableRef}
        challenge={challenge}
        processedText={processedText}
      />

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[70] bg-card rounded-t-3xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4">
                <h3 className="text-lg font-bold text-foreground">Compartir carta</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              {/* Preview */}
              <div className="px-6 pb-4">
                <div className="relative aspect-[9/16] max-h-[280px] w-auto mx-auto rounded-2xl overflow-hidden shadow-xl">
                  {isGenerating ? (
                    <div className="w-full h-full flex items-center justify-center bg-secondary rounded-2xl">
                      <Loader2 size={32} className="animate-spin text-muted-foreground" />
                    </div>
                  ) : imageDataUrl ? (
                    <img
                      src={imageDataUrl}
                      alt="Preview de la carta"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary rounded-2xl">
                      <p className="text-sm text-muted-foreground">Generando preview...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-6 pb-8 flex flex-col gap-3">
                {/* Share button (only on devices with Web Share API) */}
                {canUseWebShare() && (
                  <button
                    onClick={onShare}
                    disabled={isGenerating || !imageDataUrl}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 size={20} />
                    Compartir
                  </button>
                )}

                {/* Download button */}
                <button
                  onClick={onDownload}
                  disabled={isGenerating || !imageDataUrl}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-base transition-all hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={20} />
                  Descargar imagen
                </button>

                {/* Copy text button */}
                <button
                  onClick={onCopy}
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-2xl text-muted-foreground font-medium text-sm transition-all hover:bg-secondary"
                >
                  <Copy size={18} />
                  Copiar texto de la carta
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareSheet;
