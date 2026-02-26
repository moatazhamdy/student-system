import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'student-system';
}
