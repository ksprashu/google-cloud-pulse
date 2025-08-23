const productSlugMap: Record<string, string> = {
  'BigQuery': 'bigquery',
  'Compute Engine': 'compute',
  'Cloud Storage': 'storage',
  'Google Kubernetes Engine': 'kubernetes-engine',
  'Cloud Functions': 'functions',
  'Cloud Run': 'run',
  'Cloud SQL': 'sql',
  'IAM': 'iam',
  'Virtual Private Cloud': 'vpc',
  'Cloud Logging': 'logging',
  'Cloud Monitoring': 'monitoring',
  'Apigee': 'apigee',
  'Vertex AI': 'vertex-ai',
};

export function generateProductLink(productName: string): string {
  const slug = productSlugMap[productName];
  if (slug) {
    return `https://cloud.google.com/${slug}/docs/release-notes`;
  }
  // Fallback to a search on the release notes page
  const query = encodeURIComponent(`${productName} release notes`);
  return `https://cloud.google.com/release-notes/all?q=${query}`;
}
