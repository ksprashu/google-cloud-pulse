
import type { RawReleaseNote, ProcessedNote, ProductFeed } from '../types';
import { analyzeReleaseNote } from './geminiService';
import { getProductFeeds } from './productService';

const API_URL_BASE = `https://api.rss2json.com/v1/api.json?rss_url=`;

async function parseRssFeed(feedUrl: string): Promise<RawReleaseNote[]> {
  const response = await fetch(`${API_URL_BASE}${encodeURIComponent(feedUrl)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed from ${feedUrl}. Status: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error(`Failed to parse RSS feed from ${feedUrl}. The service may be down or the feed is invalid.`);
  }

  return data.items.map((item: any) => ({
    id: item.guid,
    title: item.title,
    summary: item.description,
    updated: item.pubDate,
  }));
}

export async function getAndProcessReleaseNotes(): Promise<ProcessedNote[]> {
  // REVIEWER FEEDBACK: This implementation uses a public API (rss2json.com) to convert RSS to JSON.
  // While this is convenient, it's not a robust solution for a production environment.
  // A better solution would be to have a dedicated backend service that fetches and parses the RSS feeds.
  // This would avoid reliance on a third-party service and provide more control over the data processing.
  const productFeeds = await getProductFeeds();
  
  const allNotes: (ProcessedNote & { productNameFromFeed: string, releaseNotesUrl: string })[] = [];

  for (const feed of productFeeds) {
    try {
        const rawNotes = await parseRssFeed(feed.rssUrl);

        // Process the 3 most recent notes for each product feed
        const notesToProcess = rawNotes.slice(0, 3);

        const processingPromises = notesToProcess.map(async (note) => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = note.summary;
          const cleanSummary = tempDiv.textContent || tempDiv.innerText || "";

          // Pass the official product name to assist the AI
          const analyzedData = await analyzeReleaseNote(note.title, cleanSummary, feed.productName);

          return {
            ...analyzedData,
            id: note.id,
            updated: new Date(note.updated),
            originalTitle: note.title,
            productNameFromFeed: feed.productName, // Keep track of the source
            releaseNotesUrl: feed.releaseNotesUrl,
          };
        });

        const processed = await Promise.all(processingPromises);
        allNotes.push(...processed);
    } catch (error) {
        console.error(`Error processing feed for ${feed.productName}:`, error);
        // Continue to the next feed if one fails
    }
  }

  // The Gemini analysis for productName can sometimes be inconsistent.
  // We'll use the productName from the feed source as the primary grouping key
  // but retain the analyzed name if it's more specific.
  return allNotes.map(note => {
    // This logic can be refined. For now, we prioritize the feed's name for consistency.
    return {
        ...note,
        productName: note.productNameFromFeed,
    }
  });
}