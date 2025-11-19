import { dev } from "$app/environment";

export const MAX_AGE = !dev ? 60 : 0;
