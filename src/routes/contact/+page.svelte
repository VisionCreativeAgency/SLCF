<script>
	import ContactFaq from '$lib/components/ContactFaq.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import ContactHero from '$lib/components/ContactHero.svelte';
	import LocationMap from '$lib/components/LocationMap.svelte';
	import SocialBand from '$lib/components/SocialBand.svelte';
</script>

<svelte:head>
	<title>Contact Us | Somaliland Chess Federation</title>
	<meta
		name="description"
		content="Get in touch with the Somaliland Chess Federation — reach our departments, find our location, or send us a message."
	/>
	<meta property="og:title" content="Contact Us | Somaliland Chess Federation" />
	<meta
		property="og:description"
		content="Get in touch with the Somaliland Chess Federation — reach our departments, find our location, or send us a message."
	/>
	<meta property="og:url" content="https://somalilandchessfederation.com/contact" />
</svelte:head>

<main class="-mt-10">
	<ContactHero />
	<ContactForm />
	<LocationMap />

	<ContactFaq />
	<SocialBand />
</main>
