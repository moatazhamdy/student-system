import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Instructor,
  CreateInstructorDto,
  UpdateInstructorDto,
} from '../models/instructor.model';

interface ApiInstructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  rating: number;
  coursesCount: number;
}

interface ApiResponse {
  instructors: ApiInstructor[];
}

@Injectable({
  providedIn: 'root',
})
export class InstructorsApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3001/api/instructors';

  /**
   * Map API instructor to Instructor model
   */
  private mapToInstructor(apiInstructor: ApiInstructor): Instructor {
    const [firstName, ...lastNameParts] = apiInstructor.name.split(' ');
    return {
      id: apiInstructor.id.toString(),
      firstName: firstName || '',
      lastName: lastNameParts.join(' ') || '',
      email: apiInstructor.email || `${firstName.toLowerCase()}@university.edu`,
      phone: apiInstructor.phone || '+1234567890',
      specialization: apiInstructor.specialization || '',
      rating: apiInstructor.rating || 4.5,
      coursesCount: apiInstructor.coursesCount || 0,
      hireDate: new Date('2020-01-01'),
    };
  }

  /**
   * Get all instructors
   */
  getAll(): Observable<Instructor[]> {
    return this.http.get<ApiResponse | ApiInstructor[]>(this.API_URL).pipe(
      map((response) => {
        // Handle both response formats: { instructors: [] } or direct array []
        const instructors = Array.isArray(response)
          ? response
          : response?.instructors || [];
        return instructors.map((i) => this.mapToInstructor(i));
      }),
    );
  }

  /**
   * Get instructor by ID
   */
  getById(id: string): Observable<Instructor> {
    return this.http
      .get<ApiInstructor>(`${this.API_URL}/${id}`)
      .pipe(map((i) => this.mapToInstructor(i)));
  }

  /**
   * Create instructor
   */
  create(data: CreateInstructorDto): Observable<Instructor> {
    const apiData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      specialization: data.specialization || 'General',
      rating: data.rating || 4.5,
      coursesCount: 0,
    };

    return this.http
      .post<ApiInstructor>(this.API_URL, apiData)
      .pipe(map((i) => this.mapToInstructor(i)));
  }

  /**
   * Update instructor
   */
  update(id: string, data: UpdateInstructorDto): Observable<Instructor> {
    const apiData = {
      name:
        data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : undefined,
      email: data.email,
      phone: data.phone,
      specialization: data.specialization || undefined,
      rating: data.rating,
    };

    return this.http
      .put<ApiInstructor>(`${this.API_URL}/${id}`, apiData)
      .pipe(map((i) => this.mapToInstructor(i)));
  }

  /**
   * Delete instructor
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
