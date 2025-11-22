<script lang="ts">
	import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let { wrapped } = data;
</script>

<style lang="postcss">

</style>

<div class="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[hsl(206,100%,50%)] via-[hsl(195,85%,60%)] to-[hsl(50,100%,75%)]">
  <h1>{wrapped.handle}</h1>
  <p>{wrapped.year}</p>
  <p>{wrapped.current.posts}</p>
  <p>{wrapped.current.following}</p>
  <p>{wrapped.current.followers}</p>
  <p>{wrapped.current.accountAge}</p>
</div>
