<script lang="ts">
  import { cn } from '$lib/utils';

  interface ProgressBarProps {
    total: number;
    current: number;
  }

  let { total, current }: ProgressBarProps = $props();
</script>

<div class="flex gap-1 w-full">
  {#each Array.from({ length: total }) as _, index}
    <div
      class={cn(
        "h-1 flex-1 rounded-full transition-all duration-300",
        index < current || current === (total - 1)
          ? "bg-white"
          : index === current
          ? "bg-white/70"
          : "bg-white/20"
      )}
    ></div>
  {/each}
</div>
