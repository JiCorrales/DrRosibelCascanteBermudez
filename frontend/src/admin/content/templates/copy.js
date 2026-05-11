// Generador de copy determinístico. Dado un (tema, ángulo, formato, marca)
// devuelve { caption, headline, body, slides? } listos para usar en el editor.
//
// El generador es la fuente "siempre disponible" — sin red, sin API key.
// El botón "Variar con IA" usa este resultado como punto de partida y le pide
// a Claude que lo reescriba en el tono de la marca.

const HASHTAG_MAX = 10;

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function joinHashtags(tags) {
  return tags.slice(0, HASHTAG_MAX).join(' ');
}

function buildSignature(brand) {
  if (!brand?.signature) return '';
  return `\n\n— ${brand.signature}`;
}

function buildHandleLine(brand) {
  if (!brand?.handle) return '';
  return `\nReservá en ${brand.handle}`;
}

// ─────── Renderers por ángulo ───────

function educativo(topic) {
  const headline = topic.title;
  const body = topic.facts.map((f, i) => `${i + 1}. ${f}`).join('\n');
  const intro = `${topic.title}.`;
  return {
    headline,
    body,
    captionBody: `${intro}\n\n${body}`,
  };
}

function pregunta(topic) {
  const headline = topic.question;
  const body = `${topic.title}.\n\n${topic.facts[0]}`;
  const captionBody = `${topic.question}\n\n${topic.facts[0]}\n\nContame en comentarios.`;
  return { headline, body, captionBody };
}

function mitoVsRealidad(topic) {
  const headline = `Mito: ${topic.myth.claim}`;
  const body = `Mito: ${topic.myth.claim}\n\nRealidad: ${topic.myth.truth}`;
  const captionBody = `Mito: ${topic.myth.claim}\n\nRealidad: ${topic.myth.truth}\n\n${topic.facts[0]}`;
  return { headline, body, captionBody };
}

function tip(topic) {
  const headline = 'Para probar hoy';
  const body = topic.tip;
  const captionBody = `${topic.title}.\n\nPara probar hoy: ${topic.tip}`;
  return { headline, body, captionBody };
}

function invitacion(topic, brand) {
  const headline = topic.invite.length > 90 ? topic.title : topic.invite;
  const body = topic.invite;
  const cta = brand?.handle ? `\n\nAgendá en ${brand.handle}` : '\n\nAgendá tu primer encuentro.';
  const captionBody = `${topic.invite}${cta}`;
  return { headline, body, captionBody };
}

const ANGLE_RENDERERS = {
  educativo,
  pregunta,
  'mito-vs-realidad': mitoVsRealidad,
  tip,
  invitacion,
};

// ─────── Carrusel ───────

function buildCarouselSlides(topic, angle, brand) {
  const handleLine = brand?.handle ? brand.handle : '';

  if (angle === 'educativo') {
    return [
      { title: topic.title, body: 'Deslizá →' },
      ...topic.facts.map((fact, i) => ({
        title: `${i + 1}.`,
        body: fact,
      })),
      { title: '¿Te resonó?', body: `Guardá este post.${handleLine ? `\n${handleLine}` : ''}` },
    ];
  }

  if (angle === 'mito-vs-realidad') {
    return [
      { title: 'Mito', body: topic.myth.claim },
      { title: 'Realidad', body: topic.myth.truth },
      ...topic.facts.slice(0, 2).map((f, i) => ({ title: `${i + 1}.`, body: f })),
      { title: '¿Te resonó?', body: `Compartí este post.${handleLine ? `\n${handleLine}` : ''}` },
    ];
  }

  if (angle === 'tip') {
    return [
      { title: topic.title, body: 'Una práctica para hoy →' },
      { title: 'Para probar', body: topic.tip },
      ...topic.facts.slice(0, 2).map((f, i) => ({ title: `${i + 1}.`, body: f })),
      { title: 'Probalo hoy', body: handleLine ? `Y contame cómo te fue.\n${handleLine}` : 'Y contame cómo te fue.' },
    ];
  }

  if (angle === 'pregunta') {
    return [
      { title: topic.question, body: 'Pensemos juntos →' },
      ...topic.facts.map((f, i) => ({ title: `${i + 1}.`, body: f })),
      { title: 'Te leo', body: `Contame en comentarios.${handleLine ? `\n${handleLine}` : ''}` },
    ];
  }

  // invitacion
  return [
    { title: topic.title, body: '' },
    ...topic.facts.slice(0, 2).map((f, i) => ({ title: `${i + 1}.`, body: f })),
    { title: 'Si te resonó', body: topic.invite },
    { title: 'Agendá', body: handleLine || 'Primer encuentro gratuito.' },
  ];
}

// ─────── API pública ───────

export function composeCopy({ topic, angle = 'educativo', format = 'post', brand = {} }) {
  const renderer = ANGLE_RENDERERS[angle] ?? educativo;
  const { headline, body, captionBody } = renderer(topic, brand);

  const signature = buildSignature(brand);
  const handleLine = format !== 'carousel' ? buildHandleLine(brand) : '';
  const hashtags = joinHashtags(topic.hashtags);

  const caption = clean(`${captionBody}${handleLine}${signature}`) + `\n\n${hashtags}`;

  const slides = format === 'carousel' ? buildCarouselSlides(topic, angle, brand) : null;

  return {
    caption,
    headline: clean(headline),
    body: clean(body),
    slides,
    hashtags: topic.hashtags.slice(0, HASHTAG_MAX),
  };
}

// Sirve como prompt base para "Variar con IA" — Claude reescribe respetando
// el tono y la longitud según formato.
export function buildClaudePrompt({ topic, angle, format, brand, currentDraft }) {
  const angleHint = {
    educativo: 'tono didáctico cercano, sin tecnicismos',
    pregunta: 'tono conversacional que invita a comentar',
    'mito-vs-realidad': 'contrasta un mito común con la realidad',
    tip: 'una acción concreta para hoy, muy aplicable',
    invitacion: 'invitación suave a agendar, sin presión',
  }[angle] ?? 'tono cercano y profesional';

  const formatHint = {
    post: 'caption de Instagram/Facebook de 4-6 líneas, terminando con 1 hashtag relevante',
    story: 'texto corto para story (1-3 líneas máximo), directo',
    carousel: 'idea para un carrusel de 5 slides, devolviendo solo la primera línea de cada slide',
  }[format] ?? 'caption corto';

  return [
    `Sos copywriter para Dra. Rosibel Cascante Bermúdez, psicóloga clínica en San José, Costa Rica.`,
    `Tema: ${topic.title}.`,
    `Ángulo: ${angleHint}.`,
    `Formato: ${formatHint}.`,
    brand?.signature ? `Firmá con: ${brand.signature}.` : '',
    `Tono: cercano, profesional, en español de Costa Rica (vos), sin clichés psi.`,
    `Punto de partida (reescribilo, no lo copies):`,
    currentDraft,
    `Devolvé solo el caption final, sin comillas ni meta-comentarios.`,
  ].filter(Boolean).join('\n\n');
}
