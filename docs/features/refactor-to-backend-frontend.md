# Product Requirements: Backend and Frontend Refactor

**Last Modified:** 2025-08-24
**Status:** Completed

## 1. Overview & Goal

This feature refactors the application to create a clear separation between the frontend and backend. The goal is to improve maintainability, scalability, and security by moving data processing and external API interactions to a dedicated Node.js backend, while the frontend focuses solely on presentation.

## 2. Functional Requirements

*   A Node.js backend must be created using Express.js to serve release notes data via a RESTful API.
*   A separate backend batch job must be created to fetch, process, and store release notes data in Firestore.
*   The backend services (API and batch job) must be containerized using Docker.
*   The frontend application must be refactored to fetch all data from the new backend API.
*   The frontend should no longer contain any direct data processing logic or external API calls (e.g., to the Gemini API or RSS feeds).
*   A proxy must be configured in the frontend's development server to facilitate local development and avoid CORS issues.

## 3. Non-Functional Requirements

*   The API design should be RESTful and well-documented.
*   The backend services should be designed to be scalable and deployable as separate Cloud Run services.
*   The refactoring should not introduce any regressions in frontend functionality.

## 4. Revision History

* **2025-08-23:** Refactored the application to separate the frontend and backend, creating a Node.js backend with an API and batch job, and updating the frontend to fetch data from the new API. ([View Review](../../workspace/refactor-to-backend-frontend/03_review_v1.md))
---
