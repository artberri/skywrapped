<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
</script>

<div>
  <h1>Profile Overview Slide</h1>
</div>
