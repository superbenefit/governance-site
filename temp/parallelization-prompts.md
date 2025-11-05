# Parallelization Prompts for Governance Site Workstreams

**Purpose**: Copy-paste prompts for launching parallel Claude Code chat sessions
**Architecture**: Submodule + Content Loaders
**Updated**: 2025-11-05

## How to Use This Document

1. Open a new Claude Code chat session (new browser tab)
2. Copy the entire prompt for the workstream you want to work on
3. Paste into the new chat session
4. Claude will create the branch, check dependencies, and begin work

## Important Notes

- Each prompt includes context about the project and dependencies
- Check dependencies before starting (is the prior workstream complete?)
- Each chat operates independently on its own branch
- **Architecture**: Content lives in governance submodule, loaded dynamically

---

## WS1: Foundation, Structure & Submodule Setup

**Dependency**: ✅ None (start immediately)

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on FOUNDATION, STRUCTURE & SUBMODULE SETUP (WS1).

CONTEXT:
- This is an Astro + Starlight documentation site
- We're implementing governance docs organized into: Agreements, Policies, Proposals
- Content source: https://github.com/superbenefit/governance (as git submodule)
- Architecture: Submodule + Content Loaders (dynamic page generation)
- See governance-content-plan.md and content-structure.md for full context

MY WORKSTREAM SCOPE:
1. Verify starter content is renamed to .template (should already be done):
   - src/content/docs/index.mdx.template
   - src/content/docs/guides/example.md.template
   - src/content/docs/reference/example.md.template

2. Create core directory structure in src/content/docs/:
   - agreements/ (with placeholder index.md)
   - policies/ (with placeholder index.md)
   - proposals/ (with placeholder index.md)

3. Initialize governance submodule:
   - Submodule should be configured: src/content/governance → https://github.com/superbenefit/governance
   - Run: git submodule init && git submodule update
   - Verify content is accessible at src/content/governance/
   - Check that governance repo structure is visible (agreements/, policies/, proposals/)

4. Create new landing page (src/content/docs/index.mdx):
   - Use Starlight splash template (template: splash in frontmatter)
   - Hero section introducing SuperBenefit DAO governance
   - Tagline about governance framework and minimum viable coordination
   - Card grid or links to three main sections (Agreements, Policies, Proposals)
   - Brief explanation of each section

5. Document submodule workflow:
   - Add section to README.md explaining:
     * How to initialize submodule (for new clones)
     * How to update submodule (git submodule update --remote)
     * That content edits happen in governance repo, not site repo
     * Link to governance repo for content contributions

BRANCH: feature/foundation-structure

CRITICAL: The governance content MUST be in a git submodule, not copied directly. This maintains single source of truth.

Please:
1. Create the feature branch
2. Complete the scope above
3. Verify submodule is working (list files in src/content/governance/)
4. Commit with clear messages
5. Push to origin
6. Let me know when ready for PR

Start now!
```

---

## WS2a: Content Loader Implementation

**Dependency**: ⚠️ Requires WS1 (submodule must be initialized)

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on CONTENT LOADER IMPLEMENTATION (WS2a).

CONTEXT:
- This is an Astro + Starlight documentation site
- Governance content lives in submodule: src/content/governance/
- We need custom loaders to dynamically generate pages from submodule content
- Architecture: Loaders read markdown from submodule, parse frontmatter, generate routes
- See governance-content-plan.md and content-structure.md for full context

DEPENDENCY CHECK:
- WS1 (Foundation & Submodule Setup) must be complete and merged to main
- Verify that src/content/governance/ submodule is initialized and has content
- Check that agreements/, policies/, proposals/ directories exist in submodule
- If not complete, wait or coordinate before proceeding

MY WORKSTREAM SCOPE:
1. Implement custom content loaders in src/content.config.ts:
   - Create loader functions for three collections: agreements, policies, proposals
   - Each loader reads from corresponding submodule directory
   - Parse markdown files and extract frontmatter
   - Generate route slugs preserving directory structure

2. Handle nested directories correctly:
   - agreements/community/ → routes like /agreements/community/[doc]
   - agreements/dao/ → routes like /agreements/dao/[doc]
   - policies/metagovernance/, policies/operations/, policies/platforms/
   - proposals/ (flat structure currently)

3. Define content schemas for validation:
   - Required fields: title (string), description (string)
   - Optional fields: status (string), lastUpdated (Date), tags (string[]), relatedDocs (string[])
   - Apply schema to each collection

4. Configure collections in src/content.config.ts:
   ```typescript
   export const collections = {
     docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
     agreements: defineCollection({ 
       loader: governanceLoader('agreements'), 
       schema: agreementSchema 
     }),
     policies: defineCollection({ 
       loader: governanceLoader('policies'), 
       schema: policySchema 
     }),
     proposals: defineCollection({ 
       loader: governanceLoader('proposals'), 
       schema: proposalSchema 
     }),
   };
   ```

5. Test loader functionality:
   - Run npm run dev
   - Verify pages generate for existing governance docs
   - Check that routes match expected structure
   - Ensure frontmatter parsed correctly
   - Test nested directory routes

6. Document loader architecture:
   - Add code comments explaining how loaders work
   - Document schema requirements
   - Explain route generation logic

TECHNICAL NOTES:
- Use Astro's content loader API (similar to docsLoader from Starlight)
- Loaders should recursively scan directories
- Preserve folder structure in route slugs
- Handle both .md and .mdx files
- Validate frontmatter against schema
- Consider creating loaders in separate file: src/loaders/governance.ts (if complex)

BRANCH: feature/content-loaders

Please:
1. Pull latest from main first (to get WS1 changes)
2. Create the feature branch
3. Complete the scope above
4. Test thoroughly with npm run dev
5. Commit with clear messages
6. Push to origin
7. Let me know when ready for PR

Start now!
```

