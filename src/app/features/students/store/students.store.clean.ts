import { inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Student } from '../models/student.model';
import { StudentsApiService } from '../services/students-api.service.simple';

/**
 * Simple NgRx Signal Store for Students
 * - Direct API calls
 * - Clean entity management
 * - No complexity
 */
export const StudentsStore = signalStore(
  { providedIn: 'root' },

  // Entity collection
  withEntities<Student>(),

  // Additional state
  withState({
    isLoading: false,
    error: null as string | null,
  }),

  // Computed values
  withComputed((store) => ({
    students: computed(() => store.entities()),
    studentCount: computed(() => store.entities().length),
  })),

  // Methods
  withMethods((store, api = inject(StudentsApiService)) => ({
    /**
     * Load all students - only if store is empty
     */
    async loadAll() {
      // Skip if already loaded
      if (store.entities().length > 0) {
        return;
      }

      patchState(store, { isLoading: true, error: null });

      try {
        const students = await firstValueFrom(api.getAll());
        patchState(store, setAllEntities(students), { isLoading: false });
      } catch (error: any) {
        patchState(store, { error: error.message, isLoading: false });
      }
    },

    /**
     * Create student
     */
    async create(data: any) {
      try {
        const student = await firstValueFrom(api.create(data));
        patchState(store, addEntity(student));
        return student;
      } catch (error: any) {
        patchState(store, { error: error.message });
        throw error;
      }
    },

    /**
     * Update student
     */
    async update(id: string, data: any) {
      try {
        const student = await firstValueFrom(api.update(id, data));
        patchState(store, updateEntity({ id, changes: student }));
        return student;
      } catch (error: any) {
        patchState(store, { error: error.message });
        throw error;
      }
    },

    /**
     * Delete student
     */
    async deleteStudent(id: string) {
      try {
        await firstValueFrom(api.delete(id));
        patchState(store, removeEntity(id));
      } catch (error: any) {
        patchState(store, { error: error.message });
        throw error;
      }
    },
  })),

  // Lifecycle - No auto-load, pages load data on-demand
  withHooks({
    onInit(store) {
      // Store initialized, data loaded on-demand by pages
    },
  })
);
