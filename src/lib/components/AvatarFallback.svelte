<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { AVATAR_CONTEXT_KEY, type AvatarContext } from './avatar/context';

  interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet;
  }

  let { class: className, children, ...rest }: AvatarFallbackProps = $props();

  const context = getContext<AvatarContext>(AVATAR_CONTEXT_KEY);
  if (!context) {
    throw new Error('AvatarFallback must be used within Avatar');
  }
</script>

{#if context.imageError || (!context.imageLoaded && !context.imageLoading)}
  <span
    class={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...rest}
  >
    {#if children}
      {@render children()}
    {/if}
  </span>
{/if}

