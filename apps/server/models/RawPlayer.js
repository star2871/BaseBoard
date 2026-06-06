import mongoose from 'mongoose';

// 원본 CSV 데이터는 필드가 유동적이므로 strict: false 설정
const rawPlayerSchema = new mongoose.Schema({}, { strict: false, collection: 'players_raw' });

export default mongoose.models.RawPlayer || mongoose.model('RawPlayer', rawPlayerSchema);