# Strategic Analysis: cloud-build-sync (Version 1)

## 1. Problem Definition & Goal

- **Task:** Set up a Cloud Build sync to the github repo. It should deploy the frontends and other services to cloud run, and also the scripts to cloud run batch. Everytime a push is made to github repo, it should do a build, run tests, verify etc, and if everything looks good, then deploy to cloud run.
- **Goal:** To create a fully automated CI/CD pipeline that builds, tests, and deploys the Google Cloud Pulse application to Cloud Run and Cloud Run Batch on every push to the GitHub repository.

## 2. Investigation & Findings

- **Evidence:**
  - The project is a monorepo with a frontend and a backend.
  - The frontend is a React application built with Vite.
  - The backend is a Node.js application with two services: an API and a batch process.
  - The backend services are containerized using Docker.
  - The project uses `pnpm` as a package manager.
- **Current Architecture:**
  - The frontend and backend are in separate directories.
  - The backend has two Dockerfiles: `Dockerfile.api` and `Dockerfile.batch`.
  - The project has unit tests for both the frontend and the backend.
- **Dependencies & Integration Points:**
  - The project uses GitHub for version control.
  - The project will use Google Cloud Build for CI/CD.
  - The project will use Google Cloud Run for hosting the frontend and backend services.
  - The project will use Google Cloud Run Batch for running the batch process.

## 3. Strategic Options Analysis

### Option A: Single Cloud Build Pipeline

- **Description:** This approach uses a single `cloudbuild.yaml` file to define the entire CI/CD pipeline. The pipeline will have steps for building the frontend, building the backend services, running tests, and deploying to Cloud Run and Cloud Run Batch.
- **Pros:**
  - Simple to set up and manage.
  - All the CI/CD logic is in a single file.
  - Easy to understand the entire pipeline at a glance.
- **Cons:**
  - The `cloudbuild.yaml` file can become large and complex for larger projects.
  - It can be difficult to reuse parts of the pipeline.
  - It can be slower to run the entire pipeline for small changes.

### Option B: Multiple Cloud Build Pipelines

- **Description:** This approach uses multiple `cloudbuild.yaml` files to define the CI/CD pipeline. For example, there could be a separate pipeline for the frontend, the backend API, and the backend batch process. Each pipeline would be triggered by changes in the corresponding directory.
- **Pros:**
  - More modular and reusable.
  - The `cloudbuild.yaml` files are smaller and easier to manage.
  - It can be faster to run the pipelines for small changes.
- **Cons:**
  - More complex to set up and manage.
  - It can be difficult to understand the entire pipeline at a glance.
  - It can be more difficult to coordinate the pipelines.

### Option C: Hybrid Approach

- **Description:** This approach uses a combination of a single and multiple Cloud Build pipelines. For example, there could be a single pipeline for building and testing the entire application, and then separate pipelines for deploying the frontend, the backend API, and the backend batch process.
- **Pros:**
  - More flexible and scalable.
  - It can be faster to run the pipelines for small changes.
  - It can be easier to manage the pipelines for larger projects.
- **Cons:**
  - More complex to set up and manage.
  - It can be difficult to understand the entire pipeline at a glance.

## 4. Recommendation & High-Level Plan

### Recommended Strategy

For this project, I recommend **Option A: Single Cloud Build Pipeline**. The project is small enough that a single pipeline will be easy to manage and understand. It will also be the simplest to set up.

### High-Level Action Plan

- **Component:** `cloudbuild.yaml`
  - **Action:** Create a `cloudbuild.yaml` file in the root of the project.
- **Component:** `Cloud Build Trigger`
  - **Action:** Create a Cloud Build trigger that listens for pushes to the GitHub repository.
- **Component:** `Cloud Run`
  - **Action:** Create three Cloud Run services: one for the frontend, one for the backend API, and one for the backend batch process.
- **Component:** `IAM`
  - **Action:** Grant the Cloud Build service account the necessary permissions to deploy to Cloud Run and Cloud Run Batch.

## 5. Success Criteria

- The Cloud Build pipeline is triggered on every push to the GitHub repository.
- The pipeline builds the frontend and backend services.
- The pipeline runs the unit tests for the frontend and backend.
- The pipeline deploys the frontend and backend services to Cloud Run.
- The pipeline deploys the batch process to Cloud Run Batch.
- The application is accessible via the Cloud Run URLs.
