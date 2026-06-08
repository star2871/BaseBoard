import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Team from './models/Team.js'; 
import Player from './models/Player.js';
import Game from './models/Game.js';

const MY_ATLAS_URI = process.env.MONGO_URI;
if (!MY_ATLAS_URI || MY_ATLAS_URI.includes('<아이디>')) {
  console.error('❌ .env 파일에 올바른 MONGO_URI가 설정되지 않았습니다! MONGO_URI를 확인해주세요.');
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log('🌱 MongoDB 연결 중...');
    await mongoose.connect(MY_ATLAS_URI);
    const isAtlas = MY_ATLAS_URI.includes('mongodb+srv://');
    console.log(`✅ 연결된 데이터베이스: ${isAtlas ? 'MongoDB Atlas (클라우드) ☁️' : '로컬 MongoDB 💻'}`);
    console.log('🗑️ 기존 데이터를 초기화합니다...');

    await Team.deleteMany({});
    await Player.deleteMany({});
    await Game.deleteMany({});

    const teams = await Team.insertMany([
      { name: 'LG Twins', stadium: '잠실야구장', location: { lat: 37.52, lng: 127.05 }, logoUrl: '/images/lg로고.png' },
      { name: 'Doosan Bears', stadium: '잠실야구장', location: { lat: 37.52, lng: 127.05 }, logoUrl: '/images/두산로고.png' },
      { name: 'KIA Tigers', stadium: '광주-기아 챔피언스 필드', location: { lat: 35.14, lng: 126.85 }, logoUrl: '/images/기아로고.png' },
      { name: 'Lotte Giants', stadium: '사직야구장', location: { lat: 35.19, lng: 129.06 }, logoUrl: '/images/롯데로고.png' }
    ]);
    console.log('✅ 팀 데이터 생성 완료');

    const rawPlayers = [
      // LG Twins (21명: 야수 7, 포수 2, 투수 12)
      { name: '홍창기', pos: 'Outfield', fatigue: 45 }, { name: '박해민', pos: 'Outfield', fatigue: 55 },
      { name: '김현수', pos: 'Outfield', fatigue: 88 }, { name: '오스틴', pos: 'Infield', fatigue: 30 },
      { name: '오지환', pos: 'Infield', fatigue: 92 }, { name: '문보경', pos: 'Infield', fatigue: 65 },
      { name: '신민재', pos: 'Infield', fatigue: 50 },
      { name: '박동원', pos: 'Catcher', fatigue: 95 }, { name: '허도환', pos: 'Catcher', fatigue: 45 },
      { name: '임찬규', pos: 'Pitcher', fatigue: 82 }, { name: '엔스', pos: 'Pitcher', fatigue: 40 },
      { name: '유영찬', pos: 'Pitcher', fatigue: 35 }, { name: '정우영', pos: 'Pitcher', fatigue: 40 },
      { name: '백승현', pos: 'Pitcher', fatigue: 20 }, { name: '최동환', pos: 'Pitcher', fatigue: 15 },
      { name: '이지강', pos: 'Pitcher', fatigue: 50 }, { name: '이우찬', pos: 'Pitcher', fatigue: 60 },
      { name: '박명근', pos: 'Pitcher', fatigue: 25 }, { name: '김유영', pos: 'Pitcher', fatigue: 30 },
      { name: '강효종', pos: 'Pitcher', fatigue: 10 }, { name: '함덕주', pos: 'Pitcher', fatigue: 80 },

      // Doosan Bears (21명: 야수 7, 포수 2, 투수 12)
      { name: '정수빈', pos: 'Outfield', fatigue: 45 }, { name: '김재환', pos: 'Outfield', fatigue: 60 },
      { name: '양석환', pos: 'Infield', fatigue: 40 }, { name: '허경민', pos: 'Infield', fatigue: 75 },
      { name: '강승호', pos: 'Infield', fatigue: 85 }, { name: '김재호', pos: 'Infield', fatigue: 30 },
      { name: '조수행', pos: 'Outfield', fatigue: 65 },
      { name: '양의지', pos: 'Catcher', fatigue: 90 }, { name: '장승현', pos: 'Catcher', fatigue: 50 },
      { name: '곽빈', pos: 'Pitcher', fatigue: 88 }, { name: '알칸타라', pos: 'Pitcher', fatigue: 50 },
      { name: '정철원', pos: 'Pitcher', fatigue: 60 }, { name: '홍건희', pos: 'Pitcher', fatigue: 45 },
      { name: '김명신', pos: 'Pitcher', fatigue: 75 }, { name: '박치국', pos: 'Pitcher', fatigue: 30 },
      { name: '이영하', pos: 'Pitcher', fatigue: 55 }, { name: '최승용', pos: 'Pitcher', fatigue: 20 },
      { name: '이병헌', pos: 'Pitcher', fatigue: 40 }, { name: '김유성', pos: 'Pitcher', fatigue: 15 },
      { name: '이형범', pos: 'Pitcher', fatigue: 25 }, { name: '김동주', pos: 'Pitcher', fatigue: 35 },

      // KIA Tigers (21명: 야수 7, 포수 2, 투수 12)
      { name: '김도영', pos: 'Infield', fatigue: 35 }, { name: '최형우', pos: 'Infield', fatigue: 85 },
      { name: '나성범', pos: 'Outfield', fatigue: 70 }, { name: '소크라테스', pos: 'Outfield', fatigue: 55 },
      { name: '김선빈', pos: 'Infield', fatigue: 65 }, { name: '박찬호', pos: 'Infield', fatigue: 94 },
      { name: '이우성', pos: 'Infield', fatigue: 45 },
      { name: '김태군', pos: 'Catcher', fatigue: 88 }, { name: '한승택', pos: 'Catcher', fatigue: 60 },
      { name: '양현종', pos: 'Pitcher', fatigue: 82 }, { name: '네일', pos: 'Pitcher', fatigue: 40 },
      { name: '정해영', pos: 'Pitcher', fatigue: 55 }, { name: '최지민', pos: 'Pitcher', fatigue: 65 },
      { name: '전상현', pos: 'Pitcher', fatigue: 45 }, { name: '장현식', pos: 'Pitcher', fatigue: 70 },
      { name: '이준영', pos: 'Pitcher', fatigue: 30 }, { name: '임기영', pos: 'Pitcher', fatigue: 80 },
      { name: '곽도규', pos: 'Pitcher', fatigue: 25 }, { name: '김대유', pos: 'Pitcher', fatigue: 40 },
      { name: '윤중현', pos: 'Pitcher', fatigue: 20 }, { name: '황동하', pos: 'Pitcher', fatigue: 35 },

      // Lotte Giants (21명: 야수 7, 포수 2, 투수 12)
      { name: '윤동희', pos: 'Outfield', fatigue: 65 }, { name: '고승민', pos: 'Infield', fatigue: 45 },
      { name: '전준우', pos: 'Outfield', fatigue: 95 }, { name: '레이예스', pos: 'Outfield', fatigue: 55 },
      { name: '노진혁', pos: 'Infield', fatigue: 70 }, { name: '정훈', pos: 'Infield', fatigue: 80 },
      { name: '손호영', pos: 'Infield', fatigue: 60 },
      { name: '유강남', pos: 'Catcher', fatigue: 89 }, { name: '정보근', pos: 'Catcher', fatigue: 50 },
      { name: '반즈', pos: 'Pitcher', fatigue: 40 }, { name: '박세웅', pos: 'Pitcher', fatigue: 85 },
      { name: '김원중', pos: 'Pitcher', fatigue: 60 }, { name: '구승민', pos: 'Pitcher', fatigue: 75 },
      { name: '최준용', pos: 'Pitcher', fatigue: 45 }, { name: '김상수', pos: 'Pitcher', fatigue: 55 },
      { name: '진승현', pos: 'Pitcher', fatigue: 20 }, { name: '김진욱', pos: 'Pitcher', fatigue: 40 },
      { name: '나균안', pos: 'Pitcher', fatigue: 80 }, { name: '이인복', pos: 'Pitcher', fatigue: 30 },
      { name: '우강훈', pos: 'Pitcher', fatigue: 25 }, { name: '한현희', pos: 'Pitcher', fatigue: 65 }
    ];

    const playersToInsert = rawPlayers.map((p, index) => {
      let teamId;
      if (index < 21) teamId = teams[0]._id;
      else if (index < 42) teamId = teams[1]._id;
      else if (index < 63) teamId = teams[2]._id;
      else teamId = teams[3]._id;

      let level = 'Low';
      if (p.fatigue >= 85) level = 'Critical';
      else if (p.fatigue >= 65) level = 'High';
      else if (p.fatigue >= 40) level = 'Medium';

      let status = 'Active';
      if (p.fatigue >= 85) status = 'Injured';

      return {
        name: p.name,
        team: teamId,
        position: p.pos,
        fatigueScore: p.fatigue,
        fatigueLevel: level,
        status: status
      };
    });

    await Player.insertMany(playersToInsert);
    console.log(`✅ 선수 데이터(팀당 21명, 총 ${playersToInsert.length}명) 생성 완료`);

    const year = 2026;
    const month = 4; // 5월
    const daysInMay = 31;
    const fakeToday = 15; // 5월 15일 (금) 오늘
    const games = [];

    // KBO 방식 원정/홈 3연전 이동 스케줄 매치업 (팀 인덱스 - 0:LG, 1:두산, 2:KIA, 3:롯데)
    const matchUps = [
      [[0, 2], [3, 1]], // 1-3일: LG(홈) vs KIA, 롯데(홈) vs 두산
      [[1, 0], [2, 3]], // 5-7일: 두산(홈) vs LG, KIA(홈) vs 롯데
      [[3, 0], [2, 1]], // 8-10일: 롯데(홈) vs LG, KIA(홈) vs 두산
      [[0, 3], [1, 2]], // 12-14일: LG(홈) vs 롯데, 두산(홈) vs KIA
      [[2, 0], [1, 3]], // 15-17일: KIA(홈) vs LG, 두산(홈) vs 롯데
      [[0, 1], [3, 2]], // 19-21일: LG(홈) vs 두산, 롯데(홈) vs KIA
      [[1, 0], [3, 2]], // 22-24일: 두산(홈) vs LG, 롯데(홈) vs KIA
      [[0, 2], [1, 3]], // 26-28일: LG(홈) vs KIA, 두산(홈) vs 롯데
      [[2, 1], [3, 0]], // 29-31일: KIA(홈) vs 두산, 롯데(홈) vs LG
    ];

    const getSeriesIndex = (day) => {
      if (day <= 3) return 0;  if (day <= 7) return 1;  if (day <= 10) return 2;
      if (day <= 14) return 3; if (day <= 17) return 4; if (day <= 21) return 5;
      if (day <= 24) return 6; if (day <= 28) return 7; return 8;
    };

    for (let day = 1; day <= daysInMay; day++) {
      const gameDate = new Date(year, month, day, 18, 30, 0); 
      if (gameDate.getDay() === 1) continue;

      const seriesIdx = getSeriesIndex(day);
      const dailyMatches = matchUps[seriesIdx];

      for (const [homeIdx, awayIdx] of dailyMatches) {
        let status = 'Final';
        let homeScore = Math.floor(Math.random() * 8);
        let awayScore = Math.floor(Math.random() * 8);

        if (day < fakeToday) {
          status = 'Final';
          if (homeScore === awayScore) homeScore += 1; 
        } else if (day === fakeToday) {
          status = 'InProgress';
          homeScore = 3; 
          awayScore = 2;
        } else {
          status = 'Scheduled';
          homeScore = 0;
          awayScore = 0;
        }

        games.push({
          date: gameDate,
          homeTeam: teams[homeIdx]._id,
          awayTeam: teams[awayIdx]._id,
          homeScore: homeScore,
          awayScore: awayScore,
          status: status,
          ...(status === 'InProgress' && {
            liveState: { currentInning: '5회말', outs: 1, strikes: 2, balls: 3, baseRunners: { first: true, second: false, third: true } }
          })
        });
      }
    }
    
    await Game.insertMany(games);
    console.log(`✅ 5월 한 달 치 3연전 원정 이동 일정 반영 생성 완료 (총 ${games.length}경기)`);
    console.log('🎉 모든 세팅이 끝났습니다.');
    
    process.exit();
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

seedDatabase();