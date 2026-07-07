<script lang="ts">
	let { value = $bindable(''), label = 'Image' }: { value?: string; label?: string } = $props();

	let uploading = $state(false);
	let error = $state('');

	async function handleFileChange(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		uploading = true;
		error = '';

		const formData = new FormData();
		formData.append('file', file);

		try {
			const res = await fetch('/admin/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error ?? 'Upload failed');
			}

			const data = await res.json();
			value = data.url;
		} catch (err: any) {
			error = err.message ?? 'Upload failed. Try again.';
		} finally {
			uploading = false;
		}
	}

	function removeImage() {
		value = '';
		error = '';
	}
</script>

<div class="image-uploader">
	<label>{label}</label>

	{#if value}
		<div class="preview">
			<img src={value} alt="preview" />
			<div class="preview-actions">
				<span class="badge">✓ Uploaded</span>
				<button type="button" onclick={removeImage}>Remove</button>
			</div>
		</div>
	{:else if uploading}
		<div class="uploading-box">
			<span class="spinner"></span>
			<span>Uploading image...</span>
		</div>
	{:else}
		<input type="file" accept="image/*" onchange={handleFileChange} />
		<p class="hint">
			PNG, JPG, or WebP. This step is optional — you can skip and add an image later.
		</p>
	{/if}

	{#if error}<p class="error">{error}</p>{/if}
</div>

<style>
	.image-uploader {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	label {
		font-size: 0.875rem;
		font-weight: 600;
	}
	.preview {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.preview img {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-radius: 0.375rem;
		border: 1px solid #e2e8f0;
	}
	.preview-actions {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		align-items: flex-start;
	}
	.badge {
		font-size: 0.8rem;
		color: #16a34a;
		font-weight: 600;
	}
	.preview-actions button {
		padding: 0.3rem 0.6rem;
		font-size: 0.8rem;
		cursor: pointer;
		background: #fef2f2;
		color: #dc2626;
		border: none;
		border-radius: 0.25rem;
	}
	.uploading-box {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: #f0fdf4;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: #16a34a;
	}
	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid #bbf7d0;
		border-top-color: #16a34a;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.hint {
		font-size: 0.75rem;
		color: #94a3b8;
		margin: 0;
	}
	.error {
		font-size: 0.8rem;
		color: #dc2626;
	}
</style>
