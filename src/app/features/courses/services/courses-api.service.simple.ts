import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Course,
  CourseStatus,
  CreateCourseDto,
  UpdateCourseDto,
} from '../models/course.model';

interface ApiCourse {
  id: number;
  name: string;
  title: string;
  description: string;
  instructorId: number;
  studentIds: number[];
  scheduleDate: string;
  status: string;
  subjects: string[];
  department?: string;
}

interface ApiResponse {
  courses: ApiCourse[];
}

@Injectable({
  providedIn: 'root',
})
export class CoursesApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3001/api/courses';

  /**
   * Map API course to Course model
   */
  private mapToCourse(apiCourse: ApiCourse): Course {
    return {
      id: apiCourse.id.toString(),
      name: apiCourse.title || apiCourse.name || '',
      description: apiCourse.description || '',
      instructorId: apiCourse.instructorId?.toString() || '',
      instructorName: 'Instructor', // Will be populated by component
      studentIds: (apiCourse.studentIds || []).map((id) => id.toString()),
      scheduleDate: apiCourse.scheduleDate || '',
      status: (apiCourse.status as CourseStatus) || CourseStatus.Active,
      subjects:
        apiCourse.subjects ||
        (apiCourse.department ? [apiCourse.department] : []),
    };
  }

  /**
   * Get all courses
   */
  getAll(): Observable<Course[]> {
    return this.http.get<ApiResponse | ApiCourse[]>(this.API_URL).pipe(
      map((response) => {
        // Handle both response formats: { courses: [] } or direct array []
        const courses = Array.isArray(response)
          ? response
          : response?.courses || [];
        return courses.map((c) => this.mapToCourse(c));
      }),
    );
  }

  /**
   * Get course by ID
   */
  getById(id: string): Observable<Course> {
    return this.http
      .get<ApiCourse>(`${this.API_URL}/${id}`)
      .pipe(map((c) => this.mapToCourse(c)));
  }

  /**
   * Create course
   */
  create(data: CreateCourseDto): Observable<Course> {
    const apiData = {
      name: data.name,
      title: data.name,
      description: data.description,
      instructorId: parseInt(data.instructorId, 10),
      studentIds: data.studentIds.map((id) => parseInt(id, 10)),
      scheduleDate: data.scheduleDate,
      status: data.status,
      subjects: data.subjects || [],
    };

    return this.http
      .post<ApiCourse>(this.API_URL, apiData)
      .pipe(map((c) => this.mapToCourse(c)));
  }

  /**
   * Update course
   */
  update(id: string, data: UpdateCourseDto): Observable<Course> {
    const apiData = {
      name: data.name,
      title: data.name,
      description: data.description,
      instructorId: data.instructorId
        ? parseInt(data.instructorId, 10)
        : undefined,
      studentIds: data.studentIds?.map((id) => parseInt(id, 10)),
      scheduleDate: data.scheduleDate,
      status: data.status,
      subjects: data.subjects || [],
    };

    return this.http
      .put<ApiCourse>(`${this.API_URL}/${id}`, apiData)
      .pipe(map((c) => this.mapToCourse(c)));
  }

  /**
   * Delete course
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
