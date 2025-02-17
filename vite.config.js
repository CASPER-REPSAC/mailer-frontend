import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		proxy: {
			'/api': 'http://127.0.0.1:8000',
			'/logout': 'http://127.0.0.1:8000',
			'/login': 'http://127.0.0.1:8000',
		}
	}
});
