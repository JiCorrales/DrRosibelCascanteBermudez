import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Meta, Row, Stack, Body } from '../../components/primitives.jsx';
import {
  renderToCanvas,
  renderCarouselSlide,
  FORMAT_DIMENSIONS,
  withBrandImage,
} from './templates/visual.js';
import { listPosts, getSettings } from './storage.js';

const GRID_SIZE = 9;

// Renderiza un mini canvas para un post. Se llama desde el efecto del
// MosaicCell. Para carrusel usa la primera slide.
function paintCell(canvas, post, brand) {
  if (!canvas || !post) return;

  if (post.format === 'carousel') {
    renderCarouselSlide(canvas, {
      post: { slides: post.slides ?? [] },
      brand,
      index: 0,
    });
    return;
  }

  renderToCanvas(canvas, {
    format: post.format,
    templateKey: post.templateKey,
    post: { headline: post.headline, body: post.body, slides: post.slides },
    brand,
  });
}

function MosaicCell({ post, brand }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    (async () => {
      const enriched = await withBrandImage(brand);
      if (cancelled) return;
      paintCell(ref.current, post, enriched);
    })();
    return () => { cancelled = true; };
  }, [post, brand]);

  if (!post) {
    return (
      <div className="feed-cell feed-cell--empty" aria-hidden="true">
        <span>—</span>
      </div>
    );
  }

  // Stories y carruseles tienen otra proporción; los renderizamos cuadrados
  // recortando el centro visualmente (la imagen subida a feed igual sería 1:1).
  const isSquare = post.format !== 'story';

  return (
    <Link
      to={`/admin/redes/nuevo?id=${post.id}`}
      className="feed-cell"
      title={post.headline}
    >
      <canvas
        ref={ref}
        className={`feed-cell__canvas${isSquare ? '' : ' is-tall'}`}
      />
      {!isSquare && (
        <span className="feed-cell__badge">story</span>
      )}
      {post.format === 'carousel' && (
        <span className="feed-cell__badge">carrusel</span>
      )}
    </Link>
  );
}

export default function FeedMosaic() {
  const posts = useMemo(() => {
    return listPosts()
      .filter((p) => p.status === 'published')
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, GRID_SIZE);
  }, []);

  const brand = useMemo(() => getSettings().brand, []);

  const cells = [...posts];
  while (cells.length < GRID_SIZE) cells.push(null);

  const isEmpty = posts.length === 0;

  return (
    <Stack gap={10}>
      <Row justify="space-between" align="center">
        <Eyebrow>Feed Instagram · últimos 9 publicados</Eyebrow>
        <Meta>
          {posts.length === 0
            ? 'Sin posts publicados'
            : `${posts.length} / ${GRID_SIZE}`}
        </Meta>
      </Row>

      <div className="feed-mosaic" role="grid" aria-label="Mosaico visual del feed">
        {cells.map((p, i) => (
          <MosaicCell key={p?.id ?? `empty-${i}`} post={p} brand={brand} />
        ))}
      </div>

      {isEmpty && (
        <Body size={13} style={{ color: 'var(--ink-500)', textAlign: 'center', padding: 14 }}>
          Cuando marqués posts como "Publicado" en la{' '}
          <Link to="/admin/redes/biblioteca" style={{ color: 'var(--sage-700)' }}>
            biblioteca
          </Link>
          {' '}aparecen acá. Útil para ver cómo combinan visualmente antes de
          subir uno nuevo.
        </Body>
      )}
    </Stack>
  );
}
