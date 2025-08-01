# gregmakesxyz

This repo contains the personal website of Greg Thomas, built with [Astro](https://astro.build/).

## Development

The site uses Astro for static site generation. To work with it locally:

```bash
cd astro_site
npm install
npm run dev
```

### System Dependencies

The build process requires ImageMagick for HEIC image conversion fallback:

```bash
# Ubuntu/Debian
sudo apt-get install imagemagick

# macOS with Homebrew
brew install imagemagick

# Other systems: install ImageMagick with HEIC support
```

**Note**: The HEIC conversion script uses Sharp as the primary converter with ImageMagick as a fallback. ImageMagick is required when Sharp cannot handle certain HEIC file formats.

### Notes

Notes support optimized markdown content including images using Astro's automatic image processing. To add images to notes:

1. Store images in `/src/content/notes/images/`
2. Reference them in your note markdown using relative paths:

```markdown
![alt text](./images/filename.ext)
```

3. Supported formats: PNG, JPG, SVG, GIF, WebP, AVIF, HEIC
4. Images are automatically optimized and made responsive
5. **HEIC Support**: HEIC files from iPhone are fully supported with automatic conversion to WebP format during build time. Simply place HEIC files in the images directory and reference them normally - they will be converted to optimized WebP images automatically before the site builds.

#### Featured Images

Notes can include a featured image that displays prominently at the top of the note. For content collection notes, place the image file in the images subdirectory (`/src/content/notes/images/`) and reference it in the frontmatter:

```yaml
---
title: My Note Title
date: 2025-01-19T12:00:00-07:00
featuredImage: "./images/my-featured-image.jpg"
---
```

**Note**: HEIC files are automatically converted to WebP format during build time, making them fully compatible with featured images and all web browsers.

The featured image will be displayed above the note content on both the individual note page and in the notes list.

#### iPhone Shortcuts with Working Copy

You can create iPhone shortcuts to add notes directly to your repository using the Working Copy app. This allows you to quickly create notes with optional featured images from your iPhone.

**Prerequisites:**
- [Working Copy](https://workingcopyapp.com/) app installed on your iPhone
- Repository cloned in Working Copy
- Basic understanding of iOS Shortcuts app

**Setup Instructions:**

1. **Clone your repository in Working Copy** if you haven't already
2. **Create a new shortcut** in the iOS Shortcuts app
3. **For notes with optional featured images**, use this workflow:

```
1. Ask for Input (Text) → "Note Title"
2. Ask for Input (Text, Allow Multiline) → "Note Content" 
3. Ask for Photos → "Select Featured Image (Optional)"
4. Text Action → Generate frontmatter and content:
   ---
   type: notes
   date: [Current Date in ISO format]
   draft: false
   featuredImage: [If photo selected: ./images/note-[timestamp].[ext]]
   ---
   
   [Note Content]

5. If Photo Selected:
   - Working Copy Action → "Write to Repository"
   - Repository: [Your Repo]
   - Path: src/content/notes/images/note-[timestamp].[ext]
   - Content: [Selected Photo]

6. Working Copy Action → "Write to Repository"
   - Repository: [Your Repo] 
   - Path: src/content/notes/note-[timestamp].md
   - Content: [Generated text from step 4]

7. Working Copy Action → "Commit Repository"
   - Repository: [Your Repo]
   - Message: "Add note: [Note Title]"

8. Working Copy Action → "Push Repository" (optional)
```

**For text-only notes** (simpler version), follow the pattern from [this article](https://www.marcogomiero.com/posts/2021/running-blog-ipad/) but adapt the file paths to use `src/content/notes/` and include the proper frontmatter format.

**Tips:**
- Use timestamp-based filenames to avoid conflicts: `note-YYYY-MM-DD-HH-mm-ss.md`
- HEIC photos from iPhone are supported and will be automatically optimized
- You can omit the `featuredImage` field entirely for text-only notes
- Consider using shortcuts that prompt for tags if you want to categorize your notes

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