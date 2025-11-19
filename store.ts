import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState } from './types';

interface StoreState extends UserState {
  addXp: (amount: number) => void;
  toggleDarkMode: () => void;
  completeModule: (moduleId: string) => void;
  resetProgress: () => void;
  loadState: (state: Partial<UserState>) => void;
  isMapOpen: boolean;
  setMapOpen: (isOpen: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      xp: 0,
      darkMode: true,
      completedModules: [],
      currentModuleId: null,
      isMapOpen: false,

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      completeModule: (moduleId) => set((state) => {
        if (state.completedModules.includes(moduleId)) return state;
        return { 
          completedModules: [...state.completedModules, moduleId],
          xp: state.xp + 500 // Bonus for completion
        };
      }),

      resetProgress: () => set({ xp: 0, completedModules: [] }),
      
      loadState: (loadedState) => set((state) => ({
        ...state,
        ...loadedState,
      })),

      setMapOpen: (isOpen) => set({ isMapOpen: isOpen }),
    }),
    {
      name: 'pytorch-masterclass-storage',
      partialize: (state) => ({ 
        // Don't persist UI state like isMapOpen
        xp: state.xp,
        completedModules: state.completedModules,
        darkMode: state.darkMode,
        currentModuleId: state.currentModuleId
      }),
    }
  )
);