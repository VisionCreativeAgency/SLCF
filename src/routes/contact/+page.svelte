<script>
	import ContactFaq from '$lib/components/ContactFaq.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import ContactHero from '$lib/components/ContactHero.svelte';
	import DepartmentDirectory from '$lib/components/DepartmentDirectory.svelte';
	import LocationMap from '$lib/components/LocationMap.svelte';
	import SocialBand from '$lib/components/SocialBand.svelte';
</script>

<main class="-mt-10">
	<ContactHero />
	<ContactForm />
	<LocationMap />
	<DepartmentDirectory />
	<ContactFaq />
	<SocialBand />
</main>
