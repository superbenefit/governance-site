# SuperBenefit Governance Site

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

The official documentation website for SuperBenefit DAO's governance framework, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build/).

## About

This website serves as the public interface for SuperBenefit DAO's governance documentation, providing accessible and searchable access to:

- **Agreements** - Relational foundations that define how community members work together
- **Policies** - Practical coordination mechanisms across different operational domains
- **Proposals** - Institutional memory archive preserving decision-making processes and deliberative context

SuperBenefit DAO embraces "minimum viable coordination"—establishing just enough structure to enable effective collaboration while preserving contributor autonomy. This documentation site makes that framework transparent and accessible to all community members and the wider public.

## Content Source

The governance documentation content is maintained in a separate repository: [superbenefit/governance](https://github.com/superbenefit/governance)

Content from that repository is integrated into this Astro Starlight site in the `src/content/docs/` directory.

## Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or your preferred package manager

### Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

### Project Structure

```
.
├── public/              # Static assets (favicons, etc.)
├── src/
│   ├── assets/         # Images and media files
│   ├── content/
│   │   └── docs/       # Governance documentation (Markdown/MDX)
│   └── content.config.ts
├── astro.config.mjs    # Astro and Starlight configuration
├── CLAUDE.md           # AI assistant guidance
└── package.json
```

### Working with Content

Documentation pages are written in Markdown (`.md`) or MDX (`.mdx`) format and stored in `src/content/docs/`. Each file is automatically exposed as a route based on its file name.

To add or update documentation:
1. Edit files in `src/content/docs/` or sync content from the [governance repository](https://github.com/superbenefit/governance)
2. Include required frontmatter: `title` and `description`
3. Update sidebar configuration in `astro.config.mjs` if needed
4. Test locally with `npm run dev`

## Architecture

This site uses:
- **Astro 5.x** - Modern static site generator
- **Starlight** - Astro's official documentation theme
- **Content Collections** - Type-safe content management with Astro's collection system
- **Sharp** - Optimized image processing

See [CLAUDE.md](./CLAUDE.md) for detailed architectural guidance.

## Contributing

This is an open-source project operating under a CC0-1.0 license, making all content freely available for reuse and modification.

For governance content updates, please contribute to the [superbenefit/governance](https://github.com/superbenefit/governance) repository.

For website functionality, design, or technical improvements, please submit issues and pull requests to this repository.

## Resources

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
- [SuperBenefit DAO Governance Repository](https://github.com/superbenefit/governance)

## License

The governance content is licensed under CC0-1.0. The website code follows standard open-source practices.
