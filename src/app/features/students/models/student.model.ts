export enum StudentStatus {
  Active = 'active',
  Inactive = 'inactive',
  Graduated = 'graduated',
  Suspended = 'suspended',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  status: StudentStatus;
  courses: string[];
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
  status: StudentStatus;
  courses: string[];
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {}
