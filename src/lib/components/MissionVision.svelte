<script lang="ts">
	import { onMount } from 'svelte';

	const pillars = [
		'Develop local chess talent',
		'Organize international tournaments',
		'Promote women and youth participation',
		'Establish competitive standards'
	];

	// Element refs for scroll-triggered entrance
	let sectionEl: HTMLElement;
	let textColEl: HTMLElement;
	let cardEl: HTMLElement;
	let pillarEls: HTMLElement[] = [];

	function setPillarRef(node: HTMLElement, i: number) {
		pillarEls[i] = node;
		return {
			destroy() {
				pillarEls[i] = null as unknown as HTMLElement;
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

			gsap.set(textColEl, { autoAlpha: 0, y: 24 });
			gsap.set(cardEl, { autoAlpha: 0, y: 24, scale: 0.97 });
			gsap.set(pillarEls, { autoAlpha: 0, x: -10 });

			gsap
				.timeline({
					defaults: { ease: 'power2.out' },
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 75%',
						once: true
					}
				})
				.to(textColEl, { autoAlpha: 1, y: 0, duration: 0.5 })
				.to(cardEl, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.35')
				.to(pillarEls, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.08 }, '-=0.25');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section bind:this={sectionEl} class="section-spacing">
	<div class="container-app grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
		<!-- Text column -->
		<div bind:this={textColEl}>
			<span class="font-space-grotesk-section-label text-red">Foundation</span>
			<h2 class="font-space-grotesk-title mt-2">Our Mission &amp; Vision</h2>

			<p class="font-inter-body mt-6">
				The Somaliland Chess Federation was established to unite chess players and promote the
				game's strategic depth and intellectual benefits across our nation.
			</p>
			<p class="font-inter-body mt-4">
				We believe chess is more than a game—it's a tool for developing critical thinking, patience,
				and excellence. Our vision is to make Somaliland a recognized center of chess excellence in
				Africa.
			</p>

			<ul class="mt-8 flex flex-col gap-4">
				{#each pillars as pillar, i (pillar)}
					<li use:setPillarRef={i} class="flex items-start gap-3">
						<svg
							class="mt-0.5 h-5 w-5 flex-shrink-0 text-green"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M4 10.5 8 14.5 16 5.5" />
						</svg>
						<span class="font-inter text-[0.9375rem] font-semibold text-ink">{pillar}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Green feature card -->
		<div
			bind:this={cardEl}
			class="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl bg-green sh-lg lg:aspect-auto lg:h-[420px]"
		>
			<!-- Decorative corner glows — subtle depth, brand-consistent -->
			<div
				class="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
			></div>
			<div
				class="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-black/10 blur-3xl"
			></div>

			<!-- Faint tricolor ring behind the icon -->
			<div class="pointer-events-none absolute h-40 w-40 rounded-full border border-white/15"></div>

			<img
				src="/brand-assets/chess-icon.png"
				alt=""
				class="relative z-10 w-16 brightness-0 invert md:w-20"
			/>
			<p class="font-space-grotesk relative z-10 mt-5 text-lg font-bold text-white md:text-xl">
				Excellence in Chess
			</p>
		</div>
	</div>
</section>
