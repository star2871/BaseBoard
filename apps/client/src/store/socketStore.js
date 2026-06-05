import { create } from 'zustand';
import io from 'socket.io-client';
import usePlayerStore from './playerStore';
import useGameStore from './gameStore';

const useSocketStore = create((set, get) => ({
  socket: null,
  connect: () => {
    if (get().socket) return;

    const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:4000');

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      set({ socket });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ socket: null });
    });

    socket.on('player:fatigue:updated', (player) => {
      console.log('Global listener received fatigue update:', player);
      usePlayerStore.getState().updatePlayerFatigue(player);
    });

    // Add listener for live game updates
    socket.on('game:live:updated', (game) => {
      console.log('Global listener received live game update:', game);
      useGameStore.getState().updateLiveGame(game);
    });
  },
  disconnect: () => {
    get().socket?.disconnect();
  },
}));

export default useSocketStore;