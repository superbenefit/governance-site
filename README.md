# SuperBenefit Governance Site

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

The official documentation website for SuperBenefit DAO's governance framework, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build/).

## About

This website serves as the public interface for SuperBenefit DAO's governance documentation, providing accessible and searchable access to:

- **Agreements** - Relational foundations that define how community members work together
- **Policies** - Practical coordination mechanisms across different operational domains
- **Proposals** - Institutional memory archive preserving decision-making processes and deliberative context, automatically fetched from [Snapshot](https://snapshot.org/#/superbenefit.eth)

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
│   │   └── starlight/
│   │       └── Sidebar.astro     # Custom navigation sidebar (overrides Starlight)
│   ├── content/
│   │   ├── docs/             # Empty directory (required by Starlight)
│   │   └── governance/       # Git submodule (governance repository)
│   │       ├── agreements/   # Agreement markdown files
│   │       ├── policies/     # Policy markdown files
│   │       └── proposals/    # Proposal markdown files (optional - not used)
│   ├── loaders/              # Custom content loaders
│   │   ├── README.md             # Detailed loader documentation
│   │   └── snapshot-loader.ts    # Snapshot API integration
│   ├── pages/                # Route pages
│   │   ├── index.astro       # Home/landing page
│   │   ├── agreements/
│   │   │   ├── index.astro       # Agreements index with dynamic card list
│   │   │   └── [...slug].astro   # Individual agreement pages
│   │   ├── policies/
│   │   │   ├── index.astro       # Policies index with dynamic card list
│   │   │   └── [...slug].astro   # Individual policy pages
│   │   └── proposals/
│   │       ├── index.astro       # Proposals index with dynamic card list
│   │       └── [...slug].astro   # Individual proposal pages
│   ├── styles/
│   │   └── custom.css        # Custom CSS for navigation styling
│   └── content.config.ts     # Content collections configuration
├── astro.config.mjs          # Astro and Starlight configuration
├── CLAUDE.md                 # AI assistant guidance
└── package.json
```

### Working with Content

Governance documentation is written in Markdown (`.md`) format and managed in the separate [governance repository](https://github.com/superbenefit/governance).

To add or update governance content:
1. Make changes in the governance repository
2. Update the submodule: `git submodule update --remote src/content/governance`
3. Commit the submodule reference update
4. Test locally with `npm run dev`

The custom navigation sidebar automatically reflects the governance content structure.

## Architecture

This site uses:
- **Astro 5.x** - Modern static site generator
- **Starlight** - Astro's official documentation theme
- **Content Collections** - Type-safe content management with Astro's collection system
- **Custom Content Loaders** - Dynamic loading from governance submodule and Snapshot API
- **Dynamic Routing** - Manual route generation for full control
- **Sharp** - Optimized image processing
- **graphql-request** - GraphQL client for Snapshot API integration
- **marked** - Markdown to HTML conversion for proposal content

### Content Loader Architecture

The site implements a custom content loading architecture that separates governance content from site pages while maintaining Starlight's UI aesthetics.

#### Collections

Three governance content collections are defined in `src/content.config.ts`:

1. **`agreements`** - Governance agreements loaded from `src/content/governance/agreements/` using `glob()` loader
2. **`policies`** - Governance policies loaded from `src/content/governance/policies/` using `glob()` loader
3. **`proposals`** - Governance proposals fetched from Snapshot API using a custom `snapshotLoader()` (see [Snapshot Proposals](#snapshot-proposals-integration))

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

#### Index Pages with Dynamic Content

Each main collection (agreements, policies, proposals) has a dedicated index page that combines static content from the governance repository with a dynamically generated list of all documents in that collection.

**Locations:**
- `src/pages/agreements/index.astro`
- `src/pages/policies/index.astro`
- `src/pages/proposals/index.astro`

##### How Index Pages Work

Each index page:

1. **Reads governance content** - Loads the corresponding `index.md` file from the governance submodule (e.g., `src/content/governance/agreements/index.md`)
2. **Extracts frontmatter** - Pulls `description` and other metadata from the governance index file
3. **Extracts H1 title** - Uses the first H1 heading as the page title
4. **Renders markdown** - Converts markdown content to HTML using the `marked` library
5. **Queries the collection** - Gets all entries from the collection (e.g., all agreements)
6. **Extracts document titles** - Uses Astro's `render()` to extract H1 headings when titles aren't in frontmatter
7. **Groups by folder** - Organizes documents by subfolder structure
8. **Displays cards** - Renders wide horizontal cards with title, description, and optional status badges

##### Card Layout

Documents are displayed as wide, horizontal cards with:

- **Border with hover effect** - Changes to accent color on hover
- **Document title** - Extracted from frontmatter or H1 heading
- **Description** - Shown below title if available in frontmatter
- **Status badge** - Color-coded badge in top-right corner (draft/active/deprecated)
- **Folder grouping** - Documents organized under subfolder headings
- **Full-width cards** - Each document gets its own card stacked vertically (not a multi-column grid)

##### Title Extraction Logic

For accurate titles in both navigation and index cards:

1. **First**: Check frontmatter `title` field
2. **Then**: Extract first H1 heading from document using `render()`
3. **Finally**: Fall back to entry ID if neither exists

This ensures page titles like "Operating Agreement" are displayed instead of filenames like "operating-agreement".

##### Content Source

The index page content (introduction, description, context) comes from `index.md` files in the governance repository:

- `src/content/governance/agreements/index.md`
- `src/content/governance/policies/index.md`
- `src/content/governance/proposals/index.md`

This maintains the governance repository as the single source of truth for all content, including index page prose.

##### Benefits

- **Single source of truth** - All content including index pages managed in governance repo
- **Auto-updating lists** - Adding new documents automatically updates index pages
- **Rich context** - Combines curated prose with comprehensive document listings
- **Consistent styling** - Cards match site's visual design language
- **Mobile-friendly** - Responsive card layout works well on all screen sizes

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

#### Snapshot Proposals Integration

The proposals collection has a unique implementation that fetches data from the [Snapshot voting platform](https://snapshot.org) rather than loading from local markdown files. This provides an up-to-date archive of DAO governance decisions.

**Location:** `src/loaders/snapshot-loader.ts`

##### Overview

The custom Snapshot loader:
- Fetches passed proposals from the `superbenefit.eth` Snapshot space via GraphQL API
- Implements intelligent caching to minimize API calls and speed up builds
- Converts proposal markdown content to HTML for proper rendering
- Calculates voting outcomes and displays comprehensive voting metadata
- Only includes closed proposals that passed (>50% voting threshold)

##### Architecture

**Data Flow:**
1. **Build Time** - Loader queries Snapshot GraphQL API at `https://hub.snapshot.org/graphql`
2. **Cache Check** - Checks `src/.snapshot-cache.json` for previously processed proposals
3. **Process New** - Only processes new/changed proposals (closed proposals are immutable)
4. **Markdown Conversion** - Converts proposal body from markdown to HTML using `marked` library
5. **Content Sanitization** - Strips dangerous HTML tags for security
6. **Store Entries** - Returns typed entries for Astro content collection

**GraphQL Query:**
```graphql
query GetProposals($space: String!, $first: Int!) {
  proposals(
    first: $first
    where: { space: $space, state: "closed" }
    orderBy: "created"
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    scores
    scores_total
    votes
    start
    end
    state
    author
    snapshot
  }
}
```

##### Caching Strategy

The loader implements an efficient file-based cache:

**Cache Location:** `src/.snapshot-cache.json` (gitignored)

**Cache Validation:**
- Uses proposal ID + end timestamp + state for validation
- Closed proposals are immutable on Snapshot, so cached HTML is always valid
- Skips expensive markdown conversion for cached proposals
- Significantly speeds up subsequent builds

**Cache Structure:**
```typescript
{
  id: string,           // Proposal ID
  end: number,          // End timestamp
  state: string,        // Proposal state ('closed')
  htmlBody: string,     // Pre-rendered HTML
  data: object,         // Proposal metadata
  cachedAt: number      // Cache timestamp
}
```

##### Proposal Display

Each proposal page includes:

**Main Content:**
- Full proposal body (markdown converted to HTML)
- Original formatting preserved with GitHub Flavored Markdown

**Voting Results Card:**
- Winning choice and vote percentage
- Total number of voters
- Status badge (passed/rejected)
- Expandable full breakdown of all choices and scores
- Author address (shortened format)
- Start and end dates
- Link to original Snapshot proposal

**Status Calculation:**
- Proposal passes if winning choice has >50% of total voting power
- Only passed proposals are included in collection

##### Navigation Sorting

Proposals in the sidebar navigation are sorted by `endDate` (most recent first) to match the proposals index page:

- Uses `buildProposalsNavTree()` function with date-based sorting
- Falls back to `lastUpdated` then alphabetical if no date available
- Titles truncated to 59 characters to prevent navigation overflow
- Uses ellipsis (…) for truncated titles

##### Configuration

Configure the loader in `src/content.config.ts`:

```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',        // Snapshot space name
    limit: 20,                         // Max proposals to fetch
    includeFailedProposals: false,     // Only include passed proposals
    useMockData: false,                // Use mock data for testing
  }),
  schema: snapshotProposalSchema,
})
```

**Options:**
- `space` - Snapshot space identifier (e.g., `superbenefit.eth`)
- `limit` - Maximum number of proposals to fetch (default: 20)
- `includeFailedProposals` - Include rejected proposals (default: false)
- `useMockData` - Use mock data instead of API for local development (default: false)

##### Schema Extensions

The `snapshotProposalSchema` extends the base `governanceSchema` with Snapshot-specific fields:

```typescript
{
  // Base governance fields
  title: string (optional),
  description: string (required),
  status: 'passed' | 'rejected' (required),

  // Snapshot-specific fields
  snapshotId: string (optional),
  author: string (optional),
  choices: string[] (optional),
  scores: number[] (optional),
  scores_total: number (optional),
  votes: number (optional),
  startDate: date (optional),
  endDate: date (optional),
  snapshot: string (optional),        // Block number
  winningChoice: string (optional),
  winningScore: number (optional),
  percentageVoted: number (optional),
}
```

##### Development Notes

**Local Development:**
- Set `useMockData: true` in config for offline development
- Cache file speeds up builds after first successful fetch
- Network errors fall back gracefully with helpful warnings

**Production Builds:**
- Fetches latest proposals at build time
- Cache ensures incremental builds are fast
- Only new proposals trigger API calls and markdown processing

**Security:**
- Content sanitization removes `<script>`, `<iframe>`, and other dangerous tags
- Only safe HTML tags preserved in rendered output
- Prevents XSS attacks from malicious proposal content

##### Future Enhancements

Potential improvements documented in `src/loaders/README.md`:
- Rate limiting with exponential backoff
- Cache TTL/expiration for rebuilds
- Webhook-triggered incremental updates
- Support for active proposals (not just closed)
- Filtering by date range or specific proposal IDs

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
