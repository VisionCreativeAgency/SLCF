<script lang="ts">
	import { onMount } from 'svelte';
	import { Award, Building2, Trophy, Users } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type Stat = {
		value: number;
		label: string;
		suffix?: string;
		icon: Component;
		// Full literal class strings (not interpolated) so Tailwind's static
		// scanner can actually see and generate them.
		iconBg: string;
		iconColor: string;
	};

	// Real data lives here — edit these four and everything else follows.
	const stats: Stat[] = [
		{
			value: 288,
			label: 'Registered Players',
			icon: Users,
			iconBg: 'bg-green/10',
			iconColor: 'text-green-dark'
		},
		{
			value: 10,
			label: 'Active Clubs',
			icon: Building2,
			iconBg: 'bg-green/10',
			iconColor: 'text-green-dark'
		},
		{
			value: 8,
			label: 'Tournaments This Year',
			icon: Trophy,
			iconBg: 'bg-gold/15',
			iconColor: 'text-gold-dark'
		},
		{
			value: 12,
			label: 'National Titles Awarded',
			icon: Award,
			iconBg: 'bg-gold/15',
			iconColor: 'text-gold-dark'
		}
	];

	// Live numbers shown in the DOM — GSAP tweens these from 0 up to the
	// real value once the card scrolls into view. Kept as plain state so
	// each <span> just reads counts[i] reactively.
	let counts = $state(stats.map(() => 0));

	let sectionEl: HTMLElement;
	let cardEl: HTMLElement;
	let iconEls: HTMLElement[] = [];
	let hasAnimated = false;

	function setIconRef(node: HTMLElement, i: number) {
		iconEls[i] = node;
		return {
			destroy() {
				iconEls[i] = null as unknown as HTMLElement;
			}
		};
	}

	onMount(() => {
		// Same pattern as Header/Hero: gsap is dynamically imported so it
		// never touches the SSR bundle, and onMount's own callback stays
		// synchronous so its cleanup return value registers correctly.
		let cancelled = false;
		let observer: IntersectionObserver | undefined;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		(async () => {
			const gsapModule = await import('gsap');
			if (cancelled) return;
			const gsap = gsapModule.default;

			if (prefersReducedMotion) {
				// Skip motion entirely — just show final numbers and the settled card.
				counts = stats.map((s) => s.value);
				gsap.set(cardEl, { autoAlpha: 1, y: 0 });
				gsap.set(iconEls, { autoAlpha: 1, scale: 1 });
				return;
			}

			gsap.set(cardEl, { autoAlpha: 0, y: 20 });
			gsap.set(iconEls, { autoAlpha: 0, scale: 0.7 });

			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (!entry?.isIntersecting || hasAnimated) return;
					hasAnimated = true;

					// Card settles in, icons pop in with a stagger, then each
					// number counts up — all left-to-right so the eye tracks
					// naturally across the row.
					const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

					tl.to(cardEl, { autoAlpha: 1, y: 0, duration: 0.55 }).to(
						iconEls,
						{ autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.7)' },
						'-=0.25'
					);

					stats.forEach((stat, i) => {
						const counter = { value: 0 };
						gsap.to(counter, {
							value: stat.value,
							duration: 1.4,
							delay: 0.2 + i * 0.08,
							ease: 'power2.out',
							onUpdate: () => {
								counts[i] = Math.round(counter.value);
							}
						});
					});

					observer?.disconnect();
				},
				{ threshold: 0.35 }
			);

			if (sectionEl) observer.observe(sectionEl);
		})();

		return () => {
			cancelled = true;
			observer?.disconnect();
		};
	});
</script>

<!--
	Sits directly under <Hero />. The negative top margin pulls this card up
	so it overlaps the hero's bottom padding — no change to Hero.svelte
	needed, hero-spacing already leaves room underneath. Kept deliberately
	compact (max-w-4xl, tight padding, border instead of a heavy shadow) so
	it reads as a refined detail rather than a second hero.
-->
<section bind:this={sectionEl} class="relative z-10 mt-8 mb-20">
	<div class="container-app">
		<div
			bind:this={cardEl}
			class="mx-auto w-full overflow-hidden rounded-xl border border-border-light bg-surface-tint shadow-lg"
		>
			<!-- Thin brand tricolor strip — the one signature flourish -->
			<div class="tricolor-line"></div>

			<div
				class="grid grid-cols-2 gap-x-3 gap-y-5 px-5 py-6 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border-light sm:px-6 sm:py-7 lg:px-8"
			>
				{#each stats as stat, i (i)}
					<div class="stat-block !gap-1.5 !py-0">
						<div
							use:setIconRef={i}
							class={`mb-1 flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10 ${stat.iconBg} ${stat.iconColor}`}
						>
							<stat.icon size={18} strokeWidth={2} />
						</div>
						<span class="stat-number !text-2xl sm:!text-3xl">{counts[i]}{stat.suffix ?? ''}</span>
						<span class="stat-label !text-[11px] sm:!text-xs">{stat.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
