import { inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { withEntities, addEntity, updateEntity, removeEntity, setAllEntities } from '@ngrx/signals/entities';
import { computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Instructor } from '../models/instructor.model';
import { InstructorsApiService } from '../services/instructors-api.service';

// Additional state beyond entities
interface InstructorsState {
  selectedInstructorId: string | null;
  isLoading: boolean;
  error: string | null;
  filter: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

const initialState: InstructorsState = {
  selectedInstructorId: null,
  isLoading: false,
  error: null,
  filter: '',
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
};

/**
 * NgRx Signal Store for Instructors
 *
 * Features:
 * - Entity management with built-in CRUD operations
 * - Automatic signal-based reactivity
 * - Computed selectors for derived state
 * - Async methods for API calls
 * - Auto-initialization on store creation
 */
export const InstructorsStore = signalStore(
  { providedIn: 'root' },

  // Entity management - provides ids, entities, entityMap
  withEntities<Instructor>(),

  // Additional state
  withState(initialState),

  // Computed selectors
  withComputed((store) => ({
    // Get all instructors as array
    instructors: computed(() => store.entities()),

    // Filter instructors based on search text
    filteredInstructors: computed(() => {
      const filter = store.filter().toLowerCase();
      if (!filter) return store.entities();

      return store.entities().filter(
        (instructor) =>
          instructor.firstName.toLowerCase().includes(filter) ||
          instructor.lastName.toLowerCase().includes(filter) ||
          instructor.email.toLowerCase().includes(filter) ||
          instructor.department.toLowerCase().includes(filter)
      );
    }),

    // Get selected instructor
    selectedInstructor: computed(() => {
      const id = store.selectedInstructorId();
      if (!id) return null;
      return store.entityMap()[id] || null;
    }),

    // Instructor count
    instructorCount: computed(() => store.entities().length),

    // Check if ready
    isReady: computed(() => !store.isLoading() && store.entities().length > 0),
  })),

  // Methods (actions)
  withMethods((store, api = inject(InstructorsApiService)) => ({
    /**
     * Load all instructors with pagination
     */
    async loadAll(params: { page?: number; pageSize?: number } = {}) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(
          api.getAll({
            page: params.page || 1,
            pageSize: params.pageSize || 10,
            sortField: 'lastName',
            sortOrder: 'asc',
          })
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
          error: error.message || 'Failed to load instructors',
          isLoading: false,
        });
      }
    },

    /**
     * Load instructor by ID
     */
    async loadById(id: string) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(api.getById(id));
        patchState(store, {
          ...addEntity(response.data),
          selectedInstructorId: id,
          isLoading: false,
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to load instructor',
          isLoading: false,
        });
      }
    },

    /**
     * Create new instructor
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
          error: error.message || 'Failed to create instructor',
          isLoading: false,
        });
        throw error;
      }
    },

    /**
     * Update existing instructor
     */
    async update(id: string, data: any) {
      patchState(store, { isLoading: true, error: null });

      try {
        const response = await firstValueFrom(api.update(id, data));
        patchState(store, {
          ...updateEntity({ id, changes: response.data }),
          selectedInstructorId: id,
          isLoading: false,
        });
        return response.data;
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to update instructor',
          isLoading: false,
        });
        throw error;
      }
    },

    /**
     * Delete instructor
     */
    async deleteInstructor(id: string) {
      patchState(store, { isLoading: true, error: null });

      try {
        await firstValueFrom(api.delete(id));
        patchState(store, {
          ...removeEntity(id),
          isLoading: false,
        });
      } catch (error: any) {
        patchState(store, {
          error: error.message || 'Failed to delete instructor',
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
     * Select an instructor
     */
    selectInstructor(id: string | null) {
      patchState(store, { selectedInstructorId: id });
    },

    /**
     * Clear error
     */
    clearError() {
      patchState(store, { error: null });
    },

    /**
     * Clear selected instructor
     */
    clearSelectedInstructor() {
      patchState(store, { selectedInstructorId: null });
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
  })
);
