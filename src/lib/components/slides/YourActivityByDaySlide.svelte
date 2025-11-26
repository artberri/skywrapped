<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import Butterfly from '../Butterfly.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
  const getYearDays = (year: number) => {
    const startOfYear = new Date(year, 0, 0);
    const endOfYear = new Date(year, 11, 31);
    const diff = endOfYear.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const days = Math.floor(diff / oneDay);
    return Array.from({ length: days }, (_, i) => i + 1);
  }
  let yearDays = $derived(getYearDays(wrapped.year));

  const getActivityColor = (maxInDay: number, count?: number) => {
    if (count === undefined || count === 0) {return "bg-white/10";}
    if (count <= maxInDay * 0.2) {return "bg-blue-400/40";}
    if (count <= maxInDay * 0.4) {return "bg-blue-400/60";}
    if (count <= maxInDay * 0.6) {return "bg-blue-400/80";}
    return "bg-blue-400";
  };

  let activeDays = $derived(Object.values(wrapped.yearActivity.byDay).length);
  let activityRate = $derived((activeDays / yearDays.length) * 100);
  let maxInDay = $derived(Math.max(...Object.values(wrapped.yearActivity.byDay)) ?? 0);

  // Get playful message based on activity rate
  const getActivityMessage = (rate: number) => {
    if (rate >= 80) {return "You were practically living here! 🔥";}
    if (rate >= 60) {return "Your consistency is inspiring! ✨";}
    if (rate >= 40) {return "You kept the vibe alive! 🎨";}
    if (rate >= 20) {return "Quality over quantity! 💎";}
    return "Every post counts! 🌟";
  };

</script>

<div class="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
  <Butterfly size="lg" class="absolute top-[8%] right-[15%] animate-float text-white/50" />
  <Butterfly size="md" class="absolute bottom-[5%] left-[8%] animate-float text-white/50" style="animation-delay: 0.5s" />

  <div class="max-w-6xl w-full space-y-4 md:space-y-8 animate-fade-in pointer-events-auto flex flex-col items-center">
    <div class="text-center space-y-2 md:space-y-3 px-2">
      <h2 class="text-3xl md:text-6xl font-bold text-white">
        Every Day Tells a Story 📅
      </h2>
      <p class="text-lg md:text-2xl text-white/90">
        {getActivityMessage(activityRate)}
      </p>
    </div>

    <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 w-full max-w-4xl">
      <div class="flex flex-wrap gap-1 justify-center items-center">
        {#each yearDays as day}
          <div
            class={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm transition-all duration-200 ${getActivityColor(maxInDay, wrapped.yearActivity.byDay[day])}`}
            title={`Day ${day}: ${wrapped.yearActivity.byDay[day]} activities`}
          ></div>
        {/each}
      </div>
    </div>

    <div class="flex items-center gap-2 text-white/70 text-xs md:text-sm justify-center px-2">
      <span>Less</span>
      <div class="flex gap-1">
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-white/10"></div>
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-blue-400/40"></div>
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-blue-400/60"></div>
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-blue-400/80"></div>
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-blue-400"></div>
      </div>
      <span>More</span>
    </div>
  </div>
</div>
