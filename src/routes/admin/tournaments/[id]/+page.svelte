<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const t = data.tournament;

	function toDateInput(d: string | Date | null) {
		if (!d) return '';
		return new Date(d).toISOString().split('T')[0];
	}

	let name = $state(t.name);
	let slug = $state(t.slug);
	let description = $state(t.description ?? '');
	let location = $state(t.location ?? '');
	let startDate = $state(toDateInput(t.startDate));
	let endDate = $state(toDateInput(t.endDate));
	let registrationOpen = $state(t.registrationOpen);
	let coverImage = $state(t.coverImage ?? '');
	let status = $state(t.status);
	let submitting = $state(false);

	let isValid = $derived(name.trim().length > 0 && startDate.length > 0);
</script>

<div class="header-row">
	<h1>Edit Tournament</h1>
	<a href={`/admin/tournaments/${t.id}/results`} class="btn-secondary">Manage Results →</a>
</div>

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
		Start Date <span class="required">*</span>
		<input type="date" name="startDate" bind:value={startDate} required />
	</label>

	<label>
		End Date
		<input type="date" name="endDate" bind:value={endDate} />
	</label>

	<label class="checkbox">
		<input type="checkbox" name="registrationOpen" bind:checked={registrationOpen} />
		Registration Open
	</label>

	<div class="image-section">
		<ImageUploader bind:value={coverImage} label="Cover Image" />
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
		{submitting ? 'Saving...' : 'Save Changes'}
	</button>
</form>

<style>
	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.btn-secondary {
		background: #f1f5f9;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.875rem;
		color: #0f172a;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 600px;
		margin-top: 1.5rem;
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
