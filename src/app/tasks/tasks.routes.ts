import { Routes } from '@angular/router';
import { TaskOverview } from './task-overview/task-overview';
import { EditTask } from './edit-task/edit-task';
import { resolveSelectedTask } from './task-resolvers';

export const tasksRoutes: Routes = [
  {
    path: '',
    component: TaskOverview,
  },

  {
    path: 'edit-task',
    component: EditTask,
    resolve: {
      task: resolveSelectedTask,
    },
  },
];
