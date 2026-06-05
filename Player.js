import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  position: { type: String, required: true },
  // KPI - Key Performance Indicators
  kpi: {
    avg: Number, // 타율
    era: Number, // 평균자책점
  },
  fatigueScore: { type: Number, default: 0 },
  fatigueLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  status: {
    type: String,
    enum: ['Active', 'Injured', 'Resting'],
    default: 'Active'
  },
  fatigueHistory: [{
    date: { type: Date, default: Date.now },
    score: Number,
  }],
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);
export default Player;