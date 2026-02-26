import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from './core/services';
import { LoadingSpinnerComponent } from './shared/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'student-system';
}
