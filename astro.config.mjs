// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://governance.superbenefit.org',
	integrations: [
		starlight({
			title: 'SuperBenefit DAO Governance',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/superbenefit/governance-site'
				},
			],
			customCss: [
				'./src/styles/design-tokens.css',
				'./src/styles/custom.css',
			],
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
			],
		}),
	],
});
