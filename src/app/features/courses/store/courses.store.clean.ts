import { inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  addEntity,
  updateEntity,
  removeEntity,
} from '@ngrx/signals/entities';
import { computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { CoursesApiService } from '../services/courses-api.service.simple';

/**
 * Simple NgRx Signal Store for Courses
 */
export const CoursesStore = signalStore(
  { providedIn: 'root' },

  // Entity collection
  withEntities<Course>(),

  // Additional state
  withState({
    isLoading: false,
    error: null as string | null,
  }),

  // Computed values
  withComputed((store) => ({
    courses: computed(() => store.entities()),
    courseCount: computed(() => store.entities().length),
  })),

  // Methods
  withMethods((store, api = inject(CoursesApiService)) => ({
    /**
     * Load all courses - only if store is empty
     */
    async loadAll() {
      // Skip if already loaded
      if (store.entities().length > 0) {
        return;
      }

      patchState(store, { isLoading: true, error: null });

      try {
        const courses = await firstValueFrom(api.getAll());
        patchState(store, setAllEntities(courses), { isLoading: false });
      } catch (error: any) {
        patchState(store, { error: error.message, isLoading: false });
      }
    },

    /**
     * Create course
     */
    async create(data: any) {
      try {
        const course = await firstValueFrom(api.create(data));
        patchState(store, addEntity(course));
        return course;
      } catch (error: any) {
        patchState(store, { error: error.message });
        throw error;
      }
    },

    /**
     * Update course
     */
    async update(id: string, data: any) {
      try {
        const course = await firstValueFrom(api.update(id, data));
        patchState(store, updateEntity({ id, changes: course }));
        return course;
      } catch (error: any) {
        patchState(store, { error: error.message });
        throw error;
      }
    },

    /**
     * Delete course
     */
    async deleteCourse(id: string) {
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
  }),
);
