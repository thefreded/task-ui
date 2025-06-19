import { Component, DestroyRef, inject } from '@angular/core';
import { TaskForm } from '../../shared/task-form/task-form';
import { TaskInputData } from '../../shared/task-form/task-input-model';
import { TaskStore } from '../task-store';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-new-task',
  imports: [TaskForm],
  templateUrl: './new-task.html',
  styleUrl: './new-task.css',
})
export class NewTask {
  #taskStore = inject(TaskStore);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  protected onSubmit(taskInputData: TaskInputData) {
    const subscription = this.#taskStore.addNewTask(taskInputData).subscribe({
      next: (newTask) => {
        this.#router.navigate(['tasks', newTask.id]);
      },
    });

    this.#destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
