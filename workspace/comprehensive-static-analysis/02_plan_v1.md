# Implementation Plan: comprehensive-static-analysis (Version 1)

**Source Analysis:** `/Users/ksprashanth/code/github/google-cloud-pulse/workspace/comprehensive-static-analysis/01_analysis_v1.md`

## 1. Prerequisite Steps

- **Objective:** Install all necessary `eslint`, `prettier`, and TypeScript/React plugins as dev dependencies at the monorepo root.
- **Instructions:**
  - Modify the root `package.json` to add the required development dependencies for ESLint and Prettier.
- **Verification:**
  ```bash
  pnpm install
  ```

## 2. Implementation Tasks

### Task 1: Configure Prettier

- **Objective:** Create a root Prettier configuration to enforce a uniform code style and a `.prettierignore` file to exclude irrelevant files.
- **File(s) to Modify:**
  - `.prettierrc.js` (new)
  - `.prettierignore` (new)
- **Instructions:**
  - Create a `.prettierrc.js` file with standard formatting rules (e.g., single quote, semi-colons).
  - Create a `.prettierignore` file to exclude `pnpm-lock.yaml`, build artifacts (`dist`), and other non-source files.
- **Verification:**
  ```bash
  pnpm prettier --check .
  ```

### Task 2: Configure ESLint

- **Objective:** Create a root `.eslintrc.js` file that establishes a base configuration and applies specific, appropriate rules for the frontend (React) and backend (Node.js) workspaces.
- **File(s) to Modify:**
  - `.eslintrc.js` (new)
- **Instructions:**
  - Create a `.eslintrc.js` file.
  - The configuration should extend recommended rule sets for TypeScript and apply React-specific rules only to the `apps/frontend` directory.
- **Verification:**
  ```bash
  pnpm eslint . --ext .ts,.tsx
  ```

### Task 3: Add Root-Level Scripts

- **Objective:** Add `lint`, `lint:fix`, and `format` scripts to the root `package.json` to make it easy to run static analysis across the entire monorepo.
- **File(s) to Modify:**
  - `package.json`
- **Instructions:**
  - Add a `lint` script: `eslint . --ext .ts,.tsx`.
  - Add a `lint:fix` script: `eslint . --ext .ts,.tsx --fix`.
  - Add a `format` script: `prettier --write .`.
- **Verification:**
  ```bash
  pnpm lint && pnpm format --check
  ```

### Task 4: Configure IDE Integration

- **Objective:** Create a `.vscode/settings.json` file to recommend the official ESLint and Prettier extensions and enable format-on-save for a better developer experience.
- **File(s) to Modify:**
  - `.vscode/settings.json` (new)
- **Instructions:**
  - Create the `.vscode/settings.json` file.
  - Add settings to define ESLint as the default formatter for relevant files and enable `editor.formatOnSave`.
  - Add recommendations for the `dbaeumer.vscode-eslint` and `esbenp.prettier-vscode` extensions.
- **Verification:**
  ```bash
  cat .vscode/settings.json
  ```

### Task 5: Integrate Linting into CI/CD

- **Objective:** Add a linting check to the `cloudbuild.yaml` pipeline to ensure that no code with linting errors can be merged.
- **File(s) to Modify:**
  - `cloudbuild.yaml`
- **Instructions:**
  - Add a new build step named "Lint" before the "Test" step.
  - This step should use the `pnpm/pnpm` image and run the `pnpm lint` command.
- **Verification:**
  ```bash
  # This step will be fully verified by the CI pipeline on the next run.
  # For now, we will manually check the file content.
  cat cloudbuild.yaml
  ```

## 3. Final Verification

- **Objective:** Run all checks from the root to ensure the entire project is correctly formatted and free of linting errors.
- **Instructions:**
  - Execute the `lint:fix` and `format` commands to apply all new rules across the codebase.
- **Verification:**
  ```bash
  pnpm lint:fix && pnpm format && pnpm lint
  ```