---

## WS2b: Content Organization & Index Pages

**Dependency**: ⚠️ Requires WS2a (loaders must exist to understand integration points)

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on CONTENT ORGANIZATION & INDEX PAGES (WS2b).

CONTEXT:
- This is an Astro + Starlight documentation site
- Content loaders (from WS2a) generate pages dynamically from submodule
- We need pre-made index page templates that integrate with loader content
- Root pages should load directly from submodule files
- See governance-content-plan.md and content-structure.md for full context

DEPENDENCY CHECK:
- WS2a (Content Loader Implementation) must be complete and merged to main
- Verify that content collections (agreements, policies, proposals) are working
- Check that loader-generated routes are accessible
- If not complete, wait or coordinate before proceeding

MY WORKSTREAM SCOPE:
1. Create pre-made index page templates:
   - src/content/docs/agreements/index.md
   - src/content/docs/policies/index.md
   - src/content/docs/proposals/index.md

2. Each index page should include:
   - Proper frontmatter (title, description, sidebar order: 0)
   - Static prose explaining the section's purpose
   - Context about SuperBenefit's approach (minimum viable coordination)
   - Dynamic list of documents from loader (use Astro component or getCollection)
   - Example structure:
     ```markdown
     ---
     title: Agreements
     description: Relational foundations that define how we work together
     sidebar:
       order: 0
     ---

     [Prose explaining agreements and their role in SuperBenefit governance...]

     ## Current Agreements

     <!-- Component or logic to list agreements from collection -->
     ```

3. Create root-level pages that load from submodule:
   - governance.md (loads from src/content/governance/GOVERNANCE.md)
   - code-of-conduct.md (loads from src/content/governance/CODE_OF_CONDUCT.md)
   - contributing.md (loads from src/content/governance/CONTRIBUTING.md)
   - These should be in src/content/docs/ at root level
   - May need special loader logic or symlinks/imports

4. Verify frontmatter in submodule content:
   - Check existing governance docs have title and description
   - Add missing frontmatter to submodule files if needed
   - Ensure frontmatter matches schema from WS2a
   - Document any updates made to governance repo

5. Create dynamic content integration:
   - Build Astro component(s) to list collection items
   - Display: document title, description, status, last updated
   - Link to full document pages
   - Style appropriately (cards, list, or grid)

6. Document frontmatter requirements:
   - Create style guide for governance content contributions
   - Explain required vs optional fields
   - Provide examples of good frontmatter
   - Document how to add new documents to governance repo

TECHNICAL NOTES:
- Use Astro's getCollection() to fetch loader data
- Index pages are "pre-made templates" that slot in dynamic lists
- Root pages need special handling (loading from submodule top-level files)
- Consider creating reusable DocumentList component
- Ensure proper TypeScript types for collection data

BRANCH: feature/content-organization

Please:
1. Pull latest from main first (to get WS2a changes)
2. Create the feature branch
3. Complete the scope above
4. Test with npm run dev (verify index pages display correctly)
5. Commit with clear messages (include any submodule content updates)
6. Push to origin
7. Let me know when ready for PR

