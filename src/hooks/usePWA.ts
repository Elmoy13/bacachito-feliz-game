import { useState, useEffect, useCallback } from 'react';

interface UsePWAReturn {
  needRefresh: boolean;
  offlineReady: boolean;
  updateServiceWorker: () => void;
  dismissRefresh: () => void;
}

export const usePWA = (): UsePWAReturn => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    let cancelled = false;

    const register = async () => {
      try {
        const { registerSW } = await import('virtual:pwa-register');

        const update = registerSW({
          immediate: true,
          onRegisteredSW(swUrl, registration) {
            console.log('SW registered:', swUrl);
            // Check for updates every hour
            if (registration) {
              setInterval(() => {
                registration.update();
              }, 60 * 60 * 1000);
            }
          },
          onOfflineReady() {
            if (!cancelled) {
              setOfflineReady(true);
              console.log('App ready to work offline');
            }
          },
          onNeedRefresh() {
            if (!cancelled) {
              setNeedRefresh(true);
              console.log('New content available, refresh needed');
            }
          },
          onRegisterError(error) {
            console.error('SW registration error:', error);
          },
        });

        if (!cancelled) {
          setUpdateSW(() => update);
        }
      } catch {
        // SW registration not available (dev mode or unsupported browser)
      }
    };

    register();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (updateSW) {
      updateSW(true);
    }
  }, [updateSW]);

  const dismissRefresh = useCallback(() => {
    setNeedRefresh(false);
  }, []);

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
    dismissRefresh,
  };
};
