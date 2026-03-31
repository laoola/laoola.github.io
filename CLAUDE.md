# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Install dependencies**: `npm install`
- **Start dev server**: `npm run dev` (runs on `localhost:4321`)
- **Build for production**: `npm run build` (outputs to `dist/`, includes PageFind indexing)
- **Preview production build**: `npm run preview`
- **Astro CLI**: `npm run astro`

## Architecture Overview

This is a **personal technical blog** built as a static website with Astro for GitHub Pages deployment.

### Key Technologies
- **Framework**: Astro 6 (Static Site Generation)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI + Radix UI
- **Content**: Markdown/MDX with Astro Content Collections
- **Syntax Highlighting**: Shiki
- **Search**: PageFind (full-text search on static site)
- **Comments**: Giscus (powered by GitHub Discussions)
- **Language**: TypeScript (strict mode)

### Project Structure
- `src/content/blog/` - Blog posts as Markdown/MDX files
- `src/pages/` - File-based routing (index, blog list, dynamic post pages, search)
- `src/components/` - Reusable Astro/React components
- `src/components/ui/` - Shadcn UI components
- `src/layouts/` - Page layout templates
- `src/lib/` - Utility functions
- `public/` - Static assets
- `dist/` - Build output (generated, not checked in)

### Content Schema
Blog posts require frontmatter with:
- `title` (string) - Post title
- `description` (string) - Post description
- `date` (date) - Publication date
- `tags` (string[], optional) - Post tags
- `draft` (boolean, optional, default: false) - Draft status

### Configuration
- `astro.config.mjs` - Astro configuration with site URL `https://laoola.github.io`, Tailwind integration, Shiki highlighting
- `tsconfig.json` - TypeScript with path alias `@/*` → `./src/*`
- `components.json` - Shadcn UI configuration
- `src/content.config.ts` - Content collection schema definition

### Key Features
- Dark/light theme toggle with system detection
- Table of contents (TOC) for blog posts
- Copy-to-clipboard for code blocks
- Responsive design (mobile + desktop)
- Automatic sitemap generation
- SEO-friendly
- Draft posts visible only in development

## Important Notes

- Node.js version requirement: `>=22.12.0`
- Package manager: npm (uses package-lock.json)
- Build output goes to `dist/` directory for GitHub Pages deployment
- PageFind search indexing runs automatically after build
