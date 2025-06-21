export interface UploadResponse {
  id: string;
  filename: string;
  size: number;
  url?: string;
  message?: string;
}

export interface FileWithProgress {
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  response?: UploadResponse;
}

export enum UploadStatus {
  Pending = 'pending',
  Uploading = 'uploading',
  Success = 'success',
  Error = 'error',
}

export interface StatusItem {
  icon: string;
  cssClass: string;
}
