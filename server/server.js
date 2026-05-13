const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth.route')
const eventRouter = require('./routes/event.route')
const bookingRouter = require('./routes/booking.route')

dotenv.config()

// Prefer IPv4 when resolving DNS to avoid ENETUNREACH errors on hosts without IPv6
try {
    const dns = require('dns')
    if (typeof dns.setDefaultResultOrder === 'function') {
        dns.setDefaultResultOrder('ipv4first')
    }
} catch (e) {
    // ignore if not supported
}

const app = express()

// Configure CORS to allow requests only from the client origin (strict)
const allowedOrigin = process.env.CLIENT_URL
const corsOptions = {
    origin: (origin, callback) => {
        if (!allowedOrigin) {
            // if no CLIENT_URL is set, fall back to rejecting cross-origins
            return callback(new Error('CLIENT_URL is not configured'))
        }
        if (origin === allowedOrigin) return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204,
}

app.use((req, res, next) => {
    // explicitly handle preflight so errors are clearer
    cors(corsOptions)(req, res, (err) => {
        if (err) return res.status(403).json({ error: 'CORS blocked: origin not allowed' })
        next()
    })
})

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
