import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import IOSInstallGuide from './IOSInstallGuide';

const GAMES_PLAYED_KEY = 'bacachito-games-played';
const IOS_GUIDE_SHOWN_KEY = 'bacachito-ios-guide-shown';

const InstallPrompt: React.FC = () => {
  const { canInstall, isIOS, isStandalone, installDismissed, promptInstall, dismissInstall } = useInstallPrompt();
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Show banner only after at least 1 game has been played
  useEffect(() => {
    if (isStandalone) return;

    const checkGamesPlayed = () => {
      try {
        const played = parseInt(localStorage.getItem(GAMES_PLAYED_KEY) || '0', 10);
        return played >= 1;
      } catch {
        return false;
      }
    };

    // Check periodically (game completion writes to localStorage)
    const interval = setInterval(() => {
      if (checkGamesPlayed()) {
        setShowBanner(true);
        clearInterval(interval);
      }
    }, 3000);

    // Also check immediately
    if (checkGamesPlayed()) {
      setShowBanner(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isStandalone]);

  // For iOS: show guide if not previously shown and has played a game
  const shouldShowIOSBanner = isIOS && !isStandalone && showBanner && !installDismissed;
  const shouldShowAndroidBanner = canInstall && showBanner;

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'accepted' || result === 'dismissed') {
      dismissInstall();
    }
  };

  const handleIOSInstall = () => {
    try {
      localStorage.setItem(IOS_GUIDE_SHOWN_KEY, 'true');
    } catch {/* */}
    setShowIOSGuide(true);
  };

  const handleDismiss = () => {
    dismissInstall(false); // Session only
  };

  const handleDismissPermanent = () => {
    dismissInstall(true); // Permanent
  };

  if (isStandalone) return null;

  return (
    <>
      <AnimatePresence>
        {(shouldShowAndroidBanner || shouldShowIOSBanner) && (
          <motion.div
            className="fixed bottom-6 left-4 right-4 z-[80] max-w-md mx-auto"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="rounded-3xl p-5 text-white relative overflow-hidden"
              style={{
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* Close button */}
              <button
                onClick={handleDismissPermanent}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} className="text-white/60" />
              </button>

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl">
                  🍾
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base">¡Instala Bacachito Feliz!</h4>
                  <p className="text-sm text-white/70 mt-1">
                    Agrégalo a tu pantalla de inicio para jugar sin internet
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={isIOS ? handleIOSInstall : handleInstall}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-primary text-white font-semibold text-sm transition-all hover:opacity-90"
                >
                  <Download size={18} />
                  Instalar
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-3 px-4 rounded-2xl text-white/60 font-medium text-sm transition-all hover:bg-white/10"
                >
                  Ahora no
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Install Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <IOSInstallGuide
            onClose={() => {
              setShowIOSGuide(false);
              dismissInstall(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPrompt;

/**
 * Call this from GameContext when a game ends to increment the counter.
 * This triggers showing the install banner.
 */
export const incrementGamesPlayed = (): void => {
  try {
    const current = parseInt(localStorage.getItem(GAMES_PLAYED_KEY) || '0', 10);
    localStorage.setItem(GAMES_PLAYED_KEY, String(current + 1));
  } catch {
    // localStorage unavailable
  }
};
