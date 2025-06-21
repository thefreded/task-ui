import { TitleCasePipe } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Component, input, OnInit, output } from '@angular/core';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import {
  FileWithProgress,
  UploadResponse,
  UploadStatus,
} from './file-upload-model';
import { Observable } from 'rxjs';
import { TruncateFileNamePipe } from './truncate-file-name-pipe';
import { FormatFileSizePipe } from './format-file-size-pipe';
import { FileIcon } from './file-icon';

@Component({
  selector: 'app-file-upload',
  imports: [
    NgxDropzoneModule,
    TitleCasePipe,
    TruncateFileNamePipe,
    FormatFileSizePipe,
    FileIcon,
  ],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
})
export class FileUpload {
  readonly allowMultiple = input(false);
  readonly maxFileSize = input(10 * 1024 * 1024); // 10MB default
  readonly uploadObservable =
    input.required<
      (formData: FormData) => Observable<HttpEvent<UploadResponse>>
    >();
  readonly fileUploaded = output<UploadResponse>();
  readonly uploadError = output<string>();
  protected status = UploadStatus;

  acceptedFormats =
    '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.zip,.xlsx,.xls,.ppt,.pptx';
  selectedFile: FileWithProgress | null = null;
  uploading = false;

  onFileSelected(event: NgxDropzoneChangeEvent) {
    if (event.addedFiles && event.addedFiles.length > 0) {
      this.selectedFile = {
        file: event.addedFiles[0],
        progress: 0,
        status: UploadStatus.Pending,
      };
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  clearFile() {
    this.selectedFile = null;
  }

  async uploadFile() {
    if (!this.selectedFile || !this.uploadObservable) return;

    this.uploading = true;

    try {
      const formData = new FormData();
      formData.append('file', this.selectedFile.file);

      const upload$ = this.uploadObservable()(formData);
      await this.uploadSingleFile(this.selectedFile, upload$);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      this.uploading = false;
    }
  }

  private uploadSingleFile(
    fileItem: FileWithProgress,
    uploadObservable: Observable<HttpEvent<UploadResponse>>
  ): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      fileItem.status = UploadStatus.Uploading;
      fileItem.progress = 0;

      uploadObservable.subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            fileItem.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            fileItem.status = UploadStatus.Success;
            fileItem.progress = 100;
            fileItem.response = event.body!;
            this.fileUploaded.emit(event.body!);
            resolve(event.body!);
          }
        },
        error: (error) => {
          fileItem.status = UploadStatus.Error;
          fileItem.error = this.getErrorMessage(error);
          this.uploadError.emit(
            `Failed to upload ${fileItem.file.name}: ${fileItem.error}`
          );
          reject(error);
        },
      });
    });
  }

  formatAcceptedTypes(): string {
    return this.acceptedFormats
      .split(',')
      .map((type) => type.replace('.', '').toUpperCase())
      .join(', ');
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) return error.error.message;
    if (error.message) return error.message;
    return `HTTP ${error.status}: ${error.statusText}`;
  }
}
