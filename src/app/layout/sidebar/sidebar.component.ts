import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslationService } from '@core/services';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  translationKey: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule, ButtonModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private translationService = inject(TranslationService);

  collapsed = input<boolean>(false);

  currentLanguage = this.translationService.currentLanguage;
  isRTL = this.translationService.isRTL;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
      translationKey: 'menu.dashboard',
    },
    {
      label: 'Students',
      icon: 'pi pi-users',
      route: '/students',
      translationKey: 'menu.students',
    },
    {
      label: 'Courses',
      icon: 'pi pi-book',
      route: '/courses',
      translationKey: 'menu.courses',
    },
    {
      label: 'Instructors',
      icon: 'pi pi-user',
      route: '/instructors',
      translationKey: 'menu.instructors',
    },
  ];

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }
}
