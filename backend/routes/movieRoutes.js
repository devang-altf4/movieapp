const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, createMovie } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getMovies).post(protect, admin, createMovie);
router.route('/:id')
    .get(getMovieById)
    .put(protect, admin, require('../controllers/movieController').updateMovie)
    .delete(protect, admin, require('../controllers/movieController').deleteMovie);

module.exports = router;
