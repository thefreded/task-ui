import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { DocumentModel } from './document-model';
import { UploadResponse } from './file-upload/file-upload-model';

@Injectable({
  providedIn: 'root',
})
export class DocumentStore {
  #documents = signal<DocumentModel[]>([]);

  readonly #baseURL = 'http://localhost:8086/api/gateway/document';
  readonly #httpClient = inject(HttpClient);

  get allDocuments() {
    return this.#documents.asReadonly();
  }

  loadDocuments(taskId: string) {
    return this.#httpClient
      .get<DocumentModel[]>(`${this.#baseURL}/task/${taskId}`)
      .pipe(
        tap({
          next: (documents) => this.#documents.set(documents),
          error: (error) => console.error(error),
        })
      );
  }

  uploadDocument(taskId: string, formData: FormData) {
    return this.#httpClient.post<UploadResponse>(
      `${this.#baseURL}/task/${taskId}`,
      formData,
      { reportProgress: true, observe: 'events' }
    );
  }

  getDocumentPreviewUrl(documentId: string) {
    return this.#httpClient
      .get(`${this.#baseURL}/preview/${documentId}`, {
        responseType: 'text',
      })
      .pipe(
        tap({
          error: (error) => console.error(error),
        })
      );
  }

  constructor() {}
}
