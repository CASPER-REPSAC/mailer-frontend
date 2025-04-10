import { writable } from 'svelte/store';
import * as api from '$lib/utils/api';

export function createDashboardStore() {
  const stats = writable({
    templates: '...',
    users: '...',
    images: '...'
  });
  const loading = writable({
    templates: true,
    users: true,
    images: true
  });
  const errors = writable({
    templates: null,
    users: null,
    images: null
  });

  async function loadStats() {
    loading.set({ templates: true, users: true, images: true });
    errors.set({ templates: null, users: null, images: null });

    const results = await Promise.allSettled([
      api.fetchTemplates(),
      api.fetchUsers(),
      api.fetchImages()
    ]);

    stats.update(s => ({
      ...s,
      templates: results[0].status === 'fulfilled' ? results[0].value.length : '오류',
      users: results[1].status === 'fulfilled' ? results[1].value.length : '오류',
      images: results[2].status === 'fulfilled' ? results[2].value.length : '오류'
    }));

    errors.set({
      templates: results[0].status === 'rejected' ? results[0].reason.message : null,
      users: results[1].status === 'rejected' ? results[1].reason.message : null,
      images: results[2].status === 'rejected' ? results[2].reason.message : null,
    });

    loading.set({ templates: false, users: false, images: false });
  }

  return {
    stats,
    loading,
    errors,
    loadStats
  };
}