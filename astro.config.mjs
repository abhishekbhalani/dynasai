// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dynasai.ai',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/admin'),
    }),
  ],
});
