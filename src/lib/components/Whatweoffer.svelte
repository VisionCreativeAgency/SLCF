<script lang="ts">
	import { onMount } from 'svelte';
	import { BookOpen, Trophy, Users } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type Feature = {
		title: string;
		description: string;
		icon: Component;
		// Full literal class strings so Tailwind's static scanner can see them.
		iconBg: string;
		iconColor: string;
	};

	// Real content lives here — edit these three and everything else follows.
	const features: Feature[] = [
		{
			title: 'Expert Training',
			description: 'Learn from certified coaches with international experience.',
			icon: BookOpen,
			iconBg: 'bg-green/10',
			iconColor: 'text-green-dark'
		},
		{
			title: 'Competitive Tournaments',
			description: 'Participate in regional and national championships.',
			icon: Trophy,
			iconBg: 'bg-gold/15',
			iconColor: 'text-gold-dark'
		},
		{
			title: 'Community Building',
			description: 'Connect with players and enthusiasts from across Somaliland.',
			icon: Users,
			iconBg: 'bg-red/10',
			iconColor: 'text-red-dark'
		}
	];

	let sectionEl: HTMLElement;
	let headerEls: HTMLElement[] = [];
	let cardEls: HTMLElement[] = [];
	let hasAnimated = false;

	function setHeaderRef(node: HTMLElement, i: number) {
		headerEls[i] = node;
		return {
			destroy() {
				headerEls[i] = null as unknown as HTMLElement;
			}
		};
	}
	function setCardRef(node: HTMLElement, i: number) {
		cardEls[i] = node;
		return {
			destroy() {
				cardEls[i] = null as unknown as HTMLElement;
			}
		};
	}

	onMount(() => {
		// Same dynamic-import + IntersectionObserver pattern as Hero/StatsBar:
		// gsap never touches the SSR bundle, onMount's own callback stays
		// synchronous so its cleanup return value registers correctly.
		let cancelled = false;
		let observer: IntersectionObserver | undefined;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		(async () => {
			const gsapModule = await import('gsap');
			if (cancelled) return;
			const gsap = gsapModule.default;

			if (prefersReducedMotion) {
				gsap.set([...headerEls, ...cardEls], { autoAlpha: 1, y: 0 });
				return;
			}

			gsap.set(headerEls, { autoAlpha: 0, y: 16 });
			gsap.set(cardEls, { autoAlpha: 0, y: 24 });

			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (!entry?.isIntersecting || hasAnimated) return;
					hasAnimated = true;

					gsap
						.timeline({ defaults: { ease: 'power3.out' } })
						.to(headerEls, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 })
						.to(cardEls, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.25');

					observer?.disconnect();
				},
				{ threshold: 0.2 }
			);

			if (sectionEl) observer.observe(sectionEl);
		})();

		return () => {
			cancelled = true;
			observer?.disconnect();
		};
	});
</script>

<section bind:this={sectionEl} class="section-spacing bg-surface-tint mb-20">
	<div class="container-app">
		<!-- Header -->
		<div class="mx-auto max-w-2xl text-center">
			<p use:setHeaderRef={0} class="font-space-grotesk-section-label text-red">Why Choose Us</p>
			<h2
				use:setHeaderRef={1}
				class="font-space-grotesk-subtitle mt-3 !text-3xl sm:!text-4xl lg:!text-[2.75rem]"
			>
				What We Offer
			</h2>
			<p use:setHeaderRef={2} class="font-inter-body mt-4">
				Comprehensive programs and support for chess players of all levels.
			</p>
		</div>

		<!-- Feature cards -->
		<div class="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-3 md:gap-6 lg:gap-8">
			{#each features as feature, i (i)}
				<div use:setCardRef={i} class="card-lift group flex flex-col gap-4 p-6 sm:p-7 lg:p-8">
					<div
						class={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 ${feature.iconBg} ${feature.iconColor}`}
					>
						<feature.icon size={24} strokeWidth={2} />
					</div>

					<div>
						<h3 class="font-space-grotesk text-lg font-bold text-ink sm:text-xl">
							{feature.title}
						</h3>
						<p class="font-inter-body mt-2 !text-[0.9375rem]">
							{feature.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
