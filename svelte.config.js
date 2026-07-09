import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Enables <script lang="ts"> support, TS in markup expressions, etc.
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto detects your deployment target (Vercel/Netlify/Node/etc.)
		// at build time. Swap for a specific adapter (adapter-node, adapter-static...)
		// once you know where this is deploying.
		adapter: adapter()
	}
};

export default config;
