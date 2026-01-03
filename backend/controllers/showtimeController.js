const Showtime = require('../models/Showtime');

// @desc Create a showtime
// @route POST /api/showtimes
// @access Private/Admin
const createShowtime = async (req, res) => {
    const { movieId, startTime, price, seatLayout } = req.body;
    // seatLayout could be ["A1", "A2"...] for simplicity in init

    const seats = seatLayout.map(seat => ({ seatNumber: seat, isBooked: false }));

    try {
        const showtime = new Showtime({
            movie: movieId,
            startTime,
            price,
            seats
        });
        const createdShowtime = await showtime.save();
        res.status(201).json(createdShowtime);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get showtimes for a movie
// @route GET /api/showtimes/:movieId
const getShowtimesByMovie = async (req, res) => {
    try {
        const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('movie', 'title');
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createShowtime, getShowtimesByMovie };
