import { Routes } from '@angular/router';
import { TaskDetail } from './tasks/task-detail/task-detail';
import { resolveTaskName } from './tasks/task-resolvers';
import { NewTask } from './tasks/new-task/new-task';

export const routes: Routes = [
  {
    path: 'task',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'new-task',
    component: NewTask,
  },
  {
    path: 'tasks/:taskId',
    component: TaskDetail,
    title: resolveTaskName,
    loadChildren: () =>
      import('./tasks/tasks.routes').then((mod) => mod.tasksRoutes),
  },
];
