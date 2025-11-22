<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value?: number;
  }

  let { value = 0, class: className, ...rest }: ProgressProps = $props();

  let transformStyle = $derived(`transform: translateX(-${100 - (value || 0)}%)`);
</script>

<div
  class={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
  {...rest}
>
  <div
    class="h-full w-full flex-1 bg-primary transition-all"
    style={transformStyle}
  ></div>
</div>

