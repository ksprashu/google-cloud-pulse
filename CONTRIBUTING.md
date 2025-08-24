# Contributing to Google Cloud Pulse

First off, thank you for considering contributing to Google Cloud Pulse! Whether you are a human developer or an AI agent, your help is appreciated. This document outlines the guidelines for contributing to this project to ensure a smooth and collaborative process.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Enhancements](#suggesting-enhancements)
    - [Pull Requests](#pull-requests)
4. [Development Guidelines](#development-guidelines)
    - [Code Style & Quality](#code-style--quality)
    - [Testing](#testing)
    - [Commit Messages](#commit-messages)
    - [Documentation](#documentation)
5. [Guidelines for AI Contributors](#guidelines-for-ai-contributors)

## Code of Conduct
This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## Getting Started
1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Ensure you have `pnpm` installed.
4. Install all dependencies from the root of the monorepo:
   ```bash
   pnpm install
   ```

## How to Contribute

### Reporting Bugs
If you find a bug, please open an issue on GitHub. Please include:
- A clear and descriptive title.
- A detailed description of the problem, including steps to reproduce it.
- The expected behavior and what actually happened.
- Your environment details (e.g., OS, browser, Node.js version).

### Suggesting Enhancements
If you have an idea for an enhancement, please open an issue on GitHub. Please include:
- A clear and descriptive title.
- A detailed description of the proposed enhancement and the problem it solves.
- Any alternative solutions or features you've considered.

### Pull Requests
1. Create a new branch for your feature or bug fix: `git checkout -b feature/my-new-feature` or `git checkout -b fix/my-bug-fix`.
2. Make your changes, adhering to the development guidelines below.
3. Ensure all tests pass and that you've added new tests for your changes.
4. Ensure your code is linted and formatted correctly.
5. Push your branch to your fork and open a pull request to the `main` branch of the original repository.
6. Provide a clear description of your changes in the pull request.

## Development Guidelines

### Code Style & Quality
- **Linting & Formatting:** This project uses ESLint and Prettier to enforce code style and quality. Before committing, please run the following commands from the root of the monorepo:
  ```bash
  pnpm format
  pnpm lint:fix
  ```
- **Architecture:** Please familiarize yourself with the project's architecture by reading the [`docs/design.md`](docs/design.md) file. New contributions should align with the existing patterns.

### Testing
- **Frontend:** The frontend uses `Vitest` and `React Testing Library`. All new components should have corresponding tests. Run frontend tests with `pnpm -F @google-cloud-pulse/frontend test`.
- **Backend:** The backend uses `Jest`. All new services and API endpoints should have unit and/or integration tests. Run backend tests with `pnpm -F @google-cloud-pulse/backend test`.

### Commit Messages
While not strictly enforced, we recommend following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps keep the commit history clean and easy to understand.

### Documentation
- **GEMINI.md:** If your changes significantly alter the project's architecture, dependencies, or development workflow, please update the `GEMINI.md` file.
- **PRDs:** If your changes implement a new feature, please create a new Product Requirements Document (PRD) in the `docs/features` directory.
- **Design Document:** For major architectural changes, please update the `docs/design.md` file.

## Guidelines for AI Contributors
AI agents are welcome to contribute to this project. To ensure a successful collaboration, please adhere to the following guidelines:

- **Context is Key:** Before making any changes, thoroughly review the `GEMINI.md`, `docs/design.md`, and `CONTRIBUTING.md` files to understand the project's context, architecture, and conventions.
- **Follow the Plan:** When working on a task, always create a clear plan and follow it. If you are an autonomous agent, present the plan for approval before implementation.
- **Verify Your Work:** After every change, run the relevant verification steps (e.g., tests, linting) to ensure your changes are correct and do not introduce regressions.
- **Be Explicit:** In your pull requests and commit messages, clearly state that the contribution was AI-generated and which model/agent was used.
- **Human in the Loop:** All AI-generated pull requests will be reviewed by a human developer. Be prepared to make changes based on their feedback.
