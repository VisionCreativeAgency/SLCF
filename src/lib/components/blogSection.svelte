<script lang="ts">
	type Post = {
		id: number;
		slug: string;
		title: string;
		excerpt: string | null;
		type: string;
		publishedAt: string | Date | null;
	};

	let { posts = [] }: { posts: Post[] } = $props();

	function formatDate(d: string | Date | null) {
		if (!d) return '';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

{#if posts.length > 0}
	<section class="section-spacing">
		<div class="container-app">
			<div class="mx-auto max-w-2xl text-center">
				<span class="font-space-grotesk-section-label text-red">Latest Insights</span>
				<h2 class="font-space-grotesk-title mt-2">From Our Blog</h2>
				<p class="font-inter-body mt-4">Chess tips, tournament updates, and community news</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-3">
				{#each posts.slice(0, 3) as post (post.id)}
					<a href={`/news/${post.slug}`} class="card-lift group flex flex-col p-6">
						<span class="badge r-full inline-flex w-fit bg-red text-white capitalize">
							{post.type}
						</span>

						<h3
							class="font-space-grotesk mt-4 text-lg leading-snug font-bold text-ink transition-colors group-hover:text-green"
						>
							{post.title}
						</h3>

						{#if post.excerpt}
							<p class="font-inter-body mt-2 line-clamp-2 text-sm">
								{post.excerpt}
							</p>
						{/if}

						<span class="font-inter-body mt-5 text-xs text-ink-faint">
							{formatDate(post.publishedAt)}
						</span>
					</a>
				{/each}
			</div>

			<div class="mt-12 flex justify-center md:mt-14">
				<a href="/news" class="btn-primary">View All Articles</a>
			</div>
		</div>
	</section>
{/if}
