import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Pill, Eyebrow } from '../../components/primitives.jsx';
import { TOPICS, CATEGORIES } from '../content/topics.js';
import { listFavorites, toggleFavorite } from '../content/storage.js';

export default function AdminContentTopics() {
  const [category, setCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => listFavorites());
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Banco de temas · Redes · Admin · Rosibel';
  }, []);

  const filtered = useMemo(() => {
    let list = TOPICS;
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
  }, [category, showFavoritesOnly, favorites, search]);

  const handleFav = (id) => {
    const next = toggleFavorite(id);
    setFavorites(next);
  };

  return (
    <>
      <AdminTopbar
        title="Banco de temas"
        sub={`${TOPICS.length} temas listos para usar`}
        action={
          <Btn small as={Link} to="/admin/redes" icon={false}>
            ← Volver
          </Btn>
        }
      />

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
                    <Row gap={8}>
                      <Btn small as={Link} to={`/admin/redes/nuevo?topic=${topic.id}`} icon={false}>
                        Usar
                      </Btn>
                    </Row>
                  </Stack>
                </article>
              );
            })}
          </div>
        </Stack>
      </div>
    </>
  );
}
