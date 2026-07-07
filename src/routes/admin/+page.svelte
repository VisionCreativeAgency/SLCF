<script lang="ts">
	let { data } = $props();
</script>

<h1>Welcome, {data.user.name}</h1>
<p>Role: {data.user.role}</p>
<p>This is your SLCF admin dashboard. Select a section from the sidebar to manage content.</p>
