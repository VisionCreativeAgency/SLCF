<script lang="ts">
	import { page } from '$app/state';

	const settings = $derived(page.data.settings);

	import { MapPin, Mail, Phone } from '@lucide/svelte';

	const quickLinks = [
		{ label: 'About Us', href: '/about' },
		{ label: 'News & Updates', href: '/news' },
		{ label: 'Contact', href: '/contact' },
		{ label: 'Leadership', href: '/about#leadership' }
	];

	const getInvolved = [
		{ label: 'Join Federation', href: '/contact#contact' },
		{ label: 'Find a Club', href: '/contact#contact' },
		{ label: 'Tournament Registration', href: '/#tournaments' },
		{ label: 'Become a Coach', href: '/contact#contact' }
	];

	// Lucide has no brand/social icons — using inline SVG paths instead.
	const socials = [
		{
			label: 'Facebook',
			href: settings.facebook,
			svg: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12'
		},
		{
			label: 'Twitter',
			href: settings.twitter,
			svg: 'M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.16 4.9a4.28 4.28 0 0 0 1.32 5.71 4.25 4.25 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.58 8.58 0 0 1 2 19.54a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 22.46 6Z'
		},
		{
			label: 'Instagram',
			href: settings.instagram,
			svg: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.97.04-1.5.2-1.85.34-.46.18-.79.4-1.14.75-.35.35-.57.68-.75 1.14-.14.35-.3.88-.34 1.85C3.83 9.01 3.8 9.33 3.8 12s.01 2.99.06 4.04c.04.97.2 1.5.34 1.85.18.46.4.79.75 1.14.35.35.68.57 1.14.75.35.14.88.3 1.85.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.97-.04 1.5-.2 1.85-.34.46-.18.79-.4 1.14-.75.35-.35.57-.68.75-1.14.14-.35.3-.88.34-1.85.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 0 0-.75-1.14 3.1 3.1 0 0 0-1.14-.75c-.35-.14-.88-.3-1.85-.34C14.99 3.81 14.67 3.8 12 3.8Zm0 3.05a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3Zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7Zm5.36-1.99a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z'
		},
		{
			label: 'Youtube',
			href: settings.youtube,
			svg: 'M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z'
		}
	];

	const currentYear = new Date().getFullYear();
</script>

<footer class="footer-top-border section-dark">
	<div class="container-app pt-14 pb-8">
		<!-- Top grid -->
		<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
			<!-- Brand column -->
			<div>
				<div class="flex items-center gap-1.5">
					<img src="/brand-assets/chessIcon.png" alt="SLCF logo" class="w-9 rounded" />
					<div class="flex flex-col leading-tight">
						<span class="font-space-grotesk text-lg font-bold text-white">SLCF</span>
						<span class="font-lora text-[11px] text-white/60">Somaliland Chess Federation</span>
					</div>
				</div>
				<p class="font-inter-body mt-4 text-sm text-white/60">
					Growing the game of chess across Somaliland. From Hargeisa to Borama, building a community
					of players, coaches, and enthusiasts.
				</p>

				<div class="mt-5 flex items-center gap-4">
					{#each socials as social (social.label)}
						<a
							href={social.href}
							aria-label={social.label}
							target="_blank"
							rel="noopener noreferrer"
							class="text-white/60 transition-colors hover:text-green"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d={social.svg} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="font-space-grotesk text-base font-bold text-white">Quick Links</h3>
				<ul class="mt-4 flex flex-col gap-3">
					{#each quickLinks as link (link.label)}
						<li>
							<a
								href={link.href}
								class="font-inter-body text-sm text-white/60 transition-colors hover:text-green"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Get Involved -->
			<div>
				<h3 class="font-space-grotesk text-base font-bold text-white">Get Involved</h3>
				<ul class="mt-4 flex flex-col gap-3">
					{#each getInvolved as link (link.label)}
						<li>
							<a
								href={link.href}
								class="font-inter-body text-sm text-white/60 transition-colors hover:text-green"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h3 class="font-space-grotesk text-base font-bold text-white">Contact Us</h3>
				<ul class="mt-4 flex flex-col gap-3">
					<li class="flex items-start gap-2.5">
						<MapPin size={17} class="mt-0.5 flex-shrink-0 text-gold" />
						<span class="font-inter-body text-sm text-white/60">{settings.address}</span>
					</li>
					<li class="flex items-start gap-2.5">
						<Mail size={17} class="mt-0.5 flex-shrink-0 text-gold" />
						<a
							href="mailto:info@slcf.so"
							class="font-inter-body text-sm text-white/60 transition-colors hover:text-green"
						>
							{settings.email}
						</a>
					</li>
					<li class="flex items-start gap-2.5">
						<Phone size={17} class="mt-0.5 flex-shrink-0 text-gold" />

						<a
							href="tel:+2522XXXXXXX"
							class="font-inter-body text-sm text-white/60 transition-colors hover:text-green"
						>
							{settings.phone}
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom bar -->
		<div
			class="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between"
		>
			<p class="font-inter-body text-xs text-white/40">
				© {currentYear} Somaliland Chess Federation. All rights reserved.
			</p>
			<div class="flex items-center gap-6">
				<a
					href="/"
					class="font-inter-body text-xs text-white/50 transition-colors hover:text-green"
				>
					Privacy Policy
				</a>

				<a
					href="/"
					class="font-inter-body text-xs text-white/50 transition-colors hover:text-green"
				>
					Terms of Service
				</a>
			</div>
		</div>
	</div>
</footer>
