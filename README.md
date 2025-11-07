# SuperBenefit Governance Site

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

The official documentation website for SuperBenefit DAO's governance framework, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build/).

## About

This website serves as the public interface for SuperBenefit DAO's governance documentation, providing accessible and searchable access to:

- **Agreements** - Relational foundations that define how community members work together
- **Policies** - Practical coordination mechanisms across different operational domains
- **Proposals** - Institutional memory archive preserving decision-making processes and deliberative context

SuperBenefit DAO embraces "minimum viable coordination"—establishing just enough structure to enable effective collaboration while preserving contributor autonomy. This documentation site makes that framework transparent and accessible to all community members and the wider public.

## Content Source

The governance documentation content is maintained in a separate repository: [superbenefit/governance](https://github.com/superbenefit/governance)

This content is integrated into the site using a **git submodule** located at `src/content/governance/`. This approach maintains a single source of truth for governance content while enabling dynamic page generation through Astro content loaders.

### Working with the Governance Submodule

#### First-Time Setup

When cloning this repository for the first time, you need to initialize the submodule:

```bash
git submodule init
git submodule update
```

Or clone the repository with submodules in one step:

```bash
git clone --recurse-submodules https://github.com/superbenefit/governance-site.git
```

#### Updating Governance Content

To pull the latest governance content from the governance repository:

```bash
git submodule update --remote src/content/governance
```

This updates the submodule to the latest commit from the governance repository's main branch.

#### Important Notes

- **Do NOT edit files in `src/content/governance/` directly** - This directory contains the submodule, and changes here won't be tracked properly
- **Content contributions** should be made to the [governance repository](https://github.com/superbenefit/governance), not this site repository
- The submodule points to a specific commit in the governance repository
- When you update the submodule, you'll need to commit the new submodule reference in this repository:

```bash
git add src/content/governance
git commit -m "Update governance submodule to latest"
```

#### Checking Submodule Status

To see the current state of the submodule:

```bash
git submodule status
```

## Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or your preferred package manager

### Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

### Project Structure

```
.
├── public/                    # Static assets (favicons, etc.)
├── src/
│   ├── assets/               # Images and media files
│   ├── components/
│   │   ├── starlight/
│   │   │   └── Sidebar.astro     # Custom navigation sidebar (overrides Starlight)
│   │   └── CollectionList.astro  # Component for querying/displaying collection entries
│   ├── content/
│   │   ├── docs/             # Site pages (landing, indexes) - MDX
│   │   │   ├── agreements/
│   │   │   │   └── index.mdx    # Agreements index with CollectionList
│   │   │   ├── policies/
│   │   │   │   └── index.mdx    # Policies index with CollectionList
│   │   │   └── proposals/
│   │   │       └── index.mdx    # Proposals index with CollectionList
│   │   └── governance/       # Git submodule (governance repository)
│   │       ├── agreements/   # Agreement markdown files
│   │       ├── policies/     # Policy markdown files
│   │       └── proposals/    # Proposal markdown files
│   ├── pages/                # Dynamic route pages
│   │   ├── agreements/
│   │   │   └── [...slug].astro  # Renders agreement pages
│   │   ├── policies/
│   │   │   └── [...slug].astro  # Renders policy pages
│   │   └── proposals/
│   │       └── [...slug].astro  # Renders proposal pages
│   └── content.config.ts     # Content collections configuration
├── astro.config.mjs          # Astro and Starlight configuration
├── CLAUDE.md                 # AI assistant guidance
└── package.json
```

### Working with Content

Documentation pages are written in Markdown (`.md`) or MDX (`.mdx`) format and stored in `src/content/docs/`. Each file is automatically exposed as a route based on its file name.

To add or update documentation:
1. Edit files in `src/content/docs/` or sync content from the [governance repository](https://github.com/superbenefit/governance)
2. Include required frontmatter: `title` and `description`
3. Update sidebar configuration in `astro.config.mjs` if needed
4. Test locally with `npm run dev`

## Architecture

This site uses:
- **Astro 5.x** - Modern static site generator
- **Starlight** - Astro's official documentation theme
- **Content Collections** - Type-safe content management with Astro's collection system
- **Custom Content Loaders** - Dynamic loading from governance submodule
- **Dynamic Routing** - Manual route generation for full control
- **Sharp** - Optimized image processing

### Content Loader Architecture

The site implements a custom content loading architecture that separates governance content from site pages while maintaining Starlight's UI aesthetics.

#### Collections

Four content collections are defined in `src/content.config.ts`:

1. **`docs`** - Site pages (landing page, index pages) using Starlight's loader
2. **`agreements`** - Governance agreements loaded from `src/content/governance/agreements/`
3. **`policies`** - Governance policies loaded from `src/content/governance/policies/`
4. **`proposals`** - Governance proposals loaded from `src/content/governance/proposals/`

#### Content Loading

Governance collections use Astro's `glob()` loader to dynamically load markdown files from the submodule:

```typescript
agreements: defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!index.md', '!readme.md', '!README.md', '!**/index.md', '!**/readme.md', '!**/README.md'],
    base: './src/content/governance/agreements'
  }),
  schema: governanceSchema,
})
```

**Key features:**
- **Negation patterns** exclude `index.md` and `readme.md` files (these don't match governance schema)
- **Nested directory support** preserves folder structure in URLs
- **Schema validation** ensures all content has required frontmatter fields
- **Type safety** with Zod schema for governance documents

#### Schema

The `governanceSchema` defines required and optional frontmatter:

```typescript
{
  title: string (optional - extracted from H1 if missing),
  description: string (required),
  status: 'draft' | 'active' | 'deprecated' (optional),
  lastUpdated: date (optional),
  tags: string[] (optional),
  relatedDocs: string[] (optional)
}
```

#### Dynamic Routing

Unlike Starlight's automatic routing, this implementation uses **manual dynamic routes** for full control:

- **`src/pages/agreements/[...slug].astro`** - Renders all agreements
- **`src/pages/policies/[...slug].astro`** - Renders all policies
- **`src/pages/proposals/[...slug].astro`** - Renders all proposals

Each route file:
1. Uses `getStaticPaths()` to query its collection
2. Calls `render()` from `astro:content` to process markdown
3. Extracts title from H1 if not in frontmatter
4. Wraps content in `<StarlightPage>` component for consistent UI

**Example URL mapping:**
- File: `src/content/governance/policies/operations/authority-delegation.md`
- URL: `/policies/operations/authority-delegation/`

#### Index Pages

Collection index pages (`/agreements/`, `/policies/`, `/proposals/`) are MDX templates in `src/content/docs/` that use the `<CollectionList>` component:

```mdx
---
title: Agreements
description: Core agreements and foundational documents
---

import CollectionList from '../../../components/CollectionList.astro';

<CollectionList collection="agreements" />
```

The `CollectionList` component queries the collection and renders grouped, linked entries.

#### Custom Navigation Sidebar

The site implements a custom sidebar navigation system that dynamically generates hierarchical navigation from the governance content collections, replacing Starlight's default sidebar configuration.

**Location:** `src/components/starlight/Sidebar.astro`

##### Features

The custom sidebar provides:

1. **Dynamic Navigation** - Automatically generates navigation from `agreements`, `policies`, and `proposals` collections
2. **Hierarchical Organization** - Groups content by folder structure (e.g., `policies/metagovernance/`, `policies/operations/`)
3. **Clickable Top-Level Folders** - Agreements, Policies, and Proposals folders link to their index pages
4. **Smart Folder States** - Lower-level folders collapse by default and expand when viewing pages within them
5. **Clean Visual Design**:
   - No bullets on folders (uses native `<details>` disclosure triangles)
   - Bullets on individual pages for easy scanning
   - Bold top-level folder names
   - Adequate spacing between sections
6. **Mobile-Optimized** - Responsive styles with 44px touch targets and optimized spacing for mobile devices

##### Navigation Structure

```
Agreements (clickable → /agreements/)
├─ Dao (collapsible folder)
│  └─ • Operating Agreement

Policies (clickable → /policies/)
├─ Metagovernance (collapsible folder)
│  ├─ • Amendment Policy
│  ├─ • Dispute Policy
│  └─ ...
├─ Operations (collapsible folder)
│  └─ ...
└─ Platforms (collapsible folder)
   └─ ...

Proposals (clickable → /proposals/)

Reference (de-emphasized section)
├─ • Governance Framework
├─ • Code of Conduct
└─ • Contributing
```

##### How It Works

**Content Organization:**
1. Queries all entries from each collection (`getCollection('agreements')`, etc.)
2. Groups entries by folder path using the `buildNavTree()` helper function
3. Transforms folder names with `formatGroupName()` (e.g., `metagovernance` → `Metagovernance`)
4. Extracts page titles using `formatTitle()` (from frontmatter or H1)

**Folder State Logic:**
- **Top-level folders** (Agreements, Policies, Proposals): Always `open` by default
- **Lower-level folders** (subfolders): Use `open={currentPath.startsWith(\`/collection/folder/\`)}` to automatically expand when viewing pages within that folder
- Clicking folder names navigates to index pages (top-level only)
- Clicking disclosure triangles toggles folder expansion without navigation

**Mobile Optimizations:**
- `min-height: 44px` on top-level folder links for adequate touch targets
- `@media (max-width: 768px)` breakpoint with:
  - Reduced negative margins to prevent edge cutoff
  - Tighter spacing for better mobile density
  - Same navigation works in mobile hamburger menu

**CSS Architecture:**
- Negative margins (`margin-left: -1.25rem` on desktop, `-0.75rem` on mobile) on folders to align with page bullets
- `.folder-item` class for folders (no bullets)
- `.page-item` class for pages (with bullets)
- `.top-level-item` class for main sections (bold, extra spacing)
- `.reference-section` class for de-emphasized static links

**JavaScript Enhancement:**
- Prevents top-level folder links from toggling `<details>` elements
- Uses `stopPropagation()` so clicking folder names navigates while clicking triangles toggles
- Only applies to top-level folders (subfolders use native behavior)

##### Customization

To modify navigation behavior:

1. **Add/Remove Collections:** Edit the collection queries and navigation structure in `Sidebar.astro`
2. **Change Folder Names:** Modify the `formatGroupName()` function
3. **Adjust Spacing:** Update CSS variables and margin/padding values
4. **Mobile Breakpoint:** Change the `@media (max-width: 768px)` value
5. **Folder Open/Collapse Logic:** Modify the `open` attribute on `<details>` elements

**Important:** Subfolders (like `metagovernance`, `operations`) do not have index pages. Only top-level collections (Agreements, Policies, Proposals) have clickable folder names that link to `/collection/index.mdx` pages.

#### Why This Architecture?

This approach provides:

- **Single source of truth** - Content lives in governance repository
- **Full routing control** - Not constrained by Starlight conventions
- **Starlight UI benefits** - Uses Starlight for aesthetics without its routing limitations
- **Type safety** - Schema validation catches content errors
- **Maintainability** - Clear separation between site code and governance content
- **Flexibility** - Easy to add new collections or modify routing logic

See [CLAUDE.md](./CLAUDE.md) for detailed architectural guidance.

## Contributing

This is an open-source project operating under a CC0-1.0 license, making all content freely available for reuse and modification.

For governance content updates, please contribute to the [superbenefit/governance](https://github.com/superbenefit/governance) repository.

For website functionality, design, or technical improvements, please submit issues and pull requests to this repository.

## Resources

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [SuperBenefit DAO Governance Repository](https://github.com/superbenefit/governance)

## License

The governance content is licensed under CC0-1.0. The website code follows standard open-source practices.
