<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Page Not Found — 404</title>
</svelte:head>

<section class="section-spacing">
	<div class="container-app not-found">
		<div class="not-found-inner">
			<span class="font-space-grotesk-section-label">Error {$page.status}</span>

			<h1 class="not-found-number">404</h1>

			<h2 class="font-space-grotesk-subtitle">This page took a wrong turn.</h2>

			<p class="font-inter-body not-found-desc">
				The page you're looking for doesn't exist, may have been moved, or the link you followed
				might be broken.
			</p>

			<div class="not-found-actions">
				<a href="/" class="btn-primary">Back to Home</a>
				<a href="/contact" class="btn-secondary">Contact Us</a>
			</div>

			<div class="not-found-strip" aria-hidden="true"></div>
		</div>
	</div>
</section>

<style>
	.not-found {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
	}

	.not-found-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 36rem;
		margin: 0 auto;
		gap: 0.75rem;
	}

	.not-found-number {
		font-family: var(--ff-space-grotesk);
		font-weight: 700;
		font-size: clamp(5rem, 14vw, 9rem);
		line-height: 1;
		letter-spacing: -0.03em;
		background: var(--grad-tricolor);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		color: transparent;
		margin: 0.25rem 0;
	}

	.not-found-desc {
		max-width: 28rem;
		margin: 0 auto;
	}

	.not-found-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.not-found-strip {
		width: 6rem;
		height: 4px;
		border-radius: var(--r-full);
		background: var(--grad-tricolor);
		margin-top: 2.5rem;
	}
</style>
