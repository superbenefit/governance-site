# Parallelization Prompts for Governance Site Workstreams

**Purpose**: Copy-paste prompts for launching parallel Claude Code chat sessions
**Updated**: 2025-11-05

## How to Use This Document

1. Open a new Claude Code chat session (new browser tab)
2. Copy the entire prompt for the workstream you want to work on
3. Paste into the new chat session
4. Claude will create the branch, check dependencies, and begin work

## Important Notes

- Each prompt includes context about the project and dependencies
- Check GitHub issues before starting to see if dependencies are met
- Update issue numbers after creating them (replace #TBD)
- Each chat operates independently on its own branch

---

## WS1: Foundation & Structure

**Issue**: #TBD (update after creating issue)
**Start Immediately**: ✅ No dependencies

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on FOUNDATION & STRUCTURE (WS1).

CONTEXT:
- This is an Astro + Starlight documentation site
- We're implementing governance docs organized into: Agreements, Policies, Proposals
- Content source: https://github.com/superbenefit/governance
- See governance-content-plan.md and CLAUDE.md for full context

MY WORKSTREAM SCOPE:
1. Rename existing starter content files to .template extensions (keep as reference)
   - src/content/docs/index.mdx → index.mdx.template
   - src/content/docs/guides/example.md → example.md.template
   - src/content/docs/reference/example.md → example.md.template

2. Create core directory structure in src/content/docs/:
   - agreements/ (with placeholder index.md)
   - policies/ (with placeholder index.md)
   - proposals/ (with placeholder index.md)

3. Create new landing page (src/content/docs/index.mdx):
   - Use splash template
   - Introduce SuperBenefit DAO governance
   - Hero section with tagline about governance framework
   - Link to the three main sections (Agreements, Policies, Proposals)

BRANCH: feature/foundation-structure
ISSUE: #TBD

Please:
1. Create the feature branch
2. Complete the scope above
3. Commit with clear messages
4. Push to origin
5. Let me know when ready for PR

Start now!
```

---

## WS2: Content Migration & Organization

**Issue**: #TBD (update after creating issue)
**Depends On**: WS1 should complete first (check that PR is merged)

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on CONTENT MIGRATION & ORGANIZATION (WS2).

CONTEXT:
- This is an Astro + Starlight documentation site
- Governance content source: https://github.com/superbenefit/governance
- Target structure is: Agreements, Policies, Proposals
- See governance-content-plan.md and CLAUDE.md for full context

DEPENDENCY CHECK:
- WS1 (Foundation & Structure) should be complete and merged to main
- Verify that src/content/docs/ has agreements/, policies/, proposals/ directories
- If not complete, wait or coordinate before proceeding

MY WORKSTREAM SCOPE:
1. Pull/fetch content from superbenefit/governance repository

2. Organize content into appropriate sections:
   - Agreements → src/content/docs/agreements/
   - Policies → src/content/docs/policies/
   - Proposals → src/content/docs/proposals/

3. Ensure every .md file has proper frontmatter:
   - title: (descriptive)
   - description: (SEO-friendly summary)

4. Create section index pages:
   - src/content/docs/agreements/index.md (overview of agreements)
   - src/content/docs/policies/index.md (overview of policies)
   - src/content/docs/proposals/index.md (overview of proposals)

5. Verify all internal links work properly

BRANCH: feature/content-migration
ISSUE: #TBD

Please:
1. Pull latest from main first (to get WS1 changes)
2. Create the feature branch
3. Complete the scope above
4. Commit with clear messages
5. Push to origin
6. Let me know when ready for PR

Start now!
```

---

## WS3: Configuration & Navigation

**Issue**: #TBD (update after creating issue)
**Start Anytime**: ✅ Can start immediately (may need refinement after WS1/WS2)

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on CONFIGURATION & NAVIGATION (WS3).

CONTEXT:
- This is an Astro + Starlight documentation site
- We're setting up governance docs: Agreements, Policies, Proposals
- See governance-content-plan.md and CLAUDE.md for full context

MY WORKSTREAM SCOPE:
1. Update astro.config.mjs:
   - Change title from "My Docs" to "SuperBenefit Governance"
   - Update social links to point to superbenefit/governance-site repo
   - Configure sidebar navigation for three main sections:
     * Agreements (autogenerate from directory)
     * Policies (autogenerate from directory)
     * Proposals (autogenerate from directory)

2. Set up proper metadata:
   - Ensure site description reflects governance purpose
   - Add appropriate head tags if needed

3. Configure Starlight features:
   - Enable search if not already enabled
   - Configure any helpful built-in features (table of contents, etc.)
   - Set up appropriate default page layout settings

4. Test that navigation structure makes sense
   - Verify sidebar organization is logical
   - Ensure section labels are clear

BRANCH: feature/navigation-config
ISSUE: #TBD

NOTES:
- You may need to refine this after WS1/WS2 complete
- Focus on getting the structure right; we can iterate
- Check if WS1 is merged for accurate directory structure

Please:
1. Create the feature branch
2. Complete the scope above
3. Commit with clear messages
4. Push to origin
5. Let me know when ready for PR

Start now!
```

---

## WS4: Design & Polish

**Issue**: #TBD (update after creating issue)
**Depends On**: WS1 should complete first for basic structure

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on DESIGN & POLISH (WS4).

CONTEXT:
- This is an Astro + Starlight documentation site
- SuperBenefit DAO governance documentation
- See governance-content-plan.md and CLAUDE.md for full context

DEPENDENCY CHECK:
- WS1 (Foundation & Structure) should be complete for basic structure
- If not complete, focus on planning and setup work first

MY WORKSTREAM SCOPE:
1. Customize Starlight theme for SuperBenefit branding:
   - Review if custom colors/fonts are needed
   - Consider SuperBenefit visual identity
   - Implement theme customizations via Starlight config

2. Add custom components if needed:
   - Evaluate if any governance-specific components would be helpful
   - Examples: governance status badges, proposal timelines, etc.
   - Create in src/components/ if needed

3. Optimize images and assets:
   - Replace default Starlight assets (like Houston mascot)
   - Add SuperBenefit logo/branding images
   - Ensure images are optimized (Sharp will handle this)
   - Store in src/assets/

4. Improve visual hierarchy:
   - Ensure headings, lists, and content have good readability
   - Add any custom CSS for governance-specific styling
   - Test responsive design

5. Consider custom landing page enhancements:
   - Hero image or visual elements
   - Card layouts for navigation
   - Call-to-action elements

BRANCH: feature/design-polish
ISSUE: #TBD

Please:
1. Pull latest from main first
2. Create the feature branch
3. Complete the scope above
4. Commit with clear messages
5. Push to origin
6. Let me know when ready for PR

Start now!
```

---

## WS5: Integration & Testing

**Issue**: #TBD (update after creating issue)
**Depends On**: WS1-4 should all be complete or near completion

```
I'm working on the SuperBenefit DAO Governance Site (superbenefit/governance-site).

This is a parallel workstream focusing on INTEGRATION & TESTING (WS5).

CONTEXT:
- This is an Astro + Starlight documentation site
- Final integration workstream bringing all parallel work together
- See governance-content-plan.md and CLAUDE.md for full context

DEPENDENCY CHECK:
Before starting, verify that these PRs are merged or ready:
- [ ] WS1: Foundation & Structure
- [ ] WS2: Content Migration & Organization
- [ ] WS3: Configuration & Navigation
- [ ] WS4: Design & Polish

If any are incomplete, coordinate before proceeding.

MY WORKSTREAM SCOPE:
1. Integration:
   - Pull latest from main (should include all merged workstreams)
   - If any workstreams aren't merged yet, merge feature branches locally
   - Resolve any merge conflicts
   - Ensure all changes work together harmoniously

2. Build verification:
   - Run npm run build
   - Fix any build errors or warnings
   - Verify dist/ output looks correct

3. Navigation testing:
   - Test all sidebar links
   - Verify internal content links work
   - Check that all pages are accessible
   - Ensure breadcrumbs work correctly

4. Content display testing:
   - Verify all governance docs render properly
   - Check frontmatter displays correctly
   - Test on different screen sizes (responsive)
   - Verify search works if enabled

5. Quality assurance:
   - Run npm run dev and manually test site
   - Check for any console errors
   - Verify all three sections (Agreements, Policies, Proposals) work
   - Test any custom components from WS4

6. Final checks:
   - Verify build output is deployable
   - Check that assets load properly
   - Ensure no broken links
   - Confirm site is production-ready

BRANCH: feature/integration-testing
ISSUE: #TBD

Please:
1. Verify all dependencies are met
2. Create the feature branch
3. Complete the scope above
4. Run comprehensive tests
5. Commit with clear messages
6. Push to origin
7. Provide detailed PR description with test results

Start now!
```

---

## Tips for Using These Prompts

### Before Starting a Workstream
- ✅ Check that dependencies are met (read the "Depends On" section)
- ✅ Create the GitHub issue first and update #TBD in the prompt
- ✅ Verify you're starting in a fresh Claude Code chat session

### During the Workstream
- Keep the chat focused on the workstream scope
- Don't work on other workstreams in the same chat
- Commit frequently with clear messages
- Push to the feature branch regularly

### After Completing a Workstream
- Create a PR from your feature branch
- Reference the issue number in the PR description
- Tag any related PRs or dependencies
- Close the issue when PR is merged

### Coordination
- Use GitHub issue comments to communicate with other workstreams
- If you discover something that affects another workstream, note it in your PR
- Main branch is the integration point - keep it clean

### Troubleshooting
- If dependencies aren't met, check PR status on GitHub
- If there's confusion about scope, refer back to governance-content-plan.md
- If workstreams overlap, coordinate via issue comments

---

## Quick Reference: Workstream Status

Update this section as you create issues:

| Workstream | Issue | Branch | Status |
|------------|-------|--------|--------|
| WS1: Foundation & Structure | #TBD | `feature/foundation-structure` | Not started |
| WS2: Content Migration | #TBD | `feature/content-migration` | Not started |
| WS3: Configuration & Navigation | #TBD | `feature/navigation-config` | Not started |
| WS4: Design & Polish | #TBD | `feature/design-polish` | Not started |
| WS5: Integration & Testing | #TBD | `feature/integration-testing` | Not started |

---

## Example Workflow

1. **Create GitHub Issues**: Use governance-content-plan.md to create 5 issues
2. **Update This Document**: Replace #TBD with actual issue numbers
3. **Start WS1 & WS3**: Open 2 new Claude Code chats, paste prompts (no dependencies)
4. **Wait for WS1**: Let WS1 complete and merge
5. **Start WS2 & WS4**: Open 2 new chats, paste prompts (WS1 dependency met)
6. **Wait for All**: Let WS2-4 complete and merge
7. **Start WS5**: Open final chat, paste prompt, integrate everything

This gives you up to 4 parallel workstreams running simultaneously!
