<script lang="ts">
	import { onMount } from 'svelte';
	import { Users, Trophy, Globe, Target } from '@lucide/svelte';

	const activities = [
		{
			icon: Users,
			title: 'Player Development',
			description:
				'Training programs, coaching certifications, and skill-building workshops for all levels.'
		},
		{
			icon: Trophy,
			title: 'Tournament Organization',
			description: 'Local, regional, and national competitive events with professional standards.'
		},
		{
			icon: Globe,
			title: 'National Representation',
			description: 'Preparing and sending players to international competitions and championships.'
		},
		{
			icon: Target,
			title: 'Community Outreach',
			description: 'Chess in schools programs and initiatives to grow the game at grassroots level.'
		}
	];

	// Element refs for scroll-triggered entrance
	let headerEl: HTMLElement;
	let cardEls: HTMLElement[] = [];
	let sectionEl: HTMLElement;

	function setCardRef(node: HTMLElement, i: number) {
		cardEls[i] = node;
		return {
			destroy() {
				cardEls[i] = null as unknown as HTMLElement;
			}
		};
	}

	onMount(() => {
		let cancelled = false;

		(async () => {
			// Dynamic import — gsap/ScrollTrigger touch `window`/`document` at
			// import time, which breaks SSR if imported statically.
			const gsapModule = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			if (cancelled) return;

			const gsap = gsapModule.default;
			gsap.registerPlugin(ScrollTrigger);

			gsap.set(headerEl, { autoAlpha: 0, y: 20 });
			gsap.set(cardEls, { autoAlpha: 0, y: 24 });

			gsap
				.timeline({
					defaults: { ease: 'power2.out' },
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 75%',
						once: true
					}
				})
				.to(headerEl, { autoAlpha: 1, y: 0, duration: 0.45 })
				.to(cardEls, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.2');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section bind:this={sectionEl} class="section-tint section-spacing">
	<div class="container-app">
		<!-- Header -->
		<div bind:this={headerEl} class="mx-auto max-w-2xl text-center">
			<h2 class="font-space-grotesk-title">What We Do</h2>
			<p class="font-inter-body mt-3">Our core activities as a national federation</p>
		</div>

		<!-- Cards -->
		<div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
			{#each activities as activity, i (activity.title)}
				<div use:setCardRef={i} class="card-lift p-6">
					<div class="flex h-11 w-11 items-center justify-center rounded-lg bg-green-light">
						<svelte:component this={activity.icon} size={22} class="text-green" />
					</div>

					<h3 class="font-space-grotesk mt-4 text-lg font-bold text-ink">
						{activity.title}
					</h3>

					<p class="font-inter-body mt-2 text-[0.9375rem]">
						{activity.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
