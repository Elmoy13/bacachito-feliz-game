import { Challenge } from '@/types/game';

// PRECOPEO - Tragos y fondeos, para calentar
export const precopeoChallenges: Challenge[] = [
  // Directos
  { id: 'pre-1', type: 'direct', template: '{player}, di 3 capitales de Europa en 5 segundos.', subtitle: 'Si fallas: 2 tragos.' },
  { id: 'pre-2', type: 'direct', template: '{player}, ¿en qué año cayó el Muro de Berlín?', subtitle: '1989. Aciertas: reparte 3. Fallas: te los tomas.' },
  { id: 'pre-3', type: 'direct', template: '{player}, deletrea "murciélago" al revés.', subtitle: 'Tienes 10 segundos. Fallas: 2 tragos.' },
  { id: 'pre-4', type: 'direct', template: '{player}, nombra 5 estados de México.', subtitle: 'Sin repetir y en 10 segundos.' },
  { id: 'pre-5', type: 'direct', template: '{player}, ¿cuántos huesos tiene el cuerpo humano?', subtitle: '206. Reparte 4 si aciertas.' },
  { id: 'pre-6', type: 'direct', template: '{player}, di el abecedario saltándote las vocales.', subtitle: 'Te trabas: fondo.' },
  { id: 'pre-7', type: 'direct', template: '{player}, nombra a 3 presidentes de México.', subtitle: 'Sin el actual. Fallas: 2 tragos.' },
  { id: 'pre-8', type: 'direct', template: '{player}, ¿cuántos planetas hay en el sistema solar?', subtitle: '8. Plutón ya no cuenta, como tu ex.' },
  { id: 'pre-9', type: 'direct', template: '{player}, di 5 marcas de cerveza en 8 segundos.', subtitle: 'Repites o fallas: fondo.' },
  { id: 'pre-10', type: 'direct', template: '{player}, ¿quién pintó La Mona Lisa?', subtitle: 'Da Vinci. Fácil: solo 1 trago si fallas.' },
  
  // Grupales
  { id: 'pre-11', type: 'group', template: 'El último en tocar su nariz...', subtitle: '...toma 2 tragos.' },
  { id: 'pre-12', type: 'group', template: 'Señalen a quien tiene el celular más caro.', subtitle: 'El más señalado: 2 tragos por presumido.' },
  { id: 'pre-13', type: 'group', template: 'El último en levantar la mano toma.', subtitle: '¡Ya! Demasiado lento.' },
  { id: 'pre-14', type: 'group', template: 'Todos volteen a ver a alguien.', subtitle: 'Si dos se ven: beben ambos 2 tragos.' },
  { id: 'pre-15', type: 'group', template: 'Señalen al más dormilón del grupo.', subtitle: 'El ganador: un trago por cada hora que duerme de más.' },
  { id: 'pre-16', type: 'group', template: '¿Quién tiene más mensajes sin leer?', subtitle: 'El ganador reparte 5 tragos.' },
  { id: 'pre-17', type: 'group', template: 'Piedra, papel o tijera todos.', subtitle: 'Los perdedores toman 1.' },
  { id: 'pre-18', type: 'group', template: 'Señalen a quien llegaría tarde a su propia boda.', subtitle: 'El más votado: 3 tragos.' },
  
  // Categorías
  { id: 'pre-19', type: 'category', template: 'Categoría: Tipos de pasta italiana.', subtitle: '{player} empieza. El que falle: 2 tragos.' },
  { id: 'pre-20', type: 'category', template: 'Categoría: Equipos de la Liga MX.', subtitle: 'Gira a la derecha. Sin pensar.' },
  { id: 'pre-21', type: 'category', template: 'Categoría: Países que empiecen con "M".', subtitle: '{player} arranca. Repetir = fondo.' },
  { id: 'pre-22', type: 'category', template: 'Categoría: Frutas.', subtitle: 'Fácil, ¿no? El primero en fallar: 3 tragos.' },
  { id: 'pre-23', type: 'category', template: 'Categoría: Colores.', subtitle: 'Sí, colores. Y el que repita: fondo.' },
  { id: 'pre-24', type: 'category', template: 'Categoría: Nombres que empiecen con "J".', subtitle: 'Juan, José... ¿qué más saben?' },
  
  // Votaciones
  { id: 'pre-25', type: 'vote', template: '¿Quién sería el peor maestro de primaria?', subtitle: 'Señalen. El elegido: 2 tragos.' },
  { id: 'pre-26', type: 'vote', template: '¿Quién tiene el mejor meme guardado en su cel?', subtitle: 'Muéstrenlo. Los demás votan. El peor: 3 tragos.' },
  { id: 'pre-27', type: 'vote', template: '¿Quién tarda más en contestar mensajes?', subtitle: 'El más señalado: 1 trago por cada hora que tarda.' },
  
  // Random
  { id: 'pre-28', type: 'random', template: 'Los que traigan algo azul toman 1.', subtitle: 'Revisen bien, no hagan trampa.' },
  { id: 'pre-29', type: 'random', template: '{player} y {player2}: duelo de miradas.', subtitle: 'El primero en reír: fondo.' },
  { id: 'pre-30', type: 'random', template: 'El más alto del grupo reparte 3 tragos.', subtitle: 'A quien quiera.' },
  { id: 'pre-31', type: 'random', template: '{player}, describe a alguien del grupo sin decir su nombre.', subtitle: 'Tienes 30 segundos. Si no adivinan: 2 tragos.' },
  { id: 'pre-32', type: 'random', template: 'Quien tenga el cumpleaños más cercano reparte 4.', subtitle: 'El próximo festejado manda.' },
  { id: 'pre-33', type: 'random', template: '{player}, imita a alguien del grupo.', subtitle: 'Si no adivinan en 1 minuto: fondo.' },
  
  // Extremos precopeo
  { id: 'pre-34', type: 'extreme', template: 'CALENTAMIENTO OFICIAL', subtitle: 'Todos toman 1 trago para ir entrando.', isExtreme: true },
  { id: 'pre-35', type: 'extreme', template: 'LOS QUE LLEGARON TARDE', subtitle: 'Los últimos 2 en llegar a la peda: fondo.', isExtreme: true },
  { id: 'pre-36', type: 'extreme', template: 'HORA DEL GIMNASIO', subtitle: 'El que no haya hecho ejercicio esta semana: 3 tragos.', isExtreme: true },
];

