import { useEffect, useRef, useCallback } from 'react';
import { trackEvent } from '@/lib/firebase';

interface UseShakeDetectionOptions {
  onShake: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useShakeDetection({
  onShake,
  threshold = 15,
  enabled = true,
}: UseShakeDetectionOptions) {
  const lastShakeTime = useRef(0);
  const permissionGranted = useRef(false);

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      if (!enabled) return;
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const force = Math.sqrt(
        (acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2
      );

      if (force > threshold) {
        const now = Date.now();
        // Cooldown: 4s between shakes
        if (now - lastShakeTime.current > 4000) {
          lastShakeTime.current = now;
          onShake();
          trackEvent('bacachito_easter_egg', { type: 'shake' });
        }
      }
    },
    [enabled, threshold, onShake]
  );

  const requestPermission = useCallback(async () => {
    // iOS 13+ requires permission
    const DeviceMotionEventTyped = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof DeviceMotionEventTyped.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEventTyped.requestPermission();
        permissionGranted.current = result === 'granted';
      } catch {
        permissionGranted.current = false;
      }
    } else {
      // Non-iOS or older — permission not needed
      permissionGranted.current = true;
    }
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('DeviceMotionEvent' in window)) return;

    // Try getting permission on mount (will only work if triggered by user gesture later)
    requestPermission().then(() => {
      if (permissionGranted.current) {
        window.addEventListener('devicemotion', handleMotion);
      }
    });

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [enabled, handleMotion, requestPermission]);

  return { requestPermission };
}
