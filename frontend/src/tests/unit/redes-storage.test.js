import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSettings,
  saveSettings,
  listPosts,
  getPost,
  savePost,
  deletePost,
  postsByDate,
  listFavorites,
  toggleFavorite,
  isFavorite,
  _resetForTests,
} from '../../admin/content/storage.js';

describe('storage de Redes', () => {
  beforeEach(() => {
    _resetForTests();
  });

  describe('settings', () => {
    it('devuelve valores por default si no hay nada guardado', () => {
      const s = getSettings();
      expect(s.brand.name).toBeTruthy();
      expect(s.brand.handle).toBeTruthy();
      expect(s.apiKey).toBeNull();
    });

    it('persiste y mergea cambios sobre los defaults', () => {
      saveSettings({ brand: { handle: '@nueva' } });
      const s = getSettings();
      expect(s.brand.handle).toBe('@nueva');
      // los otros campos de brand se preservan
      expect(s.brand.signature).toBeTruthy();
    });

    it('persiste la apiKey', () => {
      saveSettings({ apiKey: 'sk-ant-test-123456789012345678901234567890' });
      expect(getSettings().apiKey).toBe('sk-ant-test-123456789012345678901234567890');
    });
  });

  describe('posts', () => {
    it('empieza vacío', () => {
      expect(listPosts()).toEqual([]);
    });

    it('savePost crea un post con id y timestamps', () => {
      const post = savePost({
        topicId: 't1',
        angle: 'educativo',
        format: 'post',
        templateKey: 'tip',
        caption: 'hola',
        headline: 'hola',
        body: 'mundo',
      });

      expect(post.id).toMatch(/^p_/);
      expect(post.status).toBe('draft');
      expect(post.createdAt).toBeTruthy();
      expect(post.updatedAt).toBeTruthy();
      expect(listPosts()).toHaveLength(1);
    });

    it('savePost con id existente actualiza en vez de crear', () => {
      const a = savePost({ topicId: 't1', angle: 'tip', format: 'post', templateKey: 'tip', caption: 'v1', headline: 'h', body: 'b' });
      const b = savePost({ id: a.id, topicId: 't1', angle: 'tip', format: 'post', templateKey: 'tip', caption: 'v2', headline: 'h', body: 'b' });

      expect(b.id).toBe(a.id);
      expect(b.caption).toBe('v2');
      expect(listPosts()).toHaveLength(1);
    });

    it('getPost devuelve null para un id inexistente', () => {
      expect(getPost('no-existe')).toBeNull();
    });

    it('deletePost remueve el post', () => {
      const p = savePost({ topicId: 't1', angle: 'tip', format: 'post', templateKey: 'tip', caption: 'x', headline: 'h', body: 'b' });
      deletePost(p.id);
      expect(listPosts()).toEqual([]);
    });

    it('postsByDate filtra por fecha programada', () => {
      const a = savePost({ topicId: 't1', angle: 'tip', format: 'post', templateKey: 'tip', caption: 'x', headline: 'h', body: 'b', scheduledFor: '2026-06-01' });
      const b = savePost({ topicId: 't2', angle: 'tip', format: 'post', templateKey: 'tip', caption: 'y', headline: 'h', body: 'b', scheduledFor: '2026-06-02' });
      const c = savePost({ topicId: 't3', angle: 'tip', format: 'post', templateKey: 'tip', caption: 'z', headline: 'h', body: 'b' });

      const onDate = postsByDate('2026-06-01');
      expect(onDate).toHaveLength(1);
      expect(onDate[0].id).toBe(a.id);
    });
  });

  describe('favoritos', () => {
    it('lista vacía por default', () => {
      expect(listFavorites()).toEqual([]);
      expect(isFavorite('t1')).toBe(false);
    });

    it('toggle agrega y luego quita', () => {
      toggleFavorite('t1');
      expect(isFavorite('t1')).toBe(true);
      expect(listFavorites()).toEqual(['t1']);

      toggleFavorite('t1');
      expect(isFavorite('t1')).toBe(false);
      expect(listFavorites()).toEqual([]);
    });

    it('múltiples favoritos coexisten', () => {
      toggleFavorite('t1');
      toggleFavorite('t2');
      expect(listFavorites()).toHaveLength(2);
    });
  });
});
