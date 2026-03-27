import { useState, useCallback, useEffect } from 'react';
import type { SlangRegion } from '@/types/slang';
import { SLANG_STORAGE_KEY, DEFAULT_REGION } from '@/types/slang';
import { trackEvent } from '@/lib/firebase';

function readStoredRegion(): SlangRegion {
  try {
    const stored = localStorage.getItem(SLANG_STORAGE_KEY);
    if (stored) return stored as SlangRegion;
  } catch {
    // localStorage may be unavailable
  }
  return DEFAULT_REGION;
}

export function useSlangRegion() {
  const [region, setRegionState] = useState<SlangRegion>(readStoredRegion);

  // Sync to localStorage whenever region changes
  useEffect(() => {
    try {
      localStorage.setItem(SLANG_STORAGE_KEY, region);
    } catch {
      // ignore
    }
  }, [region]);

  const setRegion = useCallback((r: SlangRegion, source: 'setup' | 'settings' = 'setup') => {
    setRegionState(r);
    trackEvent('slang_region_selected', { region: r, source });
  }, []);

  return { region, setRegion };
}
