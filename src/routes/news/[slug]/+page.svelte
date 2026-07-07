<script lang="ts">
	import { ArrowLeft, Calendar, Tag } from '@lucide/svelte';
	import FlagPlaceholder from '$lib/components/FlagPlaceholder.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const post = $derived(data.post);

	function formatDate(d: string | Date | null) {
		if (!d) return '';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{post.title} — SLCF News</title>
	{#if post.excerpt}
		<meta name="description" content={post.excerpt} />
	{/if}

	<meta property="og:title" content="{post.title} — SLCF News" />
	{#if post.excerpt}
		<meta property="og:description" content={post.excerpt} />
	{/if}
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://somalilandchessfederation.com/news/{post.slug}" />
	{#if post.coverImage}
		<meta property="og:image" content={post.coverImage} />
	{:else}
		<meta property="og:image" content="/seo/og-image.jpg" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{post.title} — SLCF News" />
	{#if post.excerpt}
		<meta name="twitter:description" content={post.excerpt} />
	{/if}
</svelte:head>

<article>
	<!-- Cover image / hero -->
	<div class="bg-checker relative h-[45vh] min-h-[320px] w-full overflow-hidden sm:h-[55vh]">
		{#if post.coverImage}
			<img src={post.coverImage} alt={post.title} class="h-full w-full object-cover" />
		{:else}
			<FlagPlaceholder>
				<span class="font-space-grotesk text-2xl font-bold">SLCF</span>
			</FlagPlaceholder>
		{/if}
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

		<div class="container-app absolute inset-x-0 bottom-0 pb-8 sm:pb-12">
			<span class="badge r-full inline-flex items-center gap-1.5 bg-green text-white">
				<Tag size={12} />
				{post.category}
			</span>

			<h1
				class="font-space-grotesk mt-4 max-w-3xl text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl"
			>
				{post.title}
			</h1>

			<div class="font-inter mt-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
				<span>SLCF Media</span>
				<span>·</span>
				<div class="flex items-center gap-1.5">
					<Calendar size={14} />
					<span>{formatDate(post.publishedAt)}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Body -->
	<div class="section-spacing">
		<div class="container-app">
			<div class="mx-auto max-w-3xl">
				<a
					href="/news"
					class="font-inter mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-green-dark"
				>
					<ArrowLeft size={16} />
					Back to News
				</a>

				{#if post.excerpt}
					<p
						class="font-space-grotesk-subtitle !text-xl leading-relaxed !text-ink-muted sm:!text-2xl"
					>
						{post.excerpt}
					</p>
				{/if}

				<div class="prose-content font-inter-body mt-8 max-w-none">
					{#each post.content.split('\n\n') as paragraph, i (i)}
						{#if paragraph.trim()}
							<p class="mb-5 leading-relaxed">{paragraph}</p>
						{/if}
					{/each}
				</div>

				<div class="mt-12 border-t border-border-light pt-8">
					<a
						href="/news"
						class="font-inter inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-green-dark"
					>
						<ArrowLeft size={16} />
						Back to all articles
					</a>
				</div>
			</div>
		</div>
	</div>
</article>

<style>
	.prose-content :global(p) {
		color: inherit;
	}
</style>
