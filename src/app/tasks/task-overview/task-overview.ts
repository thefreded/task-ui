import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  Signal,
} from '@angular/core';
import { Card } from '../../shared/card/card';
import { Router, ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { TaskModel } from '../task/task-model';
import { DatePipe } from '@angular/common';
import { TaskStore } from '../task-store';

@Component({
  selector: 'app-task-overview',
  imports: [Card, DatePipe, RouterLink],
  templateUrl: './task-overview.html',
  styleUrl: './task-overview.css',
})
export class TaskOverview {
  readonly #routerData = inject(ROUTER_OUTLET_DATA) as Signal<{
    task: Signal<TaskModel>;
  }>;
  readonly #router = inject(Router);
  readonly #taskStore = inject(TaskStore);
  readonly #destroyRef = inject(DestroyRef);

  protected task = computed(() => this.#routerData().task());

  protected onDeleteTask() {
    const shouldDeleteTask = window.confirm(
      `Continue with deleting task, ${this.task().name}?`
    );

    if (shouldDeleteTask) {
      const subscription = this.#taskStore
        .deleteTask(this.task().id)
        .subscribe({
          next: () => {
            this.#router.navigate(['/'], { replaceUrl: true });
          },
          error: (error) => console.error(error),
        });

      this.#destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }
}
