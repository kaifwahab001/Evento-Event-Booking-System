const express = require('express')
const { registerUser, loginUser, verifyOtp } = require('../controllers/auth.controller')
const { missingBody } = require('../middlewares/MissingBody.middleware')

const authRouter = express.Router()

authRouter.post('/register',missingBody, registerUser)
authRouter.post('/login',missingBody ,loginUser)
authRouter.post('/verify-otp',missingBody, verifyOtp)


module.exports = authRouter