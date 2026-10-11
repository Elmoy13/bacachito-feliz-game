import { PREFIERES_DEFAULT_SIPS } from '@/types/game';

/**
 * Tragos que toma la minoría en una carta "¿Qué prefieres?".
 * Usa el default si la carta no define `sips` o el valor no es válido.
 */
export const getPrefieresSips = (sips?: number): number =>
  typeof sips === 'number' && Number.isFinite(sips) && sips > 0 ? Math.round(sips) : PREFIERES_DEFAULT_SIPS;

/** Texto de la regla: "La minoría toma 2 tragos 🍻" */
export const getPrefieresMinorityText = (sips?: number): string => {
  const n = getPrefieresSips(sips);
  return `La minoría toma ${n} ${n === 1 ? 'trago' : 'tragos'} 🍻`;
};

export const PREFIERES_TIE_TEXT = 'Empate: todos toman 1';

/** Regla completa en una línea */
export const getPrefieresRuleText = (sips?: number): string =>
  `${getPrefieresMinorityText(sips)} · ${PREFIERES_TIE_TEXT}`;

// Separador invisible para resolver título y opciones en una sola pasada
const PREFIERES_SEPARATOR = '\u001F';

/**
 * Resuelve {player}/{player2} del título y las dos opciones JUNTOS,
 * para que "{player}" en 👍 y "{player2}" en 👎 sean personas distintas
 * (si se resolvieran por separado podrían salir el mismo nombre).
 */
export const resolvePrefieresTexts = (
  resolve: (text: string) => string,
  template: string,
  optionA = '',
  optionB = ''
): { title: string; optionA: string; optionB: string } => {
  const [title = '', a = '', b = ''] = resolve(
    [template, optionA, optionB].join(PREFIERES_SEPARATOR)
  ).split(PREFIERES_SEPARATOR);
  return { title, optionA: a, optionB: b };
};

/** Texto para compartir: "¿Qué prefieres?\n👍 A\n👎 B" */
export const buildPrefieresShareText = (title: string, optionA: string, optionB: string): string =>
  `${title || '¿Qué prefieres?'}\n👍 ${optionA}\n👎 ${optionB}`;
