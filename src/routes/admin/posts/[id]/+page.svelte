<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let title = $state(data.post.title);
	let slug = $state(data.post.slug);
	let excerpt = $state(data.post.excerpt ?? '');
	let content = $state(data.post.content);
	let coverImage = $state(data.post.coverImage ?? '');
	let type = $state(data.post.type);
	let category = $state(data.post.category);
	let featured = $state(data.post.featured);
	let status = $state(data.post.status);
	let submitting = $state(false);

	let isValid = $derived(title.trim().length > 0 && content.trim().length > 0 && type.length > 0);
</script>

<h1>Edit Post</h1>

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
		Title <span class="required">*</span>
		<input name="title" bind:value={title} required />
	</label>

	<label>
		Slug
		<input name="slug" bind:value={slug} required />
	</label>

	<label>
		Excerpt <span class="optional">(optional)</span>
		<textarea name="excerpt" bind:value={excerpt} rows="2"></textarea>
	</label>

	<label>
		Content <span class="required">*</span>
		<textarea name="content" bind:value={content} rows="12" required></textarea>
	</label>

	<div class="image-section">
		<ImageUploader bind:value={coverImage} label="Cover Image (optional)" />
		<input type="hidden" name="coverImage" value={coverImage} />
	</div>

	<label>
		Type <span class="required">*</span>
		<select name="type" bind:value={type} required>
			<option value="blog">Blog</option>
			<option value="news">News</option>
		</select>
	</label>

	<label>
		Category
		<select name="category" bind:value={category}>
			<option value="Tournament Results">Tournament Results</option>
			<option value="Federation News">Federation News</option>
			<option value="Player Spotlight">Player Spotlight</option>
			<option value="Youth & Education">Youth & Education</option>
		</select>
	</label>

	<label class="checkbox">
		<input type="checkbox" name="featured" bind:checked={featured} />
		Feature this post at the top of the News page
	</label>

	<label>
		Status
		<select name="status" bind:value={status}>
			<option value="draft">Draft</option>
			<option value="published">Published</option>
		</select>
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
