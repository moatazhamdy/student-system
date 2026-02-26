import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { map, take, filter, tap } from 'rxjs/operators';
import { DatabaseService } from '@core/services';
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from '@core/models';
import {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
  StudentStatus,
} from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsApiService {
  private db = inject(DatabaseService);

  /**
   * Map database student to Student model
   */
  private mapToStudent(dbStudent: any): Student {
    const nameParts = (dbStudent.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: dbStudent.id.toString(),
      firstName,
      lastName,
      email: dbStudent.email || '',
      phone: dbStudent.phone || '',
      dateOfBirth: new Date(), // Not in database
      enrollmentDate: new Date(dbStudent.createdAt || new Date()),
      status:
        dbStudent.status === 'active'
          ? StudentStatus.Active
          : StudentStatus.Inactive,
      courses: (dbStudent.courseIds || []).map((id: number) => id.toString()),
    };
  }

  /**
   * Map Student model to database format
   */
  private mapToDbFormat(
    student: Partial<Student> & { firstName?: string; lastName?: string },
  ): any {
    return {
      name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      email: student.email,
      phone: student.phone,
      status: student.status === StudentStatus.Active ? 'active' : 'inactive',
      createdAt: student.enrollmentDate
        ? new Date(student.enrollmentDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      courseIds: (student.courses || []).map((id) => parseInt(id, 10)),
    };
  }

  getAll(
    params?: PaginationParams,
  ): Observable<PaginatedApiResponse<Student[]>> {
    return this.db.getStudents().pipe(
      take(1),
      map((students: any[]) => {
        const mappedStudents = students.map((s: any) => this.mapToStudent(s));
        return {
          success: true,
          data: mappedStudents,
          pagination: {
            currentPage: params?.page || 1,
            pageSize: params?.pageSize || 10,
            totalPages: 1,
            totalItems: mappedStudents.length,
            hasNext: false,
            hasPrevious: false,
          },
        };
      }),
      delay(300),
    );
  }

  getById(id: string): Observable<ApiResponse<Student>> {
    return this.db.getStudentById(parseInt(id, 10)).pipe(
      take(1),
      map((student) => ({
        success: true,
        data: student ? this.mapToStudent(student) : null!,
      })),
      delay(200),
    );
  }

  create(data: CreateStudentDto): Observable<ApiResponse<Student>> {
    const dbData = this.mapToDbFormat(data);

    return this.db.addStudent(dbData).pipe(
      map((student) => ({
        success: true,
        data: this.mapToStudent(student),
        message: 'Student created successfully',
      })),
      delay(300),
    );
  }

  update(id: string, data: UpdateStudentDto): Observable<ApiResponse<Student>> {
    const dbData = this.mapToDbFormat(data);

    return this.db.updateStudent(parseInt(id, 10), dbData).pipe(
      map((student) => ({
        success: true,
        data: student ? this.mapToStudent(student) : null!,
        message: 'Student updated successfully',
      })),
      delay(300),
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.db.deleteStudent(parseInt(id, 10)).pipe(
      map((success) => ({
        success,
        data: undefined,
        message: success
          ? 'Student deleted successfully'
          : 'Failed to delete student',
      })),
      delay(300),
    );
  }
}
