<script lang="ts">
	import BlogSection from '$lib/components/blogSection.svelte';
	import Clubs from '$lib/components/clubs.svelte';
	import CtaJoin from '$lib/components/ctaJoin.svelte';
	import HomeHero from '$lib/components/homeHero.svelte';
	import Partners from '$lib/components/Partners.svelte';
	import Startjourneycta from '$lib/components/Startjourneycta.svelte';
	import StatsBar from '$lib/components/statsBar.svelte';
	import Topplayers from '$lib/components/Topplayers.svelte';
	import Upcomingtournaments from '$lib/components/Upcomingtournaments.svelte';
	import Whatweoffer from '$lib/components/Whatweoffer.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Somaliland Chess Federation</title>
	<meta
		name="description"
		content="The official Somaliland Chess Federation — tournaments, top players, member clubs, and the latest chess news across Somaliland."
	/>
	<meta property="og:title" content="Somaliland Chess Federation" />
	<meta
		property="og:description"
		content="The official Somaliland Chess Federation — tournaments, top players, member clubs, and the latest chess news across Somaliland."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://somalilandchessfederation.com" />
</svelte:head>

<main class="mt-6">
	<HomeHero />
	<StatsBar />
	<Whatweoffer />
	<Topplayers players={data.topPlayers} />
	<Partners />
	<Startjourneycta />
	<Upcomingtournaments tournaments={data.upcomingTournaments} />
	<Clubs clubs={data.clubs} />
	<BlogSection posts={data.latestPosts} />
	<CtaJoin />
</main>
