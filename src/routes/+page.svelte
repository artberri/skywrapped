<script lang="ts">
	import logo from '$lib/assets/logo.jpg';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import CardContent from '$lib/components/ui/CardContent.svelte';
	import CardDescription from '$lib/components/ui/CardDescription.svelte';
	import CardHeader from '$lib/components/ui/CardHeader.svelte';
	import CardTitle from '$lib/components/ui/CardTitle.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Lalbel.svelte';
	import { Bookmark, BookmarkCheck, Sparkles } from '@lucide/svelte';
	import '../app.css';
</script>

<style lang="postcss">
  @reference "tailwindcss";
  .hero-bg {
    background-image: url("$lib/assets/hero-bg.jpg");
  }
</style>

<div class="min-h-screen bg-gradient-subtle">
  <div class="relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-10 bg-cover bg-center hero-bg"
    ></div>
    <div class="relative container mx-auto px-4 py-12 md:py-20 lg:py-24">
      <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div class="grid gap-4 md:gap-6 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-4 md:mb-8">
            <img src={logo} alt="Logo" class="w-12 h-12 md:w-16 md:h-16" />
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ReadStack
            </h1>
          </div>

          <div class="grid gap-3 md:gap-4">
            <h2 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
              Save what matters.
              <br />
              <span class="bg-gradient-primary bg-clip-text text-transparent">
                Read when ready.
              </span>
            </h2>

            <p class="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0">
              Your personal reading list, powered by the AT Protocol. Save articles, threads, and content from across the decentralized web.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 justify-items-center md:justify-items-start pt-2 md:pt-4 max-w-2xl mx-auto md:mx-0">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bookmark class="w-5 h-5 text-primary" />
              </div>
              <div class="text-left">
                <p class="text-sm font-semibold text-foreground">Save Anywhere</p>
                <p class="text-xs text-muted-foreground">One click bookmarks</p>
              </div>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookmarkCheck class="w-5 h-5 text-primary" />
              </div>
              <div class="text-left">
                <p class="text-sm font-semibold text-foreground">Read Later</p>
                <p class="text-xs text-muted-foreground">Organized library</p>
              </div>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Sparkles class="w-5 h-5 text-accent" />
              </div>
              <div class="text-left">
                <p class="text-sm font-semibold text-foreground">Decentralized</p>
                <p class="text-xs text-muted-foreground">AT Protocol powered</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center md:justify-end mt-8 md:mt-0">
          <Card class="w-full max-w-md shadow-large border-border/50 backdrop-blur">
            <CardHeader class="grid gap-1 px-4 md:px-6 pt-6">
              <CardTitle class="text-xl md:text-2xl text-center">Welcome to ReadStack</CardTitle>
              <CardDescription class="text-center text-sm">
                Sign in to access your reading list
              </CardDescription>
            </CardHeader>
            <CardContent class="px-4 md:px-6 pb-6">
              <div class="w-full">
                <div class="grid gap-3 md:gap-4">
                <div class="grid gap-2">
                    <Label for="login-email" class="text-sm">Email or Handle</Label>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder="you@example.com or @handle"
                      class="transition-all focus:shadow-soft h-11 text-base"
                    />
                  </div>
                  <div class="grid gap-2">
                    <Label for="login-password" class="text-sm">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      class="transition-all focus:shadow-soft h-11 text-base"
                    />
                  </div>
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <label class="flex items-center gap-2 cursor-pointer min-h-[44px] sm:min-h-0">
                      <input type="checkbox" class="rounded border-border w-4 h-4" />
                      <span class="text-muted-foreground">Remember me</span>
                    </label>
                    <a href="#" class="text-primary hover:underline min-h-[44px] sm:min-h-0 flex items-center">
                      Forgot password?
                    </a>
                  </div>
                  <Button variant="gradient" class="w-full min-h-[48px]" size="lg">
                    Log In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <footer class="border-t border-border/50 py-6 md:py-8 mt-12 md:mt-16">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <img src={logo} alt="Logo" class="w-7 h-7 md:w-8 md:h-8" />
          <span class="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            © 2024 ReadStack. Built on the AT Protocol.
          </span>
        </div>
        <div class="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">
            About
          </a>
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">
            Privacy
          </a>
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">
            Terms
          </a>
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center">
            Contact
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>
