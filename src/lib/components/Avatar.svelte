<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { AVATAR_CONTEXT_KEY, type AvatarContext } from './avatar/context';

  interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet;
  }

  let { class: className, children, ...rest }: AvatarProps = $props();

  let imageLoading = $state(false);
  let imageError = $state(false);
  let imageLoaded = $state(false);

  const context: AvatarContext = {
    get imageLoading() {
      return imageLoading;
    },
    setImageLoading: (loading: boolean) => {
      imageLoading = loading;
    },
    get imageError() {
      return imageError;
    },
    setImageError: (error: boolean) => {
      imageError = error;
    },
    get imageLoaded() {
      return imageLoaded;
    },
    setImageLoaded: (loaded: boolean) => {
      imageLoaded = loaded;
    },
  };

  setContext(AVATAR_CONTEXT_KEY, context);
</script>

<div
  class={cn(
    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
    className
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</div>
