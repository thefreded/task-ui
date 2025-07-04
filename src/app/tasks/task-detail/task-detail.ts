import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TaskStore } from '../task-store';
import { RouterLink, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-task-detail',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  readonly taskId = input.required<string>();
  readonly #taskStore = inject(TaskStore);

  protected isFetching = signal(false);
  protected task = computed(() => this.#taskStore.selectedTask());

  ngOnInit(): void {}

  constructor() {
    effect((onCleanup) => {
      this.isFetching.set(true);

      const subscription = this.#taskStore
        .loadSelectedTask(this.taskId())
        .pipe(finalize(() => this.isFetching.set(false)))
        .subscribe();

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
