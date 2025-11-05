// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
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
