# Pre-Launch Checklist

Use this checklist before starting the parallel workstreams.

## Understanding Phase

- [ ] Read `REVISION-SUMMARY.md` completely
- [ ] Understand why Option A (submodule + loaders) was chosen
- [ ] Review `governance-content-plan.md` for full workstream overview
- [ ] Review `content-structure.md` for architecture details
- [ ] Understand the dependency chain: WS1 → WS2a → WS2b → WS5 (with WS3/WS4 parallel)

## Repository Setup

- [ ] Verify local repository is at: `F:\projects\sb-governance-starlight`
- [ ] Check that `.gitmodules` exists with governance submodule config
- [ ] Initialize submodule: `git submodule init`
- [ ] Update submodule: `git submodule update`
- [ ] Verify submodule content: Check `src/content/governance/` has files
- [ ] Confirm starter templates already renamed to `.template`

## Research & Preparation

- [ ] Review Astro content loader documentation: https://docs.astro.build/en/guides/content-loaders/
- [ ] Review Starlight documentation: https://starlight.astro.build/
- [ ] Look at Starlight's docsLoader for reference
- [ ] Understand how Astro content collections work
- [ ] Review git submodule workflow if unfamiliar

## Launch WS1

- [ ] Verify all above checkboxes complete
- [ ] Open new Claude Code chat session (https://claude.ai/code)
- [ ] Copy **entire** WS1 prompt from `temp/parallelization-prompts.md`
- [ ] Paste into chat session
- [ ] Let Claude execute the workstream
- [ ] Monitor progress and answer questions if needed
- [ ] Review PR when WS1 completes
- [ ] Merge WS1 PR to main

## After WS1 Complete

- [ ] Verify submodule is initialized and working
- [ ] Check that landing page exists
- [ ] Verify directory structure is correct

## Launch Parallel Workstreams (After WS1)

### WS2a - Content Loaders (Critical Path)
- [ ] Verify WS1 merged to main
- [ ] Open new Claude Code chat session
- [ ] Copy WS2a prompt from `temp/parallelization-prompts.md`
- [ ] Paste and launch

### WS3 - Configuration & Navigation
- [ ] Verify WS1 merged to main
- [ ] Open new Claude Code chat session  
- [ ] Copy WS3 prompt from `temp/parallelization-prompts.md`
- [ ] Paste and launch

### WS4 - Design & Polish
- [ ] Verify WS1 merged to main
- [ ] Open new Claude Code chat session
- [ ] Copy WS4 prompt from `temp/parallelization-prompts.md`
- [ ] Paste and launch

**At this point you have 3 workstreams running in parallel!**

## After WS2a Complete

- [ ] Verify loaders are implemented
- [ ] Check that collections are defined
- [ ] Test that loader-generated routes work

## Launch WS2b (After WS2a)

- [ ] Verify WS2a merged to main
- [ ] Open new Claude Code chat session
- [ ] Copy WS2b prompt from `temp/parallelization-prompts.md`
- [ ] Paste and launch

## After All Workstreams Complete

- [ ] Verify WS2a, WS2b, WS3, WS4 all merged to main
- [ ] Check that all PRs are reviewed and closed

## Launch WS5 - Integration & Testing

- [ ] Verify ALL workstreams (WS1-4) merged to main
- [ ] Open new Claude Code chat session
- [ ] Copy WS5 prompt from `temp/parallelization-prompts.md`
- [ ] Paste and launch
- [ ] Pay close attention to testing results
- [ ] Address any integration issues found

## Final Steps

- [ ] Review WS5 PR carefully
- [ ] Test the site yourself: `npm run dev`
- [ ] Verify build works: `npm run build`
- [ ] Check all loader-generated routes
- [ ] Test submodule update workflow
- [ ] Merge WS5 to main
- [ ] Celebrate! 🎉

## Tips for Success

**Do**:
- ✅ Read prompts completely before pasting
- ✅ Let each Claude Code session focus on its workstream
- ✅ Review PRs before merging
- ✅ Test locally when possible
- ✅ Document any deviations from plan

**Don't**:
- ❌ Skip dependency checks
- ❌ Mix workstreams in same chat session
- ❌ Edit submodule content directly in site repo
- ❌ Merge PRs without review
- ❌ Rush the integration testing (WS5)

## Troubleshooting

**Submodule not initialized?**
```bash
cd F:\projects\sb-governance-starlight
git submodule init
git submodule update
```

**Submodule empty?**
```bash
git submodule update --init --recursive
```

**Need latest governance content?**
```bash
git submodule update --remote
```

**Loader errors?**
- Check Astro documentation
- Look at Starlight's docsLoader example
- Verify submodule has content
- Check schema definitions

**Merge conflicts?**
- Coordinate via PR comments
- Understand what each workstream changed
- Test after resolving conflicts

## Execution Timeline

### Phase 1: Foundation
- Start: WS1 (1-2 hours)
- Review and merge WS1

### Phase 2: Parallel Development
- Start: WS2a, WS3, WS4 simultaneously (2-4 hours each)
- WS2a is critical path for WS2b
- Review and merge WS2a, WS3, WS4

### Phase 3: Content Organization
- Start: WS2b after WS2a complete (2-3 hours)
- Review and merge WS2b

### Phase 4: Integration
- Start: WS5 after all others complete (2-4 hours)
- Comprehensive testing and QA
- Review and merge WS5

**Total Estimated Time**: 10-20 hours of work
**Wall Clock Time**: 1-3 days (with parallelization)

---

**Ready?** Start with "Understanding Phase" and work through systematically!
