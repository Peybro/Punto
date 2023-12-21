import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}']
			},
			includeAssets: [
				'favicon.png',
				'apple-touch-icon.png',
				'vite.svg',
				'android-chrome-192x192.png',
				'android-chrome-512x512.png'
			],
			manifest: {
				short_name: 'Punto',
				name: 'Punto',
				start_url: '/',
				icons: [
					{
						src: './android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: './android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				],
				theme_color: '#111111',
				background_color: '#3367D6',
				display: 'standalone',
				scope: '/',
				description: 'Punkt über Punkt zum Sieg!'
			}
		})
	]
});
