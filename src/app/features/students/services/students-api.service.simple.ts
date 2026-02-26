import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student, StudentStatus, CreateStudentDto, UpdateStudentDto } from '../models/student.model';

interface ApiStudent {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  courseIds: number[];
}

interface ApiResponse {
  students: ApiStudent[];
}

@Injectable({
  providedIn: 'root',
})
export class StudentsApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3001/api/students';

  /**
   * Map API student to Student model
   */
  private mapToStudent(apiStudent: ApiStudent): Student {
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
   * Get all students
   */
  getAll(): Observable<Student[]> {
    return this.http.get<ApiResponse | ApiStudent[]>(this.API_URL).pipe(
      map(response => {
        // Handle both response formats: { students: [] } or direct array []
        const students = Array.isArray(response) ? response : (response?.students || []);
        return students.map(s => this.mapToStudent(s));
      })
    );
  }

  /**
   * Get student by ID
   */
  getById(id: string): Observable<Student> {
    return this.http.get<ApiStudent>(`${this.API_URL}/${id}`).pipe(
      map(s => this.mapToStudent(s))
    );
  }

  /**
   * Create student
   */
  create(data: CreateStudentDto): Observable<Student> {
    const apiData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      status: data.status === StudentStatus.Active ? 'active' : 'inactive',
      createdAt: new Date().toISOString().split('T')[0],
      courseIds: data.courses.map(id => parseInt(id, 10)),
    };

    return this.http.post<ApiStudent>(this.API_URL, apiData).pipe(
      map(s => this.mapToStudent(s))
    );
  }

  /**
   * Update student
   */
  update(id: string, data: UpdateStudentDto): Observable<Student> {
    const apiData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      status: data.status === StudentStatus.Active ? 'active' : 'inactive',
    };

    return this.http.put<ApiStudent>(`${this.API_URL}/${id}`, apiData).pipe(
      map(s => this.mapToStudent(s))
    );
  }

  /**
   * Delete student
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
