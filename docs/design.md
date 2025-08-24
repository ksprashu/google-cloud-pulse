# System Design: Google Cloud Pulse

**Last Updated:** 2025-08-24

## 1. Introduction

### 1.1. Project Overview & Purpose
Google Cloud Pulse is a web application designed to provide a centralized and user-friendly view of the latest updates and release notes for various Google Cloud products. The system automates the process of fetching data from external RSS feeds, processing it, and storing it in a structured format. A React-based frontend then presents this data to the user, allowing them to easily track changes and new features across the Google Cloud ecosystem.

### 1.2. Goals & Non-Goals
*   **Goals:**
    *   To provide a single, consolidated view of Google Cloud product updates.
    *   To automate the data fetching and processing from various sources.
    *   To maintain a clean, intuitive, and responsive user interface.
    *   To have a clear architectural separation between the frontend and backend services.
    *   To establish a robust, automated CI/CD pipeline for reliable deployments.
*   **Non-Goals:**
    *   User authentication and personalization are not in the current scope.
    *   The system provides updates on a scheduled basis, not in real-time.
    *   Coverage is limited to products that provide a consumable RSS feed.

### 1.3. Technology Stack
*   **Languages:** TypeScript
*   **Frameworks & Runtimes:** Node.js, React, Express.js, Vite
*   **Databases:** Google Cloud Firestore
*   **Key Libraries:**
    *   **Backend:** `cheerio` (for HTML parsing), `@google/genai`, `winston` (logging), `jest` (testing)
    *   **Frontend:** `vitest` (testing), `react-testing-library`
*   **Package Manager:** pnpm (with workspaces)
*   **Deployment:** Google Cloud Run, Google Cloud Build

---

## 2. Architectural Views

### 2.1. Logical View (Component Diagram)
This diagram shows the high-level, logical components of the system and how they are interconnected.

```mermaid
graph TD
    subgraph "User Interface"
        A["Frontend (React App)"]
    end

    subgraph "Backend Services"
        B["API Service (Express.js)"]
        C["Batch Process (Node.js)"]
    end

    subgraph "Data & External"
        D["Firestore Database"]
        E["External RSS Feeds"]
    end

    A -- "Fetches data via HTTP" --> B
    B -- "Reads/Writes" --> D
    C -- "Fetches data" --> E
    C -- "Writes processed data" --> D
```

### 2.2. Development View (Package Diagram)
This diagram illustrates how the source code is organized into packages within the pnpm monorepo.

```mermaid
graph TD
    Root["Monorepo Root (pnpm-workspace.yaml)"] --> Apps["/apps"]
    Root --> Packages["/packages"]

    Apps --> Frontend["/apps/frontend"]
    Apps --> Backend["/apps/backend"]

    Packages --> SharedTypes["/packages/shared-types"]

    Frontend -- "depends on" --> SharedTypes
    Backend -- "depends on" --> SharedTypes
```

### 2.3. Process View (Sequence Diagrams)
These diagrams show how components interact at runtime to accomplish key tasks.

**Use Case 1: User Views Product Updates**
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant BackendAPI as "Backend API"
    participant Firestore

    User->>Frontend: Requests product updates page
    Frontend->>BackendAPI: GET /api/products
    BackendAPI->>Firestore: Query for products
    Firestore-->>BackendAPI: Return product data
    BackendAPI-->>Frontend: Return JSON response
    Frontend->>User: Renders product list
```

**Use Case 2: System Updates Product Data (Batch Job)**
```mermaid
sequenceDiagram
    participant Scheduler as "Cloud Scheduler (Trigger)"
    participant BatchProcess as "Batch Process"
    participant RSSFeeds as "External RSS Feeds"
    participant Firestore

    Scheduler->>BatchProcess: Triggers batch job
    BatchProcess->>RSSFeeds: Fetches RSS feed XML
    RSSFeeds-->>BatchProcess: Returns XML data
    BatchProcess->>BatchProcess: Parses and processes data
    BatchProcess->>Firestore: Writes/updates product data
```

### 2.4. Deployment View
This diagram shows how the system's components are deployed to Google Cloud.

```mermaid
graph TD
    subgraph "Google Cloud Project"
        subgraph "Cloud Run"
            A["Frontend Service"]
            B["Backend API Service"]
        end
        subgraph "Cloud Run Batch"
            C["Batch Job"]
        end
        subgraph "Databases"
            D["Firestore"]
        end
        subgraph "CI/CD"
            E["Cloud Build"]
        end
    end

    F[("User")] --> A
    A --> B
    B --> D
    C --> D
    G["GitHub Repository"] --> E
    E --> A
    E --> B
    E --> C
```

---

## 3. Data Design

### 3.1. Core Data Model (Class Diagram)
This diagram represents the main data entities, their attributes, and their relationships.

```mermaid
classDiagram
    class Product {
        +string id
        +string productName
        +string releaseNotesUrl
        +boolean isRecent
    }

    class ReleaseNote {
        +string id
        +string changeType
        +Date updated
        +string summary
    }

    Product "1" -- "0..*" ReleaseNote : contains
```

### 3.2. Entity State Lifecycle (State Diagram)
This diagram models the lifecycle of a critical data entity as it transitions through different states.

**Lifecycle of `Product.isRecent`:**
```mermaid
stateDiagram-v2
    [*] --> NotRecent

    NotRecent --> Recent : New release note added
    Recent --> NotRecent : Data ages out (process-driven)
    Recent --> Recent : New release note added
```

---

## 4. Cross-Cutting Concerns

### 4.1. Security
The application currently operates without user authentication, and the API is publicly accessible (`--allow-unauthenticated`). This is suitable for the initial goal of displaying public information. Future iterations requiring user-specific features would need to introduce a robust authentication and authorization layer (e.g., using Firebase Authentication or Identity Platform).

### 4.2. Scalability
The application is designed for scalability by leveraging serverless technologies. Both the frontend and backend API are deployed on Google Cloud Run, which automatically scales the number of container instances based on incoming traffic. The use of Firestore provides a scalable and managed NoSQL database that can handle large volumes of data and connections.

### 4.3. Logging & Monitoring
The backend service uses the `winston` library for structured logging. It is integrated with `@google-cloud/logging-winston`, which automatically sends logs to Google Cloud's operations suite (formerly Stackdriver) in a production environment. A request logging middleware is in place to log all incoming API requests, providing a clear audit trail of system activity.
