// Persistencia client-side para el módulo "Redes". Todo vive en localStorage
// del navegador de la doctora (uso personal, una sola persona). Cuando llegue
// Supabase migramos a una tabla `social_posts` con la misma forma.

const KEYS = {
  posts:     'redes.posts.v1',
  settings:  'redes.settings.v1',
  favorites: 'redes.favorites.v1',
};

// ─────── Helpers genéricos ───────

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// ─────── Settings ───────
// {
//   brand: { name, handle, signature, primaryColor, accentColor },
//   apiKey: string | null,
//   model: 'claude-haiku-4-5-20251001',
// }

const DEFAULT_SETTINGS = {
  brand: {
    name: 'Dra. Rosibel Cascante Bermúdez',
    handle: '@rosibel.psicologa',
    signature: 'Rosibel',
    primaryColor: '#8B5A6B', // sage-500 (mauve acción)
    accentColor: '#E8D8D4',  // bg-2 (malva pálido)
  },
  apiKey: null,
  model: 'claude-haiku-4-5-20251001',
};

export function getSettings() {
  const stored = readJSON(KEYS.settings, {});
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    brand: { ...DEFAULT_SETTINGS.brand, ...(stored.brand ?? {}) },
  };
}

export function saveSettings(patch) {
  const current = getSettings();
  const next = {
    ...current,
    ...patch,
    brand: { ...current.brand, ...(patch.brand ?? {}) },
  };
  writeJSON(KEYS.settings, next);
  return next;
}

// ─────── Posts ───────
// {
//   id, topicId, angle, format, template,
//   caption, headline, body, slides?,
//   scheduledFor: 'YYYY-MM-DD' | null,
//   status: 'draft' | 'scheduled' | 'published',
//   createdAt, updatedAt
// }

function newId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function listPosts() {
  const posts = readJSON(KEYS.posts, []);
  return Array.isArray(posts) ? posts : [];
}

export function getPost(id) {
  return listPosts().find((p) => p.id === id) ?? null;
}

export function savePost(input) {
  const posts = listPosts();
  const now = new Date().toISOString();

  if (input.id) {
    const idx = posts.findIndex((p) => p.id === input.id);
    if (idx >= 0) {
      posts[idx] = { ...posts[idx], ...input, updatedAt: now };
      writeJSON(KEYS.posts, posts);
      return posts[idx];
    }
  }

  const created = {
    id: newId(),
    status: 'draft',
    scheduledFor: null,
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  posts.push(created);
  writeJSON(KEYS.posts, posts);
  return created;
}

export function deletePost(id) {
  const posts = listPosts().filter((p) => p.id !== id);
  writeJSON(KEYS.posts, posts);
}

export function postsByDate(date) {
  return listPosts().filter((p) => p.scheduledFor === date);
}

export function postsByStatus(status) {
  return listPosts().filter((p) => p.status === status);
}

// ─────── Favoritos de temas ───────

export function listFavorites() {
  const ids = readJSON(KEYS.favorites, []);
  return Array.isArray(ids) ? ids : [];
}

export function toggleFavorite(topicId) {
  const ids = listFavorites();
  const next = ids.includes(topicId)
    ? ids.filter((id) => id !== topicId)
    : [...ids, topicId];
  writeJSON(KEYS.favorites, next);
  return next;
}

export function isFavorite(topicId) {
  return listFavorites().includes(topicId);
}

// ─────── Utilidades para tests ───────

export function _resetForTests() {
  localStorage.removeItem(KEYS.posts);
  localStorage.removeItem(KEYS.settings);
  localStorage.removeItem(KEYS.favorites);
}
