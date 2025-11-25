<script lang="ts">
	import Butterfly from '$lib/components/Butterfly.svelte';
	import Button from '$lib/components/Button.svelte';
	import Cloud from '$lib/components/Cloud.svelte';
	import Input from '$lib/components/Input.svelte';
	import '../app.css';
	import type { PageProps } from './$types';

  let { form }: PageProps = $props();
  let hasStartedTyping = $state(false);
</script>

<style lang="postcss">
  @reference "tailwindcss";
</style>

<div class="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-[hsl(206,100%,50%)] to-[hsl(268,70%,65%)]">
  <div class="absolute top-10 left-10 animate-float">
    <Butterfly size="md" class="text-white/20" />
  </div>
  <div class="absolute top-20 right-20 animate-drift">
    <Cloud size="md" class="text-white/10" />
  </div>
  <div class="absolute bottom-20 left-20 animate-drift" style="animation-delay: 2s;">
    <Cloud size="md" class="text-white/10" />
  </div>
  <div class="absolute bottom-32 right-32 animate-float" style="animation-delay: 1s;">
    <Butterfly size="sm" class="text-white/20" />
  </div>

  <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
    <div class="max-w-md w-full space-y-6 text-center">
      <div class="flex justify-center">
        <Butterfly size="lg" class="text-white animate-float" />
      </div>

      <div class="space-y-2">
        <h1 class="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Sky Wrapped
        </h1>
        <p class="text-xl md:text-2xl text-white/90">
          Your year on Bluesky wrapped in a butterfly
        </p>
      </div>

      <form class="space-y-6 mt-12" method="POST">
        <div class="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
          <label for="handle" class="block text-white text-lg font-medium mb-3 text-left">
            Enter your Bluesky handle
          </label>
          <Input
            id="handle"
            name="handle"
            type="text"
            placeholder="@username.bsky.social"
            class="bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-500 h-12 text-base focus:ring-2 focus:ring-white/50 {form?.error && !hasStartedTyping ? 'border-red-400 focus:ring-red-400/50' : ''}"
            required
            oninput={() => hasStartedTyping = true}
          />
          {#if form?.error && !hasStartedTyping}
            <p class="text-red-100 text-sm mt-2 font-medium bg-red-500/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-red-400/30">
              {form.error}
            </p>
          {/if}
        </div>

        <Button
          type="submit"
          size="lg"
          class="w-full h-14 text-lg font-semibold bg-white text-[hsl(206,100%,50%)] hover:bg-white/90 shadow-xl hover:scale-105 transition-all duration-300"
        >
          See My Wrapped
        </Button>
      </form>

      <p class="text-white/70 text-sm">
        No kitties were harmed in the making of this website. Built by <a target="_blank" rel="noopener noreferrer" href="https://bsky.app/profile/albertovarela.net" class="text-white/90 hover:text d-white">@albertovarela.net</a>.
      </p>
    </div>
  </div>

  <p class="absolute z-20 bottom-0 text-center w-full text-white/70 text-xs mb-4">
    <a href="/terms-of-service" class="text-white/90 hover:text d-white">Terms of Service</a> and <a href="/privacy-policy" class="text-white/90 hover:text d-white">Privacy Policy</a>.
  </p>
</div>
