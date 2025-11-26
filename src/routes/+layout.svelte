<script lang="ts">
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
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
	<link rel="apple-touch-icon" href="/apple-touch-icon.png">	<meta property="og:type" content="website">
	<meta property="og:site_name" content="Sky Wrapped">
	<meta property="og:locale" content="en_US">
</svelte:head>

{@render children()}