// PEDA - Shots y retos más intensos
export const pedaChallenges: Challenge[] = [
  // Directos
  { id: 'peda-1', type: 'direct', template: '{player}, di el nombre completo de alguien aquí.', subtitle: 'Nombre completo. Sin errores. Fallas: shot.' },
  { id: 'peda-2', type: 'direct', template: '{player}, cuenta del 1 al 20 saltándote los múltiplos de 3.', subtitle: 'Tienes 15 segundos.' },
  { id: 'peda-3', type: 'direct', template: '{player}, di una mentira sobre ti.', subtitle: 'Si alguien adivina que es mentira: shot. Si no: reparte 2.' },
  { id: 'peda-4', type: 'direct', template: '{player}, elige a alguien. Piedra, papel o tijera.', subtitle: 'El perdedor: shot completo.' },
  { id: 'peda-5', type: 'direct', template: '{player}, di tu mayor red flag.', subtitle: 'Sé honesto. Si te callas: shot doble.' },
  { id: 'peda-6', type: 'direct', template: '{player}, cuántos seguidores tienes en Instagram.', subtitle: 'Adivinen. El más cercano manda shot a {player}.' },
  { id: 'peda-7', type: 'direct', template: '{player}, haz una impresión de una celebridad.', subtitle: 'Si nadie adivina en 30 segundos: shot.' },
  { id: 'peda-8', type: 'direct', template: '{player}, di el crush secreto de alguien del grupo.', subtitle: 'Si aciertas: reparte 3. Si no: te tomas 3.' },
  { id: 'peda-9', type: 'direct', template: '{player}, canta una canción sin decir el título.', subtitle: 'Si no la adivinan: shot.' },
  { id: 'peda-10', type: 'direct', template: '{player}, ¿quién del grupo te cae menos?', subtitle: 'No seas cul*ro. Y tómense un shot juntos.' },
  
  // Grupales
  { id: 'peda-11', type: 'group', template: 'Señalen al más tóxico del grupo.', subtitle: 'El ganador se lleva un shot de premio.' },
  { id: 'peda-12', type: 'group', template: 'Último en gritar "¡Salud!" toma.', subtitle: '¡Ahora!' },
  { id: 'peda-13', type: 'group', template: 'Señalen a quién regresaría con su ex.', subtitle: 'Amor del bueno. El más señalado: shot.' },
  { id: 'peda-14', type: 'group', template: '¿Quién tiene más potencial de ser influencer?', subtitle: 'El elegido: shot por vendido.' },
  { id: 'peda-15', type: 'group', template: 'Adivinen la edad de los padres de {player}.', subtitle: 'El más cercano manda, el más lejos toma.' },
  { id: 'peda-16', type: 'group', template: 'Señalen a quien ha stalkeado más esta semana.', subtitle: 'El detective: shot de la vergüenza.' },
  { id: 'peda-17', type: 'group', template: 'Todos cierren los ojos y señalen al más guapo.', subtitle: 'El más señalado reparte shots.' },
  { id: 'peda-18', type: 'group', template: '¿Quién tiene más fotos con filtro en su Instagram?', subtitle: 'El más fake: shot.' },
  
  // Categorías
  { id: 'peda-19', type: 'category', template: 'Categoría: Canciones de Bad Bunny.', subtitle: '{player} empieza. Rápido, sin pensar.' },
  { id: 'peda-20', type: 'category', template: 'Categoría: Tipos de shots/tragos.', subtitle: 'El que repita se toma uno.' },
  { id: 'peda-21', type: 'category', template: 'Categoría: Ex\'s de alguien del grupo.', subtitle: 'Brutal. {player} escoge la víctima.' },
  { id: 'peda-22', type: 'category', template: 'Categoría: Apps de citas.', subtitle: 'El que no conozca ninguna: sospechoso + shot.' },
  { id: 'peda-23', type: 'category', template: 'Categoría: Excusas para cancelar planes.', subtitle: 'Creatividad. El peor: shot.' },
  { id: 'peda-24', type: 'category', template: 'Categoría: Reggaetoneros.', subtitle: 'Sin repetir. El que falle: shot.' },
  
  // Votaciones
  { id: 'peda-25', type: 'vote', template: '¿Quién sería el peor roomie?', subtitle: 'Señalen. El perdedor: shot por cochino.' },
  { id: 'peda-26', type: 'vote', template: '¿Quién tiene el peor gusto en música?', subtitle: 'El elegido pone la siguiente canción. Y shot.' },
  { id: 'peda-27', type: 'vote', template: '¿Quién es el más intenso con su pareja?', subtitle: 'El más meloso: shot.' },
  { id: 'peda-28', type: 'vote', template: '¿A quién le confiarían un secreto?', subtitle: 'Al menos votado: shot por chismoso.' },
  { id: 'peda-29', type: 'vote', template: '¿Quién sobreviviría menos en una isla desierta?', subtitle: 'El más inútil: shot.' },
  { id: 'peda-30', type: 'vote', template: '¿Quién ghostearía a alguien después de 3 citas?', subtitle: 'El más señalado: shot.' },
  
  // Random
  { id: 'peda-31', type: 'random', template: '{player} vs {player2}: ¿Quién ha tenido más relaciones?', subtitle: 'El ganador manda shot al perdedor.' },
  { id: 'peda-32', type: 'random', template: 'Waterfall iniciado por {player}.', subtitle: 'Cuando empiece, todos toman. Solo paran cuando {player} pare.' },
  { id: 'peda-33', type: 'random', template: '{player}, verdad o shot.', subtitle: 'Escoge. Si escoges verdad, el grupo pregunta.' },
  { id: 'peda-34', type: 'random', template: 'El del cumple más lejano toma shot.', subtitle: 'Todavía falta mucho, ni modo.' },
  { id: 'peda-35', type: 'random', template: '{player}, manda un mensaje random sin contexto a tu ex.', subtitle: 'Si no lo haces: shot doble.' },
  { id: 'peda-36', type: 'random', template: 'Los que no hayan ido al gym este mes: shot.', subtitle: 'Sin mentir.' },
  
  // Extremos
  { id: 'peda-37', type: 'extreme', template: 'TODOS ADENTRO', subtitle: 'Todos se toman un shot. Sin pretextos.', isExtreme: true },
  { id: 'peda-38', type: 'extreme', template: 'RULETA RUSA SOCIAL', subtitle: 'El primero que revise su celular: shot doble.', isExtreme: true },
  { id: 'peda-39', type: 'extreme', template: 'CASTIGO DIVINO', subtitle: 'El más alto y el más bajo: shot juntos.', isExtreme: true },
  { id: 'peda-40', type: 'extreme', template: 'KARMA INSTANTÁNEO', subtitle: 'Quien haya sido infiel alguna vez: shot.', isExtreme: true },
  { id: 'peda-41', type: 'extreme', template: 'SIN RAZÓN APARENTE', subtitle: 'Los solteros: shot. Los que no: también.', isExtreme: true },
  { id: 'peda-42', type: 'extreme', template: 'LA VIDA ES INJUSTA', subtitle: '{player} escoge a 2 personas. Shot los tres.', isExtreme: true },
];

