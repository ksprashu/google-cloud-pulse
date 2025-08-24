# Product Requirements: Shared Types

**Last Modified:** 2025-08-24
**Status:** Existing

## 1. Overview & Goal

The `shared-types` package is a dedicated workspace package for defining and managing TypeScript types that are shared between the frontend and backend applications. Its primary goal is to ensure type safety and consistency across the entire application stack.

## 2. Functional Requirements

*   Provides a single source of truth for all shared data structures.
*   Is a separate, versionable package within the pnpm workspace.
*   Is consumed as a dependency by both the frontend and backend applications.

## 3. Non-Functional Requirements

*   The types should be well-documented and easy to understand.
*   The package should have a clear and consistent naming convention for types.

## 4. Revision History

* **2025-08-24:** This feature was identified from the existing codebase. No formal review file is available.
---
