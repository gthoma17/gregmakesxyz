# Development Container

This devcontainer provides a complete development environment for the Greg Makes XYZ website.

## What's Included

### Base Environment
- **Node.js 20** - For Astro development
- **Python 3.11** - For webmentions script and other utilities
- **Zsh with Oh My Zsh** - Enhanced shell experience

### Development Tools
- **make** - For using the project makefile
- **rsync** - For deployment functionality
- **git** - Version control with helpful configuration

### VS Code Extensions
- **Astro** - Full Astro language support and syntax highlighting
- **Python** - Python development tools
- **Prettier** - Code formatting
- **Tailwind CSS** - CSS utility framework support
- **GitLens** - Enhanced git integration
- **Makefile Tools** - Makefile syntax support

### Pre-configured Settings
- Astro telemetry disabled (`ASTRO_TELEMETRY_DISABLED=1`)
- Default formatters configured for different file types
- Port 4321 forwarded for Astro dev server

## Quick Start

1. Open this repository in VS Code
2. When prompted, click "Reopen in Container" or use the Command Palette: `Dev Containers: Reopen in Container`
3. Wait for the container to build and dependencies to install
4. Start developing!

## Useful Commands

The setup script creates these helpful aliases:
- `astro-dev` - Start the Astro development server
- `astro-build` - Build the Astro site
- `astro-preview` - Preview the built site
- `make-serve` - Start dev server via makefile
- `make-build` - Build via makefile

## Development Workflow

1. **Start the dev server**: `astro-dev` or `cd astro_site && npm run dev`
2. **Access the site**: http://localhost:4321
3. **Make your changes** in the `astro_site/` directory
4. **Build for production**: `astro-build` or `make build`

## Python Scripts

The webmentions script in `scripts/getWebmentions.py` is ready to use with Python 3.11 included in the container.

## Notes

- All npm dependencies are automatically installed during container setup
- The container includes all tools needed for the full development and deployment workflow
- Git is pre-configured with safe directory settings