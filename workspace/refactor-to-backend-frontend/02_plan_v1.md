# Implementation Plan: refactor-to-backend-frontend (Version 1)

**Source Analysis:** `/Users/ksprashanth/code/github/google-cloud-pulse/workspace/refactor-to-backend-frontend/01_analysis_v1.md`

## 1. Prerequisite Steps
- **Objective:** Set up the directory structure and initialize a new Node.js project for the backend service.
- **Instructions:**
  - Create a new directory named `backend` in the root of the project.
  - Inside the `backend` directory, initialize a new Node.js project using `pnpm init`.
  - Install necessary production dependencies for the backend: `express`, `cors`, `cheerio`, `firebase-admin`, and `@google/genai`.
  - Install necessary development dependencies: `typescript`, `ts-node`, `@types/express`, `@types/cors`, `@types/cheerio`, and `@types/node`.
  - Create a `tsconfig.json` file in the `backend` directory to configure TypeScript compilation.
- **Verification:**
  ```bash
  ls -l backend/package.json && cat backend/tsconfig.json
  ```

## 2. Implementation Tasks

### Task 1: Create Backend API Service
- **Objective:** Implement a basic Express server to serve the release notes data.
- **File(s) to Modify:**
  - `backend/src/api.ts`
  - `backend/src/index.ts`
- **Instructions:**
  - Create a new directory `backend/src`.
  - In `backend/src/index.ts`, write the code to start an Express server that listens on a port defined by the `PORT` environment variable (defaulting to 8080).
  - In `backend/src/api.ts`, create an Express router. This router will fetch data from Firestore and expose it via a `GET /release-notes` endpoint. For now, you can return mock data.
  - Mount the router from `api.ts` in `index.ts`.
- **Verification:**
  ```bash
  pnpm -C backend tsc --noEmit
  ```

### Task 2: Create Backend Batch Job
- **Objective:** Implement the logic to fetch, process, and store the release notes.
- **File(s) to Modify:**
  - `backend/src/batch-process.ts`
- **Instructions:**
  - Create a new file `backend/src/batch-process.ts`.
  - Move the core logic from the original `services/rssService.ts` and `services/geminiService.ts` into this file.
  - Replace the browser-specific `document.createElement` logic with `cheerio` to parse the HTML from the RSS feed.
  - Initialize the Firebase Admin SDK to connect to Firestore.
  - Implement the function to save the processed notes into a Firestore collection named `release-notes`.
  - The script should be a standalone executable that performs the entire fetch-and-save process when run.
- **Verification:**
  ```bash
  pnpm -C backend tsc --noEmit
  ```

### Task 3: Dockerize Backend Services
- **Objective:** Create Dockerfiles to containerize the API service and the batch job for deployment on Cloud Run.
- **File(s) to Modify:**
  - `backend/Dockerfile.api`
  - `backend/Dockerfile.batch`
  - `backend/.dockerignore`
- **Instructions:**
  - Create a `Dockerfile.api` in the `backend` directory. This multi-stage Dockerfile should build the TypeScript code and create a minimal Node.js image to run the `backend/dist/index.js` file.
  - Create a `Dockerfile.batch` in the `backend` directory. This multi-stage Dockerfile should build the TypeScript code and create a minimal Node.js image that runs the `backend/dist/batch-process.js` script as its entry point.
  - Create a `.dockerignore` file in the `backend` directory to exclude `node_modules` and other unnecessary files from the Docker context.
- **Verification:**
  ```bash
  ls backend/Dockerfile.api backend/Dockerfile.batch backend/.dockerignore
  ```

### Task 4: Refactor Frontend Application
- **Objective:** Remove the old data services from the frontend and modify the main App component to fetch data from the new backend API.
- **File(s) to Modify:**
  - `App.tsx`
  - `package.json`
  - `services/rssService.ts` (to be deleted)
  - `services/geminiService.ts` (to be deleted)
- **Instructions:**
  - Delete the files `services/rssService.ts` and `services/geminiService.ts`.
  - In `App.tsx`, update the `fetchAndGroupNotes` function to make a network request to the backend's `/api/release-notes` endpoint. You will need to configure a proxy in `vite.config.ts` for local development to avoid CORS issues.
  - Remove the `@google/genai` dependency from the root `package.json` using `pnpm remove @google/genai`.
- **Verification:**
  ```bash
  pnpm build
  ```

## 3. Final Verification
- **Objective:** Ensure the entire refactored application builds successfully.
- **Instructions:**
  - This step confirms that both the frontend and backend TypeScript code compiles without errors, indicating that the refactoring is syntactically correct.
- **Verification:**
  ```bash
  pnpm build && pnpm -C backend tsc --noEmit
  ```
