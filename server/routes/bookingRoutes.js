const express = require('express')

const {
  createBooking,
  getMyBookings,
} =require('../Controllers/bookingController')

const protect = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createBooking)

router.get('/my', protect, getMyBookings)

module.exports = router