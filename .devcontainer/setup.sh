#!/bin/bash

echo "🚀 Setting up Greg Makes XYZ development environment..."

# Install additional system packages for development
echo "📦 Installing additional system packages..."
sudo apt-get update
sudo apt-get install -y rsync make curl wget

# Navigate to astro_site directory and install dependencies
echo "📦 Installing npm dependencies for Astro site..."
cd astro_site
npm install

# Ensure telemetry is disabled globally
echo "🔒 Disabling Astro telemetry..."
npx astro telemetry disable

# Install useful global npm packages for development
echo "📦 Installing useful global npm packages..."
npm install -g @astrojs/cli

# Set up git configuration helpers (if not already configured)
echo "🔧 Configuring git helpers..."
git config --global --add safe.directory /workspaces/gregmakesxyz

# Create useful aliases
echo "📝 Setting up helpful aliases..."
cat >> ~/.bashrc << 'EOF'

# Greg Makes XYZ Development Aliases
alias astro-dev='cd astro_site && npm run dev'
alias astro-build='cd astro_site && npm run build'
alias astro-preview='cd astro_site && npm run preview'
alias make-serve='make serve'
alias make-build='make build'
EOF

cat >> ~/.zshrc << 'EOF'

# Greg Makes XYZ Development Aliases
alias astro-dev='cd astro_site && npm run dev'
alias astro-build='cd astro_site && npm run build'
alias astro-preview='cd astro_site && npm run preview'
alias make-serve='make serve'
alias make-build='make build'
EOF

# Create a welcome message
echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Quick commands:"
echo "  astro-dev     - Start Astro dev server"
echo "  astro-build   - Build the Astro site"
echo "  make-serve    - Start dev server via makefile"
echo "  make-build    - Build via makefile"
echo ""
echo "🌐 The Astro dev server will be available at http://localhost:4321"
echo "📁 Main project files are in astro_site/"
echo ""
echo "Happy coding! 🎉"