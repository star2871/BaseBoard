import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      userInfo: null,
      login: (userData) => {
        set({ userInfo: {
          _id: userData._id,
          displayName: userData.displayName,
          email: userData.email,
        } });
      },
      logout: () => {
        set({ userInfo: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 때 사용될 고유한 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;