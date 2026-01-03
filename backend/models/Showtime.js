const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { _id: false });

const ShowtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    startTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seats: [SeatSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Showtime', ShowtimeSchema);
