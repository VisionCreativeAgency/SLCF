<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	const allSections = [
		{ key: 'posts', label: 'Posts (Blog/News)' },
		{ key: 'tournaments', label: 'Tournaments' },
		{ key: 'players', label: 'Players' },
		{ key: 'clubs', label: 'Clubs' },
		{ key: 'leadership', label: 'Leadership' },
		{ key: 'settings', label: 'Settings' }
	];

	let selectedSections = $state<string[]>([...data.currentSections]);
	let submitting = $state(false);

	function toggleSection(key: string) {
		if (selectedSections.includes(key)) {
			selectedSections = selectedSections.filter((s) => s !== key);
		} else {
			selectedSections = [...selectedSections, key];
		}
	}
</script>

<h1>Edit Access — {data.targetUser.name}</h1>
<p class="subtitle">{data.targetUser.email}</p>

<form
	method="POST"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			submitting = false;
			await update();
		};
	}}
>
	<div class="permissions-box">
		<span class="permissions-label">Section Access</span>
Mohamed2026@
		{#each allSections as section, i (i)}
			<label class="checkbox-row">
				<input
					type="checkbox"
					name="sections"
					value={section.key}
					checked={selectedSections.includes(section.key)}
					onchange={() => toggleSection(section.key)}
				/>
				{section.label}
			</label>
		{/each}
	</div>

	<button type="submit" disabled={submitting}>
		{submitting ? 'Saving...' : 'Save Access'}
	</button>
</form>

<style>
	.subtitle {
		color: #64748b;
		font-size: 0.9rem;
		margin-top: -0.5rem;
		margin-bottom: 1.5rem;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 500px;
	}
	.permissions-box {
		padding: 1rem;
		background: #f8fafc;
		border-radius: 0.5rem;
		border: 1px solid #e2e8f0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.permissions-label {
		font-weight: 600;
		font-size: 0.875rem;
	}
	.checkbox-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	button {
		padding: 0.6rem 1.2rem;
		background: #16a34a;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		align-self: flex-start;
		font-weight: 600;
	}
	button:disabled {
		background: #cbd5e1;
		cursor: not-allowed;
	}
</style>
