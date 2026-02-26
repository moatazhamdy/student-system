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
import { Instructor } from '../models/instructor.model';
import { InstructorsApiService } from '../services/instructors-api.service';

/**
 * Simple NgRx Signal Store for Instructors
 */
export const InstructorsStore = signalStore(
  { providedIn: 'root' },

  // Entity collection
  withEntities<Instructor>(),

  // Additional state
  withState({
    isLoading: false,
    error: null as string | null,
  }),

  // Computed values
  withComputed((store) => ({
    instructors: computed(() => store.entities()),
    instructorCount: computed(() => store.entities().length),
  })),

  // Methods
  withMethods((store, api = inject(InstructorsApiService)) => ({
    /**
     * Load all instructors - only if store is empty
     */
    async loadAll() {
      // Skip if already loaded
      if (store.entities().length > 0) {
        return;
      }

      patchState(store, { isLoading: true, error: null });

      try {
        const instructors = await firstValueFrom(api.getAll());
        patchState(store, setAllEntities(instructors), { isLoading: false });
      } catch (error: any) {
        const errorMsg = error?.message || 'Unknown error loading instructors';
        patchState(store, { error: errorMsg, isLoading: false });
      }
    },

    /**
     * Create instructor
     */
    async create(data: any) {
      try {
        const instructor = await firstValueFrom(api.create(data));
        patchState(store, addEntity(instructor));
        return instructor;
      } catch (error: any) {
        const errorMsg = error?.message || 'Unknown error creating instructor';
        patchState(store, { error: errorMsg });
        throw error;
      }
    },

    /**
     * Update instructor
     */
    async update(id: string, data: any) {
      try {
        const instructor = await firstValueFrom(api.update(id, data));
        patchState(store, updateEntity({ id, changes: instructor }));
        return instructor;
      } catch (error: any) {
        patchState(store, { error: error.message });
        throw error;
      }
    },

    /**
     * Delete instructor
     */
    async deleteInstructor(id: string) {
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
