<script lang="ts">
	import ImageUploader from '$lib/components/admin/ImageUploader.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let title = $state('');
	let slug = $state('');
	let excerpt = $state('');
	let content = $state('');
	let coverImage = $state('');
	let type = $state('blog');
	let category = $state('Federation News');
	let featured = $state(false);
	let status = $state('draft');
	let submitting = $state(false);

	let isValid = $derived(title.trim().length > 0 && content.trim().length > 0 && type.length > 0);
</script>

<h1>New Post</h1>

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
		<input
			name="title"
			bind:value={title}
			placeholder="e.g. SLCF Announces 2026 Championship"
			required
		/>
	</label>

	<label>
		Slug <span class="optional">(auto-generated if left blank)</span>
		<input name="slug" bind:value={slug} placeholder="auto-generated-from-title" />
	</label>

	<label>
		Excerpt <span class="optional">(short summary, optional)</span>
		<textarea
			name="excerpt"
			bind:value={excerpt}
			rows="2"
			placeholder="One or two sentences shown in previews"></textarea>
	</label>

	<label>
		Content <span class="required">*</span>
		<textarea
			name="content"
			bind:value={content}
			rows="12"
			placeholder="Write the full post here (Markdown supported)"
			required></textarea>
	</label>

	<div class="image-section">
		<ImageUploader
			bind:value={coverImage}
			label="Cover Image (optional — you can add this later)"
		/>
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
		{submitting ? 'Saving...' : isValid ? 'Create Post' : 'Fill required fields (*)'}
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
