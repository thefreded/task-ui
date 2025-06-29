import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { DocumentStore } from './document-store';
import { ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { TaskModel } from '../tasks/task/task-model';
import { TruncateFileNamePipe } from './file-upload/truncate-file-name-pipe';
import { FileIcon } from './file-upload/file-icon';
import { Card } from '../shared/card/card';

@Component({
  selector: 'app-documents',
  imports: [DatePipe, RouterLink, TruncateFileNamePipe, FileIcon, Card],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {
  readonly #documentStore = inject(DocumentStore);
  readonly #routerData = inject(ROUTER_OUTLET_DATA) as Signal<{
    task: Signal<TaskModel>;
  }>;
  readonly #destroyRef = inject(DestroyRef);
  protected taskId = computed(() => this.#routerData().task().id);
  protected documents = this.#documentStore.allDocuments;

  ngOnInit(): void {
    const subscription = this.#documentStore
      .loadDocuments(this.taskId())
      .subscribe();

    this.#destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onViewDocument(documentId: string) {
    const subscription = this.#documentStore
      .getDocumentPreviewUrl(documentId)
      .subscribe({
        next: (tempUrl) => {
          // Open document in new tab
          window.open(tempUrl, '_blank');
        },
        error: (err) => {
          console.error('Error getting document URL:', err);
        },
      });

    this.#destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onDeleteDocument(documentId: string) {}
}
