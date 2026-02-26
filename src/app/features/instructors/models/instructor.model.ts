export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  rating: number;
  coursesCount: number;
  hireDate: Date;
}

export interface CreateInstructorDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  rating: number;
  hireDate: Date;
}

export interface UpdateInstructorDto extends Partial<CreateInstructorDto> {}
