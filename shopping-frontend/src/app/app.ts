import { Component } from '@angular/core';
import { Create } from './features/create/create';
import { Show } from './features/show/show';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Create, Show],
  templateUrl: './app.html',
})
export class App {}