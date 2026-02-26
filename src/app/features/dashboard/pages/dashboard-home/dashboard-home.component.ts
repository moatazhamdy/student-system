import {
  Component,
  OnInit,
  inject,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { PageHeaderComponent, LineChartComponent } from '@shared/components';
import { LineChartData } from '@shared/components';
import { StudentsStore } from '../../../students/store/students.store.clean';
import { CoursesStore } from '../../../courses/store/courses.store.clean';
import { InstructorsStore } from '../../../instructors/store/instructors.store.clean';
import { DatabaseStore } from '@core';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardModule,
    PageHeaderComponent,
    LineChartComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent implements OnInit {
  readonly studentsStore = inject(StudentsStore);
  readonly coursesStore = inject(CoursesStore);
  readonly instructorsStore = inject(InstructorsStore);

  // Global DatabaseStore - provides direct access to all data from Node server
  // Both approaches work: feature stores OR global store
  readonly dbStore = inject(DatabaseStore);

  // Computed stats based on store data
  stats = computed(() => {
    const courses = this.coursesStore.courses();
    const totalEnrollments = courses.reduce(
      (sum: number, course: any) => sum + (course.enrolledCount || 0),
      0,
    );

    return [
      {
        title: 'dashboard.totalStudents',
        value: this.studentsStore.studentCount(),
        icon: 'pi pi-users',
        color: '#8b5cf6',
      },
      {
        title: 'dashboard.totalCourses',
        value: this.coursesStore.courseCount(),
        icon: 'pi pi-book',
        color: '#10b981',
      },
      {
        title: 'dashboard.totalInstructors',
        value: this.instructorsStore.instructorCount(),
        icon: 'pi pi-user',
        color: '#f59e0b',
      },
    ];
  });

  // Enrollment trends data for chart
  enrollmentTrends = computed<LineChartData>(() => {
    const currentDate = new Date();
    const labels: string[] = [];
    const studentData: number[] = [];
    const courseData: number[] = [];
    const instructorData: number[] = [];

    // Generate last 6 months data
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      labels.push(monthName);

      // Simulate trend data (in real app, this would come from API)
      const baseStudents = this.studentsStore.studentCount();
      const baseCourses = this.coursesStore.courseCount();
      const baseInstructors = this.instructorsStore.instructorCount();
      studentData.push(
        Math.max(0, baseStudents - Math.floor(Math.random() * 10)),
      );
      courseData.push(Math.max(0, baseCourses - Math.floor(Math.random() * 3)));
      instructorData.push(
        Math.max(0, baseInstructors - Math.floor(Math.random() * 2)),
      );
    }

    return {
      labels,
      datasets: [
        {
          label: 'Students',
          data: studentData,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
        },
        {
          label: 'Courses',
          data: courseData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
          label: 'Instructors',
          data: instructorData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
        },
      ],
    };
  });

  ngOnInit(): void {
    // Load all required data for dashboard statistics
    this.studentsStore.loadAll();
    this.coursesStore.loadAll();
    this.instructorsStore.loadAll();
  }
}