// HOT - Picante, confesiones, atrevido
export const hotChallenges: Challenge[] = [
  // Directos
  { id: 'hot-1', type: 'direct', template: '{player}, ¿cuál fue tu peor beso?', subtitle: 'Cuenta los detalles o shot.' },
  { id: 'hot-2', type: 'direct', template: '{player}, ¿con quién de aquí tendrías una cita?', subtitle: 'Sé honesto. Los dos toman un shot.' },
  { id: 'hot-3', type: 'direct', template: '{player}, confiesa tu fantasía más rara.', subtitle: 'Si no confiesas: 2 shots.' },
  { id: 'hot-4', type: 'direct', template: '{player}, ¿cuál es el lugar más raro donde lo has hecho?', subtitle: 'Sin detalles gráficos. O shot.' },
  { id: 'hot-5', type: 'direct', template: '{player}, muestra tu última búsqueda en modo incógnito.', subtitle: 'Si te niegas: 3 shots.' },
  { id: 'hot-6', type: 'direct', template: '{player}, manda un DM coqueto a alguien random.', subtitle: 'Screenshot o no pasó. Si no: shot doble.' },
  { id: 'hot-7', type: 'direct', template: '{player}, ¿cuál es tu body count?', subtitle: 'Puedes mentir pero si te cachan: 3 shots.' },
  { id: 'hot-8', type: 'direct', template: '{player}, ¿alguna vez fingiste?', subtitle: 'Todos fingen algo. Confiesa o shot.' },
  { id: 'hot-9', type: 'direct', template: '{player}, describe tu tipo físico ideal.', subtitle: 'Todos juzgarán. Shot si te echas para atrás.' },
  { id: 'hot-10', type: 'direct', template: '{player}, ¿a quién de aquí le darías tu número si no los conocieras?', subtitle: 'Esa persona reparte un shot.' },
  
  // Grupales
  { id: 'hot-11', type: 'group', template: 'Señalen a quién le urge más.', subtitle: 'El más necesitado: shot.' },
  { id: 'hot-12', type: 'group', template: '¿Quién tiene más juego?', subtitle: 'El más player: shot de respeto.' },
  { id: 'hot-13', type: 'group', template: 'Señalen a quién stalkean más en Instagram.', subtitle: 'Esa persona decide quién toma.' },
  { id: 'hot-14', type: 'group', template: '¿Quién es el más caliente del grupo?', subtitle: 'El ganador reparte 3 shots.' },
  { id: 'hot-15', type: 'group', template: 'Señalen a quién le gusta alguien aquí presente.', subtitle: 'Si es verdad: shot. Si no: shot también.' },
  { id: 'hot-16', type: 'group', template: '¿Quién creen que es el mejor besando?', subtitle: 'Basado solo en vibra. El elegido: shot.' },
  { id: 'hot-17', type: 'group', template: 'Señalen a quién le mandarían un nude.', subtitle: 'Hipotéticamente. Shot al más señalado.' },
  { id: 'hot-18', type: 'group', template: '¿Quién tiene las fotos más atrevidas en su galería?', subtitle: 'No hay que mostrar. Pero shot al ganador.' },
  
  // Votaciones
  { id: 'hot-19', type: 'vote', template: '¿Quién tiene más probabilidad de hacer un Only?', subtitle: 'El emprendedor: shot.' },
  { id: 'hot-20', type: 'vote', template: '¿Quién ha mandado más nudes en su vida?', subtitle: 'El artista: shot con honor.' },
  { id: 'hot-21', type: 'vote', template: '¿Quién sería el peor en la cama?', subtitle: 'El más votado puede defenderse... o shot.' },
  { id: 'hot-22', type: 'vote', template: '¿A quién no invitarían a una fiesta swinger?', subtitle: 'El más conservador: shot.' },
  { id: 'hot-23', type: 'vote', template: '¿Quién ha tenido el peor ex?', subtitle: 'Historia o shot.' },
  { id: 'hot-24', type: 'vote', template: '¿Quién es más probable que termine con alguien de aquí?', subtitle: 'Ambos señalados: shot juntos.' },
  
  // Random
  { id: 'hot-25', type: 'random', template: '{player} y {player2}: 7 segundos en el cielo (miradas).', subtitle: 'Quien quite la mirada primero: shot.' },
  { id: 'hot-26', type: 'random', template: '{player}, haz tu mejor voz sexy.', subtitle: 'El grupo califica del 1-10. Menos de 7: shot.' },
  { id: 'hot-27', type: 'random', template: '{player}, dile un piropo a {player2}.', subtitle: 'Que sea bueno. Ambos toman después.' },
  { id: 'hot-28', type: 'random', template: 'Los que hayan tenido un sueño hot con alguien de aquí: shot.', subtitle: 'Nadie tiene que saber con quién.' },
  { id: 'hot-29', type: 'random', template: '{player}, ¿qué es lo más atrevido en tu teléfono?', subtitle: 'Describe sin mostrar. O shot.' },
  { id: 'hot-30', type: 'random', template: 'Los que hayan besado a alguien del mismo sexo: shot.', subtitle: 'Experiencias. Shot.' },
  
  // Extremos
  { id: 'hot-31', type: 'extreme', template: 'CONFESIONARIO', subtitle: 'El que haya pensado algo sexual sobre alguien aquí: shot.', isExtreme: true },
  { id: 'hot-32', type: 'extreme', template: 'VERDAD INCÓMODA', subtitle: 'Di algo que nunca has dicho en voz alta. O 3 shots.', isExtreme: true },
  { id: 'hot-33', type: 'extreme', template: 'TENSIÓN SEXUAL', subtitle: '{player} y {player2}: 10 segundos de contacto visual. Quien ría: shot.', isExtreme: true },
  { id: 'hot-34', type: 'extreme', template: 'EL PECADOR', subtitle: 'El que más ha pecado esta semana según el grupo: shot doble.', isExtreme: true },
  { id: 'hot-35', type: 'extreme', template: 'SECRETO SUCIO', subtitle: '{player}, confiesa algo vergonzoso o toma 3 shots.', isExtreme: true },
  { id: 'hot-36', type: 'extreme', template: 'CALOR HUMANO', subtitle: 'Los que estén solteros y listos: shot por la causa.', isExtreme: true },
];

