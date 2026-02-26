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
  addEntity,
  updateEntity,
  removeEntity,
  setAllEntities,
} from '@ngrx/signals/entities';
import { computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Student } from '../models/student.model';
import { StudentsApiService } from '../services/students-api.service';

// Additional state beyond entities
interface StudentsState {
  selectedStudentId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

const initialState: StudentsState = {
  selectedStudentId: null,
  isLoading: false,
  error: null,
  filter: '',
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
};

/**
 * NgRx Signal Store for Students
 *
 * Features:
 * - Entity management with built-in CRUD operations
 * - Automatic signal-based reactivity
 * - Computed selectors for derived state
 * - Async methods for API calls
 * - Auto-initialization on store creation
 */
export const StudentsStore = signalStore(
  { providedIn: 'root' },

  // Entity management - provides ids, entities, entityMap
  withEntities<Student>(),

  // Additional state
  withState(initialState),

  // Computed selectors
  withComputed((store) => ({
    // Get all students as array
    students: computed(() => store.entities()),

    // Filter students based on search text
    filteredStudents: computed(() => {
      const filter = store.filter().toLowerCase();
      if (!filter) return store.entities();

      return store
        .entities()
        .filter(
          (student) =>
            student.firstName.toLowerCase().includes(filter) ||
            student.lastName.toLowerCase().includes(filter) ||
            student.email.toLowerCase().includes(filter),
        );
    }),

    // Get selected student
    selectedStudent: computed(() => {
      const id = store.selectedStudentId();
      if (!id) return null;
      return store.entityMap()[id] || null;
    }),

    // Student count
    studentCount: computed(() => store.entities().length),

    // Check if ready
    isReady: computed(() => !store.isLoading() && store.entities().length > 0),
  })),

  // Methods (actions)
  withMethods((store, api = inject(StudentsApiService)) => ({
    /**
     * Load all students with pagination
     */
    async loadAll(params: { page?: number; pageSize?: number } = {}) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          api.getAll({
            page: params.page || 1,
            pageSize: params.pageSize || 10,
            sortField: 'firstName',
            sortOrder: 'asc',
          }),
        );

        patchState(store, {
          ...setAllEntities(response.data),
          totalItems: response.pagination.totalItems,
          currentPage: response.pagination.currentPage,
          pageSize: response.pagination.pageSize,
          isLoading: false,
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load students',
          isLoading: false,
        });
      }
    },

    /**
     * Load student by ID
     */
    async loadById(id: string) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(api.getById(id));
        patchState(store, {
          ...addEntity(response.data),
          selectedStudentId: id,
          isLoading: false,
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load student',
          isLoading: false,
        });
      }
    },

    /**
     * Create new student
     */
    async create(data: any) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(api.create(data));
        patchState(store, {
          ...addEntity(response.data),
          isLoading: false,
        });
        return response.data;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to create student',
          isLoading: false,
        });
        throw error;
      }
    },

    /**
     * Update existing student
     */
    async update(id: string, data: any) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(api.update(id, data));
        patchState(store, {
          ...updateEntity({ id, changes: response.data }),
          selectedStudentId: id,
          isLoading: false,
        });
        return response.data;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to update student',
          isLoading: false,
        });
        throw error;
      }
    },

    /**
     * Delete student
     */
    async deleteStudent(id: string) {
      patchState(store, { isLoading: true, error: null });

      try {
        await firstValueFrom(api.delete(id));
        patchState(store, {
          ...removeEntity(id),
          isLoading: false,
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to delete student',
          isLoading: false,
        });
        throw error;
      }
    },

    /**
     * Set search filter
     */
    setFilter(filterValue: string) {
      patchState(store, { filter: filterValue });
    },

    /**
     * Select a student
     */
    selectStudent(id: string | null) {
      patchState(store, { selectedStudentId: id });
    },

    /**
     * Clear error
     */
    clearError() {
      patchState(store, { error: null });
    },

    /**
     * Clear selected student
     */
    clearSelectedStudent() {
      patchState(store, { selectedStudentId: null });
    },
  })),

  // Lifecycle hooks
  withHooks({
    /**
     * Log store initialization
     */
    onInit() {
      // Store initialized
    },

    /**
     * Cleanup on destroy
     */
    onDestroy() {
      // Cleanup logic if needed
    },
  }),
);
