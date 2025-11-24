<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
    ratio?: number;
  }

  let { ratio = 1, children, class: className, ...rest }: AspectRatioProps = $props();

  let paddingBottom = $derived(`${(1 / ratio) * 100}%`);
</script>

<div
  class={cn('relative w-full', className)}
  style:padding-bottom={paddingBottom}
  {...rest}
>
  <div class="absolute inset-0">
    {@render children?.()}
  </div>
</div>

