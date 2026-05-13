const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth.route')
const eventRouter = require('./routes/event.route')
const bookingRouter = require('./routes/booking.route')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())


// Return a friendly error when JSON is malformed instead of crashing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload' })
    }
    next()
})


// routes
app.use('/api/auth', authRouter)
app.use('/api/events', eventRouter)
app.use('/api/bookings', bookingRouter)

async function startServer() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined')
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected with MongoDB')

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT)
    })
}

startServer().catch((error) => {
    console.error('Error starting server:', error)
    process.exit(1)
})
