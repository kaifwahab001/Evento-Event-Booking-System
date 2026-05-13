const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs')
const {     sendOTPEmail } = require("../utils/email")
const otpModel = require("../models/OTP.model")
const jwt = require('jsonwebtoken')

// generate jwt token 
const generatetToke = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}



exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' })
        }

        let useExist = await userModel.findOne({ email })
        if (useExist) {
            return res.status(400).json({ error: 'User already exist' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = await userModel.create({ name, email, password: hashPassword, role: 'user', isVerified: false })
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        await otpModel.create({ email, otp, action: 'account_verification', })
        await sendOTPEmail(email, otp, 'account_verification')

        res.status(201).json({
            message: 'User registerd successfully. Please check your email for otp to verify the account',
            email: user.email
        })
    } catch (error) {
        console.log('Register error:', error)
        res.status(400).json({ error: error.message })
    }
}



exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentails, Please Sign Up first' })
        }

        if (!user.password) {
            return res.status(500).json({ error: 'User account data is corrupted. Please register again.' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentails' })
        }

        if (!user.isVerified && user.role === 'user') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            await otpModel.deleteMany({ email, action: 'account_verification' })
            await otpModel.create({ email, otp, action: 'account_verification' })
            await sendOTPEmail(email, otp, 'account_verification')

            return res.status(400).json({
                message: 'Account not verified. Another OTP has been sent to your email.',
                email: user.email   
            })
        }

        res.json({
            message: 'Login successfull',
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generatetToke(user._id, user.role)
        })
    } catch (error) {
        console.log('Login error:', error)
        res.status(500).json({ error: error.message })
    }
}



exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const onRecord = await otpModel.findOne({ email, otp, action: 'account_verification' })
        if (!onRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' })
        }

        const user = await userModel.findOneAndUpdate({ email }, { isVerified: true }, { new: true })
        await otpModel.deleteMany({ email, action: 'account_verification' })
        res.json({
            message: 'Account verified successfully. You can now log in.',
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generatetToke(user._id, user.role)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
