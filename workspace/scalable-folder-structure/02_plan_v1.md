# Implementation Plan: scalable-folder-structure (Version 1)

**Source Analysis:** `/Users/ksprashanth/code/github/google-cloud-pulse/workspace/scalable-folder-structure/01_analysis_v1.md`

## 1. Prerequisite Steps

- **Objective:** Create the foundational directories for the new monorepo structure.
- **Instructions:**
  - In the project root, create four new directories: `apps`, `packages`, `infra`, and `scripts`.
- **Verification:**
  ```bash
  ls -d apps/ packages/ infra/ scripts/
  ```

## 2. Implementation Tasks

### Task 1: Configure pnpm Workspace

- **Objective:** Define the pnpm workspace to enable monorepo capabilities.
- **File(s) to Modify:**
  - `pnpm-workspace.yaml` (new file)
- **Instructions:**
  - Create a new file named `pnpm-workspace.yaml` in the project root.
  - Add the following content to the file to define the locations for applications and shared packages:
    ```yaml
    packages:
      - 'apps/*'
      - 'packages/*'
    ```
- **Verification:**
  ```bash
  cat pnpm-workspace.yaml
  ```

### Task 2: Relocate Backend Application

- **Objective:** Move the existing backend code into the new `apps` directory.
- **Instructions:**
  - Move the entire `backend` directory into the `apps` directory. The new path should be `apps/backend`.
- **Verification:**
  ```bash
  ls -d apps/backend
  ```

### Task 3: Relocate Frontend Application

- **Objective:** Move all frontend-related files and directories into a new `apps/frontend` directory.
- **Instructions:**
  - Create a new directory `apps/frontend`.
  - Move the following files and directories from the root into `apps/frontend`:
    - `App.tsx`
    - `components/`
    - `index.html`
    - `index.tsx`
    - `package.json`
    - `playwright.config.ts`
    - `pnpm-lock.yaml`
    - `README.md` (a copy, or move and create a new root README)
    - `tests/`
    - `tsconfig.json`
    - `types.ts`
    - `utils/`
    - `vite.config.ts`
    - `vitest.config.ts`
- **Verification:**
  ```bash
  ls -F apps/frontend
  ```

### Task 4: Create Shared Types Package

- **Objective:** Create a dedicated package for code that will be shared between the frontend and backend.
- **Instructions:**
  - Create a new directory `packages/shared-types`.
  - Create a `package.json` file inside `packages/shared-types` with the following content:
    ```json
    {
      "name": "@google-cloud-pulse/shared-types",
      "version": "1.0.0",
      "main": "src/index.ts",
      "scripts": {
        "build": "tsc"
      },
      "devDependencies": {
        "typescript": "^5.9.2"
      }
    }
    ```
  - Create a `tsconfig.json` file inside `packages/shared-types` for compilation.
    ```json
    {
      "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "declaration": true,
        "outDir": "./dist"
      },
      "include": ["src"]
    }
    ```
  - Create a `src` directory inside `packages/shared-types`.
  - Move the `types.ts` file from `apps/frontend` to `packages/shared-types/src/index.ts`.
- **Verification:**
  ```bash
  ls -F packages/shared-types && cat packages/shared-types/package.json
  ```

### Task 5: Update Root package.json

- **Objective:** Clean up the root `package.json` to remove frontend-specific scripts and dependencies, making it a pure workspace root.
- **File(s) to Modify:**
  - `package.json`
- **Instructions:**
  - Remove the `scripts`, `dependencies`, and `devDependencies` sections from the root `package.json`. It should only contain basic project information. A private field is also recommended.
  ```json
  {
    "name": "google-cloud-pulse-workspace",
    "private": true,
    "version": "1.0.0"
  }
  ```
- **Verification:**
  ```bash
  cat package.json
  ```

## 3. Final Verification

- **Objective:** Ensure the entire monorepo is correctly configured, dependencies are installed, and both applications are buildable.
- **Instructions:**
  - Run `pnpm install` from the root directory. This will install dependencies for all packages in the workspace.
  - Attempt to build both the frontend and backend applications using workspace commands.
- **Verification:**
  ```bash
  pnpm install && pnpm --filter "frontend" build && pnpm --filter "backend" test
  ```
