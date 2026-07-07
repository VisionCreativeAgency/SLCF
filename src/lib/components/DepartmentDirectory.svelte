<script lang="ts">
	import { onMount } from 'svelte';

	type Department = {
		name: string;
		email: string;
	};

	const departments: Department[] = [
		{ name: 'Membership Inquiries', email: 'membership@slcf.so' },
		{ name: 'Media & Press', email: 'media@slcf.so' },
		{ name: 'Tournament Organizing', email: 'tournaments@slcf.so' },
		{ name: 'Sponsorship', email: 'sponsorship@slcf.so' }
	];

	// Element refs for scroll-triggered entrance
	let sectionEl: HTMLElement;
	let headerEl: HTMLElement;
	let cardEls: HTMLElement[] = [];

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
			const gsapModule = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			if (cancelled) return;

			const gsap = gsapModule.default;
			gsap.registerPlugin(ScrollTrigger);

			gsap.set(headerEl, { autoAlpha: 0, y: 20 });
			gsap.set(cardEls, { autoAlpha: 0, y: 20 });

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
				.to(cardEls, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.2');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section bind:this={sectionEl} class="section-spacing">
	<div class="container-app">
		<!-- Header -->
		<div bind:this={headerEl} class="mx-auto max-w-xl text-center">
			<h2 class="font-space-grotesk-title">Department Directory</h2>
			<p class="font-inter-body mt-3">Reach the right team directly</p>
		</div>

		<!-- Cards -->
		<div class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
			{#each departments as dept, i (dept.name)}
				<a
					use:setCardRef={i}
					href={`mailto:${dept.email}`}
					class="group r-lg section-tint flex flex-col items-center gap-1.5 border border-transparent p-6 text-center transition-colors duration-200 hover:border-green/20 hover:bg-green-light"
				>
					<h3 class="font-space-grotesk text-[0.9375rem] font-bold text-ink">
						{dept.name}
					</h3>
					<p class="font-inter text-sm text-green transition-colors group-hover:text-green-dark">
						{dept.email}
					</p>
				</a>
			{/each}
		</div>
	</div>
</section>
