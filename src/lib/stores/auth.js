import { writable } from 'svelte/store';
import * as api from "$lib/utils/api";

export const user = writable(null);

/**
 * 서버의 /api/me 엔드포인트 (예시)에서 사용자 정보를 불러와 auth store에 저장합니다.
 * (서버에서 로그인 상태에 따라 사용자 정보(JSON)를 반환하도록 구현되어 있어야 합니다.)
 */
export async function loadUser() {
  try {
    const res = await api.fetchUser();
    user.set(res);
  } catch (error) {
    console.error('Failed to load user:', error);
    user.set(null);
  }
}

/**
 * 로그아웃 요청을 보내고, auth store를 초기화한 후 로그인 페이지로 이동합니다.
 * (서버에 POST /logout 엔드포인트가 구현되어 있어야 합니다.)
 */
export async function logout() {
  try {
    api.logout();
    user.set(null);
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
}
