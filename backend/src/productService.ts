import { ProductFeed } from './types';

// This function can be expanded to fetch from a database or a config file.
export async function getProductFeeds(): Promise<ProductFeed[]> {
  return [
    {
      productName: 'Google Cloud Blog',
      rssUrl: 'https://cloud.google.com/feeds/google-cloud-blog.xml',
      releaseNotesUrl: 'https://cloud.google.com/blog/products'
    },
    {
      productName: 'Compute Engine',
      rssUrl: 'https://cloud.google.com/feeds/compute-release-notes.xml',
      releaseNotesUrl: 'https://cloud.google.com/compute/docs/release-notes'
    },
    {
      productName: 'Cloud Storage',
      rssUrl: 'https://cloud.google.com/feeds/storage-release-notes.xml',
      releaseNotesUrl: 'https://cloud.google.com/storage/docs/release-notes'
    },
    // Add other product feeds here
  ];
}