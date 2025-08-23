import type { Product } from '../types';

const PRODUCTS_URL = 'https://cloud.google.com/products?hl=en';

export async function getProducts(): Promise<Omit<Product, 'notes' | 'lastUpdated' | 'isRecent'>[]> {
  // Since we can't use a real scraping library in this environment,
  // we'll fetch the HTML and use the browser's DOMParser.
  // This is more brittle than a proper scraper but will work for this case.

  // We'll use a proxy to get around CORS issues when fetching the page.
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(PRODUCTS_URL)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch the Google Cloud products page. Status: ${response.status}`);
    }
    const data = await response.json();
    const html = data.contents;

    if (!html) {
        throw new Error("Could not extract HTML content from the proxy response.");
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const products: Omit<Product, 'notes' | 'lastUpdated' | 'isRecent'>[] = [];

    const categoryContainers = doc.querySelectorAll('.cloud-products-grid__category-container');

    categoryContainers.forEach(container => {
      const categoryTitleElement = container.querySelector('.cloud-products-grid__category-title');
      const category = categoryTitleElement?.textContent?.trim() || 'Uncategorized';

      const productCards = container.querySelectorAll('a.cloud-product-card');

      productCards.forEach(card => {
        const productNameElement = card.querySelector('.cloud-product-card__title');
        const productName = productNameElement?.textContent?.trim();

        const iconElement = card.querySelector('img');
        const iconUrl = iconElement ? new URL(iconElement.src, PRODUCTS_URL).href : '';

        if (productName) {
          products.push({
            productName,
            category,
            iconUrl,
          });
        }
      });
    });

    return products;

  } catch (error) {
    console.error("Error fetching or parsing product data:", error);
    // In case of an error, we can return an empty array or re-throw.
    // For this app, returning an empty array is safer to prevent a crash.
    return [];
  }
}