Start now!
```

---

## WS3: Configuration & Navigation

**Dependency**: ⚠️ Start after WS1; may need refinement after WS2a/WS2b

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on CONFIGURATION & NAVIGATION (WS3).

CONTEXT:
- This is an Astro + Starlight documentation site
- We're setting up governance docs: Agreements, Policies, Proposals
- Content loaded dynamically via loaders from submodule
- Navigation must handle nested directories and visual hierarchy
- See governance-content-plan.md and content-structure.md for full context

MY WORKSTREAM SCOPE:
1. Update astro.config.mjs branding:
   - Change title from "My Docs" to "SuperBenefit Governance"
   - Update social links to point to superbenefit/governance-site repo
   - Configure site description reflecting governance purpose

2. Configure sidebar navigation with visual hierarchy:
   - Main sections (Agreements, Policies, Proposals) prominent at top
   - Use autogenerate for these sections to include loader-generated pages
   - Handle nested directories:
     * agreements/community/
     * agreements/dao/
     * policies/metagovernance/
     * policies/operations/
     * policies/platforms/
   - Add visual separator after main sections
   - Root pages (Governance, Code of Conduct, Contributing) de-emphasized below
   - Implement de-emphasis via styling (lighter text, reduced opacity, or smaller font)

3. Example sidebar structure:
   ```javascript
   sidebar: [
     {
       label: 'Agreements',
       autogenerate: { directory: 'agreements' },
     },
     {
       label: 'Policies',
       autogenerate: { directory: 'policies' },
     },
     {
       label: 'Proposals',
       autogenerate: { directory: 'proposals' },
     },
     // Visual separator (may need custom CSS)
     {
       label: 'Resources',
       collapsed: true,
       items: [
         { label: 'Governance Framework', slug: 'governance' },
         { label: 'Code of Conduct', slug: 'code-of-conduct' },
         { label: 'Contributing', slug: 'contributing' },
       ],
     },
   ],
   ```

4. Configure Starlight features:
   - Enable search if not already enabled
   - Configure table of contents (if needed)
   - Set up appropriate default page layout settings
   - Enable breadcrumbs
   - Configure any helpful built-in features

5. Set up proper metadata:
   - Site-wide SEO description
   - Default og:image if available
   - Add appropriate head tags

6. Custom CSS for visual hierarchy (if needed):
   - Create custom CSS file for navigation styling
   - De-emphasize root pages section
   - Add spacing/separator between sections
   - Ensure nested directories display clearly

7. Test navigation structure:
   - Verify sidebar organization is logical
   - Check that nested directories appear correctly
   - Ensure autogenerate works with loader-generated pages
   - Test collapsed/expanded states
   - Verify visual hierarchy is clear

BRANCH: feature/navigation-config

NOTES:
- You may need to refine this after WS2a/WS2b complete
- Focus on getting the structure right; iterate as needed
- Check if WS2a is merged for accurate collection structure
- Loader-generated pages should appear in autogenerate sections

Please:
1. Create the feature branch (can branch from main or wait for WS1)
2. Complete the scope above
3. Test with npm run dev (verify navigation works)
4. Commit with clear messages
5. Push to origin
6. Let me know when ready for PR

Start now!
```

---

## WS4: Design & Polish

**Dependency**: ⚠️ Requires WS1 (for basic structure)

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on DESIGN & POLISH (WS4).

CONTEXT:
- This is an Astro + Starlight documentation site
- SuperBenefit DAO governance documentation
- Content loaded dynamically from submodule
- Index pages and loader-generated pages need consistent styling
- See governance-content-plan.md and content-structure.md for full context

DEPENDENCY CHECK:
- WS1 (Foundation & Structure) should be complete for basic structure
- If not complete, focus on planning and setup work first

MY WORKSTREAM SCOPE:
1. Customize Starlight theme for SuperBenefit branding:
   - Review if custom colors/fonts are needed
   - Consider SuperBenefit visual identity (if documented)
   - Implement theme customizations via Starlight config or custom CSS
   - Create cohesive color palette (primary, accent, backgrounds)
   - Select appropriate typography

2. Style index page templates:
   - Ensure agreements/index, policies/index, proposals/index look polished
   - Style dynamic document lists (cards, grid, or formatted list)
   - Add appropriate spacing and visual hierarchy
   - Consider status badges for documents (active, draft, deprecated)
   - Ensure responsive layout

