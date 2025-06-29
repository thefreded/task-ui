import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { TaskStore } from './task-store';
import { TaskModel } from './task/task-model';

const isTaskModel = (obj: any): obj is TaskModel => {
  return obj && typeof obj === 'object' && 'name' in obj;
};

export const resolveSelectedTask: ResolveFn<TaskModel | undefined> = (
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  const taskStore = inject(TaskStore);
  let taskId: string | null | undefined = activatedRoute.paramMap.get('taskId');

  if (!taskId) {
    // check for parent
    taskId = activatedRoute.root.firstChild?.paramMap.get('taskId');
  }

  return taskStore.getTask(taskId!);
};

export const resolveTaskName: ResolveFn<string> = (
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  const task = resolveSelectedTask(activatedRoute, routerState);

  if (isTaskModel(task)) {
    return task.name;
  }

  return '';
};
