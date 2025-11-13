# Contributing

Thank you for your interest in contributing to the SuperBenefit Governance Site! This guide will help you get started.

## Types of Contributions

### Governance Content Contributions

**Important:** Governance content (agreements, policies, governance framework) is managed in a separate repository.

If you want to contribute governance content:
- Visit the [superbenefit/governance](https://github.com/superbenefit/governance) repository
- Follow the contribution guidelines there
- Governance content changes will be pulled into this site via git submodule

### Site Contributions

Contributions to this repository should focus on:
- Website functionality and features
- Design and user interface improvements
- Documentation improvements
- Bug fixes
- Performance optimizations
- Build process enhancements

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or your preferred package manager
- **Git** with submodule support
- A GitHub account

### Development Setup

1. Fork and clone the repository:

```bash
git clone --recurse-submodules https://github.com/YOUR_USERNAME/governance-site.git
cd governance-site
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:4321` in your browser

See [.docs/DEVELOPMENT.md](.docs/DEVELOPMENT.md) for detailed development instructions.

## Development Workflow

### Branching Strategy

- **main** - Production-ready code
- **feature/feature-name** - New features
- **fix/bug-name** - Bug fixes
- **docs/doc-name** - Documentation improvements

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names that indicate the purpose:
- `feature/mobile-navigation`
- `fix/sidebar-overflow`
- `docs/update-architecture`

## Making Changes

### Code Style

- Follow existing code conventions in the project
- Use TypeScript for type safety
- Write clear, self-documenting code
- Add comments for complex logic
- Keep components focused and reusable

### Testing Your Changes

1. Test locally with the development server:

```bash
npm run dev
```

2. Test the production build:

```bash
npm run build
npm run preview
```

3. Verify all pages load correctly
4. Test navigation and links
5. Check responsive design on mobile devices
6. Test with the governance submodule at different commits

### Commit Messages

We follow conventional commit message format:

```
type(scope): brief description

Longer description if needed, explaining the why and any context.

Co-authored-by: rathermercurial <rathermercurial@protonmail.com>
```

**Important:** All commits MUST include the `Co-authored-by` line crediting the project maintainer. This is collaborative work.

#### Commit Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Build process or tooling changes

#### Examples

```bash
# New feature
git commit -m "feat(sidebar): Add mobile hamburger menu

Implements collapsible navigation for mobile devices.

Co-authored-by: rathermercurial <rathermercurial@protonmail.com>"

# Bug fix
git commit -m "fix(routes): Correct proposal URL generation

Fixes issue where proposals with special characters in IDs failed to load.

Co-authored-by: rathermercurial <rathermercurial@protonmail.com>"

# Documentation
git commit -m "docs: Update architecture documentation

Adds section on Snapshot loader caching strategy.

Co-authored-by: rathermercurial <rathermercurial@protonmail.com>"
```

### Commit Message Template

You can configure git to use a commit message template:

```bash
git config commit.template .gitmessage
```

The `.gitmessage` file in the repository root provides a pre-formatted template with the co-author line.

## Submitting Changes

### Creating a Pull Request

1. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

2. Go to the [original repository](https://github.com/superbenefit/governance-site) on GitHub

3. Click "New Pull Request"

4. Select your fork and branch

5. Fill out the pull request template:
   - **Title:** Clear, descriptive title
   - **Description:** What changes were made and why
   - **Testing:** How you tested the changes
   - **Screenshots:** If UI changes, include before/after screenshots
   - **Related Issues:** Link any related issues

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Include clear description of changes
- Reference any related issues
- Ensure all commits include co-author attribution
- Update documentation if needed
- Test thoroughly before submitting

### PR Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, maintainer will merge
4. Your contribution will be included in the next release

## Common Contribution Scenarios

### Adding a New Feature

1. Create feature branch
2. Implement the feature
3. Add/update documentation
4. Test thoroughly
5. Submit PR with clear description

### Fixing a Bug

1. Create fix branch
2. Write a test that reproduces the bug (if applicable)
3. Fix the bug
4. Verify the fix works
5. Submit PR with explanation

### Improving Documentation

1. Create docs branch
2. Update relevant documentation files
3. Check for broken links
4. Ensure markdown formatting is correct
5. Submit PR

### Working with the Governance Submodule

If you need to test with different governance content:

```bash
cd src/content/governance
git checkout <specific-commit-or-branch>
cd ../..
npm run dev
```

Remember to reset before committing:

```bash
cd src/content/governance
git checkout main
cd ../..
```

See [.docs/CONTENT.md](.docs/CONTENT.md) for detailed submodule instructions.

## Code Review Standards

When reviewing or responding to reviews:

- Be respectful and constructive
- Explain the reasoning behind changes
- Ask questions if something is unclear
- Appreciate feedback as an opportunity to improve
- Focus on the code, not the person

## Getting Help

If you need help:

- Check the [documentation](.docs/)
- Open an issue for questions
- Join the [SuperBenefit Discord](https://discord.gg/superbenefit)
- Reach out to maintainers

## Recognition

All contributors will be recognized in the project. Your GitHub profile will appear in the contributors list automatically.

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (CC0-1.0 for content, standard open-source for code).

## Additional Resources

- [Development Guide](.docs/DEVELOPMENT.md) - Development setup and commands
- [Architecture Guide](.docs/ARCHITECTURE.md) - Technical architecture details
- [Content Guide](.docs/CONTENT.md) - Working with governance content
- [Snapshot Loader](.docs/SNAPSHOT_LOADER.md) - Snapshot integration details