3. Create custom components (if needed):
   - Evaluate if governance-specific components would be helpful
   - Examples:
     * Status badge component (active, draft, deprecated)
     * Proposal timeline component
     * Document card component
     * Related documents component
   - Create in src/components/ if needed
   - Document component usage

4. Optimize images and assets:
   - Replace default Starlight assets if appropriate
   - Add SuperBenefit logo/branding images (if available)
   - Ensure images are optimized (Sharp will handle processing)
   - Store in src/assets/
   - Configure proper alt text

5. Improve visual hierarchy for content:
   - Ensure loader-generated pages have good typography
   - Style headings, lists, and content consistently
   - Add any custom CSS for governance documents
   - Ensure frontmatter-driven content (status, dates) displays well
   - Test readability and scan-ability

6. Enhance landing page (index.mdx):
   - Add visual elements or hero image
   - Style card grid for three main sections
   - Add call-to-action elements
   - Ensure splash template looks polished
   - Consider animation or interactive elements (subtle)

7. Test responsive design:
   - Verify mobile layout
   - Test tablet breakpoints
   - Ensure navigation works on all devices
   - Check touch targets and accessibility

8. Accessibility and polish:
   - Verify color contrast ratios
   - Test keyboard navigation
   - Ensure focus states are visible
   - Check semantic HTML structure

BRANCH: feature/design-polish

Please:
1. Pull latest from main first
2. Create the feature branch
3. Complete the scope above
4. Test on multiple devices/screen sizes
5. Commit with clear messages
6. Push to origin
7. Let me know when ready for PR

Start now!
```

---

## WS5: Integration & Testing

**Dependency**: ⚠️ Requires WS1, WS2a, WS2b, WS3, WS4 all complete

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on INTEGRATION & TESTING (WS5).

CONTEXT:
- This is an Astro + Starlight documentation site
- Final integration workstream bringing all parallel work together
- Must verify submodule + loader architecture works correctly
- See governance-content-plan.md and content-structure.md for full context

DEPENDENCY CHECK:
Before starting, verify that these workstreams are complete and merged:
- [ ] WS1: Foundation, Structure & Submodule Setup
- [ ] WS2a: Content Loader Implementation
- [ ] WS2b: Content Organization & Index Pages
- [ ] WS3: Configuration & Navigation
- [ ] WS4: Design & Polish

If any are incomplete, coordinate before proceeding.

MY WORKSTREAM SCOPE:
1. Integration:
   - Pull latest from main (should include all merged workstreams)
   - If any workstreams aren't merged yet, merge feature branches locally
   - Resolve any merge conflicts carefully
   - Ensure all changes work together harmoniously
   - Verify no regressions from integration

2. Build verification:
   - Run npm run build
   - Fix any build errors or warnings
   - Check TypeScript compilation passes
   - Verify dist/ output looks correct
   - Confirm no missing dependencies

3. Content loader testing:
   - Verify loaders successfully read from submodule
   - Test that all agreements pages generate correctly
   - Test that all policies pages generate correctly (including nested dirs)
   - Test that all proposals pages generate correctly
   - Check that frontmatter parsed correctly on all pages
   - Verify route slugs match expected structure

4. Navigation testing:
   - Test all sidebar links work
   - Verify internal content links work correctly
   - Check breadcrumbs display properly
   - Test nested directory navigation
   - Ensure visual hierarchy correct (main sections vs root pages)
   - Verify all pages accessible from navigation

5. Root pages testing:
   - Verify governance.md loads from submodule
   - Verify code-of-conduct.md loads from submodule
   - Verify contributing.md loads from submodule
   - Check that content updates when submodule updates

6. Submodule workflow testing:
   - Check git submodule status
   - Test: git submodule update --remote
   - Make a small change in local governance repo copy
   - Verify change flows through to site
   - Document workflow in README if not already done
   - Test full workflow: submodule update → build → deploy

7. Index page testing:
   - Verify agreements/index shows dynamic list of agreements
   - Verify policies/index shows dynamic list of policies
   - Verify proposals/index shows dynamic list of proposals
   - Check that document metadata displays correctly
   - Test links from index to full documents

8. Content display testing:
   - Run npm run dev and manually test site
   - Check all governance docs render properly
   - Verify markdown formatting works
   - Test code blocks, lists, tables, links
   - Check images display (if any)
   - Verify frontmatter-driven content (status, dates) displays

9. Responsive testing:
   - Test on mobile (small screen)
   - Test on tablet (medium screen)
   - Test on desktop (large screen)
   - Verify navigation works on all devices
   - Check touch targets on mobile

10. Quality assurance:
    - Check for console errors (browser dev tools)
    - Verify no 404s or broken links
    - Test search functionality (if enabled)
    - Check page load performance
    - Verify SEO metadata on all pages
    - Test accessibility basics (keyboard navigation, screen reader labels)

11. Final checks:
    - Verify all three collections working correctly
    - Confirm nested directories handled properly
    - Ensure loaders generate all expected routes
    - Check that build output is deployable
    - Confirm assets load properly
    - Review overall site quality

12. Documentation:
    - Verify README has submodule instructions
    - Check that loader architecture is documented
    - Ensure contribution guidelines mention frontmatter requirements
    - Add any missing documentation

BRANCH: feature/integration-testing

CRITICAL TESTING AREAS (Submodule + Loader Architecture):
- [ ] Submodule initialized and accessible
- [ ] Loaders read from submodule successfully
- [ ] All collections generate pages correctly
- [ ] Nested directory routes work
- [ ] Frontmatter validation working
- [ ] Submodule update workflow tested
- [ ] Index pages integrate with loader content
- [ ] Root pages load from submodule

Please:
1. Verify all dependencies are met (check if all workstreams merged)
2. Create the feature branch
3. Complete the scope above systematically
4. Run comprehensive tests (build, dev, manual testing)
5. Document any issues found
6. Commit with clear messages
7. Push to origin
8. Provide detailed PR description with test results and checklist

Start now!
```

