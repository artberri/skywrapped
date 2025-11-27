<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Calendar, MessageCircle, UserPlus, Users } from '@lucide/svelte';
	import Butterfly from '../Butterfly.svelte';
	import Cloud from '../Cloud.svelte';
	import Slide from '../Slide.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
</script>

<style lang="postcss">
  @reference "tailwindcss";
  .profile-box {
    @apply bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 space-y-3 hover:bg-white/15 transition-all duration-300;
  }
  .profile-box-value {
    @apply text-3xl md:text-4xl font-bold text-white;
  }
  .profile-box-label {
    @apply text-sm md:text-base text-white/80;
  }
</style>

<Slide>
  <Butterfly class="absolute top-20 left-10 text-white animate-float" size="sm" />
  <Butterfly class="absolute bottom-32 right-16 text-white animate-float-delayed" size="md" />

  <Cloud class="absolute top-16 animate-drift" size="md" />

  <div class="relative z-10 text-center space-y-8 max-w-3xl w-full">
    <div class="space-y-3 animate-fade-in">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-2">
        First of all,
      </h2>
      <p class="text-2xl md:text-3xl text-white/90">
        here’s where you stand today
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 md:gap-6 mt-8 animate-scale-in" style:animation-delay="0.2s">
      <div class="profile-box">
        <MessageCircle class="w-8 h-8 md:w-10 md:h-10 text-white mx-auto" />
        <div class="profile-box-value">
          {wrapped.current.posts.toLocaleString()}
        </div>
        <p class="profile-box-label">Posts</p>
      </div>

      <div class="profile-box">
        <Users class="w-8 h-8 md:w-10 md:h-10 text-white mx-auto" />
        <div class="profile-box-value">
          {wrapped.current.followers.toLocaleString()}
        </div>
        <p class="profile-box-label">Followers</p>
      </div>

      <div class="profile-box">
        <UserPlus class="w-8 h-8 md:w-10 md:h-10 text-white mx-auto" />
        <div class="profile-box-value">
          {wrapped.current.following.toLocaleString()}
        </div>
        <p class="profile-box-label">Following</p>
      </div>

      <div class="profile-box">
        <Calendar class="w-8 h-8 md:w-10 md:h-10 text-white mx-auto" />
        <div class="profile-box-value">
          {wrapped.current.accountAge}
        </div>
        <p class="profile-box-label">
          {wrapped.current.accountAge === 1 ? 'Year' : 'Years'} on Bluesky
        </p>
      </div>
    </div>
  </div>
  </Slide>
