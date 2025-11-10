# Architecture

This document describes the technical architecture and design decisions behind the SuperBenefit Governance Site.

## Overview

The SuperBenefit Governance Site is built as a static documentation site using modern web technologies. The architecture emphasizes:

- **Single source of truth** - Governance content lives in a separate repository
- **Type safety** - Schema validation catches content errors at build time
- **Performance** - Static generation with optimized assets
- **Maintainability** - Clear separation between content and presentation
- **Flexibility** - Custom routing and content loading for precise control

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Astro 5.x** | Static site generator and build system |
| **Starlight** | Documentation theme providing UI components and styling |
| **TypeScript** | Type-safe development with strict configuration |
| **Content Collections** | Type-safe content management with schema validation |
| **Sharp** | High-performance image optimization |
| **graphql-request** | GraphQL client for Snapshot API integration |
| **marked** | Markdown to HTML conversion for dynamic content |

## Design Philosophy

### Why Not Use Starlight's Default Routing?

Starlight expects all content to live in `src/content/docs/` and uses automatic routing. However, our requirements differ:

1. **External Content Source** - Governance content lives in a separate git repository (submodule)
2. **Multiple Collections** - We have distinct collections (agreements, policies, proposals) that need different handling
3. **Dynamic Content** - Proposals are fetched from Snapshot API, not local files
4. **Custom Index Pages** - Index pages combine static content with dynamically generated lists

### Solution: Custom Content Loaders + Manual Routing

We use Astro's content loader API with manual dynamic routes to achieve full control while maintaining Starlight's UI aesthetics.

## Content Collections Architecture

### Collections Definition

Three governance content collections are defined in `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { snapshotLoader } from './loaders/snapshot-loader';

const collections = {
  agreements: defineCollection({
    loader: glob({
      pattern: ['**/*.md', '!index.md', '!**/index.md', ...],
      base: './src/content/governance/agreements'
    }),
    schema: governanceSchema,
  }),

  policies: defineCollection({
    loader: glob({
      pattern: ['**/*.md', '!index.md', '!**/index.md', ...],
      base: './src/content/governance/policies'
    }),
    schema: governanceSchema,
  }),

  proposals: defineCollection({
    loader: snapshotLoader({
      space: 'superbenefit.eth',
      limit: 20,
      includeFailedProposals: false,
    }),
    schema: snapshotProposalSchema,
  }),
};
```

### Content Loading Strategy

