import { inject, Injectable, signal } from '@angular/core';
import { TaskModel } from './task/task-model';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, tap } from 'rxjs';
import { TaskInputData } from '../shared/task-form/task-input-model';

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

  deleteTask(taskId: string) {
    return this.#httpClient
      .delete(`${this.#baseURL}/${taskId}`, { responseType: 'text' })
      .pipe(
        concatMap((deletedTaskId) => {
          return this.fetchAllTasks().pipe(map(() => deletedTaskId));
        })
      );
  }
}
