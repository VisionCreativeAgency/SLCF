<script lang="ts">
	import { onMount } from 'svelte';
	import { Award, CalendarCheck, Users } from '@lucide/svelte';

	// Content lives here — edit freely, layout below doesn't need to change.
	const eyebrow = 'Join the Federation';
	const headline = 'Start Your Chess Journey Today';
	const subtext =
		"Whether you're a beginner or an experienced competitor, we have training, tournaments, and a community ready for you.";

	const primaryCta = { label: 'Explore Programs', href: '/about' };
	const secondaryCta = { label: 'Become a Member', href: '/contact#contact' };

	// Small reassurance row — different content from the stats bar (that's
	// federation-wide numbers; this is about program accessibility).
	const trustPoints = [
		{ label: 'All skill levels', icon: Award },
		{ label: 'All ages welcome', icon: Users },
		{ label: 'Flexible schedules', icon: CalendarCheck }
	];

	let sectionEl: HTMLElement;
	let eyebrowEl: HTMLElement;
	let headlineEl: HTMLElement;
	let subtextEl: HTMLElement;
	let buttonsEl: HTMLElement;
	let trustEl: HTMLElement;
	let hasAnimated = false;

	onMount(() => {
		// Same dynamic-import + IntersectionObserver pattern used across the
		// page: gsap stays out of the SSR bundle, onMount's callback stays
		// synchronous so its cleanup return value registers correctly.
		let cancelled = false;
		let observer: IntersectionObserver | undefined;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		(async () => {
			const gsapModule = await import('gsap');
			if (cancelled) return;
			const gsap = gsapModule.default;

			const targets = [eyebrowEl, headlineEl, subtextEl, buttonsEl, trustEl];

			if (prefersReducedMotion) {
				gsap.set(targets, { autoAlpha: 1, y: 0 });
				return;
			}

			gsap.set(targets, { autoAlpha: 0, y: 20 });

			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (!entry?.isIntersecting || hasAnimated) return;
					hasAnimated = true;

					gsap
						.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } })
						.to(eyebrowEl, { autoAlpha: 1, y: 0 })
						.to(headlineEl, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.35')
						.to(subtextEl, { autoAlpha: 1, y: 0 }, '-=0.4')
						.to(buttonsEl, { autoAlpha: 1, y: 0 }, '-=0.35')
						.to(trustEl, { autoAlpha: 1, y: 0 }, '-=0.3');

					observer?.disconnect();
				},
				{ threshold: 0.3 }
			);

			if (sectionEl) observer.observe(sectionEl);
		})();

		return () => {
			cancelled = true;
			observer?.disconnect();
		};
	});
</script>

<section bind:this={sectionEl} class="section-cta hero-spacing relative overflow-hidden">
	<!-- Brand tricolor strip along the top edge, ties this band back to the
	     rest of the site instead of it feeling like an unrelated slab of color. -->
	<div class="tricolor-line absolute top-0 right-0 left-0"></div>

	<!-- Soft radial glows for depth on the dark gradient — subtle, not busy. -->
	<div
		class="pointer-events-none absolute top-1/2 left-1/2 -z-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl"
	></div>

	<div class="container-app relative z-10 mx-auto max-w-2xl text-center">
		<p
			bind:this={eyebrowEl}
			class="font-space-grotesk text-xs font-bold tracking-[0.2em] text-gold-light uppercase sm:text-sm"
		>
			{eyebrow}
		</p>

		<h2
			bind:this={headlineEl}
			class="mt-3 font-space-grotesk text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
		>
			{headline}
		</h2>

		<p bind:this={subtextEl} class="font-inter mt-4 text-base text-white/85 sm:text-lg">
			{subtext}
		</p>

		<div
			bind:this={buttonsEl}
			class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
		>
			<a
				href={primaryCta.href}
				class="inline-flex w-full items-center justify-center rounded-md bg-white px-7 py-3.5 font-inter text-[0.9375rem] font-semibold text-red shadow-lg transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] sm:w-auto"
			>
				{primaryCta.label}
			</a>
			<a
				href={secondaryCta.href}
				class="inline-flex w-full items-center justify-center rounded-md border-2 border-white/40 px-7 py-3.5 font-inter text-[0.9375rem] font-semibold text-white transition-colors duration-200 hover:bg-white/10 hover:border-white/70 sm:w-auto"
			>
				{secondaryCta.label}
			</a>
		</div>

		<div
			bind:this={trustEl}
			class="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 sm:gap-x-8"
		>
			{#each trustPoints as point, i (i)}
				<div class="flex items-center gap-2 text-sm text-white/80">
					<point.icon size={16} class="text-gold-light" />
					{point.label}
				</div>
			{/each}
		</div>
	</div>
</section>
