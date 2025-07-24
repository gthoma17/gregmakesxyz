# gregmakesxyz

This repo contains the personal website of Greg Thomas, built with [Astro](https://astro.build/).

## Development

The site uses Astro for static site generation. To work with it locally:

```bash
cd astro_site
npm install
npm run dev
```

### Notes

Notes support optimized markdown content including images using Astro's automatic image processing. To add images to notes:

1. Store images in `/src/notes/images/`
2. Reference them in your note markdown using relative paths:

```markdown
![alt text](../../notes/images/filename.ext)
```

3. Supported formats: PNG, JPG, SVG, GIF, WebP, AVIF
4. Images are automatically optimized and made responsive
5. **HEIC Support**: HEIC files from iPhone are supported through the underlying Sharp library with libheif support. HEIC files work seamlessly in markdown content and will be automatically converted to web-optimized formats (WebP/AVIF)

#### Featured Images

Notes can include a featured image that displays prominently at the top of the note. For content collection notes, place the image file in the same directory as your note content (`/src/content/notes/`) and reference it in the frontmatter:

```yaml
---
title: My Note Title
date: 2025-01-19T12:00:00-07:00
featuredImage: "./my-featured-image.jpg"
---
```

**Note**: For featured images in content collections, JPG/PNG formats are recommended. HEIC files work perfectly in markdown content but may need conversion for featured images in some cases.

The featured image will be displayed above the note content on both the individual note page and in the notes list.

## Deployment

The site is deployed using the makefile commands:

```bash
make build   # Build the static site
make serve   # Run development server
make deploy  # Build and deploy to production
```

The deployment target is configured for NearlyFreeSpeech hosting.

## Migration from Hugo

This site was previously built with Hugo. The Hugo files are preserved in the `hugo_site/` directory for reference. The new Astro site is in `astro_site/`.

Instructions for how this website hosting was setup can be found [here](nfsn_config)