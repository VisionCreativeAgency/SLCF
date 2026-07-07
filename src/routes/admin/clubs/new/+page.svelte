<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let name = $state('');
	let slug = $state('');
	let description = $state('');
	let logo = $state('');
	let location = $state('');
	let contactEmail = $state('');
	let contactPhone = $state('');
	let submitting = $state(false);

	let isValid = $derived(name.trim().length > 0);
</script>

<h1>New Club</h1>

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
		Slug <span class="optional">(auto-generated if blank)</span>
		<input name="slug" bind:value={slug} />
	</label>

	<label>
		Description <span class="optional">(optional)</span>
		<textarea name="description" bind:value={description} rows="3"></textarea>
	</label>

	<label>
		Location <span class="optional">(optional)</span>
		<input name="location" bind:value={location} placeholder="e.g. Hargeisa" />
	</label>

	<label>
		Contact Email <span class="optional">(optional)</span>
		<input type="email" name="contactEmail" bind:value={contactEmail} />
	</label>

	<label>
		Contact Phone <span class="optional">(optional)</span>
		<input name="contactPhone" bind:value={contactPhone} />
	</label>

	<div class="image-section">
		<ImageUploader bind:value={logo} label="Club Logo (optional)" />
		<input type="hidden" name="logo" value={logo} />
	</div>

	<button type="submit" disabled={!isValid || submitting}>
		{submitting ? 'Saving...' : isValid ? 'Create Club' : 'Fill required fields (*)'}
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
	.optional {
		color: #94a3b8;
		font-weight: normal;
		font-size: 0.8rem;
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
