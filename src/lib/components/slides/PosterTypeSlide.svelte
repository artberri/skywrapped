<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import Butterfly from '../Butterfly.svelte';
	import Slide from '../Slide.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  const COLORS = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399'];

  const typeLabels = {
    posts: 'Original Posts',
    replies: 'Replies',
    reposts: 'Reposts',
    quotes: 'Quote Posts',
  } as const;

  const typeEmojis = {
    posts: '✨',
    replies: '💬',
    reposts: '🔄',
    quotes: '🎤',
  } as const;

  const personalities = {
    posts: {
      title: "Original Creator",
      description: "You love sharing your own thoughts!",
    },
    replies: {
      title: "Conversationalist",
      description: "You thrive on connecting with others!",
    },
    reposts: {
      title: "Curator",
      description: "You have an eye for great content!",
    },
    quotes: {
      title: "Commentator",
      description: "You add your perspective to everything!",
    },
  } as const;

  let { wrapped }: PageProps = $props();

  let total = $derived(wrapped.yearActivity.posts + wrapped.yearActivity.replies + wrapped.yearActivity.reposts + wrapped.yearActivity.quotes );
  let data = $derived([
    { type: 'posts' as const, label: 'Posts', value: wrapped.yearActivity.posts, percentage: Math.round((wrapped.yearActivity.posts / total) * 100) },
    { type: 'replies' as const, label: 'Replies', value: wrapped.yearActivity.replies, percentage: Math.round((wrapped.yearActivity.replies / total) * 100) },
    { type: 'reposts' as const, label: 'Reposts', value: wrapped.yearActivity.reposts, percentage: Math.round((wrapped.yearActivity.reposts / total) * 100) },
    { type: 'quotes' as const, label: 'Quotes', value: wrapped.yearActivity.quotes, percentage: Math.round((wrapped.yearActivity.quotes / total) * 100) },
  ].sort((a, b) => b.percentage - a.percentage));

  const dominant = $derived(data[0]!);
  const personality = $derived(personalities[dominant.type]);
  const dominantPercentage = $derived(Math.round((dominant.value / total) * 100));
</script>

<Slide>
  <Butterfly size="lg" class="absolute top-[12%] left-[8%] text-white/40 animate-float" />
      <Butterfly size="md" class="absolute bottom-[25%] right-[10%] text-white/30 animate-float" />
      <Butterfly size="sm" class="absolute top-[55%] left-[15%] text-white/25 animate-float" />

      <div class="max-w-4xl w-full space-y-4 md:space-y-6 animate-fade-in pointer-events-auto">
        <div class="text-center space-y-2">
          <h2 class="text-3xl md:text-5xl font-bold text-white">
            You're a {personality.title}! {typeEmojis[dominant.type]}
          </h2>
          <p class="text-sm md:text-base text-white/60">
            {personality.description}
          </p>
        </div>

        <div class="space-y-3 md:space-y-4">
          {#each data as item, index}
              <div
                class={`relative overflow-hidden rounded-xl md:rounded-2xl border transition-all duration-300 ${
                  index === 0
                    ? 'bg-white/20 border-white/40 shadow-lg shadow-white/10'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm"
                  style:width={`${item.percentage}%`}
                ></div>
                <div class="relative flex items-center justify-between p-3 md:p-4">
                  <div class="flex items-center gap-3">
                    <span class="text-xl md:text-2xl">{typeEmojis[item.type]}</span>
                    <div>
                      <p class={`font-semibold text-sm md:text-base ${index === 0 ? 'text-white' : 'text-white/90'}`}>
                        {item.label}
                      </p>
                      <p class="text-xs text-white/60">{item.value.toLocaleString()} total</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class={`text-xl md:text-2xl font-bold ${index === 0 ? 'text-white' : 'text-white/90'}`}>
                      {item.percentage}%
                    </p>
                  </div>
                </div>

                <div
                  class="h-1 bg-gradient-to-r opacity-80"
                  style:width={`${item.percentage}%`}
                  style:background={`linear-gradient(to right, ${COLORS[index]}, ${COLORS[index]}88)`}
                ></div>
              </div>
          {/each}
        </div>

        <div class="text-center">
          <p class="text-sm md:text-base text-white/60">
            {dominantPercentage}% of your activity was {typeLabels[dominant.type].toLowerCase()}
          </p>
        </div>
      </div>
</Slide>
