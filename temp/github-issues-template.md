# GitHub Issues for Governance Site Workstreams

Copy these into GitHub to create the issues. After creating, update the issue numbers in `parallelization-prompts.md`.

---

## Issue 1: WS1: Foundation & Structure

**Title**: `WS1: Foundation & Structure`

**Labels**: `workstream`, `foundation`, `priority: high`

**Body**:
```markdown
## Workstream: Foundation & Structure

**Branch**: `feature/foundation-structure`
**Dependencies**: None (start immediately)

### Scope
- Rename existing starter content files to .template extensions (keep as reference)
- Create core directory structure in src/content/docs/: agreements/, policies/, proposals/
- Create initial landing page (index.mdx) introducing SuperBenefit governance

### Deliverables
- [ ] Starter content renamed to .template (DONE in initial setup)
- [ ] Clean directory structure with three main directories
- [ ] Placeholder index.md files in each directory
- [ ] Functional landing page with proper hero/navigation
- [ ] Template files preserved for reference

### Reference
- See `governance-content-plan.md` for full context and coordination details
- See `parallelization-prompts.md` for the prompt to use in a dedicated chat session

### Chat Instructions
To work on this in a separate Claude Code session, copy the WS1 prompt from `parallelization-prompts.md`.
```

---

## Issue 2: WS2: Content Migration & Organization

**Title**: `WS2: Content Migration & Organization`

**Labels**: `workstream`, `content`, `priority: high`

**Body**:
```markdown
## Workstream: Content Migration & Organization

**Branch**: `feature/content-migration`
**Dependencies**: WS1 should be complete and merged first

### Scope
- Integrate content from superbenefit/governance repo
- Organize markdown files into appropriate sections (Agreements, Policies, Proposals)
- Ensure proper frontmatter on all pages (title, description)
- Create section index pages for each main directory

### Deliverables
- [ ] All governance documents migrated and organized
- [ ] Proper frontmatter on each page
- [ ] Section index pages created (agreements/index, policies/index, proposals/index)
- [ ] Section navigation working

### Blocking
⚠️ **Wait for Issue #1 (WS1) to be merged before starting**

### Reference
- See `governance-content-plan.md` for full context and coordination details
- See `parallelization-prompts.md` for the prompt to use in a dedicated chat session
- Content source: https://github.com/superbenefit/governance

### Chat Instructions
To work on this in a separate Claude Code session, copy the WS2 prompt from `parallelization-prompts.md`.
```

---

## Issue 3: WS3: Configuration & Navigation

**Title**: `WS3: Configuration & Navigation`

**Labels**: `workstream`, `configuration`, `priority: medium`

**Body**:
```markdown
## Workstream: Configuration & Navigation

**Branch**: `feature/navigation-config`
**Dependencies**: Can start immediately (may need refinement after WS1/WS2)

### Scope
- Update astro.config.mjs with SuperBenefit branding
- Configure sidebar navigation for governance sections
- Set up social links (GitHub, etc.)
- Configure metadata and SEO settings

### Deliverables
- [ ] Site properly branded as "SuperBenefit Governance"
- [ ] Sidebar navigation organized for three sections
- [ ] Proper social/GitHub links configured
- [ ] Search and other Starlight features enabled
- [ ] Metadata and SEO settings configured

### Reference
- See `governance-content-plan.md` for full context and coordination details
- See `parallelization-prompts.md` for the prompt to use in a dedicated chat session

### Chat Instructions
To work on this in a separate Claude Code session, copy the WS3 prompt from `parallelization-prompts.md`.

### Notes
You may need to refine navigation after WS1 and WS2 complete. Check their PR status and adjust as needed.
```

---

## Issue 4: WS4: Design & Polish

**Title**: `WS4: Design & Polish`

**Labels**: `workstream`, `design`, `priority: low`

**Body**:
```markdown
## Workstream: Design & Polish

**Branch**: `feature/design-polish`
**Dependencies**: WS1 should be complete for basic structure

### Scope
- Customize Starlight theme/styling for SuperBenefit branding
- Add any custom components needed
- Optimize images and assets
- Improve visual hierarchy and readability

### Deliverables
- [ ] Site visually aligned with SuperBenefit brand
- [ ] Custom theme colors/fonts if needed
- [ ] Custom components created (if helpful for governance content)
- [ ] Images optimized and branded
- [ ] Good visual hierarchy and responsive design

### Blocking
⚠️ **Wait for Issue #1 (WS1) to have basic structure before starting**

### Reference
- See `governance-content-plan.md` for full context and coordination details
- See `parallelization-prompts.md` for the prompt to use in a dedicated chat session

### Chat Instructions
To work on this in a separate Claude Code session, copy the WS4 prompt from `parallelization-prompts.md`.

### Notes
This is lower priority. Focus on functionality first, then polish.
```

---

## Issue 5: WS5: Integration & Testing

**Title**: `WS5: Integration & Testing`

**Labels**: `workstream`, `integration`, `testing`, `priority: high`

**Body**:
```markdown
## Workstream: Integration & Testing

**Branch**: `feature/integration-testing`
**Dependencies**: WS1-4 should all be complete or near completion

### Scope
- Merge and test all workstreams together
- Verify build passes
- Test navigation and internal links
- Ensure content displays properly
- Final QA before production

### Deliverables
- [ ] All feature branches integrated successfully
- [ ] Build completes without errors
- [ ] All navigation tested and working
- [ ] Content displays correctly
- [ ] Responsive design verified
- [ ] No console errors
- [ ] Production-ready build

### Blocking
⚠️ **Wait for Issues #1, #2, #3, and #4 to be merged before starting**

### Reference
- See `governance-content-plan.md` for full context and coordination details
- See `parallelization-prompts.md` for the prompt to use in a dedicated chat session

### Chat Instructions
To work on this in a separate Claude Code session, copy the WS5 prompt from `parallelization-prompts.md`.

### Testing Checklist
- [ ] npm run build succeeds
- [ ] npm run dev works correctly
- [ ] All sidebar links functional
- [ ] Internal content links work
- [ ] All three sections accessible
- [ ] Search works (if enabled)
- [ ] Responsive on mobile/tablet/desktop
- [ ] No broken links or images
- [ ] SEO metadata present
```

---

## After Creating Issues

1. **Update parallelization-prompts.md**:
   - Replace all `#TBD` with actual issue numbers
   - Update the Quick Reference table at the bottom

2. **Label Management**:
   - Create labels if they don't exist: `workstream`, `foundation`, `content`, `configuration`, `design`, `integration`, `testing`
   - Add priority labels as appropriate

3. **Project Board** (optional):
   - Create a project board to track workstream progress
   - Add all issues to the board
   - Use columns: "Not Started", "In Progress", "In Review", "Done"

4. **Start Work**:
   - Begin with WS1 and WS3 (no dependencies)
   - Wait for WS1 before starting WS2 and WS4
   - Save WS5 for last (integrates all work)
