# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based documentation site using the Starlight framework. Starlight is Astro's official documentation theme designed for building beautiful, accessible, and performant documentation websites.

## Development Commands

All commands are run from the root of the project:

- `npm install` - Install dependencies
- `npm run dev` - Start local dev server at `localhost:4321`
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run astro ...` - Run Astro CLI commands (e.g., `npm run astro add`, `npm run astro check`)

## Architecture

### Content Structure

- **Content Location**: All documentation content lives in `src/content/docs/`
- **Content Format**: Documentation pages are written in Markdown (`.md`) or MDX (`.mdx`)
- **Routing**: Files in `src/content/docs/` are automatically exposed as routes based on their file names
  - Example: `src/content/docs/guides/example.md` → `/guides/example/`
- **Content Collections**: The site uses Astro's content collections system configured in `src/content.config.ts`
  - Uses Starlight's `docsLoader()` and `docsSchema()` for type-safe documentation

### Configuration

- **Main Config**: `astro.config.mjs` - Contains Astro and Starlight configuration
  - Site title, social links, and sidebar navigation are configured here
  - Sidebar can use manual entries or `autogenerate` for directories
- **TypeScript**: Uses Astro's strict TypeScript configuration (`astro/tsconfigs/strict`)

### Assets

- **Images**: Store in `src/assets/` and reference with relative paths in Markdown
- **Static Files**: Place in `public/` directory (favicons, robots.txt, etc.)

### Page Types

- **Splash Pages**: Landing pages without sidebars (use `template: splash` in frontmatter)
- **Doc Pages**: Standard documentation pages with sidebar navigation (default)
- **Frontmatter**: Each page requires `title` and `description` in YAML frontmatter

### Components

Starlight provides built-in components that can be imported in MDX files:
- `Card` and `CardGrid` - For creating card-based layouts
- Other Starlight components available from `@astrojs/starlight/components`

## Working with Content

When creating new documentation pages:
1. Add `.md` or `.mdx` files to `src/content/docs/`
2. Include required frontmatter: `title` and `description`
3. Update sidebar configuration in `astro.config.mjs` if manual navigation is used
4. For directories with `autogenerate`, new files appear automatically

## Build Output

- Production builds output to `./dist/`
- The build process uses Sharp for image optimization
