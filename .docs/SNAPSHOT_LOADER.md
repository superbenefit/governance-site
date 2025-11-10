# Snapshot Proposal Loader

This directory contains custom content loaders for fetching external data into Astro content collections.

## Snapshot Loader

The `snapshot-loader.ts` file implements a custom Astro content loader that fetches governance proposals from the Snapshot API and integrates them into the site's content collections.

### Architecture

```
┌─────────────────────┐
│  Snapshot API       │
│  (hub.snapshot.org) │
└──────────┬──────────┘
           │ GraphQL Query
           │ (at build time)
           ▼
┌─────────────────────┐
│  Snapshot Loader    │
│  - Fetch proposals  │
│  - Calculate results│
│  - Sanitize content │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Content Collection │
│  (proposals)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Dynamic Routes     │
│  /proposals/[slug]  │
└─────────────────────┘
```

### Features

1. **GraphQL API Integration**: Fetches proposals from Snapshot's GraphQL API
2. **Voting Result Calculation**: Determines if proposals passed using a 50% threshold
3. **Content Sanitization**: Removes potentially dangerous HTML/JavaScript from proposal bodies
4. **Type Safety**: Full TypeScript support with Zod schema validation
5. **Mock Data Support**: Fallback mode for development without network access
6. **Error Handling**: Graceful degradation on network failures

### Configuration

The loader is configured in `src/content.config.ts`:

```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',      // Snapshot space to fetch from
    limit: 1,                        // Number of proposals to fetch
    includeFailedProposals: false,   // Whether to include proposals that didn't pass
    useMockData: false,              // Use mock data instead of API (for development)
  }),
  schema: snapshotProposalSchema,
})
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `space` | string | `'superbenefit.eth'` | Snapshot space ID to fetch proposals from |
| `limit` | number | `1` | Maximum number of proposals to fetch |
| `includeFailedProposals` | boolean | `false` | Whether to include proposals that didn't pass the 50% threshold |
| `useMockData` | boolean | `false` | Use mock data instead of fetching from API (useful for offline development) |

### How It Works

#### 1. Fetching Proposals

At build time, the loader queries the Snapshot GraphQL API:

```graphql
query GetProposals($space: String!, $first: Int!) {
  proposals(
    first: $first
    where: { space: $space, state: "closed" }
    orderBy: "created"
    orderDirection: desc
  ) {
    id, title, body, choices, scores, scores_total, votes
    start, end, state, author, created, snapshot
    space { id, name }
  }
}
```

#### 2. Determining Pass/Fail

The loader calculates if a proposal passed by:
1. Finding the choice with the highest score
2. Calculating the percentage: `(highest_score / scores_total) * 100`
3. Checking if percentage > 50%

This logic is in the `didProposalPass()` function and can be customized.

#### 3. Content Sanitization

Proposal bodies from Snapshot may contain HTML/Markdown. The `sanitizeContent()` function:
- Removes `<script>`, `<iframe>`, `<object>`, `<embed>` tags
- Removes inline event handlers (onclick, onerror, etc.)
- Preserves safe HTML and Markdown formatting

#### 4. Data Transformation

Each proposal is transformed into a content collection entry with:

**Standard Fields** (from governanceSchema):
- `title`: Proposal title
- `description`: Auto-generated description
- `status`: 'active' (passed) or 'deprecated' (failed)
- `lastUpdated`: Proposal end date
- `tags`: Auto-generated tags including 'snapshot', 'proposal', 'passed'/'failed'

**Snapshot-Specific Fields** (from snapshotProposalSchema):
- `snapshotId`: Unique Snapshot proposal ID
- `author`: Ethereum address of proposal creator
- `choices`: Array of voting choices
- `scores`: Array of vote scores (one per choice)
- `scores_total`: Total voting power used
- `votes`: Number of voters
- `startDate`: Voting start date
- `endDate`: Voting end date
- `snapshot`: Block number snapshot was taken at
- `winningChoice`: The choice that won
- `winningScore`: Score of winning choice
- `percentageVoted`: Percentage of total voting power for winning choice

### Usage Examples

#### Basic: Fetch 1 Most Recent Passed Proposal

```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',
    limit: 1,
  }),
  schema: snapshotProposalSchema,
})
```

#### Fetch Multiple Proposals

```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',
    limit: 20, // Fetch last 20 proposals
  }),
  schema: snapshotProposalSchema,
})
```

#### Include Failed Proposals

```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',
    limit: 10,
    includeFailedProposals: true, // Include all proposals regardless of outcome
  }),
  schema: snapshotProposalSchema,
})
```

#### Development Mode (Offline)

```typescript
proposals: defineCollection({
  loader: snapshotLoader({
    space: 'superbenefit.eth',
    limit: 1,
    useMockData: true, // Use mock data for faster builds without network
  }),
  schema: snapshotProposalSchema,
})
```

### Accessing Proposal Data in Pages

Proposals are available through Astro's content collection API:

```astro
---
import { getCollection, getEntry } from 'astro:content';

