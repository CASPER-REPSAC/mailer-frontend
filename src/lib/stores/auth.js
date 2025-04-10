import { writable } from 'svelte/store';
import * as api from "$lib/utils/api";
export const user = writable(null);
export async function loadUser() {
  try {
    const res = await api.fetchUser();
    user.set(res);
  } catch (error) {
    console.error('Failed to load user:', error);
    user.set(null);
  }
}
export async function logout() {
  try {
    api.logout();
    user.set(null);
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
}
