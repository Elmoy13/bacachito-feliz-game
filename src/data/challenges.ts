import { Challenge } from '@/types/game';
import { LucideIcon, Beer, Flame, Clock, Zap, Target, Users, Heart, Shuffle, Crown, Skull, PartyPopper } from 'lucide-react';

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
  { id: 'pre-11', type: 'direct', template: '{player}, di 4 tipos de queso.', subtitle: 'Tienes 8 segundos.' },
  { id: 'pre-12', type: 'direct', template: '{player}, ¿cuál es la raíz cuadrada de 144?', subtitle: '12. Aciertas: reparte 2.' },
  { id: 'pre-13', type: 'direct', template: '{player}, nombra 3 ríos de América.', subtitle: 'Sin googlear. Fallas: 2 tragos.' },
  
  // Para el lector
  { id: 'pre-r1', type: 'direct', template: 'El que está leyendo esto...', subtitle: '...toma 2 tragos por ser tan servicial.' },
  { id: 'pre-r2', type: 'direct', template: 'Lector, escoge a alguien.', subtitle: 'Esa persona toma 3 tragos.' },
  { id: 'pre-r3', type: 'direct', template: 'El que lee esta carta...', subtitle: '...reparte 4 tragos entre quienes quiera.' },
  
  // Grupales
  { id: 'pre-14', type: 'group', template: 'El último en tocar su nariz...', subtitle: '...toma 2 tragos.' },
  { id: 'pre-15', type: 'group', template: 'Señalen a quien tiene el celular más caro.', subtitle: 'El más señalado: 2 tragos por presumido.' },
  { id: 'pre-16', type: 'group', template: 'El último en levantar la mano toma.', subtitle: '¡Ya! Demasiado lento.' },
  { id: 'pre-17', type: 'group', template: 'Todos volteen a ver a alguien.', subtitle: 'Si dos se ven: beben ambos 2 tragos.' },
  { id: 'pre-18', type: 'group', template: 'Señalen al más dormilón del grupo.', subtitle: 'El ganador: un trago por cada hora que duerme de más.' },
  { id: 'pre-19', type: 'group', template: '¿Quién tiene más mensajes sin leer?', subtitle: 'El ganador reparte 5 tragos.' },
  { id: 'pre-20', type: 'group', template: 'Piedra, papel o tijera todos.', subtitle: 'Los perdedores toman 1.' },
  { id: 'pre-21', type: 'group', template: 'Señalen a quien llegaría tarde a su propia boda.', subtitle: 'El más votado: 3 tragos.' },
  { id: 'pre-22', type: 'group', template: 'El último en aplaudir toma.', subtitle: '¡Aplaudan!' },
  { id: 'pre-23', type: 'group', template: 'Señalen al más tacaño.', subtitle: 'El codo: 3 tragos.' },
  
  // Categorías
  { id: 'pre-24', type: 'category', template: 'Categoría: Tipos de pasta italiana', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: 3 tragos' },
  { id: 'pre-25', type: 'category', template: 'Categoría: Equipos de la Liga MX', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: 3 tragos' },
  { id: 'pre-26', type: 'category', template: 'Categoría: Países que empiecen con "M"', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: 3 tragos' },
  { id: 'pre-27', type: 'category', template: 'Categoría: Frutas', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: 3 tragos' },
  { id: 'pre-28', type: 'category', template: 'Categoría: Colores', subtitle: '{player} empieza, gira a la DERECHA.\nSí, colores. Y el que repita: fondo.' },
  { id: 'pre-29', type: 'category', template: 'Categoría: Nombres que empiecen con "J"', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: 3 tragos' },
  { id: 'pre-30', type: 'category', template: 'Categoría: Marcas de cigarros', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: 3 tragos' },
  { id: 'pre-31', type: 'category', template: 'Categoría: Tipos de cerveza', subtitle: '{player} empieza, gira a la DERECHA.\nEl experto pierde: fondo' },
  { id: 'pre-32', type: 'category', template: 'Categoría: Capitales del mundo', subtitle: '{player} empieza, gira a la DERECHA.\nEl que falle: 3 tragos' },
  
  // Votaciones
  { id: 'pre-33', type: 'vote', template: '¿Quién sería el peor maestro de primaria?', subtitle: 'Señalen. El elegido: 2 tragos.' },
  { id: 'pre-34', type: 'vote', template: '¿Quién tiene el mejor meme guardado en su cel?', subtitle: 'Muéstrenlo. Los demás votan. El peor: 3 tragos.' },
  { id: 'pre-35', type: 'vote', template: '¿Quién tarda más en contestar mensajes?', subtitle: 'El más señalado: 1 trago por cada hora que tarda.' },
  { id: 'pre-36', type: 'vote', template: '¿Quién sería el peor conductor de Uber?', subtitle: 'El elegido: 2 tragos y debe imitar.' },
  
  // Random
  { id: 'pre-37', type: 'random', template: 'Los que traigan algo azul toman 1.', subtitle: 'Revisen bien, no hagan trampa.' },
  { id: 'pre-38', type: 'random', template: '{player} y {player2}: duelo de miradas.', subtitle: 'El primero en reír: fondo.' },
  { id: 'pre-39', type: 'random', template: 'El más alto del grupo reparte 3 tragos.', subtitle: 'A quien quiera.' },
  { id: 'pre-40', type: 'random', template: '{player}, describe a alguien del grupo sin decir su nombre.', subtitle: 'Tienes 30 segundos. Si no adivinan: 2 tragos.' },
  { id: 'pre-41', type: 'random', template: 'Quien tenga el cumpleaños más cercano reparte 4.', subtitle: 'El próximo festejado manda.' },
  { id: 'pre-42', type: 'random', template: '{player}, imita a alguien del grupo.', subtitle: 'Si no adivinan en 1 minuto: fondo.' },
  { id: 'pre-43', type: 'random', template: 'Los de playera oscura toman 2.', subtitle: 'Negro, azul marino, gris oscuro...' },
  
  // TIMED - Retos intermedios con tiempo
  { id: 'pre-t1', type: 'timed', template: '{player}, no puedes usar las manos', subtitle: 'Si usas las manos en el próximo minuto: 3 tragos', duration: 60 },
  { id: 'pre-t2', type: 'timed', template: '{player}, solo puedes hablar en preguntas', subtitle: 'Si afirmas algo en el próximo minuto: 2 tragos', duration: 60 },
  { id: 'pre-t3', type: 'timed', template: 'Todos deben hablar en inglés', subtitle: 'El que hable español en 90 segundos: trago', duration: 90 },
  { id: 'pre-t4', type: 'timed', template: '{player}, no puedes decir "no"', subtitle: 'Por 2 minutos. Cada vez que digas "no": trago', duration: 120 },
  { id: 'pre-t5', type: 'timed', template: 'Nadie puede decir el nombre de {player}', subtitle: 'Por 90 segundos. Quien lo diga: 2 tragos', duration: 90 },
  
  // POWER - Cartas de poder especiales
  { id: 'pre-p1', type: 'power', template: '{player}, eres ESCUDO', subtitle: 'Puedes bloquear UN reto diciendo "ESCUDO" antes de que acabe la partida. Nadie más puede usar tu escudo.', isPower: true },
  { id: 'pre-p2', type: 'power', template: '{player}, eres ESPEJO', subtitle: 'Puedes decir "ESPEJO" cuando te toque tomar y esa persona toma por ti. Solo una vez.', isPower: true },
  
  // Extremos precopeo
  { id: 'pre-44', type: 'extreme', template: 'CALENTAMIENTO OFICIAL', subtitle: 'Todos toman 1 trago para ir entrando.', isExtreme: true },
  { id: 'pre-45', type: 'extreme', template: 'LOS QUE LLEGARON TARDE', subtitle: 'Los últimos 2 en llegar a la peda: fondo.', isExtreme: true },
  { id: 'pre-46', type: 'extreme', template: 'HORA DEL GIMNASIO', subtitle: 'El que no haya hecho ejercicio esta semana: 3 tragos.', isExtreme: true },
  { id: 'pre-47', type: 'extreme', template: 'EL ANFITRIÓN MANDA', subtitle: 'Quien organizó esto reparte 5 tragos.', isExtreme: true },
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
  { id: 'peda-10', type: 'direct', template: '{player}, ¿quién del grupo te cae menos?', subtitle: 'No seas culero. Y tómense un shot juntos.' },
  { id: 'peda-11', type: 'direct', template: '{player}, di algo en otro idioma.', subtitle: 'Si nadie entiende: shot. Si sí: reparte 2.' },
  { id: 'peda-12', type: 'direct', template: '{player}, haz una promesa que cumplirás.', subtitle: 'Si no la cumples antes de acabar la noche: 5 shots.' },
  
  // Para el lector
  { id: 'peda-r1', type: 'direct', template: 'Quien lee esto escoge a 2 personas.', subtitle: 'Ellos se toman un shot mirándose a los ojos.' },
  { id: 'peda-r2', type: 'direct', template: 'El lector tiene el poder.', subtitle: 'Puedes mandar a CUALQUIERA a tomar fondo. Elige sabiamente.' },
  { id: 'peda-r3', type: 'direct', template: 'Por leer esta carta...', subtitle: '...todos los demás toman 1 trago mientras tú descansas.' },
  
  // Grupales
  { id: 'peda-13', type: 'group', template: 'Señalen al más tóxico del grupo.', subtitle: 'El ganador se lleva un shot de premio.' },
  { id: 'peda-14', type: 'group', template: 'Último en gritar "¡Salud!" toma.', subtitle: '¡Ahora!' },
  { id: 'peda-15', type: 'group', template: 'Señalen a quién regresaría con su ex.', subtitle: 'Amor del bueno. El más señalado: shot.' },
  { id: 'peda-16', type: 'group', template: '¿Quién tiene más potencial de ser influencer?', subtitle: 'El elegido: shot por vendido.' },
  { id: 'peda-17', type: 'group', template: 'Adivinen la edad de los padres de {player}.', subtitle: 'El más cercano manda, el más lejos toma.' },
  { id: 'peda-18', type: 'group', template: 'Señalen a quien ha stalkeado más esta semana.', subtitle: 'El detective: shot de la vergüenza.' },
  { id: 'peda-19', type: 'group', template: 'Todos cierren los ojos y señalen al más guapo.', subtitle: 'El más señalado reparte shots.' },
  { id: 'peda-20', type: 'group', template: '¿Quién tiene más fotos con filtro en su Instagram?', subtitle: 'El más fake: shot.' },
  { id: 'peda-21', type: 'group', template: 'Último en tocar el piso: shot.', subtitle: '¡Ya!' },
  { id: 'peda-22', type: 'group', template: 'Señalen a quien ha mentido hoy.', subtitle: 'Todos somos mentirosos. El más votado: shot.' },
  
  // Categorías
  { id: 'peda-23', type: 'category', template: 'Categoría: Canciones de Bad Bunny', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'peda-24', type: 'category', template: 'Categoría: Tipos de shots/tragos', subtitle: '{player} empieza, gira a la DERECHA.\nEl que repita se toma uno.' },
  { id: 'peda-25', type: 'category', template: 'Categoría: Apps de citas', subtitle: '{player} empieza, gira a la DERECHA.\nEl que no conozca ninguna: sospechoso + shot' },
  { id: 'peda-26', type: 'category', template: 'Categoría: Excusas para cancelar planes', subtitle: '{player} empieza, gira a la DERECHA.\nEl peor: shot' },
  { id: 'peda-27', type: 'category', template: 'Categoría: Reggaetoneros', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'peda-28', type: 'category', template: 'Categoría: Películas de terror', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'peda-29', type: 'category', template: 'Categoría: Series de Netflix', subtitle: '{player} empieza, gira a la DERECHA.\nEl básico que repita: shot' },
  { id: 'peda-30', type: 'category', template: 'Categoría: Apodos de alguien aquí', subtitle: '{player} escoge la víctima, gira a la DERECHA.\nEl que no sepa: shot' },
  
  // Votaciones
  { id: 'peda-31', type: 'vote', template: '¿Quién sería el peor roomie?', subtitle: 'Señalen. El perdedor: shot por cochino.' },
  { id: 'peda-32', type: 'vote', template: '¿Quién tiene el peor gusto en música?', subtitle: 'El elegido pone la siguiente canción. Y shot.' },
  { id: 'peda-33', type: 'vote', template: '¿Quién es el más intenso con su pareja?', subtitle: 'El más meloso: shot.' },
  { id: 'peda-34', type: 'vote', template: '¿A quién le confiarían un secreto?', subtitle: 'Al menos votado: shot por chismoso.' },
  { id: 'peda-35', type: 'vote', template: '¿Quién sobreviviría menos en una isla desierta?', subtitle: 'El más inútil: shot.' },
  { id: 'peda-36', type: 'vote', template: '¿Quién ghostearía a alguien después de 3 citas?', subtitle: 'El más señalado: shot.' },
  
  // Random
  { id: 'peda-37', type: 'random', template: '{player} vs {player2}: ¿Quién ha tenido más relaciones?', subtitle: 'El ganador manda shot al perdedor.' },
  { id: 'peda-38', type: 'random', template: 'Waterfall iniciado por {player}.', subtitle: 'Cuando empiece, todos toman. Solo paran cuando {player} pare.' },
  { id: 'peda-39', type: 'random', template: '{player}, verdad o shot.', subtitle: 'Escoge. Si escoges verdad, el grupo pregunta.' },
  { id: 'peda-40', type: 'random', template: 'El del cumple más lejano toma shot.', subtitle: 'Todavía falta mucho, ni modo.' },
  { id: 'peda-41', type: 'random', template: '{player}, manda un mensaje random sin contexto a tu ex.', subtitle: 'Si no lo haces: shot doble.' },
  { id: 'peda-42', type: 'random', template: 'Los que no hayan ido al gym este mes: shot.', subtitle: 'Sin mentir.' },
  { id: 'peda-43', type: 'random', template: 'Los que estén en grupos de WhatsApp silenciados: shot.', subtitle: 'Todos lo hacemos.' },
  
  // TIMED - Retos intermedios
  { id: 'peda-t1', type: 'timed', template: '{player}, no puedes decir "yo"', subtitle: 'Durante 2 minutos. Cada vez que lo digas: trago', duration: 120 },
  { id: 'peda-t2', type: 'timed', template: '{player} es el "sirviente"', subtitle: 'Por 2 minutos debes servirle a todos. Si te niegas: shot', duration: 120 },
  { id: 'peda-t3', type: 'timed', template: 'Nadie puede decir groserías', subtitle: 'Por 90 segundos. El que diga una: shot inmediato', duration: 90 },
  { id: 'peda-t4', type: 'timed', template: '{player}, debes terminar todo con "wey"', subtitle: 'Por 1 minuto. Si no lo haces: trago', duration: 60 },
  { id: 'peda-t5', type: 'timed', template: '{player} no puede reír', subtitle: 'Por 2 minutos. Los demás pueden intentar hacerlo reír.', duration: 120 },
  { id: 'peda-t6', type: 'timed', template: '{player} debe hablar como robot', subtitle: 'Por 90 segundos. Si suena humano: shot', duration: 90 },
  
  // POWER - Cartas de poder
  { id: 'peda-p1', type: 'power', template: '{player}, eres SHAZAM', subtitle: 'Puedes gritar "SHAZAM" antes de que acabe la partida. Todos rellenan su trago y le dan fondo. Solo una vez.', isPower: true },
  { id: 'peda-p2', type: 'power', template: '{player}, eres DICTADOR', subtitle: 'Por las próximas 3 cartas, tú decides quién toma después de cada reto. Usa tu poder sabiamente.', isPower: true },
  { id: 'peda-p3', type: 'power', template: '{player}, eres INVISIBLE', subtitle: 'Puedes saltarte UN reto diciendo "INVISIBLE". Solo una vez durante toda la partida.', isPower: true },
  
  // Extremos
  { id: 'peda-44', type: 'extreme', template: 'TODOS ADENTRO', subtitle: 'Todos se toman un shot. Sin pretextos.', isExtreme: true },
  { id: 'peda-45', type: 'extreme', template: 'RULETA RUSA SOCIAL', subtitle: 'El primero que revise su celular: shot doble.', isExtreme: true },
  { id: 'peda-46', type: 'extreme', template: 'CASTIGO DIVINO', subtitle: 'El más alto y el más bajo: shot juntos.', isExtreme: true },
  { id: 'peda-47', type: 'extreme', template: 'KARMA INSTANTÁNEO', subtitle: 'Quien haya sido infiel alguna vez: shot.', isExtreme: true },
  { id: 'peda-48', type: 'extreme', template: 'SIN RAZÓN APARENTE', subtitle: 'Los solteros: shot. Los que no: también.', isExtreme: true },
  { id: 'peda-49', type: 'extreme', template: 'LA VIDA ES INJUSTA', subtitle: '{player} escoge a 2 personas. Shot los tres.', isExtreme: true },
  { id: 'peda-50', type: 'extreme', template: 'LOS QUE TRAIGAN TENIS', subtitle: 'Fondo. Punto.', isExtreme: true },
  { id: 'peda-51', type: 'extreme', template: 'ROPA INTERIOR NEGRA', subtitle: 'Si traes ropa interior negra: shot.', isExtreme: true },
  { id: 'peda-52', type: 'extreme', template: 'EL UNIVERSO DECIDIÓ', subtitle: '{player} reparte 10 tragos entre quien quiera.', isExtreme: true },
];

// HOT - Picante, confesiones, atrevido
export const hotChallenges: Challenge[] = [
  // Directos HOT
  { id: 'hot-1', type: 'direct', template: '{player}, ¿cuál fue tu peor beso?', subtitle: 'Cuenta los detalles o shot.' },
  { id: 'hot-2', type: 'direct', template: '{player}, ¿con quién de aquí tendrías una cita?', subtitle: 'Sé honesto. Los dos toman un shot.' },
  { id: 'hot-3', type: 'direct', template: '{player}, confiesa tu fantasía más rara.', subtitle: 'Si no confiesas: 2 shots.' },
  { id: 'hot-4', type: 'direct', template: '{player}, ¿cuál es el lugar más loco donde lo has hecho?', subtitle: 'Sin detalles gráficos. O shot.' },
  { id: 'hot-5', type: 'direct', template: '{player}, muestra tu última búsqueda en modo incógnito.', subtitle: 'Si te niegas: 3 shots.' },
  { id: 'hot-6', type: 'direct', template: '{player}, manda un DM coqueto a alguien random.', subtitle: 'Screenshot o no pasó. Si no: shot doble.' },
  { id: 'hot-7', type: 'direct', template: '{player}, ¿cuál es tu body count?', subtitle: 'Puedes mentir pero si te cachan: 3 shots.' },
  { id: 'hot-8', type: 'direct', template: '{player}, ¿alguna vez fingiste?', subtitle: 'Todos fingen algo. Confiesa o shot.' },
  { id: 'hot-9', type: 'direct', template: '{player}, describe tu tipo físico ideal.', subtitle: 'Todos juzgarán. Shot si te echas para atrás.' },
  { id: 'hot-10', type: 'direct', template: '{player}, ¿a quién de aquí le darías tu número?', subtitle: 'Esa persona reparte un shot.' },
  { id: 'hot-11', type: 'direct', template: '{player}, ¿cuál es tu zona más sensible?', subtitle: 'Si no contestas: 2 shots.' },
  { id: 'hot-12', type: 'direct', template: '{player}, ¿qué es lo más atrevido que has hecho en público?', subtitle: 'Detalles o shot.' },
  { id: 'hot-13', type: 'direct', template: '{player}, ¿cuánto tiempo sin...?', subtitle: 'Ya sabes. Confiesa en días. Mientes: shot doble.' },
  { id: 'hot-14', type: 'direct', template: '{player}, ¿cuál ha sido tu momento más vergonzoso en la intimidad?', subtitle: 'Ríanse con él. O shot por cobarde.' },
  { id: 'hot-15', type: 'direct', template: '{player}, dile algo al oído a {player2}.', subtitle: 'Debe sonrojarse. Si no: ambos toman.' },
  { id: 'hot-16', type: 'direct', template: '{player}, ¿cuál es tu mayor turn on?', subtitle: 'Sé específico. O shot.' },
  { id: 'hot-17', type: 'direct', template: '{player}, ¿qué es lo más loco que has hecho por ligue?', subtitle: 'Confiesa o shot doble.' },
  
  // Para el lector
  { id: 'hot-r1', type: 'direct', template: 'El que lee esto debe confesar algo hot.', subtitle: 'Algo que nunca hayas dicho. O 3 shots.' },
  { id: 'hot-r2', type: 'direct', template: 'Lector, escoge a 2 personas.', subtitle: 'Deben mirarse a los ojos 30 segundos sin reír.' },
  { id: 'hot-r3', type: 'direct', template: 'El lector escoge quién baila sensualmente.', subtitle: '10 segundos. Si no: 3 shots para el elegido.' },
  
  // Grupales HOT
  { id: 'hot-18', type: 'group', template: 'Señalen a quién le urge más.', subtitle: 'El más necesitado: shot.' },
  { id: 'hot-19', type: 'group', template: '¿Quién tiene más juego?', subtitle: 'El más player: shot de respeto.' },
  { id: 'hot-20', type: 'group', template: 'Señalen a quién stalkean más en Instagram.', subtitle: 'Esa persona decide quién toma.' },
  { id: 'hot-21', type: 'group', template: '¿Quién es el más caliente del grupo?', subtitle: 'El ganador reparte 3 shots.' },
  { id: 'hot-22', type: 'group', template: 'Señalen a quién le gusta alguien aquí presente.', subtitle: 'Si es verdad: shot. Si no: shot también.' },
  { id: 'hot-23', type: 'group', template: '¿Quién creen que es el mejor besando?', subtitle: 'Basado solo en vibra. El elegido: shot.' },
  { id: 'hot-24', type: 'group', template: 'Señalen a quién le mandarían un nude.', subtitle: 'Hipotéticamente. Shot al más señalado.' },
  { id: 'hot-25', type: 'group', template: '¿Quién tiene las fotos más atrevidas en su galería?', subtitle: 'No hay que mostrar. Pero shot al ganador.' },
  { id: 'hot-26', type: 'group', template: '¿Quién creen que es el más ruidoso en la cama?', subtitle: 'Señalen. El elegido puede defenderse... o shot.' },
  { id: 'hot-27', type: 'group', template: 'Señalen a quien tuvo su última vez más reciente.', subtitle: 'El ganador reparte shots.' },
  
  // Votaciones HOT
  { id: 'hot-28', type: 'vote', template: '¿Quién tiene más probabilidad de hacer un OnlyFans?', subtitle: 'El emprendedor: shot.' },
  { id: 'hot-29', type: 'vote', template: '¿Quién ha mandado más nudes en su vida?', subtitle: 'El artista: shot con honor.' },
  { id: 'hot-30', type: 'vote', template: '¿Quién sería el peor en la cama?', subtitle: 'El más votado puede defenderse... o shot.' },
  { id: 'hot-31', type: 'vote', template: '¿A quién no invitarían a una fiesta swinger?', subtitle: 'El más conservador: shot.' },
  { id: 'hot-32', type: 'vote', template: '¿Quién ha tenido el peor ex?', subtitle: 'Historia o shot.' },
  { id: 'hot-33', type: 'vote', template: '¿Quién es más probable que termine con alguien de aquí?', subtitle: 'Ambos señalados: shot juntos.' },
  { id: 'hot-34', type: 'vote', template: '¿Quién ha hecho algo sexual en un lugar público?', subtitle: 'El más aventurero: shot de honor.' },
  { id: 'hot-35', type: 'vote', template: '¿Quién creen que tiene más juguetes?', subtitle: 'El coleccionista: shot.' },
  
  // Random HOT
  { id: 'hot-36', type: 'random', template: '{player} y {player2}: 10 segundos viéndose a los ojos.', subtitle: 'Quien quite la mirada primero: shot.' },
  { id: 'hot-37', type: 'random', template: '{player}, haz tu mejor voz sexy.', subtitle: 'El grupo califica del 1-10. Menos de 7: shot.' },
  { id: 'hot-38', type: 'random', template: '{player}, dile un piropo a {player2}.', subtitle: 'Que sea bueno. Ambos toman después.' },
  { id: 'hot-39', type: 'random', template: 'Los que hayan tenido un sueño hot con alguien de aquí: shot.', subtitle: 'Nadie tiene que saber con quién.' },
  { id: 'hot-40', type: 'random', template: '{player}, ¿qué es lo más atrevido en tu teléfono?', subtitle: 'Describe sin mostrar. O shot.' },
  { id: 'hot-41', type: 'random', template: 'Los que hayan besado a alguien del mismo sexo: shot.', subtitle: 'Experiencias. Shot.' },
  { id: 'hot-42', type: 'random', template: '{player}, haz un baile sensual de 10 segundos.', subtitle: 'Sin pena. Si no: 3 shots.' },
  { id: 'hot-43', type: 'random', template: '{player} y {player2}: el primero que se sonroje pierde.', subtitle: 'Díganse cosas incómodas. El perdedor: shot.' },
  { id: 'hot-44', type: 'random', template: '{player}, lee en voz alta el último mensaje de tu crush.', subtitle: 'Si no tienes: invéntalo o shot.' },
  { id: 'hot-45', type: 'random', template: 'Todos digan su posición favorita. Quien repita: shot.', subtitle: 'Creativos.' },
  
  // TIMED HOT
  { id: 'hot-t1', type: 'timed', template: '{player} debe coquetear con todos', subtitle: 'Por 2 minutos. El grupo califica. Menos de 7: shot', duration: 120 },
  { id: 'hot-t2', type: 'timed', template: '{player} y {player2} deben tomarse de las manos', subtitle: 'Por 1 minuto. El que suelte primero: shot', duration: 60 },
  { id: 'hot-t3', type: 'timed', template: 'Todos deben hablar en tono seductor', subtitle: 'Por 90 segundos. El que ría: shot', duration: 90 },
  { id: 'hot-t4', type: 'timed', template: '{player} debe hacer contacto visual con {player2}', subtitle: 'Por 2 minutos completos. Sin reír. Pierden: shot cada uno.', duration: 120 },
  
  // POWER HOT
  { id: 'hot-p1', type: 'power', template: '{player}, eres CUPIDO', subtitle: 'Puedes decir "CUPIDO" y elegir a 2 personas que deben darse un beso (en la mejilla) o ambos toman 3 shots.', isPower: true },
  { id: 'hot-p2', type: 'power', template: '{player}, eres VERDAD', subtitle: 'Puedes preguntar UNA verdad a cualquier persona y DEBE responder honestamente. Si miente: fondo.', isPower: true },
  
  // Extremos HOT
  { id: 'hot-46', type: 'extreme', template: 'CONFESIONARIO OBLIGADO', subtitle: 'Todos deben confesar algo sexual que nunca han dicho. El que no: 3 shots.', isExtreme: true },
  { id: 'hot-47', type: 'extreme', template: 'VERDAD INCÓMODA', subtitle: 'Di algo que nunca has dicho en voz alta. O 3 shots.', isExtreme: true },
  { id: 'hot-48', type: 'extreme', template: 'TENSIÓN SEXUAL', subtitle: '{player} y {player2}: 15 segundos de contacto visual sin reír. Pierden: shot cada uno.', isExtreme: true },
  { id: 'hot-49', type: 'extreme', template: 'EL PECADOR', subtitle: 'El que más ha pecado esta semana según el grupo: shot doble.', isExtreme: true },
  { id: 'hot-50', type: 'extreme', template: 'SECRETO SUCIO', subtitle: '{player}, confiesa tu fantasía más loca o toma 3 shots.', isExtreme: true },
  { id: 'hot-51', type: 'extreme', template: 'CALOR HUMANO', subtitle: 'Los que estén solteros y listos: shot por la causa.', isExtreme: true },
  { id: 'hot-52', type: 'extreme', template: 'EL MÁS PUERCO', subtitle: 'Señalen. El ganador cuenta su experiencia más loca o fondo.', isExtreme: true },
  { id: 'hot-53', type: 'extreme', template: 'TRUTH OR DARE EXTREMO', subtitle: '{player} elige: verdad incómoda o reto atrevido. Si no cumple: 4 shots.', isExtreme: true },
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
  { id: 'mix-11', type: 'direct', template: '{player}, canta el coro de tu canción favorita.', subtitle: 'Si no lo sabes completo: shot.' },
  { id: 'mix-12', type: 'direct', template: '{player}, haz 20 jumping jacks o toma 3.', subtitle: 'El grupo decide si fueron válidos.' },
  
  // Para el lector
  { id: 'mix-r1', type: 'direct', template: 'El lector se convierte en juez.', subtitle: 'Por las próximas 3 cartas, decides si los retos se cumplieron o no.' },
  { id: 'mix-r2', type: 'direct', template: 'Quien lee esto: reparte 6 tragos.', subtitle: 'Como quieras. Puedes dar todos a uno o repartir.' },
  { id: 'mix-r3', type: 'direct', template: 'El lector escoge el próximo juego.', subtitle: 'Verdad o reto, Yo nunca, o lo que quieras por 5 minutos.' },
  
  // Grupales random
  { id: 'mix-13', type: 'group', template: 'El que tenga más apps instaladas toma.', subtitle: 'Cuenten. El máximo: shot.' },
  { id: 'mix-14', type: 'group', template: 'Los que no se sepan el himno nacional: shot.', subtitle: 'Cántenlo para comprobarlo.' },
  { id: 'mix-15', type: 'group', template: 'Señalen al que tiene peor sentido del humor.', subtitle: 'Que cuente un chiste para defenderse.' },
  { id: 'mix-16', type: 'group', template: 'Los zurdos toman 1. Los derechos toman 2.', subtitle: 'La vida es injusta.' },
  { id: 'mix-17', type: 'group', template: 'Señalen a quién le prestarían dinero.', subtitle: 'El menos señalado: shot por desconfiado.' },
  { id: 'mix-18', type: 'group', template: '¿Quién gasta más en comida rápida?', subtitle: 'El gordito del grupo: shot.' },
  { id: 'mix-19', type: 'group', template: 'El primero en pararse pierde.', subtitle: 'El lector dice cuando empieza.' },
  { id: 'mix-20', type: 'group', template: 'Señalen al más exagerado contando historias.', subtitle: 'El dramático: shot.' },
  
  // Categorías diversas
  { id: 'mix-21', type: 'category', template: 'Categoría: Personajes de anime', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'mix-22', type: 'category', template: 'Categoría: Películas de Marvel', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'mix-23', type: 'category', template: 'Categoría: Marcas de carros', subtitle: '{player} empieza, gira a la DERECHA.\nEl que tarde más de 3 segundos: shot' },
  { id: 'mix-24', type: 'category', template: 'Categoría: Países de Asia', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'mix-25', type: 'category', template: 'Categoría: Nombres de Pokémon', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'mix-26', type: 'category', template: 'Categoría: Aplicaciones de delivery', subtitle: '{player} empieza, gira a la DERECHA.\nEl que repita: shot' },
  { id: 'mix-27', type: 'category', template: 'Categoría: Nombres de bandas de rock', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'mix-28', type: 'category', template: 'Categoría: Youtubers/Streamers', subtitle: '{player} empieza, gira a la DERECHA.\nEl que se equivoque o repita: shot' },
  { id: 'mix-29', type: 'category', template: 'Categoría: Videojuegos', subtitle: '{player} empieza, gira a la DERECHA.\nEl gamer que pierda: doble shot' },
  
  // Votaciones variadas
  { id: 'mix-30', type: 'vote', template: '¿Quién sería el mejor vendedor de autos usados?', subtitle: 'El más labia: shot.' },
  { id: 'mix-31', type: 'vote', template: '¿Quién es el más mala copa?', subtitle: 'El ganador toma otro para comprobarlo.' },
  { id: 'mix-32', type: 'vote', template: '¿A quién le confiarían su contraseña del banco?', subtitle: 'El menos confiable: shot.' },
  { id: 'mix-33', type: 'vote', template: '¿Quién tiene la risa más contagiosa?', subtitle: 'Hagan reír al grupo o shot.' },
  { id: 'mix-34', type: 'vote', template: '¿Quién sería el mejor actor de telenovela?', subtitle: 'Que haga una escena dramática o shot.' },
  
  // Random
  { id: 'mix-35', type: 'random', template: 'El más joven del grupo reparte 4 shots.', subtitle: 'Los que tienen más callo aguantan.' },
  { id: 'mix-36', type: 'random', template: 'El del nombre más largo toma.', subtitle: 'Cuenten las letras.' },
  { id: 'mix-37', type: 'random', template: '{player}, róbale el trago a {player2}.', subtitle: 'Sin preguntar.' },
  { id: 'mix-38', type: 'random', template: 'Los que usen iPhone toman 1. Android: 2.', subtitle: 'La guerra continúa.' },
  { id: 'mix-39', type: 'random', template: 'Los que tengan más de 100 fotos en la galería: shot.', subtitle: 'Acumuladores.' },
  { id: 'mix-40', type: 'random', template: '{player}, di algo bonito de cada persona aquí.', subtitle: 'Si te tardas más de 5 segundos en alguno: shot.' },
  
  // TIMED
  { id: 'mix-t1', type: 'timed', template: '{player}, no puedes sentarte', subtitle: 'Por 2 minutos. Si te sientas: shot', duration: 120 },
  { id: 'mix-t2', type: 'timed', template: 'Nadie puede reír', subtitle: 'Por 1 minuto. El que ría: shot', duration: 60 },
  { id: 'mix-t3', type: 'timed', template: '{player} es el jefe', subtitle: 'Por 90 segundos todos deben obedecerle. Desobediencia: shot', duration: 90 },
  { id: 'mix-t4', type: 'timed', template: 'Todos deben hablar como bebés', subtitle: 'Por 1 minuto. El que hable normal: shot', duration: 60 },
  { id: 'mix-t5', type: 'timed', template: '{player} no puede usar la letra "E"', subtitle: 'Por 2 minutos. Cada vez que la use: trago', duration: 120 },
  
  // POWER
  { id: 'mix-p1', type: 'power', template: '{player}, eres TIEMPO', subtitle: 'Puedes pausar el juego por 2 minutos para ir al baño, fumar, etc. Sin que nadie te moleste.', isPower: true },
  { id: 'mix-p2', type: 'power', template: '{player}, eres DOBLE', subtitle: 'Puedes duplicar el castigo de cualquier reto UNA vez. "DOBLE" y esa persona toma el doble.', isPower: true },
  { id: 'mix-p3', type: 'power', template: '{player}, eres TRUEQUE', subtitle: 'Puedes intercambiar tu próximo reto con cualquier persona. Úsalo cuando quieras.', isPower: true },
  
  // Extremos mix
  { id: 'mix-41', type: 'extreme', template: 'MOMENTO INCÓMODO', subtitle: 'Todos guarden silencio 30 segundos. El primero en hablar: shot.', isExtreme: true },
  { id: 'mix-42', type: 'extreme', template: 'FLASHBACK', subtitle: 'Recuerden algo vergonzoso que hayan hecho en una peda. Cuéntenlo o shot.', isExtreme: true },
  { id: 'mix-43', type: 'extreme', template: 'RULETA DE LA VERGÜENZA', subtitle: '{player} escoge 2 personas para bailar juntos. Si no: shots.', isExtreme: true },
  { id: 'mix-44', type: 'extreme', template: 'EL MOMENTO LLEGÓ', subtitle: 'Todos toman un shot mirándose a los ojos.', isExtreme: true },
  { id: 'mix-45', type: 'extreme', template: 'SOLO PORQUE SÍ', subtitle: 'Los que traigan tenis: FONDO.', isExtreme: true },
  { id: 'mix-46', type: 'extreme', template: 'CAOS TOTAL', subtitle: 'Todos cambian de lugar. El último sentado: fondo.', isExtreme: true },
];

// FIESTA - Modo grupal para muchas personas
export const fiestaChallenges: Challenge[] = [
  // Grupales intensos
  { id: 'fiesta-1', type: 'group', template: 'Todos los que estén de novio/a: shot.', subtitle: 'El amor cuesta.' },
  { id: 'fiesta-2', type: 'group', template: 'El último en pararse de su silla toma.', subtitle: '¡Ya!' },
  { id: 'fiesta-3', type: 'group', template: 'Señalen al más borracho.', subtitle: 'El ganador toma 2 más para seguir ganando.' },
  { id: 'fiesta-4', type: 'group', template: 'Los que traigan algo rojo toman 2.', subtitle: 'Busquen bien en su ropa.' },
  { id: 'fiesta-5', type: 'group', template: 'Todos los que hayan llegado después de las 10: shot.', subtitle: 'Por impuntuales.' },
  { id: 'fiesta-6', type: 'group', template: 'El más alto y el más bajo: shot juntos.', subtitle: 'Opuestos.' },
  { id: 'fiesta-7', type: 'group', template: 'Los que tengan hermanos toman 1.', subtitle: 'Los hijos únicos se salvan.' },
  { id: 'fiesta-8', type: 'group', template: 'Señalen al organizador de la peda.', subtitle: 'Reparte 5 tragos por el esfuerzo.' },
  { id: 'fiesta-9', type: 'group', template: 'Los del mismo signo zodiacal toman juntos.', subtitle: 'Busquen a sus gemelos astrales.' },
  { id: 'fiesta-10', type: 'group', template: 'Todos gritan "¡Salud!" - el último: shot.', subtitle: '¡YA!' },
  { id: 'fiesta-11', type: 'group', template: 'Los que no conozcan a todos aquí: shot.', subtitle: 'Es hora de socializar.' },
  { id: 'fiesta-12', type: 'group', template: 'El que tenga la batería más baja toma.', subtitle: 'Revisen sus cels.' },
  { id: 'fiesta-13', type: 'group', template: 'Señalen al que primero se va a dormir.', subtitle: 'El señalado: 3 shots para aguantar.' },
  { id: 'fiesta-14', type: 'group', template: 'Los que no hayan comido: shot doble.', subtitle: 'Error de principiante.' },
  { id: 'fiesta-15', type: 'group', template: 'Último en tocar algo azul: shot.', subtitle: '¡Corran!' },
  
  // Dinámicas de fiesta
  { id: 'fiesta-16', type: 'random', template: 'Ronda de shots: todos toman.', subtitle: 'Nadie se salva. ¡Salud!' },
  { id: 'fiesta-17', type: 'random', template: 'Los del lado izquierdo de la mesa toman.', subtitle: 'Mala suerte.' },
  { id: 'fiesta-18', type: 'random', template: 'Los que vinieron en Uber: shot.', subtitle: 'Por prevenidos.' },
  { id: 'fiesta-19', type: 'random', template: 'Waterfall: {player} inicia.', subtitle: 'Cuando empiece, todos toman. Solo paran cuando {player} pare.' },
  { id: 'fiesta-20', type: 'random', template: 'Los que trabajan mañana: shot doble.', subtitle: 'Por valientes.' },
  { id: 'fiesta-21', type: 'random', template: 'Los mayores de 25: shot.', subtitle: 'Ya no están tan jóvenes.' },
  { id: 'fiesta-22', type: 'random', template: 'Intercambien tragos con alguien.', subtitle: 'El que no encuentre pareja: fondo.' },
  { id: 'fiesta-23', type: 'random', template: 'Los que no han bailado hoy: shot.', subtitle: 'A mover el esqueleto.' },
  { id: 'fiesta-24', type: 'random', template: 'Los fumadores: shot.', subtitle: 'Humo y alcohol.' },
  { id: 'fiesta-25', type: 'random', template: 'Los que no han subido historia hoy: shot.', subtitle: 'Antisociales.' },
  
  // Juegos grupales
  { id: 'fiesta-26', type: 'group', template: 'Todos dicen un número del 1-10.', subtitle: 'Los que repitan: shot.' },
  { id: 'fiesta-27', type: 'group', template: 'Cuenten del 1 al 20 entre todos.', subtitle: 'Si dos dicen el mismo número: reinicien y 1 trago cada uno.' },
  { id: 'fiesta-28', type: 'group', template: 'Hagan una pirámide humana.', subtitle: 'Si se cae: todos toman 2.' },
  { id: 'fiesta-29', type: 'group', template: 'Canten una canción juntos.', subtitle: 'El que no se la sepa: shot.' },
  { id: 'fiesta-30', type: 'group', template: 'El que tenga más seguidores reparte 6.', subtitle: 'Influencer o no, igual mandas.' },
  
  // TIMED grupales
  { id: 'fiesta-t1', type: 'timed', template: 'Nadie puede decir "yo"', subtitle: 'Por 3 minutos. El que lo diga: shot', duration: 180 },
  { id: 'fiesta-t2', type: 'timed', template: 'Todos deben bailar', subtitle: 'Por 2 minutos. El que pare: shot', duration: 120 },
  { id: 'fiesta-t3', type: 'timed', template: 'Nadie puede sentarse', subtitle: 'Por 2 minutos. El que se siente: fondo', duration: 120 },
  
  // POWER de fiesta
  { id: 'fiesta-p1', type: 'power', template: '{player}, eres DJ', subtitle: 'Controlas la música por 10 minutos. Si alguien se queja: esa persona toma.', isPower: true },
  { id: 'fiesta-p2', type: 'power', template: '{player}, eres BRINDIS', subtitle: 'Puedes iniciar un brindis obligatorio en cualquier momento. Todos deben tomar.', isPower: true },
  { id: 'fiesta-p3', type: 'power', template: '{player}, eres LIMBO', subtitle: 'Puedes iniciar un limbo. El que pierda: fondo.', isPower: true },
  
  // Extremos fiesta
  { id: 'fiesta-31', type: 'extreme', template: 'RONDA DOBLE', subtitle: 'Todos toman 2 shots. Sin excusas.', isExtreme: true },
  { id: 'fiesta-32', type: 'extreme', template: 'EL ELEGIDO', subtitle: '{player} escoge a alguien para un duelo de shots. El perdedor toma otro.', isExtreme: true },
  { id: 'fiesta-33', type: 'extreme', template: 'CONFESIÓN PÚBLICA', subtitle: 'El que tenga un secreto del grupo: confiésalo o fondo.', isExtreme: true },
  { id: 'fiesta-34', type: 'extreme', template: 'CAOS MÁXIMO', subtitle: 'Los últimos 3 que se levanten: shot cada uno.', isExtreme: true },
  { id: 'fiesta-35', type: 'extreme', template: 'LA FINAL', subtitle: 'Piedra, papel o tijera todos. El ganador reparte 10 tragos.', isExtreme: true },
];

// Game modes configuration
export interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  challenges: Challenge[];
}

export const gameModes: GameMode[] = [
  {
    id: 'precopeo',
    name: 'Pre-copeo',
    description: 'Para calentar motores',
    icon: Beer,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    challenges: precopeoChallenges,
  },
  {
    id: 'peda',
    name: 'La Peda',
    description: 'Shots y retos intensos',
    icon: Zap,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    challenges: pedaChallenges,
  },
  {
    id: 'hot',
    name: 'Hot',
    description: 'Modo picante y atrevido',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-500',
    challenges: hotChallenges,
  },
  {
    id: 'fiesta',
    name: 'Fiesta',
    description: 'Para grupos grandes',
    icon: PartyPopper,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-500',
    challenges: fiestaChallenges,
  },
  {
    id: 'random',
    name: 'Random Mix',
    description: 'Sorpresas garantizadas',
    icon: Shuffle,
    color: 'text-violet-600',
    bgColor: 'bg-violet-500',
    challenges: randomMixChallenges,
  },
  {
    id: 'all',
    name: 'Todo o Nada',
    description: 'Sin filtros. Sin piedad.',
    icon: Skull,
    color: 'text-gray-700',
    bgColor: 'bg-gray-800',
    challenges: [...precopeoChallenges, ...pedaChallenges, ...hotChallenges, ...fiestaChallenges, ...randomMixChallenges],
  },
];

export const getChallengesByMode = (modeId: string): Challenge[] => {
  const mode = gameModes.find(m => m.id === modeId);
  return mode ? mode.challenges : randomMixChallenges;
};
