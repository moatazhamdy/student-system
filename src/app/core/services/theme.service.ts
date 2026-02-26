import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme-mode';

  // Current theme mode signal
  readonly themeMode = signal<ThemeMode>(this.getStoredTheme());

  // Is dark mode active
  readonly isDark = signal<boolean>(this.calculateIsDark());

  constructor() {
    // Apply theme on initialization
    this.applyTheme();

    // Watch for theme changes and apply them
    effect(() => {
      this.applyTheme();
    });

    // Listen for system theme changes
    this.watchSystemTheme();
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    const current = this.themeMode();
    if (current === 'system') {
      this.setTheme('light');
    } else if (current === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('system');
    }
  }

  /**
   * Set specific theme mode
   */
  setTheme(mode: ThemeMode): void {
    this.themeMode.set(mode);
    localStorage.setItem(this.THEME_STORAGE_KEY, mode);
    this.isDark.set(this.calculateIsDark());
  }

  /**
   * Get current theme mode
   */
  getTheme(): ThemeMode {
    return this.themeMode();
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const html = document.documentElement;
    const isDarkMode = this.calculateIsDark();

    if (isDarkMode) {
      html.classList.add('app-dark');
    } else {
      html.classList.remove('app-dark');
    }

    this.isDark.set(isDarkMode);
  }

  /**
   * Calculate if dark mode should be active
   */
  private calculateIsDark(): boolean {
    const mode = this.themeMode();

    if (mode === 'dark') {
      return true;
    }

    if (mode === 'light') {
      return false;
    }

    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Get stored theme or default to system
   */
  private getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(this.THEME_STORAGE_KEY) as ThemeMode;
    return stored || 'system';
  }

  /**
   * Watch for system theme changes
   */
  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      if (this.themeMode() === 'system') {
        this.isDark.set(e.matches);
        this.applyTheme();
      }
    });
  }
}
