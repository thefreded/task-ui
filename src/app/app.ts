import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Tasks } from './tasks/tasks';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Tasks],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
