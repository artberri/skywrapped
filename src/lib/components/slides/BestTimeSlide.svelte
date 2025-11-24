<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Calendar, Clock } from '@lucide/svelte';
	import Butterfly from '../Butterfly.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
  let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
  let mostActiveDay = $derived(daysOfWeek[wrapped.bestTime.mostActiveDay]);
  let peakPostingHour = $derived(wrapped.bestTime.peakPostingHour > 12 ? wrapped.bestTime.peakPostingHour - 12 : wrapped.bestTime.peakPostingHour);
  let peakPostingHourSuffix = $derived(wrapped.bestTime.peakPostingHour > 12 ? 'PM' : 'AM');
</script>

<div class="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
  <Butterfly class="absolute top-20 right-16 text-white/30 animate-float" size="lg" />
  <Butterfly class="absolute bottom-24 left-12 text-white/30 animate-float-delayed" size="md" />

  <div class="relative z-10 text-center space-y-8 md:space-y-10 max-w-2xl w-full">
    <h2 class="text-3xl md:text-5xl font-bold text-white animate-fade-in">
      When you soar
    </h2>

    <div class="space-y-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 animate-scale-in" style:animation-delay="0.1s">
        <Calendar class="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4" />
        <div class="text-base md:text-xl text-white/80 mb-2">
          Most active day
        </div>
        <div class="text-3xl md:text-5xl font-bold text-white">
          {mostActiveDay}
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 animate-scale-in" style:animation-delay="0.2s">
        <Clock class="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4" />
        <div class="text-base md:text-xl text-white/80 mb-2">
          Peak posting time
        </div>
        <div class="text-3xl md:text-5xl font-bold text-white">
          {peakPostingHour} {peakPostingHourSuffix}
        </div>
      </div>
    </div>

    <p class="text-xl md:text-3xl text-white/90 animate-fade-in mb-2" style:animation-delay="0.3s">
      You averaged <strong>{wrapped.bestTime.averagePostsPerDay}</strong> post a day
    </p>

    <p class="text-base md:text-xl text-white/70 animate-fade-in" style:animation-delay="0.4s">
      A rhythm that suits you
    </p>
  </div>
</div>
