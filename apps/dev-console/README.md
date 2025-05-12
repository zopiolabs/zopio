# Zopio Developer Console

A modern developer console panel for the Zopio framework, designed for developers and technical users. Built with Next.js, TypeScript, TailwindCSS, and ShadCN UI components.

## Features

The Zopio Developer Console provides a comprehensive set of tools for developers to manage and monitor their Zopio applications:

### System Overview
- App Status monitoring
- Active Tenants management
- Version Information

### Developer Tools
- API Explorer for testing endpoints
- DB Viewer for browsing database tables and records
- Job Queue Monitor for managing background jobs
- Feature Flags Manager for toggling features

### Security & Access
- API Key Management
- Audit Logs viewer
- User Roles & Permissions management

### Testing & QA
- Scenario Runner
- Email/Webhook Simulator
- A/B Test Configurator

### Observability
- Request Logs
- Real-Time Metrics
- Error Tracker

### Integrations
- Webhooks configuration
- Connected Services management (e.g., Stripe, Slack, Segment)

### Docs & Resources
- API Reference
- Internal Documentation (markdown view)
- CLI / SDK Installers

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at http://localhost:3000.

## Architecture

The Zopio Developer Console is built as a modular application with a clean separation of concerns:

- **UI Components**: Built with ShadCN UI components for a consistent look and feel
- **Routing**: Uses Next.js App Router for efficient page navigation
- **State Management**: Leverages React's built-in state management capabilities
- **API Integration**: Connects to the Zopio framework's API endpoints

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
