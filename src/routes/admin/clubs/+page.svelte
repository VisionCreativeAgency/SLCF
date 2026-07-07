<script lang="ts">
	import AdminTable from '$lib/components/admin/AdminTable.svelte';
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';

	let { data } = $props();

	let list = $state(data.clubs);
	let confirmOpen = $state(false);
	let rowToDelete = $state<any>(null);

	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'location', label: 'Location' }
	];

	function handleDelete(row: any) {
		rowToDelete = row;
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!rowToDelete) return;
		confirmOpen = false;

		const previousList = list;
		list = list.filter((c) => c.id !== rowToDelete.id);

		try {
			const formData = new FormData();
			formData.append('id', String(rowToDelete.id));
			const res = await fetch('?/delete', { method: 'POST', body: formData });
			if (!res.ok) throw new Error();
		} catch {
			list = previousList;
			alert('Failed to delete club. It may still have players linked to it.');
		} finally {
			rowToDelete = null;
		}
	}
</script>

<div class="header">
	<h1>Clubs</h1>
	<a href="/admin/clubs/new" class="btn">+ New Club</a>
</div>

<AdminTable
	{columns}
	rows={list}
	editHref={(row) => `/admin/clubs/${row.id}`}
	onDelete={handleDelete}
/>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete this club?"
	message={rowToDelete
		? `"${rowToDelete.name}" will be permanently deleted. Players linked to it will become unaffiliated.`
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
