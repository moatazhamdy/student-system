import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student, StudentStatus } from '../models/student.model';

interface ApiStudent {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  courseIds: number[];
}

/**
 * SIMPLE Students Store - Direct HTTP calls, no complexity
 */
@Injectable({
  providedIn: 'root',
})
export class StudentsStore {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3001/api/students';

  // Simple signals
  private studentsSignal = signal<Student[]>([]);
  private isLoadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly accessors
  readonly students = this.studentsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly studentCount = computed(() => this.studentsSignal().length);

  /**
   * Map API data to Student model
   */
  private mapStudent(apiStudent: ApiStudent): Student {
    const [firstName, ...lastNameParts] = apiStudent.name.split(' ');
    return {
      id: apiStudent.id.toString(),
      firstName: firstName || '',
      lastName: lastNameParts.join(' ') || '',
      email: apiStudent.email,
      phone: apiStudent.phone,
      dateOfBirth: new Date('2000-01-01'),
      enrollmentDate: new Date(apiStudent.createdAt),
      status: apiStudent.status === 'active' ? StudentStatus.Active : StudentStatus.Inactive,
      courses: apiStudent.courseIds.map(id => id.toString()),
    };
  }

  /**
   * Load all students - Simple and direct
   */
  async loadAll(): Promise<void> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      // Direct HTTP call
      const response = await fetch(this.API_URL);
      const data = await response.json();

      const apiStudents: ApiStudent[] = data.students || [];
      const mappedStudents = apiStudents.map(s => this.mapStudent(s));

      // Update signal
      this.studentsSignal.set(mappedStudents);
      this.isLoadingSignal.set(false);
    } catch (error: any) {
      this.errorSignal.set(error.message || 'Failed to load students');
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Create student
   */
  async create(data: any): Promise<Student | null> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      // Reload all data
      await this.loadAll();

      return this.studentsSignal().find(s => s.id === result.id.toString()) || null;
    } catch (error: any) {
      this.errorSignal.set(error.message);
      return null;
    }
  }

  /**
   * Update student
   */
  async update(id: string, data: any): Promise<void> {
    try {
      await fetch(`${this.API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Reload all data
      await this.loadAll();
    } catch (error: any) {
      this.errorSignal.set(error.message);
    }
  }

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<void> {
    try {
      await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
      });

      // Reload all data
      await this.loadAll();
    } catch (error: any) {
      this.errorSignal.set(error.message);
    }
  }
}
