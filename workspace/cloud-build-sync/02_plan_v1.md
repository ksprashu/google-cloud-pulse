# Implementation Plan: cloud-build-sync (Version 1)

**Source Analysis:** `/Users/ksprashanth/code/github/google-cloud-pulse/workspace/cloud-build-sync/01_analysis_v1.md`

## 1. Prerequisite Steps

- **Objective:** Create a `cloudbuild.yaml` file in the root of the project.
- **Instructions:**
  - Create a new file named `cloudbuild.yaml` in the root of the project.
- **Verification:**
  ```bash
  test -f cloudbuild.yaml && echo "File exists"
  ```

## 2. Implementation Tasks

### Task 1: Define the Cloud Build Pipeline

- **Objective:** Define the steps for the Cloud Build pipeline in the `cloudbuild.yaml` file.
- **File(s) to Modify:**
  - `cloudbuild.yaml`
- **Instructions:**
  - Add the following steps to the `cloudbuild.yaml` file:
    - Install `pnpm`
    - Install frontend dependencies
    - Build the frontend
    - Run frontend tests
    - Install backend dependencies
    - Build the backend API
    - Build the backend batch process
    - Run backend tests
    - Deploy the frontend to Cloud Run
    - Deploy the backend API to Cloud Run
    - Deploy the backend batch process to Cloud Run Batch
- **Verification:**
  ```bash
  gcloud builds submit --config cloudbuild.yaml --dry-run
  ```

### Task 2: Create a Dockerfile for the Frontend

- **Objective:** Create a Dockerfile for the frontend application.
- **File(s) to Modify:**
  - `Dockerfile.frontend`
- **Instructions:**
  - Create a new file named `Dockerfile.frontend` in the root of the project.
  - Add the necessary instructions to the Dockerfile to build and serve the frontend application.
- **Verification:**
  ```bash
  docker build -f Dockerfile.frontend .
  ```

## 3. Final Verification

- **Objective:** Trigger the Cloud Build pipeline and verify that the application is deployed successfully.
- **Instructions:**
  - Push the changes to the GitHub repository.
  - Check the Cloud Build dashboard to see the pipeline running.
  - Check the Cloud Run dashboard to see the services deployed.
- **Verification:**
  ```bash
  gcloud run services list
  ```
