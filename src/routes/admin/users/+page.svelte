<script lang="ts">
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';

	let { data } = $props();

	let list = $state(data.users);
	let confirmOpen = $state(false);
	let rowToDelete = $state<any>(null);

	const sectionLabels: Record<string, string> = {
		posts: 'Posts',
		tournaments: 'Tournaments',
		players: 'Players',
		clubs: 'Clubs',
		leadership: 'Leadership',
		settings: 'Settings'
	};

	function handleDelete(row: any) {
		rowToDelete = row;
		confirmOpen = true;
	}

	async function confirmDelete() {
		if (!rowToDelete) return;
		confirmOpen = false;

		const previousList = list;
		list = list.filter((u) => u.id !== rowToDelete.id);

		try {
			const formData = new FormData();
			formData.append('id', rowToDelete.id);
			const res = await fetch('?/delete', { method: 'POST', body: formData });
			if (!res.ok) throw new Error();
		} catch {
			list = previousList;
			alert('Failed to delete user.');
		} finally {
			rowToDelete = null;
		}
	}
</script>

<div class="header">
	<h1>Admin Users</h1>
	<a href="/admin/users/new" class="btn">+ New User</a>
</div>

<table class="admin-table">
	<thead>
		<tr><th>Name</th><th>Email</th><th>Role</th><th>Access</th><th></th></tr>
	</thead>
	<tbody>
		{#each list as u, i (i)}
			<tr>
				<td>{u.name}</td>
				<td>{u.email}</td>
				<td><span class="role-badge" class:super={u.role === 'super_admin'}>{u.role}</span></td>
				<td>
					{#if u.role === 'super_admin'}
						<span class="all-access">All sections</span>
					{:else if u.permissions.length === 0}
						<span class="no-access">No access assigned</span>
					{:else}
						{u.permissions.map((s: string) => sectionLabels[s] ?? s).join(', ')}
					{/if}
				</td>
				<td class="actions">
					{#if u.role !== 'super_admin'}
						<a href={`/admin/users/${u.id}`}>Edit Access</a>
						<button onclick={() => handleDelete(u)}>Delete</button>
					{:else}
						<span class="muted">—</span>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete this user?"
	message={rowToDelete
		? `"${rowToDelete.name}" (${rowToDelete.email}) will lose access permanently.`
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
	.role-badge {
		padding: 0.2rem 0.5rem;
		background: #f1f5f9;
		border-radius: 0.25rem;
		font-size: 0.8rem;
		text-transform: capitalize;
	}
	.role-badge.super {
		background: #dcfce7;
		color: #16a34a;
	}
	.no-access {
		color: #dc2626;
		font-size: 0.85rem;
	}
	.all-access {
		color: #16a34a;
		font-size: 0.85rem;
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
	.muted {
		color: #cbd5e1;
	}
</style>
