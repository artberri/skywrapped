<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import Butterfly from '../Butterfly.svelte';
	import Cloud from '../Cloud.svelte';
	import Slide from '../Slide.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
</script>

<Slide>
  <Butterfly class="absolute top-20 left-10 text-white animate-float" size="md" />
  <Butterfly class="absolute top-32 right-16 text-white animate-float-delayed" size="sm" />
  <Butterfly class="absolute bottom-24 left-20 text-white animate-float" size="lg" />

  <Cloud class="absolute top-10 animate-drift" size="lg" />
  <Cloud class="absolute bottom-20 animate-drift" size="md" style="animationDelay: '5s" />

  <div class="relative z-10 text-center space-y-6 max-w-2xl">
    <div class="space-y-2">
      <h1 class="text-5xl md:text-7xl font-bold text-white animate-fade-in">
        Your Year on Bluesky
      </h1>
      <p class="text-xl md:text-2xl text-white/90 animate-fade-in" style:animation-delay="0.2s">
        {wrapped.year}
      </p>
    </div>

    <div class="space-y-2 animate-fade-in" style:animation-delay="0.4s">
      <p class="text-2xl md:text-3xl font-semibold text-white">
        {wrapped.displayName}
      </p>
      <p class="text-lg md:text-xl text-white/80">
        @{wrapped.handle}
      </p>
    </div>

    <p class="text-base md:text-lg text-white/70 animate-fade-in" style:animation-delay="0.6s">
      Let's look back together
    </p>
  </div>
</Slide>
