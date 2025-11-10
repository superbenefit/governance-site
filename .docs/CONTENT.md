# Content Management

This guide explains how governance content is organized and managed through the git submodule system.

## Content Source

The governance documentation content is maintained in a **separate repository**: [superbenefit/governance](https://github.com/superbenefit/governance)

This content is integrated into the site using a **git submodule** located at `src/content/governance/`. This approach maintains a single source of truth for governance content while enabling dynamic page generation through Astro content loaders.

## Content Structure

The governance submodule contains three main directories:

```
src/content/governance/
├── agreements/           # Relational foundations and core agreements
│   ├── index.md         # Agreements landing page content
│   └── dao/             # DAO-specific agreements
├── policies/            # Coordination mechanisms by domain
│   ├── index.md         # Policies landing page content
│   ├── metagovernance/  # Meta-governance policies
│   ├── operations/      # Operational policies
│   └── platforms/       # Platform-specific policies
└── proposals/           # (Not used - proposals come from Snapshot API)
    └── index.md         # Proposals landing page content
```

## First-Time Setup

When cloning this repository for the first time, you need to initialize the submodule.

### Option 1: Clone with Submodules

Clone the repository with submodules in one step:

```bash
git clone --recurse-submodules https://github.com/superbenefit/governance-site.git
```

### Option 2: Initialize After Cloning

If you've already cloned the repository:

```bash
cd governance-site
git submodule init
git submodule update
```

## Updating Governance Content

To pull the latest governance content from the governance repository:

```bash
git submodule update --remote src/content/governance
```

This updates the submodule to the latest commit from the governance repository's main branch.

After updating, you'll need to commit the new submodule reference:

```bash
git add src/content/governance
git commit -m "Update governance submodule to latest

Co-authored-by: rathermercurial <rathermercurial@protonmail.com>"
```

## Important Rules

### Do NOT Edit Submodule Files Directly

**Never edit files in `src/content/governance/` directly** in this repository. This directory contains the submodule, and changes here won't be tracked properly.

### Where to Make Changes

- **Governance content** (agreements, policies, etc.) → Make changes in the [governance repository](https://github.com/superbenefit/governance)
- **Site functionality** (pages, components, styles) → Make changes in this repository

## Checking Submodule Status

To see the current state of the submodule:

```bash
git submodule status
```

This shows:
- The current commit hash the submodule is pointing to
- Whether the submodule has uncommitted changes
- The submodule path

Example output:
```
 a1b2c3d4 src/content/governance (heads/main)
```

To see if the submodule is behind the remote:

```bash
cd src/content/governance
git fetch
git status
```

## Content Schema

All governance content must include frontmatter with required fields:

### Required Fields

```yaml
---
description: A brief description of this document
---
```

### Optional Fields

```yaml
---
title: Document Title  # If omitted, extracted from first H1 heading
description: A brief description of this document
status: active  # Can be: draft, active, deprecated
lastUpdated: 2024-01-15
tags:
  - governance
  - policy
relatedDocs:
  - /policies/related-policy
---
```

## How Content Becomes Pages

The site automatically generates pages from governance content:

1. **Content Collections** - Astro scans `src/content/governance/` and creates typed collections
2. **Schema Validation** - Each file is validated against the governance schema
3. **Dynamic Routes** - Pages are generated at build time via `[...slug].astro` files
4. **Navigation** - The custom sidebar automatically reflects the content structure

### URL Mapping

Files in the submodule map to URLs:

| File Path | URL |
|-----------|-----|
| `agreements/dao/operating-agreement.md` | `/agreements/dao/operating-agreement/` |
| `policies/operations/authority-delegation.md` | `/policies/operations/authority-delegation/` |

### Index Pages

Each collection has an index page that combines:
- Static content from `index.md` in the governance repository
- Dynamically generated list of all documents in that collection

For example, `/agreements/` displays content from `src/content/governance/agreements/index.md` plus cards for all agreements.

## Troubleshooting

### Submodule Appears Empty

If `src/content/governance/` is empty after cloning:

```bash
git submodule update --init --recursive
```

### Submodule Shows Uncommitted Changes

This usually means you accidentally edited files in the submodule. To reset:

```bash
cd src/content/governance
git reset --hard
git clean -fd
cd ../..
```

### Can't Pull Latest Submodule Content

If `git submodule update --remote` fails:

```bash
cd src/content/governance
git fetch origin
git checkout main
git pull origin main
cd ../..
git add src/content/governance
```

### Build Fails After Submodule Update

Check that all governance content has valid frontmatter:

```bash
npm run astro check
```

Look for schema validation errors and fix them in the governance repository.

### Merge Conflicts with Submodule

If you see a merge conflict in `.gitmodules` or `src/content/governance`:

```bash
# Accept incoming changes
git checkout --theirs src/content/governance
git add src/content/governance

# Or accept your changes
git checkout --ours src/content/governance
git add src/content/governance

# Then complete the merge
git commit
```

## Working with Both Repositories

If you're actively developing both the site and governance content:

1. Keep both repositories cloned separately
2. Make governance changes in the standalone governance repo
3. Push those changes to the governance repository
4. Update the submodule in the site repository
5. Test locally with `npm run dev`
6. Commit the submodule reference update

This workflow ensures governance content changes go through proper review in the governance repository.

## Advanced: Changing Submodule Branch

By default, the submodule tracks the `main` branch. To track a different branch:

```bash
cd src/content/governance
git checkout feature-branch
cd ../..
git add src/content/governance
git commit -m "Track feature-branch in governance submodule"
```

To switch back:

```bash
cd src/content/governance
git checkout main
cd ../..
git add src/content/governance
git commit -m "Switch governance submodule back to main"
```

## Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md#content-loader-architecture) - How content loading works
- [DEVELOPMENT.md](./DEVELOPMENT.md#project-structure) - Project structure overview
- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Governance Repository](https://github.com/superbenefit/governance)
