<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronRight } from '@lucide/svelte';

	const ways = [
		{
			title: 'Become a Player Member',
			description: 'Join as a registered player and compete in SLCF tournaments.'
		},
		{
			title: 'Volunteer as a Coach',
			description: 'Help train the next generation of Somaliland chess players.'
		},
		{
			title: 'Support as a Sponsor',
			description: 'Partner with us to grow chess across the nation.'
		}
	];

	// Element refs for scroll-triggered entrance
	let textColEl: HTMLElement;
	let itemEls: HTMLElement[] = [];
	let cardEl: HTMLElement;
	let sectionEl: HTMLElement;

	function setItemRef(node: HTMLElement, i: number) {
		itemEls[i] = node;
		return {
			destroy() {
				itemEls[i] = null as unknown as HTMLElement;
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

			gsap.set(textColEl, { autoAlpha: 0, y: 20 });
			gsap.set(itemEls, { autoAlpha: 0, x: -10 });
			gsap.set(cardEl, { autoAlpha: 0, y: 24, scale: 0.97 });

			gsap
				.timeline({
					defaults: { ease: 'power2.out' },
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 75%',
						once: true
					}
				})
				.to(textColEl, { autoAlpha: 1, y: 0, duration: 0.45 })
				.to(itemEls, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.08 }, '-=0.2')
				.to(cardEl, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 }, '-=0.35');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section bind:this={sectionEl} class="section-tint section-spacing">
	<div class="container-app grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
		<!-- Text column -->
		<div bind:this={textColEl}>
			<h2 class="font-space-grotesk-title">Get Involved</h2>
			<p class="font-inter-body mt-3">
				There are many ways to contribute to Somaliland's chess community.
			</p>

			<ul class="mt-8 flex flex-col gap-6">
				{#each ways as way, i (way.title)}
					<li use:setItemRef={i} class="flex items-start gap-3">
						<span class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green"></span>
						<div>
							<h3 class="font-inter text-base font-bold text-ink">
								{way.title}
							</h3>
							<p class="font-inter-body mt-0.5 text-[0.9375rem]">
								{way.description}
							</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<!-- CTA card -->
		<div bind:this={cardEl} class="card sh-xl mx-auto w-full max-w-md p-8">
			<h3 class="font-space-grotesk text-xl font-bold text-ink">Ready to join?</h3>
			<p class="font-inter-body mt-2">Fill out our contact form and we'll get back to you.</p>

			<a href="/contact" class="btn-primary mt-6">
				Contact Us
				<ChevronRight size={18} />
			</a>
		</div>
	</div>
</section>
