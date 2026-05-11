export const SERVICES = [
  {
    id: 'individual',
    name: 'Terapia individual',
    dur: 50,
    price: 25000,
    desc: 'Espacio individual para abordar lo que estás viviendo, a tu ritmo.',
    forYou: [
      'sentís ansiedad o estrés persistente',
      'estás atravesando un cambio importante',
      'querés conocerte mejor',
    ],
  },
  {
    id: 'pareja',
    name: 'Terapia de pareja',
    dur: 80,
    price: 40000,
    desc: 'Acompañamiento para parejas que quieren conversar mejor.',
    forYou: [
      'sienten que ya no se entienden',
      'atraviesan una crisis o cambio importante',
      'quieren reconectarse después de algo difícil',
    ],
  },
  {
    id: 'adolescentes',
    name: 'Terapia para adolescentes',
    dur: 50,
    price: 25000,
    desc: 'Terapia adaptada para personas de 13 a 18 años.',
    forYou: [
      'pasás por algo que no sabés cómo nombrar',
      'cuesta hablar con la familia o con amistades',
      'querés un espacio propio donde pensar',
    ],
  },
  {
    id: 'primer-encuentro',
    name: 'Primer encuentro',
    dur: 20,
    price: 0,
    desc: 'Sesión inicial gratuita para conocernos sin compromiso.',
    forYou: [
      'querés saber cómo trabajo antes de reservar',
      'tenés dudas que preferís resolver en persona',
      'no estás seguro/a si la terapia es para vos',
    ],
  },
];

export function findService(id) {
  return SERVICES.find((s) => s.id === id) || null;
}

export const TESTIMS = [
  {
    text: 'Fue la primera vez que me sentí escuchada de verdad. Rosibel sostuvo lo que yo no podía cargar sola, y me ayudó a encontrar mis propias respuestas. Hoy estoy en un lugar muy distinto.',
    who: 'María, 32',
    when: '3 meses en proceso',
  },
  {
    text: 'Llegué con muchas dudas y miedo. Salir de cada sesión me deja más liviano. No se trata de respuestas — se trata de hacer mejores preguntas.',
    who: 'Andrés, 41',
    when: '6 meses en proceso',
  },
  {
    text: 'Cuando perdí a mi mamá no sabía cómo seguir. El acompañamiento de Rosibel me permitió atravesar el duelo sin perder el piso.',
    who: 'Laura, 29',
    when: '1 año en proceso',
  },
  {
    text: 'Empezamos como pareja con la sensación de que ya no nos entendíamos. Hoy hablamos distinto. Vale la pena.',
    who: 'Pareja A',
    when: '5 meses',
  },
];

export const FAQS = [
  {
    q: '¿Cuánto dura una sesión?',
    a: 'Las sesiones individuales son de 50 minutos. Las de pareja, 80 min. Las primeras sesiones tienden a sentirse más largas porque hay mucho por contar — eso es normal.',
  },
  {
    q: '¿Atendés en línea o presencial?',
    a: 'Ambos. Podés elegir según lo que te quede mejor o alternar semana a semana. La videollamada se hace por una plataforma segura, sin necesidad de instalar nada.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'SINPE Móvil, transferencia bancaria o tarjeta al momento de reservar. Se cobra al confirmar la cita; si necesitás reagendar, el monto se mantiene.',
  },
  {
    q: '¿Qué pasa si no puedo asistir?',
    a: 'Podés reagendar o cancelar hasta 24 horas antes desde el link que recibís por correo, sin penalidad.',
  },
  {
    q: '¿Cuánta gente sabe lo que conversamos?',
    a: 'Nadie más que yo. Todo lo que hablamos es estrictamente confidencial, salvo riesgo vital — y eso lo conversaríamos primero.',
  },
];

export const SITS = [
  { label: 'Ansiedad', icon: 'heart' },
  { label: 'Duelo', icon: 'leaf' },
  { label: 'Pareja', icon: 'users' },
  { label: 'Autoestima', icon: 'star' },
  { label: 'Estrés laboral', icon: 'clock' },
  { label: 'Familia', icon: 'home' },
  { label: 'Cambios de vida', icon: 'user' },
  { label: 'Trauma', icon: 'bookmark' },
  { label: 'Identidad', icon: 'eye' },
];

export const TIMES = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export const PRINCIPIOS = [
  ['01', 'Sin juicio', 'Acá no hay diagnósticos rápidos ni etiquetas. Empezamos donde estás.'],
  ['02', 'Basado en evidencia', 'Uso herramientas con respaldo: TCC, EMDR, terapia de aceptación.'],
  ['03', 'A tu ritmo', 'Las sesiones son tuyas. Avanzamos según lo que vos necesitás cada semana.'],
];

export const CREDENCIALES = [
  'Licenciatura UCR · 2015',
  'Colegiado CPCR · 0000',
  'Especialización en trauma · 2020',
  'Atiende en español e inglés',
];

export const FORMACION = [
  ['2015', 'Licenciatura en Psicología, Universidad de Costa Rica'],
  ['2018', 'Maestría en Psicología Clínica'],
  ['2020', 'Especialización en trauma · Madrid'],
];

export function formatColon(price) {
  return price ? `₡${price.toLocaleString('es-CR')}` : 'Gratis';
}
