const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

// use authentication middleware for protected routes
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, token is missing' })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'Not authenticated. User not found' })
        }
        req.user = user
        return next()
    } catch (error) {
        console.log('Auth verify error:', error && error.message)
        return res.status(401).json({ message: 'Not authorized, token invalid or expired' })
    }
}

// admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next()
    }
    return res.status(403).json({ message: 'Forbidden, you do not have permission to access this resource' })
}

module.exports = { protect, admin }