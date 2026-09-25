import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface SettingsState {
  appLockEnabled: boolean;
  privacyModeEnabled: boolean;
  setAppLockEnabled: (enabled: boolean) => void;
  setPrivacyModeEnabled: (enabled: boolean) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appLockEnabled: false,
      privacyModeEnabled: false,
      _hasHydrated: false,
      setAppLockEnabled: (enabled) => set({ appLockEnabled: enabled }),
      setPrivacyModeEnabled: (enabled) => set({ privacyModeEnabled: enabled }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "pennywise-settings",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
