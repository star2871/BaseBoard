// apps/server/importRaw.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 명시적으로 apps/server/.env 파일을 읽어오도록 경로 설정
dotenv.config({ path: path.join(__dirname, '.env') });

const csvFilePath = path.join(__dirname, '../../docs/kbo_dataset_kr_fixed.csv');

// 스키마 제한 없이(strict: false) 원본 그대로 들어갈 수 있도록 설정
const rawPlayerSchema = new mongoose.Schema({}, { strict: false, collection: 'players_raw' });
const RawPlayer = mongoose.model('RawPlayer', rawPlayerSchema);

async function importCsvToMongo() {
  try {
    // .env 파일에서 MONGO_URI 환경변수 가져오기
    const MY_ATLAS_URI = process.env.MONGO_URI;

    if (!MY_ATLAS_URI || MY_ATLAS_URI.includes('<아이디>')) {
      throw new Error('❌ .env 파일에 올바른 MONGO_URI가 설정되지 않았습니다!');
    }
    await mongoose.connect(MY_ATLAS_URI);
    
    const isAtlas = MY_ATLAS_URI.includes('mongodb+srv://');
    console.log(`✅ 연결된 데이터베이스: ${isAtlas ? 'MongoDB Atlas (클라우드) ☁️' : '로컬 MongoDB 💻'}`);

    const csvData = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');

    const docsToInsert = [];

    // 1번째 줄(데이터)부터 순회
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const doc = {};
      
      headers.forEach((header, index) => {
        const val = values[index]?.trim();
        // 숫자로 변환 가능한 건 숫자로, 아니면 문자열로 저장
        doc[header.trim()] = isNaN(Number(val)) || val === '' ? val : Number(val);
      });
      docsToInsert.push(doc);
    }

    await RawPlayer.deleteMany({}); // 기존 데이터 초기화
    await RawPlayer.insertMany(docsToInsert);
    
    console.log(`🎉 성공적으로 ${docsToInsert.length}개의 원본 데이터를 넣었습니다!`);
  } catch (error) {
    console.error('❌ 임포트 에러:', error);
  } finally {
    mongoose.disconnect();
  }
}

importCsvToMongo();
