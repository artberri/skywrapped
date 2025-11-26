<script lang="ts">
	import { goto } from "$app/navigation";
	import Butterfly from "$lib/components/Butterfly.svelte";
	import Cloud from "$lib/components/Cloud.svelte";
	import Progress from "$lib/components/Progress.svelte";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";

  let progress = $state(0);
  let message = $state("Analyzing your posts...");
  let {  data }: PageProps = $props();
  let { handle } = data;

  onMount(async () => {
    let lastDataReceived = Date.now();
    let fakeProgressInterval: ReturnType<typeof setInterval> | null = null;
    let isRequestComplete = false;
    const MAX_FAKE_PROGRESS = 95; // Never exceed this with fake progress

    // Messages from the server, matching progress thresholds
    const progressMessages = [
      { threshold: 0, message: "Analyzing your posts..." },
      { threshold: 14, message: "Analyzing your posts..." },
      { threshold: 28, message: "Counting your followers..." },
      { threshold: 42, message: "Finding your top moments..." },
      { threshold: 57, message: "Calculating engagement..." },
      { threshold: 69, message: "Counting your likes..." },
      { threshold: 81, message: "Counting your bookmarks..." },
      { threshold: 92, message: "Wrapping up your year..." },
      { threshold: 100, message: "Saving your wrapped..." },
    ];

    // Get message based on current progress
    const getMessageForProgress = (currentProgress: number): string => {
      // Find the highest threshold that is <= currentProgress
      for (let i = progressMessages.length - 1; i >= 0; i--) {
        if (currentProgress >= (progressMessages[i]?.threshold ?? 0)) {
          return progressMessages[i]?.message ?? '';
        }
      }
      return progressMessages[0]?.message ?? '';
    };

    // Fallback progress mechanism
    const startFakeProgress = () => {
      fakeProgressInterval = setInterval(() => {
        if (isRequestComplete) {
          if (fakeProgressInterval) {
            clearInterval(fakeProgressInterval);
            fakeProgressInterval = null;
          }
          return;
        }

        const timeSinceLastData = Date.now() - lastDataReceived;
        if (timeSinceLastData >= 400) {
          // Increment by random amount between 15-20%
          const increment = Math.random() * 5 + 15; // 15 to 20
          const newProgress = Math.round(Math.min(progress + increment, MAX_FAKE_PROGRESS));
          progress = newProgress;
          // Update message based on new progress
          message = getMessageForProgress(newProgress);
        }
      }, 400);
    };

    try {
      // Start the fallback progress mechanism
      startFakeProgress();

      const response = await fetch("/api/calculate");
      if (!response.ok) {
        // If unauthorized, redirect to home
        if (response.status === 401) {
          goto("/");
          return;
        }
        throw new Error("Failed to start calculation");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          isRequestComplete = true;
          progress = 100; // Set to 100% on completion
          if (fakeProgressInterval) {
            clearInterval(fakeProgressInterval);
            fakeProgressInterval = null;
          }
          break;
        }

        lastDataReceived = Date.now(); // Update timestamp when data is received

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              if (parsed.done) {
                isRequestComplete = true;
                progress = 100; // Set to 100% on completion
                if (fakeProgressInterval) {
                  clearInterval(fakeProgressInterval);
                  fakeProgressInterval = null;
                }
                // Calculation complete, redirect or show success
                goto(`/2025/${handle}`);
                return;
              }

              if (parsed.error) {
                console.error("Calculation error:", parsed.error);
                isRequestComplete = true;
                if (fakeProgressInterval) {
                  clearInterval(fakeProgressInterval);
                  fakeProgressInterval = null;
                }
                goto("/error");
                return;
              }

              if (parsed.step !== undefined && parsed.message && parsed.progress !== undefined) {
                // Ensure messageIndex stays within bounds
                message = parsed.message;
                progress = parsed.progress; // Real progress from server overrides fake progress
                lastDataReceived = Date.now(); // Update timestamp
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error during calculation:", error);
      isRequestComplete = true;
      if (fakeProgressInterval) {
        clearInterval(fakeProgressInterval);
        fakeProgressInterval = null;
      }
      goto("/error");
    }
  });
</script>

<svelte:head>
	<title>Calculating your year on Bluesky - Sky Wrapped</title>
</svelte:head>

<div class="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[hsl(206,100%,50%)] via-[hsl(195,85%,60%)] to-[hsl(50,100%,75%)]">
  <div class="absolute top-20 left-10 animate-float">
    <Butterfly size="md" class="text-white/30" />
  </div>
  <div class="absolute top-40 right-16 animate-float" style="animation-delay: 0.5s;">
    <Butterfly size="md" class="text-white/30" />
  </div>
  <div class="absolute bottom-40 left-20 animate-float" style="animation-delay: 1s;">
    <Butterfly size="md" class="text-white/30" />
  </div>
  <div class="absolute bottom-20 right-20 animate-float" style="animation-delay: 1.5s;">
    <Butterfly size="sm" class="text-white/30" />
  </div>

  <div class="absolute top-32 right-32 animate-drift">
    <Cloud size="lg" class="text-white/20" />
  </div>
  <div class="absolute bottom-32 left-32 animate-drift" style="animation-delay: 2s;">
    <Cloud size="md" class="text-white/20" />
  </div>

  <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
    <div class="max-w-lg w-full space-y-12 text-center">
      <div class="flex justify-center">
        <div class="animate-spin-slow">
          <Butterfly size="lg" class="text-white" />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg min-h-[3rem] transition-all duration-300">
          {message}
        </h2>
      </div>

      <div class="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
        <Progress value={progress} class="h-3 bg-white/20" />
        <p class="text-white/90 text-lg font-medium mt-4">
          {progress}%
        </p>
      </div>
    </div>
  </div>
</div>
