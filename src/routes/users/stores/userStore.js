import { writable } from 'svelte/store';
import * as api from '$lib/utils/api';
import { feedback } from '$lib/stores/feedback';

export function createUserStore() {
  const users = writable([]);
  const loading = writable(true);
  const error = writable('');

  async function fetchUsers() {
    loading.set(true);
    error.set('');
    try {
      const data = await api.fetchUsers();
      users.set(data);
    } catch (err) {
      error.set(err.message);
      feedback.error("사용자 목록 불러오기 실패", err.message);
    } finally {
      loading.set(false);
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers
  };
}