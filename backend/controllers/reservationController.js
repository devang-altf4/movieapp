const Reservation = require('../models/Reservation');
const Showtime = require('../models/Showtime');

// @desc Create reservation
// @route POST /api/reservations
// @access Private
const createReservation = async (req, res) => {
    const { showtimeId, seats } = req.body; // seats: ["A1", "A2"]

    try {
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ message: 'Showtime not found' });
        }

        // Check availability
        const available = showtime.seats.filter(s => seats.includes(s.seatNumber) && !s.isBooked);
        if (available.length !== seats.length) {
            return res.status(400).json({ message: 'Some seats are already booked' });
        }

        // Book seats
        // Note: This is not fully atomic in this simple implementation but suffices for basic logic
        // For production, use transactions or bulkWrite with optimistic locking
        for (let seatNum of seats) {
            const seatIndex = showtime.seats.findIndex(s => s.seatNumber === seatNum);
            showtime.seats[seatIndex].isBooked = true;
            showtime.seats[seatIndex].reservedBy = req.user._id;
        }
        await showtime.save();

        const reservation = new Reservation({
            user: req.user._id,
            showtime: showtimeId,
            seats,
            totalPrice: showtime.price * seats.length
        });

        const createdReservation = await reservation.save();
        res.status(201).json(createdReservation);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Get user reservations
// @route GET /api/reservations/my
// @access Private
const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id }).populate({
            path: 'showtime',
            populate: { path: 'movie', select: 'title' }
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all reservations (Admin)
// @route GET /api/reservations
// @access Private/Admin
const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({}).populate('user', 'name email').populate({
            path: 'showtime',
            populate: { path: 'movie', select: 'title' }
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReservation, getMyReservations, getReservations };
