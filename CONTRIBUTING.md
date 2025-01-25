# Contributing to react-umami

First off, thank you for considering contributing to react-umami! It's people like you that make react-umami such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct, which is to treat all contributors with respect and foster an open and welcoming environment.

## Development Process

1. Fork the repository and create your branch from `main`.
2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```
3. Make your changes and ensure they are well-tested.
4. Run the test suite:
   ```bash
   pnpm test
   ```
5. Run the build to ensure everything compiles correctly:
   ```bash
   pnpm build
   ```
6. Ensure your code follows our style guidelines by running:
   ```bash
   pnpm lint
   pnpm format
   ```

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the CHANGELOG.md with a note describing your changes under the "Unreleased" section.
3. Follow the pull request template when submitting your PR.
4. The PR must pass all CI checks and receive approval from at least one maintainer.
5. Your commits should follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

Example commit messages:
- `feat: add support for custom domains`
- `fix: handle undefined website ID`
- `docs: update API documentation`
- `test: add test for multiple website tracking`
- `chore: update dependencies`

## Testing Guidelines

- Write tests for all new features and bug fixes
- Maintain or improve code coverage
- Tests should be meaningful and cover edge cases
- Use descriptive test names that explain the expected behavior

## Style Guide

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use early returns to reduce nesting

## Setting Up Your Development Environment

1. Install Node.js (version 18 or higher)
2. Install pnpm:
   ```bash
   npm install -g pnpm
   ```
3. Fork and clone the repository
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Set up your IDE:
   - We recommend using Visual Studio Code
   - Install the ESLint and Prettier extensions
   - Enable "Format on Save" in your editor

## Documentation

- Keep README.md up to date
- Document all public APIs with JSDoc comments
- Include examples for non-obvious features
- Update TypeScript types when changing interfaces

## Questions or Problems?

- Check if there's already an issue for your problem
- Use the issue templates when creating new issues
- Provide as much context as possible
- Include steps to reproduce bugs

## Release Process

Our release process is automated using semantic-release. When your PR is merged to main:

1. The CI pipeline will run all tests
2. If tests pass, semantic-release will:
   - Determine the next version based on commit messages
   - Update the CHANGELOG.md
   - Create a new git tag
   - Publish to npm

## License

By contributing to react-umami, you agree that your contributions will be licensed under its MIT license.
