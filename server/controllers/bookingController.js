const Booking = require('../models/Booking')
const Property = require('../models/Property')

// Create booking
const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
    } = req.body

    if (!propertyId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: 'Please provide all booking details',
      })
    }

    const property = await Property.findById(propertyId)

    if (!property) {
      return res.status(404).json({
        message: 'Property not found',
      })
    }

    if (Number(guests) > property.guests) {
      return res.status(400).json({
        message: `This property allows maximum ${property.guests} guests`,
      })
    }

    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)

    if (endDate <= startDate) {
      return res.status(400).json({
        message: 'Check-out must be after check-in',
      })
    }

    const existingBooking = await Booking.findOne({
      property: propertyId,
      status: { $ne: 'cancelled' },
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    })

    if (existingBooking) {
      return res.status(400).json({
        message: 'Property is already booked for these dates',
      })
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24

    const nights = Math.ceil(
      (endDate - startDate) / millisecondsPerDay
    )

    const totalPrice = nights * property.price

    const booking = await Booking.create({
      property: propertyId,
      user: req.user,
      checkIn: startDate,
      checkOut: endDate,
      guests: Number(guests),
      totalPrice,
    })

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    })
  } catch (error) {
    console.error('Create booking error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user,
    })
      .populate('property')
      .sort({ createdAt: -1 })

    res.status(200).json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error.message)

    res.status(500).json({
      message: 'Server error',
    })
  }
}

module.exports = {
  createBooking,
  getMyBookings,
}