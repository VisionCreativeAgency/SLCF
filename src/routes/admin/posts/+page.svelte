
<script lang="ts">
	import AdminTable from '$lib/components/admin/AdminTable.svelte';
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';

	let { data } = $props();

	let postsList = $state(data.posts);
	let confirmOpen = $state(false);
	let rowToDelete = $state<any>(null);

	let deletingId = $state<number | null>(null);

	const columns = [
		{ key: 'title', label: 'Title' },
		{ key: 'type', label: 'Type' },
		{ key: 'status', label: 'Status' }
	];

	function handleDelete(row: any) {
		rowToDelete = row;
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!rowToDelete) return;

		confirmOpen = false;
		deletingId = rowToDelete.id;

		// optimistic UI: remove immediately
		const previousList = postsList;
		postsList = postsList.filter((p) => p.id !== rowToDelete.id);

		try {
			const formData = new FormData();
			formData.append('id', String(rowToDelete.id));

			const res = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) throw new Error('Delete failed');
		} catch (err) {
			// rollback on failure
			postsList = previousList;
			alert('Failed to delete post. Please try again.');
		} finally {
			deletingId = null;
			rowToDelete = null;
		}
	}
</script>

<div class="header">
	<h1>Posts</h1>
	<a href="/admin/posts/new" class="btn">+ New Post</a>
</div>

<AdminTable
	{columns}
	rows={postsList}
	editHref={(row) => `/admin/posts/${row.id}`}
	onDelete={handleDelete}
/>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete this post?"
	message={rowToDelete ? `"${rowToDelete.title}" will be permanently deleted.` : ''}
	onConfirm={confirmDelete}
	onCancel={() => (rowToDelete = null)}
/>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	.btn {
		background: #16a34a;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.9rem;
	}
</style>
