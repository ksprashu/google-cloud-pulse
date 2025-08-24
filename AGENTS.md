# Agent Collaboration Guide: Google Cloud Pulse

This document provides essential, high-level context for AI agents interacting with this project. For a more detailed breakdown, refer to `GEMINI.md`.

## 1. Project Overview
- **Primary Goal:** A web application to display updates for Google Cloud products, featuring a React frontend and a Node.js/Express backend.
- **Architecture:** A pnpm-based monorepo with separate applications in `/apps` and shared code in `/packages`.
- **Key Technologies:** TypeScript, React, Node.js, Vite, Express, Firebase, pnpm.

## 2. Core Development Workflow
1.  **Installation:** Run `pnpm install` from the project root.
2.  **Static Analysis:** Before committing, run `pnpm format` and `pnpm lint:fix`.
3.  **Testing:**
    -   **Frontend:** `pnpm -F @google-cloud-pulse/frontend test`
    -   **Backend:** `pnpm -F @google-cloud-pulse/backend test`
4.  **Contribution:** Follow the detailed guidelines in `CONTRIBUTING.md`.

## 3. Key Commands for Agents
- **Lint & Format:** `pnpm format && pnpm lint:fix`
- **Run All Tests:** `pnpm -r test`
- **Build All:** `pnpm -r build`

## 4. Critical Documents for Review
- **`GEMINI.md`:** The primary source of truth for project context.
- **`CONTRIBUTING.md`:** Detailed guidelines for all contributors (human and AI).
- **`docs/design.md`:** The comprehensive system design document.
- **`docs/features.md`:** An index of all product requirement documents.