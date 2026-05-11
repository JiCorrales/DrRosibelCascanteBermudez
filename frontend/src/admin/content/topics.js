// Banco de temas para el módulo "Redes" del admin.
// Cada tema agrupa hechos, preguntas, mitos, tips e invitaciones que después
// el generador combina con un ángulo y formato (post / story / carrusel).
//
// Estructura por tema:
//   id            — slug único
//   category      — clave de CATEGORIES
//   title         — título para la UI del banco
//   description   — qué cubre el tema (1 línea)
//   hashtags      — etiquetas base, se ordenan de más específica a general
//   facts         — 3 ideas concretas (educativo, slides de carrusel)
//   question      — pregunta abierta para invitar comentarios
//   myth          — { claim, truth } para el ángulo mito-vs-realidad
//   tip           — acción que la persona puede probar hoy
//   invite        — CTA suave a sesión (para el ángulo invitación)

export const CATEGORIES = {
  ansiedad:           { label: 'Ansiedad',                  emoji: '◐' },
  duelo:              { label: 'Duelo y pérdida',           emoji: '◑' },
  parejas:            { label: 'Parejas',                   emoji: '◒' },
  adolescentes:       { label: 'Adolescentes',              emoji: '◓' },
  mindfulness:        { label: 'Mindfulness y bienestar',   emoji: '◔' },
  autoconocimiento:   { label: 'Autoconocimiento',          emoji: '◕' },
  mitos:              { label: 'Mitos sobre la terapia',    emoji: '◖' },
  practica:           { label: 'Sobre mi práctica',         emoji: '◗' },
};

export const ANGLES = {
  educativo:         { label: 'Educativo',          description: 'Comparte 3 ideas claras sobre el tema.' },
  pregunta:          { label: 'Pregunta abierta',   description: 'Invita a la reflexión y a comentar.' },
  'mito-vs-realidad':{ label: 'Mito vs. realidad',  description: 'Rompe un malentendido común.' },
  tip:               { label: 'Tip rápido',         description: 'Una acción concreta para probar hoy.' },
  invitacion:        { label: 'Invitación a sesión',description: 'CTA suave para agendar.' },
};

export const FORMATS = {
  post:     { label: 'Post cuadrado',  size: '1080×1080',  ratio: '1:1' },
  story:    { label: 'Story vertical', size: '1080×1920',  ratio: '9:16' },
  carousel: { label: 'Carrusel',       size: '1080×1080 ×N', ratio: '1:1' },
};

// ─────── 30 temas ───────

