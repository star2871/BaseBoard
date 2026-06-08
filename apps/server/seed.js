import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Game from './models/Game.js';
import Player from './models/Player.js';
import Team from './models/Team.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the current directory of this script
dotenv.config({ path: path.join(__dirname, '.env') });

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file. Please check apps/server/.env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const isAtlas = process.env.MONGO_URI.includes('mongodb+srv://');
    console.log(`✅ Connected to ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'} for seeding...`);

    // Clear existing data to avoid duplicates
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Game.deleteMany({});

    const teamsData = [
      { name: 'LG 트윈스', logoUrl: '/images/lg로고.png', stadium: '잠실 야구장', location: { lat: 37.52, lng: 127.05 } },
      { name: '삼성 라이온즈', logoUrl: '/images/samsung.png', stadium: '대구 삼성 라이온즈 파크', location: { lat: 35.86, lng: 128.62 } },
      { name: 'KIA 타이거즈', logoUrl: '/images/기아로고.png', stadium: '광주 기아 챔피언스 필드', location: { lat: 35.14, lng: 126.85 } },
      { name: '두산 베어스', logoUrl: '/images/두산로고.png', stadium: '잠실 야구장', location: { lat: 37.52, lng: 127.05 } },
      { name: 'SSG 랜더스', logoUrl: '/images/ssg.png', stadium: '문학 경기장', location: { lat: 37.43, lng: 126.67 } },
    ];

    console.log('Seeding teams...');
    const createdTeams = await Team.insertMany(teamsData);
    
    const positions = ['Pitcher', 'Catcher', 'Infield', 'Outfield'];
    const fatigueLevels = ['Low', 'Medium', 'High', 'Critical'];
    
    console.log('Parsing CSV and seeding players...');
    const csvFilePath = path.join(__dirname, '../../docs/kbo_dataset_kr_fixed.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    const playersMap = new Map();

    // 첫 줄(헤더) 무시하고 순회
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const id = values[0];
      const name = values[1];
      const year = parseInt(values[2], 10);
      
      const stats = {
        year,
        atBats: parseInt(values[3], 10) || 0,
        hits: parseInt(values[4], 10) || 0,
        homeRuns: parseInt(values[5], 10) || 0,
        walks: parseInt(values[6], 10) || 0,
        strikeOuts: parseInt(values[7], 10) || 0,
        rbi: parseInt(values[8], 10) || 0,
        stolenBases: parseInt(values[9], 10) || 0,
        avg: parseFloat(values[10]) || 0,
        obp: parseFloat(values[11]) || 0,
        slg: parseFloat(values[12]) || 0,
        ops: parseFloat(values[13]) || 0,
      };

      // 동일한 선수의 데이터가 없거나, 현재 읽은 데이터의 연도가 더 최신인 경우 갱신
      if (!playersMap.has(id) || playersMap.get(id).stats.year < year) {
        playersMap.set(id, { name, stats });
      }
    }

    const playersToInsert = [];
    for (const [id, data] of playersMap.entries()) {
      const randomTeam = createdTeams[Math.floor(Math.random() * createdTeams.length)];
      playersToInsert.push({
        name: data.name,
        team: randomTeam._id,
        position: positions[Math.floor(Math.random() * positions.length)],
        kpi: {
          avg: data.stats.avg,
          era: parseFloat((Math.random() * (5.00 - 2.00) + 2.00).toFixed(2)), // 타자 데이터이므로 투수용 방어율은 임의값
          homeRuns: data.stats.homeRuns,
          ops: data.stats.ops
        },
        fatigueScore: Math.floor(Math.random() * 100),
        fatigueLevel: fatigueLevels[Math.floor(Math.random() * fatigueLevels.length)],
        status: 'Active',
        fatigueHistory: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          score: Math.floor(Math.random() * 100),
        })),
      });
    }
    await Player.insertMany(playersToInsert);
    console.log(`Seeded ${playersToInsert.length} players from real CSV data.`);

    console.log('Seeding games...');
    for (let i = 0; i < 10; i++) {
      const randomTeams = createdTeams.sort(() => 0.5 - Math.random()).slice(0, 2);
      await Game.create({
        homeTeam: randomTeams[0]._id,
        awayTeam: randomTeams[1]._id,
        homeScore: Math.floor(Math.random() * 15),
        awayScore: Math.floor(Math.random() * 15),
        date: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        status: 'Final',
      });
    }

    const liveTeams = createdTeams.sort(() => 0.5 - Math.random()).slice(0, 2);
    const homeTeam = liveTeams[0];
    const awayTeam = liveTeams[1];

    const allPlayers = await Player.find({});
    const homeLineup = allPlayers.filter(p => p.team.toString() === homeTeam._id.toString()).slice(0, 9).map(p => ({ player: p._id, position: 'Pos' }));
    const awayLineup = allPlayers.filter(p => p.team.toString() === awayTeam._id.toString()).slice(0, 9).map(p => ({ player: p._id, position: 'Pos' }));

    await Game.create({
      homeTeam: homeTeam._id,
      awayTeam: awayTeam._id,
      homeScore: 0,
      awayScore: 0,
      date: new Date(),
      status: 'InProgress',
      liveState: {
        currentInning: '1회초',
        outs: 0,
        strikes: 0,
        balls: 0,
        baseRunners: { first: false, second: false, third: false },
      },
      homeTeamLineup: homeLineup,
      awayTeamLineup: awayLineup,
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
