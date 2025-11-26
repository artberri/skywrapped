<svelte:options css="injected" />

<script lang="ts">
	import Butterfly from './Butterfly.svelte';
	import Cloud from './Cloud.svelte';

  let { profile }: { profile?: {
    displayName: string;
    handle: string;
  } } = $props();
</script>

<div class="flex flex-col w-full h-full bg-gradient text-white">
  <Butterfly class="absolute top-35 left-54" size="lg" rotate={-10} />
  <Butterfly class="absolute top-28 left-248" size="md" rotate={5} />
  <Butterfly class="absolute top-16 left-180" size="sm" rotate={20} />
  <Butterfly class="absolute top-30 left-98" size="md" rotate={15} />
  <Butterfly class="absolute bottom-29 right-54" size="lg" rotate={10} />
  <Butterfly class="absolute top-100 left-40" size="md" rotate={-27} />
  <Butterfly class="absolute bottom-16 right-180" size="sm" rotate={12} />
  <Butterfly class="absolute bottom-30 right-98" size="md" rotate={-7} />
  <Cloud class="absolute top-20 left-10" size="lg" />
  <Cloud class="absolute top-7 left-90" size="sm" />
  <Cloud class="absolute top-40 left-130" size="md" />
  <Cloud class="absolute top-36 left-180" size="sm" />
  <Cloud class="absolute top-10 left-220" size="md" />
  <Cloud class="absolute top-60 left-260" size="lg" />
  <Cloud class="absolute top-130 left-270" size="md" />
  <Cloud class="absolute top-115 left-130" size="lg" />
  <Cloud class="absolute top-140 left-180" size="sm" />
  <Cloud class="absolute top-125 left-15" size="lg" />
  <Cloud class="absolute top-110 left-75" size="md" />
  <Cloud class="absolute top-70 left-30" size="sm" />
	<div class="flex flex-column justify-center items-center relative z-10 mt-50">
		<h1 class="font-extrabold text-8xl">Sky Wrapped</h1>
	</div>
  <div class="flex flex-column justify-center items-center relative z-10 mt-0">
    <p class="text-3xl text-white/80 mb-0">
      {profile?.displayName ? `Check out the year on Bluesky of ${profile.displayName}` : 'Let\'s discover what you did on Bluesky this year'}
    </p>
  </div>
  {#if profile?.handle}
    <div class="flex flex-column justify-center items-center relative z-10 mt-0">
      <p class="text-xl text-white font-bold">
        @{profile.handle}
      </p>
    </div>
  {/if}
</div>

<style lang="postcss">
	.bg-gradient {
		background: linear-gradient(
			336deg,
			#9f69e5,
			#7e7bef,
			#248efd
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}
</style>
