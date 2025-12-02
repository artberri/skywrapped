<script lang="ts">
	import ProgressBar from "$lib/components/ProgressBar.svelte";
	import BestTimeSlide from "$lib/components/slides/BestTimeSlide.svelte";
	import EngagementSlide from "$lib/components/slides/EngagementSlide.svelte";
	import HashtagsSlide from "$lib/components/slides/HashtagsSlide.svelte";
	import InteractionsSlide from "$lib/components/slides/InteractionsSlide.svelte";
	import IntroSlide from "$lib/components/slides/IntroSlide.svelte";
	import LanguagesSlide from "$lib/components/slides/LanguagesSlide.svelte";
	import OutroSlide from "$lib/components/slides/OutroSlide.svelte";
	import ProfileOverviewSlide from "$lib/components/slides/ProfileOverviewSlide.svelte";
	import TopPostSlide from "$lib/components/slides/TopPostSlide.svelte";
	import YourActivityByDaySlide from "$lib/components/slides/YourActivityByDaySlide.svelte";
	import YourActivitySlide from "$lib/components/slides/YourActivitySlide.svelte";
	import { cn, downloadElementAsImage } from "$lib/utils";
	import { ChevronLeft, ChevronRight, Download } from '@lucide/svelte';
	import type { TouchEventHandler } from "svelte/elements";
	import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let { wrapped } = $derived(data);

  let allSlides = $derived([
    { type: 'intro', gradient: 'gradient-sky', component: IntroSlide, show: true },
    { type: 'profile-overview', gradient: 'gradient-dawn', component: ProfileOverviewSlide, show: true },
    { type: 'your-activity', gradient: 'gradient-sunset', component: YourActivitySlide, show: true },
    { type: 'best-time', gradient: 'gradient-coral', component: BestTimeSlide, show: true },
    { type: 'your-activity-by-day', gradient: 'gradient-midnight', component: YourActivityByDaySlide, show: true },
    { type: 'languages', gradient: 'gradient-dawn', component: LanguagesSlide, show: wrapped.languages.length > 0 ? true : false },
    { type: 'hashtags', gradient: 'gradient-sky', component: HashtagsSlide, show: wrapped.hashtags.length > 0 ? true : false },
    { type: 'engagement', gradient: 'gradient-ocean', component: EngagementSlide, show: true },
    { type: 'top-post', gradient: 'gradient-midnight', component: TopPostSlide, show: wrapped.topPost ? true : false },
    { type: 'interactions', gradient: 'gradient-coral', component: InteractionsSlide, show: wrapped.connections.length > 0 ? true : false },
    { type: 'outro', gradient: 'gradient-sunset', component: OutroSlide, show: true },
  ] as const);
  let slides = $derived(allSlides.filter((slide) => slide.show));

  let currentSlide = $state(0);
  let slideContainer: HTMLDivElement | undefined = undefined;
  let touchStart = $state(0);
  let touchEnd = $state(0);

  let nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      currentSlide = currentSlide + 1;
    }
  };

  let prevSlide = () => {
    if (currentSlide > 0) {
      currentSlide = currentSlide - 1;
    }
  };

  let handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    touchStart = e.targetTouches[0]?.clientX ?? 0;
    touchEnd = 0
  };

  let handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    touchEnd = e.targetTouches[0]?.clientX ?? 0;
  };

  let handleTouchEnd = () => {
      if (touchStart - touchEnd > 75 && touchStart !== 0 && touchEnd !== 0) {
        nextSlide();
        touchStart = 0;
        touchEnd = 0;
      }
      if (touchStart - touchEnd < -75 && touchStart !== 0 && touchEnd !== 0) {
        prevSlide();
        touchStart = 0;
        touchEnd = 0;
      }
  };

  let currentSlideData = $derived(slides[currentSlide]);
  let CurrentSlideComponent = $derived(currentSlideData?.component);

  let handleDownload = $derived(async () => {
    if (!slideContainer) {
      return;
    }

    const slideName = `${wrapped.handle}-${currentSlideData?.type ?? 'unknown'}-${wrapped.year}`;
    await downloadElementAsImage(slideContainer, slideName);
  });
</script>

<svelte:head>
	<title>{wrapped.displayName}'s year on Bluesky - Sky Wrapped</title>
	<meta name="description" content="{wrapped.displayName}'s year on Bluesky. You can also get your own Bluesky Wrapped! Discover your personalized year in review with top posts, favorite moments, and social stats from your Bluesky activity.">
	<meta itemprop="name" content="{wrapped.displayName}'s year on Bluesky - Sky Wrapped">
	<meta itemprop="description" content="{wrapped.displayName}'s year on Bluesky. You can also get your own Bluesky Wrapped! Discover your personalized year in review with top posts, favorite moments, and social stats from your Bluesky activity.">
	<meta itemprop="image" content="https://skywrapped.app/2025/{wrapped.handle}/og.png">
	<meta property="og:title" content="{wrapped.displayName}'s year on Bluesky - Sky Wrapped">
	<meta property="og:description" content="{wrapped.displayName}'s year on Bluesky. You can also get your own Bluesky Wrapped! Discover your personalized year in review with top posts, favorite moments, and social stats from your Bluesky activity.">
	<meta property="og:image" content="https://skywrapped.app/2025/{wrapped.handle}/og.png">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="628">
</svelte:head>

<div class="fixed inset-0 w-full h-full overflow-hidden">
  <div
    bind:this={slideContainer}
    class={cn(
      "relative w-full h-full transition-all duration-700 ease-in-out",
      currentSlideData?.gradient ?? 'gradient-sky'
    )}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
  >
    <div class="absolute top-0 left-0 right-0 z-20 p-4 md:p-6" data-ui-overlay>
      <ProgressBar total={slides.length} current={currentSlide} />
    </div>

    <div class="w-full h-full z-15 pointer-events-none">
      <CurrentSlideComponent wrapped={wrapped} />
    </div>

    <div class="hidden md:block" data-ui-overlay>
      {#if currentSlide > 0}
        <button
          onclick={prevSlide}
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 border border-white/20 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft class="w-8 h-8 text-white" />
        </button>
      {/if}

      {#if currentSlide < slides.length - 1}
        <button
          onclick={nextSlide}
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 border border-white/20 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight class="w-8 h-8 text-white" />
        </button>
      {/if}
    </div>

    <div class="md:hidden absolute inset-0 z-0 flex" data-ui-overlay>
      <button
        onclick={prevSlide}
        class="flex-1"
        aria-label="Previous slide"
        disabled={currentSlide === 0}
      ></button>
      <button
        onclick={nextSlide}
        class="flex-1"
        aria-label="Next slide"
        disabled={currentSlide === slides.length - 1}
      ></button>
    </div>

    <div class="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3" data-ui-overlay>
      <button
        onclick={handleDownload}
        class="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2.5 transition-all duration-300 border border-white/20 cursor-pointer"
        aria-label="Download slide"
        title="Download slide as image"
      >
        <Download class="w-5 h-5 text-white" />
      </button>
      <div class="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
        <span class="text-white text-sm md:text-base font-medium">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>
    </div>
  </div>
</div>
