# Zopio Splash Page

This is the splash page for the Zopio project, showcasing project information and GitHub statistics.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the root directory with your GitHub token:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```
   
   You can create a GitHub token at https://github.com/settings/tokens. The token only needs public repo read access.
   
   > **Note:** This token is used to increase the GitHub API rate limit. Without it, you may encounter rate limit errors when fetching repository data.

3. Run the development server:
   ```bash
   pnpm dev
   ```

## Features

- Displays GitHub repository statistics (stars, forks, issues)
- Shows contributor information
- Provides links to the GitHub repository

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub personal access token for API authentication |

A `.env.example` file is provided as a template for your `.env.local` file.
