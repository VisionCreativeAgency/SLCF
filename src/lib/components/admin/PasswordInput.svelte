<script lang="ts">
	let {
		value = $bindable(''),
		name = 'password',
		placeholder = '',
		minlength = undefined,
		required = false
	}: {
		value?: string;
		name?: string;
		placeholder?: string;
		minlength?: number;
		required?: boolean;
	} = $props();

	let visible = $state(false);
</script>

<div class="password-field">
	<input
		type={visible ? 'text' : 'password'}
		{name}
		bind:value
		{placeholder}
		{minlength}
		{required}
	/>
	<button type="button" class="eye-btn" onclick={() => (visible = !visible)} tabindex="-1">
		{#if visible}
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
				/>
				<line x1="1" y1="1" x2="23" y2="23" />
			</svg>
		{:else}
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
		{/if}
	</button>
</div>

<style>
	.password-field {
		position: relative;
		display: flex;
	}
	.password-field input {
		width: 100%;
		padding-right: 2.5rem;
	}
	.eye-btn {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: #64748b;
		display: flex;
		align-items: center;
		padding: 0.25rem;
	}
	.eye-btn:hover {
		color: #0f172a;
	}
</style>
