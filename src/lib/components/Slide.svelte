<script lang="ts">
	import type { Snippet } from "svelte";

  interface PageProps {
    children: Snippet;
  }

  let { children }: PageProps = $props();
</script>

<style lang="postcss">
  @reference "tailwindcss";
  .slide {
    @apply relative h-full w-full flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden;
  }
</style>

<div class="slide">
  {@render children()}
</div>
