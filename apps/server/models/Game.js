import mongoose from 'mongoose';

const gameEventSchema = new mongoose.Schema({
  inning: String, // e.g., "3회초"
  timestamp: { type: Date, default: Date.now },
  description: String,
});

const gameSchema = new mongoose.Schema({
  homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Scheduled', 'InProgress', 'Final'],
    default: 'Scheduled'
  },
  liveState: {
    currentInning: { type: String, default: '1회초' },
    outs: { type: Number, default: 0, min: 0, max: 2 },
    strikes: { type: Number, default: 0, min: 0, max: 2 },
    balls: { type: Number, default: 0, min: 0, max: 3 },
    baseRunners: {
      first: { type: Boolean, default: false },
      second: { type: Boolean, default: false },
      third: { type: Boolean, default: false },
    }
  },
  homeTeamLineup: [{ player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, position: String }],
  awayTeamLineup: [{ player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, position: String }],
  realtimeEvents: [gameEventSchema],
  winProbability: {
    home: Number,
    away: Number,
  }
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);
export default Game;