const express = require('express');
const router = express.Router();
const { createReservation, getMyReservations, getReservations } = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReservation).get(protect, admin, getReservations);
router.route('/my').get(protect, getMyReservations);

module.exports = router;
