import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		proxy: {
			'/api': {
				target: 'http://backend:8000',
				changeOrigin: true,
				secure: false
			},
			'/logout': {
				target: 'http://backend:8000',
				changeOrigin: true,
				secure: false
			},
			'/login': {
				target: 'http://backend:8000',
				changeOrigin: true,
				secure: false
			}
		}
	}
});
