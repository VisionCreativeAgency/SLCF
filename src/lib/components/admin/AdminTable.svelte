<script lang="ts">
	let {
		columns,
		rows,
		editHref,
		onDelete
	}: {
		columns: { key: string; label: string }[];
		rows: Record<string, any>[];
		editHref: (row: any) => string;
		onDelete: (row: any) => void;
	} = $props();
</script>

<div class="admin-table-wrapper">
	<table class="admin-table">
		<thead>
			<tr>
				{#each columns as col, i (i)}
					<th>{col.label}</th>
				{/each}
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					{#each columns as col, i (i)}
						<td data-label={col.label}>{row[col.key]}</td>
					{/each}
					<td class="actions" data-label="Actions">
						<a href={editHref(row)}>Edit</a>
						<button type="button" onclick={() => onDelete(row)}>Delete</button>
					</td>
				</tr>
			{/each}
			{#if rows.length === 0}
				<tr><td colspan={columns.length + 1} class="empty">No records yet.</td></tr>
			{/if}
		</tbody>
	</table>
</div>

<style>
	.admin-table-wrapper {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		border-radius: 0.5rem;
	}

	.admin-table {
		width: 100%;
		min-width: 480px;
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
		white-space: nowrap;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
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

	/* --- Stacked card layout for small screens --- */
	@media (max-width: 640px) {
		.admin-table-wrapper {
			overflow-x: visible;
		}

		.admin-table {
			min-width: 0;
		}

		.admin-table thead {
			display: none;
		}

		.admin-table,
		.admin-table tbody,
		.admin-table tr,
		.admin-table td {
			display: block;
			width: 100%;
		}

		.admin-table tr {
			margin-bottom: 1rem;
			border: 1px solid #e2e8f0;
			border-radius: 0.5rem;
			overflow: hidden;
		}

		.admin-table td {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
			padding: 0.6rem 1rem;
			border-bottom: 1px solid #f1f5f9;
			text-align: right;
		}

		.admin-table td:last-child {
			border-bottom: none;
		}

		.admin-table td::before {
			content: attr(data-label);
			font-weight: 600;
			color: #64748b;
			text-align: left;
			flex-shrink: 0;
		}

		.actions {
			justify-content: flex-end;
		}

		.actions::before {
			content: 'Actions';
			font-weight: 600;
			color: #64748b;
		}

		.empty {
			text-align: center;
		}
	}
</style>
