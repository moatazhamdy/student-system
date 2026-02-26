import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'app_language';

  public currentLanguage = signal<string>(environment.defaultLanguage);
  public isRTL = signal<boolean>(false);

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLanguage = this.getStoredLanguage();
    const languageToUse = savedLanguage || environment.defaultLanguage;

    this.translate.setDefaultLang(environment.defaultLanguage);
    this.translate.addLangs(environment.supportedLanguages);
    this.setLanguage(languageToUse);
  }

  setLanguage(language: string): void {
    if (!environment.supportedLanguages.includes(language)) {
      language = environment.defaultLanguage;
    }

    this.translate.use(language);
    this.currentLanguage.set(language);
    this.isRTL.set(language === 'ar');

    this.updateDocumentLanguage(language);
    this.updateDocumentDirection();
    this.storeLanguage(language);
  }

  toggleLanguage(): void {
    const currentLang = this.currentLanguage();
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  private updateDocumentLanguage(language: string): void {
    document.documentElement.lang = language;
  }

  private updateDocumentDirection(): void {
    const direction = this.isRTL() ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }

  private storeLanguage(language: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, language);
    } catch (error) {
      // Failed to store language preference
    }
  }

  private getStoredLanguage(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      // Failed to retrieve language preference
      return null;
    }
  }

  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  get(key: string, params?: any) {
    return this.translate.get(key, params);
  }
}
