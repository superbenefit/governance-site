# Governance Content Loading Implementation Plan

## Overview

This plan details the implementation of governance content loading for the Starlight documentation site. The governance content exists as a Git submodule at `src/content/governance/` and needs to be integrated into the site with custom index pages and proper navigation.

## Implementation Approach

- **Strategy**: Mixed Collections (Middle Ground)
- **URL Structure**: Governance content at site root (e.g., `/agreements/`, `/policies/`, not `/governance/agreements/`)
- **Index Pages**: Custom .astro pages that load index.md content AND dynamically list all items
- **Navigation**: Visual separator with spacing to de-emphasize root pages

## Current State

### What Exists
- ✅ Git submodule at `src/content/governance/` with 40 markdown files
- ✅ Three main directories: agreements, policies, proposals
- ✅ Index pages for each directory (agreements/index.md, policies/index.md, proposals/index.md)
- ✅ Root pages: GOVERNANCE.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md
- ✅ Main index: governance/index.md

### What's Missing
- ❌ Content collection configuration for governance
- ❌ Custom index pages with dynamic content slots
- ❌ Dynamic routes for individual pages
- ❌ Navigation configuration
- ❌ Root page routing

## Governance Content Structure

```
src/content/governance/
├── index.md (main governance landing page)
├── GOVERNANCE.md (repository maintenance framework)
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── agreements/
│   ├── index.md
│   ├── community/ (2 files)
│   └── dao/ (3 files)
├── policies/
│   ├── index.md
│   ├── metagovernance/ (7 files + state/ subdir with 3 files)
│   ├── operations/ (4 files)
│   └── platforms/ (5 files + hats/ subdir with 2 files)
└── proposals/
    ├── index.md
    └── readme.md
```

**Total**: 40 markdown files with hierarchical structure up to 4 levels deep.

## Implementation Phases

### Phase 1: Content Collections Configuration

**File**: `src/content.config.ts`

**Goal**: Add three new content collections for governance content.

**Changes**:
```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema()
  }),

  // Governance collections
  agreements: defineCollection({
    loader: glob({
      pattern: ['**/*.md', '!**/readme.md'],
      base: './src/content/governance/agreements'
    }),
    schema: docsSchema()
  }),

  policies: defineCollection({
    loader: glob({
      pattern: ['**/*.md', '!**/readme.md'],
      base: './src/content/governance/policies'
    }),
    schema: docsSchema()
  }),

  proposals: defineCollection({
    loader: glob({
      pattern: ['**/*.md', '!**/readme.md'],
      base: './src/content/governance/proposals'
    }),
    schema: docsSchema()
  }),
};
```

**Details**:
- Use `glob()` loader to load files from submodule
- Exclude `readme.md` files
- Use Starlight's `docsSchema()` for consistency
- Pattern `**/*.md` captures nested directories

**Validation**:
- Run `npm run dev` and check for collection loading errors
- Verify all markdown files are detected

---

### Phase 2: Custom Index Pages with Dynamic Content Slots

