import { slangDictionary } from '@/data/slangDictionary';
import type { SlangRegion } from '@/types/slang';

// Pre-build lookup map: token → { region → translation }
// Built once at module load for O(1) lookups
const slangMap: Map<string, Map<SlangRegion, string>> = new Map();

for (const entry of slangDictionary) {
  const regionMap = new Map<SlangRegion, string>();
  for (const [region, translation] of Object.entries(entry.translations)) {
    regionMap.set(region as SlangRegion, translation);
  }
  slangMap.set(entry.token, regionMap);
}

const TOKEN_REGEX = /\{\{(\w+)\}\}/g;

/**
 * Replace all {{token}} placeholders in text with their regional slang translation.
 * Fallback chain: region → 'neutro' → 'universal' → token as plain text.
 */
export function applySlang(text: string, region: SlangRegion): string {
  return text.replace(TOKEN_REGEX, (_match, token: string) => {
    const regionMap = slangMap.get(token);
    if (!regionMap) return token; // unknown token → plain text

    return (
      regionMap.get(region) ??
      regionMap.get('neutro') ??
      regionMap.get('universal') ??
      token
    );
  });
}

/**
 * Check if a text contains any slang tokens.
 */
export function hasSlangTokens(text: string): boolean {
  return TOKEN_REGEX.test(text);
}

/**
 * Get all available token names from the dictionary.
 */
export function getAvailableTokens(): string[] {
  return Array.from(slangMap.keys());
}
