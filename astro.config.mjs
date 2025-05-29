// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()]
    },

  integrations: [react(), expressiveCode({
    themes: ["catppuccin-latte", "vesper"],
    useDarkModeMediaQuery: true,
    themeCssSelector: (theme) => {
      const mode = theme.type === "dark" ? "dark" : "light";
      return `[data-theme='${mode}']`;
    },
  })],
  adapter: netlify()
});