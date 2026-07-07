<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/client/auth-client';
	import { goto } from '$app/navigation';

	let { data, children } = $props();

	const user = data.user;
	const isSuperAdmin = user.role === 'super_admin';

	const allLinks = [
		{ href: '/admin', label: 'Dashboard', section: null },
		{ href: '/admin/posts', label: 'Posts', section: 'posts' },
		{ href: '/admin/tournaments', label: 'Tournaments', section: 'tournaments' },
		{ href: '/admin/players', label: 'Players', section: 'players' },
		{ href: '/admin/clubs', label: 'Clubs', section: 'clubs' },
		{ href: '/admin/leadership', label: 'Leadership', section: 'leadership' },
		{ href: '/admin/settings', label: 'Settings', section: 'settings' }
	];

	const permissions: string[] = data.permissions ?? [];

	const links = allLinks.filter(
		(link) => !link.section || isSuperAdmin || permissions.includes(link.section)
	);

	let mobileMenuOpen = $state(false);

	async function handleLogout() {
		await authClient.signOut();
		goto('/login');
	}

	function isActive(href: string) {
		return href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href);
	}
</script>

<div class="admin-shell">
	<!-- Desktop sidebar -->
	<aside class="sidebar">
		<div class="sidebar-header">
			<span class="logo">SLCF Admin</span>
		</div>

		<nav>
			{#each links as link, i (i)}
				<a href={link.href} class:active={isActive(link.href)}>{link.label}</a>
			{/each}
			{#if isSuperAdmin}
				<a href="/admin/users" class:active={isActive('/admin/users')}>Users</a>
			{/if}
		</nav>

		<div class="sidebar-footer">
			<span class="user-name">{user.name}</span>
			<span class="user-role">{user.role}</span>
			<button onclick={handleLogout}>Logout</button>
		</div>
	</aside>

	<!-- Mobile top bar -->
	<header class="mobile-topbar">
		<span class="logo">SLCF Admin</span>
		<button
			class="menu-toggle"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label="Menu"
		>
			{#if mobileMenuOpen}
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
				>
			{:else}
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line
						x1="3"
						y1="18"
						x2="21"
						y2="18"
					/></svg
				>
			{/if}
		</button>
	</header>

	<!-- Mobile dropdown menu -->
	{#if mobileMenuOpen}
		<div class="mobile-menu">
			<nav>
				{#each links as link, i (i)}
					<a
						href={link.href}
						class:active={isActive(link.href)}
						onclick={() => (mobileMenuOpen = false)}>{link.label}</a
					>
				{/each}
				{#if isSuperAdmin}
					<a
						href="/admin/users"
						class:active={isActive('/admin/users')}
						onclick={() => (mobileMenuOpen = false)}>Users</a
					>
				{/if}
			</nav>
			<div class="mobile-user">
				<div>
					<span class="user-name">{user.name}</span>
					<span class="user-role">{user.role}</span>
				</div>
				<button onclick={handleLogout}>Logout</button>
			</div>
		</div>
	{/if}

	<!-- Mobile bottom tab bar (quick access, always visible) -->
	<nav class="mobile-tabbar">
		{#each links.slice(0, 5) as link, i (i)}
			<a href={link.href} class:active={isActive(link.href)}>
				<span class="tab-label">{link.label}</span>
			</a>
		{/each}
	</nav>

	<main class="admin-content">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
	}

	/* ── Desktop sidebar ── */
	.sidebar {
		width: 220px;
		background: #0f172a;
		color: white;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		flex-shrink: 0;
	}
	.sidebar-header {
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		margin-bottom: 1rem;
	}
	.logo {
		font-weight: 600;
		font-size: 1.1rem;
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}
	nav a {
		padding: 0.6rem 0.75rem;
		border-radius: 0.375rem;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		font-size: 0.9rem;
	}
	nav a:hover {
		background: rgba(255, 255, 255, 0.05);
	}
	nav a.active {
		background: #16a34a;
		color: white;
	}
	.sidebar-footer {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8rem;
	}
	.user-name {
		font-weight: 600;
		display: block;
	}
	.user-role {
		color: rgba(255, 255, 255, 0.5);
		text-transform: capitalize;
		display: block;
	}
	.sidebar-footer button {
		margin-top: 0.5rem;
		padding: 0.4rem;
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
	}

	/* ── Mobile top bar (hidden on desktop) ── */
	.mobile-topbar {
		display: none;
	}
	.mobile-menu {
		display: none;
	}
	.mobile-tabbar {
		display: none;
	}

	.admin-content {
		flex: 1;
		padding: 2rem;
		background: #f8fafc;
		min-width: 0;
	}

	/* ── Responsive breakpoint ── */
	@media (max-width: 768px) {
		.admin-shell {
			flex-direction: column;
		}
		.sidebar {
			display: none;
		}
		.mobile-topbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #0f172a;
			color: white;
			padding: 0.85rem 1rem;
			position: sticky;
			top: 0;
			z-index: 40;
		}
		.menu-toggle {
			background: none;
			border: none;
			color: white;
			display: flex;
			align-items: center;
			cursor: pointer;
		}
		.mobile-menu {
			display: block;
			background: #0f172a;
			color: white;
			padding: 1rem;
			position: sticky;
			top: 53px;
			z-index: 39;
		}
		.mobile-menu nav {
			flex-direction: column;
			gap: 0.25rem;
		}
		.mobile-menu nav a {
			padding: 0.65rem 0.75rem;
			border-radius: 0.375rem;
			color: rgba(255, 255, 255, 0.85);
			text-decoration: none;
			font-size: 0.95rem;
		}
		.mobile-menu nav a.active {
			background: #16a34a;
			color: white;
		}
		.mobile-user {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top: 1px solid rgba(255, 255, 255, 0.1);
			margin-top: 0.75rem;
			padding-top: 0.75rem;
		}
		.mobile-user button {
			padding: 0.4rem 0.75rem;
			background: rgba(255, 255, 255, 0.1);
			color: white;
			border: none;
			border-radius: 0.375rem;
			cursor: pointer;
			font-size: 0.85rem;
		}

		/* Bottom tab bar for quick nav on mobile */
		.mobile-tabbar {
			display: flex;
			justify-content: space-around;
			background: white;
			border-top: 1px solid #e2e8f0;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 40;
			padding: 0.5rem 0;
		}
		.mobile-tabbar a {
			flex: 1;
			text-align: center;
			color: #64748b;
			text-decoration: none;
			font-size: 0.7rem;
			padding: 0.25rem;
		}
		.mobile-tabbar a.active {
			color: white;
			font-weight: 600;
		}

		.admin-content {
			padding: 1rem;
			padding-bottom: 4.5rem; /* space for fixed tab bar */
		}
	}
</style>
