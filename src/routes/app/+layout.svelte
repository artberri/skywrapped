<script lang="ts">
	import '../../app.css';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<h1>App Layout {data.did}</h1>
<a href="/logout">Logout</a>
{@render children()}
