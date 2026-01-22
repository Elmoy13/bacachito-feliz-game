export type ChallengeType = 'direct' | 'group' | 'category' | 'extreme' | 'vote' | 'random' | 'timed';

export interface Challenge {
  id: string;
  type: ChallengeType;
  template: string; // Uses {player} for random player insertion
  subtitle?: string;
  isExtreme?: boolean;
  duration?: number; // Duration in seconds for timed challenges
}

export interface Player {
  id: string;
  name: string;
}

export interface GameState {
  players: Player[];
  currentChallengeIndex: number;
  challenges: Challenge[];
  isPlaying: boolean;
}

// Retos locales - más directos y rápidos
export const fallbackChallenges: Challenge[] = [
  // DIRECTOS - nombran a alguien
  {
    id: 'd1',
    type: 'direct',
    template: '{player}, ¿cuál es la capital de Jalisco?',
    subtitle: 'Bien: reparte 3. Mal: fondo.'
  },
  {
    id: 'd2',
    type: 'direct',
    template: '{player}, di 5 marcas de cerveza en 10 segundos.',
    subtitle: 'Si fallas, te los tomas tú.'
  },
  {
    id: 'd3',
    type: 'direct',
    template: '{player}, ¿en qué año nació el Chavo del 8?',
    subtitle: '1971. Aciertas: 4 tragos pa\' repartir.'
  },
  {
    id: 'd4',
    type: 'direct',
    template: '{player} escoge a alguien. Piedra, papel o tijera.',
    subtitle: 'El perdedor: fondo.'
  },
  {
    id: 'd5',
    type: 'direct',
    template: '{player}, imita a alguien del grupo.',
    subtitle: 'Si no adivinan quién es: 2 tragos para ti.'
  },
  {
    id: 'd6',
    type: 'direct',
    template: '{player}, di el nombre completo de alguien aquí.',
    subtitle: 'Si te equivocas: fondo, obviamente.'
  },
  
  // GRUPALES - todos participan
  {
    id: 'g1',
    type: 'group',
    template: 'Todos señalen al más dramático.',
    subtitle: 'El más señalado: 3 tragos.'
  },
  {
    id: 'g2',
    type: 'group',
    template: 'El último en tocar su nariz toma.',
    subtitle: '¡Ya! El lento paga.'
  },
  {
    id: 'g3',
    type: 'group',
    template: 'Señalen a quien regresaría con su ex.',
    subtitle: 'El ganador se lleva 2 shots.'
  },
  {
    id: 'g4',
    type: 'group',
    template: 'El último en levantar la mano toma.',
    subtitle: '¡Arriba las manos! Demasiado lento, compa.'
  },
  {
    id: 'g5',
    type: 'group',
    template: 'Todos volteen a ver a alguien. Si dos se ven: beben ambos.',
    subtitle: 'Tensión pura.'
  },
  
  // CATEGORÍAS - rondas rápidas
  {
    id: 'c1',
    type: 'category',
    template: 'Categoría: Equipos de la Liga MX',
    subtitle: '{player} empieza. Gira a la derecha. El que falle: fondo.'
  },
  {
    id: 'c2',
    type: 'category',
    template: 'Categoría: Tipos de tacos',
    subtitle: '{player} empieza. El que repita o falle: 2 tragos.'
  },
  {
    id: 'c3',
    type: 'category',
    template: 'Categoría: Marcas de cigarro',
    subtitle: 'Rápido. Sin pensar. {player} arranca.'
  },
  {
    id: 'c4',
    type: 'category',
    template: 'Categoría: Países de Sudamérica',
    subtitle: '{player} inicia. Repetir = fondo.'
  },
  
  // EXTREMOS - pantalla roja
  {
    id: 'e1',
    type: 'extreme',
    template: 'SOLO PORQUE SÍ',
    subtitle: 'Los que traigan tenis: FONDO.',
    isExtreme: true
  },
  {
    id: 'e2',
    type: 'extreme',
    template: 'RETO EXTREMO',
    subtitle: 'El más chaparro del grupo se empina 3.',
    isExtreme: true
  },
  {
    id: 'e3',
    type: 'extreme',
    template: 'CASTIGO DIVINO',
    subtitle: 'El que tenga el celular más viejo: fondo.',
    isExtreme: true
  },
  {
    id: 'e4',
    type: 'extreme',
    template: 'SIN RAZÓN APARENTE',
    subtitle: 'Los solteros toman 2. Los que no, también.',
    isExtreme: true
  },
  {
    id: 'e5',
    type: 'extreme',
    template: 'LA VIDA ES INJUSTA',
    subtitle: '{player} escoge a 3 personas. Todos toman.',
    isExtreme: true
  },
  {
    id: 'e6',
    type: 'extreme',
    template: 'PORQUE TE QUIERO',
    subtitle: '{player}, tu mejor amigo aquí se toma 2 contigo.',
    isExtreme: true
  },
  
  // VOTACIONES RÁPIDAS
  {
    id: 'v1',
    type: 'vote',
    template: '¿Quién es el más intenso del grupo?',
    subtitle: 'Señalen a la cuenta de 3. El ganador: 3 tragos.'
  },
  {
    id: 'v2',
    type: 'vote',
    template: '¿Quién tiene peor gusto en música?',
    subtitle: 'El elegido pone la siguiente rola... y toma 2.'
  },
  {
    id: 'v3',
    type: 'vote',
    template: '¿Quién sería el peor roomie?',
    subtitle: 'Señalen. El perdedor: fondo por cochino.'
  },
  
  // RANDOM / WILD
  {
    id: 'r1',
    type: 'random',
    template: '{player}, tienes 2 opciones:',
    subtitle: 'Cuenta un secreto vergonzoso O tómate 4 tragos.'
  },
  {
    id: 'r2',
    type: 'random',
    template: 'Duelo: {player} vs {player2}',
    subtitle: 'Vean quién aguanta más la mirada. El que se ría: fondo.'
  },
  {
    id: 'r3',
    type: 'random',
    template: '{player}, manda un mensaje random a tu ex.',
    subtitle: 'Si no lo haces: 5 tragos. Si sí: reparte 5.'
  },
  {
    id: 'r4',
    type: 'random',
    template: 'Waterfall iniciado por {player}',
    subtitle: 'Cuando empiece a tomar, todos toman. Solo para cuando pare.'
  },
  {
    id: 'r5',
    type: 'random',
    template: '{player}, llama a tu mamá y dile que la quieres.',
    subtitle: 'Si no contestas o no lo haces: FONDO.'
  }
];
