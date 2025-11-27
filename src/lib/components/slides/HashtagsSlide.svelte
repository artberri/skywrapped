<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Hash } from '@lucide/svelte';
	import Cloud from '../Cloud.svelte';
	import Slide from '../Slide.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
</script>

<Slide>
  <Cloud class="absolute top-16 right-0 animate-drift" size="lg" />
  <Cloud class="absolute bottom-20 left-0 animate-drift" size="md" style="animation-delay: 4s" />

  <div class="relative z-10 text-center space-y-8 md:space-y-10 max-w-2xl w-full">
    <div class="space-y-4 animate-fade-in">
      <Hash class="w-16 h-16 md:w-20 md:h-20 text-white mx-auto" />
      <h2 class="text-3xl md:text-5xl font-bold text-white">
        Yes… Hashtags
      </h2>
    </div>

    <div class="flex flex-wrap justify-center gap-3 md:gap-4">
      {#each wrapped.hashtags as hashtag, index}
        <div
          class="bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 md:px-8 md:py-4 border border-white/20 animate-scale-in"
          style:animation-delay={`${index * 0.1}s`}
        >
          <span class="text-xl md:text-3xl font-semibold text-white">
            #{hashtag.hashtag}
          </span>
        </div>
      {/each}
    </div>

  <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20 animate-fade-in" style:animation-delay="0.5s">
      <p class="text-lg md:text-2xl text-white/90">
        Who says they're over? Not you
      </p>
    </div>
  </div>
</Slide>
