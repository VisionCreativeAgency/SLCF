<script lang="ts">
	let {
		open = $bindable(false),
		title = 'Are you sure?',
		message = 'This action cannot be undone.',
		onConfirm,
		onCancel
	}: {
		open: boolean;
		title?: string;
		message?: string;
		onConfirm: () => void;
		onCancel?: () => void;
	} = $props();

	function handleCancel() {
		open = false;
		onCancel?.();
	}

	function handleConfirm() {
		onConfirm();
	}
</script>

{#if open}
	<div class="overlay" onclick={handleCancel}>
		<div class="dialog" onclick={(e) => e.stopPropagation()}>
			<h3>{title}</h3>
			<p>{message}</p>
			<div class="actions">
				<button class="cancel" onclick={handleCancel}>Cancel</button>
				<button class="confirm" onclick={handleConfirm}>Delete</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}
	.dialog {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		width: 90%;
		max-width: 360px;
	}
	h3 {
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
	}
	p {
		margin: 0 0 1.25rem;
		color: #64748b;
		font-size: 0.9rem;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}
	.cancel {
		padding: 0.5rem 1rem;
		background: #f1f5f9;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
	}
	.confirm {
		padding: 0.5rem 1rem;
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
	}
</style>
