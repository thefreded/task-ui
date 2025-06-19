import { Component, inject } from '@angular/core';
import { TaskStore } from './task-store';
import { Task } from './task/task';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [Task],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  #taskStore = inject(TaskStore);

  protected tasks = this.#taskStore.allTask;
}