// RANDOM MIX - De todo un poco
export const randomMixChallenges: Challenge[] = [
  // Directos variados
  { id: 'mix-1', type: 'direct', template: '{player}, haz 10 sentadillas o toma 2.', subtitle: 'El grupo cuenta.' },
  { id: 'mix-2', type: 'direct', template: '{player}, habla en inglés por los próximos 3 turnos.', subtitle: 'Si hablas español: shot.' },
  { id: 'mix-3', type: 'direct', template: '{player}, intercambia una prenda con {player2}.', subtitle: 'O shot cada uno.' },
  { id: 'mix-4', type: 'direct', template: '{player}, deja que el grupo revise tu galería 5 segundos.', subtitle: 'Si te niegas: 2 shots.' },
  { id: 'mix-5', type: 'direct', template: '{player}, llama a tu mamá y dile que la quieres.', subtitle: 'Si no contesta: un trago. Si sí: reparte 3.' },
  { id: 'mix-6', type: 'direct', template: '{player}, haz tu mejor baile de TikTok.', subtitle: 'Sin pena. El grupo califica.' },
  { id: 'mix-7', type: 'direct', template: '{player}, di 3 cosas que admiras de {player2}.', subtitle: 'Si no se te ocurren: shot.' },
  { id: 'mix-8', type: 'direct', template: '{player}, cuenta tu historia más vergonzosa.', subtitle: 'Si el grupo ríe: reparte 3. Si no: tómalos.' },
  { id: 'mix-9', type: 'direct', template: '{player}, haz una llamada random y di "te extraño".', subtitle: 'Si te cuelgan: shot.' },
  { id: 'mix-10', type: 'direct', template: '{player}, di el nombre de tu primer amor.', subtitle: 'Todos lo juzgarán.' },
  
  // Grupales random
  { id: 'mix-11', type: 'group', template: 'El que tenga más apps instaladas toma.', subtitle: 'Cuenten. El máximo: shot.' },
  { id: 'mix-12', type: 'group', template: 'Los que no se sepan el himno nacional: shot.', subtitle: 'Cántenlo para comprobarlo.' },
  { id: 'mix-13', type: 'group', template: 'Señalen al que tiene peor sentido del humor.', subtitle: 'Que cuente un chiste para defenderse.' },
  { id: 'mix-14', type: 'group', template: 'Los zurdos toman 1. Los derechos toman 2.', subtitle: 'La vida es injusta.' },
  { id: 'mix-15', type: 'group', template: 'Señalen a quién le prestarían dinero.', subtitle: 'El menos señalado: shot por desconfiado.' },
  { id: 'mix-16', type: 'group', template: '¿Quién gasta más en comida rápida?', subtitle: 'El gordito del grupo: shot.' },
  
  // Categorías diversas
  { id: 'mix-17', type: 'category', template: 'Categoría: Personajes de anime.', subtitle: '{player} empieza. El que no sepa: automáticamente sospechoso.' },
  { id: 'mix-18', type: 'category', template: 'Categoría: Películas de Marvel.', subtitle: 'Sin repetir. Rápido.' },
  { id: 'mix-19', type: 'category', template: 'Categoría: Marcas de carros.', subtitle: 'El que tarde más de 3 segundos: shot.' },
  { id: 'mix-20', type: 'category', template: 'Categoría: Países de Asia.', subtitle: 'Más difícil de lo que creen.' },
  { id: 'mix-21', type: 'category', template: 'Categoría: Nombres de Pokémon.', subtitle: 'Los 150 originales cuentan. El resto también.' },
  { id: 'mix-22', type: 'category', template: 'Categoría: Aplicaciones de delivery.', subtitle: 'El que repita: shot por flojo.' },
  
  // Votaciones variadas
  { id: 'mix-23', type: 'vote', template: '¿Quién sería el mejor vendedor de autos usados?', subtitle: 'El más labia: shot.' },
  { id: 'mix-24', type: 'vote', template: '¿Quién es el más mala copa?', subtitle: 'El ganador toma otro para comprobarlo.' },
  { id: 'mix-25', type: 'vote', template: '¿A quién le confiarían su contraseña del banco?', subtitle: 'El menos confiable: shot.' },
  { id: 'mix-26', type: 'vote', template: '¿Quién tiene la risa más contagiosa?', subtitle: 'Hagan reír al grupo o shot.' },
  
  // Random
  { id: 'mix-27', type: 'random', template: 'El más joven del grupo reparte 4 shots.', subtitle: 'Los que tienen más callo aguantan.' },
  { id: 'mix-28', type: 'random', template: 'El del nombre más largo toma.', subtitle: 'Cuenten las letras.' },
  { id: 'mix-29', type: 'random', template: '{player}, róbale el trago a {player2}.', subtitle: 'Sin preguntar.' },
  { id: 'mix-30', type: 'random', template: 'Los que usen iPhone toman 1. Android: 2.', subtitle: 'La guerra continúa.' },
  
  // Extremos mix
  { id: 'mix-31', type: 'extreme', template: 'MOMENTO INCÓMODO', subtitle: 'Todos guarden silencio 30 segundos. El primero en hablar: shot.', isExtreme: true },
  { id: 'mix-32', type: 'extreme', template: 'FLASHBACK', subtitle: 'Recuerden algo vergonzoso que hayan hecho en una peda. Cuéntenlo o shot.', isExtreme: true },
  { id: 'mix-33', type: 'extreme', template: 'RULETA DE LA VERGÜENZA', subtitle: '{player} escoge 2 personas para bailar juntos. Si no: shots.', isExtreme: true },
  { id: 'mix-34', type: 'extreme', template: 'EL MOMENTO LLEGÓ', subtitle: 'Todos toman un shot mirándose a los ojos.', isExtreme: true },
];

