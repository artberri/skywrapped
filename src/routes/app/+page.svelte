<script lang="ts">
	import Butterfly from "$lib/components/Butterfly.svelte";
	import Cloud from "$lib/components/Cloud.svelte";
	import Progress from "$lib/components/ui/Progress.svelte";

  let progress = $state(0);
  let messageIndex = $state(0);
  let loadingMessages = [
    "Analyzing your posts...",
    "Counting your followers...",
    "Finding your top moments...",
    "Calculating engagement...",
    "Discovering your topics...",
    "Wrapping up your year...",
  ];
</script>

<style lang="postcss">

</style>

<div class="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[hsl(206,100%,50%)] via-[hsl(195,85%,60%)] to-[hsl(50,100%,75%)]">
  <div class="absolute top-20 left-10 animate-float">
    <Butterfly size="md" class="text-white/30" />
  </div>
  <div class="absolute top-40 right-16 animate-float" style="animation-delay: 0.5s;">
    <Butterfly size="md" class="text-white/30" />
  </div>
  <div class="absolute bottom-40 left-20 animate-float" style="animation-delay: 1s;">
    <Butterfly size="md" class="text-white/30" />
  </div>
  <div class="absolute bottom-20 right-20 animate-float" style="animation-delay: 1.5s;">
    <Butterfly size="sm" class="text-white/30" />
  </div>

  <div class="absolute top-32 right-32 animate-drift">
    <Cloud size="lg" class="text-white/20" />
  </div>
  <div class="absolute bottom-32 left-32 animate-drift" style="animation-delay: 2s;">
    <Cloud size="md" class="text-white/20" />
  </div>

  <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
    <div class="max-w-lg w-full space-y-12 text-center">
      <div class="flex justify-center">
        <div class="animate-spin-slow">
          <Butterfly size="lg" class="text-white" />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg min-h-[3rem] transition-all duration-300">
          {loadingMessages[messageIndex]}
        </h2>
      </div>

      <div class="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
        <Progress value={progress} class="h-3 bg-white/20" />
        <p class="text-white/90 text-lg font-medium mt-4">
          {progress}%
        </p>
      </div>
    </div>
  </div>
</div>
