<script lang="ts">
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';

	let { data } = $props();

	let list = $state(data.leadership);
	let confirmOpen = $state(false);
	let rowToDelete = $state<any>(null);

	const current = $derived(list.filter((l) => l.isCurrent));
	const past = $derived(list.filter((l) => !l.isCurrent));

	function handleDelete(row: any) {
		rowToDelete = row;
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!rowToDelete) return;
		confirmOpen = false;

		const previousList = list;
		list = list.filter((l) => l.id !== rowToDelete.id);

		try {
			const formData = new FormData();
			formData.append('id', String(rowToDelete.id));
			const res = await fetch('?/delete', { method: 'POST', body: formData });
			if (!res.ok) throw new Error();
		} catch {
			list = previousList;
			alert('Failed to delete.');
		} finally {
			rowToDelete = null;
		}
	}
</script>

<div class="header">
	<h1>Leadership</h1>
	<a href="/admin/leadership/new" class="btn">+ New Member</a>
</div>

<h2>Current Committee</h2>
<table class="admin-table">
	<thead>
		<tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th></th></tr>
	</thead>
	<tbody>
		{#each current as l, i (i)}
			<tr>
				<td>{l.name}</td>
				<td>{l.role}</td>
				<td>{l.email ?? '—'}</td>
				<td>{l.phone ?? '—'}</td>
				<td class="actions">
					<a href={`/admin/leadership/${l.id}`}>Edit</a>
					<button onclick={() => handleDelete(l)}>Delete</button>
				</td>
			</tr>
		{/each}
		{#if current.length === 0}
			<tr><td colspan="5" class="empty">No current members yet.</td></tr>
		{/if}
	</tbody>
</table>

{#if past.length > 0}
	<h2>Past Members</h2>
	<table class="admin-table">
		<thead>
			<tr><th>Name</th><th>Role</th><th>Term</th><th></th></tr>
		</thead>
		<tbody>
			{#each past as l, i (i)}
				<tr>
					<td>{l.name}</td>
					<td>{l.role}</td>
					<td>
						{l.termStart ? new Date(l.termStart).getFullYear() : '?'} –
						{l.termEnd ? new Date(l.termEnd).getFullYear() : '?'}
					</td>
					<td class="actions">
						<a href={`/admin/leadership/${l.id}`}>Edit</a>
						<button onclick={() => handleDelete(l)}>Delete</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete this member?"
	message={rowToDelete ? `"${rowToDelete.name}" will be permanently deleted.` : ''}
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
	h2 {
		margin: 1.5rem 0 0.75rem;
		font-size: 1rem;
		color: #475569;
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
