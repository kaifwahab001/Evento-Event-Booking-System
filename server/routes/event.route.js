const express = require('express')

const eventRouter = express.Router()

const { protect, admin } = require('../middlewares/auth.middleware')
const { getAllEvents, deleteEvent, createEvent, updateEvent, getEventById } = require('../controllers/event.controller')

// get all events
eventRouter.get('/', getAllEvents)  

// get by eventid 
eventRouter.get('/:id', getEventById )

// create event (admin only)
eventRouter.post('/', protect, admin, createEvent)

// update event (admin only)
eventRouter.put('/:id', protect, admin, updateEvent)


// delete event (admin only)
eventRouter.delete('/:id', protect, admin, deleteEvent)

module.exports = eventRouter