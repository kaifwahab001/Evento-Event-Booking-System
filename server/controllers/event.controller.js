const Event = require('../models/event.model')

exports.getAllEvents = async (req, res) => {

    try {
        const filters = {}
        if (req.query.category) {
            filters.category = req.query.category
        }
        if (req.query.ticketPrice) {
            filters.ticketPrice = req.query.ticketPrice
        }

        // if(req.query.search){
        //     filters.title = {
        //         $regex: req.query.search, // matching term
        //         $options: 'i' // case sensitive
        //     }
        // }

        const events = await Event.find(filters)
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.createEvent = async (req, res) => {
    const { title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl } = req.body
    try {
        const creatorId = req.user && req.user._id ? req.user._id : req.body.createdBy
        if (!creatorId) return res.status(400).json({ message: 'createdBy is required' })

        const event = await Event.create({ title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl, createdBy: creatorId })
        res.status(201).json(event)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.updateEvent = async (req, res) => {
    const { title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl } = req.body
    try {
        const event = await Event.findByIdAndUpdate(req.params.id,
            { title, description, date, location, category, totalSeats, availableSeats, ticketPrice, imageUrl }, { new: true }
        )

        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.status(200).json({ message: 'Event deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}