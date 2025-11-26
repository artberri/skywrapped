/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	printWidth: 100,
	overrides: [
		{
			files: "**/*.{js,mjs,cjs,jsx}",
			options: {
				parser: "oxc",
				plugins: ["@prettier/plugin-oxc"],
			},
		},
		{
			files: "**/*.{ts,mts,cts,tsx}",
			options: {
				parser: "oxc-ts",
				plugins: ["@prettier/plugin-oxc"],
			},
		},
	],
};

export default config;
