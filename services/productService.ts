import type { ProductFeed } from '../types';

const ALL_PRODUCTS_URL = 'https://cloud.google.com/release-notes/all';
// A simple CORS proxy to fetch the HTML content.
// In a real-world scenario, this should be a more robust and secure solution.
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

// This is a simplified and potentially fragile parser.
// A more robust solution would use a proper HTML parsing library (e.g., cheerio on a server-side component).
function parseProductList(htmlContent: string): Omit<ProductFeed, 'rssUrl' | 'id'>[] {
    const productFeeds: Omit<ProductFeed, 'rssUrl' | 'id'>[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Based on the structure of the "release-notes/all" page, the links are in 'div' elements
    // inside a specific container. This might need adjustment if the site structure changes.
    const links = Array.from(doc.querySelectorAll('.c-grid__item a'));

    for (const link of links) {
        const href = link.getAttribute('href');
        const productName = link.textContent?.trim();

        if (productName && href && href.includes('/release-notes')) {
             // Avoid duplicates
            if (productFeeds.some(p => p.productName === productName)) continue;

            productFeeds.push({
                productName,
                releaseNotesUrl: `https://cloud.google.com${href}`,
            });
        }
    }

    return productFeeds;
}

function deriveRssFeedUrl(releaseNotesUrl: string): string | null {
    // Example: https://cloud.google.com/alloydb/docs/release-notes -> alloydb
    const match = releaseNotesUrl.match(/https:\/\/cloud\.google\.com\/(.*?)\/docs\/release-notes/);
    if (match && match[1]) {
        // Handle cases like 'kubernetes-engine/multi-cloud/docs/attached/aks'
        const productId = match[1].replace(/\/docs\/.*$/, '').replace(/\//g, '-');
        return `https://cloud.google.com/feeds/${productId}-release-notes.xml`;
    }
    return null;
}

export async function getProductFeeds(): Promise<ProductFeed[]> {
    try {
        const response = await fetch(`${PROXY_URL}${ALL_PRODUCTS_URL}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product list: ${response.statusText}`);
        }
        const html = await response.text();
        const rawProductList = parseProductList(html);

        const productFeeds: ProductFeed[] = [];

        for (const product of rawProductList) {
            const rssUrl = deriveRssFeedUrl(product.releaseNotesUrl);
            if (rssUrl) {
                productFeeds.push({
                    ...product,
                    id: product.productName.replace(/\s+/g, '-').toLowerCase(),
                    rssUrl,
                });
            }
        }

        // Let's add the main feed as a fallback/addition
        productFeeds.unshift({
            id: 'google-cloud-platform',
            productName: 'Google Cloud Platform',
            releaseNotesUrl: 'https://cloud.google.com/release-notes',
            rssUrl: 'https://cloud.google.com/feeds/gcp-release-notes.xml',
        });

        return productFeeds;

    } catch (error) {
        console.error("Error fetching or parsing product feeds:", error);
        // Fallback to just the main feed if scraping fails
        return [{
            id: 'google-cloud-platform',
            productName: 'Google Cloud Platform',
            releaseNotesUrl: 'https://cloud.google.com/release-notes',
            rssUrl: 'https://cloud.google.com/feeds/gcp-release-notes.xml',
        }];
    }
}
