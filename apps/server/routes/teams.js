import express from 'express';
import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Game from '../models/Game.js';

const router = express.Router();

// @desc    Fetch team rankings
// @route   GET /api/teams/rankings
// @access  Public
router.get('/rankings', async (req, res) => {
  try {
    const teams = await Team.find({});
    const games = await Game.find({ status: 'Final' });

    const teamStats = {};

    teams.forEach(team => {
      teamStats[team._id] = {
        _id: team._id,
        name: team.name,
        logoUrl: team.logoUrl,
        wins: 0,
        losses: 0,
      };
    });

    games.forEach(game => {
      const homeTeamId = game.homeTeam.toString();
      const awayTeamId = game.awayTeam.toString();

      if (game.homeScore > game.awayScore) {
        if (teamStats[homeTeamId]) teamStats[homeTeamId].wins++;
        if (teamStats[awayTeamId]) teamStats[awayTeamId].losses++;
      } else if (game.awayScore > game.homeScore) {
        if (teamStats[awayTeamId]) teamStats[awayTeamId].wins++;
        if (teamStats[homeTeamId]) teamStats[homeTeamId].losses++;
      }
    });

    const rankings = Object.values(teamStats)
      .map(team => ({
        ...team,
        winPercentage: (team.wins + team.losses) > 0 ? (team.wins / (team.wins + team.losses)) : 0,
      }))
      .sort((a, b) => b.winPercentage - a.winPercentage || b.wins - a.wins);

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch recent games for a team
// @route   GET /api/teams/:id/games
// @access  Public
router.get('/:id/games', async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    const recentGames = await Game.find({
        $or: [{ homeTeam: teamId }, { awayTeam: teamId }],
        status: 'Final'
    })
    .sort({ date: -1 })
    .limit(5)
    .populate('homeTeam', 'name')
    .populate('awayTeam', 'name');

    res.json(recentGames);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch single team with its players
// @route   GET /api/teams/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const players = await Player.find({ team: req.params.id }).select('name position status fatigueLevel');

    res.json({ ...team.toObject(), players });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch all teams
// @route   GET /api/teams
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({});
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;