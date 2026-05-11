import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminTopbar, StatCard } from '../AdminShell.jsx';
import { Btn, Stack, Row, H3, Body, Meta, Eyebrow, Pill } from '../../components/primitives.jsx';
import { listPosts } from '../content/storage.js';
import { getContentSuggestions, getToday } from '../content/occupancy.js';
import { findTopic, FORMATS } from '../content/topics.js';
import RedesNav from '../content/RedesNav.jsx';
import FeedMosaic from '../content/FeedMosaic.jsx';

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function pad(n) { return String(n).padStart(2, '0'); }
function toISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function buildMonthGrid(year, month) {
  // month es 0-indexed
  const first = new Date(year, month, 1);
  const firstDow = first.getDay(); // 0..6, domingo = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  // espacios vacíos antes del primer día
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ date, iso: toISO(date), day: d });
  }
  // completar a múltiplo de 7
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AdminContentDashboard() {
  const [today] = useState(() => getToday());
  const [view, setView] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = 'Redes · Admin · Rosibel';
    setPosts(listPosts());
  }, []);

  const suggestions = useMemo(() => getContentSuggestions(), []);

  const cells = useMemo(() => buildMonthGrid(view.year, view.month), [view.year, view.month]);

  const postsByDateMap = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => {
      if (!p.scheduledFor) return;
      const arr = map.get(p.scheduledFor) ?? [];
      arr.push(p);
      map.set(p.scheduledFor, arr);
    });
    return map;
  }, [posts]);

  const drafts = posts.filter((p) => p.status === 'draft').length;
  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const published = posts.filter((p) => p.status === 'published').length;

  const recentPosts = [...posts]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5);

  const goPrev = () => {
    const d = new Date(view.year, view.month - 1, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };
  const goNext = () => {
    const d = new Date(view.year, view.month + 1, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  const monthLabel = `${MONTHS[view.month]} ${view.year}`;
  const todayIso = toISO(today);

  return (
    <>
      <AdminTopbar
        title="Redes"
        sub="Generá contenido y planeá publicaciones"
        action={
          <Row gap={8}>
            <Btn ghost small as={Link} to="/admin/redes/ajustes" icon={false}>
              Ajustes
            </Btn>
            <Btn small as={Link} to="/admin/redes/nuevo" icon={false}>
              + Nuevo post
            </Btn>
          </Row>
        }
      />
      <RedesNav />

      <div className="admin-content">
        <Stack gap={24}>
          {/* KPIs */}
          <div className="redes-kpis">
            <StatCard label="Borradores" value={drafts} sub="sin programar" />
            <StatCard label="Programados" value={scheduled} sub="con fecha asignada" />
            <StatCard label="Publicados" value={published} sub="marcados como publicados" />
            <StatCard label="Total" value={posts.length} sub="en biblioteca" />
          </div>

          {/* Sugerencias */}
          <Stack gap={10}>
            <Eyebrow>Sugerencias inteligentes</Eyebrow>
            <div className="redes-suggestions">
              {suggestions.map((s, i) => (
                <article
                  key={i}
                  className={`redes-suggestion redes-suggestion--${s.tone}`}
                >
                  <Stack gap={6}>
                    <H3 size={15}>{s.title}</H3>
                    <Body size={13}>{s.body}</Body>
                    <Link to="/admin/redes/nuevo" className="redes-suggestion__cta">
                      Crear post →
                    </Link>
                  </Stack>
                </article>
              ))}
            </div>
          </Stack>

          {/* Feed Instagram mosaico */}
          <FeedMosaic />

          {/* Calendario editorial */}
          <article className="wf-card" style={{ padding: 0 }}>
            <Row justify="space-between" align="center" style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}>
              <Stack gap={2}>
                <H3 size={16}>Calendario editorial</H3>
                <Meta>{monthLabel}</Meta>
              </Stack>
              <Row gap={6}>
                <button type="button" className="content-link-btn" onClick={goPrev} aria-label="Mes anterior">←</button>
                <button type="button" className="content-link-btn" onClick={() => setView({ year: today.getFullYear(), month: today.getMonth() })}>
                  Hoy
                </button>
                <button type="button" className="content-link-btn" onClick={goNext} aria-label="Mes siguiente">→</button>
              </Row>
            </Row>

            <div className="redes-calendar">
              <div className="redes-calendar__head">
                {DAYS_SHORT.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="redes-calendar__grid">
                {cells.map((cell, i) => {
                  if (!cell) return <div key={i} className="redes-cell redes-cell--empty" />;
                  const cellPosts = postsByDateMap.get(cell.iso) ?? [];
                  const isToday = cell.iso === todayIso;
                  return (
                    <div
                      key={cell.iso}
                      className={`redes-cell${isToday ? ' redes-cell--today' : ''}`}
                    >
                      <span className="redes-cell__num">{cell.day}</span>
                      {cellPosts.map((p) => (
                        <Link
                          key={p.id}
                          to={`/admin/redes/nuevo?id=${p.id}`}
                          className={`redes-cell__post redes-cell__post--${p.format}`}
                          title={p.headline}
                        >
                          {p.headline.slice(0, 24)}
                        </Link>
                      ))}
                      {cellPosts.length === 0 && (
                        <Link
                          to={`/admin/redes/nuevo?date=${cell.iso}`}
                          className="redes-cell__add"
                          aria-label={`Agregar post el ${cell.iso}`}
                        >
                          +
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {/* Posts recientes */}
          <Stack gap={10}>
            <Row justify="space-between" align="center">
              <Eyebrow>Posts recientes</Eyebrow>
              <Link to="/admin/redes/biblioteca" style={{ color: 'var(--sage-700)', fontSize: 13 }}>
                Ver biblioteca →
              </Link>
            </Row>
            {recentPosts.length === 0 && (
              <article className="wf-card" style={{ padding: 22 }}>
                <Stack gap={10}>
                  <Body>Todavía no creaste ningún post.</Body>
                  <Row>
                    <Btn small as={Link} to="/admin/redes/nuevo" icon={false}>
                      Crear el primero
                    </Btn>
                  </Row>
                </Stack>
              </article>
            )}
            {recentPosts.length > 0 && (
              <div className="redes-recent">
                {recentPosts.map((p) => {
                  const topic = findTopic(p.topicId);
                  return (
                    <Link key={p.id} to={`/admin/redes/nuevo?id=${p.id}`} className="redes-recent__item">
                      <Stack gap={6}>
                        <Row gap={8} align="center" wrap>
                          <Pill outline>{FORMATS[p.format]?.label ?? p.format}</Pill>
                          <Meta>{topic?.title ?? p.topicId}</Meta>
                        </Row>
                        <Body size={14}>{p.headline}</Body>
                        <Meta>
                          {p.status === 'scheduled' && p.scheduledFor && `Programado para ${p.scheduledFor}`}
                          {p.status === 'draft' && `Borrador · actualizado ${new Date(p.updatedAt).toLocaleDateString('es-CR')}`}
                          {p.status === 'published' && `Publicado`}
                        </Meta>
                      </Stack>
                    </Link>
                  );
                })}
              </div>
            )}
          </Stack>
        </Stack>
      </div>
    </>
  );
}
