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

<main class="-mt-20">
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
