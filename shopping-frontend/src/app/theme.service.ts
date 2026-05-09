import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') {
      this.enableDarkMode();
    }
  }

  toggleTheme(): void {
    this.darkMode ? this.disableDarkMode() : this.enableDarkMode();
  }

  enableDarkMode(): void {
    this.darkMode = true;

    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }

  disableDarkMode(): void {
    this.darkMode = false;

    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}