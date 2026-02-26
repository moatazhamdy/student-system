import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, timer } from 'rxjs';
import { map, tap, catchError, switchMap, shareReplay, filter } from 'rxjs/operators';

export interface DatabaseSchema {
  students: any[];
  instructors: any[];
  courses: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private http = inject(HttpClient);

  // Backend API URLs - Always use Node server
  private readonly API_BASE_URL = 'http://localhost:3001/api';
  private readonly API_STUDENTS_URL = `${this.API_BASE_URL}/students`;
  private readonly API_COURSES_URL = `${this.API_BASE_URL}/courses`;
  private readonly API_INSTRUCTORS_URL = `${this.API_BASE_URL}/instructors`;

  // Reactive state using BehaviorSubject
  private databaseSubject = new BehaviorSubject<DatabaseSchema | null>(null);
  public database$ = this.databaseSubject.asObservable();

  private isInitialized = signal(false);
  private isLoading = signal(false);

  constructor() {
    // Don't auto-load - let stores handle their own loading
  }

  /**
   * Load database from Node server - NO localStorage
   */
  private loadDatabaseFromServer(): void {
    this.isLoading.set(true);

    forkJoin({
      students: this.http.get<{ students: any[] }>(this.API_STUDENTS_URL),
      courses: this.http.get<{ courses: any[] }>(this.API_COURSES_URL),
      instructors: this.http.get<{ instructors: any[] }>(this.API_INSTRUCTORS_URL),
    })
      .pipe(
        map((result) => ({
          students: result.students.students || [],
          courses: result.courses.courses || [],
          instructors: result.instructors.instructors || [],
        })),
        tap((data) => {
          this.databaseSubject.next(data);
          this.isInitialized.set(true);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.isLoading.set(false);
          // Initialize with empty database
          const emptyDb: DatabaseSchema = {
            students: [],
            instructors: [],
            courses: [],
          };
          this.databaseSubject.next(emptyDb);
          this.isInitialized.set(true);
          return of(emptyDb);
        }),
      )
      .subscribe();
  }

  /**
   * Refresh database from server
   */
  refreshDatabase(): void {
    this.loadDatabaseFromServer();
  }

  /**
   * Get current database snapshot
   */
  getDatabase(): DatabaseSchema {
    return (
      this.databaseSubject.value || {
        students: [],
        instructors: [],
        courses: [],
      }
    );
  }

  /**
   * Get students
   */
  getStudents(): Observable<any[]> {
    return this.database$.pipe(
      filter((db) => db !== null),
      map((db) => db.students || [])
    );
  }

  /**
   * Get student by ID
   */
  getStudentById(id: number): Observable<any | null> {
    return this.database$.pipe(
      map((db) => db?.students.find((s) => s.id === id) || null),
    );
  }

  /**
   * Add student
   */
  addStudent(student: any): Observable<any> {
    const db = this.getDatabase();
    const newId = Math.max(0, ...db.students.map((s) => s.id)) + 1;
    const newStudent = { ...student, id: newId };

    db.students.push(newStudent);
    this.updateDatabase(db);

    return of(newStudent);
  }

  /**
   * Update student
   */
  updateStudent(id: number, student: any): Observable<any> {
    const db = this.getDatabase();
    const index = db.students.findIndex((s) => s.id === id);

    if (index !== -1) {
      db.students[index] = { ...db.students[index], ...student, id };
      this.updateDatabase(db);
      return of(db.students[index]);
    }

    return of(null);
  }

  /**
   * Delete student
   */
  deleteStudent(id: number): Observable<boolean> {
    const db = this.getDatabase();
    const index = db.students.findIndex((s) => s.id === id);

    if (index !== -1) {
      db.students.splice(index, 1);
      this.updateDatabase(db);
      return of(true);
    }

    return of(false);
  }

  /**
   * Get courses
   */
  getCourses(): Observable<any[]> {
    return this.database$.pipe(
      filter((db) => db !== null),
      map((db) => db.courses || [])
    );
  }

  /**
   * Get course by ID
   */
  getCourseById(id: number): Observable<any | null> {
    return this.database$.pipe(
      map((db) => db?.courses.find((c) => c.id === id) || null),
    );
  }

