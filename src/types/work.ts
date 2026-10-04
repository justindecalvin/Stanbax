export type WorkCategory = 
  | 'Design & Art'
  | 'Code & Engineering'
  | 'Writing & Research'
  | 'Media & Audio'
  | 'Strategy & Slides';

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: WorkCategory;
  tags: string[];
  fileType: string; // e.g. "image/png", "application/pdf", "text/plain", "video/mp4"
  fileName: string;
  fileSize: number; // in bytes
  fileDataUrl?: string; // base64 / blob / text data
  fileContentText?: string; // text content for code/txt/md
  createdAt: string; // ISO date
  updatedAt: string;
  clientOrContext?: string; // e.g., "MIT Thesis", "Freelance", "Acme Corp"
  externalUrl?: string;
  aspectRatio?: string;
  dimensions?: { width: number; height: number };
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    suggestedImprovements: string[];
    presentationTips: string[];
    analyzedAt: string;
  };
  isSample?: boolean;
}

export type ViewMode = 'grid' | 'table' | 'minimal';
