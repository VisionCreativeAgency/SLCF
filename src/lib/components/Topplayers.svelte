<script lang="ts">
	import { onMount } from 'svelte';
	import { ChessKnight, ChevronLeft, ChevronRight, Crown } from '@lucide/svelte';
	import FlagPlaceholder from '$lib/components/FlagPlaceholder.svelte';

	type Player = {
		id: number;
		name: string;
		rating: number;
		title: string | null;
		photo: string | null;
		club: { name: string } | null;
	};

	let { players = [] }: { players: Player[] } = $props();

	let sectionEl: HTMLElement;
	let headerEls: HTMLElement[] = [];
	let trackEl: HTMLElement;
	let cardEls: HTMLElement[] = [];
	let hasAnimated = false;

	let canScrollPrev = $state(false);
	let canScrollNext = $state(true);

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

	function updateScrollState() {
		if (!trackEl) return;
		const { scrollLeft, scrollWidth, clientWidth } = trackEl;
		canScrollPrev = scrollLeft > 4;
		canScrollNext = scrollLeft < scrollWidth - clientWidth - 4;
	}

	function scrollByCard(direction: 1 | -1) {
		if (!trackEl) return;
		const firstCard = cardEls[0];
		const amount = (firstCard?.offsetWidth ?? 280) + 20;
		trackEl.scrollBy({ left: amount * direction, behavior: 'smooth' });
	}

	onMount(() => {
		let cancelled = false;
		let observer: IntersectionObserver | undefined;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		updateScrollState();
		trackEl?.addEventListener('scroll', updateScrollState, { passive: true });
		window.addEventListener('resize', updateScrollState);

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
						.to(cardEls, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, '-=0.25');

					observer?.disconnect();
				},
				{ threshold: 0.15 }
			);

			if (sectionEl) observer.observe(sectionEl);
		})();

		return () => {
			cancelled = true;
			observer?.disconnect();
			trackEl?.removeEventListener('scroll', updateScrollState);
			window.removeEventListener('resize', updateScrollState);
		};
	});
</script>

{#if players.length > 0}
	<section bind:this={sectionEl} class="section-spacing bg-surface-tint">
		<div class="container-app">
			<div class="mx-auto max-w-2xl text-center">
				<p use:setHeaderRef={0} class="font-space-grotesk-section-label">National Team</p>
				<h2
					use:setHeaderRef={1}
					class="font-space-grotesk-subtitle mt-3 !text-3xl sm:!text-4xl lg:!text-[2.75rem]"
				>
					Top Players
				</h2>
				<p use:setHeaderRef={2} class="font-inter-body mt-4">
					The federation's leading rated players representing Somaliland at home and abroad.
				</p>
			</div>

			<div class="relative mt-10 sm:mt-12">
				<div
					bind:this={trackEl}
					class="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-2"
				>
					{#each players as player, i (player.id)}
						<article
							use:setCardRef={i}
							class="card-lift group w-[72%] flex-none snap-start overflow-hidden sm:w-[45%] md:w-[31%] lg:w-[23%]"
						>
							<div
								class="bg-checker relative flex h-40 items-center justify-center overflow-hidden sm:h-44"
							>
								{#if player.photo}
									<img src={player.photo} alt={player.name} class="h-full w-full object-cover" />
								{:else}
									<FlagPlaceholder>
										<ChessKnight
											size={56}
											strokeWidth={1.5}
											class="transition-transform duration-300 group-hover:scale-105"
										/>
									</FlagPlaceholder>
								{/if}
								<span
									class="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-surface-dark-2/90 px-2.5 py-1 text-xs font-semibold text-white"
								>
									<Crown size={13} class="text-gold-light" />
									{player.rating}
								</span>
							</div>

							<div class="p-5">
								<p class="font-inter-label !text-green-dark">{player.title ?? 'Player'}</p>
								<h3 class="font-space-grotesk mt-1 text-lg font-bold text-ink">{player.name}</h3>
								<p class="font-inter mt-1 text-sm text-ink-muted">
									{player.club?.name ?? 'Independent'}
								</p>
							</div>
						</article>
					{/each}
				</div>

				<div class="mt-6 flex items-center justify-center gap-3">
					<button
						type="button"
						aria-label="Previous players"
						disabled={!canScrollPrev}
						on:click={() => scrollByCard(-1)}
						class="flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-sm transition-all duration-200 hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						type="button"
						aria-label="Next players"
						disabled={!canScrollNext}
						on:click={() => scrollByCard(1)}
						class="flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-sm transition-all duration-200 hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.no-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
