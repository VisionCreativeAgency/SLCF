<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import FlagPlaceholder from '$lib/components/FlagPlaceholder.svelte';

	let { data }: { data: { posts: any[] } } = $props();

	const categories = [
		'All',
		'Tournament Results',
		'Federation News',
		'Player Spotlight',
		'Youth & Education'
	];

	const ITEMS_PER_PAGE = 9;

	let searchQuery = $state('');
	let activeCategory = $state('All');
	let currentPage = $state(1);

	const featuredPost = $derived(data.posts.find((p) => p.featured) ?? data.posts[0] ?? null);

	const filteredPosts = $derived(
		data.posts
			.filter((p) => !featuredPost || p.id !== featuredPost.id || searchQuery)
			.filter((p) => activeCategory === 'All' || p.category === activeCategory)
			.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const totalPages = $derived(Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)));

	const paginatedPosts = $derived(
		filteredPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
	);

	// reset to page 1 whenever filters change
	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		activeCategory;
		searchQuery;
		currentPage = 1;
	});

	function formatDate(d: string | Date | null) {
		if (!d) return '';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'numeric',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function goToPage(page: number) {
		currentPage = Math.min(Math.max(1, page), totalPages);
		document
			.getElementById('news-grid-top')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	let sectionEl: HTMLElement;
	let searchEl: HTMLElement = $state()!;
	let featuredEl: HTMLElement = $state()!;

	onMount(() => {
		let cancelled = false;

		(async () => {
			const gsapModule = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			if (cancelled) return;

			const gsap = gsapModule.default;
			gsap.registerPlugin(ScrollTrigger);

			gsap.set([searchEl, featuredEl].filter(Boolean), { autoAlpha: 0, y: 20 });

			gsap
				.timeline({
					defaults: { ease: 'power2.out' },
					scrollTrigger: { trigger: sectionEl, start: 'top 80%', once: true }
				})
				.to(searchEl, { autoAlpha: 1, y: 0, duration: 0.4 })
				.to(featuredEl, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section bind:this={sectionEl} class="section-tint section-spacing">
	<div class="container-app">
		<div bind:this={searchEl} class="relative max-w-md">
			<Search size={18} class="absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search articles..."
				class="input pl-11"
			/>
		</div>

		{#if featuredPost && !searchQuery}
			<a
				bind:this={featuredEl}
				href={`/news/${featuredPost.slug}`}
				class="card mt-8 grid grid-cols-1 overflow-hidden md:mt-10 md:grid-cols-2"
			>
				<div class="bg-checker aspect-video md:aspect-auto">
					{#if featuredPost.coverImage}
						<img
							src={featuredPost.coverImage}
							alt={featuredPost.title}
							class="h-full w-full object-cover"
							loading="lazy"
						/>
					{:else}
						<FlagPlaceholder>
							<span class="text-sm font-semibold">SLCF</span>
						</FlagPlaceholder>
					{/if}
				</div>

				<div class="flex flex-col justify-center p-6 md:p-10">
					<span class="font-space-grotesk-section-label text-green">Featured Article</span>
					<p class="font-inter-label mt-2 text-ink-faint normal-case">{featuredPost.category}</p>

					<h2 class="font-space-grotesk mt-3 text-2xl font-bold text-ink md:text-3xl">
						{featuredPost.title}
					</h2>

					{#if featuredPost.excerpt}
						<p class="font-inter-body mt-3">{featuredPost.excerpt}</p>
					{/if}

					<div class="font-inter mt-5 flex items-center gap-3 text-sm text-ink-faint">
						<span>SLCF Media</span>
						<span>·</span>
						<span>{formatDate(featuredPost.publishedAt)}</span>
					</div>

					<span class="font-inter mt-5 font-semibold text-green">Read More →</span>
				</div>
			</a>
		{/if}
	</div>
</section>

<section class="section-spacing pt-0">
	<div id="news-grid-top" class="container-app">
		{#if data.posts.length === 0}
			<div class="py-16 text-center">
				<p class="font-space-grotesk text-xl font-bold text-ink">No news yet</p>
				<p class="font-inter-body mt-2">Check back soon for federation updates and articles.</p>
			</div>
		{:else}
			<div class="flex flex-wrap gap-2.5">
				{#each categories as category (category)}
					<button
						type="button"
						onclick={() => (activeCategory = category)}
						class={`r-full font-inter px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
							activeCategory === category
								? 'bg-green text-white'
								: 'bg-surface-tint text-ink hover:bg-green-light hover:text-green'
						}`}
					>
						{category}
					</button>
				{/each}
			</div>

			{#if paginatedPosts.length > 0}
				<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each paginatedPosts as post (post.id)}
						<a href={`/news/${post.slug}`} class="card-lift flex flex-col overflow-hidden">
							<div class="bg-checker aspect-video">
								{#if post.coverImage}
									<img
										src={post.coverImage}
										alt={post.title}
										class="h-full w-full object-cover"
										loading="lazy"
									/>
								{:else}
									<FlagPlaceholder>
										<span class="text-xs font-semibold">SLCF</span>
									</FlagPlaceholder>
								{/if}
							</div>

							<div class="flex flex-1 flex-col p-5">
								<span class="font-inter-label text-green normal-case">{post.category}</span>

								<h3 class="font-space-grotesk mt-2 text-lg font-bold text-ink">
									{post.title}
								</h3>

								{#if post.excerpt}
									<p class="font-inter-body mt-2 line-clamp-2 text-sm">{post.excerpt}</p>
								{/if}

								<div class="font-inter mt-4 flex items-center gap-2 text-xs text-ink-faint">
									<span>{formatDate(post.publishedAt)}</span>
								</div>
							</div>
						</a>
					{/each}
				</div>

				{#if totalPages > 1}
					<div class="mt-10 flex items-center justify-center gap-2">
						<button
							type="button"
							aria-label="Previous page"
							disabled={currentPage === 1}
							onclick={() => goToPage(currentPage - 1)}
							class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-surface text-ink transition-colors hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
						>
							<ChevronLeft size={16} />
						</button>

						{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page, i (i)}
							<button
								type="button"
								onclick={() => goToPage(page)}
								class={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
									page === currentPage
										? 'bg-green text-white'
										: 'bg-surface-tint text-ink hover:bg-green-light hover:text-green'
								}`}
							>
								{page}
							</button>
						{/each}

						<button
							type="button"
							aria-label="Next page"
							disabled={currentPage === totalPages}
							onclick={() => goToPage(currentPage + 1)}
							class="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-surface text-ink transition-colors hover:border-green hover:text-green disabled:pointer-events-none disabled:opacity-30"
						>
							<ChevronRight size={16} />
						</button>
					</div>
				{/if}
			{:else}
				<p class="font-inter-body mt-10 text-center">No articles found.</p>
			{/if}
		{/if}
	</div>
</section>
