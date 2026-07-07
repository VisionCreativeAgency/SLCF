<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let name = $state('');
	let role = $state('');
	let email = $state('');
	let phone = $state('');
	let photo = $state('');
	let bio = $state('');
	let order = $state('0');
	let termStart = $state('');
	let termEnd = $state('');
	let isCurrent = $state(true);
	let submitting = $state(false);

	let isValid = $derived(name.trim().length > 0 && role.trim().length > 0);
</script>

<h1>New Leadership Member</h1>

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
		Role <span class="required">*</span>
		<input
			name="role"
			bind:value={role}
			placeholder="e.g. President, Secretary, Treasurer"
			required
		/>
	</label>

	<label>
		Email <span class="optional">(optional — update this if their contact changes)</span>
		<input type="email" name="email" bind:value={email} />
	</label>

	<label>
		Phone <span class="optional">(optional)</span>
		<input name="phone" bind:value={phone} />
	</label>

	<label>
		Bio <span class="optional">(optional)</span>
		<textarea name="bio" bind:value={bio} rows="3"></textarea>
	</label>

	<label>
		Display Order <span class="optional">(lower numbers show first, e.g. President = 0)</span>
		<input type="number" name="order" bind:value={order} />
	</label>

	<div class="image-section">
		<ImageUploader bind:value={photo} label="Photo (optional)" />
		<input type="hidden" name="photo" value={photo} />
	</div>

	<label>
		Term Start <span class="optional">(optional)</span>
		<input type="date" name="termStart" bind:value={termStart} />
	</label>

	<label>
		Term End <span class="optional">(leave blank if currently serving)</span>
		<input type="date" name="termEnd" bind:value={termEnd} />
	</label>

	<label class="checkbox">
		<input type="checkbox" name="isCurrent" bind:checked={isCurrent} />
		Currently Serving
	</label>

	<button type="submit" disabled={!isValid || submitting}>
		{submitting ? 'Saving...' : isValid ? 'Create Member' : 'Fill required fields (*)'}
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
	.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
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
