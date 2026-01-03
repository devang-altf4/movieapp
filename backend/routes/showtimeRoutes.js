const express = require('express');
const router = express.Router();
const { createShowtime, getShowtimesByMovie } = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/movie/:movieId', getShowtimesByMovie);

// Admin routes
router.route('/')
    .post(protect, admin, createShowtime);

router.route('/:id')
    .delete(protect, admin, require('../controllers/showtimeController').deleteShowtime);

module.exports = router;
