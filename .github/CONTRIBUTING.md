# Contributing to Zopio

Thank you for your interest in contributing to Zopio! We welcome contributions from the community. By contributing, you help improve the project for everyone.

## 🔐 Legal Requirements

**IMPORTANT:** All external contributors must sign our Contributor License Agreement (CLA) before we can accept any contributions. This is a one-time process that protects both you and the project.

### For Individual Contributors
- When you submit your first pull request, a CLA bot will prompt you to sign the Individual CLA electronically
- You can also preview the [CLA document](../CLA.md) beforehand
- Once signed, all future contributions are covered

### For Corporate Contributors
- Your company must sign the [Corporate CLA](../CLA.md#corporate-contributor-license-agreement-ccla)
- Email the signed agreement to [legal@zopio.com](mailto:legal@zopio.com)
- Include a list of designated contributors from your organization

## 🚀 Getting Started

1. **Fork the Repository:** Click the "Fork" button at the top of our GitHub repo
2. **Create a Branch:** Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes:** Implement your feature or bug fix following our coding standards
4. **Test Thoroughly:** Ensure all tests pass and add new tests for new functionality
5. **Commit Changes:** Use clear, descriptive commit messages following conventional commits
6. **Push to Fork:** Push your branch to your forked repository
7. **Submit Pull Request:** Open a PR against the main Zopio repository

## 📋 Pull Request Process

### Before You Start
- **Discuss Major Changes:** For significant features, open an issue first to discuss the approach
- **Check Existing Issues:** See if your bug/feature is already being tracked
- **Read Documentation:** Familiarize yourself with our [project philosophy](/docs/overview.mdx)

### PR Requirements
- ✅ **CLA Signed:** Your CLA must be signed before review
- ✅ **Tests Pass:** All CI checks must be green
- ✅ **Code Quality:** Follow our linting and formatting standards
- ✅ **Documentation:** Update docs if your change affects them
- ✅ **Focused Scope:** Keep changes atomic and well-scoped

### PR Description Should Include
- Clear description of what the change does and why it's needed
- Reference to any related issues (e.g., "Closes #123")
- Screenshots for UI changes
- Breaking change notices if applicable

## 🎨 Code Style & Standards

### Development Setup
```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Run linting
pnpm lint

# Run tests
pnpm test

# Format code
pnpm format
```

### Coding Standards
- **TypeScript First:** All code must be TypeScript with strict mode
- **No `any` Types:** Avoid `any` without explicit justification
- **Component Structure:** Use Next.js App Router conventions
- **Server Components:** Default to Server Components, use Client Components only when needed
- **Tailwind CSS:** Use Tailwind v4 classes for styling
- **Testing:** Write tests using Vitest and React Testing Library

### File Naming Conventions
- Use kebab-case for files and directories
- Components should be PascalCase
- Utilities and hooks should be camelCase

## 🐛 Reporting Issues

### Bug Reports
- Use our issue templates
- Include reproduction steps
- Provide environment details (OS, Node version, etc.)
- Add relevant labels

### Feature Requests
- Describe the problem you're trying to solve
- Explain how the feature would work
- Consider if it fits with the project's goals

## 🧪 Testing Guidelines

- **Unit Tests:** Test individual functions and components
- **Integration Tests:** Test component interactions
- **Coverage:** Aim for good test coverage of new features
- **Performance:** Consider performance implications of changes

## 📚 Documentation

When contributing, please:
- Update relevant documentation in `/docs`
- Add JSDoc comments for public APIs
- Update README if adding new features
- Include examples for new functionality

## 🌟 License and Legal

### Understanding Our License Structure

**Core Framework:** Licensed under Business Source License 1.1 (BSL)
- Free for non-production use (development, testing, trials)
- Production use requires commercial license for 3 years
- Automatically converts to Apache 2.0 after 3 years

**Marketplace Plugins:** Licensed under MIT License
- Completely free and open source
- Located in `/marketplace` directory
- Can be used without restrictions

### Your Contributions
- All contributions will be licensed under the same terms as the project
- By contributing, you agree that your code can be included under BSL (and later Apache 2.0)
- The CLA grants us necessary rights while preserving your rights to your contributions

## 🤝 Community Guidelines

### Code of Conduct
Please be respectful and inclusive in all project interactions. We follow standard open source community guidelines.

### Getting Help
- 💬 [GitHub Discussions](https://github.com/zopiolabs/zopio/discussions) for questions
- 🐛 GitHub Issues for bugs and feature requests
- 📧 [legal@zopio.com](mailto:legal@zopio.com) for licensing questions
- 🌐 [Documentation](https://docs.zopio.dev) for technical guidance

### Recognition
We appreciate all contributors! Significant contributors may be recognized in our documentation and releases.

## 🚀 What Happens Next?

1. **CLA Check:** Our bot will verify your CLA status
2. **Review Process:** Maintainers will review your PR
3. **Feedback:** We may suggest changes or improvements
4. **Testing:** Automated tests and manual review
5. **Merge:** Once approved, your contribution will be merged! 🎉

Thank you for helping make Zopio better! Your contributions help build the future of business frameworks.

---

**Questions?** Feel free to reach out via GitHub Discussions or email. We're here to help! 🚀
