<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';
  let { children, class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...rest}>
  {@render children?.()}
</div>
