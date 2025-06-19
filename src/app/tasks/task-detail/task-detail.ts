import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { TaskStore } from '../task-store';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TruncatePipe } from '../truncate-pipe';

@Component({
  selector: 'app-task-detail',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  readonly taskId = input.required<string>();

  #taskStore = inject(TaskStore);
  #destroyRef = inject(DestroyRef);

  protected task = computed(() => this.#taskStore.selectedTask());

  ngOnInit(): void {}

  constructor() {
    effect((onCleanup) => {
      const subscription = this.#taskStore
        .loadSelectedTask(this.taskId())
        .subscribe();

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
