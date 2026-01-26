import { SubGame } from '../types/game';

export const subGames: SubGame[] = [
  {
    id: 'verdad-reto',
    name: 'Verdad o Reto',
    description: 'Cada jugador elige verdad o reto',
    icon: '🎭',
    duration: 300, // 5 minutos
    cards: [
      // VERDADES
      { id: 'vr-v1', text: '¿Con quién de aquí tendrías una cita?', type: 'verdad' },
      { id: 'vr-v2', text: '¿Cuál es tu mayor secreto de esta última semana?', type: 'verdad' },
      { id: 'vr-v3', text: '¿Has hablado mal de alguien de aquí?', type: 'verdad' },
      { id: 'vr-v4', text: '¿Qué es lo más vergonzoso en tu celular?', type: 'verdad' },
      { id: 'vr-v5', text: '¿Has tenido crush con alguien prohibido?', type: 'verdad' },
      { id: 'vr-v6', text: '¿Cuál fue tu peor borrachera?', type: 'verdad' },
      { id: 'vr-v7', text: '¿Te arrepientes de algo que hiciste borracho?', type: 'verdad' },
      { id: 'vr-v8', text: '¿Has besado a alguien solo por atracción física?', type: 'verdad' },
      { id: 'vr-v9', text: '¿Cuál es la mentira que más dices?', type: 'verdad' },
      { id: 'vr-v10', text: '¿Has stalkeado a tu ex recientemente?', type: 'verdad' },
      
      // RETOS
      { id: 'vr-r1', text: 'Dale un cumplido sincero a la persona de tu derecha', type: 'reto' },
      { id: 'vr-r2', text: 'Imita a alguien del grupo (los demás adivinan)', type: 'reto' },
      { id: 'vr-r3', text: 'Toma un shot con los ojos cerrados', type: 'reto' },
      { id: 'vr-r4', text: 'Muestra tu última foto de galería', type: 'reto' },
      { id: 'vr-r5', text: 'Di algo que nadie sabe de ti', type: 'reto' },
      { id: 'vr-r6', text: 'Intercambia una prenda con alguien por 3 rondas', type: 'reto' },
      { id: 'vr-r7', text: 'Habla con acento durante 2 rondas', type: 'reto' },
      { id: 'vr-r8', text: 'Toma sin usar las manos', type: 'reto' },
      { id: 'vr-r9', text: 'Confiesa tu red flag más grande', type: 'reto' },
      { id: 'vr-r10', text: 'Dale like a una foto vieja de tu crush', type: 'reto' },
    ]
  },
  {
    id: 'yo-nunca',
    name: 'Yo Nunca',
    description: 'Si lo has hecho, tomas',
    icon: '🙈',
    duration: 300,
    cards: [
      { id: 'yn-1', text: 'Yo nunca he besado a alguien del mismo sexo' },
      { id: 'yn-2', text: 'Yo nunca he tenido un one night stand' },
      { id: 'yn-3', text: 'Yo nunca he mandado nudes' },
      { id: 'yn-4', text: 'Yo nunca he mentido para salir de una cita' },
      { id: 'yn-5', text: 'Yo nunca he stalkeado a mi ex en redes' },
      { id: 'yn-6', text: 'Yo nunca he tenido crush con alguien prohibido' },
      { id: 'yn-7', text: 'Yo nunca he llorado por amor' },
      { id: 'yn-8', text: 'Yo nunca he besado a alguien solo por apuesta' },
      { id: 'yn-9', text: 'Yo nunca he mentido sobre mi edad' },
      { id: 'yn-10', text: 'Yo nunca he salido con dos personas a la vez' },
      { id: 'yn-11', text: 'Yo nunca he hecho ghosting' },
      { id: 'yn-12', text: 'Yo nunca he usado Tinder o apps de citas' },
      { id: 'yn-13', text: 'Yo nunca he fingido estar enfermo para no salir' },
      { id: 'yn-14', text: 'Yo nunca he robado algo de una tienda' },
      { id: 'yn-15', text: 'Yo nunca he mentido en mi CV' },
    ]
  },
  {
    id: 'quien-es-mas',
    name: '¿Quién es más probable?',
    description: 'Todos señalan a la vez',
    icon: '👉',
    duration: 300,
    cards: [
      { id: 'qem-1', text: '¿Quién es más probable que se case primero?' },
      { id: 'qem-2', text: '¿Quién es más probable que sea millonario?' },
      { id: 'qem-3', text: '¿Quién es más probable que olvide tu cumpleaños?' },
      { id: 'qem-4', text: '¿Quién es más probable que llore en una boda?' },
      { id: 'qem-5', text: '¿Quién es más probable que sea el alma de la fiesta?' },
      { id: 'qem-6', text: '¿Quién es más probable que se pierda en una ciudad?' },
      { id: 'qem-7', text: '¿Quién es más probable que adopte muchos animales?' },
      { id: 'qem-8', text: '¿Quién es más probable que se vuelva famoso?' },
      { id: 'qem-9', text: '¿Quién es más probable que sea infiel?' },
      { id: 'qem-10', text: '¿Quién es más probable que termine en la cárcel?' },
      { id: 'qem-11', text: '¿Quién es más probable que sea stripper?' },
      { id: 'qem-12', text: '¿Quién es más probable que se vuelva adicto al gym?' },
      { id: 'qem-13', text: '¿Quién es más probable que se tatúe algo que se arrepienta?' },
      { id: 'qem-14', text: '¿Quién es más probable que duerma en cualquier lugar?' },
      { id: 'qem-15', text: '¿Quién es más probable que se vuelva famoso en redes?' },
    ]
  },
  {
    id: 'nunca-he',
    name: 'Nunca He',
    description: 'Di algo que nunca has hecho',
    icon: '🚫',
    duration: 300,
    cards: [
      { id: 'nh-1', text: 'Di algo que nunca has hecho borracho. Quien sí: toma.' },
      { id: 'nh-2', text: 'Di un lugar donde nunca has besado. Quien sí: toma.' },
      { id: 'nh-3', text: 'Di algo que nunca has mentido. Quien sí lo ha mentido: toma.' },
      { id: 'nh-4', text: 'Di algo vergonzoso que nunca has hecho. Quien sí: toma.' },
      { id: 'nh-5', text: 'Di algo que nunca le has hecho a tu ex. Quien sí: toma.' },
      { id: 'nh-6', text: 'Di algo que nunca has confesado. Quien sí: toma.' },
      { id: 'nh-7', text: 'Di algo que nunca has hecho en una primera cita. Quien sí: toma.' },
      { id: 'nh-8', text: 'Di algo que nunca has robado. Quien sí: toma.' },
      { id: 'nh-9', text: 'Di algo que nunca has hecho por dinero. Quien sí: toma.' },
      { id: 'nh-10', text: 'Di algo que nunca has hecho para llamar la atención. Quien sí: toma.' },
    ]
  }
];
