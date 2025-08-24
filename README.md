# Google Cloud Pulse

![Build Status](https://img.shields.io/github/actions/workflow/status/google-cloud-pulse/ci.yml?branch=main)
![NPM Version](https://img.shields.io/npm/v/google-cloud-pulse)
![License](https://img.shields.io/github/license/google-cloud-pulse/google-cloud-pulse)

An application that fetches and analyzes Google Cloud Platform release notes from an RSS feed, categorizes them using AI, and displays them in a user-friendly tiled interface.

This project provides a centralized and easy-to-navigate dashboard for staying up-to-date with the latest changes and announcements across the Google Cloud ecosystem. It automates the process of gathering information from various RSS feeds, uses AI to process and categorize the updates, and presents them in a clean, filterable interface.

## Key Features

*   **Automated RSS Feed Processing:** Automatically fetches and parses release notes from multiple Google Cloud product RSS feeds.
*   **AI-Powered Analysis:** Uses the Gemini API to analyze and categorize release notes into features, bug fixes, security updates, and more.
*   **Interactive Frontend:** A React-based user interface for viewing, searching, and filtering the latest updates.
*   **Monorepo Architecture:** A scalable pnpm-based monorepo for clean separation of the frontend, backend, and shared code.

## Tech Stack

*   **Frontend:** React, Vite, TypeScript
*   **Backend:** Node.js, Express.js
*   **Database:** Google Cloud Firestore
*   **Package Manager:** pnpm
*   **CI/CD:** Google Cloud Build

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm

### 1. Clone the repository
```bash
git clone https://github.com/google-cloud-pulse/google-cloud-pulse.git
cd google-cloud-pulse
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment
This project requires a Gemini API key to process the release notes.

1.  Create a `.env` file in the `apps/backend` directory.
2.  Add your Gemini API key to the `.env` file:
    ```
    API_KEY=your_gemini_api_key
    ```

## Usage

### Running the Development Servers

**Frontend:**
```bash
pnpm -F @google-cloud-pulse/frontend dev
```
This will start the frontend development server, typically on `http://localhost:5173`.

**Backend:**
```bash
pnpm -F @google-cloud-pulse/backend start
```
This will start the backend API server, typically on `http://localhost:8080`.

### Running the Batch Job
To manually trigger the batch job to fetch and process the latest release notes, run:
```bash
pnpm -F @google-cloud-pulse/backend ts-node src/batch-process.ts
```

## Deployment

This project is designed for continuous deployment using Google Cloud Build. For a complete guide on how to set up your Google Cloud project and configure the CI/CD pipeline, please refer to the [full deployment guide](docs/DEPLOYMENT.md).

## Running Tests

**Frontend:**
```bash
pnpm -F @google-cloud-pulse/frontend test
```

**Backend:**
```bash
pnpm -F @google-cloud-pulse/backend test
```

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on how to get started.

## License

This project is licensed under the MIT License.
