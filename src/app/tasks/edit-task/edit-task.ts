import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { TaskForm } from '../../shared/task-form/task-form';
import { TaskModel } from '../task/task-model';
import { TaskInputData } from '../../shared/task-form/task-input-model';
import { TaskStore } from '../task-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  imports: [TaskForm],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css',
})
export class EditTask {
  readonly task = input.required<TaskModel>();
  readonly #taskStore = inject(TaskStore);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);

  protected initialTaskInput = computed(() => {
    const task = this.task();

    return {
      name: task.name,
      description: task.description,
    };
  });

  protected onSubmit(taskInputData: TaskInputData) {
    const updatedTask = {
      ...this.task(),
      name: taskInputData.name ?? '',
      description: taskInputData.description ?? '',
    };

    const subscription = this.#taskStore.updateTask(updatedTask).subscribe({
      next: (task) => {
        this.#router.navigate(['tasks', task.id]);
      },
    });

    this.#destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
