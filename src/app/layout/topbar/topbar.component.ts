import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { MenuItem } from 'primeng/api';
import { AuthStore } from '../../core/store/auth.store';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    BadgeModule,
    MenuModule,
    DialogModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  toggleSidebar = output<void>();
  readonly authStore = inject(AuthStore);
  showLogoutDialog = signal(false);

  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      disabled: true,
      command: () => {
        // Navigate to profile
      },
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      disabled: true,
      command: () => {
        // Navigate to settings
      },
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.showLogoutDialog.set(true);
      },
    },
  ];

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  async confirmLogout() {
    this.showLogoutDialog.set(false);
    await this.authStore.logout();
  }

  cancelLogout() {
    this.showLogoutDialog.set(false);
  }
}