**Directory**: `src/pages/` (create if doesn't exist)

**Goal**: Create three custom index pages that combine static content from index.md with dynamic listings of all items.

#### 2.1 Agreements Index Page

**File**: `src/pages/agreements/index.astro`

```astro
---
import { getCollection, getEntry } from 'astro:content';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

// Load the index.md content
const indexEntry = await getEntry('agreements', 'index');

// Load all agreement items (excluding index and readme)
const agreements = (await getCollection('agreements'))
  .filter(entry => entry.id !== 'index.md' && !entry.id.includes('readme'))
  .sort((a, b) => a.id.localeCompare(b.id));

const { Content } = await indexEntry.render();
---

<StarlightPage
  frontmatter={{
    title: indexEntry.data.title || 'Agreements',
    description: indexEntry.data.description
  }}
>
  <!-- Slot 1: Static content from index.md -->
  <Content />

  <!-- Slot 2: Dynamic list of all agreements -->
  <h2>All Agreements</h2>
  <div class="agreements-grid">
    {agreements.map(agreement => (
      <div class="agreement-card">
        <a href={`/agreements/${agreement.id.replace('.md', '')}/`}>
          <h3>{agreement.data.title || agreement.id}</h3>
          {agreement.data.description && (
            <p>{agreement.data.description}</p>
          )}
        </a>
      </div>
    ))}
  </div>
</StarlightPage>
```

#### 2.2 Policies Index Page

**File**: `src/pages/policies/index.astro`

```astro
---
import { getCollection, getEntry } from 'astro:content';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

const indexEntry = await getEntry('policies', 'index');

// Group policies by domain (metagovernance, operations, platforms)
const allPolicies = (await getCollection('policies'))
  .filter(entry => entry.id !== 'index.md' && !entry.id.includes('readme'));

// Organize by top-level directory
const policyGroups = {
  metagovernance: allPolicies.filter(p => p.id.startsWith('metagovernance/')),
  operations: allPolicies.filter(p => p.id.startsWith('operations/')),
  platforms: allPolicies.filter(p => p.id.startsWith('platforms/')),
};

const { Content } = await indexEntry.render();
---

<StarlightPage
  frontmatter={{
    title: indexEntry.data.title || 'Policies',
    description: indexEntry.data.description
  }}
>
  <Content />

  <h2>Policy Domains</h2>

  {Object.entries(policyGroups).map(([domain, policies]) => (
    <div class="policy-domain">
      <h3>{domain.charAt(0).toUpperCase() + domain.slice(1)}</h3>
      <ul>
        {policies.map(policy => (
          <li>
            <a href={`/policies/${policy.id.replace('.md', '')}/`}>
              {policy.data.title || policy.id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ))}
</StarlightPage>
```

#### 2.3 Proposals Index Page

**File**: `src/pages/proposals/index.astro`

```astro
---
import { getCollection, getEntry } from 'astro:content';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

const indexEntry = await getEntry('proposals', 'index');

const proposals = (await getCollection('proposals'))
  .filter(entry => entry.id !== 'index.md' && !entry.id.includes('readme'))
  .sort((a, b) => b.id.localeCompare(a.id)); // Reverse chronological

const { Content } = await indexEntry.render();
---

<StarlightPage
  frontmatter={{
    title: indexEntry.data.title || 'Proposals',
    description: indexEntry.data.description
  }}
>
  <Content />

  <h2>Proposal Archive</h2>
  <ul class="proposals-list">
    {proposals.map(proposal => (
      <li>
        <a href={`/proposals/${proposal.id.replace('.md', '')}/`}>
          {proposal.data.title || proposal.id}
        </a>
        {proposal.data.description && (
          <p>{proposal.data.description}</p>
        )}
      </li>
    ))}
  </ul>
</StarlightPage>
```

**Validation**:
- Visit `/agreements/`, `/policies/`, `/proposals/`
- Verify index content renders
- Verify dynamic listings appear
- Check links work

---

### Phase 3: Dynamic Routes for Individual Content

**Goal**: Create dynamic route handlers for all governance content pages.

#### 3.1 Agreements Dynamic Route

**File**: `src/pages/agreements/[...slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

export async function getStaticPaths() {
  const agreements = await getCollection('agreements');

  return agreements
    .filter(entry => entry.id !== 'index.md' && !entry.id.includes('readme'))
    .map(entry => ({
      params: { slug: entry.id.replace('.md', '') },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<StarlightPage
  frontmatter={{
    title: entry.data.title,
    description: entry.data.description
  }}
>
  <Content />
</StarlightPage>
```

#### 3.2 Policies Dynamic Route

**File**: `src/pages/policies/[...slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

export async function getStaticPaths() {
  const policies = await getCollection('policies');

  return policies
    .filter(entry => entry.id !== 'index.md' && !entry.id.includes('readme'))
    .map(entry => ({
      params: { slug: entry.id.replace('.md', '') },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<StarlightPage
  frontmatter={{
    title: entry.data.title,
    description: entry.data.description
  }}
>
  <Content />
</StarlightPage>
```

#### 3.3 Proposals Dynamic Route

**File**: `src/pages/proposals/[slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

export async function getStaticPaths() {
  const proposals = await getCollection('proposals');

  return proposals
    .filter(entry => entry.id !== 'index.md' && !entry.id.includes('readme'))
    .map(entry => ({
      params: { slug: entry.id.replace('.md', '') },
      props: { entry },
    }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<StarlightPage
  frontmatter={{
    title: entry.data.title,
    description: entry.data.description
  }}
>
  <Content />
</StarlightPage>
```

**Note**: Use `[...slug]` for agreements and policies (nested structure), `[slug]` for proposals (flat structure).

**Validation**:
- Test nested routes like `/policies/metagovernance/voting-policy/`
- Test all agreement and proposal pages
- Verify content renders correctly
- Check internal links work

---

### Phase 4: Root Pages Routing

**Goal**: Create pages for root governance documents at site root.

#### 4.1 Main Governance Page

**File**: `src/pages/governance.astro`

```astro
---
import { readFile } from 'node:fs/promises';
import { compile } from '@astrojs/markdown-remark';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

// Load governance/index.md from submodule
const governanceContent = await readFile(
  './src/content/governance/index.md',
  'utf-8'
);

// Parse frontmatter and content
const frontmatterMatch = governanceContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const frontmatterText = frontmatterMatch ? frontmatterMatch[1] : '';
const markdown = frontmatterMatch ? frontmatterMatch[2] : governanceContent;

// Simple frontmatter parsing
const frontmatter: Record<string, any> = {};
frontmatterText.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split(':');
  if (key && valueParts.length) {
    frontmatter[key.trim()] = valueParts.join(':').trim();
  }
});

const { code } = await compile(markdown);
---

<StarlightPage
  frontmatter={{
    title: frontmatter.title || 'Governance',
    description: frontmatter.description
  }}
>
  <Fragment set:html={code} />
</StarlightPage>
```

#### 4.2 Code of Conduct Page

**File**: `src/pages/code-of-conduct.astro`

```astro
---
import { readFile } from 'node:fs/promises';
import { compile } from '@astrojs/markdown-remark';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

const content = await readFile(
  './src/content/governance/CODE_OF_CONDUCT.md',
  'utf-8'
);

// Parse frontmatter
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const markdown = frontmatterMatch ? frontmatterMatch[2] : content;
const frontmatterText = frontmatterMatch ? frontmatterMatch[1] : '';

const frontmatter: Record<string, any> = {};
frontmatterText.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split(':');
  if (key && valueParts.length) {
    frontmatter[key.trim()] = valueParts.join(':').trim();
  }
});

const { code } = await compile(markdown);
---

<StarlightPage
  frontmatter={{
    title: frontmatter.title || 'Code of Conduct',
    description: frontmatter.description
  }}
>
  <Fragment set:html={code} />
</StarlightPage>
```

#### 4.3 Contributing Page

**File**: `src/pages/contributing.astro`

```astro
---
import { readFile } from 'node:fs/promises';
import { compile } from '@astrojs/markdown-remark';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

const content = await readFile(
  './src/content/governance/CONTRIBUTING.md',
  'utf-8'
);

// Parse frontmatter
const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const markdown = frontmatterMatch ? frontmatterMatch[2] : content;
const frontmatterText = frontmatterMatch ? frontmatterMatch[1] : '';

const frontmatter: Record<string, any> = {};
frontmatterText.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split(':');
  if (key && valueParts.length) {
    frontmatter[key.trim()] = valueParts.join(':').trim();
  }
});

const { code } = await compile(markdown);
---

<StarlightPage
  frontmatter={{
    title: frontmatter.title || 'Contributing',
    description: frontmatter.description
  }}
>
  <Fragment set:html={code} />
</StarlightPage>
```

**Note**: These pages load markdown files directly from the submodule since they're not part of a collection.

**Validation**:
- Visit `/governance/`, `/code-of-conduct/`, `/contributing/`
- Verify content renders correctly
- Check styling matches Starlight theme

---

### Phase 5: Navigation Configuration

**File**: `astro.config.mjs`

**Goal**: Configure sidebar navigation with visual hierarchy - folders at top, visual separator, root pages de-emphasized at bottom.

**Changes**:
```javascript
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Governance',
      social: {
        github: 'https://github.com/superbenefit/governance-site',
      },
      sidebar: [
        // TOP SECTION: Governance content folders (emphasized)
        {
          label: 'Agreements',
          link: '/agreements/',
          items: [
            {
              label: 'Community',
              autogenerate: { directory: 'governance/agreements/community' },
            },
            {
              label: 'DAO',
              autogenerate: { directory: 'governance/agreements/dao' },
            },
          ],
        },
        {
          label: 'Policies',
          link: '/policies/',
          items: [
            {
              label: 'Metagovernance',
              autogenerate: { directory: 'governance/policies/metagovernance' },
            },
            {
              label: 'Operations',
              autogenerate: { directory: 'governance/policies/operations' },
            },
            {
              label: 'Platforms',
              autogenerate: { directory: 'governance/policies/platforms' },
            },
          ],
        },
        {
          label: 'Proposals',
          link: '/proposals/',
        },

        // VISUAL SEPARATOR
        {
          label: '',
          items: [],
          // This creates spacing/separation
        },

        // BOTTOM SECTION: Root pages (de-emphasized)
        {
          label: 'About',
          items: [
            { label: 'Governance', link: '/governance/' },
            { label: 'Code of Conduct', link: '/code-of-conduct/' },
            { label: 'Contributing', link: '/contributing/' },
          ],
        },
      ],

      // Optional: Customize component overrides for styling
      components: {
        // Could override Sidebar component for custom styling
      },
    }),
  ],
});
```

**Alternative Navigation Structure** (if autogenerate doesn't work for custom collections):

```javascript
sidebar: [
  {
    label: 'Agreements',
    link: '/agreements/',
    items: [
      { label: 'Community Agreements', link: '/agreements/community/' },
      { label: 'DAO Operating Agreement', link: '/agreements/dao/operating-agreement/' },
    ],
  },
  // ... manually list items
]
```

**Validation**:
- Check sidebar displays folders first
- Verify visual separation before "About" section
- Confirm root pages appear de-emphasized
- Test all navigation links

---

### Phase 6: Custom Styling (Optional)

**Goal**: Add custom CSS to further de-emphasize root pages if needed.

**File**: `src/styles/custom.css` (create if doesn't exist)

```css
/* De-emphasize root pages in navigation */
.sidebar-content a[href="/governance/"],
.sidebar-content a[href="/code-of-conduct/"],
.sidebar-content a[href="/contributing/"] {
  font-size: 0.9em;
  opacity: 0.8;
  font-weight: normal;
}

/* Add spacing before root pages section */
.sidebar-content .sidebar-group:last-child {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sl-color-gray-5);
}

/* Style governance content cards */
.agreements-grid,
.policy-domain {
  margin: 2rem 0;
}

.agreement-card {
  padding: 1rem;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.agreement-card h3 {
  margin-top: 0;
}
```

**Import in astro.config.mjs**:
```javascript
starlight({
  customCss: ['./src/styles/custom.css'],
  // ... rest of config
})
```

---

### Phase 7: Testing & Validation

**Checklist**:

#### Content Loading
- [ ] Run `npm run dev` without errors
- [ ] All three collections load successfully
- [ ] No missing files or broken references

#### Routing
- [ ] `/agreements/` loads with content and listings
- [ ] `/policies/` loads with grouped content
- [ ] `/proposals/` loads with archive
- [ ] `/governance/` loads main governance page
- [ ] `/code-of-conduct/` loads code of conduct
- [ ] `/contributing/` loads contributing guide

#### Dynamic Routes
- [ ] Individual agreements load (e.g., `/agreements/dao/operating-agreement/`)
- [ ] Nested policies load (e.g., `/policies/metagovernance/voting-policy/`)
- [ ] Deep nested policies work (e.g., `/policies/metagovernance/state/...`)
- [ ] Proposals load (e.g., `/proposals/[proposal-name]/`)

#### Navigation
- [ ] Sidebar displays folders first
- [ ] Visual separator exists between folders and root pages
- [ ] Root pages appear de-emphasized
- [ ] All navigation links work
- [ ] Active page is highlighted correctly

#### Content Rendering
- [ ] Markdown renders correctly
- [ ] Frontmatter metadata is respected
- [ ] Images load (if any)
- [ ] Internal links work
- [ ] Code blocks render with syntax highlighting

#### Search & Accessibility
- [ ] Search includes governance content
- [ ] All pages have proper titles and descriptions
- [ ] Navigation is keyboard accessible
- [ ] Links have proper aria labels

#### Build
- [ ] `npm run build` succeeds without errors
- [ ] Preview (`npm run preview`) works correctly
- [ ] All routes are pre-rendered

---

## Potential Issues & Solutions

### Issue 1: Submodule Content Not Loading

**Symptom**: Collections can't find files in `src/content/governance/`

**Solution**:
- Ensure submodule is initialized: `git submodule update --init --recursive`
- Check that files actually exist in the directory
- Verify glob pattern in content.config.ts matches file structure

### Issue 2: Routes Conflict with Starlight Defaults

**Symptom**: Custom routes don't work, Starlight's default routing takes over

**Solution**:
- Ensure custom routes in `src/pages/` take precedence
- Check that Starlight isn't configured to serve these routes via docs collection
- May need to exclude governance from docs collection

### Issue 3: Navigation Doesn't Show Governance Content

**Symptom**: Sidebar doesn't display governance items

**Solution**:
- Starlight's `autogenerate` may not work with custom collections
- Manually list navigation items in astro.config.mjs
- Or create a custom sidebar component

### Issue 4: Styling Doesn't Match Starlight Theme

**Symptom**: Custom index pages look different from standard Starlight pages

**Solution**:
- Use `<StarlightPage>` component wrapper
- Import and use Starlight's CSS custom properties
- Leverage Starlight's built-in components (Card, CardGrid, etc.)

### Issue 5: Search Doesn't Include Governance Content

**Symptom**: Built-in search can't find governance pages

**Solution**:
- Starlight's search may only index `docs` collection by default
- May need to configure Pagefind (Starlight's search) to index custom routes
- Or add governance content to docs collection instead of separate collections

---

## Alternative Approaches Considered

### Approach A: Starlight-Native (Simpler but less flexible)
- Move governance into `src/content/docs/governance/`
- Let Starlight handle everything automatically
- **Pros**: Less code, all features work out of box
- **Cons**: Can't customize index pages with dynamic slots, harder to separate governance from other docs

### Approach C: Full Custom (More complex but maximum control)
- Build entirely custom pages without StarlightPage wrapper
- Create own navigation system
- **Pros**: Complete control over design and layout
- **Cons**: Much more code, lose Starlight features, more maintenance

**Why Mixed Collections was chosen**: Balances customization (custom index pages with dynamic slots) with leveraging Starlight's features (styling, components, search).

---

## Next Steps After Implementation

1. **Content**: Add actual governance content to proposals if empty
2. **Enhancements**: Add search filters for governance content
3. **Features**: Add "last updated" dates to content pages
4. **Integration**: Set up CI/CD to update submodule automatically
5. **Documentation**: Document how to add new governance content
6. **Analytics**: Track which governance pages are most visited

---

## Resources

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Dynamic Routing](https://docs.astro.build/en/guides/routing/#dynamic-routes)
- [Starlight Custom Components](https://starlight.astro.build/guides/components/)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-04
**Status**: Ready for Implementation
