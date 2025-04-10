import { writable, derived } from 'svelte/store';
import * as api from '$lib/utils/api';
const { subscribe, set, update } = writable({
  items: [],
  loading: false,
  error: null,
  selected: null
});
export const templates = {
  subscribe,
  async load() {
    update(state => ({ ...state, loading: true, error: null }));
    try {
      const data = await api.fetchTemplates();
      update(state => ({ ...state, items: data, loading: false }));
    } catch (error) {
      update(state => ({ ...state, error: error.message, loading: false }));
    }
  },
};
export const isLoading = derived(templates, $templates => $templates.loading);
