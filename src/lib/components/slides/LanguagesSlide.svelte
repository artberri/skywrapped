<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Languages } from '@lucide/svelte';
	import Cloud from '../Cloud.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
  let isSingleLanguage = $derived(wrapped.languages.length === 1);
  let primary = $derived(wrapped.languages[0]);
  let others = $derived(wrapped.languages.slice(1, 3));
</script>

<div class="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
  <Cloud class="absolute top-8 left-0 animate-drift" size="lg" />
  <Cloud class="absolute bottom-12 right-0 animate-drift" size="md" style="animation-delay: 3s" />

  <div class="relative z-10 text-center space-y-8 md:space-y-12 max-w-2xl w-full">
    <div class="space-y-4 animate-fade-in">
      <Languages class="w-16 h-16 md:w-24 md:h-24 text-white mx-auto" />
      <h2 class="text-3xl md:text-5xl font-bold text-white">
        {isSingleLanguage ? "You're a language loyalist! 🎯" : "You're multilingual! 🌍"}
      </h2>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 animate-scale-in" style="animation-delay: 0.2s">
      <div class="text-7xl md:text-9xl font-bold text-white mb-4">
        {primary.percentage}%
      </div>
      <div class="text-lg md:text-2xl text-white/80">
        {isSingleLanguage
          ? `All your posts are in ${primary.name}! 🎉`
          : `of your posts shine in ${primary.name} ✨`
        }
      </div>
    </div>

    <div class="space-y-3 animate-fade-in" style="animation-delay: 0.4s">
      {#if isSingleLanguage}
          <p class="text-xl md:text-2xl text-white/90">
            Keeping it consistent and clear! 💬
          </p>
          <p class="text-base md:text-lg text-white/70">
            Your followers always know what to expect
          </p>
      {:else}
          <p class="text-xl md:text-2xl text-white/90">
            You also sprinkle in some:
          </p>
          <div class="flex items-center justify-center gap-4 flex-wrap">
            {#each others as lang}
              <div class="text-base md:text-lg text-white/70 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span class="font-bold">{lang.name}</span> {lang.percentage}% 🗣️
              </div>
            {/each}
          </div>
      {/if}
    </div>
  </div>
</div>
