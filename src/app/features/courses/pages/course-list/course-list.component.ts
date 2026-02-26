import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextarea } from 'primeng/inputtextarea';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import {
  PageHeaderComponent,
  EmptyStateComponent,
  ConfirmationDialogComponent,
} from '@shared/components';
import { CoursesStore } from '../../store/courses.store.clean';
import { InstructorsStore } from '../../../instructors/store/instructors.store';
import { StudentsStore } from '../../../students/store/students.store';
import {
  Course,
  CourseStatus,
  CreateCourseDto,
  UpdateCourseDto,
} from '../../models/course.model';
import { CoursesApiService } from '../../services/courses-api.service';

@Component({
  selector: 'app-course-list',
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
    MultiSelectModule,
    InputTextarea,
    FloatLabel,
    DatePicker,
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private translate = inject(TranslateService);
  private translationService = inject(TranslationService);
  readonly store = inject(CoursesStore);
  private _instructorsStore?: InstanceType<typeof InstructorsStore>;
  private _studentsStore?: InstanceType<typeof StudentsStore>;
  readonly api = inject(CoursesApiService);
  readonly authStore = inject(AuthStore);

  // Lazy-load instructors store only when needed
  private get instructorsStore(): InstanceType<typeof InstructorsStore> {
    if (!this._instructorsStore) {
      this._instructorsStore = this.injector.get(InstructorsStore);
      this._instructorsStore.loadAll();
    }
    return this._instructorsStore;
  }

  // Lazy-load students store only when needed
  private get studentsStore(): InstanceType<typeof StudentsStore> {
    if (!this._studentsStore) {
      this._studentsStore = this.injector.get(StudentsStore);
      this._studentsStore.loadAll();
    }
    return this._studentsStore;
  }

  searchText = signal('');
  showDeleteDialog = signal(false);
  showAddDialog = signal(false);
  showEditDialog = signal(false);
  showViewDialog = signal(false);
  courseToDelete = signal<Course | null>(null);
  selectedCourse = signal<Course | null>(null);

  // Filtered courses based on search
  filteredCourses = computed(() => {
    const search = this.searchText().toLowerCase();
    const allCourses = this.store.courses();

    if (!search) return allCourses;

    return allCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        (c.subjects &&
          c.subjects.some((s) => s.toLowerCase().includes(search))),
    );
  });
  // filteredCourses = signal<Course[]>([]);

  courseForm!: FormGroup;

  statusOptions = computed(() => {
    // Force recompute when language changes
    const lang = this.translationService.currentLanguage();
    this.translate.use(lang);

    return [
      {
        label: this.translate.instant('statuses.active'),
        value: CourseStatus.Active,
      },
      {
        label: this.translate.instant('statuses.inactive'),
        value: CourseStatus.Inactive,
      },
      {
        label: this.translate.instant('statuses.completed'),
        value: CourseStatus.Completed,
      },
      {
        label: this.translate.instant('statuses.cancelled'),
        value: CourseStatus.Cancelled,
      },
    ];
  });

  subjectOptions = computed(() => {
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

  get instructorOptions() {
    // Only access store if already loaded (don't trigger lazy load from getter)
    if (!this._instructorsStore) return [];
    return this._instructorsStore.instructors().map((instructor) => ({
      label: `${instructor.firstName} ${instructor.lastName}`,
      value: instructor.id,
    }));
  }

  get studentOptions() {
    // Only access store if already loaded (don't trigger lazy load from getter)
    if (!this._studentsStore) return [];
    return this._studentsStore.students().map((student) => ({
      label: `${student.firstName} ${student.lastName}`,
      value: student.id,
    }));
  }

  ngOnInit(): void {
    // Load only courses data for this page
    this.store.loadAll();

    this.initForm();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  initForm(): void {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      instructorId: [null, Validators.required],
      studentIds: [[], Validators.required],
      status: [null, Validators.required],
      subjects: [[], Validators.required],
      scheduleDate: ['', Validators.required],
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  onAddCourse(): void {
    // Accessing the stores will lazy-load them if not already loaded
    const _ = this.instructorsStore;
    const __ = this.studentsStore;

    this.courseForm.reset();
    this.showAddDialog.set(true);
  }

  onEditCourse(course: Course): void {
    // Accessing the stores will lazy-load them if not already loaded
    const _ = this.instructorsStore;
    const __ = this.studentsStore;

    this.selectedCourse.set(course);

    // Convert scheduleDate string to Date object for the date picker
    const scheduleDate = course.scheduleDate
      ? new Date(course.scheduleDate)
      : null;

    this.courseForm.patchValue({
      name: course.name,
      description: course.description,
      instructorId: course.instructorId,
      studentIds: course.studentIds,
      status: course.status,
      subjects: course.subjects || [],
      scheduleDate: scheduleDate,
    });

    this.showEditDialog.set(true);
  }

  onViewCourse(course: Course): void {
    this.selectedCourse.set(course);
    this.showViewDialog.set(true);
  }

  saveCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const formValue = this.courseForm.value;

    // Convert Date object to ISO string for storage
    let scheduleDate = '';
    try {
      scheduleDate = formValue.scheduleDate
        ? new Date(formValue.scheduleDate).toISOString().split('T')[0]
        : '';
    } catch (error) {
      // Error converting date
      scheduleDate = '';
    }

    const courseData: CreateCourseDto = {
      name: formValue.name,
      description: formValue.description,
      instructorId: formValue.instructorId,
      studentIds: formValue.studentIds || [],
      scheduleDate: scheduleDate,
      status: formValue.status,
      subjects: formValue.subjects || [],
    };

    // Close dialog immediately
    this.showAddDialog.set(false);
    this.courseForm.reset();

    // Save to backend - store updates automatically
    this.store.create(courseData).catch((error) => {
      // Error handled by store
    });
  }

  updateCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const course = this.selectedCourse();
    if (!course) return;

    const formValue = this.courseForm.value;

    // Convert Date object to ISO string for storage
    let scheduleDate = '';
    try {
      scheduleDate = formValue.scheduleDate
        ? new Date(formValue.scheduleDate).toISOString().split('T')[0]
        : '';
    } catch (error) {
      // Error converting date
      scheduleDate = '';
    }

    const updateData: UpdateCourseDto = {
      name: formValue.name,
      description: formValue.description,
      instructorId: formValue.instructorId,
      studentIds: formValue.studentIds || [],
      scheduleDate: scheduleDate,
      status: formValue.status,
      subjects: formValue.subjects || [],
    };

    // Close dialog immediately
    this.showEditDialog.set(false);
    this.selectedCourse.set(null);

    // Update backend - store updates automatically
    this.store.update(course.id, updateData).catch((error) => {
      // Error handled by store
    });
  }

  cancelDialog(): void {
    this.showAddDialog.set(false);
    this.showEditDialog.set(false);
    this.showViewDialog.set(false);
    this.selectedCourse.set(null);
    if (this.courseForm) {
      this.courseForm.reset();
    }
  }

  onDeleteCourse(course: Course): void {
    this.courseToDelete.set(course);
    this.showDeleteDialog.set(true);
  }

  confirmDelete(): void {
    const course = this.courseToDelete();

    // Close dialog immediately
    this.showDeleteDialog.set(false);
    this.courseToDelete.set(null);

    // Delete from backend - store updates automatically
    if (course) {
      this.store.deleteCourse(course.id).catch((error) => {
        // Error handled by store
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.courseToDelete.set(null);
  }

  getStatusSeverity(
    status: CourseStatus,
  ): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case CourseStatus.Active:
        return 'success';
      case CourseStatus.Inactive:
        return 'warning';
      case CourseStatus.Cancelled:
        return 'danger';
      case CourseStatus.Completed:
        return 'info';
      default:
        return 'info';
    }
  }
}
