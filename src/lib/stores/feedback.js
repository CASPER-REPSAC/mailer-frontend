// src/lib/stores/feedback.js
import { writable } from 'svelte/store';
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
};

export const theme = writable(getInitialTheme());

export const toggleTheme = () => {
  theme.update(current => {
    const newTheme = current === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
    return newTheme;
  });
};
const createFeedbackStore = () => {
  const { subscribe, set, update } = writable({
    message: '',
    type: '',  // 'success', 'error', 'info', 'warning'
    description: '',
    duration: 5000,  // milliseconds
    position: 'bottom-right' // 'bottom-right', 'top-right', 'top-center', 'center'
  });

  return {
    subscribe,
    success: (message, description = '', options = {}) => {
      set({
        message,
        description,
        type: 'success',
        duration: options.duration || 5000,
        position: options.position || 'bottom-right'
      });
    },
    error: (message, description = '', options = {}) => {
      set({
        message,
        description,
        type: 'error',
        duration: options.duration || 7000,
        position: options.position || 'bottom-right'
      });
    },
    info: (message, description = '', options = {}) => {
      set({
        message,
        description,
        type: 'info',
        duration: options.duration || 5000,
        position: options.position || 'bottom-right'
      });
    },
    warning: (message, description = '', options = {}) => {
      set({
        message,
        description,
        type: 'warning',
        duration: options.duration || 6000,
        position: options.position || 'bottom-right'
      });
    },
    clear: () => {
      set({ message: '', description: '', type: '', duration: 0, position: 'bottom-right' });
    }
  };
};

export const feedback = createFeedbackStore();
