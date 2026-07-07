<script lang="ts">
	type Partner = {
		name: string;
		logo: string;
	};

	const partners: Partner[] = [
		{ name: 'FIDE', logo: '/brand-assets/partners/download.jpeg' },
		{ name: 'African Chess Confederation', logo: '/brand-assets/partners/download (1).jpeg' },
		{ name: 'Arab Chess Federation', logo: '/brand-assets/partners/download (2).jpeg' },
		{ name: 'Telesom', logo: '/brand-assets/partners/download (3).jpeg' },
		{ name: 'Amal Bank', logo: '/brand-assets/partners/download (4).jpeg' },
		{ name: 'Somtel', logo: '/brand-assets/partners/download (5).png' }
	];

	// Duplicated once so the track can loop seamlessly at translateX(-50%) —
	// required by your .marquee-track keyframes in global.css.
	const loopedPartners = [...partners, ...partners];
</script>

<section class="section-tint py-10 md:py-14">
	<div class="container-app">
		<p class="font-inter-label mb-8 text-center text-ink-muted">Partners</p>

		<div class="marquee">
			<div class="marquee-track">
				{#each loopedPartners as partner, i (i)}
					<div
						class="card flex h-20 w-20 flex-shrink-0 items-center justify-center bg-surface p-2.5 grayscale transition-all duration-300 hover:grayscale-0 sm:h-24 sm:w-24 md:h-28 md:w-28 md:p-3"
					>
						<img
							src={partner.logo}
							alt={partner.name}
							class="h-full w-full object-contain"
							loading="lazy"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
