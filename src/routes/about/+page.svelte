<script lang="ts">
	import AboutHero from '$lib/components/AboutHero.svelte';
	import CtaJoin from '$lib/components/ctaJoin.svelte';
	import GetInvolved from '$lib/components/GetInvolved.svelte';
	import Leadership from '$lib/components/Leadership.svelte';
	import MissionVision from '$lib/components/MissionVision.svelte';
	import WhatWeDo from '$lib/components/WhatWeDo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>About Us | Somaliland Chess Federation</title>
	<meta
		name="description"
		content="Learn about the Somaliland Chess Federation's mission, leadership, and work to grow chess culture across Somaliland."
	/>
	<meta property="og:title" content="About Us | Somaliland Chess Federation" />
	<meta
		property="og:description"
		content="Learn about the Somaliland Chess Federation's mission, leadership, and work to grow chess culture across Somaliland."
	/>
	<meta property="og:url" content="https://somalilandchessfederation.com/about" />
</svelte:head>

<main class="md:-mt-20 -mt-14">
	<AboutHero />
	<MissionVision />
	<WhatWeDo />
	<Leadership leaders={data.currentLeadership} />
	<GetInvolved />
	<CtaJoin
		title="Join Our Growing Community"
		subtitle="Become a member of the Somaliland Chess Federation"
		buttonLabel="Become a Member"
		buttonHref="/contact#contact"
	/>
</main>
