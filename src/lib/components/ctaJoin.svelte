<script lang="ts">
	let {
		title = 'Become Part of Somaliland Chess',
		subtitle = 'Join our growing community of players, coaches, and enthusiasts',
		buttonLabel = 'Join the Federation',
		buttonHref = '/contact#contact'
	}: {
		title?: string;
		subtitle?: string;
		buttonLabel?: string;
		buttonHref?: string;
	} = $props();
</script>

<section class="section-cta section-spacing">
	<div class="container-app flex flex-col items-center text-center">
		<h2 class="font-space-grotesk-title text-white">{title}</h2>
		<p class="font-inter-body mt-4 max-w-xl text-white/70">
			{subtitle}
		</p>
		<a href={buttonHref} class="btn-primary mt-8">{buttonLabel}</a>
	</div>
</section>

<!-- Tricolor divider between CTA and footer -->
<div class="tricolor-line"></div>
