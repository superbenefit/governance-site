# Governance Content Implementation Plan

**Project**: SuperBenefit DAO Governance Site
**Repository**: superbenefit/governance-site
**Content Source**: [superbenefit/governance](https://github.com/superbenefit/governance)
**Updated**: 2025-11-05

## Overview

This plan organizes the implementation of SuperBenefit's governance documentation site using parallel workstreams. Each workstream operates independently via separate git branches and GitHub issues, coordinated through PRs.

### Philosophy Alignment

SuperBenefit embraces "minimum viable coordination"—this plan reflects that by:
- Establishing clear workstream boundaries without micromanagement
- Enabling parallel progress across independent domains
- Preserving flexibility within each workstream's scope

## Parallel Workstream Architecture

### How This Works

1. **Separate Chat Sessions**: Each workstream uses a dedicated Claude Code chat session
2. **Git Branch per Workstream**: Each chat operates on its own feature branch
3. **GitHub Issues**: Workstreams are tracked via issues for visibility and coordination
4. **Task-Based Instructions**: Each session receives focused scope and autonomy
5. **PR Coordination**: Work merges back via pull requests for review

### Workstream Dependencies

```
Foundation (WS1) ──┐
                   ├──> Integration (WS5)
Content (WS2) ─────┤
                   │
Config (WS3) ──────┤
                   │
Polish (WS4) ──────┘
```

## Workstreams

### WS1: Foundation & Structure
**Branch**: `feature/foundation-structure`
**Issue**: #TBD
**Dependency**: None (start immediately)

**Scope**:
- Remove/rename starter content to .template
- Set up core directory structure in `src/content/docs/`
- Create initial landing page (index.mdx)
- Establish content collection schema if needed

**Deliverables**:
- Clean content structure: `/agreements`, `/policies`, `/proposals`
- Functional landing page with proper hero/navigation
- Template files preserved for reference

**Chat Instructions**:
```
Work on foundation structure. Set up the core directory layout for governance
content (Agreements, Policies, Proposals). Rename starter content to .template
extensions. Create a new landing page that introduces SuperBenefit governance.
Branch: feature/foundation-structure
```

---

### WS2: Content Migration & Organization
**Branch**: `feature/content-migration`
**Issue**: #TBD
**Dependency**: Can start after WS1 establishes structure

**Scope**:
- Integrate content from superbenefit/governance repo
- Organize markdown files into appropriate sections
- Ensure proper frontmatter on all pages
- Create section index pages (agreements/index, policies/index, proposals/index)

**Deliverables**:
- All governance documents migrated and organized
- Proper frontmatter (title, description) on each page
- Section navigation working

**Chat Instructions**:
```
Work on content migration. Pull content from superbenefit/governance repository
and organize into the governance site structure. Ensure all documents have
proper frontmatter and are organized into Agreements, Policies, and Proposals.
Branch: feature/content-migration
```

---

### WS3: Configuration & Navigation
**Branch**: `feature/navigation-config`
**Issue**: #TBD
**Dependency**: Can start immediately, refine after WS1/WS2

**Scope**:
- Update astro.config.mjs with proper site title and branding
- Configure sidebar navigation for governance sections
- Set up social links (GitHub, etc.)
- Configure metadata and SEO settings

**Deliverables**:
- Site properly branded as "SuperBenefit Governance"
- Sidebar navigation organized and functional
- Proper social/GitHub links configured

**Chat Instructions**:
```
Work on site configuration and navigation. Update astro.config.mjs with
SuperBenefit branding, configure sidebar navigation for the governance structure
(Agreements, Policies, Proposals), and set up proper metadata.
Branch: feature/navigation-config
```

---

### WS4: Design & Polish
**Branch**: `feature/design-polish`
**Issue**: #TBD
**Dependency**: After WS1 provides basic structure

**Scope**:
- Customize Starlight theme/styling for SuperBenefit branding
- Add any custom components needed
- Optimize images and assets
- Improve visual hierarchy and readability

**Deliverables**:
- Site visually aligned with SuperBenefit brand
- Custom styling or components as needed
- Optimized asset loading

**Chat Instructions**:
```
Work on design and visual polish. Customize the Starlight theme to align with
SuperBenefit branding, add any custom components needed, and ensure the site
has good visual hierarchy and readability.
Branch: feature/design-polish
```

---

### WS5: Integration & Testing
**Branch**: `feature/integration-testing`
**Issue**: #TBD
**Dependency**: After WS1-4 complete (final integration)

**Scope**:
- Merge and test all workstreams together
- Verify build passes
- Test navigation and internal links
- Ensure content displays properly
- Final QA before production

**Deliverables**:
- Fully integrated site
- All tests passing
- Production-ready build

**Chat Instructions**:
```
Work on integration and testing. Merge all feature branches, resolve any
conflicts, verify the build works, test all navigation and links, and ensure
the site is production-ready.
Branch: feature/integration-testing
```

## Content Structure

Target directory structure:

```
src/content/docs/
├── index.mdx                    # Landing page (splash)
├── agreements/
│   ├── index.md                 # Agreements overview
│   └── [agreement-docs].md      # Individual agreements
├── policies/
│   ├── index.md                 # Policies overview
│   └── [policy-docs].md         # Individual policies
└── proposals/
    ├── index.md                 # Proposals overview
    └── [proposal-docs].md       # Individual proposals
```

## Coordination Notes

### Starting a Workstream
1. Create/assign GitHub issue
2. Open new Claude Code chat session
3. Provide task-based instructions (from above)
4. Let Claude create the branch and start work

### Completing a Workstream
1. Claude commits and pushes to feature branch
2. Create PR from feature branch to main
3. Review and merge
4. Close associated issue

### Handling Dependencies
- **WS1** should complete before **WS2** migrates content
- **WS3** can start immediately but may need refinement after WS1/WS2
- **WS4** can start after basic structure exists
- **WS5** waits for all others to reach PR stage

### Communication Between Workstreams
- Use PR descriptions to communicate changes
- Reference related PRs/issues in commits
- Keep main branch as integration point
- Coordinate timing via issue comments if needed

## Success Criteria

- [ ] All starter content removed or renamed
- [ ] Governance content organized into three main sections
- [ ] Site properly branded as SuperBenefit Governance
- [ ] Navigation functional and intuitive
- [ ] Build completes successfully
- [ ] Content displays correctly with proper formatting
- [ ] Site ready for deployment

## Notes

- **Content Source**: Always reference superbenefit/governance repo for authoritative content
- **Minimal Coordination**: Each workstream has autonomy within its scope
- **Quality over Speed**: Better to do thoughtful work than rush parallel streams
- **Flexibility**: Adjust workstream boundaries as needed during implementation
