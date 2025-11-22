<script lang="ts">
	import ProgressBar from "$lib/components/ProgressBar.svelte";
	import IntroSlide from "$lib/components/slides/IntroSlide.svelte";
	import OutroSlide from "$lib/components/slides/OutroSlide.svelte";
	import ProfileOverviewSlide from "$lib/components/slides/ProfileOverviewSlide.svelte";
	import { cn } from "$lib/utils";
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import type { TouchEventHandler } from "svelte/elements";
	import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let { wrapped } = data;

  let slides = [
    { id: 1, type: 'intro', gradient: 'sky', component: IntroSlide },
    { id: 2, type: 'profile-overview', gradient: 'dawn', component: ProfileOverviewSlide },
    { id: 3, type: 'outro', gradient: 'sunset', component: OutroSlide },
  ] as const;

  let currentSlide = $state(0);
  let gradientStyles = {
    sky: 'bg-gradient-to-br from-[hsl(206,100%,50%)] to-[hsl(268,70%,65%)]',
    sunset: 'bg-gradient-to-b from-[hsl(340,80%,65%)] via-[hsl(268,70%,65%)] to-[hsl(206,100%,50%)]',
    dawn: 'bg-gradient-to-b from-[hsl(206,100%,50%)] via-[hsl(195,85%,60%)] to-[hsl(50,100%,75%)]',
    midnight: 'bg-gradient-to-br from-[hsl(230,40%,20%)] to-[hsl(268,50%,30%)]',
  };

  let touchStart = $state(0);
  let touchEnd = $state(0);

  let nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      currentSlide = currentSlide + 1;
      console.log("nextSlide");
    }
  };

  let prevSlide = () => {
    if (currentSlide > 0) {
      currentSlide = currentSlide - 1;
      console.log("prevSlide");
    }
  };

  let handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    touchStart = e.targetTouches[0].clientX;
    touchEnd = 0
    console.log("touchStart", touchStart);
  };

  let handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    touchEnd = e.targetTouches[0].clientX;
    console.log("touchEnd", touchEnd);
  };

  let handleTouchEnd = () => {
      if (touchStart - touchEnd > 75 && touchStart !== 0 && touchEnd !== 0) {
        console.log("touchStart - touchEnd", touchStart - touchEnd);
        console.log("nextSlide on touch end");
        nextSlide();
        touchStart = 0;
        touchEnd = 0;
      }
      if (touchStart - touchEnd < -75 && touchStart !== 0 && touchEnd !== 0) {
        console.log("touchStart - touchEnd", touchStart - touchEnd);
        console.log("prevSlide on touch end");
        prevSlide();
        touchStart = 0;
        touchEnd = 0;
      }
  };

  let currentSlideData = $derived(slides[currentSlide]);
  let CurrentSlideComponent = $derived(currentSlideData.component);
</script>

<style lang="postcss">

</style>

<div class="fixed inset-0 w-full h-full overflow-hidden">
  <div
    class={cn(
      "relative w-full h-full transition-all duration-700 ease-in-out",
      gradientStyles[currentSlideData.gradient]
    )}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
  >
    <div class="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
      <ProgressBar total={slides.length} current={currentSlide} />
    </div>

    <div class="w-full h-full">
      <CurrentSlideComponent wrapped={wrapped} />
    </div>

    <div class="hidden md:block">
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

    <div class="md:hidden absolute inset-0 z-10 flex">
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

    <div class="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
      <span class="text-white text-sm md:text-base font-medium">
        {currentSlide + 1} / {slides.length}
      </span>
    </div>
  </div>
</div>

<!--<div class="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[hsl(206,100%,50%)] via-[hsl(195,85%,60%)] to-[hsl(50,100%,75%)]">
  <h1>{wrapped.handle}</h1>
  <p>{wrapped.year}</p>
  <p>{wrapped.current.posts}</p>
  <p>{wrapped.current.following}</p>
  <p>{wrapped.current.followers}</p>
  <p>{wrapped.current.accountAge}</p>
</div>-->
