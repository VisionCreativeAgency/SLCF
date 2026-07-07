<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const c = data.club;

	let name = $state(c.name);
	let slug = $state(c.slug);
	let description = $state(c.description ?? '');
	let logo = $state(c.logo ?? '');
	let location = $state(c.location ?? '');
	let contactEmail = $state(c.contactEmail ?? '');
	let contactPhone = $state(c.contactPhone ?? '');
	let submitting = $state(false);

	let isValid = $derived(name.trim().length > 0);
</script>

<h1>Edit Club</h1>

{#if form?.error}<p class="error">{form.error}</p>{/if}

<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			submitting = false;
			await update();
		};
	}}
>
	<label>
		Name <span class="required">*</span>
		<input name="name" bind:value={name} required />
	</label>

	<label>
		Slug
		<input name="slug" bind:value={slug} required />
	</label>

	<label>
		Description
		<textarea name="description" bind:value={description} rows="3"></textarea>
	</label>

	<label>
		Location
		<input name="location" bind:value={location} />
	</label>

	<label>
		Contact Email
		<input type="email" name="contactEmail" bind:value={contactEmail} />
	</label>

	<label>
		Contact Phone
		<input name="contactPhone" bind:value={contactPhone} />
	</label>

	<div class="image-section">
		<ImageUploader bind:value={logo} label="Club Logo" />
		<input type="hidden" name="logo" value={logo} />
	</div>

	<button type="submit" disabled={!isValid || submitting}>
		{submitting ? 'Saving...' : 'Save Changes'}
	</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 600px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.required {
		color: #dc2626;
	}
	input,
	textarea {
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.375rem;
		font-weight: normal;
		font-size: 0.9rem;
	}
	.image-section {
		padding: 1rem;
		background: #f8fafc;
		border-radius: 0.5rem;
		border: 1px dashed #cbd5e1;
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
</style>
