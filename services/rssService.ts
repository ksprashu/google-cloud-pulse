
import type { RawReleaseNote, ProcessedNote, ProductFeed } from '../types';
import { analyzeReleaseNote } from './geminiService';
import { getProductFeeds } from './productService';

const API_URL_BASE = `https://api.rss2json.com/v1/api.json?rss_url=`;

async function parseRssFeed(feedUrl: string): Promise<RawReleaseNote[]> {
  const response = await fetch(`${API_URL_BASE}${encodeURIComponent(feedUrl)}`);
  if (!response.ok) {
    // Fail silently for individual feed errors
    console.warn(`Failed to fetch RSS feed: ${feedUrl}`);
    return [];
  }
  
  const data = await response.json();
  if (data.status !== 'ok') {
    console.warn(`Failed to parse RSS feed via API for ${feedUrl}. The service may be down or the feed is invalid.`);
    return [];
  }

  return data.items.map((item: any) => ({
    id: item.guid,
    title: item.title,
    summary: item.description,
    updated: item.pubDate,
  }));
}

export async function getAndProcessReleaseNotes(): Promise<ProcessedNote[]> {
  const productFeeds = await getProductFeeds();
  
  const allNotes: (ProcessedNote & { productNameFromFeed: string, releaseNotesUrl: string })[] = [];

  for (const feed of productFeeds) {
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