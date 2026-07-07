<script lang="ts">
	let { data } = $props();

	let selectedPlayerId = $state('');
	let addError = $state('');
	let editingRows = $state<Record<number, any>>({});

	function startEdit(result: any) {
		editingRows[result.id] = {
			rank: result.rank ?? '',
			points: result.points,
			wins: result.wins,
			draws: result.draws,
			losses: result.losses
		};
	}

	async function saveEdit(id: number) {
		const row = editingRows[id];
		const formData = new FormData();
		formData.append('id', String(id));
		formData.append('rank', row.rank);
		formData.append('points', row.points);
		formData.append('wins', row.wins);
		formData.append('draws', row.draws);
		formData.append('losses', row.losses);

		await fetch('?/updateResult', { method: 'POST', body: formData });
		delete editingRows[id];
		location.reload();
	}

	async function addPlayer(e: Event) {
		e.preventDefault();
		addError = '';
		if (!selectedPlayerId) return;

		const formData = new FormData();
		formData.append('playerId', selectedPlayerId);

		const res = await fetch('?/addPlayer', { method: 'POST', body: formData });
		const result = await res.json();

		if (result.type === 'failure') {
			addError = result.data?.error ?? 'Failed to add player';
			return;
		}

		location.reload();
	}

	async function removePlayer(id: number) {
		if (!confirm('Remove this player from the tournament?')) return;
		const formData = new FormData();
		formData.append('id', String(id));
		await fetch('?/removeResult', { method: 'POST', body: formData });
		location.reload();
	}
</script>

<h1>Results — {data.tournament.name}</h1>

<form class="add-player-form" onsubmit={addPlayer}>
	<select bind:value={selectedPlayerId}>
		<option value="">Select a player to add...</option>
		{#each data.allPlayers as p, i (i)}
			<option value={p.id}>{p.name} {p.rating ? `(${p.rating})` : ''}</option>
		{/each}
	</select>
	<button type="submit">Add to Tournament</button>
</form>
{#if addError}<p class="error">{addError}</p>{/if}

<table class="results-table">
	<thead>
		<tr>
			<th>Rank</th>
			<th>Player</th>
			<th>Points</th>
			<th>Wins</th>
			<th>Draws</th>
			<th>Losses</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each data.results as result, i (i)}
			<tr>
				{#if editingRows[result.id]}
					<td
						><input type="number" bind:value={editingRows[result.id].rank} class="cell-input" /></td
					>
					<td>{result.player.name}</td>
					<td
						><input
							type="number"
							step="0.5"
							bind:value={editingRows[result.id].points}
							class="cell-input"
						/></td
					>
					<td
						><input type="number" bind:value={editingRows[result.id].wins} class="cell-input" /></td
					>
					<td
						><input
							type="number"
							bind:value={editingRows[result.id].draws}
							class="cell-input"
						/></td
					>
					<td
						><input
							type="number"
							bind:value={editingRows[result.id].losses}
							class="cell-input"
						/></td
					>
					<td class="actions">
						<button onclick={() => saveEdit(result.id)}>Save</button>
					</td>
				{:else}
					<td>{result.rank ?? '—'}</td>
					<td>{result.player.name}</td>
					<td>{result.points}</td>
					<td>{result.wins}</td>
					<td>{result.draws}</td>
					<td>{result.losses}</td>
					<td class="actions">
						<button onclick={() => startEdit(result)}>Edit</button>
						<button class="remove" onclick={() => removePlayer(result.id)}>Remove</button>
					</td>
				{/if}
			</tr>
		{/each}
		{#if data.results.length === 0}
			<tr><td colspan="7" class="empty">No players added yet.</td></tr>
		{/if}
	</tbody>
</table>

<style>
	.add-player-form {
		display: flex;
		gap: 0.75rem;
		margin: 1.5rem 0;
	}
	select {
		flex: 1;
		max-width: 320px;
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.375rem;
	}
	.add-player-form button {
		padding: 0.5rem 1rem;
		background: #16a34a;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
	}
	.results-table {
		width: 100%;
		border-collapse: collapse;
		background: white;
		border-radius: 0.5rem;
		overflow: hidden;
	}
	th,
	td {
		text-align: left;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid #e2e8f0;
		font-size: 0.875rem;
	}
	th {
		background: #f1f5f9;
		font-weight: 600;
	}
	.cell-input {
		width: 60px;
		padding: 0.3rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.25rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	.actions button {
		padding: 0.3rem 0.6rem;
		font-size: 0.8rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		background: #f1f5f9;
	}
	.actions .remove {
		color: #dc2626;
	}
	.empty {
		text-align: center;
		color: #94a3b8;
		padding: 2rem;
	}
	.error {
		color: #dc2626;
	}
</style>
