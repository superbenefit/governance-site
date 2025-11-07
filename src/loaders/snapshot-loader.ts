/**
 * Custom Astro Content Loader for Snapshot Proposals
 *
 * Fetches passed proposals from the superbenefit.eth Snapshot space
 * and transforms them into content collection entries.
 *
 * Architecture:
 * - Queries Snapshot GraphQL API at build time
 * - Implements incremental loading with file-based cache
 * - Only processes new or changed proposals
 * - Reuses cached HTML for unchanged proposals
 * - Filters for closed proposals
 * - Calculates if proposal passed (>50% threshold)
 * - Sanitizes content for security
 * - Converts markdown to HTML for proper rendering
 * - Returns typed entries for Astro content collections
 *
 * Caching:
 * - Cache stored in src/.snapshot-cache.json (gitignored)
 * - Uses proposal ID + end timestamp + state for cache validation
 * - Closed proposals are immutable - safe to cache indefinitely
 * - Skips expensive markdown conversion for cached proposals
 * - Significantly speeds up subsequent builds
 *
 * Future enhancements:
 * - Add rate limiting handling
 * - Cache expiration/TTL
 * - Support for webhook-triggered updates
 */

import { request, gql } from 'graphql-request';
import type { Loader } from 'astro/loaders';
import { marked } from 'marked';
import fs from 'fs/promises';

const SNAPSHOT_GRAPHQL_ENDPOINT = 'https://hub.snapshot.org/graphql';
const SNAPSHOT_SPACE = 'superbenefit.eth';
const CACHE_FILE = 'src/.snapshot-cache.json';

/**
 * GraphQL query to fetch proposals from Snapshot
 * Retrieves all necessary fields for determining proposal outcome
 */
const PROPOSALS_QUERY = gql`
  query GetProposals($space: String!, $first: Int!) {
    proposals(
      first: $first
      where: { space: $space, state: "closed" }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      created
      scores
      scores_total
      votes
      space {
        id
        name
      }
    }
  }
`;

interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  author: string;
  created: number;
  scores: number[];
  scores_total: number;
  votes: number;
  space: {
    id: string;
    name: string;
  };
}

interface SnapshotResponse {
  proposals: SnapshotProposal[];
}

/**
 * Cached proposal data structure
 * Stores processed HTML and metadata to avoid reprocessing unchanged proposals
 */
interface CachedProposal {
  id: string;
  end: number; // End timestamp for verification
  state: string; // Proposal state
  htmlBody: string; // Processed HTML
  data: any; // Proposal metadata
  cachedAt: number; // Timestamp when cached
}

/**
 * Reads the proposal cache from disk
 * Returns a map of proposal ID to cached data
 */
