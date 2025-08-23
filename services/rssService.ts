
import type { RawReleaseNote, ProcessedNote } from '../types';
import { analyzeReleaseNote } from './geminiService';

const RSS_FEED_URL = 'https://cloud.google.com/feeds/gcp-release-notes.xml';
// Using rss2json to convert RSS to JSON and bypass CORS issues, which is more reliable than a generic proxy.
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}`;

async function parseRssFeed(): Promise<RawReleaseNote[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
  }
  
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error('Failed to parse RSS feed via API. The service may be down.');
  }

  // The rss2json API returns a JSON object with an `items` array
  return data.items.map((item: any) => ({
    id: item.guid, // guid is a unique identifier for the entry
    title: item.title,
    summary: item.description, // description contains the HTML content
    updated: item.pubDate, // pubDate is the publication date string
  }));
}

export async function getAndProcessReleaseNotes(): Promise<ProcessedNote[]> {
  const rawNotes = await parseRssFeed();
  
  // To avoid overwhelming the API, let's process a limited number of recent notes.
  // This can be adjusted.
  const notesToProcess = rawNotes.slice(0, 50);

  const processingPromises = notesToProcess.map(async (note) => {
    // The summary can contain HTML, let's strip it for a cleaner prompt.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.summary;
    const cleanSummary = tempDiv.textContent || tempDiv.innerText || "";

    const analyzedData = await analyzeReleaseNote(note.title, cleanSummary);
    return {
      ...analyzedData,
      id: note.id,
      updated: new Date(note.updated),
      originalTitle: note.title,
    };
  });

  return Promise.all(processingPromises);
}