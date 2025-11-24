<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Bookmark, Heart, MessageCircle, MessageSquareQuote, Repeat2 } from '@lucide/svelte';
	import Butterfly from '../Butterfly.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
</script>

<div class="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
  <Butterfly class="absolute top-12 right-8 animate-float" size="md" />
  <Butterfly class="absolute bottom-16 left-8 animate-float" size="sm" style="animation-delay: 2s" />

  <div class="relative z-10 text-center space-y-6 md:space-y-8 max-w-5xl w-full">
    <div class="space-y-2 animate-fade-in">
      <h2 class="text-3xl md:text-5xl font-bold text-white">
        Engagement Vibes
      </h2>
      <p class="text-lg md:text-xl text-white/80">
        Here’s the love you got this year.
      </p>
    </div>

    <div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 md:p-12 border-2 border-white/30 animate-scale-in">
      <Heart class="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4 fill-white/20" />
      <div class="text-5xl md:text-7xl font-bold text-white mb-2">
        {wrapped.engagement.likes.toLocaleString()}
      </div>
      <div class="text-l md:text-xl text-white/90 font-medium">
        Likes Received
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-fade-in" style="animation-delay: 0.2s">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20">
        <Repeat2 class="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-2" />
        <div class="text-2xl md:text-3xl font-bold text-white">
          {wrapped.engagement.reposts.toLocaleString()}
        </div>
        <div class="text-xs md:text-sm text-white/70 mt-1">
          Reposts
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20">
        <MessageSquareQuote class="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-2" />
        <div class="text-2xl md:text-3xl font-bold text-white">
          {wrapped.engagement.quotes.toLocaleString()}
        </div>
        <div class="text-xs md:text-sm text-white/70 mt-1">
          Quotes
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20">
        <Bookmark class="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-2" />
        <div class="text-2xl md:text-3xl font-bold text-white">
          {wrapped.engagement.bookmarks.toLocaleString()}
        </div>
        <div class="text-xs md:text-sm text-white/70 mt-1">
          Bookmarks
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20">
        <MessageCircle class="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-2" />
        <div class="text-2xl md:text-3xl font-bold text-white">
          {wrapped.engagement.replies.toLocaleString()}
        </div>
        <div class="text-xs md:text-sm text-white/70 mt-1">
          Replies
        </div>
      </div>
    </div>
  </div>
</div>
