<script lang="ts">
	let { children }: { children?: any } = $props();
</script>

<div class="relative flex h-full w-full items-center justify-center overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-br from-green via-white to-green-dark"></div>
	<div
		class="absolute inset-0 bg-gradient-to-br from-green-dark/85 via-white/10 to-green-dark/85"
	></div>
	<div class="relative z-10 text-white">
		{@render children?.()}
	</div>
</div>
