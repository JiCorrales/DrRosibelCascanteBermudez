import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Eyebrow } from '../../components/primitives.jsx';
import Icon from '../../components/Icon.jsx';
import { TOPICS, ANGLES, FORMATS, findTopic, CATEGORIES } from '../content/topics.js';
import { composeCopy } from '../content/templates/copy.js';
import {
  TEMPLATES,
  FORMAT_DIMENSIONS,
  pickTemplate,
  defaultTemplateForAngle,
  renderToCanvas,
  renderCarouselSlide,
  downloadCanvasAsPNG,
  downloadCarouselSlides,
} from '../content/templates/visual.js';
import { getSettings, savePost, getPost } from '../content/storage.js';
import { variateCopyWithClaude, ClaudeError, isApiKeyValid } from '../content/claude.js';

function pickFirstTopic() {
  return TOPICS[0];
}

export default function AdminContentEditor() {
  const [params] = useSearchParams();
  const editId = params.get('id');
  const initialTopicId = params.get('topic') ?? (editId ? null : pickFirstTopic().id);

  // ─────── Estado ───────
  const [settings, setSettings] = useState(() => getSettings());
  const [topicId, setTopicId] = useState(initialTopicId);
  const [angle, setAngle] = useState('educativo');
  const [format, setFormat] = useState('post');
  const [templateKey, setTemplateKey] = useState(defaultTemplateForAngle('educativo', 'post'));
  const [caption, setCaption] = useState('');
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scheduledFor, setScheduledFor] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [postId, setPostId] = useState(editId);

  const topic = useMemo(() => (topicId ? findTopic(topicId) : null), [topicId]);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.title = 'Nuevo post · Redes · Admin · Rosibel';
  }, []);

  // ─────── Cargar post existente para editar ───────
  useEffect(() => {
    if (!editId) return;
    const post = getPost(editId);
    if (!post) return;
    setTopicId(post.topicId);
    setAngle(post.angle);
    setFormat(post.format);
    setTemplateKey(post.templateKey);
    setCaption(post.caption);
    setHeadline(post.headline);
    setBody(post.body);
    setSlides(post.slides ?? []);
    setScheduledFor(post.scheduledFor ?? '');
  }, [editId]);

  // ─────── Auto-generar cuando cambia tema/ángulo/formato ───────
  // No regenera si el usuario ya editó manualmente (sólo si está limpio).
  const generate = (opts = {}) => {
    if (!topic) return;
    const result = composeCopy({
      topic,
      angle,
      format,
      brand: settings.brand,
    });
    setCaption(result.caption);
    setHeadline(result.headline);
    setBody(result.body);
    setSlides(result.slides ?? []);
    setCurrentSlide(0);
    setAiError(null);
    if (opts.resetTemplate) {
      setTemplateKey(defaultTemplateForAngle(angle, format));
    }
  };

  // Primera generación al montar (si no es edición)
  useEffect(() => {
    if (editId) return;
    if (!topic) return;
    generate({ resetTemplate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.id, angle, format]);

  // ─────── Render del canvas en cada cambio ───────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const post = { headline, body, slides };
    if (format === 'carousel') {
      renderCarouselSlide(canvas, { post, brand: settings.brand, index: currentSlide });
    } else {
      renderToCanvas(canvas, { format, templateKey, post, brand: settings.brand });
    }
  }, [headline, body, slides, currentSlide, format, templateKey, settings.brand]);

  // ─────── Acciones ───────
  const handleVariateWithAI = async () => {
    setAiBusy(true);
    setAiError(null);
    try {
      const { caption: newCaption } = await variateCopyWithClaude({
        topic,
        angle,
        format,
        brand: settings.brand,
        currentDraft: caption,
        apiKey: settings.apiKey,
        model: settings.model,
      });
      setCaption(newCaption);
    } catch (e) {
      if (e instanceof ClaudeError) {
        setAiError(e.message);
      } else {
        setAiError('No pudimos generar con IA. Intentá de nuevo.');
      }
    } finally {
      setAiBusy(false);
    }
  };

  const handleSave = (statusOverride) => {
    const next = savePost({
      id: postId,
      topicId,
      angle,
      format,
      templateKey,
      caption,
      headline,
      body,
      slides,
      scheduledFor: scheduledFor || null,
      status: statusOverride ?? (scheduledFor ? 'scheduled' : 'draft'),
    });
    setPostId(next.id);
    setSavedAt(new Date());
    setTimeout(() => setSavedAt(null), 2500);
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setAiError('No pudimos copiar al portapapeles.');
    }
  };

  const handleDownloadImage = async () => {
    const baseName = `${topic?.id ?? 'post'}-${format}`;
    if (format === 'carousel') {
      await downloadCarouselSlides({
        post: { slides },
        brand: settings.brand,
        baseName,
      });
      return;
    }
    const canvas = document.createElement('canvas');
    renderToCanvas(canvas, {
      format,
      templateKey,
      post: { headline, body, slides },
      brand: settings.brand,
    });
    await downloadCanvasAsPNG(canvas, `${baseName}.png`);
  };

  const updateSlide = (index, patch) => {
    const next = slides.map((s, i) => (i === index ? { ...s, ...patch } : s));
    setSlides(next);
  };

  if (!topic) {
    return (
      <>
        <AdminTopbar title="Nuevo post" sub="Redes" />
        <div className="admin-content">
          <Body>Elegí un tema para empezar.</Body>
        </div>
      </>
    );
  }

  const templates = TEMPLATES[format] ?? {};
  const previewDims = FORMAT_DIMENSIONS[format];
  const previewMaxW = format === 'story' ? 240 : 360;
  const previewMaxH = previewMaxW * (previewDims.h / previewDims.w);

  return (
    <>
      <AdminTopbar
        title="Nuevo post"
        sub="Generá copy y descargá la imagen para tus redes"
        action={
          <Row gap={8}>
            <Btn ghost small as={Link} to="/admin/redes">
              ← Volver
            </Btn>
            <Btn small onClick={() => handleSave()} icon={false}>
              {savedAt ? '✓ Guardado' : 'Guardar borrador'}
            </Btn>
          </Row>
        }
      />

      <div className="admin-content">
        <div className="content-editor">
          {/* ─────── Columna izquierda: form ─────── */}
          <Stack gap={20} className="content-editor__form">
            {/* Tema */}
            <article className="wf-card" style={{ padding: 20 }}>
              <Stack gap={14}>
                <Row justify="space-between" align="center">
                  <Eyebrow>1. Tema</Eyebrow>
                  <Link to="/admin/redes/temas" style={{ color: 'var(--sage-700)', fontSize: 12 }}>
                    Ver banco →
                  </Link>
                </Row>
                <select
                  className="content-select"
                  value={topicId ?? ''}
                  onChange={(e) => setTopicId(e.target.value)}
                  aria-label="Tema"
                >
                  {Object.entries(CATEGORIES).map(([catKey, cat]) => (
                    <optgroup key={catKey} label={cat.label}>
                      {TOPICS.filter((t) => t.category === catKey).map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <Meta>{topic.description}</Meta>
              </Stack>
            </article>

            {/* Ángulo + Formato */}
            <article className="wf-card" style={{ padding: 20 }}>
              <Stack gap={16}>
                <Eyebrow>2. Ángulo y formato</Eyebrow>
                <Stack gap={8}>
                  <label className="content-label">Ángulo</label>
                  <div className="content-chips">
                    {Object.entries(ANGLES).map(([key, a]) => (
                      <button
                        key={key}
                        type="button"
                        className={`content-chip${angle === key ? ' active' : ''}`}
                        onClick={() => setAngle(key)}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                  <Meta>{ANGLES[angle].description}</Meta>
                </Stack>
                <Stack gap={8}>
                  <label className="content-label">Formato</label>
                  <div className="content-chips">
                    {Object.entries(FORMATS).map(([key, f]) => (
                      <button
                        key={key}
                        type="button"
                        className={`content-chip${format === key ? ' active' : ''}`}
                        onClick={() => setFormat(key)}
                      >
                        {f.label}
                        <span className="content-chip__hint">{f.size}</span>
                      </button>
                    ))}
                  </div>
                </Stack>
                <Stack gap={8}>
                  <label className="content-label">Plantilla visual</label>
                  <div className="content-chips">
                    {Object.entries(templates).map(([key, t]) => (
                      <button
                        key={key}
                        type="button"
                        className={`content-chip${templateKey === key ? ' active' : ''}`}
                        onClick={() => setTemplateKey(key)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </Stack>
              </Stack>
            </article>

            {/* Acciones de generación */}
            <article className="wf-card sage" style={{ padding: 20 }}>
              <Stack gap={12}>
                <Row gap={10} wrap>
                  <Btn small onClick={() => generate()} icon={false}>
                    Regenerar con plantilla
                  </Btn>
                  <Btn
                    ghost
                    small
                    onClick={handleVariateWithAI}
                    disabled={aiBusy || !isApiKeyValid(settings.apiKey)}
                    icon={false}
                  >
                    {aiBusy ? 'Generando…' : '✨ Variar con IA'}
                  </Btn>
                </Row>
                {!isApiKeyValid(settings.apiKey) && (
                  <Meta>
                    <Link to="/admin/redes/ajustes" style={{ color: 'var(--sage-700)' }}>
                      Configurá tu API key de Anthropic
                    </Link>{' '}
                    para usar la variación con IA (opcional).
                  </Meta>
                )}
                {aiError && (
                  <div className="content-alert content-alert--error">{aiError}</div>
                )}
              </Stack>
            </article>

            {/* Edición del texto visible en la imagen */}
            {format !== 'carousel' && (
              <article className="wf-card" style={{ padding: 20 }}>
                <Stack gap={14}>
                  <Eyebrow>3. Texto de la imagen</Eyebrow>
                  <Stack gap={6}>
                    <label className="content-label">Titular</label>
                    <input
                      className="content-input"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      maxLength={140}
                    />
                  </Stack>
                  <Stack gap={6}>
                    <label className="content-label">Cuerpo</label>
                    <textarea
                      className="content-textarea"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={5}
                    />
                  </Stack>
                </Stack>
              </article>
            )}

            {/* Carrusel: editor de slides */}
            {format === 'carousel' && (
              <article className="wf-card" style={{ padding: 20 }}>
                <Stack gap={14}>
                  <Eyebrow>3. Slides del carrusel ({slides.length})</Eyebrow>
                  <div className="content-slides-tabs">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`content-chip${currentSlide === i ? ' active' : ''}`}
                        onClick={() => setCurrentSlide(i)}
                      >
                        Slide {i + 1}
                      </button>
                    ))}
                  </div>
                  {slides[currentSlide] && (
                    <Stack gap={10}>
                      <Stack gap={6}>
                        <label className="content-label">Título</label>
                        <input
                          className="content-input"
                          value={slides[currentSlide].title}
                          onChange={(e) => updateSlide(currentSlide, { title: e.target.value })}
                        />
                      </Stack>
                      <Stack gap={6}>
                        <label className="content-label">Cuerpo</label>
                        <textarea
                          className="content-textarea"
                          value={slides[currentSlide].body}
                          onChange={(e) => updateSlide(currentSlide, { body: e.target.value })}
                          rows={3}
                        />
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </article>
            )}

            {/* Caption */}
            <article className="wf-card" style={{ padding: 20 }}>
              <Stack gap={14}>
                <Row justify="space-between" align="center">
                  <Eyebrow>4. Caption para Instagram/Facebook</Eyebrow>
                  <button
                    type="button"
                    className="content-link-btn"
                    onClick={handleCopyCaption}
                  >
                    {copied ? '✓ Copiado' : 'Copiar'}
                  </button>
                </Row>
                <textarea
                  className="content-textarea"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={8}
                />
                <Meta>{caption.length} caracteres · Instagram acepta hasta 2200.</Meta>
              </Stack>
            </article>

            {/* Programar */}
            <article className="wf-card" style={{ padding: 20 }}>
              <Stack gap={12}>
                <Eyebrow>5. Programar (opcional)</Eyebrow>
                <Row gap={10} wrap>
                  <input
                    type="date"
                    className="content-input"
                    style={{ maxWidth: 200 }}
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                  />
                  <Btn small ghost onClick={() => setScheduledFor('')} icon={false}>
                    Limpiar
                  </Btn>
                </Row>
                <Meta>
                  Programar guarda la fecha sugerida de publicación. Por ahora la
                  publicación a redes la hacés vos manualmente.
                </Meta>
              </Stack>
            </article>
          </Stack>

          {/* ─────── Columna derecha: preview ─────── */}
          <Stack gap={16} className="content-editor__preview">
            <div className="content-preview-card">
              <Row justify="space-between" align="center" style={{ marginBottom: 14 }}>
                <H3 size={15}>Vista previa</H3>
                <Meta>{previewDims.w}×{previewDims.h}</Meta>
              </Row>
              <div
                className="content-preview-frame"
                style={{ width: previewMaxW, height: previewMaxH }}
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', display: 'block', borderRadius: 8 }}
                />
              </div>

              {format === 'carousel' && slides.length > 1 && (
                <Row gap={8} justify="center" style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    className="content-link-btn"
                    onClick={() => setCurrentSlide((i) => Math.max(0, i - 1))}
                    disabled={currentSlide === 0}
                  >
                    ←
                  </button>
                  <Meta>{currentSlide + 1} / {slides.length}</Meta>
                  <button
                    type="button"
                    className="content-link-btn"
                    onClick={() => setCurrentSlide((i) => Math.min(slides.length - 1, i + 1))}
                    disabled={currentSlide === slides.length - 1}
                  >
                    →
                  </button>
                </Row>
              )}

              <Stack gap={8} style={{ marginTop: 18 }}>
                <Btn block onClick={handleDownloadImage} icon={false}>
                  <Icon name="doc" size={14} />
                  &nbsp;
                  {format === 'carousel' ? `Descargar ${slides.length} PNG` : 'Descargar PNG'}
                </Btn>
                <Btn block ghost onClick={handleCopyCaption} icon={false}>
                  {copied ? '✓ Caption copiado' : 'Copiar caption'}
                </Btn>
              </Stack>
            </div>

            <article className="wf-card" style={{ padding: 16 }}>
              <Stack gap={6}>
                <Eyebrow>Cómo publicar</Eyebrow>
                <Body size={13}>
                  1. Descargá la imagen y el caption.
                  <br />
                  2. Abrí Instagram o Facebook.
                  <br />
                  3. Subí la imagen y pegá el caption.
                </Body>
              </Stack>
            </article>
          </Stack>
        </div>
      </div>
    </>
  );
}
