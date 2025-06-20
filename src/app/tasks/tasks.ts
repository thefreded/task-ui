import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskStore } from './task-store';
import { Task } from './task/task';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tasks',
  imports: [Task],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  #taskStore = inject(TaskStore);

  protected tasks = this.#taskStore.allTask;
  protected isFetching = signal(false);

  ngOnInit(): void {
    this.isFetching.set(true);
    this.#taskStore
      .fetchAllTasks()
      .pipe(finalize(() => this.isFetching.set(false)))
      .subscribe();
  }
}
