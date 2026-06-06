import express from 'express';
import Player from '../models/Player.js';
import Game from '../models/Game.js';
import RawPlayer from '../models/RawPlayer.js';
import { calculateFatigue, getFatigueLevel } from '../../../packages/fatigue-engine/index.js';

const router = express.Router();

// @desc    Fetch all players
// @route   GET /api/players
// @access  Public
router.get('/', async (req, res) => {
  try {
    const players = await Player.find({}).populate('team', 'name logoUrl');
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Search raw players (원본 CSV 데이터 검색)
// @route   GET /api/players/raw/search
// @access  Public
router.get('/raw/search', async (req, res) => {
  try {
    const query = req.query.q;
    let filter = {};
    if (query) {
      // '선수명' 필드에서 텍스트가 포함된 데이터 검색
      filter = { '선수명': { $regex: query, $options: 'i' } };
    }
    // 화면 과부하 방지를 위해 최대 100개까지만 반환
    const players = await RawPlayer.find(filter).limit(100);
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch single player
// @route   GET /api/players/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).populate('team');
        if (player) {
            res.json(player);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update player fatigue
// @route   POST /api/players/:id/fatigue
// @access  Private (for now, public)
router.post('/:id/fatigue', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (player) {
            const { activity } = req.body;
            if (!activity) {
                return res.status(400).json({ message: 'Activity data is required' });
            }

            const addedFatigue = calculateFatigue(player.position, activity);
            player.fatigueScore = Math.min(100, (player.fatigueScore || 0) + addedFatigue);
            player.fatigueLevel = getFatigueLevel(player.fatigueScore);

            player.fatigueHistory.push({ score: player.fatigueScore, date: new Date() });
            if (player.fatigueHistory.length > 20) {
                player.fatigueHistory.shift();
            }

            const updatedPlayer = await player.save();

            if (req.io) {
                req.io.emit('player:fatigue:updated', updatedPlayer);
            }

            res.json(updatedPlayer);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Fetch recent games for a player
// @route   GET /api/players/:id/games
// @access  Public
router.get('/:id/games', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const recentGames = await Game.find({
            $or: [{ homeTeam: player.team }, { awayTeam: player.team }],
            status: 'Final'
        })
        .sort({ date: -1 })
        .limit(5)
        .populate('homeTeam', 'name')
        .populate('awayTeam', 'name')
        .populate('homeTeamLineup.player', 'name position')
        .populate('awayTeamLineup.player', 'name position');

        res.json(recentGames);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;