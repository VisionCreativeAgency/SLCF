<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, Mail, Phone, Send } from '@lucide/svelte';

	let name = $state('');
	let email = $state('');
	let subject = $state('General Inquiry');
	let message = $state('');
	let isSubmitting = $state(false);

	const subjectOptions = [
		'General Inquiry',
		'Membership',
		'Partnership Opportunity',
		'Media & Press',
		'Other'
	];

	// Social icons — lucide has no brand/social marks, using inline SVG paths.
	const socials = [
		{
			label: 'Facebook',
			href: 'https://facebook.com',
			svg: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12'
		},
		{
			label: 'Twitter',
			href: 'https://twitter.com',
			svg: 'M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.16 4.9a4.28 4.28 0 0 0 1.32 5.71 4.25 4.25 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.58 8.58 0 0 1 2 19.54a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 22.46 6Z'
		},
		{
			label: 'Instagram',
			href: 'https://instagram.com',
			svg: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.97.04-1.5.2-1.85.34-.46.18-.79.4-1.14.75-.35.35-.57.68-.75 1.14-.14.35-.3.88-.34 1.85C3.83 9.01 3.8 9.33 3.8 12s.01 2.99.06 4.04c.04.97.2 1.5.34 1.85.18.46.4.79.75 1.14.35.35.68.57 1.14.75.35.14.88.3 1.85.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.97-.04 1.5-.2 1.85-.34.46-.18.79-.4 1.14-.75.35-.35.57-.68.75-1.14.14-.35.3-.88.34-1.85.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 0 0-.75-1.14 3.1 3.1 0 0 0-1.14-.75c-.35-.14-.88-.3-1.85-.34C14.99 3.81 14.67 3.8 12 3.8Zm0 3.05a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3Zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7Zm5.36-1.99a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z'
		},
		{
			label: 'YouTube',
			href: 'https://youtube.com',
			svg: 'M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z'
		}
	];

	const contactDetails = [
		{
			icon: MapPin,
			label: 'Address',
			value: 'Federation HQ, Hargeisa, Somaliland'
		},
		{
			icon: Mail,
			label: 'Email',
			value: 'info@slchess.so'
		},
		{
			icon: Phone,
			label: 'Phone',
			value: '+252 63 000 0000'
		}
	];

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		// Wire up your actual submit logic here (API call, form action, etc.)
		console.log({ name, email, subject, message });
		isSubmitting = false;
	}

	// Element refs for scroll-triggered entrance
	let sectionEl: HTMLElement;
	let formCardEl: HTMLElement;
	let infoCardEl: HTMLElement;

	onMount(() => {
		let cancelled = false;

		(async () => {
			const gsapModule = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			if (cancelled) return;

			const gsap = gsapModule.default;
			gsap.registerPlugin(ScrollTrigger);

			gsap.set(formCardEl, { autoAlpha: 0, y: 24 });
			gsap.set(infoCardEl, { autoAlpha: 0, y: 24 });

			gsap
				.timeline({
					defaults: { ease: 'power2.out' },
					scrollTrigger: {
						trigger: sectionEl,
						start: 'top 75%',
						once: true
					}
				})
				.to(formCardEl, { autoAlpha: 1, y: 0, duration: 0.5 })
				.to(infoCardEl, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.35');
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<section bind:this={sectionEl} class="section-spacing" id="contact">
	<div class="container-app grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
		<!-- Form card -->
		<div bind:this={formCardEl} class="card p-6 sh-md md:p-8">
			<h2 class="font-space-grotesk text-2xl font-bold text-ink">Send us a message</h2>
			<p class="font-inter-body mt-1.5">We typically reply within two business days.</p>

			<form class="mt-8 flex flex-col gap-5" onsubmit={handleSubmit}>
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label for="name" class="form-label">Name</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							placeholder="Your full name"
							required
							class="input"
						/>
					</div>
					<div>
						<label for="email" class="form-label">Email</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="you@example.com"
							required
							class="input"
						/>
					</div>
				</div>

				<div>
					<label for="subject" class="form-label">Subject</label>
					<select id="subject" bind:value={subject} class="input">
						{#each subjectOptions as option (option)}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="message" class="form-label">Message</label>
					<textarea
						id="message"
						bind:value={message}
						placeholder="How can we help?"
						required
						rows="6"
						class="input resize-none"></textarea>
				</div>

				<button type="submit" class="btn-primary mt-2 w-fit" disabled={isSubmitting}>
					{isSubmitting ? 'Sending…' : 'Send Message'}
					<Send size={17} />
				</button>
			</form>
		</div>

		<!-- Federation HQ card -->
		<div
			bind:this={infoCardEl}
			class="relative overflow-hidden rounded-lg border border-border-dark bg-surface-dark p-6 sh-lg md:p-8"
		>
			<!-- Decorative checkerboard corner accent -->
			<div
				class="pointer-events-none absolute -right-6 -bottom-6 h-40 w-40 opacity-40"
				style="
					background-image:
						linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
						linear-gradient(-45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.04) 75%),
						linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.04) 75%);
					background-size: 24px 24px;
					background-position: 0 0, 0 12px, 12px -12px, -12px 0px;
					mask-image: radial-gradient(circle at bottom right, black 40%, transparent 75%);
				"
			></div>

			<div class="relative">
				<h2 class="font-space-grotesk text-2xl font-bold text-white">Federation HQ</h2>
				<p class="font-inter-body mt-1.5 text-white/60">
					Reach us directly through any channel below.
				</p>

				<ul class="mt-8 flex flex-col gap-5">
					{#each contactDetails as detail (detail.label)}
						<li class="flex items-start gap-3.5">
							<span
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5"
							>
								<svelte:component this={detail.icon} size={18} class="text-gold" />
							</span>
							<div>
								<p class="font-inter-label text-white/40">{detail.label}</p>
								<p class="font-inter mt-0.5 text-[0.9375rem] font-medium text-white">
									{detail.value}
								</p>
							</div>
						</li>
					{/each}
				</ul>

				<div class="mt-8 border-t border-white/10 pt-6">
					<p class="font-inter-label text-white/40">Follow</p>
					<div class="mt-3 flex items-center gap-3">
						{#each socials as social (social.label)}
							<a
								href={social.href}
								aria-label={social.label}
								target="_blank"
								rel="noopener noreferrer"
								class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
							>
								<svg
									width="16"
									height="16"
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
			</div>
		</div>
	</div>
</section>
