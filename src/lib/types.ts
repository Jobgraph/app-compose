export type DocumentType = 'email' | 'letter' | 'report' | 'memo' | 'proposal';
export type Tone = 'professional' | 'friendly' | 'formal' | 'casual';
export type Length = 'short' | 'medium' | 'long';

export interface ComposeRequest {
  brief: string;
  documentType: DocumentType;
  tone: Tone;
  length: Length;
}

export interface ComposeResult {
  documentType: DocumentType;
  tone: Tone;
  length: Length;
  content: string;
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  inputPreview: string;
  request: ComposeRequest;
  result: ComposeResult | null;
  status: 'pending' | 'complete' | 'error';
  errorMessage?: string;
}
