// server/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// 모델 불러오기 (프로젝트 실제 경로에 맞게 수정)
import Team from './models/Team.js'; 
import Player from './models/Player.js';
import Game from './models/Game.js';

// 더미 데이터 생성을 위한 헬퍼 함수 (날짜 계산)
const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

async function seedDatabase() {
  try {
    console.log('🌱 MongoDB 연결 중...');
    
    // .env 파일에서 MONGO_URI 가져오기 (클라우드 Atlas 연결)
    const MY_ATLAS_URI = process.env.MONGO_URI;
    if (!MY_ATLAS_URI || MY_ATLAS_URI.includes('<아이디>')) {
      throw new Error('❌ .env 파일에 올바른 MONGO_URI가 설정되지 않았습니다!');
    }
    await mongoose.connect(MY_ATLAS_URI);
    const isAtlas = MY_ATLAS_URI.includes('mongodb+srv://');
    console.log(`✅ 연결된 데이터베이스: ${isAtlas ? 'MongoDB Atlas (클라우드) ☁️' : '로컬 MongoDB 💻'}`);
    console.log('🗑️ 기존 데이터를 초기화합니다...');

    // 1. 기존 데이터 초기화
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Game.deleteMany({});

    // 2. 팀 데이터 생성
    const teams = await Team.insertMany([
      { name: 'LG Twins', stadium: '잠실야구장', location: { lat: 37.52, lng: 127.05 }, logoUrl: '/images/lg로고.png' },
      { name: 'Doosan Bears', stadium: '잠실야구장', location: { lat: 37.52, lng: 127.05 }, logoUrl: '/images/두산로고.png' },
      { name: 'KIA Tigers', stadium: '광주-기아 챔피언스 필드', location: { lat: 35.14, lng: 126.85 }, logoUrl: '/images/기아로고.png' },
      { name: 'Lotte Giants', stadium: '사직야구장', location: { lat: 35.19, lng: 129.06 }, logoUrl: '/images/롯데로고.png' }
    ]);
    console.log('✅ 팀 데이터 생성 완료');

    // 3. 선수 데이터 생성 (현재 스키마에 맞게 필드명 및 Enum 값 변경)
    const players = await Player.insertMany([
      { name: '정수빈', team: teams[1]._id, position: 'Outfield', fatigueScore: 45, fatigueLevel: 'Medium', status: 'Active' },
      { name: '안치홍', team: teams[0]._id, position: 'Infield', fatigueScore: 82, fatigueLevel: 'High', status: 'Active' },
      { name: '김도영', team: teams[2]._id, position: 'Infield', fatigueScore: 30, fatigueLevel: 'Low', status: 'Active' },
      { name: '전준우', team: teams[3]._id, position: 'Outfield', fatigueScore: 95, fatigueLevel: 'Critical', status: 'Injured' }
    ]);
    console.log('✅ 선수 데이터 생성 완료');

    // 4. 1달 치 경기 데이터 생성 (과거 25일 ~ 미래 5일)
    const games = [];
    for (let i = -25; i <= 5; i++) {
      const gameDate = getRelativeDate(i);
      
      // 스키마에 정의된 상태(Scheduled, InProgress, Final)로 변경
      let status = 'Final';
      let homeScore = Math.floor(Math.random() * 10);
      let awayScore = Math.floor(Math.random() * 10);
      
      if (i === 0) {
        status = 'InProgress';
        homeScore = 2; // 진행 중인 스코어
        awayScore = 1;
      } else if (i > 0) {
        status = 'Scheduled';
        homeScore = 0;
        awayScore = 0;
      }

      games.push({
        date: gameDate,
        homeTeam: i % 2 === 0 ? teams[0]._id : teams[2]._id,
        awayTeam: i % 2 === 0 ? teams[1]._id : teams[3]._id,
        homeScore: homeScore,
        awayScore: awayScore,
        status: status,
        // 실시간(InProgress)일 경우 앱 화면에 보일 라이브 상태 부여
        ...(status === 'InProgress' && {
          liveState: {
            currentInning: '4회말',
            outs: 2, strikes: 1, balls: 2,
            baseRunners: { first: true, second: true, third: false }
          }
        })
      });
    }
    
    await Game.insertMany(games);
    console.log('✅ 1달 치 경기 일정(과거/현재/미래) 생성 완료');

    // 5. (선택 사항) 피로도 로그(History)가 스키마에 있다면 여기서 추가...
    
    console.log('🎉 모든 테스트 데이터 세팅이 완료되었습니다!');
    process.exit();

  } catch (error) {
    console.error('❌ 데이터 생성 중 에러 발생:', error);
    process.exit(1);
  }
}

seedDatabase();