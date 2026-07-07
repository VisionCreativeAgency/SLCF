<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const m = data.member;

	function toDateInput(d: string | Date | null) {
		if (!d) return '';
		return new Date(d).toISOString().split('T')[0];
	}

	let name = $state(m.name);
	let role = $state(m.role);
	let email = $state(m.email ?? '');
	let phone = $state(m.phone ?? '');
	let photo = $state(m.photo ?? '');
	let bio = $state(m.bio ?? '');
	let order = $state(String(m.order));
	let termStart = $state(toDateInput(m.termStart));
	let termEnd = $state(toDateInput(m.termEnd));
	let isCurrent = $state(m.isCurrent);
	let submitting = $state(false);

	let isValid = $derived(name.trim().length > 0 && role.trim().length > 0);
</script>

<h1>Edit Leadership Member</h1>

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
		<input name="role" bind:value={role} required />
	</label>

	<label>
		Email <span class="optional">(update here if their contact changes)</span>
		<input type="email" name="email" bind:value={email} />
	</label>

	<label>
		Phone
		<input name="phone" bind:value={phone} />
	</label>

	<label>
		Bio
		<textarea name="bio" bind:value={bio} rows="3"></textarea>
	</label>

	<label>
		Display Order
		<input type="number" name="order" bind:value={order} />
	</label>

	<div class="image-section">
		<ImageUploader bind:value={photo} label="Photo" />
		<input type="hidden" name="photo" value={photo} />
	</div>

	<label>
		Term Start
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
