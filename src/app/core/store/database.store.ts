import { Injectable, inject, signal, computed } from '@angular/core';
import { DatabaseService, DatabaseSchema } from '../services/database.service';

/**
 * Global Database Store using Angular Signals
 *
 * This store manages all database data (students, courses, instructors)
 * fetched from the Node server and provides reactive state to all modules.
 *
 * NO localStorage - all data comes from http://localhost:3001/api
 */
@Injectable({
  providedIn: 'root',
})
export class DatabaseStore {
  private dbService = inject(DatabaseService);

  // Signals for reactive state
  private data = signal<DatabaseSchema | null>(null);
  private isLoadingSignal = signal(false);
  private error = signal<string | null>(null);
  private lastUpdated = signal<number | null>(null);

  // Public readonly signals
  readonly students = computed(() => this.data()?.students || []);
  readonly courses = computed(() => this.data()?.courses || []);
  readonly instructors = computed(() => this.data()?.instructors || []);
  readonly studentsCount = computed(() => this.students().length);
  readonly coursesCount = computed(() => this.courses().length);
  readonly instructorsCount = computed(() => this.instructors().length);
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error$ = this.error.asReadonly();
  readonly isReady = computed(() => this.data() !== null && !this.isLoadingSignal());

  constructor() {
    // Subscribe to database service for reactive updates
    this.dbService.database$.subscribe({
      next: (data) => {
        this.data.set(data);
        this.isLoadingSignal.set(false);
        this.error.set(null);
        this.lastUpdated.set(Date.now());
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load database');
        this.isLoadingSignal.set(false);
      },
    });
  }

  /**
   * Refresh database from server
   */
  refresh(): void {
    this.isLoadingSignal.set(true);
    this.error.set(null);
    this.dbService.refreshDatabase();
  }

  /**
   * Get student by ID
   */
  getStudentById(id: number) {
    return this.students().find((s: any) => s.id === id) || null;
  }

  /**
   * Get course by ID
   */
  getCourseById(id: number) {
    return this.courses().find((c: any) => c.id === id) || null;
  }

  /**
   * Get instructor by ID
   */
  getInstructorById(id: number) {
    return this.instructors().find((i: any) => i.id === id) || null;
  }

  /**
   * Get courses for a specific student
   */
  getStudentCourses(studentId: number) {
    const student = this.getStudentById(studentId);
    if (!student) return [];

    const courseIds = student.courseIds || [];
    return this.courses().filter((c: any) => courseIds.includes(c.id));
  }

  /**
   * Get students enrolled in a specific course
   */
  getCourseStudents(courseId: number) {
    const course = this.getCourseById(courseId);
    if (!course) return [];

    const studentIds = course.studentIds || [];
    return this.students().filter(
      (s: any) =>
        studentIds.includes(s.id.toString()) || studentIds.includes(s.id)
    );
  }

  /**
   * Get courses taught by an instructor
   */
  getInstructorCourses(instructorId: number) {
    return this.courses().filter((c: any) => c.instructorId === instructorId);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.error.set(null);
  }
}
