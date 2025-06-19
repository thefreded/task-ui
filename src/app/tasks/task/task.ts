import { Component, input } from '@angular/core';
import { TaskModel } from './task-model';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../truncate-pipe';

@Component({
  selector: 'app-task',
  imports: [RouterLink, TruncatePipe],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  readonly task = input.required<TaskModel>();
}
