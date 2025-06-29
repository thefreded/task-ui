import { Component, computed, inject, Signal } from '@angular/core';
import { FileUpload } from '../file-upload/file-upload';
import { TaskModel } from '../../tasks/task/task-model';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { UploadResponse } from '../file-upload/file-upload-model';
import { DocumentStore } from '../document-store';

@Component({
  selector: 'app-new-document',
  imports: [FileUpload],
  templateUrl: './new-document.html',
  styleUrl: './new-document.css',
})
export class NewDocument {
  readonly #documentStore = inject(DocumentStore);
  readonly #routerData = inject(ROUTER_OUTLET_DATA) as Signal<{
    task: Signal<TaskModel>;
  }>;

  protected taskId = computed(() => this.#routerData().task().id);

  protected uploadFileObservable = (formData: FormData) =>
    this.#documentStore.uploadDocument(this.taskId(), formData);

  protected onFileUploaded(response: UploadResponse) {
    console.log('Document uploaded successfully');
  }

  protected onUploadError(error: string) {
    console.log(error);
  }
}
