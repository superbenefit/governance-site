# Development Guide

This guide covers day-to-day development tasks for the SuperBenefit Governance Site.

## Prerequisites

- **Node.js** v18 or higher
- **npm** or your preferred package manager
- **Git** with submodule support

## Installation

1. Clone the repository with submodules:

```bash
git clone --recurse-submodules https://github.com/superbenefit/governance-site.git
cd governance-site
```

If you've already cloned without submodules:

```bash
git submodule init
git submodule update
```

2. Install dependencies:

```bash
npm install
```

## Development Commands

All commands are run from the root of the project:

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI |

## Project Structure

```
governance-site/
├── .docs/                     # Technical documentation
├── public/                    # Static assets (favicons, etc.)
├── src/
│   ├── assets/               # Images and media files
│   ├── components/
│   │   └── starlight/
│   │       └── Sidebar.astro     # Custom navigation sidebar
│   ├── content/
│   │   ├── docs/             # Empty (required by Starlight)
│   │   └── governance/       # Git submodule (governance repo)
│   │       ├── agreements/   # Agreement markdown files
│   │       ├── policies/     # Policy markdown files
│   │       └── proposals/    # Proposal markdown files (unused)
│   ├── loaders/              # Custom content loaders
│   │   └── snapshot-loader.ts    # Snapshot API integration
│   ├── pages/                # Route pages
│   │   ├── index.astro       # Home/landing page
│   │   ├── agreements/       # Agreements index & pages
│   │   ├── policies/         # Policies index & pages
│   │   └── proposals/        # Proposals index & pages
│   ├── styles/
│   │   └── custom.css        # Custom CSS
│   └── content.config.ts     # Content collections config
├── astro.config.mjs          # Astro and Starlight config
├── CLAUDE.md                 # AI assistant guidance
├── CONTRIBUTING.md           # Contributor guidelines
└── package.json
```

## Common Development Tasks

### Starting Local Development

```bash
npm run dev
```

The site will be available at `http://localhost:4321`. Changes to most files will hot-reload automatically.

### Building for Production

```bash
npm run build
```

The built site will be output to `./dist/`. You can preview it with:

```bash
npm run preview
```

### Updating Governance Content

See [CONTENT.md](./CONTENT.md) for detailed instructions on working with the governance submodule.

Quick version:

```bash
# Pull latest governance content
git submodule update --remote src/content/governance

# Commit the submodule reference
git add src/content/governance
git commit -m "Update governance submodule to latest"
```

### Working with Components

The site uses Starlight components available from `@astrojs/starlight/components`:

```astro
---
import { Card, CardGrid } from '@astrojs/starlight/components';
---

<CardGrid>
  <Card title="Title" icon="star">
    Content goes here
  </Card>
</CardGrid>
```

### Modifying Navigation

The custom sidebar navigation is in `src/components/starlight/Sidebar.astro`. It automatically generates navigation from the governance content collections.

See [ARCHITECTURE.md](./ARCHITECTURE.md#custom-navigation-sidebar) for details on how it works.

### Configuration Files

- **astro.config.mjs** - Astro and Starlight configuration (site title, social links, etc.)
- **src/content.config.ts** - Content collections and schema definitions
- **tsconfig.json** - TypeScript configuration

## Troubleshooting

### Port Already in Use

If port 4321 is already in use:

```bash
npm run dev -- --port 3000
```

### Submodule Issues

If the governance submodule appears empty:

```bash
git submodule update --init --recursive
```

### Build Errors

Clear the cache and rebuild:

```bash
rm -rf .astro node_modules/.astro
npm run build
```

### Type Errors

Run the Astro type checker:

```bash
npm run astro check
```

## Further Reading

- [Content Management](./CONTENT.md) - Working with governance content and submodules
- [Architecture](./ARCHITECTURE.md) - System architecture and technical design
- [Snapshot Loader](./SNAPSHOT_LOADER.md) - Snapshot proposals integration
- [Contributing](../CONTRIBUTING.md) - Contribution guidelines

## External Resources

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build/)
