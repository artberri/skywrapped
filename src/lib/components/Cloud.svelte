<script lang="ts">
  import { cn } from '$lib/utils';
  let { class: className, size = 'md', style }: {class?: string, size?: 'sm' | 'md' | 'lg', style?: string} = $props();
  let sizeClasses = {
    sm: "w-16 h-10",
    md: "w-24 h-14",
    lg: "w-32 h-20",
  };
</script>
<svg
  class={cn(sizeClasses[size], "opacity-20", className)}
  viewBox="0 0 200 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style={style}
>
  <path
    d="M160 70C160 70 165 50 150 40C140 33 130 38 125 45C125 30 110 20 90 20C70 20 55 30 50 45C40 40 25 45 20 60C15 75 25 85 40 85H150C165 85 170 75 160 70Z"
    fill="white"
    opacity="0.8"
  />
</svg>
