<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, MapPin, Trophy } from '@lucide/svelte';

	type Tournament = {
		id: number;
		slug: string;
		name: string;
		location: string | null;
		startDate: string | Date;
		registrationOpen: boolean;
	};

	let { tournaments = [] }: { tournaments: Tournament[] } = $props();

	function getDay(d: string | Date) {
		return new Date(d).getDate();
	}
	function getMonth(d: string | Date) {
		return new Date(d).toLocaleString('en-US', { month: 'short' }).toUpperCase();
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
		const amount = (firstCard?.offsetWidth ?? 340) + 20;
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

			gsap.set(headerEls, { autoAlpha: 0, y: 14 });
			gsap.set(cardEls, { autoAlpha: 0, y: 22 });

			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (!entry?.isIntersecting || hasAnimated) return;
					hasAnimated = true;

					gsap
						.timeline({ defaults: { ease: 'power3.out' } })
						.to(headerEls, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 })
						.to(cardEls, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 }, '-=0.2');

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

{#if tournaments.length > 0}
	<section bind:this={sectionEl} class="section-spacing bg-surface-tint" id="tournaments">
		<div class="container-app">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div use:setHeaderRef={0}>
					<h2 class="font-space-grotesk-subtitle !text-2xl sm:!text-3xl">Upcoming Tournaments</h2>
					<p class="font-inter-body mt-1.5 !text-[0.9375rem]">
						Join competitive chess across Somaliland
					</p>
				</div>

				<div use:setHeaderRef={1} class="flex items-center gap-4">
					<div class="hidden items-center gap-2 sm:flex">
						<button
							type="button"
							aria-label="Previous tournaments"
							disabled={!canScrollPrev}
							on:click={() => scrollByCard(-1)}
							class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-xs transition-all duration-200 hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
						>
							<ChevronLeft size={18} />
						</button>
						<button
							type="button"
							aria-label="Next tournaments"
							disabled={!canScrollNext}
							on:click={() => scrollByCard(1)}
							class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-xs transition-all duration-200 hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			</div>

			<div
				bind:this={trackEl}
				class="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
			>
				{#each tournaments as tournament, i (tournament.id)}
					<article
						use:setCardRef={i}
						class="card-lift flex w-[85%] flex-none snap-start overflow-hidden sm:w-[60%] md:w-[46%] lg:w-[30%]"
					>
						<div
							class="flex w-20 flex-none flex-col items-center justify-center bg-green text-white"
						>
							<span class="font-space-grotesk text-3xl font-bold leading-none">
								{getDay(tournament.startDate)}
							</span>
							<span class="mt-1 text-xs font-semibold tracking-wide uppercase">
								{getMonth(tournament.startDate)}
							</span>
						</div>

						<div class="flex-1 p-5">
							<h3 class="font-space-grotesk text-base font-bold text-ink sm:text-lg">
								{tournament.name}
							</h3>

							<div class="mt-3 flex items-center gap-2 text-sm text-ink-muted">
								<MapPin size={15} class="flex-none text-ink-faint" />
								<span>{tournament.location ?? 'Location TBA'}</span>
							</div>

							<div class="mt-1.5 flex items-center gap-2 text-sm text-ink-muted">
								<Trophy size={15} class="flex-none text-ink-faint" />
								<span
									>{tournament.registrationOpen ? 'Registration Open' : 'Registration Closed'}</span
								>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<div class="mt-6 flex items-center justify-center gap-3 sm:hidden">
				<button
					type="button"
					aria-label="Previous tournaments"
					disabled={!canScrollPrev}
					on:click={() => scrollByCard(-1)}
					class="flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-surface text-ink shadow-xs transition-all duration-200 disabled:pointer-events-none disabled:opacity-30"
				>
					<ChevronLeft size={20} />
				</button>
				<button
					type="button"
					aria-label="Next tournaments"
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
