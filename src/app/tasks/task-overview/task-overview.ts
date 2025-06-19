import { Component, computed, inject, input, Signal } from '@angular/core';
import { Card } from '../../shared/card/card';
import { ROUTER_OUTLET_DATA, RouterLink } from '@angular/router';
import { TaskModel } from '../task/task-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-overview',
  imports: [Card, DatePipe, RouterLink],
  templateUrl: './task-overview.html',
  styleUrl: './task-overview.css',
})
export class TaskOverview {
  #data = inject(ROUTER_OUTLET_DATA) as Signal<{ task: Signal<TaskModel> }>;

  protected task = computed(() => this.#data().task());
}
