<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';
  let { children, class: className, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3 class={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...rest}>
  {@render children?.()}
</h3>
