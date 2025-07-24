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
  },
  image: {
    // Configure responsive images globally
    domains: ['gregmakes.xyz'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gregmakes.xyz'
      }
    ],
    // Default responsive image widths
    widths: [320, 640, 768, 1024, 1280, 1600],
    // Default formats (HEIC files are processed through HEIF codec)
    formats: ['webp', 'avif', 'png', 'jpg', 'heic']
  }
});