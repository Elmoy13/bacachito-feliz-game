import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface UseInstallPromptReturn {
  canInstall: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  installDismissed: boolean;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  dismissInstall: (permanent?: boolean) => void;
}

const DISMISS_KEY = 'bacachito-install-dismissed';

export const useInstallPrompt = (): UseInstallPromptReturn => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDismissed, setInstallDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true;

  useEffect(() => {
    if (isStandalone) return; // Already installed

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [isStandalone]);

  // Listen for successful install
  useEffect(() => {
    const handler = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt) return 'unavailable';

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return outcome;
    } catch {
      return 'unavailable';
    }
  }, [deferredPrompt]);

  const dismissInstall = useCallback((permanent = false) => {
    setInstallDismissed(true);
    if (permanent) {
      try {
        localStorage.setItem(DISMISS_KEY, 'true');
      } catch {
        // localStorage unavailable
      }
    }
  }, []);

  const canInstall = !!deferredPrompt && !installDismissed && !isStandalone;

  return {
    canInstall,
    isIOS,
    isStandalone,
    installDismissed,
    promptInstall,
    dismissInstall,
  };
};
