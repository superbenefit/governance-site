# Dynamic Navigation and Index Pages

## Summary

This PR implements a comprehensive navigation system and dynamic index pages for the SuperBenefit Governance site. It replaces Starlight's default sidebar and content routing with a custom implementation that reads directly from the governance submodule, providing a more flexible and maintainable architecture.

## Key Features

### 1. Custom Dynamic Navigation Sidebar

**Location:** `src/components/starlight/Sidebar.astro`

A custom sidebar component that replaces Starlight's default navigation with dynamically generated, hierarchical navigation from governance collections:

- **Dynamic Generation**: Automatically builds navigation from `agreements`, `policies`, and `proposals` collections
- **Hierarchical Organization**: Groups content by folder structure (e.g., `policies/metagovernance/`, `policies/operations/`)
- **Clickable Top-Level Folders**: Agreements, Policies, and Proposals link to their index pages
- **Smart Folder States**: Lower-level folders collapse/expand based on current page context
- **Clean Visual Design**:
  - No bullets on folders (native disclosure triangles only)
  - Bullets on individual pages for easy scanning
  - Bold top-level folder names with adequate spacing
  - De-emphasized "Reference" section at bottom
- **Mobile Optimized**: 44px touch targets and responsive spacing for mobile devices
- **JavaScript Enhancement**: Prevents folder link clicks from toggling disclosure state

### 2. Dynamic Index Pages with Governance Content

**Locations:**
- `src/pages/agreements/index.astro`
- `src/pages/policies/index.astro`
- `src/pages/proposals/index.astro`

Index pages that combine static content from the governance repository with dynamically generated document lists:

**How They Work:**
1. Read `index.md` files from governance submodule (e.g., `src/content/governance/agreements/index.md`)
2. Extract frontmatter (description) and H1 title from governance content
3. Render markdown prose using `marked` library
4. Query the collection to get all documents
5. Extract document titles from frontmatter or H1 headings using `render()`
6. Group documents by subfolder
7. Display as wide horizontal cards with title, description, and status badges

**Card Layout Features:**
- Full-width cards stacked vertically (not multi-column grid)
- Border with accent-color hover effect
- Document title (from frontmatter or H1)
- Description text (if available)
- Color-coded status badges (draft/active/deprecated) in top-right corner
- Folder grouping with underlined section headers

**Title Extraction Logic:**
1. First: Check frontmatter `title` field
2. Then: Extract first H1 heading from document
3. Finally: Fall back to entry ID

This ensures page titles like "Operating Agreement" display instead of filenames like "operating-agreement".

### 3. Home Page with Collection Overview

**Location:** `src/pages/index.astro`

A landing page that provides:
- Overview of SuperBenefit governance philosophy
- Card grid linking to the three main collections
- Document counts for each collection
- Information about the governance framework

### 4. Build Configuration Fixes

- Added `marked` package for markdown rendering in index pages
- Configured Vite to properly bundle `marked` for SSR and static builds
- Added to both `optimizeDeps` and `ssr.noExternal` for complete build support

## Architecture Benefits

- **Single Source of Truth**: All content (including index page prose) managed in governance repository
- **Auto-Updating**: Adding new documents automatically updates navigation and index pages
- **Type Safety**: Schema validation catches content errors
- **Maintainability**: Clear separation between site code and governance content
- **Flexibility**: Easy to add new collections or modify routing logic
- **Full Control**: Not constrained by Starlight's routing conventions while keeping its UI benefits

## Files Changed

**19 files changed, 1,237 insertions(+), 213 deletions(-)**

### New Files
- `src/components/starlight/Sidebar.astro` - Custom navigation sidebar
- `src/pages/index.astro` - Home/landing page
- `src/pages/agreements/index.astro` - Agreements index with dynamic cards
- `src/pages/policies/index.astro` - Policies index with dynamic cards
- `src/pages/proposals/index.astro` - Proposals index with dynamic cards
- `src/styles/custom.css` - Custom styling for navigation hierarchy
- `src/content/docs/.gitkeep` - Empty docs directory (required by Starlight)

### Modified Files
- `astro.config.mjs` - Added custom sidebar component override and Vite config for `marked`
- `package.json` - Added `marked` dependency
- `README.md` - Comprehensive documentation of new features
- `CLAUDE.md` - Updated project overview

### Removed Files
- `src/content/docs/` MDX templates (replaced by dynamic index pages)

## Testing

- ✅ Build completes successfully (21 pages built)
- ✅ All static routes generate correctly
- ✅ Navigation hierarchy displays properly
- ✅ Index pages render governance content + document cards
- ✅ Title extraction works from both frontmatter and H1 headings
- ✅ Mobile navigation responsive and touch-friendly
- ✅ Status badges display when present in frontmatter

## Breaking Changes

None - this is additive functionality. The site now has navigation and index pages where they didn't exist before.

## Documentation

- README updated with comprehensive architecture documentation
- Documented index pages feature (how it works, card layout, title extraction)
- Documented custom sidebar (features, structure, customization)
- Updated project structure to reflect current file organization
- All code includes inline comments explaining behavior

## Next Steps

After merging:
1. Add content to governance repository `index.md` files to customize index page prose
2. Add frontmatter `description` fields to documents for card descriptions
3. Add `status` fields to documents for status badge display
4. Consider adding more collections or sections as governance content grows
