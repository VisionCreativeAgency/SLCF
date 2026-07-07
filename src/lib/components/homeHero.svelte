<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight, ChessKnight, Crown, Users, UserPlus } from '@lucide/svelte';

	// Element refs for the GSAP entrance timeline
	let eyebrow: HTMLElement;
	let headline: HTMLElement;
	let description: HTMLElement;
	let buttons: HTMLElement;
	let card: HTMLElement;
	let statChip: HTMLElement;

	onMount(() => {
		// Dynamic import keeps gsap out of the SSR bundle — see Header.svelte
		// for the full reasoning on why this stays out of onMount's own
		// (synchronous) callback body.
		let cancelled = false;

		(async () => {
			const gsapModule = await import('gsap');
			if (cancelled) return;
			const gsap = gsapModule.default;

			gsap.set([eyebrow, headline, description, buttons], { autoAlpha: 0, y: 22 });
			gsap.set(card, { autoAlpha: 0, y: 24, scale: 0.96 });
			gsap.set(statChip, { autoAlpha: 0, y: 12 });

			gsap
				.timeline({ defaults: { ease: 'power3.out' } })
				.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.5 })
				.to(headline, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.35')
				.to(description, { autoAlpha: 1, y: 0, duration: 0.55 }, '-=0.4')
				.to(buttons, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.3')
				.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }, '-=0.55')
				.to(statChip, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.3');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section class="hero-spacing overflow-hidden bg-surface">
	<div class="container-app grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
		<!-- Left: copy -->
		<div class="text-center lg:text-left">
			<p bind:this={eyebrow} class="font-inter text-base font-medium text-ink sm:text-lg">
				Elevating Chess Excellence
			</p>

			<h1
				bind:this={headline}
				class="font-space-grotesk-title mt-2 text-3xl sm:text-4xl lg:text-5xl"
			>
				Somaliland Chess Federation
			</h1>

			<p
				bind:this={description}
				class="font-inter-body mx-auto mt-5 max-w-md text-sm sm:text-base lg:mx-0"
			>
				Uniting players, developing talent, and promoting excellence in chess across Somaliland. We
				are dedicated to building a strong chess community for all levels.
			</p>

			<div
				bind:this={buttons}
				class="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
			>
				<a href="/about" class="btn-primary justify-center">
					Learn More
					<ArrowRight size={18} />
				</a>

				<a
					href="/contact#contact"
					class="inline-flex items-center justify-center gap-2 rounded-md border-2 border-red px-6 py-3 font-inter text-[0.9375rem] font-semibold text-red transition-colors duration-300 hover:bg-red hover:text-white"
				>
					<UserPlus size={18} />
					Join Us
				</a>
			</div>
		</div>

		<!-- Right: green feature card -->
		<div class="relative mx-auto w-full max-w-md pb-8 sm:pb-10 lg:mx-0 lg:max-w-none">
			<!-- Soft decorative glow behind the card -->
			<div
				class="pointer-events-none absolute -top-8 -right-6 -z-10 h-56 w-56 rounded-full bg-green-light/60 blur-3xl sm:-top-10 sm:-right-10 sm:h-72 sm:w-72"
			></div>
			<div
				class="pointer-events-none absolute -bottom-6 -left-8 -z-10 h-40 w-40 rounded-full bg-red/10 blur-3xl"
			></div>

			<div
				bind:this={card}
				class="relative isolate overflow-hidden rounded-2xl bg-green px-6 py-10 shadow-green sm:rounded-3xl sm:px-10 sm:py-12"
			>
				<!-- Chessboard watermark pattern -->
				<div
					class="pointer-events-none absolute inset-0 opacity-[0.08]"
					style="background-image:
						linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%),
						linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%);
						background-size: 48px 48px;
						background-position: 0 0, 24px 24px;"
				></div>

				<!-- Decorative rings -->
				<div
					class="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full border border-white/15 sm:h-48 sm:w-48"
				></div>
				<div
					class="pointer-events-none absolute -bottom-10 -left-8 h-24 w-24 rounded-full border border-white/10"
				></div>

				<!-- Ghost knight watermark -->
				<ChessKnight
					size={220}
					strokeWidth={1}
					class="pointer-events-none absolute -right-8 -bottom-8 text-white/10 sm:size-[260px]"
				/>

				<div
					class="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-5 text-center sm:aspect-[16/11] sm:gap-6 lg:aspect-[16/9]"
				>
					<span
						class="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm"
					>
						<Crown size={14} />
						Federation
					</span>

					<img
						src="/brand-assets/chess-icon.png"
						alt="Chess piece illustration"
						class="w-[140px] drop-shadow-xl sm:w-[180px] lg:w-[200px]"
					/>

					<span class="font-space-grotesk text-2xl font-bold text-white sm:text-3xl">
						Chess Excellence
					</span>

					<p class="font-inter max-w-[15rem] text-sm text-white/80 sm:max-w-xs">
						Strategy, discipline, and community — growing chess talent nationwide.
					</p>
				</div>
			</div>

			<!-- Floating stat chip -->
			<div
				bind:this={statChip}
				class="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 sm:-bottom-4 sm:left-8 sm:translate-x-0"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-light/40 text-green"
				>
					<Users size={18} />
				</div>
				<div class="text-left">
					<p class="font-space-grotesk text-sm font-bold leading-none text-ink">500+</p>
					<p class="font-inter text-xs text-ink/60">Active members</p>
				</div>
			</div>
		</div>
	</div>
</section>