// Game modes configuration
export interface GameMode {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  challenges: Challenge[];
}

export const gameModes: GameMode[] = [
  {
    id: 'precopeo',
    name: 'Pre-copeo',
    description: 'Para calentar motores. Tragos y fondeos suaves.',
    emoji: '🍺',
    color: 'bg-amber-500',
    challenges: precopeoChallenges,
  },
  {
    id: 'peda',
    name: 'La Peda',
    description: 'Ya entramos en calor. Shots y retos intensos.',
    emoji: '🥃',
    color: 'bg-emerald-500',
    challenges: pedaChallenges,
  },
  {
    id: 'hot',
    name: 'Hot',
    description: 'Modo picante. Confesiones y atrevimientos.',
    emoji: '🔥',
    color: 'bg-rose-500',
    challenges: hotChallenges,
  },
  {
    id: 'random',
    name: 'Random Mix',
    description: 'De todo un poco. Sorpresas garantizadas.',
    emoji: '🎲',
    color: 'bg-violet-500',
    challenges: randomMixChallenges,
  },
  {
    id: 'all',
    name: 'Todo o Nada',
    description: 'Todas las cartas. Sin filtros.',
    emoji: '💀',
    color: 'bg-gray-800',
    challenges: [...precopeoChallenges, ...pedaChallenges, ...hotChallenges, ...randomMixChallenges],
  },
];

export const getChallengesByMode = (modeId: string): Challenge[] => {
  const mode = gameModes.find(m => m.id === modeId);
  return mode ? mode.challenges : randomMixChallenges;
};
