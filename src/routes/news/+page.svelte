<script lang="ts">
	import NewsHero from '$lib/components/NewsHero.svelte';
	import NewsList from '$lib/components/NewsList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="-mt-10">
	<NewsHero />
	<NewsList {data} />
</main>
