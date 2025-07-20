import { defineConfig } from 'astro/config';
import rss from '@astrojs/rss';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Astro telemetry can be disabled via:
// 1. Environment variable: ASTRO_TELEMETRY_DISABLED=1 (see .env.example)
// 2. CLI command: npx astro telemetry disable

export default defineConfig({
  site: 'https://gregmakes.xyz',
  integrations: [
    sitemap(),
    mdx(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  }
});