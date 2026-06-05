import { create } from 'zustand';

const usePlayerStore = create((set) => ({
  players: [],
  loading: false,
  error: null,
  fetchPlayers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/players');
      if (!res.ok) throw new Error('Failed to fetch players');
      const data = await res.json();
      set({ players: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  updatePlayerFatigue: (updatedPlayer) => {
    set((state) => ({
      players: state.players.map((player) =>
        player._id === updatedPlayer._id ? { ...player, ...updatedPlayer } : player
      ),
    }));
  },
}));

export default usePlayerStore;