// src/lib/stores/auth.js
import { writable } from 'svelte/store';

// 로그인 한 사용자의 정보 (예: { email, name, ... })
// 서버에서 httpOnly 쿠키를 통해 세션이 관리되고 있으므로
// 프론트엔드에서는 별도의 API (/api/me)를 통해 사용자 정보를 얻는 방식을 사용합니다.
export const user = writable(null);

/**
 * 서버의 /api/me 엔드포인트 (예시)에서 사용자 정보를 불러와 auth store에 저장합니다.
 * (서버에서 로그인 상태에 따라 사용자 정보(JSON)를 반환하도록 구현되어 있어야 합니다.)
 */
export async function loadUser() {
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      user.set(data);
    } else {
      user.set(null);
    }
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
    const res = await fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (res.ok) {
      user.set(null);
      window.location.href = '/login';
    } else {
      console.error('Logout failed.');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
