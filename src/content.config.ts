import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

/**
 * Custom Content Loader for SuperBenefit Governance Documentation
 *
 * This configuration defines separate content collections for governance content
 * loaded from the submodule (src/content/governance/). Dynamic route pages
 * (src/pages/[collection]/[...slug].astro) render the content using Starlight components.
 *
 * Architecture:
 * - Content Source: Git submodule at src/content/governance/
 * - Collections: docs (site pages), agreements, policies, proposals
 * - Routing: Manual via dynamic route pages (Astro best practice)
 * - Rendering: Starlight components for UI/aesthetics
 * - Schema: Custom validation with governance-specific fields
 *
 * Why this approach:
 * - Full control over routing (not constrained by Starlight conventions)
 * - Use Starlight for UI/components, not automatic routing
 * - Clean separation between site pages and governance content
 * - Content stays in submodule (single source of truth)
 * - Follows Astro best practices for content collections + dynamic routes
 */

/**
 * Schema for governance documents
 * Defines required and optional frontmatter fields
 *
 * Note: title is optional - if not provided in frontmatter, the first H1 in the
 * markdown content will be used by the page template
 */
const governanceSchema = z.object({
	title: z.string().optional(),
	description: z.string(),
	status: z.enum(['draft', 'active', 'deprecated']).optional(),
	lastUpdated: z.coerce.date().optional(),
	tags: z.array(z.string()).optional(),
	relatedDocs: z.array(z.string()).optional(),
});

/**
 * Content Collections Configuration
 *
 * - docs: Site pages (landing, index pages) - uses Starlight's loader
 * - agreements: Governance agreements from submodule
 * - policies: Governance policies from submodule
 * - proposals: Governance proposals from submodule
 */
export const collections = {
	// Site pages collection (landing page, section indexes, etc.)
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema()
	}),

	// Governance agreements collection
	// Loads from: src/content/governance/agreements/**/*.md
	// Rendered by: src/pages/agreements/[...slug].astro
	// Routes: /agreements/dao/*, /agreements/community/*
	// Note: Excludes index.md and readme.md files
	agreements: defineCollection({
		loader: glob({
			pattern: ['**/*.md', '!index.md', '!readme.md', '!README.md', '!**/index.md', '!**/readme.md', '!**/README.md'],
			base: './src/content/governance/agreements'
		}),
		schema: governanceSchema,
	}),

	// Governance policies collection
	// Loads from: src/content/governance/policies/**/*.md
	// Rendered by: src/pages/policies/[...slug].astro
	// Routes: /policies/operations/*, /policies/metagovernance/*, /policies/platforms/*
	// Note: Excludes index.md and readme.md files
	policies: defineCollection({
		loader: glob({
			pattern: ['**/*.md', '!index.md', '!readme.md', '!README.md', '!**/index.md', '!**/readme.md', '!**/README.md'],
			base: './src/content/governance/policies'
		}),
		schema: governanceSchema,
	}),

	// Governance proposals collection
	// Loads from: src/content/governance/proposals/**/*.md
	// Rendered by: src/pages/proposals/[...slug].astro
	// Routes: /proposals/*
	// Note: Excludes index.md and readme.md files
	proposals: defineCollection({
		loader: glob({
			pattern: ['**/*.md', '!index.md', '!readme.md', '!README.md', '!**/index.md', '!**/readme.md', '!**/README.md'],
			base: './src/content/governance/proposals'
		}),
		schema: governanceSchema,
	}),
};