---

## Tips for Using These Prompts

### Before Starting a Workstream
- ✅ Check that dependencies are met (is the prior workstream complete?)
- ✅ Verify you're starting in a fresh Claude Code chat session
- ✅ Understand the submodule + loader architecture

### During the Workstream
- Keep the chat focused on the workstream scope
- Don't work on other workstreams in the same chat
- Commit frequently with clear messages
- Push to the feature branch regularly
- Test your changes with npm run dev

### After Completing a Workstream
- Create a PR from your feature branch
- Explain what was implemented and how to test it
- Note any dependencies for subsequent workstreams

### Coordination
- Document changes in PR descriptions
- Reference related PRs or workstreams
- Main branch is the integration point
- For submodule updates, coordinate with governance repo maintainers

### Architecture Notes
- **Never edit submodule content directly in site repo**
- Content changes happen in governance repo only
- Use `git submodule update --remote` to pull latest content
- Loaders dynamically generate pages from submodule
- Index pages are templates that integrate with loader content

### Troubleshooting
- If submodule not initialized: `git submodule init && git submodule update`
- If dependencies aren't met, wait for prior workstream to complete
- If there's confusion about scope, refer back to governance-content-plan.md
- If loaders aren't working, check that submodule has content

---

## Quick Reference: Workstream Dependencies

| Workstream | Branch | Dependencies |
|------------|--------|--------------|
| WS1: Foundation & Submodule | `feature/foundation-structure` | None |
| WS2a: Content Loaders | `feature/content-loaders` | WS1 |
| WS2b: Content Organization | `feature/content-organization` | WS2a |
| WS3: Configuration & Navigation | `feature/navigation-config` | WS1 (refine after WS2a/b) |
| WS4: Design & Polish | `feature/design-polish` | WS1 |
| WS5: Integration & Testing | `feature/integration-testing` | All others |

---

## Execution Workflow

1. **Start WS1**: No dependencies, begin immediately
2. **Wait for WS1**: Let WS1 complete and merge to main
3. **Start WS2a, WS3, WS4**: Open 3 chats in parallel (WS1 complete)
4. **Wait for WS2a**: Let WS2a complete and merge
5. **Start WS2b**: Open new chat (WS2a complete)
6. **Wait for All**: Let WS2b, WS3, WS4 complete and merge
7. **Start WS5**: Open final chat, integrate everything

Peak parallelization: 3 workstreams (WS2a, WS3, WS4) after WS1.

---

## Architecture Reminder

This plan implements **Submodule + Loader Architecture**

**Key Principles**:
- Content lives in governance repo (single source of truth)
- Integrated as git submodule at `src/content/governance/`
- Custom loaders read from submodule and generate pages dynamically
- Index pages are pre-made templates that integrate with loader content
- No content duplication between repos
- Governance repo updates flow through automatically

**Benefits**:
- Single source of truth maintained
- Content and presentation cleanly separated
- Type-safe content with schema validation
- Automatic updates when governance repo changes
- Clear contribution workflow (content → governance repo, site → site repo)
