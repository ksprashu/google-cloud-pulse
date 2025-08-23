import { GoogleGenAI, Type } from "@google/genai";
import cheerio from 'cheerio';
import type { RawReleaseNote, ProcessedNote, AnalyzedNoteData } from './types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RSS_FEED_URL = 'https://cloud.google.com/feeds/gcp-release-notes.xml';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
      productName: {
        type: Type.STRING,
        description: "The official name of the Google Cloud product (e.g., 'Compute Engine', 'Cloud Storage', 'BigQuery'). If multiple products are mentioned, pick the most prominent one.",
      },
      changeType: {
        type: Type.STRING,
        description: "The primary nature of the update. Classify as one of: 'Feature', 'Security', 'Bug Fix', 'Improvement', 'Documentation', 'Deprecation', 'Announcement'.",
      },
      releaseStage: {
        type: Type.STRING,
        description: "The product launch stage, if mentioned. Classify as one of: 'General Availability', 'Preview', 'Beta', 'Alpha', 'Early Access'. If not mentioned or not applicable, return 'N/A'.",
      },
      summary: {
        type: Type.STRING,
        description: "A very concise summary of the update, limited to about 10-15 words.",
      }
    },
    required: ["productName", "changeType", "releaseStage", "summary"],
  };

async function analyzeReleaseNote(title: string, summary: string): Promise<AnalyzedNoteData> {
    try {
      const prompt = `
        Analyze the following GCP release note content and extract the required information in JSON format.
        The product name should be the specific service, not just "Google Cloud".
        For 'releaseStage', use the official launch stage if specified.
        Create a concise summary of the update in about 10-15 words.

        Title: "${title}"
        Summary: "${summary}"
      `;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const jsonText = result.text || "";
      const data = JSON.parse(jsonText);
 
      return {
          productName: data.productName || 'Unknown Product',
          changeType: data.changeType || 'Update',
          releaseStage: data.releaseStage || 'N/A',
          summary: data.summary || 'No summary available.',
      };

    } catch (error) {
      console.error("Error analyzing release note with Gemini:", error);
      // Fallback in case of API error
      return {
        productName: title.split(':')[0] || 'Unknown Product',
        changeType: 'Update',
        releaseStage: 'N/A',
        summary: title,
      };
    }
  }

async function parseRssFeed(): Promise<RawReleaseNote[]> {
    const response = await fetch(RSS_FEED_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const $ = cheerio.load(xmlText, { xmlMode: true });

    const items: RawReleaseNote[] = [];
    $('entry').each((i, elem) => {
      items.push({
        id: $(elem).find('id').text(),
        title: $(elem).find('title').text(),
        summary: $(elem).find('content').text(),
        updated: $(elem).find('updated').text(),
      });
    });
    return items;
  }

export async function getAndProcessReleaseNotes(): Promise<ProcessedNote[]> {
    const rawNotes = await parseRssFeed();

    const notesToProcess = rawNotes.slice(0, 50);

    const processingPromises = notesToProcess.map(async (note) => {
      const cleanSummary = cheerio.load(note.summary).text();

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
