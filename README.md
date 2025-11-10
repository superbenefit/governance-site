# SuperBenefit Governance Site

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

The official documentation website for SuperBenefit DAO's governance framework, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build/).

**Live Site:** [governance.superbenefit.org](https://governance.superbenefit.org)

## About

This website provides accessible and searchable access to SuperBenefit DAO's governance documentation:

- **Agreements** - Relational foundations that define how community members work together
- **Policies** - Practical coordination mechanisms across operational domains
- **Proposals** - Institutional memory archive of decision-making processes, automatically fetched from [Snapshot](https://snapshot.org/#/superbenefit.eth)

SuperBenefit DAO embraces "minimum viable coordination"—establishing just enough structure to enable effective collaboration while preserving contributor autonomy.

## Quick Start

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/superbenefit/governance-site.git
cd governance-site

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the site.

## Documentation

Comprehensive documentation is available in the [.docs](.docs/) directory:

- **[Development Guide](.docs/DEVELOPMENT.md)** - Setup, commands, and common tasks
- **[Architecture Guide](.docs/ARCHITECTURE.md)** - Technical architecture and design decisions
- **[Content Guide](.docs/CONTENT.md)** - Managing governance content and submodules
- **[Snapshot Loader](.docs/SNAPSHOT_LOADER.md)** - Snapshot API integration details

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Development workflow
- Branching strategy
- Commit message conventions
- Pull request process

**Note:** Governance content contributions should be made to the [governance repository](https://github.com/superbenefit/governance), not this repository.

## Technology Stack

- **[Astro 5.x](https://astro.build)** - Static site generator
- **[Starlight](https://starlight.astro.build/)** - Documentation theme
- **TypeScript** - Type-safe development
- **Content Collections** - Type-safe content management
- **Git Submodules** - Integration with governance repository

## Architecture Highlights

- **Single Source of Truth** - Governance content lives in separate [governance repository](https://github.com/superbenefit/governance)
- **Dynamic Content Loading** - Proposals fetched from Snapshot API at build time
- **Custom Navigation** - Hierarchical sidebar generated from content collections
- **Type Safety** - Schema validation for all content
- **Performance** - Static generation with optimized assets

See [Architecture Guide](.docs/ARCHITECTURE.md) for detailed information.

## Project Structure

```
governance-site/
├── .docs/                    # Technical documentation
├── src/
│   ├── content/
│   │   └── governance/       # Git submodule (governance repository)
│   ├── pages/                # Route pages
│   ├── components/           # Custom components
│   └── loaders/              # Custom content loaders
├── public/                   # Static assets
├── CONTRIBUTING.md           # Contribution guidelines
├── CLAUDE.md                 # AI assistant guidance
└── README.md                 # This file
```

## Resources

- **Live Site:** [governance.superbenefit.org](https://governance.superbenefit.org)
- **Governance Repository:** [github.com/superbenefit/governance](https://github.com/superbenefit/governance)
- **SuperBenefit Website:** [superbenefit.org](https://superbenefit.org)
- **Snapshot Space:** [snapshot.org/#/superbenefit.eth](https://snapshot.org/#/superbenefit.eth)
- **Discord:** [discord.gg/superbenefit](https://discord.gg/superbenefit)
- **Astro Docs:** [docs.astro.build](https://docs.astro.build)
- **Starlight Docs:** [starlight.astro.build](https://starlight.astro.build/)

## License

The governance content is licensed under CC0-1.0. The website code follows standard open-source practices.

---

Built with care by the SuperBenefit community.