**Local Collections (Agreements, Policies):**
1. Use Astro's built-in `glob()` loader
2. Scan `src/content/governance/` directory (git submodule)
3. Exclude `index.md` files (they don't match governance schema)
4. Preserve folder structure in URLs
5. Validate against `governanceSchema`

**Remote Collection (Proposals):**
1. Use custom `snapshotLoader()` at build time
2. Fetch from Snapshot GraphQL API
3. Calculate voting outcomes
4. Convert markdown to HTML
5. Implement intelligent caching
6. Validate against `snapshotProposalSchema`

See [SNAPSHOT_LOADER.md](./SNAPSHOT_LOADER.md) for detailed information about the Snapshot integration.

### Schema Definitions

**Base Governance Schema:**

```typescript
const governanceSchema = z.object({
  title: z.string().optional(),              // Extracted from H1 if missing
  description: z.string(),                    // Required
  status: z.enum(['draft', 'active', 'deprecated']).optional(),
  lastUpdated: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  relatedDocs: z.array(z.string()).optional(),
});
```

**Extended Snapshot Schema:**

```typescript
const snapshotProposalSchema = governanceSchema.extend({
  snapshotId: z.string().optional(),
  author: z.string().optional(),
  choices: z.array(z.string()).optional(),
  scores: z.array(z.number()).optional(),
  scores_total: z.number().optional(),
  votes: z.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  snapshot: z.string().optional(),
  winningChoice: z.string().optional(),
  winningScore: z.number().optional(),
  percentageVoted: z.number().optional(),
});
```

## Routing Architecture

### Manual Dynamic Routes

Unlike Starlight's automatic routing, we use **manual dynamic routes** for full control:

**Route Files:**
- `src/pages/agreements/[...slug].astro` - Renders all agreements
- `src/pages/policies/[...slug].astro` - Renders all policies
- `src/pages/proposals/[...slug].astro` - Renders all proposals

**How Dynamic Routes Work:**

```astro
---
// src/pages/agreements/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const agreements = await getCollection('agreements');
  return agreements.map(entry => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content, headings } = await entry.render();
---

<StarlightPage {...props}>
  <Content />
</StarlightPage>
```

**Benefits:**
- Full control over page generation
- Can customize props passed to pages
- Easy to add custom logic (filtering, sorting, etc.)
- Clear separation of routing logic

### URL Structure

Files in the governance submodule map directly to URLs:

| Source | URL |
|--------|-----|
| `governance/agreements/dao/operating-agreement.md` | `/agreements/dao/operating-agreement/` |
| `governance/policies/operations/authority.md` | `/policies/operations/authority/` |
| Snapshot API (proposal ID) | `/proposals/0x1234abcd.../` |

## Index Pages with Dynamic Content

Each main collection has a dedicated index page that combines static content with dynamically generated document lists.

**Index Page Locations:**
- `src/pages/agreements/index.astro`
- `src/pages/policies/index.astro`
- `src/pages/proposals/index.astro`

### How Index Pages Work

1. **Load Static Content** - Read `index.md` from governance submodule
2. **Extract Metadata** - Parse frontmatter for description and other fields
3. **Extract Title** - Use first H1 heading from markdown
4. **Render Markdown** - Convert to HTML using `marked` library
5. **Query Collection** - Get all documents in the collection
6. **Extract Titles** - Use `render()` to extract H1 headings
7. **Group by Folder** - Organize documents by subfolder
8. **Display Cards** - Render wide horizontal cards with metadata

### Card Layout

Documents are displayed as full-width cards with:

- **Border with hover effect** - Accent color on hover
- **Document title** - From frontmatter or H1 heading
- **Description** - From frontmatter if available
- **Status badge** - Color-coded (draft/active/deprecated)
- **Folder grouping** - Documents organized under subfolder headings

### Title Extraction Logic

For accurate page titles in navigation and index cards:

1. **First**: Check frontmatter `title` field
2. **Then**: Extract first H1 heading using `render()`
3. **Finally**: Fall back to entry ID

This ensures "Operating Agreement" displays instead of "operating-agreement".

### Content Source

Index page prose (introduction, context) comes from `index.md` files in the governance repository:

- `src/content/governance/agreements/index.md`
- `src/content/governance/policies/index.md`
- `src/content/governance/proposals/index.md`

This maintains the governance repository as the single source of truth.

## Custom Navigation Sidebar

The site implements a custom sidebar that dynamically generates hierarchical navigation from governance content collections, replacing Starlight's default sidebar.

**Location:** `src/components/starlight/Sidebar.astro`

### Navigation Structure

```
Agreements (clickable → /agreements/)
├─ Dao (collapsible folder)
│  └─ • Operating Agreement

Policies (clickable → /policies/)
├─ Metagovernance (collapsible folder)
│  ├─ • Amendment Policy
│  └─ • Dispute Policy
├─ Operations (collapsible folder)
└─ Platforms (collapsible folder)

Proposals (clickable → /proposals/)
└─ Individual proposals (sorted by date)

Reference (static links)
├─ • Governance Framework
└─ • Contributing
```

### Key Features

1. **Dynamic Generation** - Automatically built from content collections
2. **Hierarchical Organization** - Groups content by folder structure
3. **Clickable Top-Level Folders** - Main sections link to index pages
4. **Smart Folder States** - Subfolders collapse/expand based on current page
5. **Clean Visual Design**:
   - No bullets on folders (native `<details>` disclosure triangles)
   - Bullets on individual pages
   - Bold top-level folder names
   - Adequate spacing between sections
6. **Mobile-Optimized** - 44px touch targets, responsive spacing

### Implementation Details

**Content Organization:**

```typescript
// Query all collections
const agreements = await getCollection('agreements');
const policies = await getCollection('policies');
const proposals = await getCollection('proposals');

// Group by folder
const groupedPolicies = buildNavTree(policies);

// Format for display
const navItems = formatNavTree(groupedPolicies);
```

**Folder State Logic:**

```astro
<details open={currentPath.startsWith('/collection/folder/')}>
  <summary>Folder Name</summary>
  <!-- Child items -->
</details>
```

- Top-level folders: Always `open` by default
- Subfolders: Open when viewing pages within that folder
- Clicking folder names navigates (top-level only)
- Clicking triangles toggles expansion

**CSS Architecture:**

- Negative margins align folders with page bullets
- `.folder-item` class for folders (no bullets)
- `.page-item` class for pages (with bullets)
- `.top-level-item` class for main sections (bold, spacing)
- Mobile breakpoint at 768px with adjusted spacing

**JavaScript Enhancement:**

```typescript
// Prevent top-level folder links from toggling <details>
folderLink.addEventListener('click', (e) => {
  e.stopPropagation();
});
```

### Proposals Navigation

Proposals are sorted by `endDate` (most recent first):

- Uses `buildProposalsNavTree()` function
- Falls back to `lastUpdated` then alphabetical
- Titles truncated to 59 characters
- Ellipsis (…) for truncated titles

## Snapshot Proposals Integration

Proposals are fetched dynamically from the Snapshot API rather than loaded from local files.

**Loader:** `src/loaders/snapshot-loader.ts`

### Architecture Overview

```
┌─────────────────────┐
│  Snapshot API       │
│  hub.snapshot.org   │
└──────────┬──────────┘
           │ GraphQL Query (build time)
           ▼
┌─────────────────────┐
│  Snapshot Loader    │
│  - Fetch proposals  │
│  - Cache results    │
│  - Calculate votes  │
│  - Convert markdown │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Content Collection │
│  (proposals)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Dynamic Routes     │
│  /proposals/[slug]  │
└─────────────────────┘
```

### Key Features

1. **GraphQL API Integration** - Fetches from Snapshot at build time
2. **Intelligent Caching** - File-based cache at `src/.snapshot-cache.json`
3. **Voting Calculation** - Determines pass/fail with 50% threshold
4. **Content Sanitization** - Removes dangerous HTML/JavaScript
5. **Markdown Conversion** - Converts proposal bodies to HTML
6. **Type Safety** - Full TypeScript with Zod validation

### Caching Strategy

**Cache Location:** `src/.snapshot-cache.json` (gitignored)

**Cache Validation:**
- Uses proposal ID + end timestamp + state
- Closed proposals are immutable on Snapshot
- Cached HTML is always valid for closed proposals
- Significantly speeds up subsequent builds

**Cache Structure:**

```typescript
{
  id: string,           // Proposal ID
  end: number,          // End timestamp
  state: string,        // 'closed'
  htmlBody: string,     // Pre-rendered HTML
  data: object,         // Proposal metadata
  cachedAt: number      // Cache timestamp
}
```

### Configuration

```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',        // Snapshot space
    limit: 20,                         // Max proposals
    includeFailedProposals: false,     // Only passed proposals
    useMockData: false,                // Use mock data for testing
  }),
  schema: snapshotProposalSchema,
})
```

For detailed information, see [SNAPSHOT_LOADER.md](./SNAPSHOT_LOADER.md).

## Build Process

### Build Pipeline

1. **Content Loading**
   - Load local markdown from governance submodule
   - Fetch proposals from Snapshot API (with caching)
   - Validate all content against schemas

2. **Page Generation**
   - Generate pages via `getStaticPaths()`
   - Render markdown to HTML
   - Extract headings for table of contents
   - Apply Starlight page wrapper

3. **Asset Processing**
   - Optimize images with Sharp
   - Bundle and minify CSS/JavaScript
   - Copy static assets from `public/`

4. **Output**
   - Static HTML files to `./dist/`
   - Optimized assets with content hashing
   - Sitemap and RSS feed (if configured)

### Performance Optimizations

- **Static Generation** - All pages pre-rendered at build time
- **Image Optimization** - Automatic responsive images with Sharp
- **Code Splitting** - Astro's intelligent bundling
- **Caching** - Snapshot loader caches processed proposals
- **Lazy Loading** - Images load lazily by default

## Configuration Files

### astro.config.mjs

Main Astro and Starlight configuration:

```javascript
export default defineConfig({
  site: 'https://governance.superbenefit.xyz',
  integrations: [
    starlight({
      title: 'SuperBenefit Governance',
      social: {
        github: 'https://github.com/superbenefit/governance',
        discord: 'https://discord.gg/superbenefit',
      },
      // Custom sidebar disabled (using custom component)
      sidebar: [],
      components: {
        Sidebar: './src/components/starlight/Sidebar.astro',
      },
    }),
  ],
});
```

### src/content.config.ts

Content collections and schema definitions:

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const collections = {
  agreements: defineCollection({ ... }),
  policies: defineCollection({ ... }),
  proposals: defineCollection({ ... }),
};

export { collections };
```

### tsconfig.json

TypeScript configuration with strict checking:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

## Why This Architecture?

This architecture provides:

1. **Single Source of Truth** - Content lives in governance repository
2. **Full Routing Control** - Not constrained by Starlight conventions
3. **Starlight UI Benefits** - Beautiful aesthetics without routing limitations
4. **Type Safety** - Schema validation catches errors early
5. **Maintainability** - Clear separation between site code and content
6. **Flexibility** - Easy to add collections or modify routing
7. **Performance** - Static generation with optimized assets
8. **Developer Experience** - Clear structure, type checking, hot reload

## Further Reading

- [CONTENT.md](./CONTENT.md) - Content management and submodules
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow
- [SNAPSHOT_LOADER.md](./SNAPSHOT_LOADER.md) - Snapshot integration details
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Starlight Documentation](https://starlight.astro.build/)
