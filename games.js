import express from 'express';
import Game from '../models/Game.js';

const router = express.Router();

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

    const updatedGame = await game.save();

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