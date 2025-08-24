# Google Cloud Deployment Guide

This guide provides detailed instructions for setting up the necessary Google Cloud services and deploying the Google Cloud Pulse application.

## Prerequisites

Before you begin, ensure you have the following:

*   A Google Cloud project with billing enabled.
*   The `gcloud` command-line tool installed and authenticated. You can install it by following the [official documentation](https://cloud.google.com/sdk/docs/install).
*   Permissions to create and manage resources in the Google Cloud project (e.g., `Owner` or `Editor` role).

## Google Cloud Project Setup

You need to enable several APIs to allow Cloud Build and Cloud Run to function correctly.

1.  **Enable Required APIs:**
    Open the Cloud Shell in your GCP project or use your local `gcloud` CLI and run the following commands:

    ```bash
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable iam.googleapis.com
    ```

2.  **Create an Artifact Registry Repository:**
    Cloud Build will store the container images for your frontend and backend services in Artifact Registry.

    ```bash
    gcloud artifacts repositories create YOUR_REPO_NAME --repository-format=docker --location=YOUR_REGION
    ```
    *Replace `YOUR_REPO_NAME` and `YOUR_REGION` with your desired names (e.g., `google-cloud-pulse-repo` and `us-central1`).*

## IAM Permissions

The Cloud Build service account needs specific permissions to deploy applications to Cloud Run and to act as a Service Account User.

1.  **Identify your Cloud Build Service Account:**
    Go to the IAM page in the GCP Console. The service account will have a name like `[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com`.

2.  **Grant Required Roles:**
    Grant the following roles to your Cloud Build service account:
    *   **Cloud Run Admin (`roles/run.admin`):** Allows Cloud Build to deploy and manage Cloud Run services.
    *   **Service Account User (`roles/iam.serviceAccountUser`):** Allows Cloud Build to act on behalf of the Cloud Run runtime service account.

    You can grant these roles using the `gcloud` CLI:
    ```bash
    PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
    gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
      --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
      --role="roles/run.admin"

    gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
      --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
      --role="roles/iam.serviceAccountUser"
    ```

## Configuration

The deployment process for the batch job requires a JSON configuration file.

1.  **Create `batch-job.json`:**
    In the root of the project, you will find a template file named `batch-job.json.example`. Make a copy of this file and name it `batch-job.json`.

    ```bash
    cp batch-job.json.example batch-job.json
    ```

2.  **Update Configuration:**
    The `cloudbuild.yaml` file is configured to automatically substitute the correct container image URI into the `batch-job.json` file during the build process. You do not need to manually edit the `imageUri` field.

## Cloud Build Trigger Setup

Create a Cloud Build trigger to automatically build and deploy the application when you push changes to your GitHub repository.

1.  **Navigate to Cloud Build:**
    In the GCP Console, go to the "Triggers" section of Cloud Build.

2.  **Create a New Trigger:**
    *   Click **Create trigger**.
    *   **Name:** Give your trigger a descriptive name (e.g., `google-cloud-pulse-deploy`).
    *   **Region:** Select your desired region.
    *   **Event:** Choose **Push to a branch**.
    *   **Source:**
        *   **Repository:** Select your forked GitHub repository. You may need to connect it to Cloud Build first.
        *   **Branch:** Enter the name of the branch you want to deploy from (e.g., `main` or `master`).
    *   **Configuration:**
        *   **Type:** Cloud Build configuration file (yaml or json).
        *   **Location:** Repository.
        *   **Cloud Build file location:** `/cloudbuild.yaml`.
    *   **Advanced > Substitution variables:**
        *   Click **Add variable**.
        *   **Variable:** `_PROJECT_ID`
        *   **Value:** Your Google Cloud Project ID.

3.  **Save the Trigger:**
    Click **Create**.

Now, whenever you push a commit to the specified branch, the Cloud Build trigger will execute the steps in `cloudbuild.yaml`, building the container images, and deploying the services to Cloud Run.