// Get all proposals
const proposals = await getCollection('proposals');

// Get a specific proposal by ID
const proposal = await getEntry('proposals', 'proposal-id');
---

{proposals.map(proposal => (
  <article>
    <h2>{proposal.data.title}</h2>
    <p>Author: {proposal.data.author}</p>
    <p>Result: {proposal.data.winningChoice} ({proposal.data.percentageVoted.toFixed(1)}%)</p>
    <Content />
  </article>
))}
```

### Future Enhancements

#### 1. Caching Layer

To reduce API calls and improve build times, implement caching:

```typescript
// Potential implementation
import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/.snapshot-cache.json');
const CACHE_TTL = 3600000; // 1 hour in milliseconds

async function getCachedProposals(space: string): Promise<SnapshotProposal[] | null> {
  try {
    const cache = JSON.parse(await fs.readFile(CACHE_FILE, 'utf-8'));
    if (cache.space === space && Date.now() - cache.timestamp < CACHE_TTL) {
      return cache.proposals;
    }
  } catch {
    // Cache miss or error
  }
  return null;
}

async function setCachedProposals(space: string, proposals: SnapshotProposal[]) {
  await fs.writeFile(
    CACHE_FILE,
    JSON.stringify({ space, proposals, timestamp: Date.now() })
  );
}
```

#### 2. Incremental Updates

For on-demand updates without full rebuilds:

```typescript
// Potential webhook endpoint
// pages/api/update-proposals.ts
export async function post() {
  // Trigger incremental content collection update
  // This would require Astro's experimental content layer API
}
```

#### 3. Enhanced Filtering

Add more sophisticated filtering options:

```typescript
export function snapshotLoader(options: {
  space?: string;
  limit?: number;
  includeFailedProposals?: boolean;
  useMockData?: boolean;
  // New options:
  dateRange?: { start: Date; end: Date };
  minVotes?: number;
  minParticipation?: number;
  titleFilter?: string;
  tagFilter?: string[];
} = {})
```

#### 4. Rate Limiting

Implement exponential backoff for API calls:

```typescript
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### Troubleshooting

#### Network Errors

If you see `fetch failed` or `EAI_AGAIN` errors:
1. Check your internet connection
2. Verify hub.snapshot.org is accessible
3. Use `useMockData: true` for offline development
4. Check if you're behind a proxy/firewall

#### No Proposals Loaded

Possible causes:
1. No closed proposals in the specified space
2. All proposals failed and `includeFailedProposals: false`
3. API returned empty response

Check build logs for details:
```bash
npm run build
```

#### Schema Validation Errors

If you see Zod validation errors:
1. Check `snapshotProposalSchema` in `src/content.config.ts`
2. Verify all required fields are provided by the loader
3. Check data types match schema definitions

### API Rate Limits

Snapshot's GraphQL API has rate limits:
- **Without API Key**: 60 requests/minute
- **With API Key**: Higher limits available

For production sites with frequent builds, consider:
1. Implementing caching (see Future Enhancements)
2. Requesting an API key from Snapshot
3. Using incremental builds with Astro

### Contributing

To modify the loader:

1. Edit `src/loaders/snapshot-loader.ts`
2. Update schema in `src/content.config.ts` if adding new fields
3. Test with `useMockData: true` first
4. Test with real API data
5. Update this documentation

### References

- [Snapshot GraphQL API Docs](https://docs.snapshot.org/graphql-api)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/)
