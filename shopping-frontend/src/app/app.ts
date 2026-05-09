import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  constructor(public themeService: ThemeService) { }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}