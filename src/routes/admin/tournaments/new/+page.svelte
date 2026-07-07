<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let name = $state('');
	let slug = $state('');
	let description = $state('');
	let location = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let registrationOpen = $state(true);
	let coverImage = $state('');
	let status = $state('upcoming');
	let submitting = $state(false);

	let isValid = $derived(name.trim().length > 0 && startDate.length > 0);
</script>

<h1>New Tournament</h1>

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
		<input
			name="name"
			bind:value={name}
			placeholder="e.g. 2026 National Chess Championship"
			required
		/>
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
		Start Date <span class="required">*</span>
		<input type="date" name="startDate" bind:value={startDate} required />
	</label>

	<label>
		End Date <span class="optional">(optional)</span>
		<input type="date" name="endDate" bind:value={endDate} />
	</label>

	<label class="checkbox">
		<input type="checkbox" name="registrationOpen" bind:checked={registrationOpen} />
		Registration Open
	</label>

	<div class="image-section">
		<ImageUploader bind:value={coverImage} label="Cover Image (optional)" />
		<input type="hidden" name="coverImage" value={coverImage} />
	</div>

	<label>
		Status
		<select name="status" bind:value={status}>
			<option value="upcoming">Upcoming</option>
			<option value="ongoing">Ongoing</option>
			<option value="completed">Completed</option>
		</select>
	</label>

	<button type="submit" disabled={!isValid || submitting}>
		{submitting ? 'Saving...' : isValid ? 'Create Tournament' : 'Fill required fields (*)'}
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
	textarea,
	select {
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
