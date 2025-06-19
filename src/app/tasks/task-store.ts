import { inject, Injectable, signal } from '@angular/core';
import { TaskModel } from './task/task-model';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, tap } from 'rxjs';
import { TaskInputData } from '../shared/task-form/task-input-model';

const TEST_TASK = [
  {
    id: '1bd6c5ce-3b9d-4136-8981-8f2aa5afc77e',
    name: 'Task 3 Tahirweu sundaydg 4',
    description: 'Updated Hello,fd this is a tesiing witffh Tahiru Test Task',
    createdAt: '2025-06-15T11:05:22.426233',
    updatedAt: '2025-06-15T11:05:22.426233',
    createdBy: 'user',
  },
  {
    id: '21492985-399d-45dc-8d6e-7338d5ac902f',
    name: 'Task 3 Tgfgahirweu sundaydg 4',
    description: 'Updated Hello,fd this is a tesiing witffh Tahiru Test Task',
    createdAt: '2025-06-15T12:03:12.456295',
    updatedAt: '2025-06-15T12:03:12.456295',
    createdBy: 'user',
  },
  {
    id: '901c5297-a952-40c4-9f5c-01e6e88901cc',
    name: 'Task 4 Tgdffgahirweu sundaydg 4',
    description: 'Updated Hello,fd this is a tesiing witffh Tahiru Test Task',
    createdAt: '2025-06-15T12:03:20.617449',
    updatedAt: '2025-06-15T12:03:20.617449',
    createdBy: 'user',
  },
];
@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  #tasks = signal<TaskModel[]>([]);
  #selectedTask = signal<TaskModel | null>(null);

  readonly #baseURL = 'http://localhost:8086/api/gateway/tasks';
  readonly #httpClient = inject(HttpClient);

  get allTask() {
    return this.#tasks.asReadonly();
  }

  get selectedTask() {
    return this.#selectedTask.asReadonly();
  }

  constructor() {
    // just for learning purpose ->  to open up discussion about data resolve and data outlet
    this.fetchAllTasks().subscribe();
  }

  fetchAllTasks() {
    return this.#httpClient.get<TaskModel[]>(`${this.#baseURL}?limit=100`).pipe(
      tap({
        next: (tasks) => this.#tasks.set(tasks),
        error: (error) => console.error(error),
      })
    );
  }

  // used by resolver -> open up discussion
  getTask(taskId: string) {
    return this.#tasks().find((task) => task.id === taskId);
  }

  loadSelectedTask(taskId: string) {
    return this.#httpClient.get<TaskModel>(`${this.#baseURL}/${taskId}`).pipe(
      tap({
        next: (task) => this.#selectedTask.set(task),
        error: (error) => console.error(error),
      })
    );
  }

  addNewTask(taskInputData: TaskInputData) {
    return this.#httpClient
      .post<TaskModel>(this.#baseURL, taskInputData)
      .pipe(
        concatMap((newTask) => this.fetchAllTasks().pipe(map(() => newTask)))
      );
  }

  updateTask(taskData: TaskModel) {
    return this.#httpClient
      .put<TaskModel>(`${this.#baseURL}/${taskData.id}`, taskData)
      .pipe(
        concatMap((updatedTask) => {
          this.#selectedTask.set(updatedTask);
          return this.fetchAllTasks().pipe(map(() => updatedTask));
        })
      );
  }
}
