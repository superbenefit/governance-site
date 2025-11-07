// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://governance.superbenefit.org',
	vite: {
		ssr: {
			// Allow marked to be processed by Vite for SSR
			noExternal: ['marked'],
		},
	},
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
			// Override Sidebar component with custom implementation
			// The custom sidebar dynamically generates navigation from governance collections
			components: {
				Sidebar: './src/components/starlight/Sidebar.astro',
			},
		}),
	],
});
