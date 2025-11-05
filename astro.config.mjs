// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://superbenefit.github.io',
	base: '/governance-site',
	integrations: [
		starlight({
			title: 'SuperBenefit Governance',
			description: 'Governance documentation for SuperBenefit DAO - agreements, policies, and proposals that define how we work together.',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/superbenefit/governance-site'
				},
			],
			// Enable Starlight features
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 4,
			},
			editLink: {
				baseUrl: 'https://github.com/superbenefit/governance-site/edit/main/',
			},
			lastUpdated: true,
			// Custom CSS for visual hierarchy
			customCss: [
				'./src/styles/custom.css',
			],
			sidebar: [
				// Main governance sections (prominent)
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
				// Visual separator and de-emphasized root pages
				{
					label: 'Reference',
					collapsed: true,
					items: [
						{ label: 'Governance Framework', slug: 'governance' },
						{ label: 'Code of Conduct', slug: 'code-of-conduct' },
						{ label: 'Contributing', slug: 'contributing' },
					],
				},
			],
		}),
	],
});
