export type DocumentType = 'LICENSE' | 'CERTIFICATE' | 'GOVERNMENT_ID';

export interface UserDocument {
  id: string;
  type: DocumentType;
  url: string;
  verifiedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
}

export interface UploadDocumentRequest {
  type: DocumentType;
  url: string;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  LICENSE: 'Professional License',
  CERTIFICATE: 'Training Certificate',
  GOVERNMENT_ID: 'Government ID',
};

export const DOCUMENT_TYPES: DocumentType[] = ['LICENSE', 'CERTIFICATE', 'GOVERNMENT_ID'];