async function readCache(): Promise<Map<string, CachedProposal>> {
  try {
    const cacheData = await fs.readFile(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(cacheData);
    return new Map(Object.entries(parsed));
  } catch (error) {
    // Cache doesn't exist or is invalid, return empty map
    return new Map();
  }
}

/**
 * Writes the proposal cache to disk
 */
async function writeCache(cache: Map<string, CachedProposal>): Promise<void> {
  const cacheObject = Object.fromEntries(cache);
  await fs.writeFile(CACHE_FILE, JSON.stringify(cacheObject, null, 2), 'utf-8');
}

/**
 * Sanitizes HTML/Markdown content from Snapshot proposals
 * Basic sanitization to prevent XSS and clean up content
 */
function sanitizeContent(content: string): string {
  if (!content) return '';

  // Remove potentially dangerous HTML tags
  let sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // Remove inline event handlers

  return sanitized.trim();
}

/**
 * Determines if a proposal passed based on voting results
 * Uses a 50% threshold of total voting power
 */
function didProposalPass(proposal: SnapshotProposal): {
  passed: boolean;
  winningChoice: string;
  winningScore: number;
  percentageVoted: number;
} {
  if (!proposal.scores || proposal.scores.length === 0) {
    return {
      passed: false,
      winningChoice: '',
      winningScore: 0,
      percentageVoted: 0,
    };
  }

  // Find the choice with the highest score
  const maxScore = Math.max(...proposal.scores);
  const winningIndex = proposal.scores.indexOf(maxScore);
  const winningChoice = proposal.choices[winningIndex] || '';

  // Calculate percentage of total voting power
  const percentageVoted = proposal.scores_total > 0
    ? (maxScore / proposal.scores_total) * 100
    : 0;

  // Proposal passes if winning choice has >50% of total votes
  const passed = percentageVoted > 50;

  return {
    passed,
    winningChoice,
    winningScore: maxScore,
    percentageVoted,
  };
}

/**
 * Creates a URL-safe slug from proposal title and ID
 */
function createSlug(proposal: SnapshotProposal): string {
  // Use the Snapshot ID as the primary identifier
  // This ensures uniqueness and matches Snapshot's URL structure
  return proposal.id;
}

/**
 * Custom loader function for Snapshot proposals
 * Implements Astro's Loader interface
 */
export function snapshotLoader(options: {
  space?: string;
  limit?: number;
  includeFailedProposals?: boolean;
  useMockData?: boolean;
} = {}): Loader {
  const space = options.space || SNAPSHOT_SPACE;
  const limit = options.limit || 1; // Default to 1 for initial testing
  const includeFailedProposals = options.includeFailedProposals ?? false;
  const useMockData = options.useMockData ?? false;

  return {
    name: 'snapshot-loader',
    load: async ({ store, logger, parseData, generateDigest, meta, config }) => {
      logger.info(`Fetching proposals from Snapshot space: ${space}`);

      try {
        // Read cache
        const cache = await readCache();
        logger.info(`Loaded cache with ${cache.size} proposal(s)`);

        let proposals: SnapshotProposal[];

        if (useMockData) {
          logger.info('Using mock data for development/testing');
          proposals = getMockProposals(limit);
        } else {
          // Fetch proposals from Snapshot API
          const response = await request<SnapshotResponse>(
            SNAPSHOT_GRAPHQL_ENDPOINT,
            PROPOSALS_QUERY,
            { space, first: limit }
          );

          if (!response.proposals || response.proposals.length === 0) {
            logger.warn(`No proposals found for space: ${space}`);
            return;
          }

          proposals = response.proposals;
        }

        logger.info(`Found ${proposals.length} closed proposals from API`);

        // Process each proposal
        let loadedCount = 0;
        let cachedCount = 0;
        let processedCount = 0;
        const updatedCache = new Map<string, CachedProposal>();

        for (const proposal of proposals) {
          const outcome = didProposalPass(proposal);

          // Skip failed proposals unless explicitly included
          if (!outcome.passed && !includeFailedProposals) {
            logger.info(`Skipping failed proposal: ${proposal.title}`);
            continue;
          }

          // Create unique ID for this entry
          const id = createSlug(proposal);

          // Check if we have this proposal in cache and if it's unchanged
          // For closed proposals, if ID and end timestamp match, the proposal is immutable
          const cached = cache.get(id);
          let htmlBody: string;

          if (cached && cached.end === proposal.end && cached.state === proposal.state) {
            // Use cached HTML - closed proposals are immutable
            htmlBody = cached.htmlBody;
            cachedCount++;
            logger.info(`✓ Using cached: ${proposal.title}`);
          } else {
            // New or changed proposal - process it
            logger.info(`${cached ? '⟳ Reprocessing' : '+ Processing new'}: ${proposal.title}`);

            // Sanitize the proposal body content
            const sanitizedBody = sanitizeContent(proposal.body);
            logger.info(`  Body length: ${sanitizedBody.length} characters`);

            // Convert markdown to HTML for proper rendering
            htmlBody = sanitizedBody.length > 0
              ? await marked(sanitizedBody, {
                  breaks: true, // Convert single line breaks to <br>
                  gfm: true, // GitHub Flavored Markdown
                })
              : '';

            logger.info(`  HTML length: ${htmlBody.length} characters`);
            processedCount++;
          }

          // Prepare the data object that matches our schema
          const data = {
            title: proposal.title,
            description: `Snapshot proposal: ${proposal.title}`,
            status: outcome.passed ? 'passed' : 'rejected',
            lastUpdated: new Date(proposal.end * 1000), // Convert Unix timestamp to Date
            tags: ['snapshot', 'proposal', outcome.passed ? 'passed' : 'failed'],
            // Additional Snapshot-specific metadata
            snapshotId: proposal.id,
            author: proposal.author,
            choices: proposal.choices,
            scores: proposal.scores,
            scores_total: proposal.scores_total,
            votes: proposal.votes,
            startDate: new Date(proposal.start * 1000),
            endDate: new Date(proposal.end * 1000),
            snapshot: proposal.snapshot,
            winningChoice: outcome.winningChoice,
            winningScore: outcome.winningScore,
            percentageVoted: outcome.percentageVoted,
          };

          // Store the entry with HTML body
          store.set({
            id,
            data,
            body: htmlBody,
            digest: generateDigest(data),
          });

          // Update cache with this proposal
          updatedCache.set(id, {
            id,
            end: proposal.end,
            state: proposal.state,
            htmlBody,
            data,
            cachedAt: Date.now(),
          });

          loadedCount++;
        }

        // Write updated cache to disk
        await writeCache(updatedCache);
        logger.info(`Cache updated with ${updatedCache.size} proposal(s)`);

        logger.info(`Successfully loaded ${loadedCount} proposal(s) - ${cachedCount} from cache, ${processedCount} newly processed`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to fetch proposals from Snapshot: ${errorMessage}`);

        // Don't throw on network errors if we're in development
        if (errorMessage.includes('fetch failed') || errorMessage.includes('EAI_AGAIN')) {
          logger.warn('Network error - consider using useMockData: true for local development');
        }

        throw error;
      }
    },
  };
}

/**
 * Provides mock proposal data for testing and development
 * Useful when Snapshot API is unavailable or for faster local builds
 */
function getMockProposals(limit: number): SnapshotProposal[] {
  const mockProposal: SnapshotProposal = {
    id: '0x1234567890abcdef',
    title: 'Example Governance Proposal',
    body: `# Example Governance Proposal

This is a mock proposal for testing purposes.

## Summary
This proposal demonstrates the structure and content of a typical Snapshot proposal.

## Details
- **Category**: Governance
- **Status**: Passed
- **Author**: 0x1234...5678

## Motivation
The motivation for this proposal is to establish a working example of how Snapshot proposals are fetched and displayed.

## Specification
The proposal includes voting choices and metadata that can be used to determine the outcome.`,
    choices: ['For', 'Against', 'Abstain'],
    start: Math.floor(Date.now() / 1000) - 604800, // 1 week ago
    end: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    snapshot: '12345678',
    state: 'closed',
    author: '0x1234567890abcdef1234567890abcdef12345678',
    created: Math.floor(Date.now() / 1000) - 604800,
    scores: [75.5, 20.3, 4.2],
    scores_total: 100,
    votes: 42,
    space: {
      id: 'superbenefit.eth',
      name: 'SuperBenefit DAO',
    },
  };

  return Array(limit).fill(mockProposal).map((proposal, index) => ({
    ...proposal,
    id: `${proposal.id}-${index}`,
    title: `${proposal.title} #${index + 1}`,
  }));
}
