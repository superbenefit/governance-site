# Governance Content Implementation Plan

**Project**: SuperBenefit DAO Governance Site
**Repository**: superbenefit/governance-site
**Content Source**: [superbenefit/governance](https://github.com/superbenefit/governance) (via git submodule)
**Architecture**: Submodule + Content Loaders
**Updated**: 2025-11-05

## Overview

This plan organizes the implementation of SuperBenefit's governance documentation site using parallel workstreams. Each workstream operates independently via separate git branches, coordinated through PRs.

### Architecture: Submodule + Loaders

The governance content lives in a separate repository ([superbenefit/governance](https://github.com/superbenefit/governance)) and is integrated as a git submodule at `src/content/governance/`. The site uses Astro's content loader system to dynamically generate pages from the submodule content, maintaining a single source of truth.

**Key Benefits**:
- Single source of truth (governance repo)
- Automatic updates when governance repo changes
- Clean separation between content and presentation
- Standard git submodule workflow

**How It Works**:
1. Governance content lives in submodule: `src/content/governance/`
2. Custom loaders in `src/content.config.ts` read from submodule
3. Loaders generate routes dynamically (agreements, policies, proposals)
4. Index pages are pre-made templates that integrate with loader-generated content

### Philosophy Alignment

SuperBenefit embraces "minimum viable coordination"—this plan reflects that by:
- Establishing clear workstream boundaries without micromanagement
- Enabling parallel progress across independent domains
- Preserving flexibility within each workstream's scope

## Parallel Workstream Architecture

### How This Works

1. **Separate Chat Sessions**: Each workstream uses a dedicated Claude Code chat session
2. **Git Branch per Workstream**: Each chat operates on its own feature branch
3. **Task-Based Instructions**: Each session receives focused scope and autonomy
4. **PR Coordination**: Work merges back via pull requests for review

### Workstream Dependencies

```
WS1 (Foundation + Submodule) ──┐
                               ├──> WS2a (Loaders) ──> WS2b (Organization) ──┐
WS3 (Navigation) ──────────────┘                                             ├──> WS5 (Integration)
                                                                              │
WS4 (Design) ─────────────────────────────────────────────────────────────────┘
```

## Workstreams

### WS1: Foundation, Structure & Submodule Setup
**Branch**: `feature/foundation-structure`
**Dependency**: None (start immediately)

**Scope**:
- Remove/rename starter content to .template (DONE)
- Set up core directory structure in `src/content/docs/`
- Initialize and verify governance submodule at `src/content/governance/`
- Create initial landing page (index.mdx)
- Document submodule usage for contributors

**Deliverables**:
- Clean content structure: `/agreements`, `/policies`, `/proposals` directories created
- Governance submodule initialized and accessible
- Functional landing page with proper hero/navigation
- Template files preserved for reference
- README section documenting submodule workflow

**Chat Instructions**:
```
Work on foundation structure and submodule setup. Set up the core directory layout,
initialize the governance submodule, and create a new landing page.
Branch: feature/foundation-structure
```

---

### WS2a: Content Loader Implementation
**Branch**: `feature/content-loaders`
**Dependency**: Requires WS1 (submodule must be initialized)

**Scope**:
- Implement custom content loaders in `src/content.config.ts`
- Create loader functions for agreements, policies, and proposals
- Define content schemas for governance documents
- Configure routing to generate pages from submodule content
- Test loader functionality with sample governance content

**Deliverables**:
- Custom loaders reading from `src/content/governance/`
- Proper schema definitions for all content types
- Dynamic route generation working
- Documentation of loader architecture
- Test coverage for loader functions

**Chat Instructions**:
```
Work on content loader implementation. Create custom Astro content loaders that read
from the governance submodule and generate pages dynamically. Focus on the technical
implementation of the loader system.
Branch: feature/content-loaders
```

---

### WS2b: Content Organization & Index Pages
**Branch**: `feature/content-organization`
**Dependency**: Requires WS2a (loaders must exist to understand integration points)

**Scope**:
- Create pre-made index page templates (agreements/index, policies/index, proposals/index)
- Implement dynamic content slotting in index pages
- Verify submodule content has proper frontmatter structure
- Add any missing frontmatter to governance submodule content
- Create root-level pages (governance.md, code-of-conduct.md, contributing.md) that load from submodule
- Document frontmatter requirements for governance content

**Deliverables**:
- Index page templates that integrate with loader-generated content
- Root pages loading dynamically from submodule
- Frontmatter validation and documentation
- Style guide for governance content contributions

**Chat Instructions**:
```
Work on content organization and index pages. Create the index page templates that
integrate with the loader-generated content. Ensure proper frontmatter structure.
Branch: feature/content-organization
```

---

### WS3: Configuration & Navigation
**Branch**: `feature/navigation-config`
**Dependency**: Can start after WS1; may need refinement after WS2a/WS2b

**Scope**:
- Update astro.config.mjs with proper site title and branding
- Configure sidebar navigation for governance sections
- Implement visual hierarchy: de-emphasize root pages vs. main sections
- Handle nested subdirectory navigation (agreements/community/, agreements/dao/, etc.)
- Configure autogenerate for loader-generated pages
- Set up social links (GitHub, etc.)
- Configure metadata and SEO settings

**Deliverables**:
- Site properly branded as "SuperBenefit Governance"
- Sidebar navigation with visual hierarchy (main sections prominent, root pages de-emphasized)
- Nested navigation working correctly
- Proper social/GitHub links configured
- Autogenerate configured for dynamic content

**Chat Instructions**:
```
Work on site configuration and navigation. Update astro.config.mjs with SuperBenefit
branding, configure sidebar navigation with proper visual hierarchy, and handle nested
subdirectories. Ensure autogenerate works with loader-generated content.
Branch: feature/navigation-config
```

---

### WS4: Design & Polish
**Branch**: `feature/design-polish`
**Dependency**: After WS1 provides basic structure

**Scope**:
- Customize Starlight theme/styling for SuperBenefit branding
- Add any custom components needed for governance content
- Optimize images and assets
- Improve visual hierarchy and readability
- Style index page templates
- Ensure loader-generated pages have good typography and layout

**Deliverables**:
- Site visually aligned with SuperBenefit brand
- Custom styling or components as needed
- Optimized asset loading
- Good typography for governance content
- Responsive design across devices

**Chat Instructions**:
```
Work on design and visual polish. Customize the Starlight theme to align with
SuperBenefit branding, add any custom components needed for governance content,
and ensure excellent visual hierarchy and readability.
Branch: feature/design-polish
```

---

### WS5: Integration & Testing
**Branch**: `feature/integration-testing`
**Dependency**: After WS1, WS2a, WS2b, WS3, WS4 complete (final integration)

**Scope**:
- Merge and test all workstreams together
- Verify build passes
- Test dynamic content loading from submodule
- Validate loader-generated routes work correctly
- Test submodule update workflow
- Test navigation and internal links
- Ensure content displays properly
- Verify frontmatter parsing
- Final QA before production

**Deliverables**:
- Fully integrated site
- All tests passing
- Loader system fully functional
- Submodule workflow documented and tested
- Production-ready build

**Chat Instructions**:
```
Work on integration and testing. Merge all feature branches, resolve conflicts,
verify the loader system works correctly, test submodule updates, and ensure
the site is production-ready.
Branch: feature/integration-testing
```

## Content Structure

Target directory structure:

```
src/content/
├── docs/                        # Site pages (landing, indexes)
│   ├── index.mdx                # Landing page (splash)
│   ├── agreements/
│   │   └── index.md             # Pre-made agreements index (slots loader content)
│   ├── policies/
│   │   └── index.md             # Pre-made policies index (slots loader content)
│   └── proposals/
│       └── index.md             # Pre-made proposals index (slots loader content)
│
└── governance/                  # Git submodule (governance repo)
    ├── agreements/              # Source content loaded by agreements loader
    │   ├── index.md
    │   ├── community/
    │   └── dao/
    ├── policies/                # Source content loaded by policies loader
    │   ├── index.md
    │   ├── metagovernance/
    │   ├── operations/
    │   └── platforms/
    ├── proposals/               # Source content loaded by proposals loader
    │   └── index.md
    ├── GOVERNANCE.md            # Loaded as root page
    ├── CODE_OF_CONDUCT.md       # Loaded as root page
    └── CONTRIBUTING.md          # Loaded as root page
```

## Coordination Notes

### Starting a Workstream
1. Open new Claude Code chat session
2. Provide task-based instructions (from parallelization-prompts.md)
3. Let Claude create the branch and start work

### Completing a Workstream
1. Claude commits and pushes to feature branch
2. Create PR from feature branch to main
3. Review and merge

### Handling Dependencies
- **WS1** must complete before **WS2a** (submodule must be initialized)
- **WS2a** must complete before **WS2b** (loaders define integration points)
- **WS3** can start after WS1, refine after WS2a/WS2b
- **WS4** can start after basic structure exists
- **WS5** waits for all others to reach PR stage

### Communication Between Workstreams
- Use PR descriptions to communicate changes
- Reference related PRs in commits
- Keep main branch as integration point
- Document any changes that affect other workstreams

## Success Criteria

- [ ] All starter content removed or renamed
- [ ] Governance submodule initialized and accessible
- [ ] Custom content loaders implemented and functional
- [ ] Dynamic route generation working for all three sections
- [ ] Index pages integrate with loader-generated content
- [ ] Site properly branded as SuperBenefit Governance
- [ ] Navigation functional with proper visual hierarchy
- [ ] Build completes successfully
- [ ] Content displays correctly with proper formatting
- [ ] Submodule update workflow tested and documented
- [ ] Site ready for deployment

## Technical Architecture Notes

### Content Loaders
Custom loaders in `src/content.config.ts` will:
1. Read content from `src/content/governance/` submodule
2. Parse markdown files and frontmatter
3. Generate page routes dynamically
4. Apply content schema validation
5. Enable Starlight features (search, navigation, etc.)

### Submodule Workflow
Contributors updating governance content:
1. Make changes in governance repo (superbenefit/governance)
2. Commit and push to governance repo
3. In site repo, run `git submodule update --remote`
4. Commit submodule pointer update
5. Rebuild site to see changes

### Why This Architecture
- **Single Source of Truth**: Governance repo is authoritative
- **Automatic Updates**: Submodule updates flow through automatically
- **Clean Separation**: Content (governance repo) vs. presentation (site repo)
- **Type Safety**: Loaders + schema validation ensure content consistency
- **Flexibility**: Can add new content types without restructuring

## Notes

- **Content Source**: Always reference superbenefit/governance repo for authoritative content
- **Submodule Best Practice**: Never edit submodule content directly in site repo
- **Minimal Coordination**: Each workstream has autonomy within its scope
- **Quality over Speed**: Better to do thoughtful work than rush parallel streams
- **Flexibility**: Adjust workstream boundaries as needed during implementation

---
