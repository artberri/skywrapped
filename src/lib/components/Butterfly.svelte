<script lang="ts">
  import { cn } from '$lib/utils';
  let { class: className, size = 'md', style, rotate = 0 }: {class?: string, size?: 'sm' | 'md' | 'lg', style?: string, rotate?: number} = $props();
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };
</script>

<svg
  class={cn(sizeClasses[size], "opacity-70", className)}
  viewBox="0 0 100 100"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  style={style}
>
  <g transform="rotate({rotate} 50 50)">
    <path
      d="M30 50C30 50 15 35 20 20C25 5 40 15 45 30L50 50"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M70 50C70 50 85 35 80 20C75 5 60 15 55 30L50 50"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M30 50C30 50 10 60 15 80C20 95 40 85 45 65L50 50"
      fill="currentColor"
      opacity="0.6"
    />
    <path
      d="M70 50C70 50 90 60 85 80C80 95 60 85 55 65L50 50"
      fill="currentColor"
      opacity="0.6"
    />
    <ellipse cx="50" cy="50" rx="3" ry="15" fill="currentColor" />
    <path
      d="M50 35C48 30 46 25 45 20M50 35C52 30 54 25 55 20"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </g>
</svg>
