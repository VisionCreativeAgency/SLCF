<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';

	type FaqItem = {
		question: string;
		answer: string;
	};

	const faqs: FaqItem[] = [
		{
			question: 'How do I join a chess club in Somaliland?',
			answer:
				"Browse the clubs listed on our Clubs page and reach out directly to the one nearest you, or contact us and we'll connect you with a club in your region."
		},
		{
			question: 'How do I get a FIDE rating?',
			answer:
				"You earn a FIDE rating by playing in FIDE-rated tournaments organized through the federation. Once you've played the minimum number of rated games, FIDE assigns your official rating."
		},
		{
			question: 'Can my school start a chess program?',
			answer:
				'Yes — our Chess in Schools initiative helps schools set up clubs, provides starter resources, and can connect you with a coach. Reach out to our Community Outreach team to get started.'
		},
		{
			question: 'Are there tournaments for beginners?',
			answer:
				'Yes, we run beginner-friendly and rating-bracketed tournaments throughout the year so new players can compete at an appropriate level. Check our News & Updates page for upcoming dates.'
		},
		{
			question: 'How can I become a chess coach?',
			answer:
				'Coaches typically start by volunteering with a local club, then can pursue federation coaching certification as they gain experience. Contact our Technical Director for the current certification pathway.'
		}
	];

	// Tracks which indices are open — supports multiple open at once.
	let openIndices = $state(new Set<number>());

	function toggle(i: number) {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const next = new Set(openIndices);
		if (next.has(i)) {
			next.delete(i);
		} else {
			next.add(i);
		}
		openIndices = next;
	}

	// Element refs for scroll-triggered entrance
	let sectionEl: HTMLElement;
	let headerEl: HTMLElement;
	let itemEls: HTMLElement[] = [];

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
			const gsapModule = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			if (cancelled) return;

			const gsap = gsapModule.default;
			gsap.registerPlugin(ScrollTrigger);

			gsap.set(headerEl, { autoAlpha: 0, y: 20 });
			gsap.set(itemEls, { autoAlpha: 0, y: 16 });

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
				.to(itemEls, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06 }, '-=0.2');
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
			<h2 class="font-space-grotesk-title">Frequently Asked Questions</h2>
			<p class="font-inter-body mt-3">Common questions about Somaliland chess</p>
		</div>

		<!-- Accordion -->
		<div class="mx-auto mt-12 flex max-w-3xl flex-col gap-3 md:mt-14">
			{#each faqs as faq, i (faq.question)}
				{@const isOpen = openIndices.has(i)}
				<div
					use:setItemRef={i}
					class="r-lg overflow-hidden border border-border-light bg-surface transition-colors duration-200"
					class:border-green={isOpen}
				>
					<button
						type="button"
						class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
						onclick={() => toggle(i)}
						aria-expanded={isOpen}
					>
						<span class="font-space-grotesk text-[0.9375rem] font-bold text-ink md:text-base">
							{faq.question}
						</span>
						<ChevronDown
							size={18}
							class={`flex-shrink-0 text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-green' : ''}`}
						/>
					</button>

					<!-- CSS grid-rows trick: smoothly animates to auto height
					     without JS measuring the content, and handles variable
					     answer lengths cleanly. -->
					<div
						class="grid transition-[grid-template-rows] duration-300 ease-out"
						style={`grid-template-rows: ${isOpen ? '1fr' : '0fr'};`}
					>
						<div class="overflow-hidden">
							<p class="font-inter-body px-5 pb-5 text-[0.9375rem]">
								{faq.answer}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
