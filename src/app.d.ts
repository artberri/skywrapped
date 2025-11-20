// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { AppContext } from "$lib/server/context";
import type { Agent } from "@atproto/api";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      ctx: AppContext;
      agent?: Agent;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
