import { describe, it, expect, vi } from 'vitest';
import type { Challenge, ChallengeType } from '@/types/game';

// Evitar inicializar Firebase / PWA al importar el contexto
vi.mock('@/lib/firebase', () => ({
  saveGameSession: vi.fn(),
  trackEvent: vi.fn(),
}));
vi.mock('@/components/pwa/InstallPrompt', () => ({
  incrementGamesPlayed: vi.fn(),
}));

import { selectBalancedChallenges } from '@/context/GameContext';
import {
  getPrefieresSips,
  getPrefieresRuleText,
  buildPrefieresShareText,
  resolvePrefieresTexts,
} from '@/utils/prefieres';

// Genera N cartas de un tipo para el fixture
const make = (type: ChallengeType, n: number, extra: Partial<Challenge> = {}): Challenge[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `${type}-${i}`,
    type,
    template: `${type} ${i}`,
    ...extra,
  }));

// Fixture temporal: 3 cartas "¿Qué prefieres?" (nunca en src/data)
const PREFIERES_FIXTURE: Challenge[] = [
  {
    id: 'pref-test-1',
    type: 'prefieres',
    template: '¿Qué prefieres?',
    optionA: 'Comer un plato de cucarachas vivas una vez al año',
    optionB: 'Que te pique una avispa todos los días',
    sips: 3,
  },
  {
    id: 'pref-test-2',
    type: 'prefieres',
    template: '¿Qué prefieres?',
    optionA: '2 años en la cárcel',
    optionB: '2 años en coma',
  },
  {
    id: 'pref-test-3',
    type: 'prefieres',
    template: '¿Qué prefieres?',
    optionA: 'Que {player} lea tus mensajes',
    optionB: 'Que {player} vea tu galería',
  },
];

const baseDeck = (): Challenge[] => [
  ...make('direct', 20),
  ...make('group', 20),
  ...make('category', 15),
  ...make('vote', 10),
  ...make('random', 10),
  ...make('timed', 8, { duration: 60 }),
  ...make('power', 8, { isPower: true }),
  ...make('extreme', 8, { isExtreme: true }),
];

describe('selectBalancedChallenges con cartas "prefieres"', () => {
  it('incluye cartas prefieres cuando el modo las tiene', () => {
    // Con muchas prefieres en el pool, la distribución (~12% normales) y el relleno deben incluir alguna
    const deck = [...baseDeck(), ...PREFIERES_FIXTURE, ...make('prefieres', 20, { optionA: 'A', optionB: 'B' })];
    for (let run = 0; run < 20; run++) {
      const selected = selectBalancedChallenges(deck, 40);
      expect(selected).toHaveLength(40);
      expect(selected.some((c) => c.type === 'prefieres')).toBe(true);
      // Sin cartas duplicadas
      expect(new Set(selected.map((c) => c.id)).size).toBe(40);
    }
  });

  it('usa las cartas prefieres del fixture aunque sean pocas', () => {
    const deck = [...make('direct', 10), ...make('group', 10), ...PREFIERES_FIXTURE];
    const selected = selectBalancedChallenges(deck, 23);
    expect(selected).toHaveLength(23);
    expect(selected.filter((c) => c.type === 'prefieres')).toHaveLength(3);
  });

  it('regresa una partida completa cuando el modo no tiene prefieres', () => {
    const deck = baseDeck();
    for (let run = 0; run < 20; run++) {
      const selected = selectBalancedChallenges(deck, 40);
      expect(selected).toHaveLength(40);
      expect(selected.some((c) => c.type === 'prefieres')).toBe(false);
    }
  });

  it('la carta con subjuegos nunca reemplaza una carta prefieres', () => {
    // Carta con subjuegos de tipo especial: no entra por distribución ni por relleno,
    // así que solo podría aparecer sustituyendo una carta normal
    const subGameCard: Challenge = {
      id: 'sub-1',
      type: 'extreme',
      template: 'Subjuego',
      isExtreme: true,
      hasSubGames: true,
      subGames: ['yo-nunca'],
    };
    const deck = [...make('prefieres', 30, { optionA: 'A', optionB: 'B' }), subGameCard];
    for (let run = 0; run < 20; run++) {
      const selected = selectBalancedChallenges(deck, 10);
      expect(selected).toHaveLength(10);
      expect(selected.includes(subGameCard)).toBe(false);
      expect(selected.every((c) => c.type === 'prefieres')).toBe(true);
    }
  });

  it('prioriza cartas prefieres no vistas recientemente', () => {
    const extra = make('prefieres', 10, { optionA: 'A', optionB: 'B' });
    const deck = [...make('direct', 40), ...PREFIERES_FIXTURE, ...extra];
    const recent = new Set(PREFIERES_FIXTURE.map((c) => c.id));
    const selected = selectBalancedChallenges(deck, 40, recent);
    const pref = selected.filter((c) => c.type === 'prefieres');
    // Si se tomaron menos prefieres que las no vistas, ninguna debe ser del historial
    if (pref.length <= extra.length) {
      expect(pref.some((c) => recent.has(c.id))).toBe(false);
    }
  });
});

describe('utilidades prefieres', () => {
  it('usa 2 tragos por defecto y respeta sips', () => {
    expect(getPrefieresSips(undefined)).toBe(2);
    expect(getPrefieresSips(0)).toBe(2);
    expect(getPrefieresSips(4)).toBe(4);
    expect(getPrefieresRuleText(1)).toBe('La minoría toma 1 trago 🍻 · Empate: todos toman 1');
    expect(getPrefieresRuleText()).toBe('La minoría toma 2 tragos 🍻 · Empate: todos toman 1');
  });

  it('arma el texto para compartir', () => {
    expect(buildPrefieresShareText('¿Qué prefieres?', 'A', 'B')).toBe('¿Qué prefieres?\n👍 A\n👎 B');
  });

  it('resuelve título y opciones juntos (un solo llamado al resolver)', () => {
    // Resolver de prueba: {player} -> Ana, {player2} -> Beto (en todo el texto)
    const resolve = vi.fn((t: string) => t.split('{player2}').join('Beto').split('{player}').join('Ana'));
    const r = resolvePrefieresTexts(resolve, '¿Qué prefieres, {player}?', 'Besar a {player2}', 'Que {player2} lea tus mensajes');
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(r).toEqual({
      title: '¿Qué prefieres, Ana?',
      optionA: 'Besar a Beto',
      optionB: 'Que Beto lea tus mensajes',
    });
    // Sin opciones: regresa strings vacíos
    expect(resolvePrefieresTexts((t) => t, '¿Qué prefieres?')).toEqual({
      title: '¿Qué prefieres?',
      optionA: '',
      optionB: '',
    });
  });
});
