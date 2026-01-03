const Showtime = require('../models/Showtime');

// @desc Create a showtime
// @route POST /api/showtimes
// @access Private/Admin
// @desc Create a showtime
// @route POST /api/showtimes
// @access Private/Admin
const createShowtime = async (req, res) => {
    const { movieId, startTime, price, seatLayout } = req.body;

    let seats = [];
    if (seatLayout && seatLayout.length > 0) {
        seats = seatLayout.map(seat => ({ seatNumber: seat, isBooked: false }));
    } else {
        // Default rows A-E, 1-10
        const rows = ['A', 'B', 'C', 'D', 'E'];
        rows.forEach(row => {
            for (let i = 1; i <= 10; i++) {
                seats.push({ seatNumber: `${row}${i}`, isBooked: false });
            }
        });
    }

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

// @desc Delete a showtime
// @route DELETE /api/showtimes/:id
// @access Private/Admin
const deleteShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id);
        if (showtime) {
            await Showtime.deleteOne({ _id: showtime._id });
            res.json({ message: 'Showtime removed' });
        } else {
            res.status(404).json({ message: 'Showtime not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createShowtime, getShowtimesByMovie, deleteShowtime };
