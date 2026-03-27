/**
 * DEV-ONLY migration helper.
 * Scans card templates for known slang words and suggests {{token}} replacements.
 *
 * Usage (in browser console or a dev script):
 *   import { scanCardsForSlang } from '@/utils/migrationHelper';
 *   import { getChallengesByMode } from '@/data/challenges';
 *   const cards = getChallengesByMode('precopeo');
 *   const report = scanCardsForSlang(cards);
 *   console.table(report);
 */

import { slangDictionary } from '@/data/slangDictionary';
import type { Challenge } from '@/types/game';

// Build reverse map: word → token
const reverseMap: Map<string, string> = new Map();

for (const entry of slangDictionary) {
  for (const translation of Object.values(entry.translations)) {
    const normalized = translation.toLowerCase().trim();
    if (normalized && !reverseMap.has(normalized)) {
      reverseMap.set(normalized, entry.token);
    }
  }
}

export interface MigrationSuggestion {
  cardId: string;
  original: string;
  suggested: string;
  replacements: Array<{ word: string; token: string }>;
}

export function scanCardsForSlang(cards: Challenge[]): MigrationSuggestion[] {
  const results: MigrationSuggestion[] = [];

  for (const card of cards) {
    const replacements: Array<{ word: string; token: string }> = [];
    let suggested = card.template;

    // Sort by length descending to match longer phrases first
    const sortedWords = Array.from(reverseMap.entries()).sort(
      (a, b) => b[0].length - a[0].length
    );

    for (const [word, token] of sortedWords) {
      // Skip very short words to avoid false positives
      if (word.length < 3) continue;

      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

      if (regex.test(suggested)) {
        replacements.push({ word, token });
        suggested = suggested.replace(regex, `{{${token}}}`);
      }
    }

    if (replacements.length > 0) {
      results.push({
        cardId: card.id,
        original: card.template,
        suggested,
        replacements,
      });
    }
  }

  return results;
}
