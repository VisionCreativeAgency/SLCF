<script lang="ts">
	import NewsHero from '$lib/components/NewsHero.svelte';
	import NewsList from '$lib/components/NewsList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>News | Somaliland Chess Federation</title>
	<meta
		name="description"
		content="Latest news, tournament results, and updates from the Somaliland Chess Federation."
	/>
	<meta property="og:title" content="News | Somaliland Chess Federation" />
	<meta
		property="og:description"
		content="Latest news, tournament results, and updates from the Somaliland Chess Federation."
	/>
	<meta property="og:url" content="https://somalilandchessfederation.com/news" />
</svelte:head>

<main class="-mt-10">
	<NewsHero />
	<NewsList {data} />
</main>
