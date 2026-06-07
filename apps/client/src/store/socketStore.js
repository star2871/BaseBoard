import { create } from 'zustand';
import io from 'socket.io-client';
import usePlayerStore from './playerStore';
import useGameStore from './gameStore';

const useSocketStore = create((set, get) => ({
  socket: null,
  connect: (backendUrl) => {
    if (get().socket) return;

    // backendUrl이 제공되지 않으면 현재 윈도우의 오리진을 사용 (동일 도메인 배포 시)
    const url = backendUrl || import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';
    const socket = io(url, {
      transports: ['websocket'],
      upgrade: false,
    });

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