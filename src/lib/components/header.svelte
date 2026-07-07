<script lang="ts">
	import { onMount } from 'svelte';
	import { Menu, X } from '@lucide/svelte';

	const navData = [
		{ label: 'Home', link: '/' },
		{ label: 'About', link: '/about' },
		{ label: 'News', link: '/news' },
		{ label: 'Contact', link: '/contact' }
	];

	let isOpen = $state(false);

	// Element refs
	let mobileNavEl: HTMLElement;
	let navItemEls: HTMLElement[] = [];

	function setNavItemRef(node: HTMLElement, i: number) {
		navItemEls[i] = node;
		return {
			destroy() {
				navItemEls[i] = null as unknown as HTMLElement;
			}
		};
	}

	let gsap: typeof import('gsap').default;
	let tl: gsap.core.Timeline;
	let isReady = false;

	// --- Scroll lock (position:fixed technique) ---
	// Plain `overflow: hidden` on <body> doesn't reliably stop scroll-through
	// on iOS Safari. Pinning the body at its current scroll offset and
	// restoring it on close is the robust cross-browser approach.
	let lockedScrollY = 0;

	function lockScroll() {
		lockedScrollY = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${lockedScrollY}px`;
		document.body.style.left = '0';
		document.body.style.right = '0';
		document.body.style.width = '100%';
	}

	function unlockScroll() {
		document.body.style.position = '';
		document.body.style.top = '';
		document.body.style.left = '';
		document.body.style.right = '';
		document.body.style.width = '';
		window.scrollTo(0, lockedScrollY);
	}

	onMount(() => {
		let cancelled = false;
		let mql: MediaQueryList;
		let mqlHandler: (e: MediaQueryListEvent) => void;

		(async () => {
			// Dynamic import — gsap touches `window` at import time, breaks SSR
			// if imported statically at the top of the file.
			const gsapModule = await import('gsap');
			if (cancelled) return;

			gsap = gsapModule.default;

			// Start hidden: collapsed height + faded out.
			gsap.set(mobileNavEl, { height: 0, autoAlpha: 0, overflow: 'hidden' });
			gsap.set(navItemEls, { autoAlpha: 0, y: 10 });

			tl = gsap
				.timeline({ paused: true })
				.to(mobileNavEl, { height: 'auto', autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0)
				.to(
					navItemEls,
					{ autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
					0.12
				);

			isReady = true;
			if (isOpen) tl.progress(1);
		})();

		// Auto-close the mobile menu when the viewport crosses into desktop
		// size (md breakpoint = 768px), so it never gets stuck open behind
		// the now-hidden mobile toggle button when resizing/rotating.
		mql = window.matchMedia('(min-width: 768px)');
		mqlHandler = (e) => {
			if (e.matches && isOpen) {
				isOpen = false;
				unlockScroll();
				if (isReady) tl.progress(0).pause();
			}
		};
		mql.addEventListener('change', mqlHandler);

		return () => {
			cancelled = true;
			mql?.removeEventListener('change', mqlHandler);
			tl?.kill();
			if (isOpen) unlockScroll();
		};
	});

	function toggleMenu() {
		isOpen = !isOpen;

		if (isOpen) {
			lockScroll();
		} else {
			unlockScroll();
		}

		if (!isReady) return; // gsap still loading — state syncs itself once ready

		if (isOpen) {
			tl.timeScale(1).play();
		} else {
			tl.timeScale(1.4).reverse();
		}
	}

	function closeMenu() {
		if (!isOpen) return;
		isOpen = false;
		unlockScroll();
		if (isReady) tl.timeScale(1.4).reverse();
	}
</script>

<header class="fixed top-0 left-0 right-0 z-40 flex w-full flex-col">
	<div class="border-b border-b-black/10 bg-white">
		<div class="container-app flex items-center justify-between py-4">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				<div>
					<img src="/brand-assets/chessIcon.png" alt="brand-logo" class="w-[42px] md:w-[50px]" />
				</div>
				<div class="flex flex-col leading-tight">
					<span class="font-space-grotesk text-lg font-bold tracking-wide text-ink md:text-xl">
						SLCF
					</span>
					<span class="font-lora text-[11px] text-ink-muted md:text-[13px]">
						Somaliland Chess Federation
					</span>
				</div>
			</a>

			<!-- Desktop nav -->
			<div class="hidden items-center gap-8 md:flex">
				<nav>
					<ul class="flex gap-7">
						{#each navData as d, i (i)}
							<li>
								<a
									href={d.link}
									class="group relative py-1 text-[0.9375rem] font-medium tracking-[0.01em] text-ink transition-colors duration-200 hover:text-green"
								>
									{d.label}
									<span
										class="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-green transition-all duration-300 group-hover:w-full"
									></span>
								</a>
							</li>
						{/each}
					</ul>
				</nav>

				<a
					href="/contact#contact"
					class="rounded-md bg-green px-5 py-2.5 font-inter text-[0.9375rem] font-semibold text-white transition-colors duration-200 hover:bg-green-dark"
				>
					Join Federation
				</a>
			</div>

			<!-- Mobile toggle -->
			<button
				class="flex h-9 w-9 items-center justify-center text-ink md:hidden"
				onclick={toggleMenu}
				aria-label="Toggle menu"
				aria-expanded={isOpen}
			>
				{#if isOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile nav — animated open/close via GSAP height + fade -->
	<div bind:this={mobileNavEl} class="border-b border-b-black/10 bg-white md:hidden">
		<div class="container-app flex flex-col items-start gap-1 py-6">
			<nav class="w-full">
				<ul class="flex w-full flex-col gap-1">
					{#each navData as d, i (i)}
						<li use:setNavItemRef={i}>
							<a
								href={d.link}
								class="block rounded-lg px-3 py-3 font-space-grotesk text-lg font-semibold text-ink transition-colors duration-200 hover:bg-green-light hover:text-green"
								onclick={closeMenu}
							>
								{d.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<div use:setNavItemRef={navData.length} class="mt-3 w-full">
				<a
					href="/contact#contact"
					class="block w-full rounded-md bg-green py-3 text-center font-inter text-[0.9375rem] font-semibold text-white transition-colors duration-200 hover:bg-green-dark"
					onclick={closeMenu}
				>
					Join Federation
				</a>
			</div>
		</div>
	</div>
</header>

<!-- Spacer so fixed header doesn't overlap page content -->
<div class="h-[76px] md:h-[82px]"></div>
