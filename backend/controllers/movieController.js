const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

// @desc Get all movies
// @route GET /api/movies
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single movie
// @route GET /api/movies/:id
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a movie with showtimes
// @route POST /api/movies
// @access Private/Admin
const createMovie = async (req, res) => {
    const { title, description, genre, posterUrl, duration, showtimes } = req.body;

    try {
        // 1. Create the Movie
        const createdMovie = await Movie.create({ title, description, genre, posterUrl, duration });

        // 2. Create Showtimes if provided
        if (showtimes && Array.isArray(showtimes) && showtimes.length > 0) {
            // Generate default seats A1..E10
            const rows = ['A', 'B', 'C', 'D', 'E'];
            const defaultSeats = [];
            rows.forEach(row => {
                for (let i = 1; i <= 10; i++) {
                    defaultSeats.push({ seatNumber: `${row}${i}`, isBooked: false });
                }
            });

            const showtimeDocs = showtimes.map(st => ({
                movie: createdMovie._id,
                startTime: st.startTime,
                price: st.price,
                seats: defaultSeats
            }));

            await Showtime.insertMany(showtimeDocs);
        }

        res.status(201).json(createdMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getMovies, getMovieById, createMovie };
