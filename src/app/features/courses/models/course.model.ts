export enum CourseStatus {
  Active = 'active',
  Inactive = 'inactive',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface Course {
  id: string;
  name: string;
  description: string;
  instructorId: string;
  instructorName?: string;
  studentIds: string[];
  scheduleDate: string;
  status: CourseStatus;
  subjects: string[];
}

export interface CreateCourseDto {
  name: string;
  description: string;
  instructorId: string;
  studentIds: string[];
  scheduleDate: string;
  status: CourseStatus;
  subjects: string[];
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}
