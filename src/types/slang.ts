export type SlangRegion =
  | 'neutro'
  | 'chilango'
  | 'norteno'
  | 'regio'
  | 'tapatio'
  | 'yucateco'
  | 'colombiano'
  | 'argentino'
  | 'chileno'
  | 'universal';

export interface SlangEntry {
  token: string;
  description: string;
  translations: Record<SlangRegion, string>;
}

export interface RegionInfo {
  id: SlangRegion;
  name: string;
  emoji: string;
  examplePhrase: string;
  country: string;
}

export const REGIONS: RegionInfo[] = [
  { id: 'chilango', name: 'Chilango', emoji: '🇲🇽', examplePhrase: '¿Qué onda, wey? ¿Nos echamos unas chelas?', country: 'México (CDMX)' },
  { id: 'norteno', name: 'Norteño', emoji: '🤠', examplePhrase: '¿Qué onda, vato? ¿Pisteamos?', country: 'México (Norte)' },
  { id: 'regio', name: 'Regio', emoji: '🦁', examplePhrase: '¿Qué onda, wey? ¿Nos echamos unas cheves?', country: 'México (MTY)' },
  { id: 'tapatio', name: 'Tapatío', emoji: '🌮', examplePhrase: '¿Qué onda, morro? ¿Chupamos?', country: 'México (GDL)' },
  { id: 'yucateco', name: 'Yucateco', emoji: '🏖️', examplePhrase: '¿Qué onda, huiro? ¿Jaraneamos?', country: 'México (Yucatán)' },
  { id: 'colombiano', name: 'Colombiano', emoji: '🇨🇴', examplePhrase: '¿Qué hubo, parcero? ¿Nos tomamos unas polas?', country: 'Colombia' },
  { id: 'argentino', name: 'Argentino', emoji: '🇦🇷', examplePhrase: '¿Qué onda, boludo? ¿Escabiamos?', country: 'Argentina' },
  { id: 'chileno', name: 'Chileno', emoji: '🇨🇱', examplePhrase: '¿Qué onda, weón? ¿Carreteamos?', country: 'Chile' },
  { id: 'neutro', name: 'Neutro', emoji: '🌎', examplePhrase: '¿Qué onda, güey? ¿Chupamos?', country: 'México (genérico)' },
  { id: 'universal', name: 'Sin slang', emoji: '📖', examplePhrase: '¿Qué onda, amigo? ¿Tomamos?', country: 'Español estándar' },
];

export const SLANG_STORAGE_KEY = 'bacachito-slang-region';
export const DEFAULT_REGION: SlangRegion = 'neutro';
