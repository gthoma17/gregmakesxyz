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

1. Store images in `/src/assets/images/notes/`
2. Reference them in your note markdown using relative paths:

```markdown
![alt text](../../assets/images/notes/filename.ext)
```

3. Supported formats: PNG, JPG, SVG, GIF, WebP, AVIF
4. Images are automatically optimized and made responsive

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