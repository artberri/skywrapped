<script lang="ts">
	import { page } from '$app/state';
	import Butterfly from '$lib/components/Butterfly.svelte';
	import Cloud from '$lib/components/Cloud.svelte';
	import { House } from '@lucide/svelte';
</script>

{#if page.status === 404}
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden gradient-sky">
    <Cloud class="absolute top-20 left-10 animate-drift" size="lg" />
    <Cloud class="absolute top-40 right-20 animate-drift" size="md" style="animation-delay: 2s;" />
    <Cloud class="absolute bottom-32 left-1/4 animate-drift" size="sm" style="animation-delay: 4s;" />

    <Butterfly class="absolute top-1/4 right-1/4 text-primary animate-float" size="md" />
    <Butterfly class="absolute bottom-1/3 left-1/3 text-primary/60 animate-float" size="sm" style="animation-delay: 1.5s;" />

    <div class="relative z-10 text-center px-4 max-w-md animate-fade-in">
      <h1 class="mb-4 text-8xl font-bold text-white drop-shadow-lg">404</h1>
      <h2 class="mb-3 text-4xl md:text-2xl text-white">Lost in the Sky</h2>
      <p class="mb-8 text-lg text-white/90">
        This page seems to have flown away. Let's get you back on track.
      </p>
      <p class="mb-8 text-lg text-white/90 text-center">
        <a href="/" class="flex gap-2 items-center justify-center block border border-white/20 rounded-md px-4 py-2 hover:bg-white/10 transition-colors duration-300 no-underline">
          <House class="w-5 h-5" />
          Return to Home
        </a>
      </p>
    </div>
  </div>
{:else}
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden gradient-sky">
    <Cloud class="absolute top-20 left-10 animate-drift" size="lg" />
    <Cloud class="absolute top-40 right-20 animate-drift" size="md" style="animation-delay: 2s;" />
    <Cloud class="absolute bottom-32 left-1/4 animate-drift" size="sm" style="animation-delay: 4s;" />

    <Butterfly class="absolute top-1/4 right-1/4 text-primary animate-float" size="md" />
    <Butterfly class="absolute bottom-1/3 left-1/3 text-primary/60 animate-float" size="sm" style="animation-delay: 1.5s;" />

    <div class="relative z-10 text-center px-4 max-w-md animate-fade-in">
      <h1 class="mb-4 text-8xl font-bold text-white drop-shadow-lg">{page.status || 500}</h1>
      <h2 class="mb-3 text-4xl md:text-2xl text-white">Something Went Wrong</h2>
      <p class="mb-8 text-lg text-white/90">
        {page.error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <p class="mb-8 text-lg text-white/90 text-center">
        <a href="/" class="flex gap-2 items-center justify-center block border border-white/20 rounded-md px-4 py-2 hover:bg-white/10 transition-colors duration-300 no-underline">
          <House class="w-5 h-5" />
          Return to Home
        </a>
      </p>
    </div>
  </div>
{/if}

