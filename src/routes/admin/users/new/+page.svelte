<script lang="ts">
	import PasswordInput from '$lib/components/admin/PasswordInput.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let submitting = $state(false);

	const allSections = [
		{ key: 'posts', label: 'Posts', desc: 'Blog & news articles' },
		{ key: 'tournaments', label: 'Tournaments', desc: 'Events & standings' },
		{ key: 'players', label: 'Players', desc: 'Player registry' },
		{ key: 'clubs', label: 'Clubs', desc: 'Chess clubs' },
		{ key: 'leadership', label: 'Leadership', desc: 'Committee members' },
		{ key: 'settings', label: 'Settings', desc: 'Contact & social links' }
	];

	let selectedSections = $state<string[]>([]);

	function toggleSection(key: string) {
		if (selectedSections.includes(key)) {
			selectedSections = selectedSections.filter((s) => s !== key);
		} else {
			selectedSections = [...selectedSections, key];
		}
	}

	let isValid = $derived(name.trim().length > 0 && email.trim().length > 0 && password.length >= 8);
</script>

<h1>New Admin User</h1>

{#if form?.error}<p class="error">{form.error}</p>{/if}

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
	<div class="row">
		<label>
			Name <span class="required">*</span>
			<input name="name" bind:value={name} required />
		</label>

		<label>
			Email <span class="required">*</span>
			<input type="email" name="email" bind:value={email} required />
		</label>
	</div>

	<label>
		Temporary Password <span class="required">*</span>
		<PasswordInput bind:value={password} name="password" minlength={8} required />
		<span class="hint"
			>At least 8 characters. Share this securely — they can change it after logging in.</span
		>
	</label>

	<div class="permissions-section">
		<div class="permissions-header">
			<span class="permissions-label">Section Access</span>
			<span class="hint">Tap to grant access to specific parts of the dashboard.</span>
		</div>

		<div class="toggle-grid">
			{#each allSections as section, i (i)}
				{@const active = selectedSections.includes(section.key)}
				<button
					type="button"
					class="toggle-card"
					class:active
					onclick={() => toggleSection(section.key)}
				>
					<div class="toggle-check" class:active>
						{#if active}
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="white"
								stroke-width="3"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						{/if}
					</div>
					<div class="toggle-text">
						<span class="toggle-title">{section.label}</span>
						<span class="toggle-desc">{section.desc}</span>
					</div>
				</button>
				<input type="checkbox" name="sections" value={section.key} checked={active} hidden />
			{/each}
		</div>
	</div>

	<button type="submit" class="submit-btn" disabled={!isValid || submitting}>
		{submitting ? 'Creating...' : isValid ? 'Create User' : 'Fill required fields (*)'}
	</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		max-width: 640px;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.required {
		color: #dc2626;
	}
	.hint {
		color: #94a3b8;
		font-weight: normal;
		font-size: 0.8rem;
	}
	input {
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 0.375rem;
		font-weight: normal;
		font-size: 0.9rem;
		width: 100%;
	}

	.permissions-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.permissions-header {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.permissions-label {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.toggle-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}

	.toggle-card {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		background: white;
		cursor: pointer;
		text-align: left;
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.toggle-card:hover {
		border-color: #94a3b8;
	}
	.toggle-card.active {
		border-color: #16a34a;
		background: #f0fdf4;
	}

	.toggle-check {
		flex-shrink: 0;
		width: 18px;
		height: 18px;
		border-radius: 0.3rem;
		border: 1.5px solid #cbd5e1;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0.15rem;
		transition:
			background 0.15s,
			border-color 0.15s;
	}
	.toggle-check.active {
		background: #16a34a;
		border-color: #16a34a;
	}

	.toggle-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.toggle-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #0f172a;
	}
	.toggle-desc {
		font-size: 0.75rem;
		color: #94a3b8;
		font-weight: normal;
	}

	.submit-btn {
		padding: 0.65rem 1.3rem;
		background: #16a34a;
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		align-self: flex-start;
		font-weight: 600;
		font-size: 0.9rem;
	}
	.submit-btn:disabled {
		background: #cbd5e1;
		cursor: not-allowed;
	}
	.error {
		color: #dc2626;
		background: #fef2f2;
		padding: 0.75rem;
		border-radius: 0.375rem;
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 1fr;
		}
		.toggle-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
