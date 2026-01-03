const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, createMovie } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getMovies).post(protect, admin, createMovie);
router.route('/:id').get(getMovieById);

module.exports = router;
