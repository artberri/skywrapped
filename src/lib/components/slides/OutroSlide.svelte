<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Check, CirclePlus, Copy, Share, Share2, Sparkles } from '@lucide/svelte';
	import Butterfly from '../Butterfly.svelte';
	import Button from '../Button.svelte';
	import Cloud from '../Cloud.svelte';
	import Slide from '../Slide.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped: _ }: PageProps = $props();

  let copied = $state(false);

  const handleShareBluesky = () => {
    const shareUrl = window.location.href;
    const texts = [`Check out my Bluesky Wrapped! 🦋`, `My Bluesky Wrapped just dropped 🦋✨`];
    const text = texts[Math.floor(Math.random() * texts.length)];
    const blueskyShareUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(text + " " + shareUrl)}`;
    window.open(blueskyShareUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    copied = true;
    setTimeout(() => copied = false, 2000);
  };

  const handleCreateYourOwn = () => {
    goto("/");
  };
</script>

<Slide>
  <Butterfly class="absolute top-16 left-8 text-white animate-float" size="sm" />
  <Butterfly class="absolute top-24 right-12 text-white animate-float-delayed" size="md" />
  <Butterfly class="absolute bottom-32 left-16 text-white animate-float" size="lg" />
  <Butterfly class="absolute bottom-20 right-20 text-white animate-float-delayed" size="sm" />

  <Cloud class="absolute top-8 animate-drift" size="md" />
  <Cloud class="absolute bottom-12 animate-drift" size="lg" style="animation-delay: 6s" />

  <div class="relative z-10 text-center space-y-8 md:space-y-10 max-w-2xl">
    <Sparkles class="w-16 h-16 md:w-20 md:h-20 text-white mx-auto animate-fade-in" />

    <div class="space-y-4 animate-fade-in" style:animation-delay="0.2s">
      <h2 class="text-4xl md:text-6xl font-bold text-white">
        Thank you for flying with us
      </h2>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 animate-scale-in space-y-6" style="animation-delay: 0.6s">
      <div class="space-y-3">
        <Share2 class="w-10 h-10 md:w-12 md:h-12 text-white mx-auto" />
        <h3 class="text-2xl md:text-3xl font-bold text-white">
          Share Your Wrapped!
        </h3>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onclick={handleShareBluesky}
          class="pointer-events-auto relative z-50 bg-gradient-to-r from-[hsl(206,100%,50%)] to-[hsl(268,70%,65%)] hover:from-[hsl(206,100%,45%)] hover:to-[hsl(268,70%,60%)] text-white border-1 border-white/50 h-12 flex-1 sm:flex-initial font-semibold shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Share class="w-5 h-5 mr-2" />
          Share on Bluesky
        </Button>

        <Button
          onclick={handleCopyLink}
          class="pointer-events-auto relative z-50 bg-white hover:bg-white/95 text-[hsl(206,100%,40%)] border-2 border-white h-12 flex-1 sm:flex-initial font-semibold shadow-lg hover:scale-105 transition-all duration-300"
        >
        {#if copied}
          <Check class="w-5 h-5 mr-2" />
          Copied!
        {:else}
          <Copy class="w-5 h-5 mr-2" />
          Copy Link
        {/if}
        </Button>

        <Button
          onclick={handleCreateYourOwn}
          class="pointer-events-auto relative z-50 bg-white hover:bg-white/95 text-[hsl(268,70%,55%)] border-2 border-white h-12 flex-1 sm:flex-initial font-semibold shadow-lg hover:scale-105 transition-all duration-300"
        >
          <CirclePlus class="w-5 h-5 mr-2" />
          Create your own!
        </Button>
      </div>

      <div class="pt-4 border-t border-white/20">
        <p class="text-sm md:text-base text-white/90">
          Built by <a target="_blank" rel="noopener noreferrer" href="https://bsky.app/profile/albertovarela.net" class="text-white/90 hover:text d-white">@albertovarela.net</a>
        </p>
      </div>
    </div>
  </div>
</Slide>
