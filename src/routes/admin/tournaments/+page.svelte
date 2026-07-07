<script lang="ts">
	import AdminTable from '$lib/components/admin/AdminTable.svelte';
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';

	let { data } = $props();

	let list = $state(data.tournaments);
	let confirmOpen = $state(false);
	let rowToDelete = $state<any>(null);

	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'location', label: 'Location' },
		{ key: 'status', label: 'Status' }
	];

	function handleDelete(row: any) {
		rowToDelete = row;
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!rowToDelete) return;
		confirmOpen = false;

		const previousList = list;
		list = list.filter((t) => t.id !== rowToDelete.id);

		try {
			const formData = new FormData();
			formData.append('id', String(rowToDelete.id));
			const res = await fetch('?/delete', { method: 'POST', body: formData });
			if (!res.ok) throw new Error('Delete failed');
		} catch {
			list = previousList;
			alert('Failed to delete tournament.');
		} finally {
			rowToDelete = null;
		}
	}
</script>

<div class="header">
	<h1>Tournaments</h1>
	<a href="/admin/tournaments/new" class="btn">+ New Tournament</a>
</div>

<AdminTable
	{columns}
	rows={list}
	editHref={(row) => `/admin/tournaments/${row.id}`}
	onDelete={handleDelete}
/>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete this tournament?"
	message={rowToDelete
		? `"${rowToDelete.name}" and all its results will be permanently deleted.`
		: ''}
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
