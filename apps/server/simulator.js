import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import Game from './models/Game.js';
import Player from './models/Player.js';
import { calculateFatigue, getFatigueLevel } from '../../packages/fatigue-engine/index.js'; 
import http from 'http';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const runSimulation = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file. Please check apps/server/.env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Simulator connected to MongoDB...');

    while (true) {
      // 1. Simulate a Live Game update
      const liveGame = await Game.findOne({ status: 'InProgress' });
      if (liveGame) {
        const updateType = Math.random();
        
        if (updateType < 0.4) { // Update BSO/Runners
          liveGame.liveState.balls = Math.min(3, liveGame.liveState.balls + (Math.random() > 0.5 ? 1 : -1));
          liveGame.liveState.strikes = Math.min(2, liveGame.liveState.strikes + (Math.random() > 0.5 ? 1 : -1));
          liveGame.liveState.outs = Math.min(2, liveGame.liveState.outs + (Math.random() > 0.5 ? 1 : -1));
          if (liveGame.liveState.balls < 0) liveGame.liveState.balls = 0;
          if (liveGame.liveState.strikes < 0) liveGame.liveState.strikes = 0;
          if (liveGame.liveState.outs < 0) liveGame.liveState.outs = 0;
        } else if (updateType < 0.7) { // Random hit/score
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
        } else { // Inning change
          liveGame.liveState.currentInning = '2회초'; // Simplified
          liveGame.liveState.outs = 0;
          liveGame.liveState.strikes = 0;
          liveGame.liveState.balls = 0;
        }
        
        await liveGame.save();
        const populatedGame = await Game.findById(liveGame._id)
          .populate('homeTeam', 'name logoUrl')
          .populate('awayTeam', 'name logoUrl');
        io.emit('game:live:updated', populatedGame);
        console.log(`Game Updated: ${liveGame.homeScore} : ${liveGame.awayScore}`);
      }

      // 2. Simulate Player Fatigue update
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
        console.log(`Player Fatigue Updated: ${updatedPlayer.name} -> ${updatedPlayer.fatigueLevel}`);
      }

      await new Promise(resolve => setTimeout(resolve, 5000)); // Every 5 seconds
    }
  } catch (error) {
    console.error('Simulation error:', error);
  }
};

server.listen(4001, () => {
  console.log('Simulator running on port 4001...');
  runSimulation();
});
