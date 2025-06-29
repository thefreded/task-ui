import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
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
export class EditTask implements OnInit {
  readonly task = input.required<TaskModel>();
  readonly #taskStore = inject(TaskStore);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);
  protected initialTaskInput = signal<TaskInputData>({
    name: '',
    description: '',
  });

  ngOnInit(): void {
    const task = this.task();
    this.initialTaskInput.set({
      name: task.name,
      description: task.description,
    });
  }

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
