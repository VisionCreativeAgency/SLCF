<script lang="ts">
	import { authClient } from '$lib/client/auth-client';
	import { goto } from '$app/navigation';
	import PasswordInput from '$lib/components/admin/PasswordInput.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		const { error: signInError } = await authClient.signIn.email({
			email,
			password
		});

		loading = false;

		if (signInError) {
			error = signInError.message ?? 'Login failed';
			return;
		}

		goto('/admin');
	}
</script>

<div class="login-page">
	<form onsubmit={handleLogin}>
		<h1>SLCF Admin</h1>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<label>
			Email
			<input type="email" bind:value={email} required />
		</label>

		<label>
			Password
			<PasswordInput bind:value={password} required />
		</label>

		<button type="submit" disabled={loading}>
			{loading ? 'Signing in...' : 'Sign in'}
		</button>
	</form>
</div>

<style>
	.login-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 360px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
	}
	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 0.375rem;
	}
	button {
		padding: 0.5rem;
		border-radius: 0.375rem;
		background: #16a34a;
		color: white;
		cursor: pointer;
	}
	.error {
		color: #dc2626;
		font-size: 0.875rem;
	}
</style>
