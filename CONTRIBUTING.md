# Contributing to Nexus Enterprise

Thank you for your interest in contributing to Nexus Enterprise! We welcome contributions from everyone. This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or fix
4. Make your changes
5. Push to your fork
6. Submit a pull request

## Development Setup

Follow the steps in [README.md](README.md) to set up your local development environment.

## Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New feature branches
- `bugfix/bug-name` - Bug fix branches
- `hotfix/hotfix-name` - Urgent production fixes

## Commit Messages

Write clear, descriptive commit messages:

```
[TYPE] Brief description of changes

Optional longer description explaining the why and what.

- Bullet point 1
- Bullet point 2

Closes #issue_number
```

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Tests
- `chore:` - Build process, dependencies, etc.

Example:
```
feat: Add employee performance rating system

Implement a new rating system for employee performance reviews:
- Add rating model and controller
- Create rating UI components
- Add rating endpoints to API
- Include rating data in employee profile

Closes #42
```

## Pull Request Process

1. **Before you start:**
   - Check existing issues and PRs to avoid duplicates
   - Discuss major changes by opening an issue first

2. **While developing:**
   - Write clear, maintainable code
   - Add comments for complex logic
   - Test your changes thoroughly
   - Update documentation as needed

3. **Before submitting:**
   - Ensure code follows project style guide
   - Run linter: `npm run lint` (in client)
   - Test all changes locally
   - Update README if needed
   - Rebase on latest `develop` branch

4. **Submitting:**
   - Push to your fork
   - Create a pull request with a clear title and description
   - Link related issues
   - Request reviews from maintainers

5. **After submission:**
   - Address review comments promptly
   - Keep PR focused on single feature/fix
   - Update branch if conflicts arise

## Code Style Guide

### Frontend (React/JavaScript)

```javascript
// Use consistent naming
const ComponentName = () => {
  return (
    <div className="component">
      {/* Comments on their own line */}
    </div>
  );
};

// Use destructuring
const { name, email } = user;

// Use meaningful variable names
const isUserAuthenticated = true;

// Use arrow functions for callbacks
onClick={() => handleClick()}
```

### Backend (Node.js/Express)

```javascript
// Use async/await over promises
const getUser = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error(`User not found: ${error.message}`);
  }
};

// Use meaningful names
const validateUserInput = (userData) => {
  // validation logic
};

// Use consistent formatting
router.get('/endpoint', controllerFunction);
```

### CSS/Tailwind

```jsx
// Use Tailwind classes
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>

// Avoid inline styles when possible
// ✅ Good: <div className="w-full h-screen bg-white">
// ❌ Avoid: <div style={{width: '100%', height: '100vh'}}>
```

## Testing

When possible, include tests with your changes:

- Unit tests for utilities and functions
- Integration tests for API endpoints
- Component tests for React components

Run tests with: `npm test`

## Documentation

- Update README.md if you change functionality
- Add comments for complex logic
- Update API documentation for new endpoints
- Keep inline comments clear and helpful

## Issues

### Reporting Bugs

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment (OS, Node version, etc.)

### Suggesting Features

Include:
- Clear description of the feature
- Why it would be useful
- Possible implementation approach
- Examples or mockups if helpful

## Questions?

- Check existing issues and discussions
- Read the documentation in README.md
- Ask in pull request or issue discussions
- Contact maintainers via email

## Recognition

Contributors will be recognized in the project README and release notes.

Thank you for contributing to Nexus Enterprise! 🎉
