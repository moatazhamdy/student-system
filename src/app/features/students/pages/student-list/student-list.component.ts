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
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import {
  PageHeaderComponent,
  EmptyStateComponent,
  ConfirmationDialogComponent,
} from '@shared/components';
import { StudentsStore } from '../../store/students.store';
import {
  Student,
  StudentStatus,
  CreateStudentDto,
  UpdateStudentDto,
} from '../../models/student.model';

@Component({
  selector: 'app-student-list',
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
    DialogModule,
    SelectModule,
    DatePicker,
    FloatLabel,
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private translationService = inject(TranslationService);
  readonly store = inject(StudentsStore);
  readonly authStore = inject(AuthStore);

  searchText = signal('');
  showDeleteDialog = signal(false);
  showAddDialog = signal(false);
  showEditDialog = signal(false);
  showViewDialog = signal(false);
  studentToDelete = signal<Student | null>(null);
  selectedStudent = signal<Student | null>(null);

  // Filtered students based on search
  filteredStudents = computed(() => {
    const search = this.searchText().toLowerCase();
    const allStudents = this.store.students();

    if (!search) return allStudents;

    return allStudents.filter(
      (s) =>
        s.firstName.toLowerCase().includes(search) ||
        s.lastName.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search),
    );
  });

  studentForm!: FormGroup;

  statusOptions = computed(() => {
    // Force recompute when language changes
    const lang = this.translationService.currentLanguage();

    // Force translate service to use current language
    this.translate.use(lang);

    return [
      {
        label: this.translate.instant('statuses.active'),
        value: StudentStatus.Active,
      },
      {
        label: this.translate.instant('statuses.inactive'),
        value: StudentStatus.Inactive,
      },
      {
        label: this.translate.instant('statuses.graduated'),
        value: StudentStatus.Graduated,
      },
      {
        label: this.translate.instant('statuses.suspended'),
        value: StudentStatus.Suspended,
      },
    ];
  });

  ngOnInit(): void {
    // Load only students data for this page
    this.store.loadAll();

    this.initForm();
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      enrollmentDate: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    // Filter locally in the component
  }

  onAddStudent(): void {
    this.studentForm.reset({
      enrollmentDate: new Date(),
    });
    this.showAddDialog.set(true);
  }

  onEditStudent(student: Student): void {
    this.selectedStudent.set(student);
    this.studentForm.patchValue({
      ...student,
      dateOfBirth: new Date(student.dateOfBirth),
      enrollmentDate: new Date(student.enrollmentDate),
    });
    this.showEditDialog.set(true);
  }

  onViewStudent(student: Student): void {
    this.selectedStudent.set(student);
    this.showViewDialog.set(true);
  }

  saveStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;
    const studentData: CreateStudentDto = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      dateOfBirth: formValue.dateOfBirth,
      enrollmentDate: formValue.enrollmentDate,
      status: formValue.status,
      courses: [],
    };

    // Close dialog immediately
    this.showAddDialog.set(false);
    this.studentForm.reset();

    // Save to backend - store updates automatically
    this.store.create(studentData).catch((error) => {
      // Error handled by store
    });
  }

  updateStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const student = this.selectedStudent();
    if (!student) return;

    const formValue = this.studentForm.value;
    const updateData: UpdateStudentDto = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      dateOfBirth: formValue.dateOfBirth,
      enrollmentDate: formValue.enrollmentDate,
      status: formValue.status,
    };

    // Close dialog immediately
    this.showEditDialog.set(false);
    this.selectedStudent.set(null);

    // Update backend - store updates automatically
    this.store.update(student.id, updateData).catch((error) => {
      // Error handled by store
    });
  }

  cancelDialog(): void {
    this.showAddDialog.set(false);
    this.showEditDialog.set(false);
    this.showViewDialog.set(false);
    this.selectedStudent.set(null);
    if (this.studentForm) {
      this.studentForm.reset();
    }
  }

  onDeleteStudent(student: Student): void {
    this.studentToDelete.set(student);
    this.showDeleteDialog.set(true);
  }

  confirmDelete(): void {
    const student = this.studentToDelete();

    // Close dialog immediately
    this.showDeleteDialog.set(false);
    this.studentToDelete.set(null);

    // Delete from backend - store updates automatically
    if (student) {
      this.store.deleteStudent(student.id).catch((error) => {
        // Error handled by store
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.studentToDelete.set(null);
  }

  getStatusSeverity(
    status: StudentStatus,
  ): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case StudentStatus.Active:
        return 'success';
      case StudentStatus.Inactive:
        return 'warning';
      case StudentStatus.Suspended:
        return 'danger';
      case StudentStatus.Graduated:
        return 'info';
      default:
        return 'info';
    }
  }

  getFullName(student: Student): string {
    return `${student.firstName} ${student.lastName}`;
  }
}
