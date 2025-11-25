<script lang="ts">
	import ProgressBar from "$lib/components/ProgressBar.svelte";
	import BestTimeSlide from "$lib/components/slides/BestTimeSlide.svelte";
	import EngagementSlide from "$lib/components/slides/EngagementSlide.svelte";
	import IntroSlide from "$lib/components/slides/IntroSlide.svelte";
	import LanguagesSlide from "$lib/components/slides/LanguagesSlide.svelte";
	import OutroSlide from "$lib/components/slides/OutroSlide.svelte";
	import ProfileOverviewSlide from "$lib/components/slides/ProfileOverviewSlide.svelte";
	import TopPostSlide from "$lib/components/slides/TopPostSlide.svelte";
	import YourActivitySlide from "$lib/components/slides/YourActivitySlide.svelte";
	import { cn, downloadElementAsImage } from "$lib/utils";
	import { ChevronLeft, ChevronRight, Download } from '@lucide/svelte';
	import type { TouchEventHandler } from "svelte/elements";
	import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let { wrapped } = data;

  let allSlides = $derived([
    { type: 'intro', gradient: 'sky', component: IntroSlide, show: true },
    { type: 'profile-overview', gradient: 'dawn', component: ProfileOverviewSlide, show: true },
    { type: 'your-activity', gradient: 'sunset', component: YourActivitySlide, show: true },
    { type: 'languages', gradient: 'ocean', component: LanguagesSlide, show: wrapped.languages.length > 0 ? true : false },
    { type: 'best-time', gradient: 'midnight', component: BestTimeSlide, show: true },
    { type: 'engagement', gradient: 'ocean', component: EngagementSlide, show: true },
    { type: 'top-post', gradient: 'sky', component: TopPostSlide, show: wrapped.topPost ? true : false },
    { type: 'outro', gradient: 'sunset', component: OutroSlide, show: true },
  ] as const);
  let slides = $derived(allSlides.filter((slide) => slide.show));

  let currentSlide = $state(0);
  let slideContainer: HTMLDivElement | undefined = undefined;
  let gradientStyles = {
    sky: 'bg-gradient-to-br from-[hsl(206,100%,50%)] to-[hsl(268,70%,65%)]',
    sunset: 'bg-gradient-to-b from-[hsl(340,80%,65%)] via-[hsl(268,70%,65%)] to-[hsl(206,100%,50%)]',
    dawn: 'bg-gradient-to-b from-[hsl(206,100%,50%)] via-[hsl(200,90%,55%)] to-[hsl(195,85%,60%)]',
    midnight: 'bg-gradient-to-br from-[hsl(230,40%,20%)] to-[hsl(268,50%,30%)]',
    ocean: 'bg-gradient-to-br from-[hsl(190,85%,40%)] via-[hsl(210,80%,50%)] to-[hsl(240,70%,55%)]',
  };

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
    touchStart = e.targetTouches[0].clientX;
    touchEnd = 0
  };

  let handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    touchEnd = e.targetTouches[0].clientX;
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

  let handleDownload = async () => {
    if (!slideContainer) {
      return;
    }

    const slideName = `${wrapped.handle}-${currentSlideData.type}-${wrapped.year}`;
    await downloadElementAsImage(slideContainer, slideName);
  };

  let currentSlideData = $derived(slides[currentSlide]);
  let CurrentSlideComponent = $derived(currentSlideData.component);
</script>

<style lang="postcss">

</style>

<div class="fixed inset-0 w-full h-full overflow-hidden">
  <div
    bind:this={slideContainer}
    class={cn(
      "relative w-full h-full transition-all duration-700 ease-in-out",
      gradientStyles[currentSlideData.gradient]
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
