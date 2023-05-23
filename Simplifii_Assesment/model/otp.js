const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    otp : {
        type : Number,
        unique : true,
        required : true
    }
}, {timestamps : true});


const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;
