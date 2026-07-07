<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const p = data.player;

	let name = $state(p.name);
	let slug = $state(p.slug);
	let fideId = $state(p.fideId ?? '');
	let rating = $state(String(p.rating));
	let title = $state(p.title ?? '');
	let clubId = $state(p.clubId ? String(p.clubId) : '');
	let photo = $state(p.photo ?? '');
	let isTopPlayer = $state(p.isTopPlayer);
	let submitting = $state(false);

	let isValid = $derived(name.trim().length > 0);
</script>

<h1>Edit Player</h1>

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
		FIDE ID
		<input name="fideId" bind:value={fideId} />
	</label>

	<label>
		Rating
		<input type="number" name="rating" bind:value={rating} />
	</label>

	<label>
		Title
		<select name="title" bind:value={title}>
			<option value="">None</option>
			<option value="GM">GM</option>
			<option value="IM">IM</option>
			<option value="FM">FM</option>
			<option value="CM">CM</option>
		</select>
	</label>

	<label>
		Club
		<select name="clubId" bind:value={clubId}>
			<option value="">Independent (no club)</option>
			{#each data.clubs as club, i (i)}
				<option value={club.id}>{club.name}</option>
			{/each}
		</select>
	</label>

	<div class="image-section">
		<ImageUploader bind:value={photo} label="Player Photo" />
		<input type="hidden" name="photo" value={photo} />
	</div>

	<label class="checkbox">
		<input type="checkbox" name="isTopPlayer" bind:checked={isTopPlayer} />
		Mark as Top Player (featured on site)
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
	input,
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
