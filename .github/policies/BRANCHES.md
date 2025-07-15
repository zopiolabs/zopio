# Zopio Branch Structure

_For a visual overview of our Git flow, see: [Git Flow Diagram](./GIT_FLOW_DIAGRAM.md)_

## Core Branches

### 🚀 main (Production)

- **Purpose**: Production-ready code
- **Protection**: Strictest rules, 2 reviews required
- **Deployment**: Automatically deploys to production
- **Merges from**: release/_and hotfix/_ branches only

### 🔧 develop (Integration)

- **Purpose**: Latest development features
- **Protection**: 1 review required, all tests must pass
- **Deployment**: Continuously integrated
- **Merges from**: feat/* branches

### 📦 staging (Pre-production)

- **Purpose**: Pre-production testing environment
- **Protection**: 1 review required, same as develop
- **Deployment**: Mirrors production environment
- **Merges from**: develop branch

## Supporting Branches

### ✨ Feature Branches (feat/*)

- **Naming**: `feat/descriptive-name`
- **Created from**: develop
- **Merge to**: develop
- **Lifecycle**: Delete after merge

### 🚀 Release Branches (release/*)

- **Naming**: `release/v1.2.0`
- **Created from**: develop
- **Merge to**: main and back to develop
- **Purpose**: Release preparation

### 🔥 Hotfix Branches (hotfix/*)

- **Naming**: `hotfix/critical-fix`
- **Created from**: main
- **Merge to**: main and develop
- **Purpose**: Emergency production fixes

### 📚 Documentation Branches (docs/*)

- **Naming**: `docs/update-xyz`
- **Created from**: develop
- **Merge to**: develop
- **Purpose**: Documentation updates

## Merge Strategies

- __feat/_ → develop_*: Squash and merge (preferred)
- **develop → staging**: Merge commit
- __release/_ → main_*: Merge commit
- __hotfix/_ → main_*: Merge commit

## Quick Commands

```bash
# Create a new feature branch
git checkout develop
git pull origin develop
git checkout -b feat/your-feature-name

# Create a release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Create a hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
```
