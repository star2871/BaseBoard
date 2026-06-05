import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './db.js';

import playerRoutes from './routes/players.js';
import teamRoutes from './routes/teams.js';
import gameRoutes from './routes/games.js';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"]
  }
});

app.use((req, res, next) => { req.io = io; next(); });

app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/games', gameRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});