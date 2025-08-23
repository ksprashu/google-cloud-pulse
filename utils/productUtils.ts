export function generateProductLink(productName: string): string {
  // Generate a slug by lowercasing and replacing spaces with hyphens.
  const slug = productName.toLowerCase().replace(/\s+/g, '-');

  // A few products have special names or don't follow the pattern,
  // we can add exceptions here if needed.
  // For now, this dynamic approach is better than a hardcoded map.

  // Most product pages are at cloud.google.com/<slug>
  // and release notes are often under /docs/release-notes
  // We will link to the main product page as a safer default.
  return `https://cloud.google.com/${slug}`;
}
