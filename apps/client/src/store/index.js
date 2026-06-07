import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

import playerRoutes from './routes/players.js';
import teamRoutes from './routes/teams.js';
import gameRoutes from './routes/games.js';

import Game from './models/Game.js';
import Player from './models/Player.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { calculateFatigue, getFatigueLevel } from '../../packages/fatigue-engine/index.js';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // 배포된 프론트엔드 URL을 허용합니다. 개발 환경을 위해 localhost도 포함합니다.
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT"]
  }
});

app.use((req, res, next) => { req.io = io; next(); });

// 프론트엔드 빌드 파일 서빙
app.use(express.static(path.join(__dirname, '../client/dist')));

// API 라우트
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/games', gameRoutes);

const startSimulation = async () => {
  console.log('🚀 Starting real-time simulation engine...');
  
  setInterval(async () => {
    try {
      // 1. Simulate Live Game
      const liveGame = await Game.findOne({ status: 'InProgress' });
      if (liveGame) {
        const updateType = Math.random();
        if (updateType < 0.4) {
          liveGame.liveState.balls = Math.min(3, liveGame.liveState.balls + (Math.random() > 0.5 ? 1 : -1));
          liveGame.liveState.strikes = Math.min(2, liveGame.liveState.strikes + (Math.random() > 0.5 ? 1 : -1));
          liveGame.liveState.outs = Math.min(2, liveGame.liveState.outs + (Math.random() > 0.5 ? 1 : -1));
          if (liveGame.liveState.balls < 0) liveGame.liveState.balls = 0;
          if (liveGame.liveState.strikes < 0) liveGame.liveState.strikes = 0;
          if (liveGame.liveState.outs < 0) liveGame.liveState.outs = 0;
        } else if (updateType < 0.7) {
          const isHome = Math.random() > 0.5;
          if (isHome) liveGame.homeScore += 1; else liveGame.awayScore += 1;
          const events = ['단타!', '2루타!', '3루타!', '홈런!!!', '희생플라이'];
          const event = events[Math.floor(Math.random() * events.length)];
          liveGame.realtimeEvents.push({
            inning: liveGame.liveState.currentInning,
            description: `${event} 발생! 점수가 업데이트 되었습니다.`,
            timestamp: new Date()
          });
          if (liveGame.realtimeEvents.length > 20) liveGame.realtimeEvents.shift();
        }
        
        await liveGame.save();
        const populatedGame = await Game.findById(liveGame._id)
          .populate('homeTeam', 'name logoUrl')
          .populate('awayTeam', 'name logoUrl');
        io.emit('game:live:updated', populatedGame);
      }

      // 2. Simulate Player Fatigue
      const players = await Player.find({});
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      if (randomPlayer) {
        const activities = ['high_intensity', 'medium_intensity', 'low_intensity'];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const addedFatigue = calculateFatigue(randomPlayer.position, activity);
        randomPlayer.fatigueScore = Math.min(100, (randomPlayer.fatigueScore || 0) + addedFatigue);
        randomPlayer.fatigueLevel = getFatigueLevel(randomPlayer.fatigueScore);
        const updatedPlayer = await randomPlayer.save();
        io.emit('player:fatigue:updated', updatedPlayer);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    }
  }, 5000);
};

// 모든 라우트가 아닌 요청에 대해 index.html 반환 (React 라우팅 처리)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  startSimulation();
});
