import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '@core/services';
import { AuthStore } from '@core/store/auth.store';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { FloatLabel } from 'primeng/floatlabel';
import {
  PageHeaderComponent,
  EmptyStateComponent,
  ConfirmationDialogComponent,
} from '@shared/components';
import { InstructorsStore } from '../../store/instructors.store.clean';
import {
  Instructor,
  CreateInstructorDto,
  UpdateInstructorDto,
} from '../../models/instructor.model';

@Component({
  selector: 'app-instructor-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    TooltipModule,
    ChipModule,
    DialogModule,
    SelectModule,
    MultiSelectModule,
    CalendarModule,
    ChipsModule,
    FloatLabel,
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorListComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private translationService = inject(TranslationService);
  readonly store = inject(InstructorsStore);
  readonly authStore = inject(AuthStore);

  searchText = signal('');
  showDeleteDialog = signal(false);
  showAddDialog = signal(false);
  showEditDialog = signal(false);
  showViewDialog = signal(false);
  instructorToDelete = signal<Instructor | null>(null);
  selectedInstructor = signal<Instructor | null>(null);

  // Filtered instructors based on search
  filteredInstructors = computed(() => {
    const search = this.searchText().toLowerCase();
    const allInstructors = this.store.instructors();
    if (!search) return allInstructors;

    return allInstructors.filter(
      (i) =>
        i.firstName.toLowerCase().includes(search) ||
        i.lastName.toLowerCase().includes(search) ||
        i.email.toLowerCase().includes(search) ||
        (i.specialization && i.specialization.toLowerCase().includes(search)),
    );
  });

  instructorForm!: FormGroup;

  specializationOptions = computed(() => {
    // Force recompute when language changes
    const lang = this.translationService.currentLanguage();
    this.translate.use(lang);

    return [
      {
        label: this.translate.instant('subjects.mathematics'),
        value: 'Mathematics',
      },
      { label: this.translate.instant('subjects.physics'), value: 'Physics' },
      {
        label: this.translate.instant('subjects.chemistry'),
        value: 'Chemistry',
      },
      { label: this.translate.instant('subjects.biology'), value: 'Biology' },
      {
        label: this.translate.instant('subjects.computerScience'),
        value: 'Computer Science',
      },
      {
        label: this.translate.instant('subjects.englishLiterature'),
        value: 'English Literature',
      },
      { label: this.translate.instant('subjects.history'), value: 'History' },
      {
        label: this.translate.instant('subjects.geography'),
        value: 'Geography',
      },
      {
        label: this.translate.instant('subjects.economics'),
        value: 'Economics',
      },
      {
        label: this.translate.instant('subjects.businessStudies'),
        value: 'Business Studies',
      },
      {
        label: this.translate.instant('subjects.artDesign'),
        value: 'Art & Design',
      },
      { label: this.translate.instant('subjects.music'), value: 'Music' },
      {
        label: this.translate.instant('subjects.physicalEducation'),
        value: 'Physical Education',
      },
      {
        label: this.translate.instant('subjects.foreignLanguages'),
        value: 'Foreign Languages',
      },
    ];
  });

  ngOnInit(): void {
    // Load only instructors data for this page
    this.store.loadAll();

    this.initForm();
  }

  initForm(): void {
    this.instructorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      specialization: [null, Validators.required],
      rating: [
        4.5,
        [Validators.required, Validators.min(0), Validators.max(5)],
      ],
      hireDate: [null, Validators.required],
    });
  }


  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  onAddInstructor(): void {
    this.instructorForm.reset({
      specialization: null,
      hireDate: new Date(),
    });
    this.showAddDialog.set(true);
  }

  onEditInstructor(instructor: Instructor): void {
    this.selectedInstructor.set(instructor);
    this.instructorForm.patchValue({
      ...instructor,
      hireDate: new Date(instructor.hireDate),
    });
    this.showEditDialog.set(true);
  }

  onViewInstructor(instructor: Instructor): void {
    this.selectedInstructor.set(instructor);
    this.showViewDialog.set(true);
  }

  saveInstructor(): void {
    if (this.instructorForm.invalid) {
      this.instructorForm.markAllAsTouched();
      return;
    }

    const formValue = this.instructorForm.value;
    const instructorData: CreateInstructorDto = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      specialization: formValue.specialization || '',
      rating: formValue.rating || 4.5,
      hireDate: formValue.hireDate,
    };

    // Close dialog immediately
    this.showAddDialog.set(false);
    this.instructorForm.reset({ rating: 4.5 });

    // Save to backend - store updates automatically
    this.store.create(instructorData).catch((error) => {
      // Error handled by store
    });
  }

  updateInstructor(): void {
    if (this.instructorForm.invalid) {
      this.instructorForm.markAllAsTouched();
      return;
    }

    const instructor = this.selectedInstructor();
    if (!instructor) return;

    const formValue = this.instructorForm.value;
    const updateData: UpdateInstructorDto = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      specialization: formValue.specialization || '',
      rating: formValue.rating || 4.5,
      hireDate: formValue.hireDate,
    };

    // Close dialog immediately
    this.showEditDialog.set(false);
    this.selectedInstructor.set(null);

    // Update backend - store updates automatically
    this.store.update(instructor.id, updateData).catch((error) => {
      // Error handled by store
    });
  }

  cancelDialog(): void {
    this.showAddDialog.set(false);
    this.showEditDialog.set(false);
    this.showViewDialog.set(false);
    this.selectedInstructor.set(null);
    if (this.instructorForm) {
      this.instructorForm.reset();
    }
  }

  onDeleteInstructor(instructor: Instructor): void {
    this.instructorToDelete.set(instructor);
    this.showDeleteDialog.set(true);
  }

  confirmDelete(): void {
    const instructor = this.instructorToDelete();

    // Close dialog immediately
    this.showDeleteDialog.set(false);
    this.instructorToDelete.set(null);

    // Delete from backend - store updates automatically
    if (instructor) {
      this.store.deleteInstructor(instructor.id).catch((error) => {
        // Error handled by store
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.instructorToDelete.set(null);
  }

  getFullName(instructor: Instructor): string {
    return `${instructor.firstName} ${instructor.lastName}`;
  }
}
