
export interface RawReleaseNote {
  id: string;
  title: string;
  summary: string;
  updated: string;
}

export interface AnalyzedNoteData {
  productName: string;
  changeType: string;
  releaseStage: string;
  summary: string;
}

export interface ProcessedNote extends AnalyzedNoteData {
  id: string;
  updated: Date;
  originalTitle: string;
}

export interface Product {
  productName: string;
<<<<<<< HEAD
  export interface RawReleaseNote {
  id: string;
  title: string;
  summary: string;
  updated: string;
}

export interface AnalyzedNoteData {
  productName: string;
  changeType: string;
  releaseStage: string;
  summary: string;
}

export interface ProcessedNote extends AnalyzedNoteData {
  id: string;
  updated: Date;
  originalTitle: string;
}

export interface Product {
  productName: string;
  notes: ProcessedNote[];
  lastUpdated: Date;
  isRecent: boolean;
  releaseNotesUrl?: string;
}

export interface ProductFeed {
  id: string;
  productName: string;
  releaseNotesUrl: string;
  rssUrl: string;
}
=======
  notes?: ProcessedNote[];
  lastUpdated?: Date;
  isRecent?: boolean;
  category: string;
  iconUrl: string;
>>>>>>> origin/main
}