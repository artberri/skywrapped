<script lang="ts">
  import { cn } from '$lib/utils';
  import { cva, type VariantProps } from "class-variance-authority";
  import type { HTMLAttributes } from 'svelte/elements';

  const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      variants: {
        variant: {
          default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    },
  );

  interface BadgeProps extends VariantProps<typeof badgeVariants>, HTMLAttributes<HTMLDivElement> {}

  let { children, class: className, variant, ...rest }: BadgeProps = $props();
</script>

<div class={cn(badgeVariants({ variant, className }))} {...rest} >
  {@render children?.()}
</div>
