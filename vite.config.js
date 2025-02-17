import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		proxy: {
			'/api': 'http://backend:8000',
			'/logout': 'http://backend:8000',
			'/login': 'http://backend:8000',
		}
	}
});
