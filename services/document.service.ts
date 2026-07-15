import { api } from "./api";
import type { UserDocument, UploadDocumentRequest } from "@/types/document";

class DocumentService {
  async list(): Promise<UserDocument[]> {
    const response = await api.get<UserDocument[]>("/users/me/documents");
    return response.data;
  }

  async upload(data: UploadDocumentRequest): Promise<UserDocument> {
    const response = await api.post<UserDocument>("/users/me/documents", data);
    return response.data;
  }
}

export const documentService = new DocumentService();