import { describe, it, expect } from 'vitest';
import { composeCopy, buildClaudePrompt } from '../../admin/content/templates/copy.js';
import { TOPICS, findTopic } from '../../admin/content/topics.js';

const BRAND = {
  name: 'Dra. Rosibel Cascante',
  handle: '@rosibel.psicologa',
  signature: 'Rosibel',
};

describe('composeCopy', () => {
  it('genera un post educativo con caption, headline y body', () => {
    const topic = TOPICS[0];
    const result = composeCopy({ topic, angle: 'educativo', format: 'post', brand: BRAND });

    expect(result.caption).toContain(topic.title);
    expect(result.caption).toContain(BRAND.signature);
    expect(result.caption).toContain('#'); // hashtags presentes
    expect(result.headline).toBe(topic.title);
    expect(result.body).toContain(topic.facts[0]);
    expect(result.slides).toBeNull();
  });

  it('para carrusel devuelve slides con primera y última distintas del medio', () => {
    const topic = TOPICS[0];
    const result = composeCopy({ topic, angle: 'educativo', format: 'carousel', brand: BRAND });

    expect(result.slides).not.toBeNull();
    expect(result.slides.length).toBeGreaterThanOrEqual(3);
    expect(result.slides[0].title).toBe(topic.title); // portada
    expect(result.slides[result.slides.length - 1].title).toMatch(/resonó|resono/i); // cierre
  });

  it('para el ángulo mito-vs-realidad muestra ambos lados', () => {
    const topic = TOPICS[0];
    const result = composeCopy({ topic, angle: 'mito-vs-realidad', format: 'post', brand: BRAND });

    expect(result.caption).toContain('Mito');
    expect(result.caption).toContain('Realidad');
    expect(result.caption).toContain(topic.myth.claim);
  });

  it('para el ángulo invitación incluye CTA con el handle de la marca', () => {
    const topic = findTopic('practica-primer-encuentro');
    const result = composeCopy({ topic, angle: 'invitacion', format: 'post', brand: BRAND });

    expect(result.caption).toContain(BRAND.handle);
    expect(result.body).toBe(topic.invite);
  });

  it('si no hay handle, no rompe ni agrega línea vacía', () => {
    const topic = TOPICS[0];
    const result = composeCopy({ topic, angle: 'educativo', format: 'post', brand: {} });

    expect(result.caption).not.toContain('undefined');
    expect(result.caption).not.toContain('null');
  });

  it('respeta el límite de hashtags', () => {
    const topic = TOPICS[0];
    const result = composeCopy({ topic, angle: 'educativo', format: 'post', brand: BRAND });
    const tagsInCaption = result.caption.match(/#\w+/g) ?? [];
    expect(tagsInCaption.length).toBeLessThanOrEqual(10);
  });
});

describe('buildClaudePrompt', () => {
  it('incluye el tema, el ángulo y el draft actual', () => {
    const topic = TOPICS[0];
    const prompt = buildClaudePrompt({
      topic,
      angle: 'educativo',
      format: 'post',
      brand: BRAND,
      currentDraft: 'borrador de prueba',
    });

    expect(prompt).toContain(topic.title);
    expect(prompt).toContain('Costa Rica');
    expect(prompt).toContain('borrador de prueba');
    expect(prompt).toContain(BRAND.signature);
  });

  it('cambia la guía de formato según post / story / carousel', () => {
    const topic = TOPICS[0];
    const postP = buildClaudePrompt({ topic, angle: 'tip', format: 'post', brand: BRAND, currentDraft: 'x' });
    const storyP = buildClaudePrompt({ topic, angle: 'tip', format: 'story', brand: BRAND, currentDraft: 'x' });
    const carouselP = buildClaudePrompt({ topic, angle: 'tip', format: 'carousel', brand: BRAND, currentDraft: 'x' });

    expect(postP).not.toBe(storyP);
    expect(storyP).not.toBe(carouselP);
    expect(carouselP).toContain('carrusel');
  });
});
