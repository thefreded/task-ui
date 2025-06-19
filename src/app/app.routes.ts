import { Routes } from '@angular/router';
import { tasksRoutes } from './tasks/tasks.routes';
import { TaskDetail } from './tasks/task-detail/task-detail';
import { resolveTaskName } from './tasks/task-resolvers';

export const routes: Routes = [
  {
    path: 'task',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'tasks/:taskId',
    component: TaskDetail,
    title: resolveTaskName,
    children: tasksRoutes,
  },
];
