import express from 'express';
import Game from '../models/Game.js';

const router = express.Router();

// @desc    Fetch the current live game
// @route   GET /api/games/live
// @access  Public
router.get('/live', async (req, res) => {
  try {
    const liveGame = await Game.findOne({ status: 'InProgress' })
      .populate('homeTeam', 'name logoUrl')
      .populate('awayTeam', 'name logoUrl');

    if (liveGame) {
      res.json(liveGame);
    } else {
      res.status(404).json({ message: 'No live games currently in progress.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch the next scheduled game
// @route   GET /api/games/next
// @access  Public
router.get('/next', async (req, res) => {
  try {
    const nextGame = await Game.findOne({ status: 'Scheduled' })
      .sort({ date: 1 })
      .populate('homeTeam', 'name logoUrl')
      .populate('awayTeam', 'name logoUrl');

    if (nextGame) {
      res.json(nextGame);
    } else {
      res.status(404).json({ message: 'No upcoming games scheduled.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch upcoming scheduled games
// @route   GET /api/games/upcoming
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const upcomingGames = await Game.find({ status: 'Scheduled' })
      .sort({ date: 1 })
      .limit(10)
      .populate('homeTeam', 'name logoUrl stadium location')
      .populate('awayTeam', 'name logoUrl stadium location');

    res.json(upcomingGames);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update live game state
// @route   PUT /api/games/:id/live
// @access  Private (for now, public)
router.put('/:id/live', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.status === 'Scheduled') {
      game.status = 'InProgress';
    }

    // Merge nested liveState object
    game.liveState = { ...game.liveState, ...req.body };

    await game.save();

    const updatedGame = await Game.findById(game._id)
      .populate('homeTeam', 'name logoUrl')
      .populate('awayTeam', 'name logoUrl');

    if (req.io) {
      req.io.emit('game:live:updated', updatedGame);
    }

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch all games
// @route   GET /api/games
// @access  Public
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({})
      .populate('homeTeam', 'name logoUrl')
      .populate('awayTeam', 'name logoUrl');
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;