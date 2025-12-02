<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Bookmark, Heart, MessageSquare, PenLine, Quote, Repeat2 } from '@lucide/svelte';
	import Butterfly from '../Butterfly.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
  let stats = $derived([
    { label: "Posts", value: wrapped.yearActivity.posts.toLocaleString(), icon: PenLine },
    { label: "Replies", value: wrapped.yearActivity.replies.toLocaleString(), icon: MessageSquare },
    { label: "Reposts", value: wrapped.yearActivity.reposts.toLocaleString(), icon: Repeat2 },
    { label: "Quotes", value: wrapped.yearActivity.quotes.toLocaleString(), icon: Quote },
    { label: "Likes", value: wrapped.yearActivity.likes.toLocaleString(), icon: Heart },
    { label: "Bookmarks", value: wrapped.yearActivity.bookmarks.toLocaleString(), icon: Bookmark },
  ]);
</script>

<div class="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
  <Butterfly class="absolute top-16 right-12 text-white/30 animate-float" size="lg" />
  <Butterfly class="absolute bottom-20 left-8 text-white/30 animate-float-delayed" size="md" />

  <div class="relative z-10 text-center space-y-6 md:space-y-8 max-w-4xl w-full">
    <h2 class="text-3xl md:text-5xl font-bold text-white animate-fade-in mb-2">
      Your Year in the Sky
    </h2>

    <p class="text-lg md:text-xl text-white/80 animate-fade-in" style:animation-delay="0.1s">
      Here’s how you spent it
    </p>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      {#each stats as stat, index}
        <div
          class="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 animate-scale-in"
          style:animation-delay={`${index * 0.1 + 0.2}s`}
        >
          <stat.icon class="w-6 h-6 md:w-8 md:h-8 text-white/60 mx-auto mb-2" />
          <div class="text-3xl md:text-5xl font-bold text-white mb-1">
            {stat.value}
          </div>
          <div class="text-sm md:text-base text-white/70">
            {stat.label}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
