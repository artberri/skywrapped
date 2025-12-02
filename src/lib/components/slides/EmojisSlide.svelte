<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import Butterfly from '../Butterfly.svelte';
	import Slide from '../Slide.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();

  let champion = $derived(wrapped.emojis.champions[0]);
  let second = $derived(wrapped.emojis.champions[1]);
  let third = $derived(wrapped.emojis.champions[2]);
  let honorableMentions = $derived(wrapped.emojis.champions.slice(3));
</script>

<Slide>
  <Butterfly
        class="absolute top-20 left-8 text-white/30 animate-float"
        size="md"
        style="animation-delay: 0.5s"
      />
      <Butterfly
        class="absolute bottom-32 right-10 text-white/20 animate-float"
        size="sm"
        style="animation-delay: 2s"
      />

      <div class="text-center mb-6 md:mb-8">
        <h2 class="text-2xl md:text-4xl font-bold text-white mb-2">
          Your Emoji Champions 🏆
        </h2>
        <p class="text-white/70 text-sm md:text-base">
          The expressions that defined your year
        </p>
      </div>

      <div class="flex items-end justify-center gap-2 md:gap-4 mb-6">
        {#if second}
          <div
            class="flex flex-col items-center animate-scale-in"
            style="animation-delay: 0.2s"
          >
            <div class="relative mb-2">
              <div class="text-4xl md:text-5xl animate-bounce" style="animation-delay: 0.4s; animation-duration: 2s">
                {second.emoji}
              </div>
            </div>
            <div class="w-20 md:w-28 h-18 md:h-20 bg-gradient-to-b from-gray-300/30 to-gray-400/20 backdrop-blur-sm rounded-t-lg border border-white/20 flex flex-col items-center justify-end">
              <p class="text-white font-bold text-lg md:text-xl"><small>x</small>{second.count}</p>
              <p class="text-white/60 text-xs mb-2">#2</p>
            </div>
          </div>
        {/if}

        {#if champion}
          <div
            class="flex flex-col items-center justify-end animate-scale-in"
            style="animation-delay: 0s"
          >
            <div class="relative mb-2">
              <div
                class="text-5xl md:text-7xl animate-bounce"
                style="animation-delay: 0.2s; animation-duration: 2s; filter: drop-shadow(0 0 20px rgba(255,215,0,0.5))"
              >
                {champion.emoji}
              </div>
            </div>
            <div class="w-24 md:w-32 h-24 md:h-28 bg-gradient-to-b from-yellow-400/30 to-yellow-600/20 backdrop-blur-sm rounded-t-lg border border-yellow-400/30 flex flex-col items-center justify-end">
              <p class="text-white font-bold text-xl md:text-2xl"><small>x</small>{champion.count}</p>
              <p class="text-yellow-300 text-xs font-semibold mt-1 mb-2">👑 Champion</p>
            </div>
          </div>
          {/if}

        {#if third}
          <div
            class="flex flex-col items-center animate-scale-in"
            style="animation-delay: 0.4s"
          >
            <div class="relative mb-2">
              <div class="text-4xl md:text-5xl animate-bounce" style="animation-delay: 0.6s; animation-duration: 2s">
                {third.emoji}
              </div>
            </div>
            <div class="w-20 md:w-28 h-14 md:h-16 bg-gradient-to-b from-orange-600/30 to-orange-700/20 backdrop-blur-sm rounded-t-lg border border-orange-500/30 flex flex-col items-center justify-end">
              <p class="text-white font-bold text-lg md:text-xl"><small>x</small>{third.count}</p>
              <p class="text-white/60 text-xs mb-2">#3</p>
            </div>
          </div>
          {/if}
      </div>

      {#if honorableMentions.length > 0}
        <div class="flex gap-3 md:gap-4 mb-6">
          {#each honorableMentions as emoji, index}
            <div
              class="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 flex items-center gap-3 animate-scale-in"
              style="animation-delay: {0.6 + index * 0.2}s"
            >
              <span class="text-2xl md:text-3xl">{emoji.emoji}</span>
              <div>
                <p class="text-white font-bold text-sm md:text-base"><small>x</small>{emoji.count}</p>
                <p class="text-white/50 text-xs">#{index + 4}</p>
              </div>
            </div>
          {/each}
        </div>
        {/if}

      <div class="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
        <p class="text-white/90 text-sm md:text-base">
          <span class="font-bold text-white">{wrapped.emojis.total.toLocaleString()}</span> emojis used this year
        </p>
      </div>
</Slide>
