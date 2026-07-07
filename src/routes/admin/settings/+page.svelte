<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const s = data.settings;

	let email = $state(s.email ?? '');
	let phone = $state(s.phone ?? '');
	let address = $state(s.address ?? '');
	let city = $state(s.city ?? '');
	let facebook = $state(s.facebook ?? '');
	let twitter = $state(s.twitter ?? '');
	let instagram = $state(s.instagram ?? '');
	let youtube = $state(s.youtube ?? '');
	let submitting = $state(false);
	let saved = $state(false);
</script>

<h1>Federation Settings</h1>
<p class="subtitle">Contact info and social links shown across the SLCF website.</p>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if saved}<p class="success">Settings saved.</p>{/if}

<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		saved = false;
		return async ({ update }) => {
			submitting = false;
			saved = true;
			await update();
		};
	}}
>
	<input type="hidden" name="id" value={s.id} />

	<h2>Contact</h2>

	<label>
		Email
		<input type="email" name="email" bind:value={email} placeholder="info@slcf.so" />
	</label>

	<label>
		Phone
		<input name="phone" bind:value={phone} placeholder="+252..." />
	</label>

	<label>
		Address
		<input name="address" bind:value={address} placeholder="Street / area" />
	</label>

	<label>
		City
		<input name="city" bind:value={city} placeholder="Hargeisa" />
	</label>

	<h2>Social Media</h2>

	<label>
		Facebook
		<input name="facebook" bind:value={facebook} placeholder="https://facebook.com/..." />
	</label>

	<label>
		Twitter / X
		<input name="twitter" bind:value={twitter} placeholder="https://x.com/..." />
	</label>

	<label>
		Instagram
		<input name="instagram" bind:value={instagram} placeholder="https://instagram.com/..." />
	</label>

	<label>
		YouTube
		<input name="youtube" bind:value={youtube} placeholder="https://youtube.com/..." />
	</label>

	<button type="submit" disabled={submitting}>
		{submitting ? 'Saving...' : 'Save Settings'}
	</button>
</form>

<style>
	.subtitle {
		color: #64748b;
		font-size: 0.9rem;
		margin-top: -0.5rem;
		margin-bottom: 1.5rem;
	}
	h2 {
		font-size: 0.95rem;
		color: #475569;
		margin: 1.5rem 0 0.5rem;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 500px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
	}
	input {
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.375rem;
		font-weight: normal;
		font-size: 0.9rem;
	}
	button {
		padding: 0.6rem 1.2rem;
		background: #16a34a;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		align-self: flex-start;
		font-weight: 600;
		margin-top: 0.5rem;
	}
	button:disabled {
		background: #cbd5e1;
		cursor: not-allowed;
	}
	.error {
		color: #dc2626;
		background: #fef2f2;
		padding: 0.75rem;
		border-radius: 0.375rem;
	}
	.success {
		color: #16a34a;
		background: #f0fdf4;
		padding: 0.75rem;
		border-radius: 0.375rem;
	}
</style>
