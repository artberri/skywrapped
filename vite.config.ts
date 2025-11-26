import { sveltekitOG } from "@ethercorps/sveltekit-og/plugin";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), sveltekitOG()],
	server: {
		host: "127.0.0.1",
		port: 5173,
	},
	build: {
		sourcemap: true,
	},
});
