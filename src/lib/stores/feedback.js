import { writable } from 'svelte/store';

export const feedback = writable({
  message: '',
  type: '' // 'success', 'error' 혹은 'info'
});

/**
 * 피드백 메시지를 설정합니다.
 * 메시지와 타입을 지정하고, 5초 후 자동으로 초기화합니다.
 */
export function setFeedback(message, type = 'info') {
  feedback.set({ message, type });
  setTimeout(() => feedback.set({ message: '', type: '' }), 5000);
}
