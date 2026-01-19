export type ChallengeType = 'trivia' | 'pointing' | 'category' | 'archetype';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title?: string;
  question?: string;
  answer?: string;
  target?: string;
  punishment?: string;
  category?: string;
  archetypeType?: 'youngest' | 'oldest' | 'random';
  archetypeText?: string;
}

export interface Player {
  id: string;
  name: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentChallenge: Challenge | null;
  isPlaying: boolean;
  showAnswer: boolean;
  countdownActive: boolean;
  countdownValue: number;
}

// Fallback challenges in case Firebase fails
export const fallbackChallenges: Challenge[] = [
  // Trivia (Cultura General)
  {
    id: 'trivia-1',
    type: 'trivia',
    title: 'Cultura General',
    question: '¿Cuántos eran los Niños Héroes?',
    answer: '6 (seis)',
    punishment: 'Si contestas bien, reparte 3 tragos. Si no, fondo.'
  },
  {
    id: 'trivia-2',
    type: 'trivia',
    title: 'Cultura General',
    question: '¿En qué año se independizó México?',
    answer: '1821',
    punishment: 'Aciertas: reparte 4 tragos. Fallas: te los tomas tú.'
  },
  {
    id: 'trivia-3',
    type: 'trivia',
    title: 'Cultura General',
    question: '¿Cuál es la capital de Jalisco?',
    answer: 'Guadalajara',
    punishment: 'Bien contestado: 2 tragos para el de tu derecha. Mal: fondo.'
  },
  // Pointing (Señalamiento)
  {
    id: 'pointing-1',
    type: 'pointing',
    title: 'A la cuenta de 3, señalen...',
    target: '...al que le huelen las patas',
    punishment: 'El más señalado se toma 2 shots. Ni modo.'
  },
  {
    id: 'pointing-2',
    type: 'pointing',
    title: 'A la cuenta de 3, señalen...',
    target: '...quien regresaría con su ex',
    punishment: 'El señalado: fondo. Por intenso.'
  },
  {
    id: 'pointing-3',
    type: 'pointing',
    title: 'A la cuenta de 3, señalen...',
    target: '...al más dramático del grupo',
    punishment: 'El ganador se lleva 3 tragos de premio.'
  },
  {
    id: 'pointing-4',
    type: 'pointing',
    title: 'A la cuenta de 3, señalen...',
    target: '...a quien no debería manejar',
    punishment: 'El señalado: 2 tragos. Y no agarre las llaves.'
  },
  // Categories
  {
    id: 'category-1',
    type: 'category',
    title: 'Categorías',
    category: 'Marcas de Cigarros',
    punishment: 'El que falle: fondo. Gira a la derecha.'
  },
  {
    id: 'category-2',
    type: 'category',
    title: 'Categorías',
    category: 'Equipos de la Liga MX',
    punishment: 'Fallar = 2 tragos. Repetir equipo = fondo.'
  },
  {
    id: 'category-3',
    type: 'category',
    title: 'Categorías',
    category: 'Tipos de Mezcal',
    punishment: 'Quien pierda: shot de lo que haya.'
  },
  // Archetypes
  {
    id: 'archetype-1',
    type: 'archetype',
    archetypeType: 'youngest',
    archetypeText: 'El jugador más joven se toma 3 tragos para que agarre callo.',
    punishment: 'Es por tu bien, mijo.'
  },
  {
    id: 'archetype-2',
    type: 'archetype',
    archetypeType: 'oldest',
    archetypeText: 'El veterano del grupo se echa 5 tragos para enseñarles cómo se hace en la vieja escuela.',
    punishment: 'Con experiencia viene responsabilidad... de beber más.'
  },
  {
    id: 'archetype-3',
    type: 'archetype',
    archetypeType: 'random',
    archetypeText: 'El de la voz más chillona toma 2.',
    punishment: 'No te agüites, es con cariño.'
  }
];
