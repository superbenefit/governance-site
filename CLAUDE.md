# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based documentation site using the Starlight framework. Starlight is Astro's official documentation theme designed for building beautiful, accessible, and performant documentation websites.

The site serves SuperBenefit DAO's governance documentation with content loaded from a git submodule and proposals fetched dynamically from the Snapshot API.

## Git Commit Attribution

**CRITICAL**: All commits MUST include proper co-author attribution. This is collaborative work between Claude and the project maintainer.

When making commits, ALWAYS include this co-author line in the commit message:

```
Co-authored-by: rathermercurial <rathermercurial@protonmail.com>
```

Example commit format:
```
feat: Add new documentation section

Co-authored-by: rathermercurial <rathermercurial@protonmail.com>
```

This is non-negotiable - every commit must credit the human collaborator who initiated the project, planned the work, wrote the prompts, and reviews all changes.

Use the `.gitmessage` template to automatically include the co-author line:
```bash
git config commit.template .gitmessage
```

## Quick Reference

### Development Commands

All commands are run from the root of the project:

```bash
npm install          # Install dependencies
npm run dev          # Start local dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview production build locally
npm run astro ...    # Run Astro CLI commands
```

See [.docs/DEVELOPMENT.md](.docs/DEVELOPMENT.md) for detailed development instructions.

### Project Structure

```
governance-site/
├── .docs/                    # Technical documentation
│   ├── DEVELOPMENT.md       # Development guide
│   ├── ARCHITECTURE.md      # Architecture documentation
│   ├── CONTENT.md          # Content management guide
│   └── SNAPSHOT_LOADER.md  # Snapshot integration details
├── src/
│   ├── content/
│   │   └── governance/      # Git submodule (governance repo)
│   ├── pages/               # Route pages
│   ├── components/          # Custom components
│   │   └── starlight/
│   │       └── Sidebar.astro    # Custom navigation sidebar
│   ├── loaders/             # Custom content loaders
│   │   └── snapshot-loader.ts   # Snapshot API integration
│   └── content.config.ts    # Content collections config
├── astro.config.mjs         # Astro and Starlight config
├── CONTRIBUTING.md          # Contribution guidelines
└── README.md                # Project overview
```

## Architecture Overview

### Content Collections

Three governance content collections defined in `src/content.config.ts`:

1. **agreements** - Loaded from `src/content/governance/agreements/` via `glob()` loader
2. **policies** - Loaded from `src/content/governance/policies/` via `glob()` loader
3. **proposals** - Fetched from Snapshot API via custom `snapshotLoader()`

### Key Files

- **astro.config.mjs** - Main Astro and Starlight configuration
- **src/content.config.ts** - Content collections and schema definitions
- **src/components/starlight/Sidebar.astro** - Custom navigation sidebar (overrides Starlight)
- **src/loaders/snapshot-loader.ts** - Snapshot API integration with caching
- **src/pages/[collection]/[...slug].astro** - Dynamic route pages
- **src/pages/[collection]/index.astro** - Collection index pages

### Content Management

**Governance Content:**
- Lives in separate [governance repository](https://github.com/superbenefit/governance)
- Integrated via git submodule at `src/content/governance/`
- **Never edit submodule files directly** - make changes in governance repository

**Update Governance Content:**
```bash
git submodule update --remote src/content/governance
git add src/content/governance
git commit -m "Update governance submodule to latest

Co-authored-by: rathermercurial <rathermercurial@protonmail.com>"
```

See [.docs/CONTENT.md](.docs/CONTENT.md) for detailed submodule workflow.

### Routing

Manual dynamic routes for full control:
- `/agreements/[...slug].astro` - Renders all agreements
- `/policies/[...slug].astro` - Renders all policies
- `/proposals/[...slug].astro` - Renders all proposals

Each uses `getStaticPaths()` to query its collection and wraps content in `<StarlightPage>` component.

### Navigation

Custom sidebar in `src/components/starlight/Sidebar.astro`:
- Dynamically generated from content collections
- Hierarchical organization by folder structure
- Clickable top-level folders link to index pages
- Smart folder collapse/expand based on current page

## Common Tasks

### Adding/Modifying Pages

For governance content pages:
1. Make changes in the [governance repository](https://github.com/superbenefit/governance)
2. Update submodule: `git submodule update --remote src/content/governance`
3. Commit submodule reference update

For site functionality:
1. Modify files in `src/pages/`, `src/components/`, etc.
2. Test with `npm run dev`
3. Commit with proper co-author attribution

### Modifying Navigation

Edit `src/components/starlight/Sidebar.astro` to change navigation structure or behavior.

### Modifying Content Collections

Edit `src/content.config.ts` to:
- Add/remove collections
- Modify schemas
- Change loader configurations

### Working with Snapshot Loader

Configure in `src/content.config.ts`:
```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',
    limit: 20,
    includeFailedProposals: false,
    useMockData: false,  // Set true for offline development
  }),
  schema: snapshotProposalSchema,
})
```

Cache location: `src/.snapshot-cache.json` (gitignored)

See [.docs/SNAPSHOT_LOADER.md](.docs/SNAPSHOT_LOADER.md) for complete details.

## Documentation

Comprehensive documentation is organized in the [.docs](.docs/) directory:

- **[DEVELOPMENT.md](.docs/DEVELOPMENT.md)** - Development setup, commands, common tasks, troubleshooting
- **[ARCHITECTURE.md](.docs/ARCHITECTURE.md)** - Technical architecture, design decisions, content collections, routing, navigation
- **[CONTENT.md](.docs/CONTENT.md)** - Content structure, git submodule workflow, schema, troubleshooting
- **[SNAPSHOT_LOADER.md](.docs/SNAPSHOT_LOADER.md)** - Snapshot API integration, caching, configuration, future enhancements

For contribution workflow, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Key Principles

1. **Single Source of Truth** - Governance content lives in governance repository
2. **Co-Author Attribution** - Every commit includes co-author credit
3. **Type Safety** - Use TypeScript and schema validation
4. **Clear Separation** - Site code separate from governance content
5. **Documentation First** - Update docs when making architectural changes

## Build Output

- Production builds output to `./dist/`
- Uses Sharp for image optimization
- Generates static HTML with optimized assets
- Snapshot data fetched at build time with intelligent caching

## Troubleshooting

For development issues, see:
- [.docs/DEVELOPMENT.md](.docs/DEVELOPMENT.md#troubleshooting)
- [.docs/CONTENT.md](.docs/CONTENT.md#troubleshooting)
- [.docs/SNAPSHOT_LOADER.md](.docs/SNAPSHOT_LOADER.md#troubleshooting)

## External Resources

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build/)
- [Governance Repository](https://github.com/superbenefit/governance)
- [Snapshot API Docs](https://docs.snapshot.org/graphql-api)
