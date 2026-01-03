const express = require('express');
const router = express.Router();
const { createShowtime, getShowtimesByMovie } = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createShowtime);
router.route('/:movieId').get(getShowtimesByMovie);

module.exports = router;
