import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logoUrl: { type: String },
  stadium: { type: String },
  location: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;