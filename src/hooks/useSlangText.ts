import { useCallback, useMemo } from 'react';
import { applySlang } from '@/utils/slangEngine';
import type { SlangRegion } from '@/types/slang';
import { DEFAULT_REGION } from '@/types/slang';

/**
 * Hook that provides a function to apply regional slang to card text.
 * The region can be passed directly or it falls back to 'neutro'.
 */
export function useSlangText(region?: SlangRegion) {
  const activeRegion = region ?? DEFAULT_REGION;

  const applySlangText = useCallback(
    (text: string): string => applySlang(text, activeRegion),
    [activeRegion]
  );

  return { applySlang: applySlangText, region: activeRegion };
}