  /**
   * Add course
   */
  addCourse(course: any): Observable<any> {
    const db = this.getDatabase();
    const newId = Math.max(0, ...db.courses.map((c) => c.id)) + 1;
    const newCourse = { ...course, id: newId };

    db.courses.push(newCourse);
    this.updateDatabase(db);

    return of(newCourse);
  }

  /**
   * Update course
   */
  updateCourse(id: number, course: any): Observable<any> {
    const db = this.getDatabase();
    const index = db.courses.findIndex((c) => c.id === id);

    if (index !== -1) {
      db.courses[index] = { ...db.courses[index], ...course, id };
      this.updateDatabase(db);
      return of(db.courses[index]);
    }

    return of(null);
  }

  /**
   * Delete course
   */
  deleteCourse(id: number): Observable<boolean> {
    const db = this.getDatabase();
    const index = db.courses.findIndex((c) => c.id === id);

    if (index !== -1) {
      db.courses.splice(index, 1);
      this.updateDatabase(db);
      return of(true);
    }

    return of(false);
  }

  /**
   * Get instructors
   */
  getInstructors(): Observable<any[]> {
    return this.database$.pipe(
      filter((db) => db !== null),
      map((db) => db.instructors || [])
    );
  }

  /**
   * Get instructor by ID
   */
  getInstructorById(id: number): Observable<any | null> {
    return this.database$.pipe(
      map((db) => db?.instructors.find((i) => i.id === id) || null),
    );
  }

  /**
   * Add instructor
   */
  addInstructor(instructor: any): Observable<any> {
    const db = this.getDatabase();
    const newId = Math.max(0, ...db.instructors.map((i) => i.id)) + 1;
    const newInstructor = { ...instructor, id: newId };

    db.instructors.push(newInstructor);
    this.updateDatabase(db);

    return of(newInstructor);
  }

  /**
   * Update instructor
   */
  updateInstructor(id: number, instructor: any): Observable<any> {
    const db = this.getDatabase();
    const index = db.instructors.findIndex((i) => i.id === id);

    if (index !== -1) {
      db.instructors[index] = { ...db.instructors[index], ...instructor, id };
      this.updateDatabase(db);
      return of(db.instructors[index]);
    }

    return of(null);
  }

  /**
   * Delete instructor
   */
  deleteInstructor(id: number): Observable<boolean> {
    const db = this.getDatabase();
    const index = db.instructors.findIndex((i) => i.id === id);

    if (index !== -1) {
      db.instructors.splice(index, 1);
      this.updateDatabase(db);
      return of(true);
    }

    return of(false);
  }

  /**
   * Update database and persist to Node server only
   */
  private updateDatabase(db: DatabaseSchema): void {
    this.databaseSubject.next(db);
    this.saveToBackend(db);
  }

  /**
   * Save database to backend API (persists to JSON files via Node server)
   */
  private saveToBackend(data: DatabaseSchema): void {
    // Save students
    this.http
      .post(this.API_STUDENTS_URL, { students: data.students })
      .pipe(
        catchError((error) => {
          return of(null);
        }),
      )
      .subscribe();

    // Save instructors
    this.http
      .post(this.API_INSTRUCTORS_URL, { instructors: data.instructors })
      .pipe(
        catchError((error) => {
          return of(null);
        }),
      )
      .subscribe();

    // Save courses
    this.http
      .post(this.API_COURSES_URL, { courses: data.courses })
      .pipe(
        catchError((error) => {
          return of(null);
        }),
      )
      .subscribe();
  }

  /**
   * Reset database - reload from Node server
   */
  resetDatabase(): Observable<DatabaseSchema> {
    return forkJoin({
      students: this.http.get<{ students: any[] }>(this.API_STUDENTS_URL),
      courses: this.http.get<{ courses: any[] }>(this.API_COURSES_URL),
      instructors: this.http.get<{ instructors: any[] }>(this.API_INSTRUCTORS_URL),
    }).pipe(
      map((result) => ({
        students: result.students.students || [],
        courses: result.courses.courses || [],
        instructors: result.instructors.instructors || [],
      })),
      tap((data) => {
        this.databaseSubject.next(data);
      }),
    );
  }
}
