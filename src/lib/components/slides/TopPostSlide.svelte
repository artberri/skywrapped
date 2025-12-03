<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { linkifyText } from '$lib/utils';
	import { ExternalLink, Heart, Repeat2 } from '@lucide/svelte';
	import AspectRatio from '../AspectRatio.svelte';
	import Butterfly from '../Butterfly.svelte';
	import Slide from '../Slide.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
  let topPost = $derived(wrapped.topPost);

  let linkedText = $derived(topPost?.text ? linkifyText(topPost.text) : '');
</script>

<Slide>
  <Butterfly class="absolute top-12 left-8 text-white/20 animate-float" size="md" />
  <Butterfly class="absolute bottom-16 right-10 text-white/20 animate-float-delayed" size="lg" />

  <div class="relative z-10 text-center space-y-6 md:space-y-8 max-w-2xl w-full">
    <h2 class="text-3xl md:text-5xl font-bold text-white animate-fade-in">
      Your top post
    </h2>

    <div class="bg-white/10 backdrop-blur-md rounded-3xl p-5 md:p-8 border border-white/20 space-y-6 animate-scale-in" style:animation-delay="0.2s">
      {#if topPost?.image}
        <div class="w-full overflow-hidden rounded-2xl">
          <AspectRatio ratio={16 / 9}>
            <img
              src={topPost.image.url}
              alt={topPost.image.alt}
              class="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      {/if}

      <p class="text-lg md:text-2xl text-white leading-relaxed relative pl-8 pr-8 mb-2 mt-2 {topPost?.image ? 'line-clamp-4' : 'line-clamp-8'}">
        {@html linkedText}
      </p>

      <div class="relative flex items-center justify-start md:justify-center gap-6 md:gap-8 pt-4">
        <div class="flex items-center gap-2">
          <Heart class="w-6 h-6 md:w-8 md:h-8 text-pink-300 fill-pink-300" />
          <span class="text-xl md:text-3xl font-bold text-white">
            {topPost?.likes?.toLocaleString()}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <Repeat2 class="w-6 h-6 md:w-8 md:h-8 text-green-300" />
          <span class="text-xl md:text-3xl font-bold text-white">
            {topPost?.reposts?.toLocaleString()}
          </span>
        </div>

        <a
          href="{topPost?.link}"
          target="_blank"
          rel="noopener noreferrer"
          class="pointer-events-auto absolute bottom-0 right-0 p-2 bg-white/20 hover:bg-white/30 rounded-full border border-white/30 backdrop-blur-md transition-colors group"
          aria-label="View post on Bluesky"
        >
          <ExternalLink class="w-4 h-4 text-white" />
        </a>
      </div>
    </div>

    <p class="text-base md:text-xl text-white/70 animate-fade-in" style:animation-delay="0.4s">
      This post resonated with your community
    </p>
  </div>
</Slide>
