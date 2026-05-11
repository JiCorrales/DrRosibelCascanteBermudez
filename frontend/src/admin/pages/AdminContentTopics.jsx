import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Pill, Eyebrow } from '../../components/primitives.jsx';
import { getAllTopics, CATEGORIES } from '../content/topics.js';
import {
  listFavorites,
  toggleFavorite,
  saveCustomTopic,
  deleteCustomTopic,
  listCustomTopics,
} from '../content/storage.js';
import RedesNav from '../content/RedesNav.jsx';

export default function AdminContentTopics() {
  const [category, setCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => listFavorites());
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [allTopics, setAllTopics] = useState(() => getAllTopics());

  useEffect(() => {
    document.title = 'Banco de temas · Redes · Admin · Rosibel';
  }, []);

  const refreshTopics = () => setAllTopics(getAllTopics());

  const filtered = useMemo(() => {
    let list = allTopics;
    if (category !== 'all') list = list.filter((t) => t.category === category);
    if (showFavoritesOnly) list = list.filter((t) => favorites.includes(t.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.hashtags.some((h) => h.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allTopics, category, showFavoritesOnly, favorites, search]);

  const handleFav = (id) => {
    const next = toggleFavorite(id);
    setFavorites(next);
  };

  const handleDeleteCustom = (e, topic) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`¿Eliminar el tema "${topic.title}"?`)) {
      deleteCustomTopic(topic.id);
      refreshTopics();
    }
  };

  const customCount = listCustomTopics().length;

  return (
    <>
      <AdminTopbar
        title="Banco de temas"
        sub={`${allTopics.length} temas${customCount > 0 ? ` · ${customCount} tuyo${customCount !== 1 ? 's' : ''}` : ''}`}
        action={
          <Row gap={8}>
            <Btn ghost small as={Link} to="/admin/redes" icon={false}>
              ← Volver
            </Btn>
            <Btn small icon={false} onClick={() => setShowCreate(true)}>
              + Tema nuevo
            </Btn>
          </Row>
        }
      />
      <RedesNav />

      <div className="admin-content">
        <Stack gap={20}>
          {/* Filtros */}
          <Stack gap={12}>
            <Row gap={10} wrap align="center">
              <input
                className="content-input"
                style={{ maxWidth: 280, flex: 1 }}
                placeholder="Buscar tema o hashtag…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar"
              />
              <button
                type="button"
                className={`content-chip${showFavoritesOnly ? ' active' : ''}`}
                onClick={() => setShowFavoritesOnly((v) => !v)}
              >
                ★ Favoritos ({favorites.length})
              </button>
            </Row>
            <div className="content-chips">
              <button
                type="button"
                className={`content-chip${category === 'all' ? ' active' : ''}`}
                onClick={() => setCategory('all')}
              >
                Todas
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  className={`content-chip${category === key ? ' active' : ''}`}
                  onClick={() => setCategory(key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Stack>

          {/* Grid de temas */}
          {filtered.length === 0 && (
            <article className="wf-card" style={{ padding: 24 }}>
              <Body>No hay temas con ese filtro.</Body>
            </article>
          )}

          <div className="redes-topics-grid">
            {filtered.map((topic) => {
              const isFav = favorites.includes(topic.id);
              return (
                <article key={topic.id} className="redes-topic-card">
                  <Stack gap={12}>
                    <Row justify="space-between" align="flex-start" gap={10}>
                      <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
                        <Eyebrow>{CATEGORIES[topic.category]?.label}</Eyebrow>
                        <H3 size={16}>{topic.title}</H3>
                      </Stack>
                      <button
                        type="button"
                        className={`redes-fav-btn${isFav ? ' active' : ''}`}
                        onClick={() => handleFav(topic.id)}
                        aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                    </Row>
                    <Body size={13}>{topic.description}</Body>
                    <Stack gap={6}>
                      <Meta>Hashtags</Meta>
                      <Row gap={6} wrap>
                        {topic.hashtags.slice(0, 4).map((h) => (
                          <Pill key={h} outline>{h}</Pill>
                        ))}
                        {topic.hashtags.length > 4 && (
                          <Meta>+{topic.hashtags.length - 4}</Meta>
                        )}
                      </Row>
                    </Stack>
                    <Row gap={8} wrap>
                      <Btn small as={Link} to={`/admin/redes/nuevo?topic=${topic.id}`} icon={false}>
                        Usar
                      </Btn>
                      {topic.category === 'custom' && (
                        <button
                          type="button"
                          className="content-link-btn content-link-btn--danger"
                          onClick={(e) => handleDeleteCustom(e, topic)}
                        >
                          Eliminar
                        </button>
                      )}
                    </Row>
                  </Stack>
                </article>
              );
            })}
          </div>
        </Stack>
      </div>

      {showCreate && (
        <NewTopicModal
          onClose={() => setShowCreate(false)}
          onCreated={refreshTopics}
        />
      )}
    </>
  );
}

function NewTopicModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    hashtags: '',
    idea: '',
    tip: '',
    invite: '',
  });
  const [error, setError] = useState('');

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    const hashtags = form.hashtags
      .split(/[,\s]+/)
      .map((h) => h.trim())
      .filter(Boolean)
      .map((h) => (h.startsWith('#') ? h : `#${h}`));

    saveCustomTopic({
      title: form.title,
      description: form.description || form.title,
      hashtags,
      idea: form.idea,
      tip: form.tip,
      invite: form.invite,
    });
    onCreated?.();
    onClose();
  };

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="new-topic-title">
      <button type="button" className="admin-modal__backdrop" onClick={onClose} aria-label="Cerrar" />
      <div className="admin-modal__panel">
        <Row justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <H3 id="new-topic-title" size={18}>Tema nuevo</H3>
          <button type="button" className="admin-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        </Row>
        <form onSubmit={handleSubmit}>
          <Stack gap={14}>
            <Stack gap={6}>
              <label className="admin-modal__label">Título *</label>
              <input
                className="admin-modal__input"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Ej. Burnout profesional"
                required
                autoFocus
              />
            </Stack>

            <Stack gap={6}>
              <label className="admin-modal__label">Descripción</label>
              <input
                className="admin-modal__input"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Una línea sobre qué cubre el tema"
              />
            </Stack>

            <Stack gap={6}>
              <label className="admin-modal__label">Hashtags</label>
              <input
                className="admin-modal__input"
                value={form.hashtags}
                onChange={(e) => update('hashtags', e.target.value)}
                placeholder="burnout, saludmentalcr, terapia"
              />
              <Meta>Separá con comas. El # lo agregamos solos.</Meta>
            </Stack>

            <Stack gap={6}>
              <label className="admin-modal__label">Idea clave</label>
              <textarea
                className="admin-modal__input"
                rows={2}
                value={form.idea}
                onChange={(e) => update('idea', e.target.value)}
                placeholder="Una frase central que querés transmitir"
              />
            </Stack>

            <Stack gap={6}>
              <label className="admin-modal__label">Tip (acción para hoy)</label>
              <input
                className="admin-modal__input"
                value={form.tip}
                onChange={(e) => update('tip', e.target.value)}
                placeholder="Algo concreto que puede probar la persona"
              />
            </Stack>

            <Stack gap={6}>
              <label className="admin-modal__label">Invitación a sesión</label>
              <input
                className="admin-modal__input"
                value={form.invite}
                onChange={(e) => update('invite', e.target.value)}
                placeholder="Si te resonó, conversemos en una sesión"
              />
            </Stack>

            {error && (
              <Body
                role="alert"
                style={{
                  padding: '10px 14px',
                  background: 'var(--danger-100)',
                  color: 'var(--danger-500)',
                  border: '1px solid rgb(var(--danger-rgb) / 0.28)',
                  borderRadius: 'var(--r-md)',
                  fontSize: 13,
                }}
              >
                {error}
              </Body>
            )}

            <Row gap={8} justify="flex-end">
              <Btn ghost small icon={false} onClick={onClose} type="button">
                Cancelar
              </Btn>
              <Btn type="submit" small icon={false} disabled={!form.title.trim()}>
                Crear tema
              </Btn>
            </Row>
          </Stack>
        </form>
      </div>
    </div>
  );
}
