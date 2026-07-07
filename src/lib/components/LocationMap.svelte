<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, Navigation, Clock } from '@lucide/svelte';

	// Swap this for your real HQ address once you have exact coordinates.
	const address = 'Federation HQ, Hargeisa, Somaliland';
	const directionsUrl = 'https://www.google.com/maps/search/?api=1&query=Hargeisa,Somaliland';

	const quickFacts = [
		{ icon: MapPin, label: 'Address', value: address },
		{ icon: Clock, label: 'Office Hours', value: 'Sat–Thu, 9:00 AM – 5:00 PM' }
	];

	// Element refs for scroll-triggered entrance
	let sectionEl: HTMLElement;
	let textColEl: HTMLElement;
	let mapCardEl: HTMLElement;

	onMount(() => {
		let cancelled = false;

		(async () => {
			const gsapModule = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			if (cancelled) return;

			const gsap = gsapModule.default;
			gsap.registerPlugin(ScrollTrigger);

			gsap.set(textColEl, { autoAlpha: 0, y: 20 });
			gsap.set(mapCardEl, { autoAlpha: 0, y: 24, scale: 0.98 });

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
				.to(mapCardEl, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 }, '-=0.35');
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
			<span class="font-space-grotesk-section-label text-red">Visit Us</span>
			<h2 class="font-space-grotesk-title mt-2">Our Location</h2>
			<p class="font-inter-body mt-4 max-w-md">
				Stop by our headquarters in Hargeisa — we're always glad to welcome players, coaches, and
				visitors from the community.
			</p>

			<ul class="mt-8 flex flex-col gap-5">
				{#each quickFacts as fact (fact.label)}
					<li class="flex items-start gap-3.5">
						<span
							class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-green-light"
						>
							<svelte:component this={fact.icon} size={19} class="text-green" />
						</span>
						<div>
							<p class="font-inter-label text-ink-faint">{fact.label}</p>
							<p class="font-inter mt-0.5 text-[0.9375rem] font-semibold text-ink">
								{fact.value}
							</p>
						</div>
					</li>
				{/each}
			</ul>

			<a href={directionsUrl} target="_blank" rel="noopener noreferrer" class="btn-primary mt-8">
				Get Directions
				<Navigation size={16} />
			</a>
		</div>

		<!-- Map card -->
		<div
			bind:this={mapCardEl}
			class="sh-xl relative aspect-square w-full overflow-hidden rounded-2xl lg:aspect-[4/5]"
		>
			<!-- Somaliland tricolor gradient base, kept faint so it reads as
			     ambient color rather than competing with the pin/card -->
			<div
				class="absolute inset-0 opacity-[0.12]"
				style="background: var(--grad-tricolor-diagonal);"
			></div>
			<div class="absolute inset-0 bg-surface-tint mix-blend-multiply opacity-90"></div>

			<!-- Soft green glow radiating from the pin — gives it a "you are here" focal point -->
			<div
				class="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/15 blur-3xl"
			></div>

			<!-- Pin marker with pulse ring -->
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+14px)]">
				<div class="relative flex flex-col items-center">
					<span class="absolute h-14 w-14 animate-ping rounded-full bg-green/30"></span>
					<span
						class="relative flex h-14 w-14 items-center justify-center rounded-full bg-green sh-green"
					>
						<MapPin size={24} class="text-white" fill="currentColor" />
					</span>
					<!-- Pin tail -->
					<span class="-mt-1 h-3 w-3 rotate-45 bg-green"></span>
				</div>
			</div>

			<!-- Info card floating at the bottom -->
			<div class="absolute right-4 bottom-4 left-4">
				<div class="card flex items-center justify-between gap-3 p-4">
					<div>
						<p class="font-space-grotesk text-sm font-bold text-ink">Somaliland Chess Federation</p>
						<p class="font-inter-body mt-0.5 text-xs">Hargeisa, Somaliland</p>
					</div>
					<img src="/brand-assets/chessIcon.png" alt="" class="w-8 flex-shrink-0" />
				</div>
			</div>
		</div>
	</div>
</section>
