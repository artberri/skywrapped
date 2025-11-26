<script lang="ts">
  import { cn } from '$lib/utils';
  import { getContext } from 'svelte';
  import type { HTMLImgAttributes } from 'svelte/elements';
  import { AVATAR_CONTEXT_KEY, type AvatarContext } from './avatar/context';

  interface AvatarImageProps extends HTMLImgAttributes {
    src?: string;
    alt?: string;
  }

  let { class: className, src, alt, ...rest }: AvatarImageProps = $props();

  const context = getContext<AvatarContext>(AVATAR_CONTEXT_KEY);
  if (!context) {
    throw new Error('AvatarImage must be used within Avatar');
  }

  let imgElement: HTMLImageElement | undefined = $state();

  $effect(() => {
    if (imgElement && src) {
      // Reset state when src changes
      context.setImageLoading(true);
      context.setImageError(false);
      context.setImageLoaded(false);

      const handleLoad = () => {
        context.setImageLoading(false);
        context.setImageError(false);
        context.setImageLoaded(true);
      };

      const handleError = () => {
        context.setImageLoading(false);
        context.setImageError(true);
        context.setImageLoaded(false);
      };

      imgElement.addEventListener('load', handleLoad);
      imgElement.addEventListener('error', handleError);

      // Check if image is already loaded
      if (imgElement.complete) {
        if (imgElement.naturalWidth === 0) {
          handleError();
        } else {
          handleLoad();
        }
      }

      return () => {
        imgElement?.removeEventListener('load', handleLoad);
        imgElement?.removeEventListener('error', handleError);
      };
    }

    return () => {
    };
  });
</script>

{#if src && !context.imageError}
  <img
    bind:this={imgElement}
    class={cn("aspect-square h-full w-full", className)}
    src={src}
    alt={alt}
    {...rest}
  />
{/if}

