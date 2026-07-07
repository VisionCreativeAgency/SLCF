<script lang="ts">
	import './global.css';
	import favicon from '$lib/assets/favicon.ico';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href="/brand-assets/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="/brand-assets/favicon-192.png" />
	<link rel="icon" type="image/png" sizes="512x512" href="/brand-assets/favicon-512.png" />

	<title>Somaliland Chess Federation</title>
	<meta
		name="description"
		content="The official Somaliland Chess Federation — tournaments, top players, member clubs, and the latest chess news across Somaliland."
	/>

	<meta property="og:site_name" content="Somaliland Chess Federation" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/seo/og-image.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="/seo/og-image.jpg" />
</svelte:head>

<Header />
{@render children()}
<Footer />