export const TOPICS = [
  // ── Ansiedad (5) ──
  {
    id: 'ansiedad-respiracion-478',
    category: 'ansiedad',
    title: 'Respiración 4-7-8 para la ansiedad',
    description: 'Una técnica simple para calmar el sistema nervioso en segundos.',
    hashtags: ['#ansiedad', '#respiracion', '#saludmentalcr', '#bienestar'],
    facts: [
      'Inhalá por la nariz contando hasta 4.',
      'Sostené el aire 7 segundos.',
      'Exhalá por la boca contando hasta 8. Repetí 4 veces.',
    ],
    question: '¿Notás que respirás superficial cuando algo te pone ansioso/a?',
    myth: {
      claim: 'Respirar profundo siempre calma la ansiedad.',
      truth: 'Lo que calma no es inhalar más, es alargar la exhalación. Por eso 4-7-8 funciona.',
    },
    tip: 'Probá 4-7-8 antes de dormir esta noche. Tres rondas son suficientes.',
    invite: 'Si la ansiedad ya no te deja dormir, conversemos. La primera sesión es para conocernos.',
  },
  {
    id: 'ansiedad-vs-estres',
    category: 'ansiedad',
    title: 'Ansiedad y estrés no son lo mismo',
    description: 'Diferencia entre una respuesta puntual y un patrón que se sostiene.',
    hashtags: ['#ansiedad', '#estres', '#psicologiaclinica', '#saludmentalcr'],
    facts: [
      'El estrés tiene un detonante claro: una entrega, un examen, una mudanza.',
      'La ansiedad sigue ahí aunque el detonante ya pasó.',
      'Cuando la ansiedad se sostiene meses, vale la pena mirarla con alguien.',
    ],
    question: '¿Lo que sentís tiene un final visible o se quedó sin irse?',
    myth: {
      claim: 'Si descanso, la ansiedad se va.',
      truth: 'El descanso ayuda con el estrés. La ansiedad necesita comprender qué la está sosteniendo.',
    },
    tip: 'Anotá en una línea qué pasa antes de que aparezca. Patrones se ven en una semana.',
    invite: 'Si distinguir lo que sentís te cuesta, una sesión inicial puede ordenarlo.',
  },
  {
    id: 'ansiedad-cuerpo',
    category: 'ansiedad',
    title: 'La ansiedad vive en el cuerpo',
    description: 'Antes de la cabeza, la ansiedad habla por el pecho, el estómago, los hombros.',
    hashtags: ['#ansiedad', '#cuerpomente', '#saludmental', '#psicologiacr'],
    facts: [
      'Opresión en el pecho. Estómago apretado. Hombros que no bajan.',
      'El cuerpo avisa antes que la mente entienda qué pasa.',
      'Aprender a escucharlo es la mitad del trabajo.',
    ],
    question: '¿Dónde sentís tu ansiedad cuando aparece?',
    myth: {
      claim: 'La ansiedad es algo solo mental.',
      truth: 'La ansiedad es una respuesta de todo el cuerpo. Por eso no se va solo pensando.',
    },
    tip: 'Hoy, una vez por hora, preguntate: ¿dónde tengo tensión ahora mismo?',
    invite: 'Si tu cuerpo lleva semanas en alerta, hablemos.',
  },
  {
    id: 'ansiedad-pensamientos',
    category: 'ansiedad',
    title: 'No todos los pensamientos son verdad',
    description: 'La ansiedad usa pensamientos automáticos que se sienten ciertos sin serlo.',
    hashtags: ['#ansiedad', '#pensamientos', '#saludmental', '#terapia'],
    facts: [
      '"Algo malo va a pasar." Lo sentís cierto, no lo es necesariamente.',
      'La ansiedad inventa certezas para tener algo a lo que sostenerse.',
      'Distancia entre vos y el pensamiento = espacio para elegir.',
    ],
    question: '¿Qué pensamiento se repite hoy?',
    myth: {
      claim: 'Si lo pienso, es porque es importante.',
      truth: 'Pensarlo no lo hace cierto. La frecuencia no es evidencia.',
    },
    tip: 'Cuando aparezca, agregá al inicio: "Estoy teniendo el pensamiento de que…". Cambia todo.',
    invite: 'Si los pensamientos no te dejan, podemos trabajar para tomar distancia.',
  },
  {
    id: 'ansiedad-anticipacion',
    category: 'ansiedad',
    title: 'La ansiedad anticipa lo que aún no pasó',
    description: 'Sufrir el futuro por adelantado es el patrón más cansador.',
    hashtags: ['#ansiedadanticipatoria', '#ansiedad', '#saludmentalcr'],
    facts: [
      'Anticipar = vivir un problema antes de que exista.',
      'El costo emocional es real aunque el evento no ocurra.',
      'Volver al presente no es ingenuo: es ahorrar energía.',
    ],
    question: '¿Cuánto del tiempo de hoy lo pasaste en mañana?',
    myth: {
      claim: 'Anticiparme me prepara.',
      truth: 'Anticipar es repasar el dolor. Prepararse es planear una acción concreta.',
    },
    tip: '5 sentidos: nombrá 5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que probás.',
    invite: 'Si vivís más en lo que puede pasar que en lo que pasa, conversemos.',
  },

  // ── Duelo (3) ──
  {
    id: 'duelo-tiempos',
    category: 'duelo',
    title: 'El duelo no tiene calendario',
    description: 'No es lineal ni tiene fecha de vencimiento.',
    hashtags: ['#duelo', '#perdida', '#saludmentalcr', '#acompanamiento'],
    facts: [
      'Hay días que duele más a los 6 meses que a la semana 1.',
      'Olas que vienen y se van, no una línea que baja.',
      'Necesita tiempo propio, no ajeno.',
    ],
    question: '¿Qué te dicen los demás sobre cómo "deberías" estar?',
    myth: {
      claim: 'Después de un año ya tendrías que estar bien.',
      truth: 'El duelo no se cierra en un año. Se integra con el tiempo que necesita cada quien.',
    },
    tip: 'Hoy permitite sentir lo que aparezca, sin medir si es "mucho" para el tiempo que pasó.',
    invite: 'Si llevás meses caminando solo/a este proceso, acompañarte puede aliviar.',
  },
  {
    id: 'duelo-tipos',
    category: 'duelo',
    title: 'Hay duelos que no se nombran',
    description: 'Una mudanza, una amistad que se fue, una etapa que terminó. También son duelos.',
    hashtags: ['#duelo', '#perdida', '#cambios', '#saludmental'],
    facts: [
      'Duelo migratorio: dejar país, idioma, gente.',
      'Duelo de salud: el cuerpo que ya no es el de antes.',
      'Duelo de etapa: dejar un trabajo, una relación, una versión tuya.',
    ],
    question: '¿Qué pérdida estás cargando que nadie nombra?',
    myth: {
      claim: 'Solo se hace duelo cuando alguien muere.',
      truth: 'Se hace duelo por cualquier vínculo o etapa significativa que se pierde.',
    },
    tip: 'Nombrá la pérdida en voz alta hoy. Decirlo es el primer paso para procesarlo.',
    invite: 'Si una pérdida sin nombre te tiene atascado/a, podemos darle espacio.',
  },
  {
    id: 'duelo-permiso',
    category: 'duelo',
    title: 'Está bien no estar bien',
    description: 'En duelo no hay que apurarse a volver a sonreír.',
    hashtags: ['#duelo', '#saludmental', '#emociones', '#terapia'],
    facts: [
      'Tristeza no es depresión. Es respuesta sana a una pérdida.',
      'Pretender estar bien cansa más que estar mal.',
      'Llorar libera. Reprimir guarda en el cuerpo.',
    ],
    question: '¿Te das permiso de estar como estás?',
    myth: {
      claim: 'Tengo que ser fuerte por los demás.',
      truth: 'Sostenerse con verdad es más fuerte que sostener una imagen.',
    },
    tip: 'Hoy respondé honestamente cuando te pregunten cómo estás, aunque sea a una persona.',
    invite: 'Si necesitás un espacio donde no tengas que estar bien, acá estoy.',
  },

  // ── Parejas (4) ──
  {
    id: 'parejas-escuchar',
    category: 'parejas',
    title: 'Escuchar no es esperar tu turno para hablar',
    description: 'La diferencia entre oír y escuchar marca el clima de una pareja.',
    hashtags: ['#parejas', '#comunicacion', '#terapiadeparejas', '#saludmentalcr'],
    facts: [
      'Oír: el otro habla mientras armás tu respuesta.',
      'Escuchar: el otro habla y tu única tarea es entender.',
      'Reformular lo que escuchaste antes de responder cambia toda la conversación.',
    ],
    question: '¿Cuándo fue la última vez que sentiste que tu pareja realmente te escuchó?',
    myth: {
      claim: 'Mi pareja debería entenderme sin que le explique.',
      truth: 'Esperar adivinación termina en frustración. Decir claro es un acto de cuidado.',
    },
    tip: 'Esta noche, antes de responder, repetí lo que escuchaste con tus palabras. Una sola vez.',
    invite: 'Si las conversaciones se chocan antes de empezar, podemos trabajarlo juntos en pareja.',
  },
  {
    id: 'parejas-discusion',
    category: 'parejas',
    title: 'No es ganar la discusión, es entender el reclamo',
    description: 'En pareja, "tener razón" suele ser perder vínculo.',
    hashtags: ['#parejas', '#conflicto', '#comunicacion', '#terapiacr'],
    facts: [
      'Detrás de cada reclamo hay una necesidad sin nombrar.',
      'Pelear por los detalles tapa lo que duele de verdad.',
      'Bajar el tono no es ceder, es abrir la puerta para entenderse.',
    ],
    question: '¿Por qué discuten realmente cuando discuten?',
    myth: {
      claim: 'Si tengo la razón, debería sostenerla hasta el final.',
      truth: 'Tener razón rara vez resuelve. Entender qué duele, casi siempre sí.',
    },
    tip: 'En la próxima discusión, preguntá: "¿Qué necesitás que no estás recibiendo?"',
    invite: 'Si las discusiones se repiten en bucle, una sesión de pareja puede romper el patrón.',
  },
  {
    id: 'parejas-individualidad',
    category: 'parejas',
    title: 'En pareja también se está solo/a',
    description: 'Tener vida propia es lo que sostiene la pareja.',
    hashtags: ['#parejas', '#individualidad', '#vinculo', '#saludmental'],
    facts: [
      'Fusionarse parece amor pero asfixia.',
      'Tener vida propia no es alejarse, es traer algo al vínculo.',
      'Los espacios separados nutren los compartidos.',
    ],
    question: '¿Qué espacio propio tenés además de la pareja?',
    myth: {
      claim: 'Si nos amamos, tenemos que hacer todo juntos.',
      truth: 'Amar es sostener al otro entero, también lo que vive sin vos.',
    },
    tip: 'Esta semana, retomá una actividad que hacías sola/o antes de la pareja.',
    invite: 'Si sentís que se borraron los límites, conversemos cómo recuperarlos sin romper el vínculo.',
  },
  {
    id: 'parejas-crisis',
    category: 'parejas',
    title: 'Una crisis no significa el final',
    description: 'A veces es la primera puerta para hablar en serio.',
    hashtags: ['#parejas', '#crisis', '#terapiadeparejas', '#cambio'],
    facts: [
      'Crisis = punto donde lo viejo ya no funciona y lo nuevo aún no llega.',
      'No todas las crisis terminan separando. Muchas terminan transformando.',
      'Buscar ayuda en crisis no es debilidad, es lucidez.',
    ],
    question: '¿Esta crisis está pidiendo un final o un cambio?',
    myth: {
      claim: 'Ir a terapia de pareja significa que estamos por separarnos.',
      truth: 'La mayoría de parejas que consultan están eligiendo seguir, no irse.',
    },
    tip: 'Antes de decidir el final, intenten una conversación de 20 minutos sin teléfonos.',
    invite: 'Si están en un momento difícil, una sesión inicial los ayuda a ver qué sigue.',
  },

  // ── Adolescentes (3) ──
  {
    id: 'adolescentes-emociones',
    category: 'adolescentes',
    title: 'No es exageración, es intensidad',
    description: 'En la adolescencia las emociones se sienten más fuerte por razones reales.',
    hashtags: ['#adolescentes', '#saludmentaladolescente', '#crianza', '#psicologiacr'],
    facts: [
      'El cerebro adolescente vive las emociones con más intensidad.',
      'Minimizar lo que sienten no los ayuda, los aleja.',
      'Validar primero, conversar después.',
    ],
    question: 'Padres y madres: ¿escuchan o responden antes de entender?',
    myth: {
      claim: 'Está exagerando, ya se le pasa.',
      truth: 'Para ellos es real e intenso. Minimizar cierra la puerta para la próxima.',
    },
    tip: 'La próxima vez, decí "te escucho" antes de "deberías". Probá una semana.',
    invite: 'Si tu adolescente está pasándola mal, terapia para ellos es un espacio propio.',
  },
  {
    id: 'adolescentes-espacio',
    category: 'adolescentes',
    title: 'Necesitan espacio propio para pensar',
    description: 'La terapia para adolescentes es su lugar, no el de los padres.',
    hashtags: ['#adolescentes', '#terapiaadolescentes', '#saludmental'],
    facts: [
      'Un espacio confidencial donde no estén siendo evaluados.',
      'Adulto que no es de la familia, que escucha sin juzgar.',
      'Aprender a nombrar lo que sienten cambia el resto de su vida.',
    ],
    question: '¿Tu hijo/a tiene algún adulto fuera de la familia con quien pueda hablar?',
    myth: {
      claim: 'Si voy a terapia me van a contar todo a mis papás.',
      truth: 'Lo que se habla en sesión es confidencial. Solo se conversa con familia lo que la persona acepta.',
    },
    tip: 'Si ves cambios sostenidos en ánimo, sueño o apetito por más de 2 semanas, consultá.',
    invite: 'Si tu adolescente necesita un espacio propio, podemos conocernos primero.',
  },
  {
    id: 'adolescentes-redes',
    category: 'adolescentes',
    title: 'Redes sociales y autoestima',
    description: 'Comparar tu vida con highlight reels ajenos tiene un costo real.',
    hashtags: ['#adolescentes', '#redessociales', '#autoestima', '#saludmental'],
    facts: [
      'Ven curaciones, no vidas. Comparan su detrás de cámara con el escenario ajeno.',
      'El uso intenso correlaciona con más ansiedad y menos sueño.',
      'No se trata de prohibir, se trata de mirar juntos qué les pasa cuando usan.',
    ],
    question: '¿Cómo se siente tu hijo/a después de 30 min en redes?',
    myth: {
      claim: 'Es solo un juego, no le afecta.',
      truth: 'Las redes están diseñadas para retener atención. Sí afectan, especialmente en formación.',
    },
    tip: 'Esta semana, conversen 10 minutos sobre qué cuentas siguen y por qué.',
    invite: 'Si redes ya están afectando ánimo o sueño, podemos trabajarlo juntos.',
  },

  // ── Mindfulness y bienestar (5) ──
  {
    id: 'mindfulness-presente',
    category: 'mindfulness',
    title: 'Volver al presente, una y otra vez',
    description: 'Mindfulness no es vaciar la mente. Es notar cuando se fue y traerla.',
    hashtags: ['#mindfulness', '#presente', '#bienestar', '#saludmentalcr'],
    facts: [
      'La mente se va. Esa no es la falla.',
      'Notar que se fue y volver es exactamente la práctica.',
      'No se trata de "lograrlo", se trata de practicarlo.',
    ],
    question: '¿Cuánto del día estás donde tu cuerpo está?',
    myth: {
      claim: 'Mindfulness es dejar la mente en blanco.',
      truth: 'Mindfulness es notar lo que aparece sin engancharse. No vaciar, observar.',
    },
    tip: '3 veces hoy: pausá, respirá una vez y notá qué hay alrededor.',
    invite: 'Si tu mente vive en otro lado, podemos trabajar la atención plena en sesión.',
  },
  {
    id: 'mindfulness-sueno',
    category: 'mindfulness',
    title: 'Dormir mal no es solo tema de horario',
    description: 'El cuerpo se duerme cuando la mente se baja del tren.',
    hashtags: ['#sueno', '#bienestar', '#descanso', '#mindfulness'],
    facts: [
      'Mente acelerada antes de dormir = sueño superficial.',
      'Pantallas antes de dormir = cerebro creyendo que es de día.',
      'Ritual de bajada > horario rígido.',
    ],
    question: '¿Qué hacés en los 30 minutos antes de dormir?',
    myth: {
      claim: 'Necesito 8 horas exactas para descansar.',
      truth: 'Lo que más importa es la calidad y los ritmos, no el número exacto.',
    },
    tip: '30 minutos antes de dormir: luz tenue, sin pantallas, respiración lenta.',
    invite: 'Si dormir bien se volvió difícil, podemos mirar qué lo sostiene.',
  },
  {
    id: 'mindfulness-pausa',
    category: 'mindfulness',
    title: 'La pausa también es trabajo',
    description: 'Producir sin pausar termina en agotamiento, no en logro.',
    hashtags: ['#descanso', '#burnout', '#bienestar', '#productividad'],
    facts: [
      'El cerebro consolida en las pausas, no en el esfuerzo continuo.',
      'Pausar no es perder tiempo: es lo que hace sostenible lo demás.',
      'Cultura del cansancio no es éxito, es agotamiento camuflado.',
    ],
    question: '¿Cuándo fue la última vez que pausaste sin culpa?',
    myth: {
      claim: 'Si me detengo, pierdo el ritmo.',
      truth: 'Pausar es lo que sostiene el ritmo. Sin pausa hay desgaste, no rendimiento.',
    },
    tip: 'Cada 90 minutos, 5 minutos de pausa real. Sin teléfono.',
    invite: 'Si el agotamiento ya te avisó, conversemos antes de que sea más.',
  },
  {
    id: 'mindfulness-emociones',
    category: 'mindfulness',
    title: 'Las emociones no son enemigas',
    description: 'Sentir incomodidad no significa que algo esté mal.',
    hashtags: ['#emociones', '#mindfulness', '#saludmental', '#bienestar'],
    facts: [
      'Las emociones son información. No órdenes.',
      'Lo que se reprime, vuelve más fuerte.',
      'Sentir y reaccionar no son lo mismo.',
    ],
    question: '¿Qué emoción te cuesta más permitirte sentir?',
    myth: {
      claim: 'Las emociones negativas hay que controlarlas.',
      truth: 'No hay emociones "negativas". Hay emociones incómodas que también informan.',
    },
    tip: 'Hoy, cuando aparezca una emoción fuerte, esperá 60 segundos antes de actuar.',
    invite: 'Si sentir te abruma, podemos trabajar para que sea información, no tormenta.',
  },
  {
    id: 'mindfulness-gratitud',
    category: 'mindfulness',
    title: 'Gratitud no es ignorar lo difícil',
    description: 'Es sostener las dos cosas al mismo tiempo: lo que duele y lo que sostiene.',
    hashtags: ['#gratitud', '#bienestar', '#saludmental', '#mindfulness'],
    facts: [
      'Gratitud no es negar lo difícil. Es agregarle algo al cuadro.',
      'Reentrenar la atención cambia lo que se nota en el día.',
      'No "agradecer todo": notar lo que efectivamente sostiene.',
    ],
    question: '¿Qué te sostuvo hoy aunque sea pequeño?',
    myth: {
      claim: 'Practicar gratitud es ser falsamente positivo.',
      truth: 'Es ampliar la mirada para que lo difícil no ocupe todo el plano.',
    },
    tip: 'Esta noche, 3 cosas concretas que pasaron hoy y te sostuvieron. Mínimas valen.',
    invite: 'Si solo ves lo difícil, podemos trabajar para abrir el foco.',
  },

  // ── Autoconocimiento (4) ──
  {
    id: 'autoconocimiento-limites',
    category: 'autoconocimiento',
    title: 'Decir "no" también es cuidado',
    description: 'Poner límites no es egoísmo, es claridad.',
    hashtags: ['#limites', '#autoconocimiento', '#saludmental', '#bienestar'],
    facts: [
      'Decir sí a todo termina diciéndole no a lo importante.',
      'Los límites no son muros, son puertas con perilla.',
      'Quien se enoja con tus límites suele beneficiarse de que no los tengas.',
    ],
    question: '¿A qué te cuesta más decir que no?',
    myth: {
      claim: 'Poner límites es ser egoísta.',
      truth: 'Poner límites es saber qué podés sostener sin resentimiento. Eso es cuidado, no egoísmo.',
    },
    tip: 'Esta semana, decí "déjame pensarlo" antes de aceptar algo automático.',
    invite: 'Si decir no te genera culpa, podemos trabajarlo en sesión.',
  },
  {
    id: 'autoconocimiento-patron',
    category: 'autoconocimiento',
    title: 'Si se repite, es un patrón',
    description: 'No es mala suerte. Es algo que merece mirarse.',
    hashtags: ['#patrones', '#autoconocimiento', '#terapia', '#saludmental'],
    facts: [
      'Misma película, distinta gente: es patrón.',
      'Patrón = algo no consciente eligiendo por vos.',
      'Verlo es el primer paso para poder cambiarlo.',
    ],
    question: '¿Qué historia se te repite en relaciones o trabajos?',
    myth: {
      claim: 'Es que tengo mala suerte con la gente.',
      truth: 'Suele no ser suerte. Suele ser un patrón que se puede entender y cambiar.',
    },
    tip: 'Listá las últimas 3 situaciones difíciles. ¿Qué tienen en común?',
    invite: 'Si un patrón te tiene atrapado/a, conversemos.',
  },
  {
    id: 'autoconocimiento-historia',
    category: 'autoconocimiento',
    title: 'Tu historia no te define, te explica',
    description: 'Saber de dónde venimos no es justificarse, es entenderse.',
    hashtags: ['#autoconocimiento', '#historiapersonal', '#terapia', '#saludmentalcr'],
    facts: [
      'No elegimos el inicio. Sí elegimos qué hacer con lo que entendemos.',
      'Entender no es perdonar a quien hizo daño.',
      'La historia personal pesa hasta que se mira. Mirarla la alivia.',
    ],
    question: '¿Qué parte de tu historia todavía estás cargando sin haber mirado?',
    myth: {
      claim: 'Hablar del pasado es vivir en el pasado.',
      truth: 'Mirar el pasado en terapia es lo que permite no seguir viviendo en él.',
    },
    tip: 'Escribí en una hoja: "Lo que aprendí de mi familia sobre el amor / dinero / conflicto…".',
    invite: 'Si querés entender de dónde viene lo que sentís, una sesión inicial puede empezar.',
  },
  {
    id: 'autoconocimiento-cambio',
    category: 'autoconocimiento',
    title: 'Cambiar también da miedo',
    description: 'Lo conocido cómodo a veces pesa más que lo nuevo deseado.',
    hashtags: ['#cambio', '#autoconocimiento', '#saludmental', '#crecimiento'],
    facts: [
      'El cerebro prefiere lo conocido aunque duela.',
      'Cambiar requiere tolerar el espacio entre lo viejo y lo nuevo.',
      'No es falta de voluntad. Es ingeniería del miedo.',
    ],
    question: '¿Qué cambio venís postergando hace tiempo?',
    myth: {
      claim: 'Si lo quisiera de verdad, ya lo habría cambiado.',
      truth: 'Querer y poder no son lo mismo. Cambiar necesita herramientas, no solo voluntad.',
    },
    tip: 'Identificá el primer paso más pequeño posible. Hacelo hoy.',
    invite: 'Si querés cambiar algo que se te resiste, podemos trabajarlo juntos.',
  },

  // ── Mitos sobre la terapia (3) ──
  {
    id: 'mitos-fuerza',
    category: 'mitos',
    title: 'Ir a terapia no es debilidad',
    description: 'Pedir ayuda es una de las decisiones más adultas que existen.',
    hashtags: ['#mitosterapia', '#psicologiaclinica', '#saludmental', '#terapiacr'],
    facts: [
      'Quien va a terapia eligió mirarse, no esconderse.',
      'Es como ir al gimnasio: trabajo sostenido para algo importante.',
      'Las personas más fuertes que conozco son las que piden ayuda a tiempo.',
    ],
    question: '¿Qué te ha frenado de probar terapia hasta ahora?',
    myth: {
      claim: 'Ir a terapia significa que algo está roto en mí.',
      truth: 'Ir a terapia significa que querés invertir en cómo vivís. Nada más.',
    },
    tip: 'Si llevás semanas pensando en consultar, una sesión inicial cuesta poco y aclara mucho.',
    invite: 'Si querés conocer cómo trabajo antes de comprometerte, agendá una sesión inicial.',
  },
  {
    id: 'mitos-consejos',
    category: 'mitos',
    title: 'En terapia no te van a dar consejos',
    description: 'Una buena sesión no es alguien diciéndote qué hacer.',
    hashtags: ['#mitosterapia', '#queesterapia', '#psicologia', '#saludmental'],
    facts: [
      'No es asesoría ni dirección de vida.',
      'Es un espacio donde encontrás tus propias respuestas.',
      'La diferencia entre consejo y proceso: uno se olvida, el otro te transforma.',
    ],
    question: '¿Qué esperabas que pasara en una sesión?',
    myth: {
      claim: 'La terapeuta te dice qué tenés que hacer con tu vida.',
      truth: 'Una buena terapeuta acompaña para que vos descubras qué necesitás. Sin dirigirte.',
    },
    tip: 'Si en una sesión sentís que te dirigen, decilo. Esa conversación ya es terapia.',
    invite: 'Si querés probar cómo es realmente, agendá un primer encuentro sin compromiso.',
  },
  {
    id: 'mitos-duracion',
    category: 'mitos',
    title: 'No tenés que ir para siempre',
    description: 'La terapia tiene inicio, proceso y final. Y eso está bien.',
    hashtags: ['#mitosterapia', '#procesoterapeutico', '#saludmental'],
    facts: [
      'Algunos procesos duran 3 meses. Otros, años.',
      'Lo que define el tiempo es el motivo, no una regla.',
      'Una buena terapeuta trabaja para que ya no la necesites.',
    ],
    question: '¿Qué te imaginás que pasaría si vinieras solo unos meses?',
    myth: {
      claim: 'Una vez empezás terapia te quedás de por vida.',
      truth: 'Buenos procesos tienen final. El objetivo no es que vuelvas siempre, es que aprendas a sostenerte.',
    },
    tip: 'En la primera sesión, preguntá: ¿cómo se mide si esto está sirviendo?',
    invite: 'Si dudás de empezar por miedo a que sea eterno, conversemos un primer encuentro.',
  },

  // ── Sobre la práctica (3) ──
  {
    id: 'practica-primer-encuentro',
    category: 'practica',
    title: 'El primer encuentro es gratuito',
    description: '20 minutos para conocernos antes de cualquier compromiso.',
    hashtags: ['#primerencuentro', '#psicologiacr', '#sanjose', '#terapia'],
    facts: [
      'Sin costo, sin compromiso.',
      '20 minutos para que veas si conectamos.',
      'Te cuento cómo trabajo y resolvés tus dudas.',
    ],
    question: '¿Qué te gustaría saber antes de empezar un proceso?',
    myth: {
      claim: 'Si no me convence, ya gasté una sesión.',
      truth: 'Justamente por eso el primer encuentro es gratis: para que decidas con calma.',
    },
    tip: 'Agendá un primer encuentro esta semana. Sin presión.',
    invite: 'Reservá tu primer encuentro gratuito en el sitio. 20 minutos para conocernos.',
  },
  {
    id: 'practica-modalidad',
    category: 'practica',
    title: 'Atiendo online y presencial',
    description: 'Vos elegís la modalidad que mejor te calce con tu vida.',
    hashtags: ['#psicologiaonline', '#psicologiacr', '#sanjose', '#terapia'],
    facts: [
      'Online: desde cualquier lugar de Costa Rica o fuera.',
      'Presencial: en consultorio en San José.',
      'Podemos combinar según la semana.',
    ],
    question: '¿Qué modalidad te calza mejor con tu ritmo?',
    myth: {
      claim: 'La terapia online no funciona igual.',
      truth: 'Estudios muestran resultados equivalentes. Lo que define es el vínculo, no el formato.',
    },
    tip: 'Si dudás cuál elegir, podés probar las dos en distintas sesiones.',
    invite: 'Agendá tu sesión inicial en la modalidad que prefieras. El sitio te muestra los horarios.',
  },
  {
    id: 'practica-quien-soy',
    category: 'practica',
    title: 'Cómo trabajo',
    description: 'Acompañamiento clínico, sin recetas, a tu ritmo.',
    hashtags: ['#psicologiaclinica', '#sanjose', '#costarica', '#terapia'],
    facts: [
      'Sin guion: cada proceso se arma según la persona.',
      'Combino herramientas según lo que necesites en cada momento.',
      'Lo importante no es la técnica, es el vínculo y el ritmo propio.',
    ],
    question: '¿Qué buscás en una terapeuta?',
    myth: {
      claim: 'Todas las terapeutas trabajan igual.',
      truth: 'El enfoque, el tono y el ritmo varían. Por eso importa encontrar con quién conectás.',
    },
    tip: 'Antes de elegir, conversá con la persona. Una sesión inicial te dice más que cualquier currículum.',
    invite: 'Si querés conocer cómo trabajo, reservá un primer encuentro sin costo.',
  },
];

export function findTopic(id) {
  return TOPICS.find((t) => t.id === id) ?? null;
}

export function topicsByCategory(category) {
  return TOPICS.filter((t) => t.category === category);
}
