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

- **Governance Content**: Governance documentation content lives in `src/content/governance/` (git submodule)
  - `agreements/` - Relational foundations and core agreements
  - `policies/` - Coordination mechanisms across operational domains
  - `proposals/` - Decision-making archive and institutional memory
- **Content Format**: Documentation pages are written in Markdown (`.md`) or MDX (`.mdx`)
- **Content Collections**: The site uses Astro's content collections system configured in `src/content.config.ts`
  - Uses custom `glob()` loaders for governance collections
  - Uses Starlight's `docsLoader()` and `docsSchema()` for site pages

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

Governance content is managed in the separate [governance repository](https://github.com/superbenefit/governance) and integrated via git submodule.

For governance content updates:
1. Make changes in the governance repository
2. Update the submodule in this repo: `git submodule update --remote src/content/governance`
3. Commit the submodule reference update

The custom navigation sidebar (`src/components/starlight/Sidebar.astro`) automatically reflects content structure from the governance collections.

## Build Output

- Production builds output to `./dist/`
- The build process uses Sharp for image optimization
