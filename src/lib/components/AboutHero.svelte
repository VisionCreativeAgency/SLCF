<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronRight } from '@lucide/svelte';

	const breadcrumbs = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' }
	];

	// Element refs for entrance animation
	let breadcrumbEl: HTMLElement;
	let badgeEl: HTMLElement;
	let titleEl: HTMLElement;
	let descriptionEl: HTMLElement;

	onMount(() => {
		let cancelled = false;

		(async () => {
			// Dynamic import — gsap touches `window` at import time, breaks SSR
			// if imported statically at the top of the file.
			const gsapModule = await import('gsap');
			if (cancelled) return;
			const gsap = gsapModule.default;

			gsap.set([breadcrumbEl, badgeEl, titleEl, descriptionEl], { autoAlpha: 0, y: 16 });

			gsap
				.timeline({ defaults: { ease: 'power2.out' } })
				.to(breadcrumbEl, { autoAlpha: 1, y: 0, duration: 0.4 })
				.to(badgeEl, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.22')
				.to(titleEl, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.25')
				.to(descriptionEl, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.3');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section class="hero-spacing section-tint relative overflow-hidden">
	<!-- Soft brand-color glows — subtle depth, low opacity, no texture -->
	<div
		class="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-green/10 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
	></div>

	<div class="container-app relative">
		<!-- Breadcrumb -->
		<nav bind:this={breadcrumbEl} aria-label="Breadcrumb">
			<ol class="flex items-center gap-1.5 text-sm">
				{#each breadcrumbs as crumb, i (crumb.label)}
					<li class="flex items-center gap-1.5">
						{#if i === breadcrumbs.length - 1}
							<span class="font-inter rounded bg-surface px-1.5 py-0.5 font-medium text-ink sh-xs">
								{crumb.label}
							</span>
						{:else}
							<a
								href={crumb.href}
								class="font-inter text-ink-faint transition-colors hover:text-green"
							>
								{crumb.label}
							</a>
							<ChevronRight size={14} class="text-ink-faint" />
						{/if}
					</li>
				{/each}
			</ol>
		</nav>

		<!-- Content: centered, badge → title → description -->
		<div class="mx-auto mt-10 max-w-3xl text-center">
			<span
				bind:this={badgeEl}
				class="font-space-grotesk-section-label inline-flex items-center gap-2 rounded-full border border-green/20 bg-green-light px-4 py-1.5 text-green"
			>
				Our Story &amp; Mission
			</span>

			<h1 bind:this={titleEl} class="font-space-grotesk-title mt-5">
				About the Somaliland Chess Federation
			</h1>

			<p bind:this={descriptionEl} class="font-inter-body mx-auto mt-5 max-w-xl text-lg">
				Advancing chess excellence and community development across Somaliland
			</p>
		</div>
	</div>
</section>
