<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronRight } from '@lucide/svelte';

	const breadcrumbs = [
		{ label: 'Home', href: '/' },
		{ label: 'News', href: '/news' }
	];

	// Element refs for entrance animation
	let breadcrumbEl: HTMLElement;
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

			gsap.set([breadcrumbEl, titleEl, descriptionEl], { autoAlpha: 0, y: 16 });

			gsap
				.timeline({ defaults: { ease: 'power2.out' } })
				.to(breadcrumbEl, { autoAlpha: 1, y: 0, duration: 0.4 })
				.to(titleEl, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.25')
				.to(descriptionEl, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.3');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section class="section-dark py-14 md:py-20">
	<div class="container-app">
		<!-- Breadcrumb -->
		<nav bind:this={breadcrumbEl} aria-label="Breadcrumb">
			<ol class="flex items-center gap-1.5 text-sm">
				{#each breadcrumbs as crumb, i (crumb.label)}
					<li class="flex items-center gap-1.5">
						{#if i === breadcrumbs.length - 1}
							<span class="font-inter font-medium text-white">
								{crumb.label}
							</span>
						{:else}
							<a
								href={crumb.href}
								class="font-inter text-white/50 transition-colors hover:text-green"
							>
								{crumb.label}
							</a>
							<ChevronRight size={14} class="text-white/40" />
						{/if}
					</li>
				{/each}
			</ol>
		</nav>

		<!-- Title -->
		<h1 bind:this={titleEl} class="font-space-grotesk-title mt-6 max-w-2xl text-white">
			News &amp; Updates
		</h1>

		<!-- Description -->
		<p bind:this={descriptionEl} class="font-inter-body mt-4 max-w-2xl text-white/60">
			Tournament results, federation announcements, and chess stories from across Somaliland.
		</p>
	</div>
</section>

<!-- Tricolor divider at the bottom edge -->
<div class="tricolor-line"></div>
