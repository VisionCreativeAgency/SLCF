<script lang="ts">
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';

	let { data } = $props();

	let list = $state(data.players);
	let confirmOpen = $state(false);
	let rowToDelete = $state<any>(null);

	function handleDelete(row: any) {
		rowToDelete = row;
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!rowToDelete) return;
		confirmOpen = false;

		const previousList = list;
		list = list.filter((p) => p.id !== rowToDelete.id);

		try {
			const formData = new FormData();
			formData.append('id', String(rowToDelete.id));
			const res = await fetch('?/delete', { method: 'POST', body: formData });
			if (!res.ok) throw new Error();
		} catch {
			list = previousList;
			alert('Failed to delete player.');
		} finally {
			rowToDelete = null;
		}
	}
</script>

<div class="header">
	<h1>Players</h1>
	<a href="/admin/players/new" class="btn">+ New Player</a>
</div>

<table class="admin-table">
	<thead>
		<tr>
			<th>Name</th>
			<th>Rating</th>
			<th>Title</th>
			<th>Club</th>
			<th>Top Player</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each list as p, i (i)}
			<tr>
				<td>{p.name}</td>
				<td>{p.rating}</td>
				<td>{p.title ?? '—'}</td>
				<td>{p.club?.name ?? 'Independent'}</td>
				<td>{p.isTopPlayer ? '⭐' : '—'}</td>
				<td class="actions">
					<a href={`/admin/players/${p.id}`}>Edit</a>
					<button onclick={() => handleDelete(p)}>Delete</button>
				</td>
			</tr>
		{/each}
		{#if list.length === 0}
			<tr><td colspan="6" class="empty">No players yet.</td></tr>
		{/if}
	</tbody>
</table>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete this player?"
	message={rowToDelete
		? `"${rowToDelete.name}" will be permanently deleted, including any tournament results.`
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
	.admin-table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
	}
	th,
	td {
		text-align: left;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #e2e8f0;
		font-size: 0.9rem;
	}
	th {
		background: #f1f5f9;
		font-weight: 600;
	}
	.actions {
		display: flex;
		gap: 0.75rem;
	}
	.actions a {
		color: #16a34a;
		text-decoration: none;
	}
	.actions button {
		color: #dc2626;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		font-size: 0.9rem;
	}
	.empty {
		text-align: center;
		color: #94a3b8;
		padding: 2rem;
	}
</style>
