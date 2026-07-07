<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, MapPin } from '@lucide/svelte';
	import FlagPlaceholder from '$lib/components/FlagPlaceholder.svelte';

	type Club = {
		id: number;
		name: string;
		location: string | null;
		logo: string | null;
	};

	let { clubs = [] }: { clubs: Club[] } = $props();

	function getInitials(name: string) {
		return name.slice(0, 2).toUpperCase();
	}

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

{#if clubs.length > 0}
	<section bind:this={sectionEl} class="section-spacing section-tint">
		<div class="container-app">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div use:setHeaderRef={0}>
					<h2 class="font-space-grotesk-subtitle !text-2xl sm:!text-3xl">
						Clubs Across Somaliland
					</h2>
					<p class="font-inter-body mt-1.5 !text-[0.9375rem]">
						Active chess communities in every region
					</p>
				</div>

				<div use:setHeaderRef={1} class="hidden items-center gap-2 sm:flex">
					<button
						type="button"
						aria-label="Previous clubs"
						disabled={!canScrollPrev}
						on:click={() => scrollByCard(-1)}
						class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-xs transition-all duration-200 hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
					>
						<ChevronLeft size={18} />
					</button>
					<button
						type="button"
						aria-label="Next clubs"
						disabled={!canScrollNext}
						on:click={() => scrollByCard(1)}
						class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-xs transition-all duration-200 hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
					>
						<ChevronRight size={18} />
					</button>
				</div>
			</div>

			<div
				bind:this={trackEl}
				class="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
			>
				{#each clubs as club, i (club.id)}
					<div
						use:setCardRef={i}
						class="card-lift flex w-[75%] flex-none snap-start items-center gap-4 p-5 sm:w-[48%] md:w-[31%] lg:w-[23%]"
					>
						<div class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
							{#if club.logo}
								<img src={club.logo} alt={club.name} class="h-full w-full object-cover" />
							{:else}
								<FlagPlaceholder>
									<span class="text-sm font-bold">{getInitials(club.name)}</span>
								</FlagPlaceholder>
							{/if}
						</div>

						<div>
							<h3 class="font-space-grotesk text-base font-bold text-ink">
								{club.name}
							</h3>
							{#if club.location}
								<div class="font-inter-body mt-1 flex items-center gap-1.5 text-sm">
									<MapPin size={14} class="text-ink-faint" />
									<span>{club.location}</span>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-6 flex items-center justify-center gap-3 sm:hidden">
				<button
					type="button"
					aria-label="Previous clubs"
					disabled={!canScrollPrev}
					on:click={() => scrollByCard(-1)}
					class="flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-xs transition-all duration-200 disabled:pointer-events-none disabled:opacity-30"
				>
					<ChevronLeft size={20} />
				</button>
				<button
					type="button"
					aria-label="Next clubs"
					disabled={!canScrollNext}
					on:click={() => scrollByCard(1)}
					class="flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-xs transition-all duration-200 disabled:pointer-events-none disabled:opacity-30"
				>
					<ChevronRight size={20} />
				</button>
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
