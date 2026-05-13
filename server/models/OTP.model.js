const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({
    email : {
        type :String,
        required : true
    },
    otp : {
        type :String,
        required : true
    },
    action :{
        type : String,
        enum : ['account_verification','event_booking'],
        required : true
    },
    created_at : {
        type : Date,
        default : Date.now,
        expires : 300 // expire after minutes    
    }
})

const otpModel = mongoose.models.OTP || mongoose.model('OTP', otpSchema)

module.exports = otpModel
