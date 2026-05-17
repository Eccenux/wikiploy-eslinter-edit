import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
// import { jsdoc } from 'eslint-plugin-jsdoc';

export default defineConfig([
	{
		// ...jsdoc({
		// 	config: 'flat/recommended-typescript-flavor',
		// 	settings: {
		// 		mode: 'permissive',
		// 	},
		// }),
		name: 'documentation/javascript',
		files: ["**/*.{js,mjs}"],
	},
	{
		files: ["**/*.{js,mjs}"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		languageOptions: {
			ecmaVersion: 13, // 12=ES2021; 14=ES2023
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
				...globals.mocha,
				mw: "readonly",
				// IsbnTools: "readonly",
			},
		},
		rules: {
			// Styl / czytelność
			indent: ["error", "tab", { SwitchCase: 1 }],
			semi: ["error", "always"],
			"comma-dangle": ["warn", "always-multiline"],
			"no-trailing-spaces": "error",

			// Potencjalne błędy / higiena
			"no-unused-vars": ["warn", {
				args: "after-used",
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			}],
			"no-undef": "error",
			// "no-var": "error",
			// "prefer-const": ["error", { destructuring: "all" }],
		},
	},
]);