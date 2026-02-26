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
  private translationService = inject(TranslationService);
  title = 'student-system';

  ngOnInit(): void {
    // Translation service is already initialized in its constructor
    // This ensures the correct language and direction are set on app load
  }
}
