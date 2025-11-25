<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		const script = document.createElement('script');
		script.defer = true;
		script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
		script.setAttribute('data-cf-beacon', JSON.stringify({ token: '2c08323039934390bef6d198ee4a676e' }));
		document.body.appendChild(script);
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="32x32">
	<link rel="icon" href="/icon.svg" type="image/svg+xml">
	<link rel="apple-touch-icon" href="/apple-touch-icon.png">
	<title>Sky Wrapped - Your year on Bluesky</title>
	<meta name="description" content="Get your Bluesky Wrapped! Discover your personalized year in review with top posts, favorite moments, and social stats from your Bluesky activity.">
	<meta name="keywords" content="skywrapped, wrapped, bluesky">
</svelte:head>

{@render children()}
