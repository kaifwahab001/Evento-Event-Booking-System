const express = require('express')
const bookingRouter = express.Router()


const {protect, admin} = require('../middlewares/auth.middleware')
const { bookEvent, sendBookingOTP, getMyBookings, confirmBooking, cancelBooking } = require('../controllers/booking.controller')


bookingRouter.post('/send-otp', protect, sendBookingOTP)
bookingRouter.post('/', protect, bookEvent)
bookingRouter.put('/:id/confirm', protect, admin, confirmBooking)
bookingRouter.get('/my', protect, getMyBookings)
bookingRouter.delete('/:id', protect, cancelBooking)


module.exports = bookingRouter