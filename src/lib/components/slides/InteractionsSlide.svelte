<script lang="ts">
	import type { Wrapped } from '$lib/server/domain/wrapped';
	import { Users } from '@lucide/svelte';
	import Avatar from '../Avatar.svelte';
	import AvatarFallback from '../AvatarFallback.svelte';
	import AvatarImage from '../AvatarImage.svelte';
	import Badge from '../Badge.svelte';
	import Butterfly from '../Butterfly.svelte';

  interface PageProps {
    wrapped: Wrapped;
  }

  let { wrapped }: PageProps = $props();
</script>

<div class="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
  <Butterfly class="absolute top-20 right-10 animate-float text-white" size="md" />
  <Butterfly class="absolute bottom-32 left-10 animate-float-delayed text-white" size="sm" />

  <div class="relative z-10 text-center space-y-8 md:space-y-10 max-w-3xl w-full">
    <div class="space-y-4 animate-fade-in">
      <Users class="w-12 h-12 md:w-16 md:h-16 text-white mx-auto" />
      <h2 class="text-3xl md:text-5xl font-bold text-white">
        Your Sky Crew
      </h2>
      <p class="text-lg md:text-xl text-white/90">
        Your top interactions this year ✨
      </p>
    </div>

    <div class="space-y-4">
      {#each wrapped.connections as person, index}
        <div
          class="relative bg-white/15 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20 flex items-center gap-3 animate-scale-in hover:bg-white/20 transition-all duration-300"
          style:animation-delay={`${index * 0.1}s`}
        >
          {#if person.following}
            <Badge class="absolute top-2 right-2 bg-white/20 text-white border-white/30 text-[10px] px-1.5 py-0.5">
              {person.followsYou ? 'Mutual' : 'Following'}
            </Badge>
          {/if}
          <Avatar class="h-12 w-12 md:h-14 md:w-14 border-2 border-white/30 shrink-0">
            <AvatarImage src={person.avatar} alt={person.displayName} />
            <AvatarFallback class="bg-white/20 text-white text-base">
              {person.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div class="text-left flex-1 min-w-0">
            <p class="text-white font-semibold text-base md:text-lg truncate pr-16">
              {person.displayName}
            </p>
            <p class="text-white/80 text-sm md:text-base truncate">
              {person.handle}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
