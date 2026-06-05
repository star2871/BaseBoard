import { create } from 'zustand';

const useGameStore = create((set) => ({
  liveGame: null,
  allGames: [],
  
  setLiveGame: (game) => set({ liveGame: game }),
  updateLiveGame: (game) => set((state) => ({ 
    liveGame: game,
    allGames: state.allGames.map(g => g._id === game._id ? game : g)
  })),
  setAllGames: (games) => set({ allGames: games }),
}));

export default useGameStore;
