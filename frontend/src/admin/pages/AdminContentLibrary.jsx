import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminTopbar } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Pill, Eyebrow } from '../../components/primitives.jsx';
import { listPosts, deletePost, savePost } from '../content/storage.js';
import { findTopic, FORMATS } from '../content/topics.js';
import RedesNav from '../content/RedesNav.jsx';

const STATUSES = [
  { key: 'all',       label: 'Todos' },
  { key: 'draft',     label: 'Borradores' },
  { key: 'scheduled', label: 'Programados' },
  { key: 'published', label: 'Publicados' },
];

export default function AdminContentLibrary() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Biblioteca · Redes · Admin · Rosibel';
    setPosts(listPosts());
  }, []);

  const filtered = useMemo(() => {
    let list = [...posts].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    if (filter !== 'all') list = list.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.headline.toLowerCase().includes(q) ||
          p.caption.toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, filter, search]);

  const counts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    published: posts.filter((p) => p.status === 'published').length,
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar este post?')) return;
    deletePost(id);
    setPosts(listPosts());
  };

  const handleMarkPublished = (post) => {
    savePost({ ...post, status: 'published' });
    setPosts(listPosts());
  };

  const handleMarkDraft = (post) => {
    savePost({ ...post, status: 'draft' });
    setPosts(listPosts());
  };

  const handleDuplicate = (post) => {
    // Crea un nuevo post como borrador sin id (savePost asigna uno nuevo).
    // No copiamos scheduledFor para evitar publicar dos veces en la misma fecha.
    const { id, createdAt, updatedAt, ...rest } = post;
    const dup = savePost({
      ...rest,
      headline: `${post.headline} (copia)`,
      status: 'draft',
      scheduledFor: null,
    });
    navigate(`/admin/redes/nuevo?id=${dup.id}`);
  };

  return (
    <>
      <AdminTopbar
        title="Biblioteca"
        sub={`${posts.length} post${posts.length === 1 ? '' : 's'} en total`}
        action={
          <Btn small as={Link} to="/admin/redes/nuevo" icon={false}>
            + Nuevo
          </Btn>
        }
      />
      <RedesNav />

      <div className="admin-content">
        <Stack gap={20}>
          <Stack gap={12}>
            <input
              className="content-input"
              style={{ maxWidth: 320 }}
              placeholder="Buscar en titulares o caption…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar post"
            />
            <div className="content-chips">
              {STATUSES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`content-chip${filter === s.key ? ' active' : ''}`}
                  onClick={() => setFilter(s.key)}
                >
                  {s.label} ({counts[s.key]})
                </button>
              ))}
            </div>
          </Stack>

          {filtered.length === 0 && (
            <article className="wf-card" style={{ padding: 28 }}>
              <Stack gap={10}>
                <Body>No hay posts con ese filtro.</Body>
                {posts.length === 0 && (
                  <Row>
                    <Btn small as={Link} to="/admin/redes/nuevo" icon={false}>
                      Crear el primero
                    </Btn>
                  </Row>
                )}
              </Stack>
            </article>
          )}

          <div className="redes-library">
            {filtered.map((post) => {
              const topic = findTopic(post.topicId);
              return (
                <article key={post.id} className="redes-library__item">
                  <Stack gap={10}>
                    <Row gap={8} wrap align="center">
                      <Pill outline>{FORMATS[post.format]?.label ?? post.format}</Pill>
                      <Pill>{post.status === 'draft' ? 'Borrador' : post.status === 'scheduled' ? 'Programado' : 'Publicado'}</Pill>
                      {post.scheduledFor && <Meta>📅 {post.scheduledFor}</Meta>}
                    </Row>
                    <H3 size={15}>{post.headline}</H3>
                    <Meta>{topic?.title ?? post.topicId}</Meta>
                    <Body size={13} style={{ color: 'var(--ink-500)', maxHeight: 80, overflow: 'hidden' }}>
                      {post.caption.slice(0, 180)}{post.caption.length > 180 ? '…' : ''}
                    </Body>
                    <Row gap={8} wrap>
                      <Btn small as={Link} to={`/admin/redes/nuevo?id=${post.id}`} icon={false}>
                        Editar
                      </Btn>
                      <Btn small ghost onClick={() => handleDuplicate(post)} icon={false}>
                        Duplicar
                      </Btn>
                      {post.status !== 'published' && (
                        <Btn small ghost onClick={() => handleMarkPublished(post)} icon={false}>
                          Marcar publicado
                        </Btn>
                      )}
                      {post.status === 'published' && (
                        <Btn small ghost onClick={() => handleMarkDraft(post)} icon={false}>
                          Volver a borrador
                        </Btn>
                      )}
                      <button
                        type="button"
                        className="content-link-btn content-link-btn--danger"
                        onClick={() => handleDelete(post.id)}
                      >
                        Eliminar
                      </button>
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
